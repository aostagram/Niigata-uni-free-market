import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { AddItemForm } from "@/components/AddItemForm";

export default async function NewItemPage() {
  const profile = await requireProfile();

  return (
    <div className="fade-up">
      <Link href="/" className="nav-link mb-4 inline-flex items-center gap-2">
        <ArrowLeft size={18} />
        もどる
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="heading-row mb-1">
            <h1 className="font-round text-2xl font-bold text-ink">
              商品を出品する
            </h1>
            <Sprout size={22} className="text-brand" />
          </div>
          <p className="text-sm text-ink-soft">
            必要な情報を入力して、商品を出品しましょう。
          </p>
        </div>
        {/* ステップ表示 */}
        <ol className="flex items-center gap-2">
          {[
            { n: "1", label: "情報入力", on: true },
            { n: "2", label: "内容確認", on: false },
            { n: "3", label: "出品完了", on: false },
          ].map((s, i) => (
            <li key={s.n} className="flex items-center gap-2">
              {i > 0 && (
                <span className="h-px w-5 border-t border-dashed border-line" />
              )}
              <span className="flex flex-col items-center gap-1">
                <span
                  className={`font-round flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    s.on
                      ? "bg-brand text-white"
                      : "bg-[#e3e8d8] text-ink-faint"
                  }`}
                >
                  {s.n}
                </span>
                <span
                  className={`font-round text-[11px] ${
                    s.on ? "font-bold text-brand-deep" : "text-ink-faint"
                  }`}
                >
                  {s.label}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <AddItemForm userId={profile.id} />
    </div>
  );
}
