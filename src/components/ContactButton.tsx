"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { startChatRoom } from "@/app/actions/chat";

export function ContactButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);
    try {
      const res = await startChatRoom(itemId);
      if ("error" in res) {
        alert(res.error);
      } else {
        router.push(`/chat/${res.roomId}`);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="btn btn-primary w-full py-4 text-base"
    >
      <MessageSquare size={19} />
      {pending ? "準備中…" : "出品者に連絡する"}
    </button>
  );
}
