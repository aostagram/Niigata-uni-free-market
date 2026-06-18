// 一時プレビュー（ログイン後ホームの見た目確認用）。確認後に削除する。
import HomePage from "../(main)/page";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Bell, Plus, MessageSquare } from "lucide-react";

// (main)/layout.tsx と同じ構造を、認証なしで再現したプレビュー用ヘッダー。
function PreviewHeader() {
  return (
    <header
      className="sticky top-0 z-30 border-b border-line-soft"
      style={{ background: "rgba(251,253,247,.86)", backdropFilter: "blur(10px)" }}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden leading-tight sm:block">
            <span className="font-round block text-[17px] font-bold text-brand-deeper">
              ガタフィー
            </span>
            <span className="block text-[11px] text-brand-deep">
              新潟発のフリマアプリ
            </span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          <span className="nav-link">ホーム</span>
          <span className="nav-link">商品を探す</span>
          <span className="nav-link">お客様の声</span>
        </nav>
        <span className="relative ml-auto p-1.5 text-brand-deep md:ml-0">
          <MessageSquare size={22} />
        </span>
        <span className="relative p-1.5 text-brand-deep">
          <Bell size={22} />
        </span>
        <span className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus size={17} />
          <span className="hidden sm:inline">出品する</span>
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-panel-2 text-sm font-bold text-brand-deep">
          が
        </span>
      </div>
    </header>
  );
}

export default async function LpPreview() {
  return (
    <div className="wc-soft flex min-h-dvh flex-col">
      <PreviewHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 md:pb-10">
        {await HomePage({ searchParams: Promise.resolve({}) })}
      </main>
      <Footer />
    </div>
  );
}
