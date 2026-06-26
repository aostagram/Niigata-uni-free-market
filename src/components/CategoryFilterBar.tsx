"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { EXPERIMENT_CATEGORY_NOTICE } from "@/lib/constants";

type Cat = { key: string; label: string };

/**
 * 商品一覧のカテゴリ絞り込みバー。実験運用中のため、教科書と「すべて」以外は
 * 「準備中」でタップ時に案内を表示するだけにする。
 */
export function CategoryFilterBar({
  categories,
  active,
}: {
  categories: Cat[];
  active?: string;
}) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = () => {
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 4500);
  };

  const isAll = !active || active === "all";

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/stock"
          className={`btn ${isAll ? "btn-primary" : "btn-ghost"} px-4 py-2 text-sm`}
        >
          すべて
        </Link>
        {categories.map((c) =>
          c.key === "textbook" ? (
            <Link
              key={c.key}
              href={`/stock?category=${c.key}`}
              className={`btn ${active === c.key ? "btn-primary" : "btn-ghost"} px-4 py-2 text-sm`}
            >
              {c.label}
            </Link>
          ) : (
            <button
              key={c.key}
              type="button"
              onClick={notify}
              aria-disabled="true"
              className="btn btn-ghost cursor-not-allowed px-4 py-2 text-sm opacity-50"
            >
              {c.label}
              <span className="ml-1 text-[10px]">準備中</span>
            </button>
          ),
        )}
      </div>
      {show && (
        <div className="fixed inset-x-0 bottom-24 z-[60] mx-auto w-[min(92%,440px)] rounded-2xl bg-ink/90 px-4 py-3 text-center text-[13px] leading-relaxed text-white shadow-xl">
          {EXPERIMENT_CATEGORY_NOTICE}
        </div>
      )}
    </>
  );
}
