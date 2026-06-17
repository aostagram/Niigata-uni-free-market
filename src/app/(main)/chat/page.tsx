import Link from "next/link";
import { MessageSquare, Sprout } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format";

type Row = {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  item: { id: string; title: string; image_url: string | null; status: string } | null;
  buyer: { id: string; full_name: string; avatar_url: string | null } | null;
  seller: { id: string; full_name: string; avatar_url: string | null } | null;
  messages: { message_text: string; created_at: string }[];
};

export default async function ChatListPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("chat_rooms")
    .select(
      `id, buyer_id, seller_id, created_at,
       item:items!chat_rooms_item_id_fkey(id, title, image_url, status),
       buyer:profiles!chat_rooms_buyer_id_fkey(id, full_name, avatar_url),
       seller:profiles!chat_rooms_seller_id_fkey(id, full_name, avatar_url),
       messages(message_text, created_at)`,
    )
    .or(`buyer_id.eq.${profile.id},seller_id.eq.${profile.id}`)
    // 一覧には各ルームの最新1件だけが必要。全件取得を避ける。
    .order("created_at", { referencedTable: "messages", ascending: false })
    .limit(1, { referencedTable: "messages" });

  const rows = (data ?? []) as unknown as Row[];

  const rooms = rows
    .map((r) => {
      const last = r.messages[0];
      const partner = r.buyer_id === profile.id ? r.seller : r.buyer;
      return { ...r, last, partner };
    })
    .sort((a, b) => {
      const at = new Date(a.last?.created_at ?? a.created_at).getTime();
      const bt = new Date(b.last?.created_at ?? b.created_at).getTime();
      return bt - at;
    });

  return (
    <div className="fade-up">
      <div className="heading-row mb-1">
        <MessageSquare size={24} className="text-brand-deep" />
        <h1 className="font-round text-2xl font-bold text-ink">メッセージ</h1>
        <Sprout size={20} className="ml-auto text-brand" />
      </div>
      <p className="mb-5 text-sm text-ink-soft">
        取引相手とのやり取りはこちらから。
      </p>

      {rooms.length === 0 ? (
        <div className="ds-card border-dashed py-16 text-center text-ink-soft">
          まだメッセージはありません。
        </div>
      ) : (
        <ul className="ds-card divide-y divide-line-soft overflow-hidden">
          {rooms.map((c) => (
            <li key={c.id}>
              <Link
                href={`/chat/${c.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-panel"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-panel-2">
                  {c.item?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.item.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-round truncate text-sm font-bold text-ink">
                      {c.partner?.full_name ?? "退会したユーザー"}
                    </p>
                    {c.last && (
                      <span className="shrink-0 text-xs text-ink-faint">
                        {formatRelativeTime(c.last.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-ink-faint">
                    {c.item?.title}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {c.last?.message_text ?? "（メッセージなし）"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
