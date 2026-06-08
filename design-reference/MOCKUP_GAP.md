# モックアップ差分メモ（MOCKUP_GAP）

各画面を見本PNG（`assets/` 例：`top.png` `login.png` …）と照合した差分と対応状況。
2026-06-09 夜間作業時点。React18 + Babel standalone のSPA（`新大フリマ.html`）。

| 画面 | 見本 | 現状の一致度 | 主な差分 / 対応 |
|------|------|------------|----------------|
| ログイン `screen_login.jsx` | `login.png` | ◎ 約90% | ロゴ・2チェック有効化・Googleボタン・規約リンクまで一致。袋ロゴ内の南京錠アイコンは未再現（軽微）。**変更なし** |
| ホーム `screen_home.jsx` | `top.png` | ○ 約85% | ヒーロー/キャンパス・学部グリッド/3ステップ/新着6枚/フッターCTAあり。スマホ実機モック画像とキャンパス写真の合成は簡略。**変更なし** |
| 商品検索 `screen_search.jsx` | `search.png` | ○ | 左フィルター+3列グリッド+FAB。**変更なし** |
| 商品詳細 `screen_detail.jsx` | `detail.png` | ○ | ギャラリー+出品者カード+固定フッター。**変更なし** |
| チャット `screen_chat.jsx` | `chat.png` | ○ | 左リスト+右会話+吹き出し。**変更なし** |
| 受け渡し `screen_contract.jsx` | （新大スポット） | ○ | キャンパス別スポット選択+日時。**変更なし** |
| 評価 `screen_rating.jsx` | `rating.png` | ○ | 3ステップ+よかった/問題あり+コメント。**変更なし** |
| マイページ `screen_mypage.jsx` | `mypage.png` | ◎ | 左サイドバー+プロフィール+統計4+出品グリッド+取引中。**変更なし** |
| 出品一覧 `screen_sell.jsx: MyListingsScreen` | `mylistings.png` | ◎ | サイドバー+タブ+商品行+操作ボタン。**StatusBadge に置換**（色分け統一） |
| 通知 `screen_sell.jsx: NotificationsScreen` | `notifications.png` | △→◎ | **最大の差分だった**。中央760px単独レイアウト→**左サイドバー+すべて/未読のみ/重要タブ+chevron** に作り直し |
| 出品フォーム `screen_sell.jsx: SellScreen` | `sell.png` | ○ | 3ステップ見出し+写真10枠+状態ラジオ+各種フォーム。**変更なし** |

## 今回の主な手当て
1. `home.html`（空）→ `新大フリマ.html` への meta refresh で修復。
2. `StatusBadge`（出品中/取引中/売却済み/予約済）を `ui.jsx`+`app.css` に追加し、出品一覧で使用。
3. 通知画面をモック準拠（サイドバー+フィルタタブ）に再構成。フィルタは すべて/未読のみ(件数バッジ)/重要 が機能。

## 残差分（任意の追い込み候補）
- ホームのヒーロー右「スマホ実機 + キャンパス写真 + 吹き出し」の作り込み。
- ログインの袋ロゴ内アイコンを「南京錠入り」へ。
- 各画面のスプライト素材（`index_sheet1/2`）使用は CSS 再現で代替（[[SPRITE_MAP.md]] 参照）。
