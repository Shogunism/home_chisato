import { notFound } from "next/navigation";
import { getPost } from "@/libs/cosense";
import ArticleView from "@/app/components/ArticleView";

// Cosense の更新を 5 分ごとに取り込む（libs/cosense.ts の REVALIDATE_SECONDS と揃える）
export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost("news", id);
  if (!post) notFound();
  return (
    <div>
      <ArticleView post={post} />
    </div>
  );
}
