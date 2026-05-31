import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export async function Header() {
  const profile = await requireProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-brand/10 bg-white/85 backdrop-blur">
      {/* 上端の水彩ウォッシュ(淡い深緑→黄緑) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-r from-brand-pale/60 via-transparent to-brand-lighter/30" />
      <div className="relative mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          {/* ロゴを水彩のにじみ円に載せる */}
          <span className="wc-bleed flex h-9 w-9 items-center justify-center bg-gradient-to-br from-brand-lighter to-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="新大フリマ" className="h-6 w-6" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-brand-dark">新大フリマ</span>
            <span className="hidden text-[9px] font-medium tracking-wide text-brand/60 sm:inline">
              NIIGATA UNIVERSITY FLEA MARKET
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link
            href="/chat"
            className="rounded-lg px-3 py-2 text-gray-700 hover:bg-brand-pale/70"
          >
            メッセージ
          </Link>
          <Link
            href="/items/new"
            className="rounded-full bg-gradient-to-br from-brand-light to-brand-dark px-4 py-2 font-medium text-white shadow-sm transition hover:brightness-105"
          >
            出品する
          </Link>
          <div className="group relative">
            <button className="flex items-center rounded-full">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                  {profile.full_name.charAt(0)}
                </span>
              )}
            </button>
            <div className="invisible absolute right-0 top-full z-10 w-44 rounded-xl border border-gray-200 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
                {profile.full_name}
              </div>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                マイページ
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
