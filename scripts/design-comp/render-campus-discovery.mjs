import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const htmlPath = resolve(here, "campus-discovery-asset.html");
const outputPath = resolve(root, "public/design-comp/campus-discovery.png");

mkdirSync(resolve(root, "public/design-comp"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(htmlPath).href);
await page.locator(".asset").screenshot({
  path: outputPath,
  type: "png",
});

await browser.close();
console.log(outputPath);
