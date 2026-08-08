import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedEmail } from "@/lib/constants";

/**
 * 公開終了後にアクセスを許可するパス。お知らせ（トップ）と法務ページ、
 * クローラ向けのメタファイルだけを残し、それ以外はすべてトップへ戻す。
 * 商品一覧・商品詳細・チャット・出品などアプリ機能は全面停止しており、
 * Google フォーム（出品/購入/取引完了）への導線もこれで到達不能になる。
 */
const SUNSET_ALLOWED_EXACT = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];
const SUNSET_ALLOWED_PREFIX = ["/terms", "/privacy"];

function isSunsetAllowed(pathname: string): boolean {
  if (SUNSET_ALLOWED_EXACT.includes(pathname)) return true;
  return SUNSET_ALLOWED_PREFIX.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** ログイン不要でアクセスできるパス（トップLPはSEO/集客のため公開） */
const PUBLIC_PATHS = [
  "/login",
  "/auth",
  "/terms",
  "/privacy",
  "/stock", // 商品一覧・商品詳細（未ログインでも閲覧可。購入はフォーム）
  "/api/drive-image",
];

/** 完全一致でのみ公開するパス（前方一致だと配下を巻き込むもの） */
const PUBLIC_EXACT_PATHS = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.includes(pathname)) return true;
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/**
 * 全リクエストでセッションを更新し、保護されたページへの未ログインアクセスを
 * ログインページへリダイレクトする。
 * さらに、新潟大学生以外(ドメイン不一致)のセッションは強制ログアウトさせる。
 */
export async function updateSession(request: NextRequest) {
  // 公開終了：お知らせ・法務ページ以外はすべてトップのお知らせへ戻す。
  // セッション処理より前に判定するので、以降の分岐には到達しない。
  if (!isSunsetAllowed(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() を呼ぶことでトークンが必要に応じてリフレッシュされる。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 大学ドメイン以外のアカウントは念のためサーバー側でも弾く。
  if (user && !isAllowedEmail(user.email)) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "domain");
    return NextResponse.redirect(url);
  }

  // 未ログインで保護ページにアクセスした場合はログインへ。
  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ログイン済みでログインページに来たらトップへ。
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
