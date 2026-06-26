import Link from "next/link";
import { Bell, Plus, MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";
import { FORMS } from "@/lib/links";
import type { Profile } from "@/lib/types";

export async function Header() {
  // 公開ページ（トップ等）でも表示するため、未ログインでも壊れないようにする。
  // ログイン中ならプロフィールを取得し、未ログインなら「ログイン」導線を出す。
  const user = await getCurrentUser();
  let profile: Profile | null = null;
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = (data as Profile) ?? null;
  }

  return (
    <header
      className="sticky top-0 z-30 border-b border-line-soft"
      style={{ background: "rgba(251,253,247,.86)", backdropFilter: "blur(10px)" }}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-2 px-3 py-3 md:gap-3 md:px-6">
        <Link
          href="/"
          aria-label="ガタフィー ホーム"
          className="flex min-w-0 items-center gap-1.5 md:gap-2.5"
        >
          <Logo />
          {/* ブランド表記（ロゴの右）。スマホでも常に表示。1行・縦棒区切り。
             狭い画面では説明文が省略されるが、ロゴ名とボタンは崩れない。 */}
          <span className="flex min-w-0 items-baseline gap-1.5">
            <span className="font-round shrink-0 text-[15px] font-bold text-brand-deeper sm:text-[17px]">
              ガタフィー
            </span>
            <span className="shrink-0 text-[11px] text-brand-deep/50 sm:text-[12px]">
              |
            </span>
            <span className="truncate text-[10px] text-brand-deep sm:text-[11px]">
              新潟発のフリマ掲示板
            </span>
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-5">
          {/* desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/" className="nav-link">
              ホーム
            </Link>
            <Link href="/#listings" className="nav-link">
              商品を探す
            </Link>
            <Link href="/#voices" className="nav-link">
              お客様の声
            </Link>
          </nav>

          {/* チャット: スマホはボトムタブに集約するため PC のみ表示 */}
          <Link
            href="/chat"
            aria-label="チャット"
            className="relative hidden p-1.5 text-brand-deep md:block"
          >
            <MessageSquare size={22} />
          </Link>

          {profile && (
            <Link
              href="/notifications"
              aria-label="通知"
              className="relative p-1.5 text-brand-deep"
            >
              <Bell size={22} />
            </Link>
          )}

          {/* 出品: スマホはボトムタブに集約するため PC のみ表示。
             .btn{display:inline-flex} が hidden を上書きするため、
             .btn ではないラッパー側で表示制御する。 */}
          <span className="hidden md:inline-flex">
            <a
              href={FORMS.sellerListing}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary px-5 py-2.5 text-sm"
            >
              <Plus size={17} />
              <span>出品する</span>
            </a>
          </span>

          {!profile && (
            <Link href="/login" className="btn btn-ghost px-5 py-2.5 text-sm">
              ログイン
            </Link>
          )}

          {profile && (
            <div className="group relative">
              <button
                className="flex items-center rounded-full"
                aria-label="アカウント"
              >
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-panel-2 text-sm font-bold text-brand-deep">
                    {profile.full_name.charAt(0)}
                  </span>
                )}
              </button>
              <div className="invisible absolute right-0 top-full z-10 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <div className="border-b border-line-soft px-4 py-2 text-xs text-ink-faint">
                  {profile.full_name}
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-panel"
                >
                  マイページ
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-coral hover:bg-panel"
                  >
                    ログアウト
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
