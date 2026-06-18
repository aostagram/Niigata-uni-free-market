import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/login',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);
const boxes = await p.locator('input[type=checkbox]').count();
let btnBefore = await p.locator('button:has-text("ログイン"), a:has-text("ログイン")').first().isEnabled().catch(()=>'?');
for(let i=0;i<boxes;i++){ await p.locator('input[type=checkbox]').nth(i).check().catch(()=>{}); }
await p.waitForTimeout(300);
let btnAfter = await p.locator('button:has-text("ログイン"), a:has-text("ログイン")').first().isEnabled().catch(()=>'?');
console.log('pageerror:', errs.length?errs.slice(0,5):'none');
console.log('checkboxes:', boxes, 'loginBtn enabled before/after consent:', btnBefore, '/', btnAfter);
await b.close();
