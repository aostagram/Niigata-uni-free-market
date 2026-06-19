import { Star } from "lucide-react";

/**
 * メルカリ風の★5段階評価表示。average(0〜5)に応じて金色の星を部分的に塗る。
 * count を渡すと「(N件)」を併記。レビュー0件は淡色＋「レビューなし」。
 */
export function StarRating({
  average,
  count,
  size = 18,
}: {
  average: number;
  count?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (average / 5) * 100));
  const hasReviews = (count ?? 0) > 0;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="relative inline-block leading-none"
        style={{ width: size * 5, height: size }}
        aria-label={`5段階評価 ${average.toFixed(1)}`}
      >
        {/* 下地（淡いグレーの星） */}
        <span className="absolute inset-0 flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} className="text-line" fill="currentColor" />
          ))}
        </span>
        {/* 上に金色を平均値ぶんだけ重ねる */}
        <span
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              size={size}
              className="shrink-0 text-amber-400"
              fill="currentColor"
            />
          ))}
        </span>
      </span>
      {hasReviews ? (
        <span className="text-[13px] text-ink-soft">
          <b className="text-ink">{average.toFixed(1)}</b>（{count}件）
        </span>
      ) : (
        <span className="text-[12px] text-ink-faint">レビューなし</span>
      )}
    </span>
  );
}
