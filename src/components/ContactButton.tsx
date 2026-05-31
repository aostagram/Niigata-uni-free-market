"use client";

import { useTransition } from "react";
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
      className="w-full rounded-xl bg-brand py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? "準備中…" : "出品者に問い合わせる"}
    </button>
  );
}
