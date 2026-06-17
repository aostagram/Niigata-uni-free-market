import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const r = await p.goto('http://localhost:3000/login', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(2500);
await p.screenshot({ path:'/private/tmp/next-login.png', fullPage:true });
console.log('status', r.status(), 'title', await p.title());
await b.close();
