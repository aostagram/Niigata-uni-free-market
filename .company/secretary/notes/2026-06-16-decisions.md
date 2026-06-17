# 2026-06-16 意思決定ログ

- Codex編集の確認: `static-site/`（本日6/16最終更新の静的サイト）はデザインイメージ画像（水彩キャンパス背景top/bottom・hero・商品素材等）が全て結線済みで、Playwright検証(verify-static-site.mjs)もデスクトップ/モバイル/メニュー全てOK。実装は正常と確認。
- 引き継ぎ可否: Codexの編集はすべてローカルのプレーンファイル（HTML/CSS/JS/PNG）として残存。Codex固有の状態や設定ファイルは無く、Claude Codeでそのまま継続編集可能と判断。ただし `static-site/` `scripts/` `public/design-comp/` はgit未追跡(??)＝未コミットのため、コミットして履歴に残すことを推奨。
- Codex使用上限到達のためClaude Codeへ引き継ぎ確定。
- コミット実施: static-site一式48ファイルを `de411ac` でコミット（pushなし）。GAS(scripts/nextextbook)等の無関係ファイルは対象外。
- 今後の方針（オーナー指示）: ①デザイン(static-site)で納得 → ②本番 `src/`(Next.js)へ移植 → ③スプレッドシート/Forms連携で「動く」サイト化、の順で進める。
- 既知の課題: campus-library-1278.png(34MB)/campus-cafeteria-1279.png(24MB)が巨大かつ public/design-comp と static-site/assets で重複。src移植時にWebP圧縮で解消する。
- ブランド改称(法的リスク回避): 「新大フリマ」→「ガタフィー」に全置換。「新大」は新潟大学公式運営と誤認され法に抵触する恐れがあるため。英語サブ「Niigata univ. Free Market」→「Niigata Free Market」(univ.削除)。トップ<title>は「ガタフィー｜新潟発のフリマアプリ」。
- トップ背景: AI生成風の top-background-only.png → 提供のキャンパス実写 campus-hero.png(image.png由来)に差し替え。
- 背景の継ぎ目: ヒーローの白背景+1px境界線を撤去し、ヒーロー画像下端を mask-image でフェード→下の水彩背景となめらかに接続。
- 未解決ブロッカー: ロゴ画像 logo.png に旧名「新大フリマ/Niigata univ. Free Market」がラスター焼き込み。要再生成（ガタフィー版）。logo.svgは別デザイン(「新」1字)で代替不可。→ 解決: scripts/logo/logo.html からPlaywrightでガタフィー版を書き出し差し替え済み(コミット23f1902)。
- スマホでClaude Code利用のため、ブランチ design-reference-night を GitHub(aostagram/Niigata-uni-free-market) に push 済み(コミット de411ac/23f1902/06c043a)。スマホは claude.ai/code でアカウントログイン→当リポジトリ/ブランチを選択して続行する。Mac側へ取り込む時は git pull。
- プレビュー公開: `static-site/` を Vercel(アカウント bbbbluuuue-4781 / team saao)へ独立プロジェクト `saao/static-site` としてデプロイ。公開URL **https://static-site-nu-blush.vercel.app** （スマホからも閲覧可。トップ/guide.html/画像すべて HTTP 200 確認済み）。Next.jsの本番(`src/`)とは別物の静的プレビュー専用プロジェクト。
- デプロイ前処理: 巨大PNG campus-library-1278.png(34MB)/campus-cafeteria-1279.png(24MB)が原因でVercelのfiles APIアップロードがInternal Serverエラーで失敗(計87MB)。両画像をsipsで5712px→1600pxに縮小(計6MB、合計36MB)し再デプロイ成功。両画像はカード表示のみで高解像度不要のため見た目の劣化なし。オリジナルはコミット de411ac に残存し `git checkout` で復元可能。
- 更新方法: 以後 `static-site/` で `vercel deploy` を再実行すれば公開URLが更新される(プロジェクトは .vercel/ でリンク済み)。`vercel deploy`(無印)はプレビュー用の新URL発行で本番alias(static-site-nu-blush)は更新しない。本番URL更新は昇格(promote)が必要。
- ロゴ刷新: 提供の新ロゴ(横長ロックアップ「箱アイコン＋ガタフィー文字」)に差し替え。透過版 `デザインイメージ素材/ガタフィー背景透過ロゴ.png`(1536×1024,透過)を1024幅に最適化して `static-site/assets/logo.png` に上書き(旧版バックアップ /tmp/logo-backup-old.png)。新ロゴに文字が含まれるため、CSSで①丸切り抜き(border-radius:50%/object-fit:cover)を解除しobject-fit:containの横長表示に、②ヘッダーの重複ワードマーク `.brand-link > span` を非表示に変更。ヘッダー高52px(SP42px)/ヒーロー高132px(SP104px)。
- 背景の継ぎ目修正(オーナー指摘「スクロールで画面間に境目が出て気持ち悪い」): 原因はbodyに `bottom-background-only.png` を `repeat-y` で縦タイルしており、絵柄の上下端が繋がらずタイル境界に硬い横線が出ていた。修正は repeat を廃止し、`body::before` を `position:fixed; inset:0; background: …/cover no-repeat; z-index:-1` の固定1枚レイヤーに変更(タイルしない＝継ぎ目が原理的に出ない)。Playwrightフルページ撮影(scripts/static-site/shot-fullpage.mjs 新規)で継ぎ目消失・水彩存続・新ロゴ表示を確認済み。

## 2回目の指示(同日・夜)対応: ヘッダー題名/ヒーローロゴ/動的化(法務・Googleログイン・フォーム配線)
- ヘッダー題名: 先に非表示化した重複ワードマークを復活。全11ページのブランドを `ガタフィー / 新潟発のフリマアプリ`(brand-title=ガタフィー, brand-sub=新潟発のフリマアプリ)に統一(perl一括置換)。CSSの `.brand-link>span{display:none}` を撤去。ロゴ(横長ロックアップ)は維持。※ロゴ内にも「ガタフィー」があり文字が二重になるが、オーナー指示「ロゴはついたまま題名を挿入」に従った(要なら後で調整)。
- ヒーローロゴ拡大: `.hero-logo` 高さ 132→208px(SP 104→152px)。
- 規約・プライバシー全文: static-siteのterms.html/privacy.htmlはプレースホルダーだった。`src/lib/legal.ts` のTERMS(17条)/PRIVACY(13条)全文を `scripts/static-site/gen-legal.mjs`(新規)で静的HTML生成し置換。CSSに `.legal-list`/`.doc-panel h2` 追加。**重要懸念**: 法務本文のサービス名が旧称「新大フリマ」のまま(docx正本準拠)。ガタフィー改称([[rebrand-gatafy]])と不整合＝「新大」露出の法的リスク観点で要相談。本文改変は無断で行わず保留。
- Googleログイン: login.htmlにGoogle Identity Services(client-side)を実装。`js/config.js`(GATAFY_GOOGLE_CLIENT_ID 空＝デモ動作)/`js/login.js`(新規)。IDトークンのemailが `@mail.cc.niigata-u.ac.jp`(ccあり[[email-domain-decision]])で終わるか検証→同意2チェックで「ログインを完了する」有効化→mypage。**要オーナー作業**: GCPでOAuthクライアント(ウェブ)作成し承認済みJS生成元に公開URL登録→Client IDをconfig.jsに貼付。未設定の間はデモボタン。
- フォーム/シート配線: `js/main.js` に LINKS(window.GATAFY_LINKS)集約＋ `data-form` バインダ(aはhref+target=_blank付与、buttonはclickで新規タブ)。配線=出品ボタン(6箇所)→売り手フォーム、item-detail「予約・問い合わせ」→買い手フォーム、「取引を完了」(my-listings)/完了報告(売り手/購入者, item-detail)→各完了フォーム。管理シートはUI非公開(backend)。Playwright(check-links.mjs)で全URL解決を確認。
- フォームURL対応: sellerListing=売り手専用回答(出品), buyerInquiry=買い手専用回答, completeSeller=取引完了売り手(forms.gle/sy2DU…), completeBuyer=取引完了購入者。管理スプレッドシート=1raQMxjZ…。
