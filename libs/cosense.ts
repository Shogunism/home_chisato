import { cache } from "react";
import { parse, type Block, type Node } from "@progfay/scrapbox-parser";

/**
 * Cosense (旧 Scrapbox) から記事を取得する。
 *
 * 公開ルール（ogurilab.org の cosense-site-kit と同じ考え方）:
 *   - `#publish` が付いたページだけを公開する
 *   - `#draft` / `#private` / `#internal` が付いていたら公開しない
 *   - `#news` → NEWS（/articles）、`#notice` → NOTICE（/notices）
 *   - 日付は `#published/YYYY-MM-DD` があればそれ、なければページの作成日時
 */

export const COSENSE_PROJECT = process.env.COSENSE_PROJECT || "home-chisato";

/** Cosense の更新をサイトに反映する間隔（秒）。ISR の revalidate と揃える */
export const REVALIDATE_SECONDS = 300;

const API_BASE = "https://scrapbox.io/api/pages";
const PUBLISH_TAG = "publish";
const EXCLUDE_TAGS = ["draft", "private", "internal"];
const PUBLISHED_DATE_PREFIX = "published/";

export type Category = "news" | "notice";

/**
 * ブラウザで表示する画像 URL に変換する。scrapbox.io の画像（アップロード
 * ファイル・アイコン）は他サイトから直接表示できないので、
 * app/cosense-image/route.ts を経由させる。Gyazo などはそのまま。
 */
export function displayImageUrl(url: string): string {
  return /^https:\/\/scrapbox\.io\//.test(url)
    ? `/cosense-image?src=${encodeURIComponent(url)}`
    : url;
}

/** 本文に出さない、公開制御用のタグ */
export function isControlTag(tag: string): boolean {
  const t = tag.toLowerCase();
  return (
    t === PUBLISH_TAG ||
    t === "news" ||
    t === "notice" ||
    EXCLUDE_TAGS.includes(t) ||
    t.startsWith(PUBLISHED_DATE_PREFIX)
  );
}

export type CosensePost = {
  /** Cosense のページ ID。URL に使う（タイトル変更に強く、ASCII のみ） */
  id: string;
  title: string;
  category: Category;
  /** ISO 8601 */
  publishedAt: string;
  /** ページ内の最初の画像（一覧のサムネイル用） */
  eyecatch?: { url: string };
  /** タイトル行を除いた本文 */
  blocks: Block[];
};

type ApiPageListItem = { id: string; title: string; created: number };
type ApiPageList = { count: number; pages: ApiPageListItem[] };
type ApiPage = {
  id: string;
  title: string;
  image: string | null;
  created: number;
  lines: { text: string }[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    throw new Error(`Cosense API error ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

async function fetchPageList(): Promise<ApiPageListItem[]> {
  const pages: ApiPageListItem[] = [];
  const limit = 1000;
  for (let skip = 0; ; skip += limit) {
    const data = await fetchJson<ApiPageList>(
      `${API_BASE}/${encodeURIComponent(COSENSE_PROJECT)}?limit=${limit}&skip=${skip}&sort=created`
    );
    pages.push(...data.pages);
    if (data.pages.length === 0 || pages.length >= data.count) break;
  }
  return pages;
}

function fetchPage(title: string): Promise<ApiPage> {
  return fetchJson<ApiPage>(
    `${API_BASE}/${encodeURIComponent(COSENSE_PROJECT)}/${encodeURIComponent(title)}`
  );
}

/** 同時リクエスト数を絞って順に処理する */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

function collectHashTags(nodes: Node[], out: string[]) {
  for (const node of nodes) {
    if (node.type === "hashTag") out.push(node.href);
    else if ("nodes" in node) collectHashTags(node.nodes, out);
  }
}

function hashTagsOf(blocks: Block[]): string[] {
  const tags: string[] = [];
  for (const block of blocks) {
    if (block.type === "line") collectHashTags(block.nodes, tags);
    else if (block.type === "table") {
      for (const row of block.cells) for (const cell of row) collectHashTags(cell, tags);
    }
  }
  return tags;
}

function parsePublishedDate(tags: string[], created: number): string {
  for (const tag of tags) {
    if (!tag.toLowerCase().startsWith(PUBLISHED_DATE_PREFIX)) continue;
    const value = tag.slice(PUBLISHED_DATE_PREFIX.length);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const date = new Date(`${value}T00:00:00+09:00`);
      if (!Number.isNaN(date.getTime())) return date.toISOString();
    }
  }
  return new Date(created * 1000).toISOString();
}

function toPost(page: ApiPage): CosensePost | null {
  const text = page.lines.map((l) => l.text).join("\n");
  const blocks = parse(text);
  const tags = hashTagsOf(blocks).map((t) => t.toLowerCase());

  if (!tags.includes(PUBLISH_TAG)) return null;
  if (tags.some((t) => EXCLUDE_TAGS.includes(t))) return null;

  const category: Category | null = tags.includes("news")
    ? "news"
    : tags.includes("notice")
      ? "notice"
      : null;
  if (!category) return null;

  return {
    id: page.id,
    title: page.title,
    category,
    publishedAt: parsePublishedDate(tags, page.created),
    eyecatch: page.image ? { url: displayImageUrl(page.image) } : undefined,
    blocks: blocks.filter((b) => b.type !== "title"),
  };
}

/** 公開対象の全記事（新しい順）。1 リクエスト内では結果を共有する */
export const getAllPosts = cache(async (): Promise<CosensePost[]> => {
  const list = await fetchPageList();
  const pages = await mapWithConcurrency(list, 6, (item) => fetchPage(item.title));
  return pages
    .map(toPost)
    .filter((p): p is CosensePost => p !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export async function getPosts(category: Category, limit?: number): Promise<CosensePost[]> {
  const posts = (await getAllPosts()).filter((p) => p.category === category);
  return limit === undefined ? posts : posts.slice(0, limit);
}

export async function getPost(category: Category, id: string): Promise<CosensePost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.category === category && p.id === id) ?? null;
}

/** 本文中の [ページ名] リンクを、公開済み記事ならサイト内 URL に解決する */
export async function getLinkResolver(): Promise<(title: string) => string | null> {
  const posts = await getAllPosts();
  const map = new Map<string, string>();
  for (const p of posts) {
    const base = p.category === "news" ? "/articles" : "/notices";
    map.set(normalizeTitle(p.title), `${base}/${p.id}`);
  }
  return (title) => map.get(normalizeTitle(title)) ?? null;
}

function normalizeTitle(title: string): string {
  return title.replace(/_/g, " ").trim().toLowerCase();
}
