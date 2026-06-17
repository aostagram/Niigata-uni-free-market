import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const out = {};
for (const page of ['item-detail','my-listings','index']) {
  await p.goto(`http://127.0.0.1:8123/${page}.html`, {waitUntil:'load'});
  out[page] = await p.evaluate(() => [...document.querySelectorAll('[data-form]')].map(e => ({t:(e.textContent||'').trim().slice(0,18), form:e.dataset.form, href:(e.getAttribute('href')||'').slice(0,46), target:e.getAttribute('target')})));
}
console.log(JSON.stringify(out,null,1));
await b.close();
