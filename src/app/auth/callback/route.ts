import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail, CONSENT_VERSION } from "@/lib/constants";

/**
 * Google OAuth のリダイレクト先。認証コードをセッションに交換し、
 * 新潟大学ドメイン以外なら強制ログアウトしてエラー表示する。
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (!isAllowedEmail(data.user?.email)) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=domain`);
      }

      // 同意の証跡を記録する。ログイン画面の同意チェックを通過した版を
      // LoginButton が consent クエリで渡してくる。
      // 既に同一版の記録があれば無視(初回同意時刻を保持)。
      // 記録に失敗してもログインは妨げない。
      const consent = searchParams.get("consent");
      if (consent === CONSENT_VERSION && data.user) {
        const { error: consentError } = await supabase
          .from("user_consents")
          .upsert(
            {
              user_id: data.user.id,
              terms_version: CONSENT_VERSION,
              privacy_version: CONSENT_VERSION,
            },
            { onConflict: "user_id,terms_version,privacy_version", ignoreDuplicates: true },
          );
        if (consentError) {
          console.error("同意記録に失敗しました:", consentError.message);
        }
      }

      // 本番(プロキシ背後)では x-forwarded-host を優先する。
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
