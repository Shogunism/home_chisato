
import Link from "next/link";
import Image from "next/image";
import { newsClient } from "@/libs/client";
import "../article-preview.css";

type Article = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: {
    url: string;
    width?: number;
    height?: number;
  };
};

export default async function ArticleListPage() {
  try {
    const data = await newsClient.get({ endpoint: "blogs" });
    const articles: Article[] = data.contents;

    return (
      <>
        <div className="title-text">NEWS</div>
        <div className="news-container fade">
          <div className="articles-preview-list">
            {articles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id} className="article-card">
                <div className="article-card-image">
                  {article.eyecatch ? (
                    <Image
                      src={article.eyecatch.url}
                      alt=""
                      width={288}
                      height={162}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="article-card-body">
                  <h3 className="article-card-title">{article.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return <div>記事の取得に失敗しました。</div>;
  }
}
