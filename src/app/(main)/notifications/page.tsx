import Link from "next/link";
import { Bell, MessageSquare, CircleCheck, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format";

type RoomRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  item: { id: string; title: string } | null;
  buyer: { id: string; full_name: string } | null;
  seller: { id: string; full_name: string } | null;
  messages: { message_text: string; sender_id: string; created_at: string }[];
};

type Notice = {
  key: string;
  kind: "message" | "deal";
  icon: LucideIcon;
  title: string;
  body: string;
  time: string;
  href: string;
  unread: boolean;
};

/**
 * 通知ページ。専用の通知テーブルは無いため、実データ
 * （受信メッセージ・売却済みの自分の出品）から通知フィードを組み立てる。
 * ダミーの通知は表示しない。
 */
export default async function NotificationsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: roomData }, { data: soldData }] = await Promise.all([
    supabase
      .from("chat_rooms")
      .select(
        `id, buyer_id, seller_id, created_at,
         item:items!chat_rooms_item_id_fkey(id, title),
         buyer:profiles!chat_rooms_buyer_id_fkey(id, full_name),
         seller:profiles!chat_rooms_seller_id_fkey(id, full_name),
         messages(message_text, sender_id, created_at)`,
      )
      .or(`buyer_id.eq.${profile.id},seller_id.eq.${profile.id}`)
      // 通知には各ルームの最新1件だけが必要。全件取得を避ける。
      .order("created_at", { referencedTable: "messages", ascending: false })
      .limit(1, { referencedTable: "messages" }),
    supabase
      .from("items")
      .select("id, title, status, created_at")
      .eq("user_id", profile.id)
      .eq("status", "sold")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const rooms = (roomData ?? []) as unknown as RoomRow[];
  const notices: Notice[] = [];

  // 受信メッセージ → 通知（クエリ側で各ルーム最新1件に絞り済み）
  for (const r of rooms) {
    const last = r.messages[0];
    if (!last) continue;
    const fromMe = last.sender_id === profile.id;
    const partner = r.buyer_id === profile.id ? r.seller : r.buyer;
    notices.push({
      key: `msg-${r.id}`,
      kind: "message",
      icon: MessageSquare,
      title: `${partner?.full_name ?? "取引相手"}さんからメッセージ`,
      body: last.message_text,
      time: last.created_at,
      href: `/chat/${r.id}`,
      unread: !fromMe,
    });
  }

  // 売却済みの自分の出品 → 通知
  const sold = (soldData ?? []) as {
    id: string;
    title: string;
    created_at: string;
  }[];
  for (const s of sold) {
    notices.push({
      key: `sold-${s.id}`,
      kind: "deal",
      icon: CircleCheck,
      title: "取引が完了しました",
      body: `「${s.title}」が取引完了になりました`,
      time: s.created_at,
      href: `/items/${s.id}`,
      unread: false,
    });
  }

  notices.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  const iconStyle: Record<Notice["kind"], { bg: string; fg: string }> = {
    message: { bg: "#e3edf7", fg: "#4d7bb0" },
    deal: { bg: "#eaf2d6", fg: "var(--brand-deep)" },
  };

  return (
    <div className="fade-up">
      <div className="heading-row mb-1">
        <Bell size={24} className="text-brand-deep" />
        <h1 className="font-round text-2xl font-bold text-ink">通知</h1>
      </div>
      <p className="mb-5 text-sm text-ink-soft">
        メッセージ・取引のお知らせが届きます。
      </p>

      {notices.length === 0 ? (
        <div className="ds-card border-dashed py-16 text-center text-ink-soft">
          まだ通知はありません。
        </div>
      ) : (
        <ul className="ds-card divide-y divide-line-soft overflow-hidden">
          {notices.map((n) => {
            const st = iconStyle[n.kind];
            return (
              <li key={n.key}>
                <Link
                  href={n.href}
                  className={`flex items-center gap-3.5 px-4 py-4 transition hover:bg-panel ${
                    n.unread ? "bg-[rgba(132,173,63,.05)]" : ""
                  }`}
                >
                  <span
                    className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px]"
                    style={{ background: st.bg, color: st.fg }}
                  >
                    <n.icon size={21} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-round text-sm font-bold text-ink">
                      {n.title}
                    </p>
                    <p className="truncate text-[13px] text-ink-soft">
                      {n.body}
                    </p>
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1.5">
                    <span className="text-[12px] text-ink-faint">
                      {formatRelativeTime(n.time)}
                    </span>
                    {n.unread ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    ) : (
                      <ChevronRight size={16} className="text-ink-faint" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
