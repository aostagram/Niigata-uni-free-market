import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ガタフィー | 新潟大学生のキャンパス内フリーマーケット",
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
          ガタフィーLP は明朝(serif)基調。和文をフル収録する Noto Serif JP を
          Google Fonts css2 で読み込む（OS搭載の Yu Mincho / Hiragino Mincho が
          あればそちらを優先。無い環境向けのフォールバック）。
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased relative">
        <div
          className="fixed inset-0 -z-50 pointer-events-none"
          style={{
            backgroundImage: "url('/brand/page-bg.png')",
            backgroundPosition: "center center",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        />
        {children}
      </body>
    </html>
  );
}
