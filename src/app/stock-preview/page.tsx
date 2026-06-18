// 一時プレビュー（商品詳細の見た目確認用）。確認後に削除する。
import StockDetailPage from "../(main)/stock/[stockId]/page";
import { Footer } from "@/components/Footer";

export default async function StockPreview({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <div className="wc-soft flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6">
        {await StockDetailPage({
          params: Promise.resolve({ stockId: id ?? "K003" }),
        })}
      </main>
      <Footer />
    </div>
  );
}
