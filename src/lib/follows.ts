import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * フォロー関係。follows テーブル:
 *   follower_id uuid (profiles.id) / following_email text / created_at
 * 出品者はスプレッドシートの gmail で識別するため、フォロー対象は email で持つ。
 *   - フォロワー数 = following_email = 対象のemail の行数
 *   - フォロー中数 = follower_id = 対象ユーザー の行数
 * テーブル未作成時は 0 / false を返す（アプリを壊さない）。
 */
export type FollowCounts = { followers: number; following: number };

export async function fetchFollowCounts(
  userId: string | null,
  email: string | null,
): Promise<FollowCounts> {
  const supabase = await createClient();
  let followers = 0;
  let following = 0;
  try {
    if (email) {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_email", email.toLowerCase());
      followers = count ?? 0;
    }
    if (userId) {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);
      following = count ?? 0;
    }
  } catch {
    // テーブル未作成など。0 のまま。
  }
  return { followers, following };
}

/** 現在のユーザーが、ある出品者(email)をフォロー済みか。 */
export async function isFollowing(
  userId: string | null,
  targetEmail: string | null,
): Promise<boolean> {
  if (!userId || !targetEmail) return false;
  const supabase = await createClient();
  try {
    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId)
      .eq("following_email", targetEmail.toLowerCase());
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
