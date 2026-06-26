import Link from "next/link";
import { SERVICE_DISCLAIMER } from "@/lib/constants";

const LINKS: { label: string; href: string }[] = [
  { label: "商品を探す", href: "/#listings" },
  { label: "お客様の声", href: "/#voices" },
  { label: "利用規約", href: "/terms" },
  { label: "プライバシーポリシー", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line-soft">
      <div className="mx-auto max-w-[1180px] px-6 py-7">
        <div className="ds-panel px-4 py-3">
          <p className="text-xs leading-relaxed text-ink-soft">
            {SERVICE_DISCLAIMER}
          </p>
        </div>

        <div className="font-round mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[13px] text-ink-soft">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-brand-deep"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} ガタフィー — Niigata Campus Board
        </p>
      </div>
    </footer>
  );
}
