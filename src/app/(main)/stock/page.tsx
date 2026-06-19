import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { StockCard } from "@/components/StockCard";
import { CATEGORIES, fetchInventory } from "@/lib/inventory";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "商品一覧",
  description:
    "ガタフィーに出品中の商品一覧。カテゴリで絞り込んで、新潟大学のキャンパス内で手渡しできる教科書・家具・家電などを探せます。",
};

/** 全商品一覧（カテゴリ絞り込み付き）。ホームの「もっと見る」遷移先。 */
export default async function StockListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await fetchInventory();
  const items =
    category && category !== "all"
      ? all.filter((it) => it.category === category)
      : all;

  // フォーム自動入力用（未ログインでも動く）。
  const user = await getCurrentUser();
  let buyerName: string | undefined;
  let buyerEmail: string | undefined;
  if (user) {
    const supabase = await createClient();
    const { data: prof } = await supabase
      .from("profiles")
      .select("nickname, full_name, email")
      .eq("id", user.id)
      .single();
    buyerName = prof?.nickname ?? prof?.full_name ?? undefined;
    buyerEmail = prof?.email ?? user.email ?? undefined;
  }

  const activeLabel =
    CATEGORIES.find((c) => c.key === category)?.label ?? "すべての商品";

  return (
    <div className="lp-home fade-up">
      <Link
        href="/"
        className="nav-link mb-4 inline-flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        ホームに戻る
      </Link>

      <div className="section-head" style={{ marginBottom: 18 }}>
        <div>
          <p className="eyebrow">商品一覧</p>
          <h2>{activeLabel}</h2>
          <p className="lead">
            購入・取引完了フォームには、各商品の<b>「在庫番号」</b>を入力してください。
          </p>
        </div>
      </div>

      {/* カテゴリ絞り込みバー */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/stock"
          className={`btn ${!category || category === "all" ? "btn-primary" : "btn-ghost"} px-4 py-2 text-sm`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={`/stock?category=${c.key}`}
            className={`btn ${category === c.key ? "btn-primary" : "btn-ghost"} px-4 py-2 text-sm`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="ds-card border-dashed py-16 text-center text-sm text-ink-soft">
          この条件の商品はまだありません。
        </p>
      ) : (
        <div className="product-grid">
          {items.map((it) => (
            <StockCard
              key={it.stockId}
              item={it}
              buyerName={buyerName}
              buyerEmail={buyerEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
