import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, Sprout } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom } from "@/components/ChatRoom";
import { formatPrice } from "@/lib/format";
import type { Message } from "@/lib/types";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: room } = await supabase
    .from("chat_rooms")
    .select(
      `id, buyer_id, seller_id, stock_id,
       item:items!chat_rooms_item_id_fkey(id, title, price, image_url, status),
       buyer:profiles!chat_rooms_buyer_id_fkey(id, full_name, avatar_url),
       seller:profiles!chat_rooms_seller_id_fkey(id, full_name, avatar_url)`,
    )
    .eq("id", id)
    .single();

  if (!room) notFound();
  if (room.buyer_id !== profile.id && room.seller_id !== profile.id) {
    redirect("/chat");
  }

  const partner = room.buyer_id === profile.id ? room.seller : room.buyer;
  const item = room.item as unknown as {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
  } | null;
  const stockId = (room as unknown as { stock_id: string | null }).stock_id ?? null;
  const partnerProfile = partner as unknown as {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;

  // 直近200件に限定して取得(全件フェッチを避ける)。新着はRealtimeで追従。
  const { data: messageData } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", id)
    .order("created_at", { ascending: false })
    .limit(200);

  // 取得は新しい順なので、表示用に古い順へ戻す。
  const messages = ((messageData ?? []) as Message[]).reverse();

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100dvh - 3.5rem - 7rem - 1.5rem)" }}>
      {/* チャット相手 + 対象商品 */}
      <div className="flex shrink-0 items-center gap-3 border-b border-line pb-3">
        <Link
          href="/chat"
          aria-label="メッセージ一覧に戻る"
          className="text-brand-deep"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          {partnerProfile?.id ? (
            <Link
              href={`/users/${partnerProfile.id}`}
              className="flex items-center gap-2 group"
            >
              {partnerProfile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partnerProfile.avatar_url}
                  alt={partnerProfile.full_name ?? ""}
                  className="h-9 w-9 flex-none rounded-full object-cover ring-2 ring-line"
                />
              ) : (
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-panel-2">
                  <Sprout size={18} className="text-brand" />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-round truncate text-sm font-bold text-ink group-hover:underline">
                  {partnerProfile.full_name ?? "ユーザー"}
                </p>
                <p className="text-[11px] text-ink-faint">プロフィールを見る →</p>
              </div>
            </Link>
          ) : (
            <p className="font-round text-sm font-bold text-ink">退会したユーザー</p>
          )}
        </div>
        {/* 在庫商品リンク（スプレッドシート在庫 or アプリ内item） */}
        {stockId ? (
          <Link
            href={`/stock/${encodeURIComponent(stockId)}`}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-2 py-1"
          >
            <div className="h-9 w-9 overflow-hidden rounded-lg bg-panel-2 flex items-center justify-center">
              <Sprout size={16} className="text-brand" />
            </div>
            <div className="text-right">
              <p className="max-w-[7rem] truncate text-xs text-ink">在庫番号 {stockId}</p>
              <p className="text-[10px] text-ink-faint">商品を見る</p>
            </div>
            <ExternalLink size={14} className="text-ink-faint" />
          </Link>
        ) : item ? (
          <Link
            href={`/items/${item.id}`}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-2 py-1"
          >
            <div className="h-9 w-9 overflow-hidden rounded-lg bg-panel-2">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="text-right">
              <p className="max-w-[8rem] truncate text-xs text-ink">{item.title}</p>
              <p className="font-round text-xs font-bold text-brand-deep">{formatPrice(item.price)}</p>
            </div>
            <ExternalLink size={14} className="text-ink-faint" />
          </Link>
        ) : null}
      </div>

      <ChatRoom
        roomId={id}
        currentUserId={profile.id}
        initialMessages={messages}
      />
    </div>
  );
}
