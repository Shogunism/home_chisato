import { newsClient } from "@/libs/client";
import BlogContent from "./BlogContent";
import { notFound } from "next/navigation";

type Article = {
  id: string;
  title: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  content: string;
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params; // Promiseを解決
  try {
    const data: Article = await newsClient.get({
      endpoint: "blogs",
      contentId: resolvedParams.id,
    });
    return (
      <div>
        <BlogContent blog={data} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }
}

