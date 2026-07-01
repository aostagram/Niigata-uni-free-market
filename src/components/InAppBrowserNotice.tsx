"use client";

import { useEffect, useState } from "react";
import { ExternalLink, TriangleAlert } from "lucide-react";
import {
  detectInApp,
  openInExternalBrowser,
  type InAppKind,
} from "@/lib/in-app-browser";

/**
 * ログイン画面用。LINE/Instagram 等のアプリ内ブラウザを検知し、
 * 外部ブラウザで開くよう案内する（Google ログインの 403 対策）。
 */
export function InAppBrowserNotice() {
  const [kind, setKind] = useState<InAppKind>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // navigator はクライアントのみ。マウント後に判定する必要がある。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKind(detectInApp(navigator.userAgent || ""));
  }, []);

  if (!kind) return null;

  const onOpen = () => {
    if (openInExternalBrowser(kind) === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mb-4 w-full rounded-xl border border-coral-line bg-coral-bg p-4">
      <p className="flex items-center gap-2 font-bold text-coral">
        <TriangleAlert size={18} className="flex-none" />
        このアプリ内ブラウザではログインできません
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.7] text-ink-soft">
        Googleの安全ポリシーにより、LINE等のアプリ内ブラウザではログインがブロックされます。
        <b>Safari / Chrome</b> で開いてからログインしてください。
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
