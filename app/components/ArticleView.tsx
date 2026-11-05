import type { CosensePost } from "@/libs/cosense";
import { getLinkResolver } from "@/libs/cosense";
import { formatDate } from "@/libs/date";
import CosenseContent from "./CosenseContent";
import "../cosense-content.css";

/** NEWS / NOTICE の記事詳細 */
export default async function ArticleView({ post }: { post: CosensePost }) {
  const resolveLink = await getLinkResolver();
  return (
    <div style={{ padding: "40px" }}>
      <h1>{post.title}</h1>
      <div className="cosense-date">{formatDate(post.publishedAt)}</div>
      <CosenseContent blocks={post.blocks} resolveLink={resolveLink} />
    </div>
  );
}
