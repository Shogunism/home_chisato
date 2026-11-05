# ホーム千郷 Web サイト

Next.js で作っているホーム千郷のサイトです。NEWS と NOTICE の記事は
[Cosense](https://scrapbox.io/home-chisato)（旧 Scrapbox）で書きます。

## 記事の書き方（Cosense）

記事は Cosense プロジェクト [home-chisato](https://scrapbox.io/home-chisato) のページです。
ページに次のタグを付けると、サイトに載ります。

| タグ | 意味 |
|---|---|
| `#publish` | **公開する**（これが無いページはサイトに出ない） |
| `#news` | NEWS（記事一覧 `/articles`）に載せる |
| `#notice` | NOTICE（お知らせ一覧 `/notices`）に載せる |
| `#published/2025-08-10` | 表示する日付（省略するとページを作った日） |
| `#draft` / `#private` | `#publish` が付いていても公開しない |

例:

```
夏祭りに参加しました
#publish #news #published/2025-08-10
[https://gyazo.com/xxxxxxxx]
ちさと館で夏祭りを開催しました。
[*** 当日の様子]
 屋台を出しました
```

- 1 行目（ページタイトル）が記事のタイトルになります
- 公開を制御するタグ（上の表のもの）はサイトには表示されません
- ページ内の最初の画像が、一覧のサムネイルになります
- 見出し（`[** ]` `[*** ]`）・太字・箇条書き・画像・リンク・引用・コード・表・YouTube の埋め込みに対応しています
- 本文中の `[ページ名]` は、そのページもサイトに公開されていればサイト内リンクになります。公開されていなければ文字だけが表示されます
- Cosense での変更は **5 分ほどで** サイトに反映されます（ISR）

### 記事テンプレート（UserScript）

Cosense のページメニューに「記事を作る」ボタンを追加する UserScript を用意しています。
ボタンから NEWS 記事・NOTICE・練習用ページをテンプレートで作れます。

- NEWS / NOTICE は `#draft` 付きで作られるので、書きかけが公開されることはありません。
  書き終わったら `#draft` を消すと公開されます
- 練習用ページには `#publish` が付かないので、サイトには載りません

**準備（管理者が 1 回だけ）**: [docs/cosense/article-template-page.txt](./docs/cosense/article-template-page.txt)
の中身を、Cosense に `記事テンプレート` というタイトルの新しいページを作って丸ごと貼り付ける。

**使う人（各自 1 回だけ）**: 自分のユーザー名のページに次の 2 行を書いて再読み込みし、
UserScript を有効にするか聞かれたら許可する。

```
code:script.js
 import '/api/code/home-chisato/記事テンプレート/script.js';
```

スクリプトを直すときは [docs/cosense/article-template.js](./docs/cosense/article-template.js) と
Cosense の `記事テンプレート` ページの両方をそろえてください。

## 仕組み

- `libs/cosense.ts` — Cosense の公開 API から記事を取得し、公開ルールで絞り込む
- `app/components/CosenseContent.tsx` — Cosense の記法を表示する
- `app/cosense-image/route.ts` — Cosense に直接アップロードした画像の中継。
  `scrapbox.io/files/…` は他サイトから直接表示できないため、サーバー経由で配信している
- 記事の URL は Cosense のページ ID（`/articles/<ID>`）なので、ページ名を変えても URL は変わらない

環境変数 `COSENSE_PROJECT` を設定すると、取得先のプロジェクトを変えられます（既定は `home-chisato`）。

## 開発

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
