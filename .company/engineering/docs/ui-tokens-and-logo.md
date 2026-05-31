---
type: doc
topic: UIトークン整合 & ロゴ実装
status: resolved
created: "2026-05-31"
---

# UIトークン整合 & ロゴ実装（creative→engineering 連携）

## 概要
creative の `briefs/app-ui-brief.md` / `assets/logo-spec.md` を受けた実装。

## 設計・方針
- カラートークンは `src/app/globals.css` を正とし、Figma スタイルと値を一致させる。

## 詳細
### トークン整合（差分チェック）
- ブリーフの色（brand `#0b7a4b` / brand-dark `#075c38` / bg `#f7f7f8` / fg `#1a1a1a`）は
  既存 `globals.css` と**完全一致**。→ 追加実装なし。

### ロゴ実装（承認版SVGを反映）
- 追加: `public/logo.svg`（ヘッダー/ログイン用）、`src/app/icon.svg`（favicon・Next.jsが自動認識）
- 変更: `src/components/Header.tsx` … 文字「新」ボックス → `<img src="/logo.svg" class="h-8 w-8">`
- 変更: `src/app/login/page.tsx` … 文字ボックス → `<img src="/logo.svg" class="h-16 w-16">`
- 検証: `tsc --noEmit` / `eslint` ともにエラーなし。

## 参考
- creative: `.company/creative/assets/logo-spec.md`, `asset-list.md`

## 再発防止 / 今後
- 「新」は SVG `<text>`（システムフォント）。将来パス化してフォント非依存にする（creative 側TODO）。
