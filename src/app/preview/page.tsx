import Link from "next/link";
import { CampusArt } from "@/components/CampusArt";
import { WatercolorTuner } from "@/components/WatercolorTuner";

export const metadata = {
  title: "水彩プレビュー | 新大フリマ",
};

/* =========================================================
   水彩デザインの確認・調整用プレビュー(ログイン不要)
   本番のトップページは Supabase ログインが必要なため、
   スクロール時の「途切れ目」やアンビエントの濃さを
   誰でもこのページで確認・調整できるようにしている。
   背景の水彩アンビエントは globals.css(body::before)で
   全ページ共通に効くので、ここでの見え方が本番と一致する。
   ========================================================= */
export default function WatercolorPreviewPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* 疑似ヘッダー(本番 Header の見た目を再現) */}
      <header className="sticky top-0 z-20 border-b border-brand/10 bg-white/85 backdrop-blur">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-r from-brand-pale/60 via-transparent to-brand-lighter/30" />
        <div className="relative mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <span className="flex items-center gap-2 font-bold">
            <span className="wc-bleed flex h-9 w-9 items-center justify-center bg-gradient-to-br from-brand-lighter to-brand text-white">
              新
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-brand-dark">新大フリマ</span>
              <span className="hidden text-[9px] font-medium tracking-wide text-brand/60 sm:inline">
                NIIGATA UNIVERSITY FLEA MARKET
              </span>
            </span>
          </span>
          <span className="ml-auto rounded-full bg-brand-pale/70 px-3 py-1 text-xs text-brand-dark">
            プレビュー
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <p className="mb-4 rounded-xl border border-brand/15 bg-white/70 px-4 py-3 text-xs leading-relaxed text-gray-600">
          これは水彩デザインの<strong>確認・調整用ページ</strong>です。右下の「🎨
          水彩を調整」からスライダーを動かすと、ページ全体の水彩がリアルタイムで変わります。
          下までスクロールして<strong>途切れ目が出ていないか</strong>を確認してください。
        </p>

        {/* ヒーロー(本番トップと同じ作り) */}
        <section className="wc-wash relative -mx-4 mb-8 overflow-hidden px-5 py-8 sm:rounded-3xl sm:px-8 sm:py-10">
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-brand-dark sm:text-3xl">
                つながる、広がる、
                <br />
                <span className="bg-gradient-to-r from-brand-light to-brand-dark bg-clip-text text-transparent">
                  新大ライフ。
                </span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                新潟大学生のためのフリマアプリ。身近な人と、必要なものをゆずりあう。
                キャンパスライフを、もっと快適に、もっとお得に。
              </p>
            </div>
            <div className="relative">
              <CampusArt />
              <div className="absolute -top-2 right-1 rotate-3 rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-brand-dark shadow-sm ring-1 ring-brand/10 sm:text-sm">
                今日もいい掘り出し物が
                <br />
                見つかるかも！
              </div>
            </div>
          </div>
        </section>

        {/* 検索バー(見た目のみ) */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="キーワードで検索(例: 微分積分、Switch)"
            className="w-full rounded-full border border-brand/15 bg-white/90 py-2.5 pl-4 pr-4 text-sm shadow-sm outline-none focus:border-brand"
          />
        </div>

        {/* カテゴリチップ */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["すべて", "教科書", "ゲーム"].map((c, i) => (
            <span
              key={c}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm ${
                i === 0
                  ? "border-transparent bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-sm"
                  : "border-brand/20 bg-white/80 text-brand-dark"
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        {/* カテゴリ丸タイル */}
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark">
            <span className="wc-bleed inline-block h-4 w-4 bg-gradient-to-br from-brand-light to-brand" />
            カテゴリから探す
          </h2>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="wc-bleed flex h-14 w-14 items-center justify-center bg-gradient-to-br from-brand-lighter to-brand-light text-white">
                  •
                </span>
                <span className="text-[11px] text-brand-dark">カテゴリ</span>
              </div>
            ))}
          </div>
        </section>

        {/* 商品グリッド(スクロール確認用にたっぷり) */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-brand-dark">
            <span className="wc-bleed inline-block h-4 w-4 bg-gradient-to-br from-brand-light to-brand" />
            おすすめの商品
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <PlaceholderCard key={i} index={i} />
            ))}
          </div>
        </section>
      </main>

      {/* 疑似フッター */}
      <footer className="mt-12 border-t border-gray-200 bg-white/70">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} 新大フリマ ・ 水彩プレビュー
          </p>
          <p className="mt-2 text-center">
            <Link href="/" className="text-xs text-brand underline">
              トップへ戻る
            </Link>
          </p>
        </div>
      </footer>

      {/* 調整パネルは常時表示 */}
      <WatercolorTuner />
    </div>
  );
}

function PlaceholderCard({ index }: { index: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/80 p-2 shadow-sm ring-1 ring-brand/10">
      <div className="wc-bleed aspect-square w-full bg-gradient-to-br from-brand-lighter to-brand-light" />
      <p className="mt-2 truncate text-xs text-brand-dark">サンプル商品 {index + 1}</p>
      <p className="text-sm font-bold text-gray-800">¥{(index + 1) * 500}</p>
    </div>
  );
}
