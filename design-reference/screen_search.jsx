/* ===== Search + shared ProductCard ===== */

function ProductCard({ product, nav, compact=false }){
  const [fav,setFav]=useState(false);
  return React.createElement('div',{className:'ds-card',onClick:()=>nav('detail',{id:product.id}),style:{cursor:'pointer',overflow:'hidden',transition:'transform .15s, box-shadow .2s',display:'flex',flexDirection:'column'},
      onMouseEnter:e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 16px 34px -18px rgba(95,129,40,.4)';},
      onMouseLeave:e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow-card)';}},
    React.createElement('div',{style:{position:'relative'}},
      React.createElement(ProductImg,{product,radius:0,style:{height:compact?130:150},iconSize:compact?40:50}),
      React.createElement('span',{className:'tag',style:{position:'absolute',left:10,bottom:10,background:'rgba(255,255,255,.92)'}},product.cat),
      React.createElement('button',{onClick:e=>{e.stopPropagation();setFav(!fav);},style:{position:'absolute',top:10,right:10,width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,.95)',border:'none',boxShadow:'0 2px 8px -3px rgba(0,0,0,.25)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}},
        React.createElement(Icon,{name:'Heart',size:17,color:fav?'#e1607a':'#a9b399',style:{fill:fav?'#e1607a':'none'}}))
    ),
    React.createElement('div',{style:{padding:compact?'12px 13px 14px':'13px 15px 15px',flex:1,display:'flex',flexDirection:'column'}},
      React.createElement('div',{className:'clamp-2',style:{fontSize:compact?13.5:14.5,color:'var(--ink)',lineHeight:1.5,minHeight:compact?'2.7em':'2.9em',fontWeight:500}},product.short),
      React.createElement('div',{className:'font-round',style:{fontSize:compact?17:19,fontWeight:700,color:'var(--ink)',margin:'6px 0 10px'}},yen(product.price)),
      React.createElement('div',{style:{marginTop:'auto',display:'flex',flexDirection:'column',gap:5,fontSize:12,color:'var(--ink-soft)'}},
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'MapPin',size:13,color:'var(--brand)'}),product.campus),
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'User',size:13,color:'var(--brand)'}),product.dept,React.createElement('span',{style:{marginLeft:'auto',color:'var(--ink-faint)'}},product.ago)))
    )
  );
}

function SearchScreen({ nav, initialCat='すべて' }){
  const [cat,setCat]=useState(initialCat);
  const [sort,setSort]=useState('新着順');
  const list = cat==='すべて'?PRODUCTS:PRODUCTS.filter(p=>p.cat===cat);
  const sorted=[...list].sort((a,b)=> sort==='価格が安い順'?a.price-b.price : sort==='価格が高い順'?b.price-a.price : sort==='いいね！が多い順'?b.likes-a.likes : 0);

  const SideLink=({label,on,onClick})=>React.createElement('div',{onClick,style:{padding:'9px 14px',borderRadius:10,cursor:'pointer',fontSize:14,marginBottom:2,background:on?'var(--panel)':'transparent',color:on?'var(--brand-deep)':'var(--ink-soft)',border:on?'1px solid var(--line)':'1px solid transparent',fontWeight:on?500:400}},label);
  const Radio=({label,on,onClick})=>React.createElement('div',{onClick,style:{display:'flex',alignItems:'center',gap:10,padding:'7px 0',cursor:'pointer',fontSize:14,color:on?'var(--ink)':'var(--ink-soft)'}},
    React.createElement('span',{style:{width:18,height:18,borderRadius:'50%',border:'2px solid '+(on?'var(--brand)':'#cfd8bf'),display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},on&&React.createElement('span',{style:{width:9,height:9,borderRadius:'50%',background:'var(--brand)'}})),label);

  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'0 22px'}},
      React.createElement('div',{className:'fade-up',style:{padding:'34px 0 6px'}},
        React.createElement('div',{className:'heading-row'},React.createElement('h1',{className:'font-round',style:{fontSize:34,color:'var(--ink)',margin:0,fontWeight:700}},'商品を探す'),React.createElement(Sprig,{size:24})),
        React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:15,margin:'8px 0 20px'}},'新大生の「欲しい」がきっと見つかる。'),
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,background:'#fff',border:'1.5px solid var(--line)',borderRadius:999,padding:'15px 24px',boxShadow:'var(--shadow-soft)'}},
          React.createElement(Icon,{name:'Search',size:21,color:'var(--brand)'}),
          React.createElement('input',{placeholder:'何をお探しですか？（例：教科書、椅子、パソコン）',style:{border:'none',outline:'none',flex:1,fontSize:15,background:'transparent',fontFamily:'var(--font-body)',color:'var(--ink)'}}))
      ),
      /* category circles */
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:10,padding:'22px 0 8px'}},
        CATEGORIES.map(c=>{const on=cat===c.key;return React.createElement('div',{key:c.key,onClick:()=>setCat(c.key),style:{cursor:'pointer',textAlign:'center'}},
          React.createElement('div',{style:{width:64,height:64,margin:'0 auto 7px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:on?'var(--panel)':'#fff',border:'1.5px solid '+(on?'var(--brand)':'var(--line)'),transition:'all .15s'}},
            React.createElement(Icon,{name:c.icon,size:25,color:on?'var(--brand-deep)':'var(--ink-soft)',stroke:1.8})),
          React.createElement('div',{style:{fontSize:12,color:on?'var(--brand-deep)':'var(--ink-soft)',fontWeight:on?700:400}},c.key))})
      ),

      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'232px 1fr',gap:24,padding:'14px 0'}},
        /* sidebar */
        React.createElement('aside',{className:'ds-card',style:{padding:'20px 18px',alignSelf:'start',position:'sticky',top:86}},
          React.createElement('div',{className:'heading-row',style:{marginBottom:10}},React.createElement(Sprig,{size:18}),React.createElement('span',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15}},'カテゴリ')),
          React.createElement(SideLink,{label:'すべてのカテゴリ',on:cat==='すべて',onClick:()=>setCat('すべて')}),
          CATEGORIES.slice(1).map(c=>React.createElement(SideLink,{key:c.key,label:c.key,on:cat===c.key,onClick:()=>setCat(c.key)})),
          React.createElement('div',{className:'divider',style:{margin:'16px 0'}}),
          React.createElement('div',{className:'heading-row',style:{marginBottom:10}},React.createElement(Sprig,{size:18}),React.createElement('span',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15}},'学部・キャンパス')),
          React.createElement('div',{style:{padding:'9px 14px',borderRadius:10,background:'var(--panel)',border:'1px solid var(--line)',color:'var(--brand-deep)',fontSize:13.5,marginBottom:10}},'すべての学部・キャンパス'),
          React.createElement(SelectBox,{placeholder:'学部を選択'}),
          React.createElement('div',{style:{height:10}}),
          React.createElement(SelectBox,{placeholder:'キャンパスを選択'}),
          React.createElement('div',{className:'divider',style:{margin:'16px 0'}}),
          React.createElement('div',{className:'heading-row',style:{marginBottom:6}},React.createElement(Sprig,{size:18}),React.createElement('span',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15}},'並び替え')),
          ['新着順','価格が安い順','価格が高い順','いいね！が多い順'].map(s=>React.createElement(Radio,{key:s,label:s,on:sort===s,onClick:()=>setSort(s)})),
          React.createElement('div',{className:'divider',style:{margin:'16px 0'}}),
          React.createElement('div',{className:'heading-row',style:{marginBottom:10}},React.createElement(Sprig,{size:18}),React.createElement('span',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15}},'価格帯')),
          React.createElement('div',{style:{display:'flex',gap:8,alignItems:'center',marginBottom:14}},
            React.createElement('input',{className:'field',placeholder:'¥ 最小',style:{padding:'9px 12px',fontSize:13}}),
            React.createElement('span',{style:{color:'var(--ink-faint)'}},'〜'),
            React.createElement('input',{className:'field',placeholder:'¥ 最大',style:{padding:'9px 12px',fontSize:13}})),
          React.createElement('button',{className:'btn btn-ghost',style:{width:'100%',padding:'11px',fontSize:13.5},onClick:()=>{setCat('すべて');setSort('新着順');}},React.createElement(Icon,{name:'RotateCcw',size:15}),'絞り込みをクリア')
        ),
        /* grid */
        React.createElement('div',null,
          React.createElement('div',{style:{display:'flex',alignItems:'center',marginBottom:16}},
            React.createElement('div',{style:{fontSize:15,color:'var(--ink)'}},'全 ',React.createElement('b',{style:{color:'var(--brand-deep)'}},sorted.length),' 件'),
            React.createElement('div',{style:{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--ink-soft)',cursor:'pointer'}},sort,React.createElement(Icon,{name:'ChevronDown',size:16}))),
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}},
            sorted.map(p=>React.createElement(ProductCard,{key:p.id,product:p,nav}))),
          React.createElement(Pagination,null)
        )
      )
    ),
    React.createElement('button',{className:'btn btn-primary',onClick:()=>nav('sell'),style:{position:'fixed',right:28,bottom:88,zIndex:45,padding:'15px 22px',fontSize:15,boxShadow:'0 12px 28px -10px rgba(95,129,40,.7)'}},React.createElement(Icon,{name:'Plus',size:19}),'出品する'),
    React.createElement(TabBar,{active:'search',nav})
  );
}

function SelectBox({ placeholder }){
  return React.createElement('div',{className:'field',style:{display:'flex',alignItems:'center',cursor:'pointer',color:'var(--ink-faint)',padding:'11px 14px'}},
    React.createElement('span',{style:{flex:1,fontSize:13.5}},placeholder),React.createElement(Icon,{name:'ChevronDown',size:16,color:'var(--ink-faint)'}));
}

function Pagination(){
  return React.createElement('div',{style:{display:'flex',justifyContent:'center',alignItems:'center',gap:6,marginTop:30}},
    React.createElement('span',{style:{width:36,height:36,borderRadius:'50%',border:'1.5px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ink-faint)',cursor:'pointer'}},React.createElement(Icon,{name:'ChevronLeft',size:16})),
    [1,2,3,4,5].map(n=>React.createElement('span',{key:n,style:{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,cursor:'pointer',background:n===1?'var(--brand)':'transparent',color:n===1?'#fff':'var(--ink-soft)',fontWeight:n===1?700:400,fontFamily:'var(--font-round)'}},n)),
    React.createElement('span',{style:{color:'var(--ink-faint)',padding:'0 4px'}},'…'),
    React.createElement('span',{style:{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'var(--ink-soft)',cursor:'pointer',fontFamily:'var(--font-round)'}},'12'),
    React.createElement('span',{style:{width:36,height:36,borderRadius:'50%',border:'1.5px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ink-faint)',cursor:'pointer'}},React.createElement(Icon,{name:'ChevronRight',size:16}))
  );
}

window.ProductCard = ProductCard;
window.SearchScreen = SearchScreen;
