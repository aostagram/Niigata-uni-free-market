"use client";

import { useState } from "react";

/** メルカリ風の画像ギャラリー。大きな1枚＋サムネイル、クリックで切替。 */
export function StockGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const pics = images.length > 0 ? images : ["/brand/no-image.svg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        className="overflow-hidden rounded-[var(--radius-ds)] border border-line bg-white"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        {/* 商品全体が切れずに見えるよう contain（縦長・横長どちらも全体表示） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pics[active]}
          alt={alt}
          className="aspect-square w-full bg-[#f3f4ef] object-contain"
        />
      </div>

      {pics.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {pics.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`画像 ${i + 1}`}
              aria-current={i === active}
              className="overflow-hidden rounded-xl border-2 transition"
              style={{
                borderColor: i === active ? "var(--brand)" : "var(--line)",
                width: 72,
                height: 72,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} ${i + 1}枚目`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
