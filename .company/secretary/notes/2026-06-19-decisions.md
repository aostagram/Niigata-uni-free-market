# 2026-06-19 意思決定ログ

## 本番公開の最終状態
- DNS設定済(furima.gatabottle.com A→76.76.21.21, Xserver)。HTTP(80)は307→/loginで疎通OK＝ドメイン・アプリ・ルーティングは生きている。HTTPS(443)はVercelのSSL証明書自動発行待ち(発行されれば自動解消、オーナー作業なし)。

## SEO（Google上位表示）対策を実装
- 方針判断: オーナー承認のうえ、トップLP(`/`)を未ログインでも閲覧できる公開ページに変更（従来は全ページ requireProfile による完全ログイン壁で、Googleが /login しか読めず上位表示不可だった）。出品/購入はGoogleフォーム(ログイン不要)、チャット/マイページ/通知/出品管理は各ページ側の requireProfile で従来どおり保護。
- 実装(コードはローカルのみ、要再デプロイ):
  1) src/components/Header.tsx: requireProfile()→getCurrentUser()+任意プロフィール取得に変更。未ログインは「ログイン」ボタン表示・通知/アカウントメニュー非表示。強制リダイレクト撤去。
  2) src/lib/supabase/middleware.ts: PUBLIC_EXACT_PATHS=["/","/robots.txt","/sitemap.xml"]を追加し、トップを完全一致で公開(前方一致だと全配下を巻き込むため exact 判定)。
  3) src/app/robots.ts: 全クロール許可＋/chat,/profile,/notifications,/onboarding,/playground,/api/,/auth/ をdisallow＋sitemap宣言。
  4) src/app/sitemap.ts: 公開URL(/,/login,/terms,/privacy)を列挙。
  5) src/app/layout.tsx: metadataBase(NEXT_PUBLIC_SITE_URL or furima.gatabottle.com)・title template・keywords・canonical・OpenGraph・Twitterカード(画像=/brand/campus-hero.webp)・robots を整備。WebSite/Organization の JSON-LD 構造化データを<head>に追加。
- 検証: npx tsc --noEmit は変更ファイルにエラー0(残るTS6053は.next/dev/types欠落＆iCloud未DLの環境エラーのみ)。
- ★要オーナー(SEO残作業):
  1) 本番再デプロイ(~/gatafee-deploy で git pull → vercel --prod。もしくはVercelでGit Import設定し自動化)。
  2) Google Search Console に furima.gatabottle.com を登録(Xserver DNSでTXT認証が簡単)→サイトマップ https://furima.gatabottle.com/sitemap.xml を送信。

## 公開完了＋デプロイ＋ホーム改善(夕方)
- ★独自ドメインHTTPS発行完了: https://furima.gatabottle.com/robots.txt がHTTP200。SSL証明書が自動発行され、独自ドメインで本番が完全公開状態になった。
- SEO変更(97d5f45)＋ホーム順序入替(18ba7d4)を本番デプロイ済。本番確認: /robots.txt・/sitemap.xml 配信OK、ホーム見出し順が「新着商品→キャンパス/カテゴリ」になっているのを確認。
- ホーム順序入替: 友達フィードバックで、ヒーロー直後に新着商品コーナー(「新生活にちょうどいいものを、学内で。」)が来るよう、検索/カテゴリ(「キャンパスとカテゴリから、すぐ探せる。」)と中身ごと入替(src/app/(main)/page.tsx)。
- デプロイ運用メモ: ローカルの vercel CLI が古く(54.1.0)、`vercel ls`/`vercel inspect` のProduction статусが UNKNOWN と誤表示される＆`vercel --prod` の標準出力が "Building…" で固まったように見えるバグあり。実際はビルド成功している。判定は本番URLへ curl(/robots.txt 等)で実コンテンツを確認するのが確実。CLIアップグレード(`npm i -g vercel@latest`)推奨。
- Search Console: プロパティ追加済(オーナー)。残り=Xserver DNSにTXT認証レコード追加→確認、その後サイトマップ sitemap.xml を送信(本番でsitemap配信済みなので送信可能)。
  → 追記: オーナーがサイトマップ送信まで完了。

## SEO仕上げ第2弾＋manifest漏れ修正(夜)
- 追加実装: (0c525b4) login ページに title/description/canonical、src/app/manifest.ts(PWA, theme #84ad3f)、viewport themeColor。
- ★ハマり: manifest.webmanifest がproxy(middleware)で307→/loginにリダイレクトされていた。PUBLIC_EXACT_PATHS に robots.txt/sitemap.xml は入れたが manifest.webmanifest を入れ忘れていたのが原因。(dbf0040) で追加し解消。今後 app/ 直下に公開ルート(_route handler)を足したら PUBLIC_EXACT_PATHS への追加を忘れない。
- 本番最終チェック(全てHTTP200): / /login /robots.txt /sitemap.xml /manifest.webmanifest /terms /privacy。manifestはcontent-type application/manifest+json で日本語も正常。ホーム順序=新着商品→キャンパス/カテゴリ を再確認。
- ★オーナー残(SEOグロース, コードでは対応不可): ①Search ConsoleでトップURLの「インデックス登録をリクエスト」 ②実出品を増やす ③furima.gatabottle.com を学生コミュニティ(X/Instagram/LINEオープンチャット/サークル)に拡散し被リンク獲得。順位反映は数日〜2週間。
- デプロイ運用: 引き続きCLI古い(54.1.0)でstatus UNKNOWN表示バグ→curlで実コンテンツ確認が確実。

## スマホ表示の改善(オーナー要望: PC版の形をそのまま縮小)
- 要望: スマホで横並びが縦1列に畳まれて見づらい→「PC版の圧縮でなく形をそのまま小さく」。例: 横2個が縦2個に。あわせて口調を敬語に(オーナーは上司/自分は部下)。
- 対応(globals.css のレスポンシブ改修, b842b85): 980pxで products/trust/flow を1frに畳んでいたのをやめ段組維持(category4列)。768pxで grid-2/grid-3/product-grid を1列でなく2列維持、category3列、余白・文字・アイコンを縮小して「小さいPC版」の見え方に。
- 追修正(ff3c7af): 新着商品/安心/流れの装飾画像(visual-fill)は側並びだと細い縦帯で商品が窮屈だったため、スマホでは画像を上部に全幅(max-height200px)、product-grid等は全幅の2列に。
- 検証: 本番(furima.gatabottle.com)を390px(iPhone相当)でPlaywright撮影。grid-2(図書館前/食堂前)=2列、カテゴリ=3列、声=2列、新着商品=全幅2列+画像上部、安心=項目縦並び+画像下、いずれも良好を目視確認。
- 撮影手順メモ: スクショ用 .mjs はプロジェクト直下に置いて `node` 実行(playwright解決のため。/tmp 置きはERR_MODULE_NOT_FOUND)。本番CSSは /_next/static/chunks/<hash>.css。デプロイ反映判定はこのhash変化をcurlで検出。

## 商品機能拡張(カテゴリ/もっと見る/レビュー/メルカリ風/フォロー) — 全実装
- 在庫スプレッドシート構成: 売り手シート(gid=989667529)に「商品のカテゴリー」列・「出品者gmail」列あり。レビューは別タブ 完了_購入者(gid=1779151945)/完了_出品者(gid=1634127472)のD列(1〜5)。在庫ID(C列)→出品者gmailで紐付け。
- 第1弾(c3bc2ad, 本番確認済): inventory.tsにカテゴリ+出品者gmail。共通StockCard(カテゴリタグ)。ホーム新着6件+「もっと見る」→/stock。全商品一覧/stock(カテゴリ絞り込みバー、公開パス化、sitemap追加)。reviews.tsで★平均集計。プロフィールをメルカリ風(出品数=在庫集計・フォロワー・フォロー中・★評価、出品一覧も在庫から)。follows.tsはテーブル未作成時0返し。
- 第2弾(5530000): フォロー機能。supabase/add-follows.sql(follows表+RLS, ★要オーナー実行)。toggleFollowアクション(stockId→出品者gmailをサーバ側解決, emailは非公開)。FollowButton。商品詳細に「出品者」カード(表示名/アバター・★評価・出品数・フォローボタン)。
- ★要オーナー: Supabase SQL Editorで supabase/add-follows.sql を実行(これをしないとフォローボタンが動かない/フォロワー数が0のまま)。カテゴリは新規出品フォーム回答から自動反映(古いテスト行はカテゴリ空=その他)。
  → 完了(2026-06-19): オーナーがSQL実行。REST `GET /rest/v1/follows` がHTTP200+[]を返し、follows表・RLS select稼働を確認。フォロー機能フル稼働。
- 注意: iCloud上の.gitで commit時 index.lock 書き込みタイムアウトが頻発→`rm -f .git/index.lock`してリトライで回避。

## スマホ表示を「PC版の比例縮小」に全面変更(オーナー再指示)
- 方針転換: 以前の「段組維持+一部reflow」をやめ、PC(1180px設計)を画面幅へ純粋に比例縮小。reflow(1列化・要素組み替え)を全廃。スマホユーザー大多数のため。
- 実装(28ce355): globals.cssの980/768 reflowブロックを撤去。@media(max-width:1180px)で --lp-scale=calc(clamp(375px,100vw,1180px)/1180)(長さ≈0.33px@390) を定義し、全px値を calc(N * var(--lp-scale)) で縮小。グリッド列数はPCのまま。ヒーローは background:100% auto + min-height:calc(100vw*1079/1457)(hero-bg.webp実寸1457x1079)で看板・水彩フレームを切らず全表示。flowパネルのインラインpaddingは.flow-panelクラス化。
- CSS技: scale()/zoomはviewport比の無次元値を作れないため不可。`calc(N * var(--lp-scale))`(N=無次元, var=長さ)で長さを得る方式が有効。`calc(Npx * var)`はpx*px=不可なので注意。
- 検証: 本番390pxでPlaywright撮影。ヒーロー看板フル表示・新着商品/カテゴリ6列/声3列がPCと同じ段組・横スクロール無し(scrollWidth=clientWidth=390)を確認。
- ★再々方針転換(f4fd8e5): オーナーが比例縮小(極小文字)を却下→「一般的なフリマアプリ風のモバイル実用レイアウト」を要求。比例縮小ブロックを撤去し、@media 768pxで(1)可読フォント(h1 clamp26-34/h2 20px/本文13.5px/補足11px)(2)商品グリッド2列・サムネ正方形(aspect1/1 cover)・ボタン全幅min38px(3)キャンパス2枚と声を1カラム縦積み・画像+テキスト横並びも縦積み(4)カテゴリ3列タップ拡大・section-head/CTA縦積み に作り替え。タブレット980pxは横並び縦積み+カテゴリ4列。ヒーローは100% auto+画像比率を維持(看板フル表示)。検証: 390pxで全セクション可読・正方形サムネ2列・縦積み・横スクロール無しを確認。
  → 学び: スマホUIの「PC比例縮小」は文字が極小で実用に耐えず却下された。モバイルは可読性・タップ・正方形サムネのネイティブ設計が正解。
