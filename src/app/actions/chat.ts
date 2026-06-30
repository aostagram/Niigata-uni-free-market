"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendMail, mailLayout } from "@/lib/mail";
import { fetchInventoryItem } from "@/lib/inventory";

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

    // 直近20分以内に同じ送信者から既にメッセージがあれば通知スキップ
    const fifteenMinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId)
      .eq("sender_id", senderId)
      .gte("created_at", fifteenMinutesAgo);
    // 今送ったメッセージを含めて2件以上 = 15分以内に前のメッセージがある = 通知済み
    if ((recentCount ?? 0) >= 2) return;

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

    // 購入者→出品者の場合は「購入予定者からチャットが届きました」通知
    const isBuyerToSeller = room.buyer_id === senderId;
    const subject = isBuyerToSeller
      ? "【ガタフィー】購入予定者からあなたに購入に関するチャットが送られました"
      : "【ガタフィー】新しいメッセージが届きました";
    const headline = isBuyerToSeller
      ? "購入予定者からチャットが届きました"
      : "新しいメッセージが届きました";

    await sendMail({
      to: recipient.email,
      subject,
      html: mailLayout(
        headline,
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

  return { roomId };
}

/**
 * スプレッドシート在庫（stockId）の出品者にチャットで相談する。
 * chat_rooms に stock_id カラムが必要（supabase/add-stock-chat.sql を実行済みであること）。
 */
export async function startStockChatRoom(stockId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // スプレッドシートから在庫情報を取得
  const item = await fetchInventoryItem(stockId);
  if (!item) return { error: "商品が見つかりません。" };
  if (!item.sellerEmail) return { error: "出品者情報が取得できません。" };

  // 出品者の Supabase プロフィールをメールで検索
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", item.sellerEmail)
    .maybeSingle();
  if (!sellerProfile) {
    return { error: "出品者がまだガタフィーアカウントを持っていません。" };
  }
  if (sellerProfile.id === user.id) {
    return { error: "自分の出品にはチャットできません。" };
  }

  // 既存のチャットルームを検索
  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("stock_id", stockId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  let roomId = existing?.id;

  if (!roomId) {
    const { data: created, error: createErr } = await supabase
      .from("chat_rooms")
      .insert({
        stock_id: stockId,
        buyer_id: user.id,
        seller_id: sellerProfile.id,
      })
      .select("id")
      .single();
    if (createErr || !created) {
      console.error("[startStockChatRoom] create error:", createErr?.message);
      return { error: "チャットルームの作成に失敗しました。" };
    }
    roomId = created.id;
  }

  return { roomId };
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
