import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ImageOff,
  BadgeCheck,
  Sprout,
  MapPin,
  Handshake,
  TriangleAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import { CATEGORY_LABEL, ITEM_STATUS } from "@/lib/constants";
import { SellerControls } from "@/components/SellerControls";
import { ContactButton } from "@/components/ContactButton";
import type { ItemWithSeller } from "@/lib/types";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data } = await supabase
    .from("items")
    .select("*, seller:profiles!items_user_id_fkey(id, full_name, avatar_url)")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const item = data as unknown as ItemWithSeller;
  const isOwner = user?.id === item.user_id;

  return (
    <div className="fade-up">
      <Link href="/" className="nav-link mb-4 inline-flex items-center gap-2">
        <ArrowLeft size={18} />
        商品一覧に戻る
      </Link>

      <div className="grid items-start gap-6 sm:grid-cols-2">
        {/* 画像 */}
        <div
          className="relative overflow-hidden rounded-[var(--radius-ds)] border border-line"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.title}
              className="aspect-square w-full bg-[#f3f4ef] object-cover"
            />
          ) : (
            <div
              className="flex aspect-square w-full items-center justify-center text-[#b3c585]"
              style={{ background: "linear-gradient(135deg,#f3f6ec,#e9efdb)" }}
            >
              <ImageOff size={84} strokeWidth={1.2} />
            </div>
          )}
        </div>

        {/* 情報 */}
        <div>
          {item.status === "sold" && (
            <span className="tag tag-gray mb-3">{ITEM_STATUS.sold}</span>
          )}
          <span className="tag mb-3 ml-1 align-middle">
            {CATEGORY_LABEL[item.category]}
          </span>
          <h1 className="font-round text-2xl font-bold leading-[1.5] text-ink">
            {item.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-round text-3xl font-bold text-ink">
              {formatPrice(item.price)}
            </span>
            <span className="text-[13px] text-ink-soft">（送料込み）</span>
          </div>

          {/* 出品者情報 */}
          <div className="ds-card mt-5 p-5">
            <div className="heading-row mb-3.5">
              <Sprout size={18} className="text-brand" />
              <span className="font-round text-[15px] font-bold text-brand-deep">
                出品者情報
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              {item.seller.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.seller.avatar_url}
                  alt={item.seller.full_name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <span className="avatar h-14 w-14 text-xl font-bold">
                  {item.seller.full_name.charAt(0)}
                </span>
              )}
              <div className="min-w-0">
                <p className="font-round truncate text-[17px] font-bold text-ink">
                  {item.seller.full_name}
                </p>
                <span className="tag mt-1 bg-panel">
                  <BadgeCheck size={13} />
                  学生認証済み
                </span>
                <p className="mt-1.5 text-xs text-ink-soft">
                  {formatRelativeTime(item.created_at)}に出品
                </p>
              </div>
            </div>
          </div>

          {/* アクション */}
          <div className="mt-5">
            {isOwner ? (
              <SellerControls itemId={item.id} status={item.status} />
            ) : (
              <div className="flex flex-col gap-2.5">
                <ContactButton itemId={item.id} />
                <p className="text-center text-[12.5px] text-ink-soft">
                  出品者に直接メッセージを送れます。購入の相談・受け渡しもこちらから。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 説明 */}
      {item.description && (
        <div className="ds-card relative mt-6 p-6">
          <div className="heading-row mb-3.5">
            <Sprout size={18} className="text-brand" />
            <h2 className="font-round text-[17px] font-bold text-brand-deep">
              商品の説明
            </h2>
          </div>
          <p className="whitespace-pre-wrap text-[14.5px] leading-[1.95] text-ink">
            {item.description}
          </p>
          <Sprout
            size={26}
            className="absolute bottom-5 right-6 text-brand opacity-50"
          />
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
              キャンパス内での手渡し
            </p>
            <p className="mt-1 text-[13px] leading-[1.7] text-ink-soft">
              受け渡しはキャンパス内など安全な場所で。日時や詳しい場所は取引メッセージで相談しましょう。支払いは対面で行ってください。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="nav-link inline-flex items-center gap-1.5 text-ink-faint">
          <TriangleAlert size={15} />
          この商品を通報する
        </span>
      </div>
    </div>
  );
}
