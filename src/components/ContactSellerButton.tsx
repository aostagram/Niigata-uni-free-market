"use client";

import { useEffect, useState, useTransition } from "react";
import { MessageSquare, ExternalLink } from "lucide-react";
import { startStockChat } from "@/app/actions/chat";
import {
  detectInApp,
  openInExternalBrowser,
  type InAppKind,
} from "@/lib/in-app-browser";

/**
 * 在庫商品の「出品者に連絡する」。クリックで出品者アカウントとのチャットへ。
 * アプリ内ブラウザ(LINE等)ではログイン不可のため、外部ブラウザへ誘導する。
 * 出品者が未登録などで開始できない場合はメッセージを表示する。
 */
export function ContactSellerButton({ stockId }: { stockId: string }) {
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<InAppKind>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKind(detectInApp(navigator.userAgent || ""));
  }, []);

  if (kind) {
    return (
      <button
        type="button"
        onClick={() => openInExternalBrowser(kind)}
        className="btn btn-primary w-full py-4 text-base"
      >
        <ExternalLink size={18} />
        ブラウザで開いて連絡する
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await startStockChat(stockId);
          // チャットへ遷移できた場合は res は返らない（redirect）。
          // 連絡できないときは error、メールで取り次げたときは message を表示。
          if (res?.error) alert(res.error);
          else if (res?.message) alert(res.message);
        })
      }
      className="btn btn-primary w-full py-4 text-base"
    >
      <MessageSquare size={18} />
      {pending ? "準備中…" : "出品者に連絡する"}
    </button>
  );
}
