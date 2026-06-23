"use client";

import { useEffect, useState } from "react";
import { ExternalLink, TriangleAlert } from "lucide-react";

/**
 * LINE / Instagram / Facebook などのアプリ内ブラウザ(WebView)検知。
 * これらでは Google ログインが「安全なブラウザの使用」ポリシーで弾かれる
 * (error 403: disallowed_useragent)ため、外部ブラウザで開くよう案内する。
 */
function detectInApp(ua: string): "line" | "android" | "ios" | "other" | null {
  const s = ua.toLowerCase();
  const isInApp =
    /\bline\//.test(s) ||
    /instagram/.test(s) ||
    /\bfb(an|av|_iab)/.test(s) ||
    /twitter/.test(s) ||
    /micromessenger/.test(s) ||
    /tiktok|musical_ly|bytedancewebview/.test(s) ||
    /\bwv\b/.test(s); // 汎用 Android WebView
  if (!isInApp) return null;
  if (/\bline\//.test(s)) return "line";
  if (/android/.test(s)) return "android";
  if (/iphone|ipad|ipod/.test(s)) return "ios";
  return "other";
}

export function InAppBrowserNotice() {
  const [kind, setKind] = useState<ReturnType<typeof detectInApp>>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // navigator はクライアントのみ。マウント後に判定する必要がある。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKind(detectInApp(navigator.userAgent || ""));
  }, []);

  if (!kind) return null;

  const openExternal = () => {
    const url = window.location.href.split("#")[0];
    if (kind === "line") {
      // LINE は openExternalBrowser=1 を付けると標準ブラウザで開く
      const sep = url.includes("?") ? "&" : "?";
      window.location.href = `${url}${sep}openExternalBrowser=1`;
      return;
    }
    if (kind === "android") {
      // Android は intent:// で Chrome を指定して開く
      const noScheme = url.replace(/^https?:\/\//, "");
      window.location.href = `intent://${noScheme}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }
    // iOS などは強制起動できないため、URLをコピーして手動で開いてもらう
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      },
      () => {},
    );
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
        onClick={openExternal}
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
