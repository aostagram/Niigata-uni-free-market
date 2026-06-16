import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const htmlPath = resolve(here, "top-page-design-comp.html");
const outputPath = resolve(root, "public/design-comp/top-page-design-comp.png");

mkdirSync(resolve(root, "public/design-comp"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 2600 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(htmlPath).href);
await page.locator(".page").screenshot({
  path: outputPath,
  type: "png",
});

await browser.close();
console.log(outputPath);
