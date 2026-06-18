import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const r = await p.goto('http://localhost:3000/lp-preview', {waitUntil:'networkidle'});
await p.waitForTimeout(2000);
await p.screenshot({ path:'/tmp/lp-full.png', fullPage:true });
await p.screenshot({ path:'/tmp/lp-top.png', fullPage:false });
console.log('status', r.status());
await b.close();
