"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Check } from "lucide-react";
import { startStockChatRoom } from "@/app/actions/chat";

/**
 * 商品詳細ページの購入希望・チャット導線（クライアントコンポーネント）。
 * - 「受け取り場所・時間が出品者と決定済み」チェックを確認してからのみ購入希望フォームを送信できる。
 * - 「チャットで相談する」ボタンでチャットルームへ遷移（ログイン必須）。
 */
export function StockDetailActions({
  stockId,
  buyUrl,
  doneUrl,
  loggedIn,
}: {
  stockId: string;
  buyUrl: string;
  doneUrl: string;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [chatPending, setChatPending] = useState(false);

  async function handleChat() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }
    if (chatPending) return;
    setChatPending(true);
    try {
      const res = await startStockChatRoom(stockId);
      if ("error" in res) {
        alert(res.error);
      } else {
        router.push(`/chat/${res.roomId}`);
      }
    } finally {
      setChatPending(false);
    }
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      {/* チャットで相談 */}
      <button
        type="button"
        onClick={handleChat}
        disabled={chatPending}
        className="btn btn-primary w-full py-4 text-base"
      >
        <MessageSquare size={18} />
        {chatPending ? "準備中…" : "出品者にチャットで相談する"}
      </button>

      {/* 購入希望フォームへ（受け取り確認チェックが必要） */}
      <div
        className="rounded-[var(--radius-ds)] border p-4"
        style={{ background: "#f8fbf0", borderColor: "var(--line)" }}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            aria-pressed={agreed}
            className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border-2 transition"
            style={{
              borderColor: agreed ? "var(--brand)" : "#cfd8bf",
              background: agreed ? "var(--brand)" : "#fff",
            }}
          >
            {agreed && <Check size={14} strokeWidth={3} className="text-white" />}
          </button>
          <span className="text-[13.5px] leading-[1.7] text-ink-soft">
            出品者とチャットで<b className="text-ink">受け取る場所・日時</b>が決まりました。
            購入希望フォームを提出します。
          </span>
        </label>
        <a
          href={agreed ? buyUrl : undefined}
          onClick={!agreed ? (e) => e.preventDefault() : undefined}
          target={agreed ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`btn mt-3 w-full py-3.5 text-[13.5px] ${agreed ? "btn-primary" : "btn-disabled"}`}
          style={agreed ? {} : { pointerEvents: "none" }}
          aria-disabled={!agreed}
        >
          購入希望を提出する
        </a>
        {!agreed && (
          <p className="mt-2 text-center text-[11.5px] text-ink-faint">
            上のチェックを入れてから送信できます
          </p>
        )}
      </div>

      {/* 取引完了報告 */}
      <a
        href={doneUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost w-full py-3 text-sm"
      >
        取引完了を報告する（購入者）
      </a>
    </div>
  );
}
