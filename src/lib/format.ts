/** 価格表示(0円は「無料で譲渡」扱い) */
export function formatPrice(price: number): string {
  return price === 0 ? "無料" : `¥${price.toLocaleString("ja-JP")}`;
}

/** 相対的な投稿時刻("3分前" など) */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (sec < 60) return "たった今";
  if (min < 60) return `${min}分前`;
  if (hour < 24) return `${hour}時間前`;
  if (day < 7) return `${day}日前`;
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
