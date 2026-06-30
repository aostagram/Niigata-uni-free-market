"use client";

import { useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { startChatRoom } from "@/app/actions/chat";

export function ContactButton({ itemId }: { itemId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await startChatRoom(itemId);
          if (res?.error) alert(res.error);
        })
      }
      className="btn btn-primary w-full py-4 text-base"
    >
      <MessageSquare size={19} />
      {pending ? "準備中…" : "出品者に連絡する"}
    </button>
  );
}
