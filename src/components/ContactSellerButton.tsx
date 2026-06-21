"use client";

import { useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { startStockChat } from "@/app/actions/chat";

/**
 * 在庫商品の「出品者に連絡する」。クリックで出品者アカウントとのチャットへ。
 * 出品者が未登録などで開始できない場合はメッセージを表示する。
 */
export function ContactSellerButton({ stockId }: { stockId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await startStockChat(stockId);
          if (res?.error) alert(res.error);
        })
      }
      className="btn btn-primary w-full py-4 text-base"
    >
      <MessageSquare size={18} />
      {pending ? "準備中…" : "出品者に連絡する"}
    </button>
  );
}
