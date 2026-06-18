import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://localhost:3000/lp-preview', {waitUntil:'networkidle'});
await p.waitForTimeout(1000);
const overflow = await p.evaluate(()=>({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
  hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}));
console.log('horizontal overflow:', JSON.stringify(overflow));
await p.evaluate(()=>window.scrollTo(0, 1600));
await p.waitForTimeout(600);
await p.screenshot({ path:'/tmp/scrolled.png' });
console.log('shot saved');
await b.close();
