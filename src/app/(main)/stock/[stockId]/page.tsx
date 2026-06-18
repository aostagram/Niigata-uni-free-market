import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sprout,
  MapPin,
  Handshake,
  TriangleAlert,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { fetchInventoryItem, formatStockPrice } from "@/lib/inventory";
import { StockGallery } from "@/components/StockGallery";
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
              {/* 購入・出品者へ連絡（待ち合わせ場所もここで相談） */}
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full py-4 text-base"
              >
                <MessageSquare size={18} />
                購入・出品者に連絡する
              </a>
              <p className="text-center text-[12.5px] text-ink-soft">
                在庫番号・お名前は自動入力されます。受け取り場所や日時の相談もこちらから。
              </p>
              <a
                href={doneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost w-full py-3 text-sm"
              >
                取引完了を報告する（購入者）
              </a>
            </div>
          )}
        </div>
      </div>

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
              受け渡しは附属図書館前・第一食堂前など、日中の人目のある学内の場所で。支払いは対面で行ってください。
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
