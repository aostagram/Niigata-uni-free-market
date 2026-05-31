import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 の Proxy(旧 Middleware)。全リクエストでセッションを更新し、
// 未ログイン/ドメイン外アクセスを制御する。
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 以下を除く全パスにマッチ:
     * - _next/static, _next/image (Next.js の静的アセット)
     * - favicon.ico, 画像/フォントなどの静的ファイル
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
