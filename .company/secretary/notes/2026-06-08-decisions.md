---
date: "2026-06-08"
type: decisions
---

# 意思決定ログ - 2026-06-08

## 決定事項

- 教科書マッチングの GAS 自動化（旧手動02〜06）を `scripts/nextextbook/` に実装完了。予約フォーム送信で在庫ID突合→双方メール→D列「予約済」、完了報告フォーム×2で「完了」。二重予約・在庫ID不明・メール送信失敗は ADMIN_EMAIL 通知で対応。フォーム回答はトリガー種別非依存（質問タイトル優先・entry番号フォールバック）で解決。
- 旧称「ネクストテキストブック / NEXTEXTBOOK」は新大フリマの前身モデルのため、メール件名・本文・通知・コメントの表記をすべて「新大フリマ」に統一（ユーザーに旧称を出さない）。フォルダ名 `scripts/nextextbook/` のみ設計書パス互換のため残置（README に経緯を明記）。技術仕様（CSV/IMPORTRANGE/Netlify/予約prefill/出品フォームURL）は不変。

## 追記（運営自動化の仕上げ）

- 教科書マッチングGASを実シート「売り手シート」へ完全同期（D=ステータス/E=在庫ID/F=書名/G=状態/H=価格/K=出品者gmail、氏名列はL=12を既定とし SELLER_NAME_COL で上書き可）。ステータスは 販売中/予約中/予約済/完了。K列メール空は予約拒否＋ADMIN通知、氏名空はフォールバック。
- 時間主導トリガー追加: dailyCheckStaleReservations（予約済7日滞留）/ dailyCheckMissingSellerEmail（販売中×K空）/ weeklyTriggerHealthReport（実行ログ集計）。installTriggers() で onFormSubmit 含め冪等一括登録。実行ログは管理SS「実行ログ」シートに蓄積。完了報告フォームURLは成立メール末尾に自動追記（prefillで在庫ID自動入力）。
