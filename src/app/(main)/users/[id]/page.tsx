import { notFound } from "next/navigation";
import { Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StarRating } from "@/components/StarRating";
import { StockCard } from "@/components/StockCard";
import { fetchAllInventory, fetchSellerListingStats } from "@/lib/inventory";
import { fetchSellerReview } from "@/lib/reviews";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, nickname, avatar_url, faculty, grade, email")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const email = (profile.email ?? "").toLowerCase();

  const [allInv, listing, review] = await Promise.all([
    fetchAllInventory(),
    fetchSellerListingStats(email),
    fetchSellerReview(email),
  ]);
  const myItems = allInv.filter((it) => it.sellerEmail === email && !it.sold);

  return (
    <div className="fade-up">
      <div className="ds-card p-6">
        <div className="flex items-center gap-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name ?? ""}
              className="h-[80px] w-[80px] flex-none rounded-full object-cover"
            />
          ) : (
            <span
              className="flex h-[80px] w-[80px] flex-none items-center justify-center rounded-full"
              style={{ background: "radial-gradient(circle,#eef5dd,#d6e7b6)" }}
            >
              <Sprout size={36} className="text-brand-deep" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-round truncate text-2xl font-bold text-ink">
              {profile.nickname ?? profile.full_name}
            </h1>
            {(profile.faculty || profile.grade) && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {profile.faculty && <span className="tag">{profile.faculty}</span>}
                {profile.grade && <span className="tag">{profile.grade}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-line-soft pt-4 text-center">
          <div>
            <div className="font-round text-2xl font-bold text-ink">{listing.total}</div>
            <div className="text-[12px] text-ink-soft">出品</div>
          </div>
          <div>
            <div className="font-round text-2xl font-bold text-ink">{listing.sold}</div>
            <div className="text-[12px] text-ink-soft">取引完了</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-ink-soft">評価</span>
            <StarRating average={review.average} count={review.count} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="heading-row mb-6">
          <Sprout size={18} className="text-brand-deep" />
          <h2 className="font-round text-lg font-bold text-ink">出品中の商品</h2>
          <span className="tag ml-1">{myItems.length}件</span>
        </div>
        {myItems.length === 0 ? (
          <p className="ds-card border-dashed py-12 text-center text-sm text-ink-soft">
            出品中の商品はありません。
          </p>
        ) : (
          <div className="lp-home">
            <div className="product-grid">
              {myItems.map((it) => (
                <StockCard key={it.stockId} item={it} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
