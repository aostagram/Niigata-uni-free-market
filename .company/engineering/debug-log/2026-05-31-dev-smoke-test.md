---
date: "2026-05-31"
issue: dev起動とスモークテスト（容量確保後）
status: resolved
---

# dev サーバー起動・スモークテスト

## 症状 / 背景
ディスク残量逼迫（~326MB）で `next build` 最終段が ENOSPC、`npm run dev` 未検証だった。

## 期待する動作
dev サーバーが起動し、ルーティング・認証ガード・ログイン画面が正しく動く。

## 対応
1. `npm cache clean --force` で npm キャッシュ 1.5GB を解放 → 空き **326MB → 1.8GB**。
2. `.env.local` に一時ダミー値（`https://placeholder.supabase.co` / dummy key）を設定して `npm run dev` 起動。
3. 検証後、`.env.local` を空テンプレートに復元。

## 結果（resolved）
- 起動: `✓ Ready in 415ms`（Next.js 16.2.6 / Turbopack）、コンパイルエラーなし、devログにエラーなし。
- `GET /` → **307** redirect → `/login`（proxy 認証ガードOK）
- `GET /login` → **200**（15KB）。`新大フリマ` / Googleログインボタン / 免責表示を確認。
- 認証必須ルート: `/items/new` `/chat` `/profile` いずれも **307**（未ログインで /login へ）。

## 未検証（要・本番Supabase認証情報）
- 一覧/詳細/出品/チャット/マイページの**データ表示**は、実 Supabase（schema.sql 適用済み）が必要。
- リアルタイムチャットの送受信、画像アップロード（Storage）も実環境で要検証。

## 再発防止
- 開発時は npm キャッシュの肥大に注意（定期 `npm cache verify` / clean）。
- ディスクは数GBの空きを維持（`.next` ビルドキャッシュが数百MB必要）。
