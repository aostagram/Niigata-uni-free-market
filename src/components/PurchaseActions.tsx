"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, LogIn } from "lucide-react";
import { detectInApp, type InAppKind } from "@/lib/in-app-browser";
import { OpenInBrowserCard } from "./OpenInBrowserCard";

/**
 * 在庫商品の購入導線。次の3段で未ログイン購入・アプリ内ブラウザ購入を防ぐ:
 *  1) アプリ内ブラウザ → ブラウザで開き直す案内（操作不可）
 *  2) 未ログイン       → ログインへ誘導
 *  3) ログイン済み     → 「日時・場所を相談した」確認後に購入フォームへ
 */
export function PurchaseActions({
  buyUrl,
  doneUrl,
  loggedIn,
}: {
  buyUrl: string;
  doneUrl: string;
  loggedIn: boolean;
}) {
  const [kind, setKind] = useState<InAppKind>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKind(detectInApp(navigator.userAgent || ""));
  }, []);

  // 1) アプリ内ブラウザは購入・完了報告ともにブロック
  if (kind) return <OpenInBrowserCard kind={kind} action="購入のお手続き" />;

  // 2) 未ログインは購入させない
  if (!loggedIn) {
    return (
      <div>
        <p className="mb-3 text-[13.5px] leading-[1.7] text-ink-soft">
          購入のお手続きには、新潟大学のメールでのログインが必要です。
        </p>
        <Link href="/login" className="btn btn-primary w-full py-4 text-base">
          <LogIn size={18} />
          ログインして購入する
        </Link>
      </div>
    );
  }

  // 3) ログイン済み：受け渡しの相談を確認してから購入
  const openExternal = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-paper-soft p-3.5">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 flex-none accent-brand"
        />
        <span className="text-[13.5px] leading-[1.7] text-ink">
          出品者と<b>受け渡しの日時・場所</b>を相談しました。
          <span className="mt-0.5 block text-[12px] text-ink-soft">
            まだの場合は、上の「出品者に連絡する」から先に相談してください。
          </span>
        </span>
      </label>

      <button
        type="button"
        disabled={!agreed}
        onClick={() => openExternal(buyUrl)}
        className="btn btn-primary mt-3 w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ShoppingBag size={18} />
        この商品を購入する
      </button>
      <p className="mt-2.5 text-center text-[12.5px] text-ink-soft">
        在庫番号・お名前は自動入力されます。フォームから購入希望を送信してください。
      </p>

      <button
        type="button"
        onClick={() => openExternal(doneUrl)}
        className="btn btn-ghost mt-2.5 w-full py-3 text-sm"
      >
        取引完了を報告する（購入者）
      </button>
    </div>
  );
}
