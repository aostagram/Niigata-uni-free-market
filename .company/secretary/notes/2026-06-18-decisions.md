# 2026-06-18 意思決定ログ

## ホームをガタフィーLP(static-site/index.html)に完全一致させる
- 目的: オーナー要望「vercel.app トップ(https://static-site-nu-blush.vercel.app/index.html)にデザイン一致」。出品リストの実データ結線は不要(サンプル表示でOK)との指示。
- 方針: LPの styles.css を `.lp-home` スコープで globals.css に移植し、(main)/page.tsx を LPマークアップで全面再構築。max-w-3xl レイアウトを突き破る全面幅ブレイクアウトを .lp-home に付与。
- 移植したセクション(LP順に一致): ヒーロー(campus-hero実写+白グロー+明朝大見出し+バッジ+ボタン)→検索(キャンパス2枚paint-card+category-grid)→新着商品(products-layout: 左visual-fill画像+product-grid)→新大生だから安心(trust-layout)→取引の流れ(flow-layout+steps)→お客様の声(voice-card×3)→取引事例ギャラリー(filter-bar+case-card×6, フィルタはCaseGallery.tsxのクライアント実装で動作)→CTAバンド。
- カテゴリタイルはLPと同一の6種(教科書・参考書/家具・家電/生活用品/自転車・スポーツ/服・雑貨/その他, 漢字アイコン本椅器輪衣他)。教科書のみ /?category=textbook に結線、他は#listings。
- 画像: static-site/assets から ASCII名で public/brand/ にコピー(library/cafeteria/market-items/safety-trust/transaction-flow/item-detail/item-material.webp + campus-hero/bottom/top/logo)。日本語ファイル名はURL解決不安定のため改名。
- 重要なハマり: globals.css にCSS追記後、TurbopackのHMRが取りこぼし、コンパイル後CSSに .lp-home が0件→ヒーロー無スタイルだった。**.next削除+dev再起動**で解消(89ルート反映)。CSS大量追記時はdev再起動が確実。
- 検証: npx tsc --noEmit クリーン。Playwrightで /lp-preview を撮影し、正本 static-site/index.html(file://)と並べて全セクション一致を確認。
- 一時対応: ホームは認証必須で目視できないため、暫定で /lp-preview ルート(app/lp-preview/page.tsx)を作成し middleware PUBLIC_PATHS に追加。**要クリーンアップ**(ログイン確認後に削除し PUBLIC_PATHS から除外)。
- Supabase: dev ログに一時的に getaddrinfo ENOTFOUND が出たが、再確認でDNS解決OK・REST HTTP200。一時的なDNS揺らぎと判断。ログインは可能。OAuthは"state has expired"の試行痕跡あり=要再試行。

## 裏側運用：フォーム結線・ヘッダー表記・チャット導線・プロフィール・メール通知
- フォームURLを src/lib/links.ts に一元化(FORMS: sellerListing/buyerInquiry/completeSeller/completeBuyer, ADMIN_SHEET_URL, OFFICIAL_EMAIL=gatafeefurima@gmail.com)。
- 結線: 出品ボタン(ヘッダー/ヒーロー/新着見出し/CTA)→売り手フォーム。商品カード「購入する」+商品詳細「購入する(お問い合わせ)」→買い手フォーム。SellerControls「取引完了報告(売り手)」→completeSeller。商品詳細「取引完了報告(購入者)」→completeBuyer。いずれ別タブ。管理シートはUI非公開(裏側)。
- ヘッダー: ロゴ横に「ガタフィー / 新潟発のフリマアプリ」表記を追加。右側にチャット(MessageSquare→/chat)アイコン追加。
- チャット導線: ホーム右端に固定フローティング「チャットする」(md+表示, →/chat)を追加。
- プロフィール(学年/学部/ニックネーム): profilesに nickname/grade/faculty/email 列追加(supabase/add-profile-fields.sql)。Profile型更新。ProfileForm.tsx(クライアント, ニックネーム必須+学部/学年select)。saveProfile アクション(actions/profile.ts)。/onboarding ページ((main)外, ログイン直後の作成欄)。requireProfile に「nickname未設定→/onboarding」誘導を追加。マイページに編集(details)とニックネーム/学部/学年表示を追加。
- メール通知(nodemailer導入): src/lib/mail.ts(Gmail SMTP, GMAIL_USER/GMAIL_APP_PASSWORD未設定なら送信スキップでアプリは壊さない)。チャット送信(actions/chat.ts sendMessage)で相手に着信メール(best-effort)。出品完了メールはフォーム側が適切→Apps Script(scripts/apps-script/form-notify.gs)を用意。
- 検証: npx tsc --noEmit クリーン。Playwrightで /lp-preview 撮影→購入ボタン・チャット導線の表示確認。
- ★要オーナー作業(これをやらないと動かない):
  1) Supabase SQL Editor で supabase/add-profile-fields.sql を実行(これをしないとログイン後 /onboarding で保存失敗＝詰まる)。
  2) .env.local と Vercel env に GMAIL_APP_PASSWORD(16桁)を設定(Googleアカウント→2段階認証→アプリパスワード)。
  3) 各Googleフォームで「メールアドレスを収集する」ON＋form-notify.gs をフォーム送信トリガーで設置(出品/取引完了の確認メール)。
- 要クリーンアップ: /lp-preview ルート + middleware PUBLIC_PATHS の /lp-preview(確認用の暫定)。

## 在庫連携（在庫番号表示）＋ iCloudフォルダ移動事件
- 在庫連携: 管理スプレッドシートの売り手回答タブ(gid=989667529)を在庫マスターとしてサイトが読込。src/lib/inventory.ts(gviz CSV取得＋自前CSVパーサ＋列を部分一致で検出: 在庫ID/商品名/価格/商品の状態/説明/画像/ステータス)。個人情報列(メール等)は読み込むが表示しない。売却/完了は非表示、予約済は予約バッジ付きで表示。Driveの画像共有リンクは lh3.googleusercontent.com/d/<id> に自動変換。env INVENTORY_CSV_URL で上書き可。links.ts に ADMIN_SHEET_ID / INVENTORY_SHEET_GID 追加。
- ホーム新着グリッドを在庫連携に変更(Supabase items 依存を撤去)。各商品に「在庫番号 Kxxx」バッジ＋「購入する（在庫番号 Kxxx）」ボタン。見出しに「購入・取引完了フォームには在庫番号を入力」と明記。在庫0件時はサンプル表示にフォールバック。検証: tsc クリーン、/lp-preview で K001/K002/K003等が在庫番号付き表示を確認。
- ★iCloud事件: 作業中に macOS の「デスクトップとドキュメントを iCloud に同期」が作動し、ローカル Desktop が『デスクトップ - 齋藤碧のMacBook Air』にリネーム。プロジェクト実体は **/Users/lelele/Desktop/デスクトップ - 齋藤碧のMacBook Air/素人がアプリ開発/Gatafee|niigata free market/** に移動。旧パス(/Users/lelele/Desktop/素人がアプリ開発/...)は .next だけの残骸に。全ファイル・git(design-reference-night)は新パスで無事。dev も新パスで再起動済み。→ オーナーへ: 二重デスクトップは混乱の元。iCloudデスクトップ同期の要否を決めて一本化推奨。
- 画像補足: Drive画像は公開設定により表示されないことあり。確実に出すなら直リンク画像URL推奨。

## ★プロジェクト移設（iCloud混乱の根本解決）
- 経緯: iCloudデスクトップ同期＋ディスク逼迫で、プロジェクトが Desktop→「デスクトップ - 齋藤碧のMacBook Air」→iCloud Drive と二転三転し、ディスク満杯(ENOSPC)でツールも停止する事態に。
- 対応: オーナー承認のうえ、プロジェクトを iCloud 対象外の通常フォルダへ移動＆改名。
  新パス = **/Users/lelele/dev/gatafee**（旧: .../Gatafee|niigata free market、`|`とスペースでCLが頻繁に失敗していたのも解消）。
- 確認: package.json/src/最新編集(page.tsx 12:01)/node_modules/git(design-reference-night) すべて無事。dev起動OK・login200・/api/drive-image 200 image/jpeg。GitHubバックアップあり。
- 画像表示: 管理人がDriveの「ファイルの回答」フォルダを公開→画像プロキシ /api/drive-image を PUBLIC_PATHS に追加＋fetchをno-store+UA化で実写真が表示されるように。写真無し出品は /brand/no-image.svg「画像準備中」。
- 注意(次セッション): 作業ディレクトリは今後 ~/dev/gatafee。Desktopの旧パスは使わない。ディスクは依然99%(Library/Caches 6.7G/Downloads 6.3G が大)→要整理。
