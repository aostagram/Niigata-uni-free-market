# 2026-06-17 意思決定ログ

- 完成方針の分岐決定: 「実際の出品商品をサイト表示」は **軽量フォーム連携（最速・推奨）** を採用。今のstatic-siteのまま、GASで管理スプレッドシート→承認済み出品をJSON公開→サイトが取得して一覧/詳細を動的表示する方式。Next.js+Supabase本格アプリ化は将来の選択肢として保留。→ これが次の最優先大仕事（[[static-site-vercel-preview]]）。
- 今回の作業バッチ（オーナー指示「①Client ID ②独自ドメイン ③法務名称整合 ④画像WebPまでやる」）:
  - ③法務名称整合: 規約・プライバシー本文のサービス名「新大フリマ」→「ガタフィー」に全置換（各8箇所）。`src/lib/legal.ts` と `scripts/static-site/gen-legal.mjs` を更新し terms.html/privacy.html 再生成。新潟大学への言及は保持。同意版 `CONSENT_VERSION` を 2026-06-08→2026-06-17 に更新。**未対応**: docx正本（shindai_furima_*.docx）は旧称のまま＝別途オーナーが更新推奨。
  - ④画像WebP圧縮: `scripts/static-site/to-webp.mjs`（新規, sharp使用）で static-site/assets のPNG19枚をWebP化（品質82・最大1600px）、PNG削除、html/css参照36件を.webp更新。**35.3MB→2.7MB**。logo.pngのみ維持（favicon/OGPフォールバック）。元PNGはコミット履歴に残存。
  - ①Google Client ID / ②独自ドメイン: いずれもオーナー操作必須のためハンドオフ（手順は下記）。土台（config.js・Vercelリンク）は整備済み。
- ①手順（Googleログイン本番化）: GCP Console→APIとサービス→認証情報→OAuthクライアントID作成（種類:ウェブ）→承認済みJavaScript生成元に公開URL（現状 https://static-site-nu-blush.vercel.app、独自ドメイン取得後はそれも）→発行IDを `static-site/js/config.js` の GATAFY_GOOGLE_CLIENT_ID に貼付→再デプロイ。OAuth同意画面の公開（テスト→本番）も必要。
- ①完了: GoogleログインのClient ID（1073836479788-…apps.googleusercontent.com）を `static-site/js/config.js` に設定し本番デプロイ。デモ動作→実Googleログインへ。**注意記録**: オーナーがクライアントシークレット(GOCSPX-…)もチャットに貼ったが、クライアントサイド方式では不要かつ秘密情報のため config には入れていない。衛生上、GCPでシークレット再発行を推奨と伝達済み。GCPは無料枠でOK（クレカ不要、トライアル案内は無視で可）と案内。
## 「実際に出品/プロフィール編集/連絡できる」へ → Next.js+Supabaseアプリ仕上げを採用
- 方針決定（オーナー）: 出品・プロフィール編集・連絡は src/ のNext.js+Supabaseアプリで本格実装する（軽量フォーム方式ではプロフィール編集/出品管理が原理的に困難なため）。3機能とも src/ に実装済み（items/new+AddItemForm、profile/page、chat リアルタイム）。
- 健康診断: Next 16.2.6、依存OK、`npx tsc --noEmit` クリーン、ディスク7.9GB空き、supabase/schema.sql完備(profiles/items/chat_rooms/messages/user_consents+RLS+storage+authトリガー,229行)。
- **最大ブロッカー判明**: `.env.local` の NEXT_PUBLIC_SUPABASE_URL(jtobcykyrxitfrluemfn.supabase.co)が **NXDOMAIN＝Supabaseプロジェクト消滅**。新規作成が必須。
- Supabaseセットアップ・ランブック（要オーナー）:
  1. supabase.com で新規プロジェクト作成（無料）。Project URL と anon key を控える。
  2. SQL Editor に `supabase/schema.sql` を全文貼り付けて実行（テーブル/RLS/storage/トリガー一括）。
  3. Authentication→Providers→Google を有効化し、既存のGoogle OAuth(Client ID 1073836479788-… ＋ secret GOCSPX-…)を設定。さらにGoogle側のOAuthクライアントの「承認済みリダイレクトURI」に `https://<ref>.supabase.co/auth/v1/callback` を追加。
  4. Authentication→URL Configuration: Site URL=ローカルは http://localhost:3000、Redirect URLsに http://localhost:3000/** と本番URL/** を登録。
  5. Project URL と anon key を教えてもらい、Claudeが .env.local（と後でVercel env）を更新→ dev起動して出品/プロフィール/チャットを実機確認。
- 注記: 静的サイトのGIS方式(Client IDのみ)と、Next.jsのSupabase OAuth方式(Client ID+Secret+リダイレクトURI)は別物。同じGoogleクライアントを使い回す場合はリダイレクトURIを追加するだけでよい。
- 作業順の方針: まず機能を動かす(Supabase)→出品/プロフィール/チャット動作確認→その後にガタフィーのデザイン移植(美装)。機能優先。

- ②手順（独自ドメイン）: gatafy.jp等を取得（お名前.com/Cloudflare等）→Vercelのプロジェクト static-site の Settings→Domains に追加→指示されたDNS（A/CNAME）を登録→検証後に公開URLが独自ドメインに。取得後、承認済みオリジンとconfig.jsのコメントURLも更新要。
