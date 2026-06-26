/**
 * ガタフィー — フォーム回答時の自動メール通知（Google Apps Script）
 *
 * gatafeefurima@gmail.com（=このスクリプトの所有者アカウント）から、
 * フォーム回答時に「①回答者本人への確認メール」と、購入フォームのときは
 * 「②在庫IDから引いた出品者への購入希望通知メール」を送る。
 *
 * これまでは①（回答者本人）にしか送っていなかったため、
 * 「購入者がフォームを出しても出品者にメールが届かない」状態だった。
 * ②を追加して、出品者にも・購入者にも届くようにする。
 *
 * 【設置手順】（通知したいフォームごとに設置する）
 * 1. 対象フォーム（売り手/購入/取引完了）を gatafeefurima@gmail.com で開く
 * 2. 右上「⋮」→「スクリプト エディタ」
 * 3. このコード全体を貼り付けて保存
 * 4. フォーム設定で「回答」→「メールアドレスを収集する」を ON（①に必須）
 *    ※ これが OFF だと回答者メールが取れず、確認メールが飛ばない
 * 5. トリガー（時計アイコン）→「トリガーを追加」→
 *      関数: onFormSubmit / イベントのソース: フォームから /
 *      イベントの種類: フォーム送信時
 * 6. 初回実行で権限承認（gatafeefurima@gmail.com で許可。Gmail送信＋スプレッド
 *    シート読み取りの権限が必要）
 * 7. 設置確認は、フォームからテスト送信して
 *    「実行数（Executions）」が成功し、メールが届くかを見る
 *
 * ※ ②（出品者への通知）は、購入フォール側の在庫ID質問と、在庫マスター
 *   シートの「出品者メール列」を突き合わせて送る。フォームのタイトルに
 *   「購入」「問い合わせ」「買い手」のいずれかが含まれるときだけ動く
 *   （取引完了フォール等で誤送信しないためのガード）。
 */

// ===== 設定（src/lib/links.ts と一致させる） =====
var ADMIN_SHEET_ID = "1raQMxjZ3HGdq0f-CBxsNw1Q27bviHkpxU4SNoxa7bgY";
var INVENTORY_GID = 989667529; // 在庫マスター（売り手回答）タブの gid
var SENDER_NAME = "ガタフィー";
var OFFICIAL_EMAIL = "gatafeefurima@gmail.com";

function onFormSubmit(e) {
  try {
    var values = (e && e.namedValues) || {};
    var respondent = getRespondentEmail_(e, values);

    // ① 回答者本人へ確認メール（メール収集ONが前提）
    if (respondent) {
      MailApp.sendEmail({
        to: respondent,
        name: SENDER_NAME,
        subject: "【ガタフィー】受け付けました",
        body: respondentBody_(),
      });
    }

    // ② 購入フォームのときだけ、在庫IDから出品者を引いて通知
    if (isBuyerForm_()) {
      var stockId = pickValue_(values, ["在庫ID", "在庫", "商品番号", "商品ID"]);
      if (stockId) {
        var sellerEmail = lookupSellerEmail_(stockId);
        if (sellerEmail && sellerEmail.toLowerCase() !== (respondent || "").toLowerCase()) {
          MailApp.sendEmail({
            to: sellerEmail,
            name: SENDER_NAME,
            subject: "【ガタフィー】あなたの出品に購入希望が届きました",
            body: sellerBody_(stockId, respondent),
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

/** 回答者のメールアドレスを取得（収集ON or 「メール」を含む質問から）。 */
function getRespondentEmail_(e, values) {
  var email = "";
  try {
    if (e && e.response && e.response.getRespondentEmail) {
      email = e.response.getRespondentEmail() || "";
    }
  } catch (_) {}
  if (!email && values) {
    for (var key in values) {
      if (/メール|mail|gmail|アドレス/i.test(key)) {
        var v = (values[key] && values[key][0]) || "";
        if (v && /@/.test(v)) { email = v; break; }
      }
    }
  }
  return email.trim();
}

/** namedValues から、候補見出し（部分一致）に合う最初の値を返す。 */
function pickValue_(values, candidates) {
  for (var i = 0; i < candidates.length; i++) {
    for (var key in values) {
      if (key.indexOf(candidates[i]) !== -1) {
        var v = (values[key] && values[key][0]) || "";
        if (v) return String(v).trim();
      }
    }
  }
  return "";
}

/** このフォームが「購入・問い合わせ」フォームかどうか（誤送信ガード）。 */
function isBuyerForm_() {
  try {
    var title = FormApp.getActiveForm().getTitle() || "";
    return /購入|問い合わせ|問合せ|買い手|買い/.test(title);
  } catch (_) {
    return false; // スプレッドシート連動など、フォーム取得不可時は安全側で送らない
  }
}

/** 在庫マスターを読み、在庫ID → 出品者メール を引く。 */
function lookupSellerEmail_(stockId) {
  try {
    var ss = SpreadsheetApp.openById(ADMIN_SHEET_ID);
    var sheet = null;
    var sheets = ss.getSheets();
    for (var s = 0; s < sheets.length; s++) {
      if (sheets[s].getSheetId() === INVENTORY_GID) { sheet = sheets[s]; break; }
    }
    if (!sheet) sheet = ss.getSheets()[0];

    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return "";
    var header = data[0].map(function (h) { return String(h).trim(); });

    var idCol = header.indexOf("在庫ID");
    if (idCol < 0) idCol = indexOfContains_(header, ["在庫ID", "在庫", "商品番号"]);
    // 出品者メール列：「出品者」かつメール系、無ければメール系の列。
    var emailCol = -1;
    for (var c = 0; c < header.length; c++) {
      if (header[c].indexOf("出品者") !== -1 && /gmail|mail|メール|アドレス/i.test(header[c])) {
        emailCol = c; break;
      }
    }
    if (emailCol < 0) emailCol = indexOfMatch_(header, /gmail|e-?mail|メールアドレス|アドレス/i);
    if (idCol < 0 || emailCol < 0) return "";

    var target = String(stockId).trim();
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][idCol]).trim() === target) {
        var em = String(data[r][emailCol]).trim();
        if (em && /@/.test(em)) return em;
      }
    }
  } catch (err) {
    console.error("lookupSellerEmail_:", err);
  }
  return "";
}

function indexOfContains_(header, candidates) {
  for (var i = 0; i < candidates.length; i++) {
    for (var c = 0; c < header.length; c++) {
      if (header[c].indexOf(candidates[i]) !== -1) return c;
    }
  }
  return -1;
}

function indexOfMatch_(header, re) {
  for (var c = 0; c < header.length; c++) {
    if (re.test(header[c])) return c;
  }
  return -1;
}

function respondentBody_() {
  return (
    "ガタフィーをご利用いただきありがとうございます。\n\n" +
    "フォームの内容を受け付けました。出品者と直接やり取りのうえ、受け渡し・\n" +
    "支払いは当事者どうしで安全な場所・時間にお願いします（ガタフィーは個人間\n" +
    "取引をサポートする掲示板で、場所の指定や金銭の仲介は行いません）。\n\n" +
    "— " + SENDER_NAME + "（新潟大学生限定のフリマ掲示板）\n" +
    OFFICIAL_EMAIL
  );
}

function sellerBody_(stockId, buyerEmail) {
  return (
    "あなたの出品（在庫ID: " + stockId + "）に購入希望が届きました。\n\n" +
    (buyerEmail ? "購入希望者の連絡先: " + buyerEmail + "\n\n" : "") +
    "購入希望者と連絡を取り、受け渡し日時・場所を相談してください。\n" +
    "受け渡し・支払いは日中の人目のある場所で、当事者どうしで安全に行って\n" +
    "ください。\n\n" +
    "— " + SENDER_NAME + "（新潟大学生限定のフリマ掲示板）\n" +
    OFFICIAL_EMAIL
  );
}
