import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:760,height:1200} });
await p.goto('https://static-site-nu-blush.vercel.app/login.html', {waitUntil:'networkidle'});
await p.waitForTimeout(2000);
// 同意リンクの実際の色を取得
const colors = await p.evaluate(() => [...document.querySelectorAll('.check-row a')].map(a => {
  const cs = getComputedStyle(a);
  return { text:a.textContent.trim(), color:cs.color, underline:cs.textDecorationLine, ucolor:cs.textDecorationColor };
}));
console.log(JSON.stringify(colors,null,1));
const card = await p.$('.login-card');
await card.screenshot({ path:'/private/tmp/prod-login-card.png' });
await b.close();
