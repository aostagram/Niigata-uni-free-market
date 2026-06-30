"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Sprout, CheckCircle2 } from "lucide-react";
import type { LegalDocument } from "@/lib/legal";

/**
 * 利用規約・プライバシーポリシー表示。
 * 一番下まで読まないと「確認しました」ボタンが押せない仕様。
 * ボタン押下時に localStorage にフラグを保存 → ログイン画面のチェックボックスが有効化される。
 */
export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setReachedBottom(true); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleConfirm() {
    if (!reachedBottom) return;
    try {
      localStorage.setItem(`gatafee_read_${doc.storageKey}`, "1");
    } catch { /* localStorage 無効環境では無視 */ }
    setConfirmed(true);
  }

  return (
    <main className="wc-page min-h-dvh px-5 py-10">
      <div className="fade-up mx-auto w-full max-w-2xl">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-deep hover:underline"
        >
          <ArrowLeft size={16} />
          戻る
        </Link>

        <div className="ds-card p-6 sm:p-8">
          <div className="heading-row">
            <Sprout size={20} className="text-brand" />
            <h1 className="font-round text-xl font-bold text-ink sm:text-2xl">
              {doc.title}
            </h1>
          </div>
          <p className="mt-2 text-xs text-ink-faint">{doc.effectiveDate}</p>

          {doc.lead && (
            <p className="ds-panel mt-5 px-4 py-3 text-[13.5px] leading-[1.8] text-ink-soft">
              {doc.lead}
            </p>
          )}

          <div className="mt-6 space-y-7">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-round border-l-[3px] border-brand pl-3 text-[15px] font-bold text-brand-deep">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p, i) => (
                  <p key={i} className="mt-2.5 text-[14px] leading-[1.9] text-ink-soft">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ol className="mt-2.5 list-decimal space-y-2 pl-5 text-[14px] leading-[1.85] text-ink-soft marker:text-brand">
                    {s.list.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>

          {/* スクロール検知の番兵 */}
          <div ref={bottomRef} className="mt-8 pt-2" />

          {/* 確認ボタン（一番下まで読むと有効化） */}
          {confirmed ? (
            <div className="flex items-center gap-3 rounded-2xl bg-[#eef6dd] p-4 mt-2">
              <CheckCircle2 size={24} className="shrink-0 text-brand-deep" />
              <p className="font-round text-[14px] font-bold text-brand-deep">
                確認しました。ログイン画面のチェックが有効になります。
              </p>
            </div>
          ) : (
            <div className="mt-2">
              {!reachedBottom && (
                <p className="mb-2 text-center text-[12px] text-ink-faint">
                  ▼ 一番下まで読むと確認ボタンが有効になります
                </p>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!reachedBottom}
                className={`btn w-full py-3.5 text-[14px] ${reachedBottom ? "btn-primary" : "btn-disabled"}`}
              >
                {reachedBottom ? "内容を確認しました" : "最後まで読んでください"}
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          © 2026 ガタフィー — Niigata Free Market
        </p>
      </div>
    </main>
  );
}
