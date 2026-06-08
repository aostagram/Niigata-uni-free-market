/* ===== Shared UI atoms ===== */
const { useState, useEffect, useRef } = React;

function Logo({ size='md', onClick }){
  const big = size==='lg';
  const d = big?64:44;
  return React.createElement('div',{onClick,style:{display:'flex',alignItems:'center',gap:big?14:10,cursor:onClick?'pointer':'default'}},
    React.createElement('div',{style:{
      width:d,height:d,borderRadius:'50%',flex:'none',
      background:'radial-gradient(circle at 50% 40%, #eef5dd, #dceabf)',
      border:'2px solid #fff',boxShadow:'0 4px 12px -6px rgba(95,129,40,.5)',
      display:'flex',alignItems:'center',justifyContent:'center'}},
      React.createElement(Icon,{name:'ShoppingBag',size:big?30:21,color:'var(--brand-deep)',stroke:2.1})
    ),
    React.createElement('div',{style:{lineHeight:1.05}},
      React.createElement('div',{className:'font-round',style:{fontSize:big?30:21,fontWeight:700,color:'var(--logo)',letterSpacing:'.04em'}},'新大フリマ'),
      React.createElement('div',{className:'font-latin',style:{fontSize:big?13:9.5,color:'var(--brand)',letterSpacing:'.08em',marginTop:big?4:1}},'Niigata univ. Free Market')
    )
  );
}

function AppHeader({ nav, right='sell', notifCount=2 }){
  return React.createElement('header',{style:{
    position:'sticky',top:0,zIndex:30,
    background:'rgba(251,253,247,.86)',backdropFilter:'blur(10px)',
    borderBottom:'1px solid var(--line-soft)'}},
    React.createElement('div',{style:{maxWidth:1024,margin:'0 auto',padding:'14px 22px',display:'flex',alignItems:'center',gap:16}},
      React.createElement(Logo,{onClick:()=>nav('home')}),
      React.createElement('nav',{style:{display:'flex',gap:30,marginLeft:'auto'},className:'hide-narrow'},
        React.createElement('span',{className:'nav-link',onClick:()=>nav('home')},'はじめての方へ'),
        React.createElement('span',{className:'nav-link',onClick:()=>nav('search')},'ガイド'),
        React.createElement('span',{className:'nav-link',onClick:()=>nav('home')},'よくある質問')
      ),
      React.createElement('button',{onClick:()=>nav('notifications'),'aria-label':'通知',style:{position:'relative',background:'none',border:'none',cursor:'pointer',padding:6,marginLeft:'auto',color:'var(--brand-deep)'}},
        React.createElement(Icon,{name:'Bell',size:22}),
        notifCount>0 && React.createElement('span',{style:{position:'absolute',top:0,right:0,background:'var(--coral)',color:'#fff',fontSize:10,fontWeight:700,minWidth:16,height:16,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px'}},notifCount)
      ),
      right==='sell'
        ? React.createElement('button',{className:'btn btn-primary',style:{padding:'10px 20px',fontSize:14},onClick:()=>nav('sell')},
            React.createElement(Icon,{name:'Plus',size:17}),'出品する')
        : React.createElement('button',{className:'btn btn-primary',style:{padding:'10px 22px',fontSize:14},onClick:()=>nav('mypage')},'マイページ')
    )
  );
}

const TABS = [
  { key:'home', label:'ホーム', icon:'House' },
  { key:'search', label:'商品を探す', icon:'Search' },
  { key:'chat', label:'チャット', icon:'MessageSquare' },
  { key:'favorites', label:'お気に入り', icon:'Heart' },
  { key:'mypage', label:'マイページ', icon:'User' },
];
function TabBar({ active, nav }){
  return React.createElement('div',{style:{position:'fixed',left:0,right:0,bottom:0,zIndex:40,display:'flex',justifyContent:'center',pointerEvents:'none'}},
    React.createElement('div',{style:{
      width:'100%',maxWidth:1024,background:'rgba(255,255,255,.96)',backdropFilter:'blur(10px)',
      borderTop:'1px solid var(--line)',boxShadow:'0 -6px 24px -16px rgba(95,129,40,.4)',
      display:'flex',padding:'8px 14px',pointerEvents:'auto'}},
      TABS.map(t=>{
        const on = active===t.key;
        return React.createElement('div',{key:t.key,className:'tab-item'+(on?' active':''),onClick:()=>nav(t.key)},
          React.createElement('div',{className:'tab-pill',style:{padding:'5px 18px',borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',transition:'background .15s'}},
            React.createElement(Icon,{name:t.icon,size:21,stroke:on?2.3:2})),
          React.createElement('span',null,t.label)
        );
      })
    )
  );
}

/* Product image — real photo or elegant placeholder */
function ProductImg({ product, radius=14, style={}, iconSize=46 }){
  if(product && product.img){
    return React.createElement('div',{style:{borderRadius:radius,overflow:'hidden',background:'#f3f4ef',...style}},
      React.createElement('img',{src:product.img,alt:product.title,style:{width:'100%',height:'100%',objectFit:'cover',display:'block'}}));
  }
  return React.createElement('div',{style:{
    borderRadius:radius,background:'linear-gradient(135deg,#f3f6ec,#e9efdb)',
    display:'flex',alignItems:'center',justifyContent:'center',color:'#b3c585',...style}},
    React.createElement(Icon,{name:(product&&product.icon)||'Package',size:iconSize,stroke:1.5})
  );
}

/* condition pill color helper */
function condTag(c){
  return React.createElement('span',{className:'tag'},c);
}

/* status badge — 出品中/取引中/売却済み/予約済 を CSS で色分け（index_sheet1 のバッジ相当） */
const STATUS_KIND = {
  '出品中':'onsale', '販売中':'onsale',
  '取引中':'dealing', '予約中':'dealing',
  '売却済み':'sold', '取引完了':'sold', '完了':'sold',
  '予約済':'reserved',
};
function StatusBadge({ status, style={} }){
  const kind = STATUS_KIND[status] || 'onsale';
  return React.createElement('span',{ className:'status-badge status-'+kind, style }, status);
}

Object.assign(window,{ Logo, AppHeader, TabBar, ProductImg, condTag, StatusBadge });
