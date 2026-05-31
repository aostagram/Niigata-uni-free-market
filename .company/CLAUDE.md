# Company - 仮想組織管理システム

## オーナープロフィール

- **事業・活動**: 新潟大学生限定フリマアプリ「新大フリマ」（Next.js + Supabase の Web アプリ）
- **目標・課題**: メルカリ風MVPの構築 / 新潟大学生限定の学生認証 / キャンパス内での対面手渡し取引
- **作成日**: 2026-05-31

## 組織構成

```
.company/
├── CLAUDE.md
├── secretary/          # 窓口・常設
│   ├── CLAUDE.md
│   ├── inbox/
│   ├── todos/
│   └── notes/
├── engineering/        # 実装・設計・バグ（コード変更はここのみ）
│   ├── CLAUDE.md
│   ├── docs/
│   └── debug-log/
├── creative/           # UI/UX・ブランド・Figma方針
│   ├── CLAUDE.md
│   ├── briefs/
│   └── assets/
└── marketing/          # SNS・LP・キャンペーン・コピー
    ├── CLAUDE.md
    ├── content-plan/
    └── campaigns/
```

## 部署一覧

| 部署 | フォルダ | 役割 |
|------|---------|------|
| 秘書室 | secretary | 窓口・相談役。TODO管理、壁打ち、メモ。常設。 |
| エンジニアリング | engineering | 実装・設計・バグ対応。**コード変更はこの部署のみ。** |
| クリエイティブ | creative | UI/UX、ブランド、Figma方針。デザインブリーフは `creative/briefs/`。 |
| マーケティング | marketing | SNS・LP・キャンペーン・広告コピー。広告文は `marketing/content-plan/`。 |

## プロジェクト固有ルール

- 成果物は各部署フォルダに **Markdown** で保存する。
- **コード変更は engineering のみ**が行う。
- デザイン成果物は `creative/briefs/`、広告文は `marketing/content-plan/` に保存する。
- 意思決定は `secretary/notes/`（`YYYY-MM-DD-decisions.md`）に必ず **1行** で記録する。

## 運営ルール

### 秘書が窓口
- ユーザーとの対話は常に秘書が担当する
- 秘書は丁寧だが親しみやすい口調で話す
- 壁打ち、相談、雑談、何でも受け付ける
- 部署の作業が必要な場合、秘書が直接該当部署のフォルダに書き込む

### 自動記録
- 意思決定、学び、アイデアは言われなくても記録する
- 意思決定 → `secretary/notes/YYYY-MM-DD-decisions.md`
- 学び → `secretary/notes/YYYY-MM-DD-learnings.md`
- アイデア → `secretary/inbox/YYYY-MM-DD.md`

### 同日1ファイル
- 同じ日付のファイルがすでに存在する場合は追記する。新規作成しない

### 日付チェック
- ファイル操作の前に必ず今日の日付を確認する

### ファイル命名規則
- **日次ファイル**: `YYYY-MM-DD.md`
- **トピックファイル**: `kebab-case-title.md`

### TODO形式
```markdown
- [ ] タスク内容 | 優先度: 高/通常/低 | 期限: YYYY-MM-DD
- [x] 完了タスク | 完了: YYYY-MM-DD
```

### コンテンツルール
1. 迷ったら `secretary/inbox/` に入れる
2. 既存ファイルは上書きしない（追記のみ）
3. 追記時はタイムスタンプを付ける

## パーソナライズメモ

- **プロダクト名**: 新大フリマ（Niigata Uni Free Market）。新潟大学非公式・学生有志の個人運営サービス。
- **技術スタック**: Next.js 16 (App Router/TS) + Tailwind CSS v4 + Supabase（Auth/Postgres/Storage/Realtime）。ホスティングは Vercel 想定。
- **重要な設計判断**:
  - 学生認証は Google OAuth を **`@mail.cc.niigata-u.ac.jp`**（cc あり）に限定。クライアント/Proxy/OAuthコールバック/DBトリガーの多段で検証。
  - **アプリ内決済なし**。お金のやり取りはキャンパスでの対面受け渡し時のみ（資金決済法・古物営業法などの規制回避のための判断）。
  - 取引対象は当面 **教科書・ゲーム** の2カテゴリ。
  - 画像は client 側で WebP/800px/100KB に圧縮してから Supabase Storage(`item-images`)へ（無料枠1GB/5GBを死守）。
- **現状(2026-05-31時点)**: アプリの土台と主要機能（認証・出品・一覧・詳細・リアルタイムチャット・画像圧縮アップロード・RLS付きSQLスキーマ）を実装済み。コンパイル/型/Lintはクリーン。
- **ブロッカー**: 開発マシンのディスク残量が逼迫（約345MB）。`next build` の最終段階が ENOSPC で失敗、`npm run dev` 未検証。容量確保が最優先。
- **次の作業**: ①ディスク容量確保 → ②Supabaseプロジェクト作成+schema.sql実行 → ③Google OAuth設定 → ④.env.local設定 → ⑤dev起動で動作確認。
