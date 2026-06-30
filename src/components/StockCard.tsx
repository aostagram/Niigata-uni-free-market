import Link from "next/link";
import {
  type InventoryItem,
  categoryLabel,
  formatStockPrice,
} from "@/lib/inventory";

/**
 * 在庫商品カード（ホーム新着・全商品一覧で共通使用）。
 * 在庫番号・カテゴリ・状態・予約バッジを表示し、詳細/購入へ導線。
 */
export function StockCard({ item }: { item: InventoryItem }) {
  const detail = `/stock/${encodeURIComponent(item.stockId)}`;
  return (
    <article className="product-card flex flex-col">
      <Link href={detail} aria-label={`${item.title} の詳細`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="product-thumb"
          src={item.imageUrl || "/brand/no-image.svg"}
          alt={item.title}
        />
      </Link>
      <div className="card-body flex flex-1 flex-col">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <span className="tag" style={{ background: "#eef6dd" }}>
            在庫番号 {item.stockId}
          </span>
          <span className="tag" style={{ background: "#e7f0fb", color: "#3a5a86" }}>
            {categoryLabel(item.category)}
          </span>
          {item.condition && <span className="tag">{item.condition}</span>}
          {item.reserved && (
            <span className="tag" style={{ background: "#fbeae6", color: "#c0563f" }}>
              予約済
            </span>
          )}
        </div>
        <Link href={detail}>
          <h3>{item.title}</h3>
        </Link>
        <p className="product-price">{formatStockPrice(item.price)}</p>
        {item.description && (
          <p className="product-meta clamp-2">{item.description}</p>
        )}
        <Link className="btn btn-primary mt-auto w-full" href={detail}>
          くわしく見る
        </Link>
      </div>
    </article>
  );
}
