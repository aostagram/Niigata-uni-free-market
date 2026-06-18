import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1280,height:900} });
const p = await ctx.newPage();
await p.goto('http://localhost:3000/lp-preview', {waitUntil:'networkidle'});
await p.waitForTimeout(1000);

// ヘッダー出品(a target=_blank)が新タブを開くか
let popup='n/a';
try{
  const [pg] = await Promise.all([
    ctx.waitForEvent('page', {timeout:4000}).catch(()=>null),
    p.locator('header a:has-text("出品")').first().click({timeout:3000}).catch(()=>{}),
  ]);
  popup = pg ? '新タブOK '+pg.url().slice(0,40) : '新タブ開かず';
  if(pg) await pg.close();
}catch(e){popup='ERR '+e.message;}

// カテゴリタイル(Link)で遷移するか
let nav='n/a';
try{
  await p.locator('.category-tile').first().click({timeout:3000});
  await p.waitForTimeout(800);
  nav = '遷移先 '+p.url().slice(0,60);
}catch(e){nav='ERR '+e.message;}

console.log('headerSell:', popup);
console.log('categoryNav:', nav);
await b.close();
