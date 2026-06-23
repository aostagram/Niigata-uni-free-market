import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sprout,
  MapPin,
  Handshake,
  TriangleAlert,
  ShoppingBag,
  CheckCircle2,
  Store,
  Package,
} from "lucide-react";
import { ContactSellerButton } from "@/components/ContactSellerButton";
import { PurchaseActions } from "@/components/PurchaseActions";
import {
  fetchInventoryItem,
  fetchSellerListingStats,
  formatStockPrice,
  categoryLabel,
} from "@/lib/inventory";
import { fetchSellerReview } from "@/lib/reviews";
import { isFollowing } from "@/lib/follows";
import { StockGallery } from "@/components/StockGallery";
import { StarRating } from "@/components/StarRating";
import { FollowButton } from "@/components/FollowButton";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { buyerInquiryUrl, completeBuyerUrl } from "@/lib/links";

/** 在庫（スプレッドシート）から1商品の詳細。メルカリ風に画像複数＋購入/連絡導線。 */
export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ stockId: string }>;
}) {
  const { stockId } = await params;
  const item = await fetchInventoryItem(decodeURIComponent(stockId));
  if (!item) notFound();

  // ログイン情報でフォームを自動入力（在庫ID・名前・メールの再入力をなくす）
  const user = await getCurrentUser();
  let name: string | undefined;
  let email: string | undefined;
  if (user) {
    const supabase = await createClient();
    const { data: prof } = await supabase
      .from("profiles")
      .select("nickname, full_name, email")
      .eq("id", user.id)
      .single();
    name = prof?.nickname ?? prof?.full_name ?? undefined;
    email = prof?.email ?? user.email ?? undefined;
  }
  const buyUrl = buyerInquiryUrl({ stockId: item.stockId, name, email });
  const doneUrl = completeBuyerUrl({ stockId: item.stockId, email });

  // 出品者情報（在庫の出品者gmailで集計）。
  const sellerEmail = item.sellerEmail;
  const [sellerReview, sellerStats, following] = await Promise.all([
    sellerEmail
      ? fetchSellerReview(sellerEmail)
      : Promise.resolve({ average: 0, count: 0 }),
    sellerEmail
      ? fetchSellerListingStats(sellerEmail)
      : Promise.resolve({ total: 0, available: 0, sold: 0 }),
    isFollowing(user?.id ?? null, sellerEmail || null),
  ]);
  // 出品者のアプリ内プロフィール（公開されていれば表示名/アバターを使う）。
  let sellerName = "新大生の出品者";
  let sellerAvatar: string | null = null;
  if (sellerEmail) {
    const supabase = await createClient();
    const { data: sp } = await supabase
      .from("profiles")
      .select("nickname, full_name, avatar_url")
      .eq("email", sellerEmail)
      .maybeSingle();
    const nm = sp?.nickname ?? sp?.full_name;
    if (nm) sellerName = nm;
    sellerAvatar = sp?.avatar_url ?? null;
  }
  const isOwnItem = (user?.email ?? "").toLowerCase() === sellerEmail;

  return (
    <div className="fade-up">
      <Link href="/#listings" className="nav-link mb-4 inline-flex items-center gap-2">
        <ArrowLeft size={18} />
        商品一覧に戻る
      </Link>

      <div className="grid items-start gap-6 sm:grid-cols-2">
        {/* 画像ギャラリー */}
        <StockGallery images={item.images} alt={item.title} />

        {/* 情報 */}
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="tag" style={{ background: "#eef6dd" }}>
              在庫番号 {item.stockId}
            </span>
            <span className="tag" style={{ background: "#e7f0fb", color: "#3a5a86" }}>
              {categoryLabel(item.category)}
            </span>
            {item.condition && <span className="tag">{item.condition}</span>}
            {!item.sold && item.reserved && (
              <span className="tag" style={{ background: "#fbeae6", color: "#c0563f" }}>
                予約済
              </span>
            )}
            {item.sold && (
              <span className="tag tag-gray">取引完了</span>
            )}
          </div>

          <h1 className="font-round text-2xl font-bold leading-[1.5] text-ink">
            {item.title}
          </h1>

          <div className="mt-3">
            <span className="font-round text-3xl font-bold text-brand-deep">
              {formatStockPrice(item.price)}
            </span>
          </div>

          {item.description && (
            <div className="ds-card mt-5 p-5">
              <div className="heading-row mb-2.5">
                <Sprout size={18} className="text-brand" />
                <span className="font-round text-[15px] font-bold text-brand-deep">
                  商品の説明
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[14.5px] leading-[1.9] text-ink">
                {item.description}
              </p>
            </div>
          )}

          {/* 取引完了済みなら導線を出さず、完了メッセージを表示 */}
          {item.sold ? (
            <div
              className="mt-5 flex items-center gap-3 rounded-[var(--radius-ds)] p-5"
              style={{ background: "#eef6dd", border: "1px solid var(--line)" }}
            >
              <CheckCircle2 size={28} className="shrink-0 text-brand-deep" />
              <div>
                <p className="font-round text-[16px] font-bold text-brand-deep">
                  取引が完了しました！
                </p>
                <p className="mt-0.5 text-[13px] text-ink-soft">
                  この商品は取引が成立し、販売を終了しました。
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-2.5">
              {/* 出品者へ連絡（アプリ内チャット）。待ち合わせ場所もここで相談。 */}
              {!isOwnItem && <ContactSellerButton stockId={item.stockId} />}
              <p className="text-center text-[12.5px] text-ink-soft">
                出品者のアカウントへ直接メッセージを送れます。受け取り場所や日時の相談もこちらから。
              </p>
              <p className="text-center text-[12px] text-ink-faint">
                購入のお申し込みは、下の「この商品を購入する」からどうぞ。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 出品者（メルカリ風: 評価・出品数・フォロー） */}
      {sellerEmail && (
        <div className="ds-card mt-6 p-6">
          <div className="heading-row mb-3">
            <Store size={18} className="text-brand" />
            <h3 className="font-round text-[16px] font-bold text-brand-deep">
              出品者
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {sellerAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="h-14 w-14 flex-none rounded-full object-cover"
              />
            ) : (
              <span
                className="flex h-14 w-14 flex-none items-center justify-center rounded-full"
                style={{ background: "radial-gradient(circle,#eef5dd,#d6e7b6)" }}
              >
                <Sprout size={26} className="text-brand-deep" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-round truncate text-[15px] font-bold text-ink">
                {sellerName}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <StarRating
                  average={sellerReview.average}
                  count={sellerReview.count}
                  size={15}
                />
                <span className="inline-flex items-center gap-1 text-[12px] text-ink-soft">
                  <Package size={13} /> 出品 {sellerStats.total}・取引完了{" "}
                  {sellerStats.sold}
                </span>
              </div>
            </div>
            {!isOwnItem && (
              <FollowButton
                stockId={item.stockId}
                initialFollowing={following}
                loggedIn={!!user}
              />
            )}
          </div>
        </div>
      )}

      {/* 受け渡し */}
      <div className="ds-card mt-6 p-6">
        <div className="heading-row mb-3">
          <Sprout size={18} className="text-brand" />
          <h3 className="font-round text-[16px] font-bold text-brand-deep">
            受け渡しについて
          </h3>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin size={20} className="mt-0.5 shrink-0 text-brand" />
          <div>
            <p className="flex items-center gap-2 font-medium text-ink">
              <Handshake size={18} className="text-brand" />
              手渡しでの受け渡し
            </p>
            {item.pickup && (
              <p className="mt-1 text-[13.5px] font-medium text-ink">
                出品者の希望（目安）：{item.pickup}
              </p>
            )}
            <p className="mt-1 text-[13px] leading-[1.7] text-ink-soft">
              受け渡しの<b>日時・場所は、利用者どうしで相談して決めてください</b>。
              安全のため、日中の人目のある場所を各自でお選びください。支払いは対面で行ってください。
            </p>
            <p className="mt-1 text-[12px] leading-[1.6] text-ink-faint">
              ガタフィーは特定の待ち合わせ場所の指定・提供は行いません。場所は当事者の自由な合意で決まります。
            </p>
          </div>
        </div>
      </div>

      {/* 購入（スクロールした先に配置）。在庫商品はフォームで購入希望を受け付ける。 */}
      {!item.sold && (
        <div className="ds-card mt-6 p-6">
          <div className="heading-row mb-3">
            <ShoppingBag size={18} className="text-brand" />
            <h3 className="font-round text-[16px] font-bold text-brand-deep">
              この商品を購入する
            </h3>
          </div>
          <PurchaseActions buyUrl={buyUrl} doneUrl={doneUrl} loggedIn={!!user} />
        </div>
      )}

      <div className="mt-6 text-center">
        <span className="nav-link inline-flex items-center gap-1.5 text-ink-faint">
          <TriangleAlert size={15} />
          この商品を通報する
        </span>
      </div>
    </div>
  );
}
