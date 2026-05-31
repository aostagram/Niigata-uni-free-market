import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "新大フリマ | 新潟大学生のキャンパス内フリーマーケット",
  description:
    "新潟大学生限定。キャンパス内で中古品を売買・譲渡・交換できるマッチングアプリ。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
