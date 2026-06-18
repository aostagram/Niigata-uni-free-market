import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://localhost:3000/lp-preview', {waitUntil:'networkidle'});
await p.waitForTimeout(1200);

// 1) カテゴリフィルタ(クライアント)が動くか
let caseInteractive = 'n/a';
try {
  const before = await p.locator('.case-card').count();
  await p.selectOption('#filter-area', 'asahimachi');
  await p.waitForTimeout(400);
  const after = await p.locator('.case-card').count();
  caseInteractive = `cards ${before} -> ${after} (フィルタ${before!==after?'動作OK':'変化なし'})`;
} catch(e){ caseInteractive = 'ERR '+e.message; }

// 2) アンカーボタン「商品を探す」でスクロールするか
let scrolled = 'n/a';
try {
  const y0 = await p.evaluate(()=>window.scrollY);
  await p.getByRole('link', { name: '商品を探す' }).first().click();
  await p.waitForTimeout(600);
  const y1 = await p.evaluate(()=>window.scrollY);
  scrolled = `scrollY ${y0} -> ${y1} (${y1>y0?'スクロールOK':'動かない'})`;
} catch(e){ scrolled = 'ERR '+e.message; }

// 3) 「購入する」aの属性
let buy = 'n/a';
try {
  const a = p.locator('a:has-text("購入する")').first();
  buy = 'href=' + (await a.getAttribute('href'))?.slice(0,50) + ' target=' + await a.getAttribute('target');
} catch(e){ buy = 'ERR '+e.message; }

console.log('caseFilter:', caseInteractive);
console.log('anchorScroll:', scrolled);
console.log('buyButton:', buy);
await b.close();
