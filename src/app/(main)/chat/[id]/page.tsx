import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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
      `id, buyer_id, seller_id,
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
  const partnerProfile = partner as unknown as {
    full_name: string;
    avatar_url: string | null;
  } | null;

  const { data: messageData } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", id)
    .order("created_at", { ascending: true });

  const messages = (messageData ?? []) as Message[];

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col">
      {/* チャット相手 + 対象商品 */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 pb-3">
        <Link href="/chat" className="text-gray-500 hover:text-gray-700">
          ←
        </Link>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {partnerProfile?.full_name ?? "退会したユーザー"}
          </p>
        </div>
        {item && (
          <Link
            href={`/items/${item.id}`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1"
          >
            <div className="h-8 w-8 overflow-hidden rounded bg-gray-100">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="text-right">
              <p className="max-w-[8rem] truncate text-xs">{item.title}</p>
              <p className="text-xs font-bold">{formatPrice(item.price)}</p>
            </div>
          </Link>
        )}
      </div>

      <ChatRoom
        roomId={id}
        currentUserId={profile.id}
        initialMessages={messages}
      />
    </div>
  );
}
