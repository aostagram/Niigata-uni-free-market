"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type CategoryValue, type ItemStatus } from "@/lib/constants";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export type CreateItemInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
};

export async function createItem(input: CreateItemInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です。" };

  const title = input.title.trim();
  if (!title) return { error: "商品名を入力してください。" };
  // DB制約(1〜100文字)に合わせてサーバー側でも検証する(改ざんリクエスト対策)。
  if (title.length > 100)
    return { error: "商品名は100文字以内で入力してください。" };
  if (!CATEGORY_VALUES.includes(input.category as CategoryValue))
    return { error: "カテゴリを選択してください。" };
  const description = input.description.trim();
  if (description.length > 2000)
    return { error: "商品説明は2000文字以内で入力してください。" };
  const price = Number.isFinite(input.price)
    ? Math.max(0, Math.floor(input.price))
    : 0;

  const { data, error } = await supabase
    .from("items")
    .insert({
      user_id: user.id,
      title,
      description,
      price,
      category: input.category,
      image_url: input.imageUrl,
    })
    .select("id")
    .single();

  if (error) {
    console.error("出品の保存に失敗:", error.message);
    return { error: "出品の保存に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/");
  redirect(`/items/${data.id}`);
}

export async function updateItemStatus(itemId: string, status: ItemStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .update({ status })
    .eq("id", itemId);

  if (error) {
    console.error("ステータス更新に失敗:", error.message);
    return { error: "ステータスの更新に失敗しました。" };
  }
  revalidatePath(`/items/${itemId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteItem(itemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) {
    console.error("出品削除に失敗:", error.message);
    return { error: "削除に失敗しました。" };
  }
  revalidatePath("/");
  redirect("/");
}
