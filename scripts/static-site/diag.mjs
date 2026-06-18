import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs = [];
p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('PAGEERROR: '+e.message));
await p.goto('http://localhost:3000/lp-preview', {waitUntil:'networkidle'});
await p.waitForTimeout(1500);
// body::before background
const bg = await p.evaluate(() => {
  const s = getComputedStyle(document.body, '::before');
  return { image: s.backgroundImage, size: s.backgroundSize, z: s.zIndex, pe: s.pointerEvents };
});
// 何かがクリックを覆っていないか: 中央と各セクションの最前面要素
const topEls = await p.evaluate(() => {
  const pts = [[640,300],[640,600],[200,500]];
  return pts.map(([x,y]) => {
    const el = document.elementFromPoint(x,y);
    return el ? (el.tagName+'.'+(el.className||'').toString().slice(0,40)) : 'null';
  });
});
console.log('CONSOLE ERRORS:', errs.length ? errs.slice(0,8) : 'none');
console.log('body::before', JSON.stringify(bg));
console.log('elementFromPoint:', JSON.stringify(topEls));
await b.close();
