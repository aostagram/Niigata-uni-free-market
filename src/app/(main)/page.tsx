import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/ItemCard";
import { CampusArt } from "@/components/CampusArt";
import { WatercolorTuner } from "@/components/WatercolorTuner";
import { CATEGORIES } from "@/lib/constants";
import type { ItemWithSeller } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; tune?: string }>;
}) {
  const { category, q, tune } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*, seller:profiles!items_user_id_fkey(id, full_name, avatar_url)")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(60);

  if (category === "textbook" || category === "game")
    query = query.eq("category", category);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  const items = (data ?? []) as unknown as ItemWithSeller[];

  return (
    <div>
      {/* ===== ヒーロー(キャンパス感のある水彩) ===== */}
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
            {/* 吹き出し */}
            <div className="absolute -top-2 right-1 rotate-3 rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-brand-dark shadow-sm ring-1 ring-brand/10 sm:text-sm">
              今日もいい掘り出し物が
              <br />
              見つかるかも！
            </div>
          </div>
        </div>
      </section>

      {/* ===== 検索 ===== */}
      <form action="/" className="mb-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="キーワードで検索(例: 微分積分、Switch)"
            className="w-full rounded-full border border-brand/15 bg-white/90 py-2.5 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-brand"
          />
        </div>
        {category && <input type="hidden" name="category" value={category} />}
      </form>

      {/* ===== カテゴリフィルタ(機能:すべて/教科書/ゲーム) ===== */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryChip label="すべて" href="/" active={!category} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.value}
            label={c.label}
            href={`/?category=${c.value}`}
            active={category === c.value}
          />
        ))}
      </div>

      {/* ===== カテゴリから探す(水彩の丸ボタン) ===== */}
      <section className="mb-8">
        <SectionTitle>カテゴリから探す</SectionTitle>
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {CATEGORY_TILES.map((t) => (
            <CategoryTile key={t.label} tile={t} />
          ))}
        </div>
      </section>

      {/* ===== おすすめの商品 ===== */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <SectionTitle>
            {q
              ? `「${q}」の検索結果`
              : category === "textbook"
                ? "教科書の出品"
                : category === "game"
                  ? "ゲームの出品"
                  : "おすすめの商品"}
          </SectionTitle>
        </div>

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            出品の読み込みに失敗しました。Supabase の設定（環境変数・スキーマ）をご確認ください。
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-brand/25 bg-white/60 py-16 text-center">
            <p className="text-gray-500">まだ出品がありません。</p>
            <Link
              href="/items/new"
              className="mt-3 inline-block rounded-full bg-gradient-to-br from-brand-light to-brand-dark px-5 py-2 text-sm font-medium text-white shadow-sm hover:brightness-105"
            >
              最初の出品をする
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 水彩の調整パネル(?tune=1 のときだけ表示。本番ユーザーには出ない) */}
      {tune && <WatercolorTuner />}
    </div>
  );
}

/* ---------- 見出し ---------- */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark">
      <span className="wc-bleed inline-block h-4 w-4 bg-gradient-to-br from-brand-light to-brand" />
      {children}
    </h2>
  );
}

/* ---------- 機能フィルタ用チップ ---------- */
function CategoryChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-transparent bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-sm"
          : "border-brand/20 bg-white/80 text-brand-dark hover:border-brand/40"
      }`}
    >
      {label}
    </Link>
  );
}

/* =========================================================
   「カテゴリから探す」の水彩丸タイル
   value がある教科書/ゲームのみ機能(リンク)。
   それ以外は「準備中」で押せない表示(DB制約・フィルターを壊さない)。
   ========================================================= */
type Tile = {
  label: string;
  value?: "textbook" | "game";
  icon: React.ReactNode;
};

function CategoryTile({ tile }: { tile: Tile }) {
  const circle = (
    <span
      className={`wc-bleed flex h-14 w-14 items-center justify-center bg-gradient-to-br from-brand-lighter to-brand-light text-white transition group-hover:from-brand-light group-hover:to-brand ${
        tile.value ? "" : "opacity-50 saturate-50"
      }`}
    >
      {tile.icon}
    </span>
  );

  const caption = (
    <span className="text-center text-[11px] leading-tight text-brand-dark">
      {tile.label}
      {!tile.value && (
        <span className="block text-[9px] text-gray-400">準備中</span>
      )}
    </span>
  );

  if (tile.value) {
    return (
      <Link
        href={`/?category=${tile.value}`}
        className="group flex flex-col items-center gap-1.5"
      >
        {circle}
        {caption}
      </Link>
    );
  }

  return (
    <div
      aria-disabled
      title="準備中"
      className="group flex cursor-default flex-col items-center gap-1.5"
    >
      {circle}
      {caption}
    </div>
  );
}

const I = (d: string) => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const CATEGORY_TILES: Tile[] = [
  { label: "教科書", value: "textbook", icon: I("M4 5a2 2 0 012-2h7v16H6a2 2 0 00-2 2V5zM13 3h5a2 2 0 012 2v14a2 2 0 00-2-2h-5") },
  { label: "PC・タブレット", icon: I("M4 6h16v9H4zM2 19h20M9 19l.5-2M15 19l-.5-2") },
  { label: "家具・インテリア", icon: I("M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3M3 11h18v5M5 16v3M19 16v3") },
  { label: "自転車・バイク", icon: I("M6 18a3 3 0 100-6 3 3 0 000 6zM18 18a3 3 0 100-6 3 3 0 000 6zM7 14l3.5-6H14l2 5M10 8h5") },
  { label: "ゲーム", value: "game", icon: I("M7 9h10a4 4 0 014 4 4 4 0 01-7 3H10a4 4 0 01-7-3 4 4 0 014-4zM7 12v2M6 13h2M15 12h.01M17 14h.01") },
  { label: "家電・カメラ", icon: I("M4 8h3l1.5-2h7L17 8h3v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z") },
  { label: "ファッション", icon: I("M9 4l-5 3 1.5 3L7 9v11h10V9l1.5 1L20 7l-5-3a3 3 0 01-6 0z") },
  { label: "その他", icon: I("M12 3l2.1 4.9L19 8.9l-3.5 3.4.9 5L12 14.8 7.6 17.3l.9-5L5 8.9l4.9-1z") },
];
