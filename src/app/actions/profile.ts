"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** アバター画像をSupabase Storageにアップロードしてprofileを更新する。 */
export async function uploadAvatar(formData: FormData): Promise<{ error?: string; url?: string }> {
  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { error: "ファイルを選択してください。" };
  if (file.size > 5 * 1024 * 1024) return { error: "5MB以下の画像を選択してください。" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${user.id}/avatar.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (uploadError) return { error: "アップロードに失敗しました。Supabaseのavatarsバケットを確認してください。" };

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", user.id);
  if (updateError) return { error: "プロフィールの更新に失敗しました。" };

  revalidatePath("/profile");
  revalidatePath("/");
  return { url };
}

/**
 * プロフィール（ニックネーム・学年・学部）を保存する。
 * ニックネーム未設定のユーザーは /onboarding に誘導され、ここで初回登録する。
 */
export async function saveProfile(formData: FormData): Promise<{ error?: string }> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const faculty = String(formData.get("faculty") ?? "").trim();

  if (!nickname) return { error: "ニックネームを入力してください。" };
  if (nickname.length > 20)
    return { error: "ニックネームは20文字以内で入力してください。" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname,
      grade: grade || null,
      faculty: faculty || null,
    })
    .eq("id", user.id);

  if (error) return { error: "保存に失敗しました。もう一度お試しください。" };

  revalidatePath("/profile");
  revalidatePath("/");
  redirect("/");
}
