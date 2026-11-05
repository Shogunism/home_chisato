/**
 * Cosense に直接アップロードした画像（scrapbox.io/files/…）とアイコンの中継。
 *
 * これらは `Cross-Origin-Resource-Policy: same-origin` を返すため、ブラウザが
 * 他サイトからの表示を拒否する。サーバー側で取得して、このサイトのオリジンから
 * 配信し直す。中継先は scrapbox.io の画像 URL だけに限定している（オープン
 * プロキシにしない）。
 */

const ALLOWED = [
  /^https:\/\/scrapbox\.io\/files\/[\w.-]+$/,
  /^https:\/\/scrapbox\.io\/api\/pages\/[^/?#]+\/[^?#]+\/icon$/,
];

// 同じ画像を何度も取りに行かないよう、成功したレスポンスは 1 日キャッシュする
export const revalidate = 86400;

export async function GET(request: Request): Promise<Response> {
  const src = new URL(request.url).searchParams.get("src") ?? "";
  if (!ALLOWED.some((re) => re.test(src))) {
    return new Response("Bad Request", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(src, { redirect: "follow", next: { revalidate } });
  } catch {
    return new Response("Bad Gateway", { status: 502 });
  }
  const type = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !type.startsWith("image/")) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
      // SVG を直接開かれてもスクリプトが動かないようにする
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
