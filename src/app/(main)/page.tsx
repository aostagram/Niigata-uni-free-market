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
      {/* 検索 */}
      <form action="/" className="mb-4">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="キーワードで検索(例: 微分積分、Switch)"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        {category && <input type="hidden" name="category" value={category} />}
      </form>

      {/* カテゴリフィルタ */}
      <div className="mb-5 flex flex-wrap gap-2">
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

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          出品の読み込みに失敗しました。Supabase の設定（環境変数・スキーマ）をご確認ください。
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">まだ出品がありません。</p>
          <Link
            href="/items/new"
            className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            最初の出品をする
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

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
          ? "border-brand bg-brand text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
      }`}
    >
      {label}
    </Link>
  );
}
