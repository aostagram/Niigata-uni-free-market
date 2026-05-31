import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ITEM_STATUS } from "@/lib/constants";
import type { ItemWithSeller } from "@/lib/types";

export function ItemCard({ item }: { item: ItemWithSeller }) {
  const soldOut = item.status === "sold";

  return (
    <Link href={`/items/${item.id}`} className="group block">
      {/* 画像エリア:四角い枠は使わず、薄緑の水彩にじみの上に画像を載せる */}
      <div className="relative aspect-square w-full">
        {/* 水彩のにじみ背景(不規則マスク) */}
        <div className="wc-bleed absolute inset-0 bg-gradient-to-br from-brand-lighter/70 via-brand-pale to-brand-mist" />
        {/* 画像本体は少し内側に置き、にじみが縁から覗くようにする */}
        <div className="absolute inset-[7%] overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-black/5">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand/40">
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z"
                />
              </svg>
            </div>
          )}
          {soldOut && (
            <>
              <div className="absolute inset-0 bg-white/55" />
              <span className="absolute left-2 top-2 rounded-md bg-brand-dark/80 px-2 py-0.5 text-xs font-medium text-white">
                {ITEM_STATUS.sold}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="px-1.5 pt-2">
        <p className="line-clamp-2 text-sm leading-snug text-gray-800">
          {item.title}
        </p>
        <p className="mt-0.5 font-bold text-brand-dark">
          {formatPrice(item.price)}
        </p>
      </div>
    </Link>
  );
}
