import Link from "next/link";
import { noticeClient } from "../libs/client";

type Notice = {
  id: string;
  title: string;
  publishedAt: string;
};

// 日付を "YYYY/MM/DD" 形式にフォーマットする関数
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default async function NoticeListPage() {
  try {
    const data = await noticeClient.get({ endpoint: "blogs" }); // blogsエンドポイントで取得
    const notices: Notice[] = data.contents;

    return (
      <>
        <div className="title-text">NOTICE</div>
        <div style={{ maxWidth: "80%", margin: "40px auto", background: "rgba(255,255,255,0.4)", borderRadius: 12, padding: "32px" }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notices.map((notice) => (
              <li key={notice.id} style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
                <Link href={`/notices/${notice.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                    <span style={{ color: '#000', fontSize: '0.95em', minWidth: '110px' }}>{formatDate(notice.publishedAt)}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1em', textAlign: 'center', width: '100%' }}>{notice.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching notices:", error);
    return <div>お知らせの取得に失敗しました。</div>;
  }
}
