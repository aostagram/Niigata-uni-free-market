"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronsDown } from "lucide-react";
import type { LegalDocument } from "@/lib/legal";

/**
 * 規約・プライバシー本文をスクロールボックスで表示し、
 * 「一番下まで読む」までは同意チェックを押せないようにするコンポーネント。
 */
export function ConsentDocBox({
  doc,
  fullHref,
  label,
  checked,
  onChange,
}: {
  doc: LegalDocument;
  fullHref: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(false);

  // 内容がボックスより短くスクロール不要なときは最初から同意可能にする。
  useEffect(() => {
    const el = ref.current;
    if (el && el.scrollHeight - el.clientHeight < 24) {
      setReached(true);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) setReached(true);
  };

  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-round text-[13px] font-bold text-brand-deep">
          {doc.title}
        </span>
        <a
          href={fullHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-brand-deep underline"
        >
          別ページで開く
        </a>
      </div>

      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-44 overflow-y-auto rounded-xl border border-line bg-white p-3 text-[12px] leading-[1.7] text-ink-soft"
      >
        <p className="mb-2 text-ink-faint">{doc.effectiveDate}</p>
        {doc.lead && <p className="mb-3">{doc.lead}</p>}
        {doc.sections.map((s, i) => (
          <section key={i} className="mb-3">
            <h4 className="mb-1 font-bold text-ink">{s.heading}</h4>
            {s.paragraphs?.map((p, j) => (
              <p key={j} className="mb-1.5">
                {p}
              </p>
            ))}
            {s.list && (
              <ol className="ml-4 list-decimal space-y-1">
                {s.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ol>
            )}
          </section>
        ))}
        <p className="mt-3 border-t border-line pt-2 text-center font-bold text-brand-deep">
          — 以上 —
        </p>
      </div>

      <button
        type="button"
        disabled={!reached}
        onClick={() => reached && onChange(!checked)}
        aria-pressed={checked}
        className={`mt-2 flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-left ${
          reached ? "cursor-pointer" : "cursor-not-allowed opacity-55"
        }`}
      >
        <span
          className="flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border-2 transition"
          style={{
            borderColor: checked ? "var(--brand)" : "#cfd8bf",
            background: checked ? "var(--brand)" : "#fff",
          }}
        >
          {checked && <Check size={15} strokeWidth={3} className="text-white" />}
        </span>
        <span className="text-[14.5px] text-ink">{label}</span>
      </button>

      {!reached && (
        <p className="mt-0.5 flex items-center gap-1 pl-1 text-[12px] text-coral">
          <ChevronsDown size={14} />
          最後までスクロールすると同意できます
        </p>
      )}
    </div>
  );
}
