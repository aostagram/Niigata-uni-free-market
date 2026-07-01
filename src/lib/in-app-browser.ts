/**
 * アプリ内ブラウザ(WebView)判定と「外部ブラウザで開く」処理の共通ロジック。
 * LINE/Instagram 等のアプリ内ブラウザでは Google ログインがブロックされ
 * (403 disallowed_useragent)、未ログインのまま購入導線に進めてしまうため、
 * ログイン・購入・取引完了・チャットの各操作をここで一括して制御する。
 *
 * クライアント専用（window/navigator を参照）。"use client" 側から使う。
 */

export type InAppKind = "line" | "android" | "ios" | "other" | null;

/** UA からアプリ内ブラウザ種別を判定（通常ブラウザなら null）。 */
export function detectInApp(ua: string): InAppKind {
  const s = (ua || "").toLowerCase();
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

/**
 * 現在のページを外部ブラウザ(Safari/Chrome)で開き直す。
 * - LINE: openExternalBrowser=1 を付けると標準ブラウザで開く
 * - Android: intent:// で Chrome を指定して開く
 * - iOS ほか: 強制起動できないため URL をクリップボードへコピー
 * @returns "launched"（起動を試みた）/ "copied"（URLコピーのみ）/ "none"
 */
export function openInExternalBrowser(kind: InAppKind): "launched" | "copied" | "none" {
  if (typeof window === "undefined") return "none";
  const url = window.location.href.split("#")[0];
  if (kind === "line") {
    const sep = url.includes("?") ? "&" : "?";
    window.location.href = `${url}${sep}openExternalBrowser=1`;
    return "launched";
  }
  if (kind === "android") {
    const noScheme = url.replace(/^https?:\/\//, "");
    window.location.href = `intent://${noScheme}#Intent;scheme=https;package=com.android.chrome;end`;
    return "launched";
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch(() => {});
    return "copied";
  }
  return "none";
}
