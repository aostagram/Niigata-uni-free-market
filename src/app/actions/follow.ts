"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchInventoryItem } from "@/lib/inventory";

export type ToggleFollowResult = {
  ok: boolean;
  following: boolean;
  message?: string;
};

/**
 * 商品(stockId)の出品者をフォロー/解除する。
 * 出品者はサーバー側で在庫から解決するため、出品者gmailはクライアントに出さない。
 */
export async function toggleFollow(
  stockId: string,
): Promise<ToggleFollowResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, following: false, message: "ログインが必要です" };

  const item = await fetchInventoryItem(stockId);
  const sellerEmail = (item?.sellerEmail ?? "").toLowerCase();
  if (!sellerEmail)
    return { ok: false, following: false, message: "出品者情報がありません" };

  if (sellerEmail === (user.email ?? "").toLowerCase())
    return { ok: false, following: false, message: "自分はフォローできません" };

  const supabase = await createClient();
  try {
    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_email", sellerEmail)
      .maybeSingle();

    if (existing) {
      await supabase.from("follows").delete().eq("id", existing.id);
      revalidatePath(`/stock/${stockId}`);
      return { ok: true, following: false };
    }
    await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_email: sellerEmail });
    revalidatePath(`/stock/${stockId}`);
    return { ok: true, following: true };
  } catch {
    return {
      ok: false,
      following: false,
      message: "フォロー機能はまだ準備中です（管理者の設定待ち）",
    };
  }
}
