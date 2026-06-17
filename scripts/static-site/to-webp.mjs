/**
 * static-site/assets の PNG を WebP に変換し、html/css の参照を更新する。
 * logo.png は favicon/OGPフォールバックのため変換しない。
 * 元PNGはコミット履歴に残るので git で復元可能。
 * 実行: node scripts/static-site/to-webp.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SITE = path.resolve('static-site');
const ASSETS = path.join(SITE, 'assets');
const KEEP = new Set(['logo.png']); // 変換しないPNG
const MAX_W = 1600;
const QUALITY = 82;

const files = (await fs.readdir(ASSETS)).filter(
  (f) => f.toLowerCase().endsWith('.png') && !KEEP.has(f),
);

let beforeTotal = 0;
let afterTotal = 0;
const converted = [];

for (const f of files) {
  const src = path.join(ASSETS, f);
  const base = f.replace(/\.png$/i, '');
  const dst = path.join(ASSETS, `${base}.webp`);
  const before = (await fs.stat(src)).size;
  const img = sharp(src);
  const meta = await img.metadata();
  let pipe = img;
  if (meta.width && meta.width > MAX_W) pipe = pipe.resize({ width: MAX_W });
  await pipe.webp({ quality: QUALITY }).toFile(dst);
  const after = (await fs.stat(dst)).size;
  await fs.unlink(src);
  beforeTotal += before;
  afterTotal += after;
  converted.push(base);
  console.log(`${f}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

// 参照更新（html + css）
const targets = [];
for (const f of await fs.readdir(SITE)) {
  if (f.endsWith('.html')) targets.push(path.join(SITE, f));
}
for (const f of await fs.readdir(path.join(SITE, 'css'))) {
  if (f.endsWith('.css')) targets.push(path.join(SITE, 'css', f));
}

let refEdits = 0;
for (const t of targets) {
  let s = await fs.readFile(t, 'utf8');
  let changed = false;
  for (const base of converted) {
    const pngRef = `assets/${base}.png`;
    if (s.includes(pngRef)) {
      s = s.split(pngRef).join(`assets/${base}.webp`);
      changed = true;
      refEdits++;
    }
  }
  if (changed) await fs.writeFile(t, s);
}

console.log(
  `\n変換 ${converted.length}枚  ${(beforeTotal / 1024 / 1024).toFixed(1)}MB -> ${(afterTotal / 1024 / 1024).toFixed(1)}MB  / 参照更新 ${refEdits}件`,
);
