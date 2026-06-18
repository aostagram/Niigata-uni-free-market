/**
 * ガタフィー ロゴ。LP と同じ横長ロックアップ画像（箱アイコン＋「ガタフィー」）。
 * 透過PNG なので水彩背景にそのまま載る。
 */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const h = size === "lg" ? 72 : 44;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="ガタフィー"
      style={{ height: h, width: "auto" }}
      className="object-contain"
    />
  );
}
