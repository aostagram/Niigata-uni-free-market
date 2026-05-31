"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        />
      </svg>
      {loading ? "ログイン中…" : "新潟大学のGoogleアカウントでログイン"}
    </button>
  );
}
