"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_EMAIL_DOMAIN, CONSENT_VERSION } from "@/lib/constants";
import { ConsentDocBox } from "@/components/ConsentDocBox";
import { TERMS, PRIVACY } from "@/lib/legal";

function GoogleG() {
  return (
    <svg width={22} height={22} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const ok = agreeTerms && agreePrivacy;

  async function handleLogin() {
    if (!ok) return;
    setLoading(true);
    const supabase = createClient();
    // 同意した規約・プライバシーの版をコールバックへ渡し、
    // サーバー側で同意の証跡(user_consents)を記録する。
    const redirectTo = `${window.location.origin}/auth/callback?consent=${encodeURIComponent(
      CONSENT_VERSION,
    )}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          // 新潟大学の Google Workspace アカウントを優先表示するヒント。
          // (最終的なドメイン検証はサーバー側で行う)
          hd: ALLOWED_EMAIL_DOMAIN,
          prompt: "select_account",
        },
      },
    });
    if (error) {
      setLoading(false);
      alert("ログインに失敗しました。時間をおいて再度お試しください。");
    }
  }

  return (
    <div>
      <div className="rounded-[var(--radius-ds)] border-[1.5px] border-line bg-white/60 p-5">
        <p className="font-round mb-3 text-sm font-medium text-brand-deep">
          ログインするには、利用規約とプライバシーポリシーを
          <b>それぞれ一番下まで読んで</b>、両方に同意してください。
        </p>
        <ConsentDocBox
          doc={TERMS}
          fullHref="/terms"
          label="利用規約に同意します"
          checked={agreeTerms}
          onChange={setAgreeTerms}
        />
        <ConsentDocBox
          doc={PRIVACY}
          fullHref="/privacy"
          label="プライバシーポリシーに同意します"
          checked={agreePrivacy}
          onChange={setAgreePrivacy}
        />

        <button
          onClick={handleLogin}
          disabled={!ok || loading}
          className={`btn mt-3.5 w-full py-4 text-[15px] ${
            ok ? "btn-primary" : "btn-disabled"
          }`}
          style={
            ok
              ? { background: "#fff", color: "var(--ink)", border: "1.5px solid var(--line)", boxShadow: "var(--shadow-soft)" }
              : undefined
          }
        >
          {ok && <GoogleG />}
          {loading
            ? "ログイン中…"
            : ok
              ? "新潟大学の Google アカウントでログイン"
              : "上記に同意してログイン"}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 text-[13.5px] leading-[1.7] text-ink-soft">
        <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-brand text-white">
          <AlertCircle size={20} />
        </span>
        <span>
          チェックが入っていない場合は、ログインボタンを押すことができません。
        </span>
      </div>
    </div>
  );
}
