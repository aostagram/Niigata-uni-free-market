"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/app/actions/chat";
import type { Message } from "@/lib/types";

export function ChatRoom({
  roomId,
  currentUserId,
  initialMessages,
}: {
  roomId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // リアルタイム購読
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setText("");

    // 楽観的更新
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      room_id: roomId,
      sender_id: currentUserId,
      message_text: body,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const res = await sendMessage(roomId, body);
    if (res?.error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setText(body);
      alert(res.error);
    }
    setSending(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* 安全な取引ガイドラインはチャット内には表示しない(嵩張るため)。
         安全な取引の案内は各商品ページの「受け渡しについて」に集約している。 */}
      <div className="thin-scroll flex-1 space-y-3.5 overflow-y-auto py-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">
            最初のメッセージを送ってみましょう。
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div className={`bubble ${mine ? "bubble-sent" : "bubble-recv"}`}>
                {m.message_text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力欄は画面下にぴったり固定(flex の最後尾＝列の最下部)。
         iPhone のホームバー分の余白も確保する。 */}
      <form
        onSubmit={handleSend}
        className="flex shrink-0 items-center gap-2.5 border-t border-line bg-background pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メッセージを入力..."
          maxLength={2000}
          className="flex-1 rounded-full border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          aria-label="送信"
          className="btn btn-primary h-11 w-11 shrink-0 rounded-full p-0"
        >
          <Send size={19} />
        </button>
      </form>
    </div>
  );
}
