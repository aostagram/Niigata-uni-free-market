import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        ← 一覧にもどる
      </Link>

      {/* 画像 */}
      <div className="overflow-hidden rounded-2xl bg-gray-100">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            className="aspect-square w-full object-cover sm:aspect-video"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-gray-300">
            画像なし
          </div>
        )}
      </div>

      {/* 本文 */}
      <div className="mt-5">
        {item.status === "sold" && (
          <span className="mb-2 inline-block rounded-md bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
            {ITEM_STATUS.sold}
          </span>
        )}
        <h1 className="text-xl font-bold">{item.title}</h1>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatPrice(item.price)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
            {CATEGORY_LABEL[item.category]}
          </span>
        </div>

        {item.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {item.description}
          </p>
        )}

        {/* 出品者 */}
        <div className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-4">
          {item.seller.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.seller.avatar_url}
              alt={item.seller.full_name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
              {item.seller.full_name.charAt(0)}
            </span>
          )}
          <div className="text-sm">
            <p className="font-medium">{item.seller.full_name}</p>
            <p className="text-xs text-gray-500">
              {formatRelativeTime(item.created_at)}に出品
            </p>
          </div>
        </div>

        {/* アクション */}
        <div className="mt-6">
          {isOwner ? (
            <SellerControls itemId={item.id} status={item.status} />
          ) : (
            <ContactButton itemId={item.id} />
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          受け渡しはキャンパス内など安全な場所で。支払いは対面で行ってください。
        </p>
      </div>
    </div>
  );
}
