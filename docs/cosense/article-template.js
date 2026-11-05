// ホーム千郷 記事テンプレート（Cosense UserScript）
//
// ページメニューに「記事を作る」を追加し、NEWS / NOTICE / 練習用のページを
// テンプレートから作る。公開ルールは README の「記事の書き方」を参照。
//
// - NEWS / NOTICE は #draft 付きで作る。書き終わったら #draft を消すと公開される
// - 練習用ページには #publish を付けないので、サイトには載らない

const MENU = "記事を作る";

// 鉛筆アイコン（ページメニューのボタン画像）
const ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  );

/** 日本時間の今日を YYYY-MM-DD で返す */
function today() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

async function userName() {
  try {
    const res = await fetch("/api/users/me");
    const me = await res.json();
    return me.name || "名無し";
  } catch {
    return "名無し";
  }
}

const TEMPLATES = [
  {
    label: "NEWS 記事",
    title: async () => "",
    body: () => [
      `#publish #news #draft #published/${today()}`,
      "（ここに写真を貼る：Gyazo の URL を貼るか、画像をドラッグ＆ドロップ。最初の写真が一覧のサムネイルになります）",
      "（ここに本文を書く）",
      "",
      "[*** 見出し]",
      " （箇条書きは行の先頭にスペース）",
      "",
      "（書き終わったら、タイトルのすぐ下の行にある `#draft` を消すと公開されます）",
    ],
  },
  {
    label: "NOTICE（お知らせ）",
    title: async () => "",
    body: () => [
      `#publish #notice #draft #published/${today()}`,
      "（ここにお知らせの本文を書く）",
      "",
      "（書き終わったら、タイトルのすぐ下の行にある `#draft` を消すと公開されます）",
    ],
  },
  {
    label: "練習用ページ（公開されない）",
    title: async () => `練習 ${await userName()} ${today()}`,
    body: () => [
      "#news",
      "このページは練習用です。`#publish` が付いていないので、サイトには載りません。",
      "本番の記事では、タイトルのすぐ下の行のタグを `#publish #news`（お知らせなら `#publish #notice`）にします。",
      "",
      "[*** 大きい見出し]",
      "[** 小さい見出し]",
      "ふつうの文章。[* 太字] や [/ 斜体] や [- 打ち消し線] が使えます。",
      " 行の先頭にスペースを入れると箇条書き",
      "  スペース 2 つでもう一段下がる",
      "> 行の先頭に > を付けると引用",
      "リンクは [ホーム千郷 https://example.com] のように書きます",
      "",
      "YouTube は URL だけの行にすると、サイトでは動画が埋め込まれます",
      "[https://www.youtube.com/watch?v=xxxxxxxxxxx]",
      "",
      "table:表の例",
      " 日付\t内容",
      " 8/10\t夏祭り",
      "",
      "写真は Gyazo の URL を [ ] で囲むか、画像をこのページにドラッグ＆ドロップします",
    ],
  },
];

async function createPage(template) {
  const project = scrapbox.Project.name;
  const suggested = await template.title();
  const title = window.prompt(`${template.label}のタイトルを入力してください`, suggested);
  if (!title || !title.trim()) return;

  const path = `/${encodeURIComponent(project)}/${encodeURIComponent(title.trim())}`;

  // 同じタイトルのページがあると、本文がそのページに追記されてしまうので止める
  try {
    const res = await fetch(`/api/pages${path}`);
    if (res.ok && (await res.json()).persistent) {
      window.alert(`「${title.trim()}」というページはもうあります。別のタイトルにしてください。`);
      return;
    }
  } catch {
    // 確認できなくても作成は続ける
  }

  const body = template.body().join("\n");
  location.href = `${path}?body=${encodeURIComponent(body)}`;
}

scrapbox.PageMenu.addMenu({ title: MENU, image: ICON });
for (const template of TEMPLATES) {
  scrapbox.PageMenu(MENU).addItem({
    title: template.label,
    onClick: () => {
      createPage(template);
    },
  });
}
