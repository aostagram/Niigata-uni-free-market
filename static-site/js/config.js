/**
 * ガタフィー フロント設定。
 *
 * 【Googleログインの本番有効化手順】
 * 1. Google Cloud Console で OAuth 2.0 クライアント ID（種類: ウェブアプリケーション）を作成。
 * 2. 「承認済みの JavaScript 生成元」に公開URLを登録:
 *      https://static-site-nu-blush.vercel.app
 *    （独自ドメインを使う場合はそれも追加）
 * 3. 発行されたクライアントID（末尾 .apps.googleusercontent.com）を下に貼り付ける。
 *
 * 空のままだと「デモ動作」になり、実際のGoogle認証は行われません。
 *
 * 注意: ここに入れるのは「クライアントID」のみ（公開してよい値）。
 * 「クライアントシークレット(GOCSPX-...)」はサーバー側専用の秘密情報で、
 * クライアントサイド方式の本サイトでは使いません。絶対にここに書かないこと。
 */
window.GATAFY_GOOGLE_CLIENT_ID =
  "1073836479788-fcbqghgi5emchvkt7spj12cq2vu8fkov.apps.googleusercontent.com";

/** ログインを許可する大学アカウントのドメイン（cc あり。仕様確定値） */
window.GATAFY_ALLOWED_EMAIL_DOMAIN = "@mail.cc.niigata-u.ac.jp";
