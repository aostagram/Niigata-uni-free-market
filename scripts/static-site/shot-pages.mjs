import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [path, out] of [['/login','/tmp/next-login.png'],['/terms','/tmp/next-terms.png']]) {
  const p = await b.newPage({ viewport:{width:1280,height:1000} });
  const r = await p.goto('http://localhost:3000'+path, {waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
  await p.screenshot({ path: out, fullPage: false });
  console.log(path, r.status());
  await p.close();
}
await b.close();
