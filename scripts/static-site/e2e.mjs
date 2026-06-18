import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:1000} });
const log = (k,v)=>console.log(`[${k}] ${v}`);
let pass=0, fail=0;
const assert=(name,cond,extra='')=>{ if(cond){pass++;console.log('  ✅ '+name);}else{fail++;console.log('  ❌ '+name+'  '+extra);} };

// 1) ホーム一覧
await p.goto('http://localhost:3000/lp-preview',{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const cards = await p.locator('.product-card').count();
log('home','product-cards='+cards);
// 在庫番号バッジ
const badge = await p.locator('.product-card .tag').first().innerText().catch(()=>'');
log('home','first badge="'+badge.replace(/\n/g,' ')+'"');
// 購入リンクのprefill
const buyHref = await p.locator('.product-card a:has-text("購入する")').first().getAttribute('href').catch(()=>null);
log('home','buyHref='+(buyHref||'').slice(0,90));
assert('購入リンクに在庫IDプリフィル', !!buyHref && /entry\.993746720=K?\w+/.test(buyHref||''), buyHref||'');
// くわしく見る → /stock/
const detailHref = await p.locator('.product-card a:has-text("くわしく見る")').first().getAttribute('href').catch(()=>null);
log('home','detailHref='+detailHref);
assert('くわしく見る→/stock/', !!detailHref && detailHref.startsWith('/stock/'), detailHref||'');
// 出品(ヒーロー)→ sellerフォーム
const sellHref = await p.locator('a:has-text("出品を始める")').first().getAttribute('href').catch(()=>null);
assert('出品→Googleフォーム', !!sellHref && sellHref.includes('docs.google.com/forms'), sellHref||'');

// 2) 詳細(stock-preview) prefill
const stockId = (badge.match(/K?\w+\d+/)||['K001'])[0];
await p.goto('http://localhost:3000/stock-preview?id='+encodeURIComponent(stockId),{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
const dbuy = await p.locator('a:has-text("購入・出品者に連絡する")').first().getAttribute('href').catch(()=>null);
const ddone = await p.locator('a:has-text("取引完了を報告")').first().getAttribute('href').catch(()=>null);
log('detail','buy='+(dbuy||'').slice(0,90));
log('detail','done='+(ddone||'').slice(0,90));
assert('詳細 購入リンクに在庫ID', !!dbuy && dbuy.includes('entry.993746720='+stockId), dbuy||'');
assert('詳細 完了リンクに在庫ID', !!ddone && ddone.includes('entry.1703566125='+stockId), ddone||'');

console.log(`\n=== RESULT: ${pass} passed / ${fail} failed ===`);
await b.close();
