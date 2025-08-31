import './globals.css';
import Nav from '../components/Nav';
import '@fontsource/m-plus-1p/400.css'; // Regular
import '@fontsource/m-plus-1p/700.css'; // Bold

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <header>
         <Nav />
        </header>
        <div style={{ marginTop: '80px' }}>
          <main>{children}</main>
        </div>
        <footer>
        </footer>
      </body>
    </html>
  );
}
