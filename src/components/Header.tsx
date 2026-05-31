import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export async function Header() {
  const profile = await requireProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="新大フリマ" className="h-8 w-8" />
          <span className="hidden sm:inline">新大フリマ</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link
            href="/chat"
            className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
          >
            メッセージ
          </Link>
          <Link
            href="/items/new"
            className="rounded-lg bg-brand px-3 py-2 font-medium text-white hover:bg-brand-dark"
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
