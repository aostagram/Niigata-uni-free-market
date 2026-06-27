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

/** 出品者の学内gmail宛に、公式メールから購入希望を取り次ぐ（best-effort）。 */
async function notifySellerOfInquiry(
  item: { stockId: string; title: string; sellerEmail: string },
  buyerName: string,
  buyerEmail: string,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return sendMail({
    to: item.sellerEmail,
    // 出品者がこのメールに「返信」すると購入希望者へ直接届くようにする。
    replyTo: buyerEmail || undefined,
    subject: "【ガタフィー】あなたの出品に購入希望の連絡が届きました",
    html: mailLayout(
      "購入希望の連絡が届きました",
      `<p>あなたの出品「<b>${item.title}</b>」（在庫番号 ${item.stockId}）に、購入希望者から連絡がありました。</p>
       <p style="margin-top:8px">購入希望者：<b>${buyerName}</b></p>
       ${buyerEmail ? `<p style="margin-top:2px">連絡先：<a href="mailto:${buyerEmail}">${buyerEmail}</a></p>` : ""}
       <p style="margin-top:12px">このメールにそのまま返信いただくか、上記の連絡先までご連絡ください。受け渡しの日時・場所は当事者どうしでご相談ください。</p>
       <p style="margin-top:16px">
         <a href="${siteUrl}/stock/${encodeURIComponent(item.stockId)}" style="display:inline-block;background:linear-gradient(135deg,#9cc659,#84ad3f);color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">商品ページを見る</a>
       </p>`,
    ),
  });
}

/** 在庫商品でチャットルームが新規作成されたことを出品者にメール通知（best-effort）。 */
async function notifySellerChatStarted(
  item: { stockId: string; title: string; sellerEmail: string },
  buyerName: string,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await sendMail({
    to: item.sellerEmail,
    subject: "【ガタフィー】あなたの出品にチャットが届きました",
    html: mailLayout(
      "チャットが届きました",
      `<p>あなたの出品「<b>${item.title}</b>」に <b>${buyerName}</b> さんから連絡がありました。</p>
       <p style="margin-top:12px">
         <a href="${siteUrl}/chat" style="display:inline-block;background:linear-gradient(135deg,#9cc659,#84ad3f);color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">チャットを開く</a>
       </p>`,
    ),
  });
}

/**
 * 在庫(スプレッドシート)商品で、購入希望者が出品者に連絡する。
 * - 出品者がアプリに登録済みなら chat_rooms(stock_id 方式)を作成/取得してチャットへ遷移。
 * - 未登録、またはチャットを作成できない場合でもエラーで止めず、ガタフィー公式
 *   メールから出品者へ購入希望を取り次ぐ（返信先＝購入者メール）。
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

  // 購入希望者(自分)のプロフィール（メールでの取り次ぎ・通知名に使う）。
  const { data: buyerProfile } = await supabase
    .from("profiles")
    .select("nickname, full_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const buyerName =
    buyerProfile?.nickname ?? buyerProfile?.full_name ?? "ガタフィー利用者";
  const buyerEmail = buyerProfile?.email ?? user.email ?? "";

  const mailItem = {
    stockId: item.stockId,
    title: item.title,
    sellerEmail,
  };

  // 出品者のアプリ内アカウント(メール一致)を探す。
  const { data: seller } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", sellerEmail)
    .maybeSingle();

  // 出品者が登録済みなら、アプリ内チャットルームを作成/取得する。
  let roomId: string | undefined;
  if (seller) {
    const { data: existing } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq("stock_id", item.stockId)
      .eq("buyer_id", user.id)
      .maybeSingle();
    roomId = existing?.id;
    if (!roomId) {
      const { data: created } = await supabase
        .from("chat_rooms")
        .insert({
          stock_id: item.stockId,
          buyer_id: user.id,
          seller_id: seller.id,
        })
        .select("id")
        .single();
      roomId = created?.id;
      // 新規ルーム作成時は出品者にもメールで知らせる（best-effort）。
      if (roomId) await notifySellerChatStarted(mailItem, buyerName);
    }
  }

  // チャットを開始できたらチャット画面へ（redirect は例外で遷移するため最後に呼ぶ）。
  if (roomId) redirect(`/chat/${roomId}`);

  // 出品者未登録／チャット作成不可 → 公式メールで購入希望を取り次ぐ。
  const mailed = await notifySellerOfInquiry(mailItem, buyerName, buyerEmail);
  if (mailed.ok) {
    return {
      message:
        "出品者へ、ガタフィー公式メールからあなたの連絡先を添えてお伝えしました。出品者からの返信をお待ちください。",
    };
  }
  // メール送信が未設定/失敗のときは購入フォームへ案内（エラーにはしない）。
  return {
    message:
      "ただいま連絡を受け付けできませんでした。お手数ですが、下の「この商品を購入する」からお問い合わせください。",
  };
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
