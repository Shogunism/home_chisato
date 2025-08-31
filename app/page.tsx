import Image from 'next/image';
import Link from 'next/link';
import { newsClient, noticeClient } from './libs/client';
import HomeSections from './components/HomeSections';
import ScrollEventSetter from './components/ScrollEventSetter';
import './mountain.scss';
import './globals.css';
import './article-preview.css';
import './notice-preview.css';
export type Article = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: {
    url: string;
  };
};

export type Notice = {
  id: string;
  title: string;
  publishedAt: string;
};


  

export default async function Home() {
  // サーバーサイドでNEWSとNOTICEを取得
  const newsData = await newsClient.get({ endpoint: "blogs", queries: { limit: 5 } });
  const newsArticles: Article[] = newsData.contents;

  const noticeData = await noticeClient.get({ endpoint: "blogs", queries: { limit: 5 } });
  const notices: Notice[] = noticeData.contents;

  return (
    <div>
      <main>
        <ScrollEventSetter />
        <div className="logo-container">
          {/* ロゴ/タイトル */}
          <div className="logo">
            <Image
              className="logo"
              src="/logo.png"
              alt="Logo"
              width={1920}
              height={1080}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className="blank" style={{ margin: '0 auto', height: '10vh', width: '100%' }}></div>
        </div>

        {/* サーバーサイド取得データをクライアントコンポーネントで表示 */}
        <HomeSections newsArticles={newsArticles} notices={notices} />

        {/* 山と雲 */}
        <div className="mountain-container">
          <div className="Mt1">
            <Image src="/M1.png" alt="Mountain Front" width={1920} height={610} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="Mt2">
            <Image src="/M2.png" alt="Mountain Front" width={1920} height={942} style={{ width: '100%', height: 'auto' }} />
          </div>
          
          <div className="chisato">
            <Image src="/chisato.png" alt="Chisato" width={1920} height={1080} style={{ width: '100%', height: 'auto' }} />
          </div>
          
          {/* 新しいフッター */}
          <footer className="site-footer">
            <div className="footer-content">
              <div className="footer-info">
                <Link href="/"><Image src="/logo2.svg" alt="logo2" width={400} height={200} style={{ width: '30%', height: 'auto', minWidth: '300px', color: '#000000' }} /></Link>
                <h3>ホーム千郷</h3>
                <p>活動拠点 : 〒441-1341 愛知県新城市杉山道目記24 西部公民館１階</p>
                <p>Email: mail@homechisato.com</p>
              </div>
              <nav className="footer-links">
                <Link href="/articles">記事一覧</Link>
                <Link href="/contact">お問い合わせ</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
              </nav>
              <p className="copyright">&copy; 2025 ホーム千郷 All Rights Reserved.</p>
            </div>
          </footer>
          
          <div className="Cloud">
            <Image src="/cloud.svg" alt="Cloud" width={1510} height={970} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="Cloud2">
            <Image src="/cloud.svg" alt="Cloud" width={1510} height={970} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={{ paddingBottom: '50vh' }}></div>
        </div>
      </main>
    </div>
  );
}

