"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * 購入希望者が出品者に問い合わせる。チャットルームが無ければ作成し、画面へ遷移。
 */
export async function startChatRoom(itemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: item, error: itemErr } = await supabase
    .from("items")
    .select("id, user_id")
    .eq("id", itemId)
    .single();
  if (itemErr || !item) return { error: "出品が見つかりません。" };
  if (item.user_id === user.id)
    return { error: "自分の出品には問い合わせできません。" };

  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("item_id", itemId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  let roomId = existing?.id;

  if (!roomId) {
    const { data: created, error: createErr } = await supabase
      .from("chat_rooms")
      .insert({
        item_id: itemId,
        buyer_id: user.id,
        seller_id: item.user_id,
      })
      .select("id")
      .single();
    if (createErr || !created)
      return { error: "チャットルームの作成に失敗しました。" };
    roomId = created.id;
  }

  redirect(`/chat/${roomId}`);
}

export async function sendMessage(roomId: string, messageText: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です。" };

  const trimmed = messageText.trim();
  if (!trimmed) return { error: "メッセージを入力してください。" };

  const { error } = await supabase.from("messages").insert({
    room_id: roomId,
    sender_id: user.id,
    message_text: trimmed.slice(0, 2000),
  });
  if (error) return { error: error.message };

  revalidatePath(`/chat/${roomId}`);
  revalidatePath("/chat");
  return { ok: true };
}
