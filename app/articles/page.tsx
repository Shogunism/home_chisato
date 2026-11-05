import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/libs/cosense";
import "../article-preview.css";

// Cosense の更新を 5 分ごとに取り込む（libs/cosense.ts の REVALIDATE_SECONDS と揃える）
export const revalidate = 300;

export default async function ArticleListPage() {
  try {
    const articles = await getPosts("news");

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
                      unoptimized
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
