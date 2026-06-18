/**
 * ガタフィー — フォーム回答時の自動メール通知（Google Apps Script）
 *
 * 「出品（売り手フォーム）」「取引完了」などの Google フォームに、
 * 回答が来たら回答者へ gatafeefurima@gmail.com から確認メールを送る。
 *
 * 【設置手順】
 * 1. 対象のフォーム（または回答先スプレッドシート）を gatafeefurima@gmail.com で開く
 * 2. フォーム編集画面 右上「⋮」→「スクリプト エディタ」（または スプレッドシート→拡張機能→Apps Script）
 * 3. このコードを貼り付けて保存
 * 4. フォームで「メールアドレスを収集する」を ON にしておく
 * 5. トリガー（時計アイコン）→「トリガーを追加」→
 *      実行する関数: onFormSubmit / イベント: フォーム送信時
 * 6. 初回は権限承認（gatafeefurima@gmail.com で許可）
 *
 * ※ MailApp はスクリプトの所有者アカウント（=この Gmail）から送信されます。
 */
function onFormSubmit(e) {
  try {
    // 回答者のメールを取得（「メールアドレスを収集する」ON が前提）
    var email = e.response ? e.response.getRespondentEmail() : "";
    if (!email && e.namedValues && e.namedValues["メールアドレス"]) {
      email = e.namedValues["メールアドレス"][0];
    }
    if (!email) return;

    var subject = "【ガタフィー】受け付けました";
    var body =
      "ガタフィーをご利用いただきありがとうございます。\n\n" +
      "フォームの内容を受け付けました。担当（運営）が確認し、必要に応じてご連絡します。\n" +
      "学内での手渡し・支払いは、当事者同士で安全な場所・時間に行ってください。\n\n" +
      "— ガタフィー（新潟大学生限定フリマ）\n" +
      "gatafeefurima@gmail.com";

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      name: "ガタフィー",
    });
  } catch (err) {
    console.error(err);
  }
}
