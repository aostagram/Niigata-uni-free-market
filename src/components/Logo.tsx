import { ShoppingBag } from "lucide-react";

/**
 * 新大フリマ ロゴ。水彩の丸い地に ShoppingBag を載せ、
 * 丸ゴシックのワードマーク＋ラテン副題を添える。
 */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  const d = big ? 64 : 44;

  return (
    <span className="flex items-center" style={{ gap: big ? 14 : 10 }}>
      <span
        className="flex flex-none items-center justify-center rounded-full border-2 border-white"
        style={{
          width: d,
          height: d,
          background:
            "radial-gradient(circle at 50% 40%, #eef5dd, #dceabf)",
          boxShadow: "0 4px 12px -6px rgba(95,129,40,.5)",
        }}
      >
        <ShoppingBag
          size={big ? 30 : 21}
          strokeWidth={2.1}
          className="text-brand-deep"
        />
      </span>
      <span className="leading-[1.05]">
        <span
          className="font-round block font-bold tracking-[0.04em] text-[color:var(--logo)]"
          style={{ fontSize: big ? 30 : 21 }}
        >
          新大フリマ
        </span>
        <span
          className="font-latin block tracking-[0.08em] text-brand"
          style={{ fontSize: big ? 13 : 9.5, marginTop: big ? 4 : 1 }}
        >
          Niigata univ. Free Market
        </span>
      </span>
    </span>
  );
}
