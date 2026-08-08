import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://furima.gatabottle.com";

/**
 * 検索エンジン向けクロール設定。
 * 公開終了により、残っているのはお知らせ(トップ)・規約・プライバシーのみ。
 * それ以外は全てトップへリダイレクトするので、クロール対象から外す。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/terms", "/privacy"],
      disallow: [
        "/stock",
        "/items",
        "/users",
        "/login",
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
