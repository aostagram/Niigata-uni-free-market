// @ts-check
/*
 * 新大フリマ.html のフルページ・スクリーンショット撮影スクリプト
 * ------------------------------------------------------------------
 * デザイン素材の「理想の完成デザイン画像」へピクセル単位で近づける作業の
 * セルフ検証用。design-reference/_shots/ にタイムスタンプ付きPNGを保存する。
 *
 * 使い方:
 *   node scripts/shot.mjs
 *   SHOT_BASE=http://[::1]:8765 node scripts/shot.mjs   # 配信元を明示したいとき
 *
 * 前提のローカルサーバ（design-reference/ を配信）:
 *   cd design-reference && python3 -m http.server 8765
 *
 * ⚠️ ポート8765の注意:
 *   このマシンでは 8765 に複数の http.server が相乗りしており、
 *     - IPv4 (127.0.0.1) … 別プロジェクトが応答し 新大フリマ.html は 404
 *     - IPv6 ([::1])      … design-reference が応答（正しい）
 *   localhost はどちらにも解決し得るため、本スクリプトは候補ホストを順に
 *   叩いて「中身が新大フリマか」を検証し、正しい配信元を自動選択する。
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { mkdir, stat } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = resolve(__dirname, "../design-reference/_shots");
const PAGE = "新大フリマ.html";
const WIDTH = 1280;
// 撮りたい画面（login/home/search/detail/chat/...）。プロトタイプは
// localStorage の niidai_route で初期画面が決まるため、ここで注入する。
const SCREEN = process.env.SHOT_SCREEN || "";

// 配信元の候補（SHOT_BASE があればそれを最優先で唯一の候補に）
const CANDIDATES = process.env.SHOT_BASE
  ? [process.env.SHOT_BASE]
  : ["http://localhost:8765", "http://[::1]:8765", "http://127.0.0.1:8765"];

/** その base が「新大フリマ」を配信しているか検証する */
async function probe(base) {
  try {
    const url = new URL(`/${PAGE}`, base).href;
    const res = await fetch(url);
    if (!res.ok) return null;
    const html = await res.text();
    if (!html.includes("新大フリマ")) return null;
    return url;
  } catch {
    return null;
  }
}

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}

async function main() {
  // 1) 正しい配信元を自動判定
  let targetUrl = null;
  let usedBase = null;
  for (const base of CANDIDATES) {
    const url = await probe(base);
    if (url) {
      targetUrl = url;
      usedBase = base;
      break;
    }
  }

  if (!targetUrl) {
    console.error(
      [
        `✗ 新大フリマ.html を配信しているサーバが見つかりませんでした。`,
        ``,
        `  design-reference/ を配信するサーバを起動してください:`,
        `    cd design-reference && python3 -m http.server 8765`,
        ``,
        `  （特定ホストを使いたい場合）:`,
        `    SHOT_BASE=http://[::1]:8765 node scripts/shot.mjs`,
        ``,
        `  試したホスト: ${CANDIDATES.join(", ")}`,
      ].join("\n"),
    );
    process.exit(1);
  }

  if (usedBase !== CANDIDATES[0]) {
    console.warn(
      `⚠ ${CANDIDATES[0]} は新大フリマを配信していませんでした。` +
        `${usedBase} を使用します（8765のIPv4/IPv6相乗りに注意）。`,
    );
  }

  // 2) 撮影
  await mkdir(SHOTS_DIR, { recursive: true });
  const label = SCREEN ? `-${SCREEN}` : "";
  const outPath = join(SHOTS_DIR, `新大フリマ${label}-${timestamp()}.png`);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: 900 },
    deviceScaleFactor: 1,
  });

  try {
    // 初期表示画面を指定（指定が無ければプロトタイプ既定=login）
    if (SCREEN) {
      await page.addInitScript((screen) => {
        try {
          localStorage.setItem(
            "niidai_route",
            JSON.stringify({ screen, params: {} }),
          );
        } catch {}
      }, SCREEN);
    }
    await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 60_000 });
    // ブラウザ内 Babel + React の描画完了を待つ（#root に要素が入る）
    await page.waitForFunction(
      () => {
        const r = document.querySelector("#root");
        return !!r && r.children.length > 0;
      },
      { timeout: 30_000 },
    );
    // Webフォント読込完了 + レイアウト確定を待つ
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(800);

    await page.screenshot({ path: outPath, fullPage: true });
  } finally {
    await browser.close();
  }

  const { size } = await stat(outPath);
  console.log(`✓ 撮影完了`);
  console.log(`  配信元 : ${usedBase}`);
  console.log(`  URL    : ${targetUrl}`);
  console.log(`  保存先 : ${outPath}`);
  console.log(`  サイズ : ${(size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("✗ 撮影に失敗しました:", err);
  process.exit(1);
});
