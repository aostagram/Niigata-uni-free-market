---
description: Claude Design のエクスポートURLを取り込み、差分を src/ に実装する
argument-hint: <claude-design-export-url>
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, WebFetch
---

# Claude Design 取り込み → 実装

Claude Design (claude.ai/design) のハンドオフバンドルを取り込み、デザイン変更を
このプロジェクトの実コード（`src/`、Next.js 16 / React 19 / Tailwind v4）に反映する。

引数で渡されたエクスポートURL: **$ARGUMENTS**

## 手順（厳守）

1. **URL未指定なら中止**してユーザーに `claude.ai/design` のエクスポートURLを求める。
   （URLは通常 `https://api.anthropic.com/v1/design/h/<id>` の形）

2. **取得**: `WebFetch` で上記URLを取得する。中身は gzip(tar.gz) なので、
   WebFetch がバイナリを保存したパス（結果に出る `.bin`）を控える。

3. **展開して中身を読む**:
   ```bash
   mkdir -p /tmp/cdesign && rm -rf /tmp/cdesign/* && tar xzf <保存された.binのパス> -C /tmp/cdesign
   find /tmp/cdesign -type f | sort
   ```
   - `README.md` を読む。
   - `chats/*.md`（会話ログ）を**必ず**読む。ユーザーの意図と最終的に着地した方向はここにある。
   - `project/` 配下の HTML/CSS/JS プロトタイプを上から下まで読み、import も辿る。

4. **空バンドルの検出**: `project/` が無い／チャットが空なら、それを正直に報告して**実装はしない**。
   勝手にデザインを捏造しないこと。

5. **差分の把握**: プロトタイプを `design-reference/*.html`（前回の状態）および
   実コード `src/`（特に `src/app/(main)/`, `src/components/`, `src/app/globals.css`）と
   比較し、「何が変わったか（配色・レイアウト・コピー・新要素）」を箇条書きで整理する。

6. **実装方針の提示 → 承認 → 実装**:
   - 変更点と影響ファイルを先に提示する。
   - ブランドトークンが変わった場合は `src/app/globals.css` と
     `design-reference/{styles.css,tailwind.config.js}` の**両方**を更新（一致させる）。
   - プロトタイプの内部構造をそのまま写経せず、**見た目を**既存の React/Tailwind 規約に合わせて再現する。
   - ロジック（Supabase 連携・リアルタイム・画像圧縮）は壊さない。見た目だけ変える。

7. **検証**: 実装後に型チェックを通す。
   ```bash
   npx tsc --noEmit -p tsconfig.json
   ```
   失敗したら直し、結果を正直に報告する。

8. **design-reference の更新**: 反映済みデザインを次回差分の基準にするため、
   該当する `design-reference/*.html` も新しい状態に更新しておく。

## 注意
- `AGENTS.md` の指示に従い、Next.js のAPIは `node_modules/next/dist/docs/` を確認してから書く。
- ユーザーに確認なくコミット・プッシュはしない。
