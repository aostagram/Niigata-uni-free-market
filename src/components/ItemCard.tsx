import Link from "next/link";
import { ImageOff, User } from "lucide-react";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import { CATEGORY_LABEL, ITEM_STATUS } from "@/lib/constants";
import type { ItemWithSeller } from "@/lib/types";

export function ItemCard({ item }: { item: ItemWithSeller }) {
  const soldOut = item.status === "sold";

  return (
    <Link
      href={`/items/${item.id}`}
      className="ds-card group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_34px_-18px_rgba(95,129,40,.4)]"
    >
      {/* 画像 */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f3f4ef]">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[#b3c585]"
            style={{ background: "linear-gradient(135deg,#f3f6ec,#e9efdb)" }}
          >
            <ImageOff size={46} strokeWidth={1.5} />
          </div>
        )}
        <span className="tag absolute bottom-2.5 left-2.5 bg-white/90">
          {CATEGORY_LABEL[item.category]}
        </span>
        {soldOut && (
          <>
            <div className="absolute inset-0 bg-white/55" />
            <span className="tag tag-gray absolute left-2.5 top-2.5">
              {ITEM_STATUS.sold}
            </span>
          </>
        )}
      </div>

      {/* 本文 */}
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <p className="clamp-2 min-h-[2.7em] text-sm font-medium leading-snug text-ink">
          {item.title}
        </p>
        <p className="font-round my-1.5 text-lg font-bold text-ink">
          {formatPrice(item.price)}
        </p>
        <div className="mt-auto flex items-center gap-1.5 text-xs text-ink-soft">
          <User size={13} className="text-brand" />
          <span className="truncate">{item.seller.full_name}</span>
          <span className="ml-auto whitespace-nowrap text-ink-faint">
            {formatRelativeTime(item.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
