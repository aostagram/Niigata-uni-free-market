import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import type { LegalDocument } from "@/lib/legal";

/**
 * 利用規約・プライバシーポリシーを表示する共通ビュー。
 * /terms ・ /privacy はログイン前(ログイン画面)からも開けるため、
 * Header を持たない独立ページとして描画する。
 */
export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
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
                  <p
                    key={i}
                    className="mt-2.5 text-[14px] leading-[1.9] text-ink-soft"
                  >
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
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          © 2026 ガタフィー — Niigata Campus Board
        </p>
      </div>
    </main>
  );
}
