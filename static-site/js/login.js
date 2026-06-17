/**
 * ログイン画面のロジック。
 * - Google Identity Services（クライアントサイド）でサインイン
 * - 取得したIDトークンの email が新潟大学ドメインか検証
 * - 利用規約・プライバシーへの同意（2チェック）が揃ったら「ログインを完了する」を有効化
 * - GATAFY_GOOGLE_CLIENT_ID 未設定時はデモ動作にフォールバック
 */
(() => {
  const CLIENT_ID = window.GATAFY_GOOGLE_CLIENT_ID || "";
  const ALLOWED_DOMAIN = window.GATAFY_ALLOWED_EMAIL_DOMAIN || "@mail.cc.niigata-u.ac.jp";

  const statusEl = document.querySelector("[data-login-status]");
  const proceedBtn = document.querySelector("[data-login-proceed]");
  const checks = document.querySelectorAll("[data-consent]");
  const buttonWrap = document.getElementById("gsi-button");
  if (!statusEl || !proceedBtn || !buttonWrap) return;

  let signedInEmail = null;

  const setStatus = (msg, kind) => {
    statusEl.textContent = msg;
    statusEl.className = "login-status" + (kind ? " is-" + kind : "");
  };

  const decodeJwt = (token) => {
    try {
      const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(part)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  const allConsented = () => Array.from(checks).every((c) => c.checked);

  const refresh = () => {
    const ready = Boolean(signedInEmail) && allConsented();
    proceedBtn.classList.toggle("is-disabled", !ready);
    proceedBtn.setAttribute("aria-disabled", String(!ready));
  };

  const onSignIn = (email) => {
    if (!email || !email.endsWith(ALLOWED_DOMAIN)) {
      signedInEmail = null;
      setStatus(
        `「${email || "不明"}」は新潟大学のアカウント（${ALLOWED_DOMAIN}）ではありません。大学のGoogleアカウントでログインしてください。`,
        "error",
      );
      refresh();
      return;
    }
    signedInEmail = email;
    setStatus(`${email} でログインしました。下の同意にチェックして「ログインを完了する」へ。`, "ok");
    refresh();
  };

  checks.forEach((c) => c.addEventListener("change", refresh));

  proceedBtn.addEventListener("click", (e) => {
    if (proceedBtn.classList.contains("is-disabled")) {
      e.preventDefault();
      if (!signedInEmail) setStatus("先にGoogleでログインしてください。", "error");
      else setStatus("利用規約とプライバシーポリシーの両方に同意してください。", "error");
      return;
    }
    try {
      localStorage.setItem(
        "gatafy_user",
        JSON.stringify({ email: signedInEmail, consentedAt: new Date().toISOString() }),
      );
    } catch (err) {
      /* localStorage不可でも遷移は許可 */
    }
  });

  const renderFallback = () => {
    buttonWrap.innerHTML =
      '<button type="button" class="btn btn-outline" style="width:100%;justify-content:center">Google でログイン（デモ）</button>';
    buttonWrap.querySelector("button").addEventListener("click", () =>
      onSignIn("demo" + ALLOWED_DOMAIN),
    );
    if (!CLIENT_ID) {
      setStatus(
        "※ 本番のGoogleログインは未設定です（js/config.js に Client ID を設定すると有効化）。現在はデモ動作です。",
        "note",
      );
    }
  };

  const initGoogle = () => {
    if (!(window.google && google.accounts && google.accounts.id)) {
      renderFallback();
      return;
    }
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      hd: ALLOWED_DOMAIN.replace(/^@/, ""),
      callback: (resp) => {
        const data = decodeJwt(resp.credential);
        onSignIn(data && data.email);
      },
    });
    google.accounts.id.renderButton(buttonWrap, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "signin_with",
      locale: "ja",
      logo_alignment: "center",
    });
  };

  refresh();

  if (!CLIENT_ID) {
    renderFallback();
    return;
  }
  // GISスクリプトの読み込み完了を待つ
  if (window.google && google.accounts && google.accounts.id) {
    initGoogle();
  } else {
    window.onGoogleLibraryLoad = initGoogle;
    // フォールバック保険（数秒待っても読めなければデモへ）
    setTimeout(() => {
      if (!(window.google && google.accounts && google.accounts.id) && !buttonWrap.hasChildNodes()) {
        renderFallback();
      }
    }, 4000);
  }
})();
