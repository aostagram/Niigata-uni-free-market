---
type: assets
project: 新大フリマ
created: "2026-05-31"
---

# アセット管理

## カラートークン（Tailwind ⇄ Figma 対応・整合チェック済み）

`src/app/globals.css` の `:root` / `@theme inline` を正とする。**ブリーフとの差分なし（2026-05-31 確認）**。

| トークン | 値 | Tailwind 利用例 | Figmaスタイル名 |
|----------|----|----------------|----------------|
| `--brand` | `#0b7a4b` | `bg-brand` / `text-brand` / `border-brand` | Brand/Green |
| `--brand-dark` | `#075c38` | `hover:bg-brand-dark` | Brand/Green-Dark |
| `--background` | `#f7f7f8` | `bg-background` | Surface/Bg |
| `--foreground` | `#1a1a1a` | 既定文字色 | Text/Default |
| amber-50 / amber-900 | Tailwind既定 | 免責表示 | Notice/Disclaimer |
| red-50 / red-800 | Tailwind既定 | 安全バナー | Alert/Safety |

→ engineering への連携: **追加実装は不要**（既存トークンがブリーフ通り）。新トークンを足す場合は globals.css に追記し本表を更新。

## ロゴ

| アセット | 内容 | 実装先(engineering) | 状態 |
|----------|------|---------------------|------|
| logo mark | 緑角丸＋「新」＋値札アクセント | `public/logo.svg` | 仕様確定 → 実装依頼 |
| favicon | 同マーク | `src/app/icon.svg` | 仕様確定 → 実装依頼 |

仕様の詳細は `logo-spec.md` を参照。

## その他（今後）
- [ ] 空状態・ローディング用イラスト（トーン: やわらかい線、緑アクセント）
- [ ] OGP画像（SNSシェア用 1200×630、ローンチ告知と連動）
