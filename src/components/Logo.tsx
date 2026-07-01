/**
 * ガタフィー ロゴ。LP と同じ横長ロックアップ画像（箱アイコン＋「ガタフィー」）。
 * 透過PNG なので水彩背景にそのまま載る。
 * md はスマホで少し小さく（題名の表示領域を確保）。
 */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="ガタフィー"
      className={`w-auto object-contain ${
        size === "lg" ? "h-[72px]" : "h-9 sm:h-11"
      }`}
    />
  );
}

