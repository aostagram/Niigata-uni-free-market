import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/ItemCard";
import { CATEGORIES } from "@/lib/constants";
import type { ItemWithSeller } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
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

/* =========================================================
   ヒーローのキャンパス風 抽象水彩イラスト(SVG)
   ※ 新潟大学の公式ロゴ・公式マークは使用しない抽象シルエット。
   ========================================================= */
function CampusArt() {
  return (
    <div className="wc-bleed-2 overflow-hidden">
      <svg
        viewBox="0 0 440 300"
        className="h-auto w-full"
        role="img"
        aria-label="キャンパスの水彩イラスト"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6efff" />
            <stop offset="1" stopColor="#f3fbff" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cdeb9a" />
            <stop offset="1" stopColor="#a9d473" />
          </linearGradient>
          <linearGradient id="tree" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fb83a" />
            <stop offset="1" stopColor="#2f7d3a" />
          </linearGradient>
          <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f8f6b" />
            <stop offset="1" stopColor="#0b7a4b" />
          </linearGradient>
        </defs>

        {/* 空 */}
        <rect x="0" y="0" width="440" height="300" fill="url(#sky)" />
        {/* 太陽 */}
        <circle cx="370" cy="60" r="34" fill="#fdf0a8" opacity="0.85" />
        {/* 雲(水彩のにじみ) */}
        <ellipse cx="80" cy="50" rx="46" ry="20" fill="#ffffff" opacity="0.8" />
        <ellipse cx="120" cy="58" rx="34" ry="16" fill="#ffffff" opacity="0.7" />

        {/* 遠くの丘 */}
        <ellipse cx="120" cy="210" rx="180" ry="60" fill="#bfe089" opacity="0.7" />
        <ellipse cx="360" cy="220" rx="160" ry="55" fill="#cdeb9a" opacity="0.7" />

        {/* 時計塔風の抽象シルエット(公式マークではない) */}
        <g>
          <rect x="206" y="92" width="28" height="120" rx="4" fill="url(#tower)" />
          <polygon points="206,92 220,66 234,92" fill="#0b7a4b" />
          <circle cx="220" cy="116" r="7" fill="#f3fbff" />
          <circle cx="220" cy="116" r="2.4" fill="#0b7a4b" />
          <rect x="213" y="150" width="14" height="20" rx="3" fill="#f3fbff" opacity="0.7" />
        </g>

        {/* 木々 */}
        <g>
          <rect x="92" y="170" width="8" height="40" fill="#7a5230" />
          <ellipse cx="96" cy="158" rx="40" ry="36" fill="url(#tree)" />
          <ellipse cx="74" cy="168" rx="24" ry="22" fill="#6fb83a" opacity="0.9" />

          <rect x="338" y="176" width="7" height="36" fill="#7a5230" />
          <ellipse cx="342" cy="166" rx="32" ry="30" fill="url(#tree)" />
          <ellipse cx="362" cy="176" rx="20" ry="18" fill="#8cc84f" opacity="0.9" />
        </g>

        {/* 地面 */}
        <path d="M0 214 Q220 188 440 214 L440 300 L0 300 Z" fill="url(#ground)" />
        {/* 小道 */}
        <path d="M150 300 Q210 250 220 214 Q232 250 300 300 Z" fill="#eaf4d2" opacity="0.8" />

        {/* 歩く学生のシルエット */}
        <g fill="#2f7d3a">
          <g transform="translate(196 232)">
            <circle cx="0" cy="0" r="6" />
            <path d="M-6 8 Q0 6 6 8 L5 30 L-5 30 Z" />
          </g>
          <g transform="translate(244 240)" fill="#0b7a4b">
            <circle cx="0" cy="0" r="5" />
            <path d="M-5 7 Q0 5 5 7 L4 26 L-4 26 Z" />
          </g>
          <g transform="translate(176 246)" fill="#4a9b58">
            <circle cx="0" cy="0" r="5" />
            <path d="M-5 7 Q0 5 5 7 L4 24 L-4 24 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}
