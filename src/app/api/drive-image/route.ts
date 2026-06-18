import { NextResponse } from "next/server";

/**
 * Google ドライブ画像のプロキシ。
 * /api/drive-image?id=<fileId> でサーバー側から取得して画像を返す。
 * （Drive の直リンクはブラウザのリファラ制限で出ないことが多いため、
 *   サーバー経由にして確実に表示する。ファイルが「リンクを知っている
 *   全員: 閲覧者」で公開されている必要がある。）
 */
const PLACEHOLDER = "/brand/no-image.svg";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.redirect(new URL(PLACEHOLDER, req.url));

  const candidates = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
    `https://lh3.googleusercontent.com/d/${id}=w1200`,
    `https://drive.google.com/uc?export=download&id=${id}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        cache: "no-store",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      });
      const ct = res.headers.get("content-type") ?? "";
      if (res.ok && ct.startsWith("image/")) {
        const buf = await res.arrayBuffer();
        return new NextResponse(buf, {
          headers: {
            "content-type": ct,
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        });
      }
    } catch {
      // 次の候補へ
    }
  }

  // 取得できなければプレースホルダーへ
  return NextResponse.redirect(new URL(PLACEHOLDER, req.url));
}
