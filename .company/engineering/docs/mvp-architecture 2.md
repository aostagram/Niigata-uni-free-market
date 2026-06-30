---
type: doc
topic: MVPアーキテクチャ
status: draft
created: "2026-05-31"
---

# 新大フリマ MVP アーキテクチャ

## 概要

新潟大学生限定のキャンパス内フリマ Web アプリ。メルカリ風の一覧UI・学生限定認証・取引チャットを備える。決済はアプリ外（対面手渡し）。

- フロント/バック: **Next.js 16**（App Router / TypeScript / Server Actions）
- スタイル: **Tailwind CSS v4**（モバイルファースト）
- DB / 認証 / ストレージ / リアルタイム: **Supabase**
- ホスティング: **Vercel** 想定

---

## 設計・方針

### 認証（Auth）

- **Google OAuth** のみ。許可ドメインは **`@mail.cc.niigata-u.ac.jp`**（cc あり）。
- ドメイン検証を**多段**で実施（防御の層）:
  1. クライアント: ログイン時に `hd` ヒントを付与（`LoginButton`）
  2. OAuthコールバック: `exchangeCodeForSession` 後にメール末尾を検証、不一致は即サインアウト（`app/auth/callback/route.ts`）
  3. Proxy（旧middleware）: 全リクエストでセッション更新＋ドメイン外を強制ログアウト＋未ログインを `/login` へ（`src/proxy.ts`, `lib/supabase/middleware.ts`）
  4. DBトリガー: `auth.users` への INSERT 時にドメイン外を `raise exception`（`handle_new_user`）
- セッションは Cookie ベース（`@supabase/ssr`）。サーバー/ブラウザ別クライアントを用意。

### データベース（Postgres / RLS）

| テーブル | 主なカラム | 用途 |
|----------|-----------|------|
| `profiles` | id(uuid, =auth.users), full_name, avatar_url, created_at | ユーザー情報。新規登録時にトリガーで自動作成 |
| `items` | id, user_id→profiles, title, category('textbook'\|'game'), description, price(int,0=無料), image_url, status('available'\|'sold'), created_at | 出品 |
| `chat_rooms` | id, item_id→items, buyer_id→profiles, seller_id→profiles, created_at, unique(item_id,buyer_id) | 取引チャットルーム（1出品×購入希望者ごと1室） |
| `messages` | id, room_id→chat_rooms, sender_id→profiles, message_text, created_at | チャットメッセージ |

- **RLS 方針**:
  - profiles / items: 認証ユーザーは閲覧可。作成・更新・削除は本人（`auth.uid()` 一致）のみ。
  - chat_rooms: buyer / seller の当事者のみ閲覧。作成は buyer のみ。
  - messages: 当該ルームの当事者のみ閲覧・送信。
  - storage（`item-images`）: 公開読み取り、アップロード/削除は本人フォルダ（`{uid}/...`）のみ。
- **リアルタイム**: `messages` を `supabase_realtime` パブリケーションに追加 → チャット即時反映。

### ストレージ / 画像

- バケット `item-images`（public）。
- クライアント側で **WebP / 長辺800px / 約100KB** に圧縮してからアップロード（`browser-image-compression`）。圧縮後200KB超は拒否。無料枠（1GB/5GB）を死守。

---

## 詳細：画面一覧（creative はこのリストを基準にワイヤーを作成）

| # | 画面 | ルート | 認証 | 主な要素 | 実装状態 |
|---|------|--------|------|----------|----------|
| 1 | ログイン | `/login` | 不要 | ロゴ、Googleログインボタン、ドメイン案内、免責表示、エラー表示 | ✅ |
| 2 | ホーム（一覧） | `/` | 必要 | 検索バー、カテゴリチップ(すべて/教科書/ゲーム)、商品グリッド(2〜3列)、空状態 | ✅ |
| 3 | 商品詳細 | `/items/[id]` | 必要 | 画像、価格、カテゴリ、説明、出品者、問い合わせ/出品者メニュー、注意書き | ✅ |
| 4 | 出品 | `/items/new` | 必要 | 画像アップロード(圧縮)、商品名、カテゴリ、価格(無料可)、説明 | ✅ |
| 5 | メッセージ一覧 | `/chat` | 必要 | チャットルーム一覧(相手・商品・最新メッセージ) | ✅ |
| 6 | チャットルーム | `/chat/[id]` | 必要 | 相手/商品ヘッダー、安全ガイドラインバナー、メッセージ吹き出し、入力欄(リアルタイム) | ✅ |
| 7 | マイページ | `/profile` | 必要 | プロフィール、メール、ログアウト、自分の出品一覧 | ✅ |
| - | 共通 | layout | - | ヘッダー(ロゴ/メッセージ/出品/アバター)、フッター(免責表示) | ✅ |

### 主要なユーザーフロー

1. ログイン → ホーム
2. 出品: ホーム → 出品(`/items/new`) → 画像圧縮&アップロード → 作成 → 商品詳細へ
3. 取引開始: 商品詳細 → 「問い合わせる」→ chat_room 作成/取得 → `/chat/[id]`
4. 取引: チャットでやり取り → 学内で対面手渡し → 出品者がステータスを「取引完了」に

---

## 参考（リポジトリ内の対応箇所）

- スキーマ: `supabase/schema.sql`
- 認証ヘルパー: `src/lib/auth.ts` / `src/lib/supabase/*`
- Server Actions: `src/app/actions/{auth,items,chat}.ts`
- 画像圧縮: `src/lib/upload.ts`
- 画面: `src/app/(main)/*`, `src/app/login/page.tsx`

## 未確定 / TODO（engineering）

- [ ] ディスク容量確保後に `npm run dev` で全画面の動作確認（open状態）
- [ ] Supabase 本番プロジェクトで schema.sql 実行 → RLS の実機検証
- [ ] 通報/ブロック機能、取引完了の相互確認は MVP 後の検討事項
