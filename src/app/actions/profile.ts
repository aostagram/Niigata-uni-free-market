"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
