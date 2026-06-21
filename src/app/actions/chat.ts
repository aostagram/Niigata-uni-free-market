"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchInventoryItem } from "@/lib/inventory";
import { sendMail, mailLayout } from "@/lib/mail";

/** チャット相手に「新着メッセージ」メールを送る（best-effort）。 */
async function notifyChatRecipient(
  supabase: Awaited<ReturnType<typeof createClient>>,
  roomId: string,
  senderId: string,
  messageText: string,
) {
  try {
    const { data: room } = await supabase
      .from("chat_rooms")
      .select("buyer_id, seller_id, item_id")
      .eq("id", roomId)
      .single();
    if (!room) return;

    const recipientId =
      room.buyer_id === senderId ? room.seller_id : room.buyer_id;

    const [{ data: recipient }, { data: sender }, { data: item }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("email, nickname, full_name")
          .eq("id", recipientId)
          .single(),
        supabase
          .from("profiles")
          .select("nickname, full_name")
          .eq("id", senderId)
          .single(),
        supabase.from("items").select("title").eq("id", room.item_id).single(),
      ]);

    if (!recipient?.email) return;

    const senderName = sender?.nickname ?? sender?.full_name ?? "取引相手";
    const preview =
      messageText.length > 80 ? `${messageText.slice(0, 80)}…` : messageText;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    await sendMail({
      to: recipient.email,
      subject: "【ガタフィー】新しいメッセージが届きました",
      html: mailLayout(
        "新しいメッセージが届きました",
        `<p><b>${senderName}</b> さんからメッセージが届きました。</p>
         <p style="margin-top:8px;color:#74806a">商品：${item?.title ?? "（商品）"}</p>
         <blockquote style="margin:12px 0;padding:12px 16px;background:#f5f8ec;border-radius:12px">${preview}</blockquote>
         <p style="margin-top:16px">
           <a href="${siteUrl}/chat/${roomId}" style="display:inline-block;background:linear-gradient(135deg,#9cc659,#84ad3f);color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">チャットを開く</a>
         </p>`,
      ),
    });
  } catch (e) {
    console.error("[chat] 通知メール失敗:", e instanceof Error ? e.message : e);
  }
}

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

/**
 * 在庫(スプレッドシート)商品で、購入希望者が出品者アカウントに直接連絡する。
 * 出品者がアプリに登録済みなら chat_rooms(stock_id 方式)を作成/取得して遷移。
 * 未登録ならエラー文言を返し、画面側で購入フォームへ誘導する。
 */
export async function startStockChat(stockId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const item = await fetchInventoryItem(stockId);
  if (!item) return { error: "商品が見つかりません。" };

  const sellerEmail = (item.sellerEmail ?? "").toLowerCase();
  if (!sellerEmail)
    return { error: "この商品には出品者情報が登録されていません。" };
  if ((user.email ?? "").toLowerCase() === sellerEmail)
    return { error: "自分の出品には連絡できません。" };

  // 出品者のアプリ内アカウント(メール一致)を探す。
  const { data: seller } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", sellerEmail)
    .maybeSingle();
  if (!seller)
    return {
      error:
        "この出品者はまだガタフィーに登録していないため、チャットを開始できません。下の「この商品を購入する」からご連絡ください。",
    };

  // 在庫番号×購入者で1ルーム。既存があれば再利用。
  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("stock_id", item.stockId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  let roomId = existing?.id;
  if (!roomId) {
    const { data: created, error: createErr } = await supabase
      .from("chat_rooms")
      .insert({
        stock_id: item.stockId,
        buyer_id: user.id,
        seller_id: seller.id,
      })
      .select("id")
      .single();
    if (createErr || !created)
      return { error: "チャットの開始に失敗しました。時間をおいて再度お試しください。" };
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
  if (error) {
    console.error("メッセージ送信に失敗:", error.message);
    return { error: "メッセージの送信に失敗しました。" };
  }

  await notifyChatRecipient(supabase, roomId, user.id, trimmed);

  revalidatePath(`/chat/${roomId}`);
  revalidatePath("/chat");
  return { ok: true };
}
