import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://furima.gatabottle.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ガタフィー | 新潟大学生のキャンパス内フリマ掲示板アプリ",
    template: "%s | ガタフィー",
  },
  description:
    "新潟大学生限定のフリマ掲示板アプリ「ガタフィー」。教科書・家具・家電・自転車などをキャンパス内で直接手渡し、学生どうしで安心してやり取りできます。新大生どうしだから安心。",
  keywords: [
    "ガタフィー",
    "新潟大学",
    "新大",
    "フリマ",
    "フリマ掲示板",
    "フリマ掲示板アプリ",
    "教科書",
    "中古",
    "学生",
    "キャンパス",
    "譲渡",
    "新潟",
  ],
  applicationName: "ガタフィー",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "ガタフィー",
    locale: "ja_JP",
    url: SITE_URL,
    title: "ガタフィー | 新潟大学生のキャンパス内フリマ掲示板アプリ",
    description:
      "新潟大学生限定のフリマ掲示板アプリ。教科書・家具・家電などをキャンパス内で直接手渡し、安心してやり取りできます。",
    images: [
      {
        url: "/brand/campus-hero.webp",
        width: 1200,
        height: 630,
        alt: "ガタフィー — 新潟大学生のキャンパス内フリマ掲示板アプリ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ガタフィー | 新潟大学生のキャンパス内フリマ掲示板アプリ",
    description:
      "新潟大学生限定のフリマ掲示板アプリ。教科書・家具・家電などをキャンパス内で安心してやり取り。",
    images: ["/brand/campus-hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#84ad3f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "ガタフィー",
        description:
          "新潟大学生限定のフリマ掲示板アプリ。キャンパス内で安心して譲渡・売買のやり取りができます。",
        inLanguage: "ja",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "ガタフィー",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo.png`,
        areaServed: "新潟大学",
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <div className="page-bg-layer fixed inset-0 -z-50 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
