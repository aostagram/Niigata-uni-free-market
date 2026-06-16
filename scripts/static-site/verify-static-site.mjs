import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.STATIC_SITE_URL || 'http://127.0.0.1:8123';
const outDir = '/private/tmp';
const captureScreenshots = process.env.NO_SCREENSHOTS !== '1';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
await page.waitForTimeout(700);
if (captureScreenshots) {
  await page.screenshot({ path: `${outDir}/shindai-static-desktop.png`, fullPage: false });
}
await page.evaluate(() => window.scrollTo(0, 1850));
await page.waitForTimeout(1400);
if (captureScreenshots) {
  await page.screenshot({ path: `${outDir}/shindai-static-lower.png`, fullPage: false });
}

const desktop = await page.evaluate(() => {
  const hero = document.querySelector('.hero');
  return {
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    sectionCount: document.querySelectorAll('section').length,
    heroUsesTopBackground: getComputedStyle(hero, '::before').backgroundImage.includes(
      'top-background-only',
    ),
    hasScrollBackground: getComputedStyle(document.body).backgroundImage.includes(
      'bottom-background-only',
    ),
    visibleRevealCount: document.querySelectorAll('.reveal.is-visible').length,
  };
});

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.selectOption('[data-case-filter="area"]', 'asahimachi');
await page.waitForTimeout(200);
const filter = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('[data-case-card]')];
  return {
    total: cards.length,
    visible: cards.filter((card) => !card.classList.contains('is-hidden')).length,
    visibleAreas: cards
      .filter((card) => !card.classList.contains('is-hidden'))
      .map((card) => card.dataset.area),
  };
});

await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
await page.waitForTimeout(400);
if (captureScreenshots) {
  await page.screenshot({ path: `${outDir}/shindai-static-mobile.png`, fullPage: false });
}
await page.click('[data-menu-toggle]');
await page.waitForTimeout(250);
if (captureScreenshots) {
  await page.screenshot({ path: `${outDir}/shindai-static-mobile-menu.png`, fullPage: false });
}
const mobile = await page.evaluate(() => ({
  menuExpanded: document.querySelector('[data-menu-toggle]')?.getAttribute('aria-expanded'),
  menuOpen: document.querySelector('[data-mobile-panel]')?.classList.contains('is-open'),
  navHiddenDesktop: getComputedStyle(document.querySelector('.site-nav')).display,
  bodyLocked: document.body.classList.contains('is-menu-open'),
}));

await browser.close();

const summary = {
  desktop,
  filter,
  mobile,
  screenshots: captureScreenshots
    ? [
        `${outDir}/shindai-static-desktop.png`,
        `${outDir}/shindai-static-lower.png`,
        `${outDir}/shindai-static-mobile.png`,
        `${outDir}/shindai-static-mobile-menu.png`,
      ]
    : [],
};

if (captureScreenshots) {
  await fs.writeFile(`${outDir}/shindai-static-summary.json`, `${JSON.stringify(summary, null, 2)}\n`);
}
console.log(JSON.stringify(summary, null, 2));
