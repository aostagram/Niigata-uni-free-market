# 開発（エンジニアリング）

## 役割
新大フリマ（Next.js + Supabase）の実装・設計・バグ対応を担当する。
**コード変更を行えるのはこの部署のみ。**

## ルール
- 技術ドキュメント・設計書は `docs/topic-name.md`
- デバッグログは `debug-log/YYYY-MM-DD-issue-name.md`
- デバッグのステータス: open → investigating → resolved → closed
- 設計書は必ず「概要」「設計・方針」「詳細」の構成にする
- バグ修正時は「再発防止」セクションを必ず記入
- 技術的な意思決定は `secretary/notes/` に1行で記録する（プロジェクト共通ルール）

## プロジェクト固有ルール
- **コード変更はこの部署のみ**が行う。creative / marketing は仕様・成果物の Markdown までで、実コードは触らない。
- 成果物（設計書・調査・手順）は `engineering/` 配下に Markdown で保存する。
- 技術スタック: Next.js 16 (App Router/TS) / Tailwind v4 / Supabase（Auth・Postgres・Storage・Realtime）。
- 学生認証ドメインは `@mail.cc.niigata-u.ac.jp`（cc あり）。`src/lib/constants.ts` と `supabase/schema.sql` の両方で整合させる。
- アプリ内決済は実装しない（対面手渡し前提）。

## フォルダ構成
- `docs/` - 技術ドキュメント・設計書
- `debug-log/` - デバッグ・バグ調査ログ
