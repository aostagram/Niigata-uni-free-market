"use client";

import { useState } from "react";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { openInExternalBrowser, type InAppKind } from "@/lib/in-app-browser";

/**
 * アプリ内ブラウザ(LINE等)で「購入」「出品者への連絡」など、ログインが必要な
 * 操作をブロックし、外部ブラウザで開き直すよう促すカード。
 */
export function OpenInBrowserCard({
  kind,
  action,
}: {
  kind: InAppKind;
  action: string;
}) {
  const [copied, setCopied] = useState(false);

  const onOpen = () => {
    if (openInExternalBrowser(kind) === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="rounded-xl border border-coral-line bg-coral-bg p-4">
      <p className="flex items-center gap-2 font-bold text-coral">
        <TriangleAlert size={18} className="flex-none" />
        ブラウザで開いてください
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.7] text-ink-soft">
        {action}にはログインが必要です。LINE等のアプリ内ブラウザではログインできないため、
        <b>Safari / Chrome</b> で開き直してから操作してください。
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="btn btn-primary mt-3 w-full py-3 text-sm"
      >
        <ExternalLink size={16} />
        ブラウザで開く
      </button>
      {kind === "ios" && (
        <p className="mt-2 text-center text-[12px] text-ink-faint">
          {copied
            ? "URLをコピーしました。Safariに貼り付けて開いてください。"
            : "うまく開けないときは、右上のメニューから「Safariで開く」を選んでください。"}
        </p>
      )}
    </div>
  );
}
