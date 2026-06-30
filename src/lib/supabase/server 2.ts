import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * サーバー(サーバーコンポーネント / Server Action / Route Handler)用の
 * Supabase クライアント。リクエストごとの Cookie を読み書きする。
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // サーバーコンポーネントから呼ばれた場合は set できないが、
            // middleware がセッションを更新するので無視してよい。
          }
        },
      },
    },
  );
}
