import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const errors = [];
p.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
await p.goto('https://static-site-nu-blush.vercel.app/login.html', {waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const res = await p.evaluate(() => {
  const wrap = document.getElementById('gsi-button');
  const iframe = wrap && wrap.querySelector('iframe');
  const demo = !!(wrap && /デモ/.test(wrap.textContent||''));
  const status = (document.querySelector('[data-login-status]')||{}).textContent||'';
  return { hasIframe: !!iframe, iframeSrc: iframe ? iframe.src.slice(0,60) : null, demoFallback: demo, status: status.slice(0,80), wrapHtml: (wrap?wrap.innerHTML:'').slice(0,120) };
});
console.log(JSON.stringify(res,null,1));
console.log('console errors:', errors.slice(0,5));
await b.close();
