import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomTabBar } from "@/components/BottomTabBar";
import { ConditionalChrome } from "@/components/ConditionalChrome";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wc-soft flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 md:pb-10">
        {children}
      </main>
      {/* チャット会話画面では下部入力欄を画面下に固定するため非表示にする */}
      <ConditionalChrome>
        <Footer />
        <BottomTabBar />
      </ConditionalChrome>
    </div>
  );
}
