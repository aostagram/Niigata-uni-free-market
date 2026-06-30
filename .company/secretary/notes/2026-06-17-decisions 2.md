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

- 作業保全コミット: きょうの未コミット成果（WebP化・法務名称整合・src/デザイン更新・design-reference素材・scripts/static-site検証群）を144ファイルで `2affc70` にコミットし design-reference-night へpush。除外＝`IMG_1171.heic`（リポジトリ直下の紛れ込み写真）, `scripts/nextextbook/`（6/16ログで無関係なGASと明記）。`.env.local` は .gitignore 済みで未追跡を確認。

- ②手順（独自ドメイン）: gatafy.jp等を取得（お名前.com/Cloudflare等）→Vercelのプロジェクト static-site の Settings→Domains に追加→指示されたDNS（A/CNAME）を登録→検証後に公開URLが独自ドメインに。取得後、承認済みオリジンとconfig.jsのコメントURLも更新要。

## 夕方：Next.jsアプリ起動トラブル対応＋src/のガタフィー改称
- Supabase復活確認: anon keyのJWT内ref=jtobcykyrxitfrluemfn＝旧プロジェクトと同一。「削除」ではなく「一時停止」で、復元したため同refだった（NXDOMAINはpause中の症状）。REST /rest/v1/items がHTTP200で疎通、.env.local は既に正しい値。dev起動成功。
- schema.sql 完全冪等化: realtime追加(197行 alter publication ... add table)を pg_publication_tables 存在チェックで囲み、再実行エラー(policy already exists等)を解消。オーナーがSQL Editorで適用成功。
- 「何回も読み込まれる/デザインがクソ」の主因=**Turbopackキャッシュ破損**。ログにFATAL "Next.js package not found"(version 0.0.0誤検出)が連発、/loginが404ループ→ブラウザ無限リロード＆無スタイル表示。`.next`削除＋dev再起動で復旧（/login HTTP200、panic 0件）。next本体は16.2.6で正常、ディスク3GB空き。
- 第二の主因=**src/アプリだけ旧ブランド「新大フリマ」のまま**。static-siteは改称済みだがNext.js側16箇所が未改称で、見慣れたガタフィーと違う＝「最悪」の正体だった。
- src/ 全11ファイルを一括改称: 新大フリマ→ガタフィー / "Niigata univ. Free Market"→"Niigata Free Market"。perlは-Mutf8必須（日本語パターンがUTF-8解釈されず最初失敗→付与で解決）。残存ゼロ・tsc --noEmitクリーン。
- favicon(src/app/icon.svg)も旧「新」グリフ＋濃緑#0b7a4b→ガタフィー頭文字「ガ」＋ブランド緑グラデに刷新。login の©2024→2026。
- 重要な気づき: src/アプリは元々水彩グリーンの完成度高いデザイン(globals.css: olive/sage配色・ds-card・wc-soft・Zen Maru Gothic)を保有。「デザイン移植が必要」ではなく「クラッシュ＋旧ブランド表示」が問題だった。LP風(static-site)の campus-hero実写・明朝・全面水彩への寄せはオーナー確認後に別途検討。

## 夜：B = src/全画面をガタフィーLPの見た目へ寄せる（デザイン移植）
- 方針: 個別画面のマークアップ全書き換え(高リスク)ではなく、globals.css のデザインシステムを差し替えて全画面に一括反映＋主要画面(login/home hero/Header/Logo/Footer)を個別調整。
- globals.css: ①フォントをLP基調の明朝(Yu Mincho/Hiragino Mincho/Noto Serif JP)へ。--font-round/--font-body を --font-serif に統一。--font-latin=Georgia。②body::before に全面固定の水彩背景(/brand/bottom-background-only.webp)。③.wc-page/.wc-soft を透明化し背景を透けさせる。④--card を半透明 rgba(255,255,255,.86)、--radius 18→22、--shadow-card をLPの大きめ影に。
- layout.tsx: Google Fonts を Zen Maru/Zen Kaku/Comfortaa → Noto Serif JP に差し替え。
- Logo.tsx: ShoppingBag+テキスト → LPの横長ロックアップ画像 /brand/logo.png（透過PNG）に変更。Header/各所に自動反映。
- login/page.tsx: 円形ロゴ→logo.pngロックアップ、見出しを明朝大サイズに。未使用 ShoppingBag import 削除。©2026。
- home (main)/page.tsx: ヒーローをキャンパス実写バナー(/brand/campus-hero.webp)＋下端マスクフェード＋テキスト背後の白グロー＋LPロゴ＋明朝大見出しに刷新。未使用 Truck import 削除。
- 資産: static-site/assets から bottom-background-only/top-background-only/campus-hero.webp と logo.png を public/brand/ にコピー。
- 検証: npx tsc --noEmit クリーン。Playwrightで /login・/terms 撮影＝明朝+水彩+半透明カード+LPロゴで統一を確認。保護ルート(/ /items/new /profile)は307でエラーなくコンパイル。認証必須画面(home/items/chat/profile/notifications等)は共有クラス(ds-card/tag/btn/ds-panel/bubble)経由でLPトークンを自動継承。
- 次=A: オーナーがブラウザでGoogleログイン→home/出品/プロフィール/チャットを実機確認。
