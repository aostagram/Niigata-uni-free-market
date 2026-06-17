import { chromium } from 'playwright';

const baseUrl = process.env.STATIC_SITE_URL || 'http://127.0.0.1:8123';
const page = process.env.PAGE || 'index.html';
const out = process.env.OUT || '/private/tmp/static-fullpage.png';

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await pg.goto(`${baseUrl}/${page}`, { waitUntil: 'load' });

// reveal アニメ(IntersectionObserver)を全て発火させるため、最下部まで段階スクロール
await pg.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await pg.waitForTimeout(800);
await pg.screenshot({ path: out, fullPage: true });
console.log('saved', out);
await browser.close();
