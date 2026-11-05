import type { ReactNode } from "react";
import type { Block, Node } from "@progfay/scrapbox-parser";
import { COSENSE_PROJECT, displayImageUrl, isControlTag } from "@/libs/cosense";

/**
 * Cosense の記法をパースした結果（Block[]）を React 要素として描画する。
 * サーバーコンポーネント。HTML 文字列を組み立てないので XSS の心配がない。
 */

type Resolve = (title: string) => string | null;

type Props = {
  blocks: Block[];
  resolveLink: Resolve;
};

export default function CosenseContent({ blocks, resolveLink }: Props) {
  return (
    <div className="cosense-content">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} resolve={resolveLink} />
      ))}
    </div>
  );
}

function indentStyle(indent: number) {
  return indent > 0 ? { marginLeft: `${indent * 1.5}em` } : undefined;
}

function BlockView({ block, resolve }: { block: Block; resolve: Resolve }) {
  switch (block.type) {
    case "title":
      return null;

    case "codeBlock":
      return (
        <div className="cs-code" style={indentStyle(block.indent)}>
          {block.fileName && <div className="cs-code-name">{block.fileName}</div>}
          <pre>
            <code>{block.content}</code>
          </pre>
        </div>
      );

    case "table":
      return (
        <div className="cs-table" style={indentStyle(block.indent)}>
          <table>
            <tbody>
              {block.cells.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <Nodes nodes={cell} resolve={resolve} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "line": {
      const nodes = visibleNodes(block.nodes);
      if (nodes.length === 0) {
        // 制御タグだけの行は丸ごと出さない。もともと空の行は余白として残す
        return block.nodes.length === 0 ? <div className="cs-blank" /> : null;
      }

      const embed = embedFor(nodes);
      if (embed) return <div style={indentStyle(block.indent)}>{embed}</div>;

      const heading = headingFor(nodes);
      if (heading && block.indent === 0) {
        const Tag = heading.level;
        return (
          <Tag className="cs-heading">
            <Nodes nodes={heading.nodes} resolve={resolve} />
          </Tag>
        );
      }

      return (
        <div
          className={block.indent > 0 ? "cs-line cs-li" : "cs-line"}
          style={indentStyle(block.indent)}
        >
          <Nodes nodes={nodes} resolve={resolve} />
        </div>
      );
    }
  }
}

/** 制御タグ（#publish など）と、それに挟まれた空白を除く */
function visibleNodes(nodes: Node[]): Node[] {
  const filtered = nodes.filter((n) => !(n.type === "hashTag" && isControlTag(n.href)));
  const hasContent = filtered.some((n) => !(n.type === "plain" && n.text.trim() === "") && n.type !== "blank");
  return hasContent ? filtered : [];
}

/** 行全体が [*** 見出し] のとき見出しとして扱う */
function headingFor(nodes: Node[]): { level: "h2" | "h3" | "h4"; nodes: Node[] } | null {
  const meaningful = nodes.filter((n) => !(n.type === "plain" && n.text.trim() === ""));
  if (meaningful.length !== 1) return null;
  const node = meaningful[0];
  if (node.type !== "decoration") return null;
  const star = node.decos.find((d) => d.startsWith("*-"));
  if (!star) return null;
  const n = Number(star.slice(2));
  if (n >= 4) return { level: "h2", nodes: node.nodes };
  if (n === 3) return { level: "h3", nodes: node.nodes };
  if (n === 2) return { level: "h4", nodes: node.nodes };
  return null;
}

function youtubeId(href: string): string | null {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return url.pathname.slice(1) || null;
    if (host === "youtube.com") {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const m = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
      if (m) return m[1];
    }
  } catch {
    // 不正な URL は埋め込まない
  }
  return null;
}

/** 行が YouTube のリンク 1 つだけなら動画を埋め込む */
function embedFor(nodes: Node[]): ReactNode | null {
  const meaningful = nodes.filter((n) => !(n.type === "plain" && n.text.trim() === ""));
  if (meaningful.length !== 1) return null;
  const node = meaningful[0];
  if (node.type !== "link" || node.pathType !== "absolute" || node.content) return null;
  const id = youtubeId(node.href);
  if (!id || !/^[\w-]+$/.test(id)) return null;
  return (
    <div className="cs-embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

function safeHref(href: string): string | null {
  return /^(https?:|mailto:)/i.test(href) ? href : null;
}

function iconUrl(path: string, pathType: "root" | "relative"): string {
  // root: [/project/page.icon]、relative: [page.icon]
  const full = pathType === "root" ? path.replace(/^\//, "") : `${COSENSE_PROJECT}/${path}`;
  const [project, ...rest] = full.split("/");
  return `https://scrapbox.io/api/pages/${encodeURIComponent(project)}/${encodeURIComponent(rest.join("/"))}/icon`;
}

function Nodes({ nodes, resolve }: { nodes: Node[]; resolve: Resolve }) {
  return (
    <>
      {nodes.map((node, i) => (
        <NodeView key={i} node={node} resolve={resolve} />
      ))}
    </>
  );
}

function NodeView({ node, resolve }: { node: Node; resolve: Resolve }): ReactNode {
  switch (node.type) {
    case "plain":
    case "blank":
      return node.text;

    case "helpfeel":
      return <span className="cs-helpfeel">? {node.text}</span>;

    case "code":
      return <code className="cs-inline-code">{node.text}</code>;

    case "commandLine":
      return (
        <code className="cs-inline-code">
          {node.symbol} {node.text}
        </code>
      );

    case "formula":
      return <code className="cs-inline-code">{node.formula}</code>;

    case "quote":
      return (
        <blockquote className="cs-quote">
          <Nodes nodes={node.nodes} resolve={resolve} />
        </blockquote>
      );

    case "strong":
      return (
        <strong>
          <Nodes nodes={node.nodes} resolve={resolve} />
        </strong>
      );

    case "decoration": {
      let el: ReactNode = <Nodes nodes={node.nodes} resolve={resolve} />;
      const decos = node.decos;
      const star = decos.find((d) => d.startsWith("*-"));
      if (decos.includes("_")) el = <u>{el}</u>;
      if (decos.includes("-")) el = <s>{el}</s>;
      if (decos.includes("/")) el = <em>{el}</em>;
      if (star) {
        const size = Math.min(Number(star.slice(2)), 5);
        el = size >= 2 ? <strong style={{ fontSize: `${1 + size * 0.15}em` }}>{el}</strong> : <strong>{el}</strong>;
      }
      return el;
    }

    case "numberList":
      return (
        <>
          {node.number}. <Nodes nodes={node.nodes} resolve={resolve} />
        </>
      );

    case "image":
    case "strongImage": {
      const href = node.type === "image" ? safeHref(node.link) : null;
      // eslint-disable-next-line @next/next/no-img-element
      const img = <img className={node.type === "strongImage" ? "cs-image cs-image-strong" : "cs-image"} src={displayImageUrl(node.src)} alt="" loading="lazy" />;
      return href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      );
    }

    case "icon":
    case "strongIcon":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={node.type === "strongIcon" ? "cs-icon cs-icon-strong" : "cs-icon"}
          src={displayImageUrl(iconUrl(node.path, node.pathType))}
          alt={node.path}
          loading="lazy"
        />
      );

    case "hashTag":
      if (isControlTag(node.href)) return null;
      return <span className="cs-tag">#{node.href}</span>;

    case "link": {
      if (node.pathType === "absolute") {
        const href = safeHref(node.href);
        const label = node.content || node.href;
        return href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          label
        );
      }
      // [ページ名] はサイトで公開している記事ならリンク、そうでなければ文字だけ出す
      const title = node.pathType === "root" ? node.href.split("/").slice(2).join("/") : node.href;
      const internal = node.pathType === "relative" ? resolve(title) : null;
      return internal ? <a href={internal}>{title}</a> : <span className="cs-pagelink">{title}</span>;
    }

    case "googleMap":
      return (
        <a href={safeHref(node.url) ?? undefined} target="_blank" rel="noopener noreferrer">
          {node.place || "地図を開く"}
        </a>
      );
  }
}
