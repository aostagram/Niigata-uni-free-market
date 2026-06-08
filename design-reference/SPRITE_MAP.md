# スプライト方針（SPRITE_MAP）

`assets/index_sheet1.png`（バッジ・アイコン・ボタン・ロゴ）と `index_sheet2.png`（水彩・装飾）は
「素材スプライト」だが、**ピクセル座標での切り出しは保守が難しく崩れやすい**ため、
本プロトタイプでは**色・形を CSS / Lucide アイコンで再現する方針**を採用した（見た目の一致を優先）。

## ステータスバッジ（index_sheet1 の #007出品中 / #010取引中 等に相当）

`ui.jsx` の `StatusBadge` + `app.css` の `.status-badge` で再現。

| ラベル | kind | 背景 | 文字色 | 用途 |
|--------|------|------|--------|------|
| 出品中 / 販売中 | `onsale` | `#eaf2d6` | `#6f9226` | 出品中（緑） |
| 取引中 / 予約中 | `dealing` | `#e3edf7` | `#4d7bb0` | 取引中（青） |
| 売却済み / 取引完了 / 完了 | `sold` | `#edefe9` | `#8a8f80` | 売却済（灰） |
| 予約済 | `reserved` | `#fdf0d8` | `#b9852b` | 予約済（琥珀） |

先頭に同色のドット（`::before`）を付け、見本のピル型バッジに寄せている。

## アイコン
- Lucide（`icons.jsx` の `Icon` ラッパ）を使用。袋ロゴは `ShoppingBag`、装飾葉は `Sprout`（`Sprig`）。
- 水彩背景は `app.css` の `.wc-page` / `.wc-soft`（radial-gradient で再現）。

## 実スプライトを使いたくなったら
`index_sheet1.png` を `background-image` にし、`background-position` で各アイコンを切り出す。
その場合は本ファイルに「ラベル → x,y,w,h」表を追記すること。現状は CSS 再現で十分な一致が出ている。
