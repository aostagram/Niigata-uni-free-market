import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://furima.gatabottle.com";

/**
 * 検索エンジン向けクロール設定。
 * 公開LP(トップ)・規約・プライバシーは許可し、ログイン必須の個人領域は除外する。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/chat",
        "/profile",
        "/notifications",
        "/onboarding",
        "/playground",
        "/api/",
        "/auth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
