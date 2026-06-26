"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { EXPERIMENT_CATEGORY_NOTICE } from "@/lib/constants";

type Tile = { label: string; href: string; img: string };

/**
 * ホームのカテゴリタイル。実験運用中のため、教科書以外は「準備中」で
 * タップすると案内を表示するだけにする（ボタンは見えるが開けない）。
 */
export function CategoryTiles({ tiles }: { tiles: readonly Tile[] }) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = () => {
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 4500);
  };

  return (
    <>
      <div className="category-grid" aria-label="カテゴリ一覧">
        {tiles.map((c) =>
          c.href.includes("category=textbook") ? (
            <Link key={c.label} className="category-tile has-img" href={c.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="category-img" src={c.img} alt={c.label} />
            </Link>
          ) : (
            <button
              key={c.label}
              type="button"
              onClick={notify}
              aria-disabled="true"
              className="category-tile has-img relative cursor-not-allowed"
              style={{ opacity: 0.5 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="category-img" src={c.img} alt={c.label} />
              <span className="absolute right-1.5 top-1.5 rounded-full bg-ink/75 px-2 py-0.5 text-[10px] font-bold text-white">
                準備中
              </span>
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
