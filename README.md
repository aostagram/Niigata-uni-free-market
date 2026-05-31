# 新大フリマ（Niigata Uni Free Market）

新潟大学生限定の、キャンパス内フリーマーケット Web アプリ。
中古の **教科書・ゲーム** を学生同士で直接（対面）取引できるマッチングサービスです。

> ⚠️ 本サービスは新潟大学非公式の、学生有志による個人運営サービスです。
> 新潟大学教務課および大学当局とは一切関係ありません。

## 技術スタック

- **Next.js 16**（App Router / TypeScript / Turbopack）
- **Tailwind CSS v4**（モバイルファースト）
- **Supabase**（Auth / Postgres / Storage / Realtime）

## 主な機能

- 新潟大学の Google アカウント（`@mail.cc.niigata-u.ac.jp`）限定ログイン
  - クライアント・サーバー（Proxy / OAuth コールバック / DB トリガー）の三段でドメインを検証
- 商品一覧（教科書 / ゲームのカテゴリ絞り込み・キーワード検索）
- 出品（画像アップロード・価格・無料譲渡）
- 出品ステータス管理（販売中 / 取引完了）・削除
- リアルタイムチャット（`/chat/[id]`、Supabase Realtime）
- 取引安全ガイドラインの常時表示

## ディレクトリ構成

```
src/
├─ proxy.ts                      # 認証ガード（旧 middleware）
├─ app/
│  ├─ layout.tsx                 # ルートレイアウト（lang=ja）
│  ├─ globals.css                # Tailwind + テーマ
│  ├─ login/page.tsx             # ログイン
│  ├─ auth/callback/route.ts     # Google OAuth コールバック
│  ├─ actions/                   # Server Actions
│  │  ├─ auth.ts                 # ログアウト
│  │  ├─ items.ts                # 出品の作成/更新/削除
│  │  └─ chat.ts                 # チャットルーム作成/メッセージ送信
│  └─ (main)/                    # ログイン必須エリア（ヘッダー+フッター）
│     ├─ page.tsx                # ホーム（商品一覧）
│     ├─ items/new/page.tsx      # 出品フォーム
│     ├─ items/[id]/page.tsx     # 商品詳細
│     ├─ chat/page.tsx           # メッセージ一覧
│     ├─ chat/[id]/page.tsx      # チャットルーム
│     └─ profile/page.tsx        # マイページ
├─ components/                   # UI コンポーネント
└─ lib/
   ├─ constants.ts               # ドメイン・カテゴリ・文言など
   ├─ types.ts                   # DB 型
   ├─ format.ts                  # 価格/日時整形
   ├─ auth.ts                    # 認証ヘルパー
   └─ supabase/                  # Supabase クライアント（browser/server/proxy）
supabase/
└─ schema.sql                    # DB スキーマ + RLS + Storage
```

## セットアップ手順

### 1. Supabase プロジェクトを作成

[supabase.com](https://supabase.com) で新規プロジェクトを作成します。

### 2. データベースを構築

ダッシュボードの **SQL Editor** で `supabase/schema.sql` の内容を貼り付けて実行します。
（テーブル・RLS・トリガー・`item-images` ストレージバケットが作成されます）

### 3. Google ログインを設定

1. [Google Cloud Console](https://console.cloud.google.com) で OAuth クライアント ID を作成
   - 承認済みリダイレクト URI に
     `https://<PROJECT_REF>.supabase.co/auth/v1/callback` を追加
2. Supabase ダッシュボード → **Authentication > Providers > Google** を有効化し、
   クライアント ID / シークレットを設定
3. **Authentication > URL Configuration** の Redirect URLs に
   `http://localhost:3000/auth/callback`（本番URLも）を追加

> 新潟大学が Google Workspace の場合、Workspace 側でドメイン外への OAuth を
> 制限している可能性があります。ログインできない場合は大学の設定もご確認ください。

### 4. 環境変数を設定

`.env.local` を編集（値は Supabase の **Project Settings > API**）:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. 起動

```bash
npm run dev
```

http://localhost:3000 を開く → ログイン画面が表示されます。

## メモ

- 決済機能はありません。お金のやり取りはキャンパスでの**対面受け渡し**時に行う前提です
  （資金決済法・古物営業法などの規制を回避するための設計判断）。
- 画像は `next/image` ではなく `<img>` を使用（Supabase の公開URLをそのまま表示）。
