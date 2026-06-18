"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MessageSquare, Plus, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FORMS } from "@/lib/links";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (p: string) => boolean;
  external?: boolean;
};

/**
 * モバイル用のボトムタブバー(デザイン準拠)。
 * 実アプリのルートに合わせた4タブ。md 以上では非表示にし、
 * 上部ヘッダーのナビに委ねる。
 */
const TABS: Tab[] = [
  { href: "/", label: "ホーム", icon: House, match: (p) => p === "/" },
  {
    href: "/chat",
    label: "チャット",
    icon: MessageSquare,
    match: (p) => p.startsWith("/chat"),
  },
  {
    href: FORMS.sellerListing,
    label: "出品",
    icon: Plus,
    match: () => false,
    external: true,
  },
  {
    href: "/profile",
    label: "マイページ",
    icon: User,
    match: (p) => p.startsWith("/profile"),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center md:hidden">
      <nav
        className="pointer-events-auto flex w-full max-w-3xl border-t border-line bg-white/95 px-3 py-2 backdrop-blur"
        style={{ boxShadow: "0 -6px 24px -16px rgba(95,129,40,.4)" }}
      >
        {TABS.map((t) => {
          const on = t.match(pathname);
          const Icon = t.icon;
          const inner = (
            <>
              <span className="tab-pill flex items-center justify-center rounded-full px-[18px] py-[5px] transition-colors">
                <Icon size={21} strokeWidth={on ? 2.3 : 2} />
              </span>
              <span>{t.label}</span>
            </>
          );
          return t.external ? (
            <a
              key={t.href}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tab-item"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={t.href}
              href={t.href}
              className={`tab-item${on ? " active" : ""}`}
            >
              {inner}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
