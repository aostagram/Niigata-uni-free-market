import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";

export async function Header() {
  const profile = await requireProfile();

  return (
    <header
      className="sticky top-0 z-30 border-b border-line-soft"
      style={{ background: "rgba(251,253,247,.86)", backdropFilter: "blur(10px)" }}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link href="/" aria-label="新大フリマ ホーム">
          <Logo />
        </Link>

        {/* desktop nav */}
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          <Link href="/#getting-started" className="nav-link">
            はじめての方へ
          </Link>
          <Link href="/#guide" className="nav-link">
            ガイド
          </Link>
          <Link href="/#faq" className="nav-link">
            よくある質問
          </Link>
        </nav>

        <Link
          href="/notifications"
          aria-label="通知"
          className="relative ml-auto p-1.5 text-brand-deep md:ml-0"
        >
          <Bell size={22} />
        </Link>

        <Link href="/items/new" className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus size={17} />
          <span className="hidden sm:inline">出品する</span>
        </Link>

        <div className="group relative">
          <button className="flex items-center rounded-full" aria-label="アカウント">
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
      </div>
    </header>
  );
}
