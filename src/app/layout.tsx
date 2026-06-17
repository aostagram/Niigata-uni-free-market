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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
          日本語の丸ゴシック(Zen Maru Gothic 等)は next/font の subsets:["latin"]
          だと和文グリフが欠落するため、和文をフル収録する Google Fonts css2 を
          link で読み込む。ルートレイアウトで全ページに適用される。
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Comfortaa:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
