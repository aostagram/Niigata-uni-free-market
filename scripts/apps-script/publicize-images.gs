/**
 * ガタフィー — 出品フォームの写真を「リンクを知っている全員が閲覧可」に自動設定
 * （これをしないと Drive 上の写真はサイトに表示されません）
 *
 * 【設置手順】
 * 1. 出品（売り手）フォームを gatafeefurima@gmail.com で開く
 * 2. 右上「⋮」→「スクリプト エディタ」
 * 3. このコードを貼り付けて保存
 * 4. トリガー（時計アイコン）→「トリガーを追加」→
 *      実行する関数: onSellerFormSubmit / イベントのソース: フォームから /
 *      イベントの種類: フォーム送信時
 * 5. 初回は権限承認（gatafeefurima@gmail.com で許可。Drive権限が必要）
 *
 * これで、出品時にアップロードされた画像が自動で公開設定になり、
 * サイト（在庫一覧）にサムネイルが表示されます。
 */
function onSellerFormSubmit(e) {
  try {
    var responses = e.response.getItemResponses();
    for (var i = 0; i < responses.length; i++) {
      var item = responses[i];
      if (item.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) {
        var fileIds = item.getResponse(); // アップロードされたファイルIDの配列
        for (var j = 0; j < fileIds.length; j++) {
          try {
            DriveApp.getFileById(fileIds[j]).setSharing(
              DriveApp.Access.ANYONE_WITH_LINK,
              DriveApp.Permission.VIEW
            );
          } catch (err) {
            console.error("share失敗 " + fileIds[j] + ": " + err);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * 既存の出品ぶんをまとめて公開にする（過去アップロード分の一括処理）。
 * フォルダ名の指定は不要。このフォームの全回答から画像を探して公開する。
 * Apps Script エディタで関数を「publicizeExistingUploads」にして▶実行を1回押すだけ。
 */
function publicizeExistingUploads() {
  var form = FormApp.getActiveForm();
  var responses = form.getResponses();
  var count = 0;
  for (var r = 0; r < responses.length; r++) {
    var items = responses[r].getItemResponses();
    for (var i = 0; i < items.length; i++) {
      if (items[i].getItem().getType() === FormApp.ItemType.FILE_UPLOAD) {
        var ids = items[i].getResponse();
        for (var j = 0; j < ids.length; j++) {
          try {
            DriveApp.getFileById(ids[j]).setSharing(
              DriveApp.Access.ANYONE_WITH_LINK,
              DriveApp.Permission.VIEW
            );
            count++;
          } catch (err) {
            console.error("share失敗 " + ids[j] + ": " + err);
          }
        }
      }
    }
  }
  console.log("公開にしたファイル数: " + count);
}
