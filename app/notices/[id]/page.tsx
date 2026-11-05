import { notFound } from "next/navigation";
import { getPost } from "@/libs/cosense";
import ArticleView from "@/app/components/ArticleView";

// Cosense の更新を 5 分ごとに取り込む（libs/cosense.ts の REVALIDATE_SECONDS と揃える）
export const revalidate = 300;

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost("notice", id);
  if (!post) notFound();
  return <ArticleView post={post} />;
}
