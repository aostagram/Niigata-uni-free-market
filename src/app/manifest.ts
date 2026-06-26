import type { MetadataRoute } from "next";

/** PWA/スマホのホーム追加・SEO向けの Web アプリマニフェスト。 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ガタフィー | 新潟大学生のキャンパス内掲示板アプリ",
    short_name: "ガタフィー",
    description:
      "新潟大学生限定の掲示板アプリ。教科書・家具・家電などをキャンパス内で安心して譲渡・売買のやり取りができます。",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfdf7",
    theme_color: "#84ad3f",
    lang: "ja",
    icons: [
      {
        src: "/brand/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
