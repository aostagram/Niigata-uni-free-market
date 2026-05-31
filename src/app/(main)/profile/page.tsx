import { requireProfile, getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/ItemCard";
import { signOut } from "@/app/actions/auth";
import type { ItemWithSeller } from "@/lib/types";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("items")
    .select("*, seller:profiles!items_user_id_fkey(id, full_name, avatar_url)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as unknown as ItemWithSeller[];

  return (
    <div>
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-medium">
            {profile.full_name.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">{profile.full_name}</h1>
          <p className="truncate text-sm text-gray-500">{user?.email}</p>
        </div>
        <form action={signOut} className="ml-auto">
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            ログアウト
          </button>
        </form>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-medium text-gray-700">
        出品した商品({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          まだ出品がありません。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
