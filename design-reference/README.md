# デザインプロトタイプ（Claude Design 連携用）

このフォルダは **実アプリ（`src/`）と Claude Design（claude.ai/design）をつなぐ往復素材**です。
各 HTML は実アプリの画面を「そのまま編集できる HTML/CSS プロトタイプ」として再現しています。

## ファイル

| ファイル | 対応する実アプリの画面 |
|---|---|
| `home.html` | ホーム（`src/app/(main)/page.tsx`） |
| `item-detail.html` | 商品詳細（`src/app/(main)/items/[id]/page.tsx`） |
| `item-new.html` | 出品フォーム（`src/components/AddItemForm.tsx`） |
| `chat-list.html` | メッセージ一覧（`src/app/(main)/chat/page.tsx`） |
| `chat-room.html` | チャットルーム（`src/components/ChatRoom.tsx`） |
| `profile.html` | マイページ（`src/app/(main)/profile/page.tsx`） |
| `styles.css` | 共有：ブランドトークン＋水彩ユーティリティ（実アプリの `globals.css` 相当） |
| `tailwind.config.js` | 共有：Tailwind のブランド色設定 |

## 使い方（往復ワークフロー）

1. **コード → Design**: これらの HTML を claude.ai/design にアップロードして編集を始める。
   実物の画面が起点なので「真っ白から」ではなく現状デザインをそのままいじれます。
2. **Design 上で編集**: 配色・レイアウト・コピーなどを視覚的に調整。
3. **Design → コード**: エクスポートしたバンドルを渡してもらえれば、
   差分を `src/` の React コンポーネント（Next.js 16 / Tailwind v4）へ反映します。
4. 手早く見た目だけ確認したいときは、アプリ内の **`/playground`** ページに
   Artifact の React コードを貼り付ければブランド色のまま即プレビューできます。

## 注意

- これらは**プロトタイプ**であり本番コードではありません。ロジック（Supabase 連携・
  リアルタイム・画像圧縮など）はダミーで、見た目の再現に集中しています。
- 配色やトークンは `styles.css` / `tailwind.config.js` を正とし、実アプリの
  `src/app/globals.css` と一致させています。色を変えるときは両方を更新してください。
