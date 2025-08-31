import { noticeClient } from "@/libs/client";
import BlogContent from "./BlogContent"; // BlogContent をインポート
import { notFound } from "next/navigation";

type Notice = {
  id: string;
  title: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  content: string;
};

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Promiseを解決
  try {
    const data: Notice = await noticeClient.get({
      endpoint: "blogs",
      contentId: resolvedParams.id,
    });

    return <BlogContent blog={data} />;
  } catch (error) {
    console.error("Error fetching notice:", error);
    notFound();
  }
}
