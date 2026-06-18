import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";

/**
 * Google ログイン直後のプロフィール作成欄。
 * ニックネーム未設定のユーザーが requireProfile からここへ誘導される。
 * (main) レイアウト外なのでヘッダー（requireProfile）のループは起きない。
 */
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile = data as Profile | null;

  // すでにニックネーム設定済みならホームへ。
  if (profile?.nickname) redirect("/");

  return (
    <main className="wc-page flex min-h-dvh flex-col items-center px-5 py-12">
      <div className="fade-up w-full max-w-[520px]">
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt="ガタフィー"
            className="mx-auto mb-4 h-auto w-[min(280px,72%)] object-contain"
          />
          <h1 className="font-round text-[22px] font-bold text-ink">
            ようこそ、ガタフィーへ！
          </h1>
          <p className="mt-2 text-sm leading-[1.8] text-ink-soft">
            はじめにプロフィールを作成しましょう。
            <br />
            ニックネームでチャットや出品ができます。
          </p>
        </div>

        <div className="ds-card p-6">
          <ProfileForm submitLabel="この内容で始める" />
        </div>
      </div>
    </main>
  );
}
