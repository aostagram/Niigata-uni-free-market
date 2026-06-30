---
type: asset-spec
asset: ロゴマーク
status: approved
created: "2026-05-31"
---

# 新大フリマ ロゴマーク 仕様

## コンセプト
「新潟大学（新）」×「フリマ＝値札」。緑の角丸スクエアに白の「新」、右上に小さな値札（タグ）アクセントで“売り買い”を示す。
正方形なのでアバター/アプリアイコン/favicon に流用しやすい。

## 仕様
- viewBox: `0 0 64 64`（正方形・スケーラブル）
- 背景: 角丸スクエア `rx=14`、塗り `#0b7a4b`(`--brand`)
- 主役: 白の「新」、中央やや左、太め(ゴシック)
- アクセント: 右上に白い小さな値札（45°）＋穴
- 余白: 周囲に視覚的マージンを確保（最小表示でも潰れない）

## 承認版 SVG（engineering はこれを `public/logo.svg` / `src/app/icon.svg` に実装）

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="新大フリマ">
  <rect width="64" height="64" rx="14" fill="#0b7a4b"/>
  <text x="29" y="44" font-family="'Hiragino Sans','Noto Sans JP',sans-serif"
        font-size="34" font-weight="700" fill="#ffffff" text-anchor="middle">新</text>
  <g transform="rotate(45 50 16)">
    <rect x="44" y="10" width="14" height="9" rx="2" fill="#ffffff"/>
    <circle cx="46.5" cy="14.5" r="1.6" fill="#0b7a4b"/>
  </g>
</svg>
```

## 使い分け
- ヘッダー: 32×32 で表示（`public/logo.svg`）。横にワードマーク「新大フリマ」。
- ログイン: 64×64 で大きく表示。
- favicon: `src/app/icon.svg`（Next.js が自動でファビコン化）。

## 注意 / 今後
- 「新」は SVG `<text>`（システムのゴシック）で描画。将来はアウトライン化（パス化）してフォント非依存にするのが望ましい。
- ワードマーク（ロゴタイプ）の作字は次フェーズ。現状はテキスト表示で運用。
