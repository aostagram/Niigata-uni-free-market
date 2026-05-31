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
  if (!CATEGORY_VALUES.includes(input.category as CategoryValue))
    return { error: "カテゴリを選択してください。" };
  const price = Number.isFinite(input.price)
    ? Math.max(0, Math.floor(input.price))
    : 0;

  const { data, error } = await supabase
    .from("items")
    .insert({
      user_id: user.id,
      title,
      description: input.description.trim(),
      price,
      category: input.category,
      image_url: input.imageUrl,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/items/${data.id}`);
}

export async function updateItemStatus(itemId: string, status: ItemStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .update({ status })
    .eq("id", itemId);

  if (error) return { error: error.message };
  revalidatePath(`/items/${itemId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteItem(itemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) return { error: error.message };
  revalidatePath("/");
  redirect("/");
}
