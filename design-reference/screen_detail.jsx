/* ===== Product Detail ===== */
function DetailScreen({ nav, productId='chair' }){
  const p = getProduct(productId) || getProduct('chair');
  const [idx,setIdx]=useState(0);
  const [fav,setFav]=useState(false);
  const thumbs = p.img ? [p.img,p.img,p.img,p.img] : [null,null,null,null];

  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:120}},
    React.createElement(AppHeader,{nav,right:'mypage'}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'0 22px'}},
      React.createElement('div',{className:'nav-link',style:{display:'inline-flex',alignItems:'center',gap:8,padding:'22px 0 14px',fontSize:14.5},onClick:()=>nav('search')},
        React.createElement(Icon,{name:'ArrowLeft',size:18}),'商品一覧に戻る'),

      React.createElement('div',{className:'fade-up',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:34,alignItems:'start'}},
        /* gallery */
        React.createElement('div',null,
          React.createElement('div',{style:{position:'relative',borderRadius:'var(--radius)',overflow:'hidden',border:'1px solid var(--line)',boxShadow:'var(--shadow-card)'}},
            React.createElement(ProductImg,{product:p,radius:0,style:{height:430},iconSize:84}),
            React.createElement('span',{style:{position:'absolute',right:14,bottom:12,background:'rgba(60,74,46,.75)',color:'#fff',fontSize:12,padding:'4px 12px',borderRadius:999}},(idx+1)+' / 6')),
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginTop:14}},
            React.createElement('button',{onClick:()=>setIdx((idx+3)%4),style:navBtn},React.createElement(Icon,{name:'ChevronLeft',size:18,color:'var(--brand-deep)'})),
            React.createElement('div',{style:{display:'flex',gap:10,flex:1}},
              thumbs.map((t,i)=>React.createElement('div',{key:i,onClick:()=>setIdx(i),style:{flex:1,height:74,borderRadius:12,overflow:'hidden',cursor:'pointer',border:'2px solid '+(idx===i?'var(--brand)':'var(--line)')}},
                React.createElement(ProductImg,{product:p,radius:0,style:{height:'100%'},iconSize:26})))),
            React.createElement('button',{onClick:()=>setIdx((idx+1)%4),style:navBtn},React.createElement(Icon,{name:'ChevronRight',size:18,color:'var(--brand-deep)'})))
        ),
        /* info */
        React.createElement('div',null,
          React.createElement('span',{className:'tag',style:{marginBottom:14}},p.cat),
          React.createElement('h1',{className:'font-round',style:{fontSize:25,lineHeight:1.5,color:'var(--ink)',margin:'0 0 18px',fontWeight:700}},p.title),
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:14,marginBottom:22}},
            React.createElement('div',{className:'font-round',style:{fontSize:33,fontWeight:700,color:'var(--ink)'}},yen(p.price)),
            React.createElement('span',{style:{fontSize:13,color:'var(--ink-soft)'}},'（送料込み）'),
            React.createElement('button',{className:'btn btn-ghost',style:{marginLeft:'auto',padding:'11px 20px',fontSize:14},onClick:()=>setFav(!fav)},
              React.createElement(Icon,{name:'Heart',size:17,color:fav?'#e1607a':'var(--brand-deep)',style:{fill:fav?'#e1607a':'none'}}),'お気に入り')),

          React.createElement('div',{className:'ds-panel',style:{padding:'18px 20px',marginBottom:20,position:'relative',background:'var(--panel)'}},
            React.createElement('div',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:14,marginBottom:10}},'商品の状態'),
            React.createElement('span',{className:'tag',style:{background:'#fff',marginBottom:12}},p.cond),
            React.createElement('p',{style:{margin:0,fontSize:13.5,color:'var(--ink-soft)',lineHeight:1.8}},'数回使用しましたが、きれいな状態です。動作や機能に問題はありません。'),
            React.createElement(Sprig,{size:22,style:{position:'absolute',right:16,bottom:14,opacity:.6}})),

          React.createElement('div',{className:'ds-card',style:{padding:'20px 22px'}},
            React.createElement('div',{className:'heading-row',style:{marginBottom:14}},React.createElement(Sprig,{size:18}),React.createElement('span',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15}},'出品者情報')),
            React.createElement('div',{style:{display:'flex',gap:14,alignItems:'center'}},
              React.createElement('div',{className:'avatar',style:{width:60,height:60}},React.createElement(Icon,{name:'User',size:30,color:'#a9c172'})),
              React.createElement('div',{style:{flex:1}},
                React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:5}},React.createElement('span',{className:'font-round',style:{fontWeight:700,fontSize:17,color:'var(--ink)'}},'新大 太郎')),
                React.createElement('span',{className:'tag',style:{background:'var(--panel)'}},React.createElement(Icon,{name:'BadgeCheck',size:13}),'学生認証済み'),
                React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)',marginTop:7,lineHeight:1.6}},'人文学部 社会学科 3年',React.createElement('br'),'旭町キャンパス'))),
            React.createElement('div',{style:{display:'flex',gap:0,marginTop:16,borderTop:'1px solid var(--line-soft)',paddingTop:14}},
              React.createElement('div',{style:{flex:1}},React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)',marginBottom:3,display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'Star',size:13,color:'var(--star)'}),'評価'),React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:16}},'★ 5.0 ',React.createElement('span',{style:{fontSize:12,color:'var(--ink-soft)',fontWeight:400}},'（12件）'))),
              React.createElement('div',{style:{flex:1,borderLeft:'1px solid var(--line-soft)',paddingLeft:18}},React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)',marginBottom:3,display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'Handshake',size:13,color:'var(--brand)'}),'取引実績'),React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:16}},'18件'))),
            React.createElement('div',{className:'nav-link',style:{marginTop:14,display:'flex',alignItems:'center',gap:4},onClick:()=>nav('mypage')},'プロフィールを見る',React.createElement(Icon,{name:'ChevronRight',size:15})))
        )
      ),

      /* description */
      React.createElement('div',{className:'ds-card',style:{padding:'24px 28px',marginTop:24,position:'relative'}},
        React.createElement('div',{className:'heading-row',style:{marginBottom:14}},React.createElement(Sprig,{size:18}),React.createElement('h2',{className:'font-round',style:{fontSize:17,color:'var(--brand-deep)',margin:0,fontWeight:700}},'商品の説明')),
        React.createElement('p',{style:{margin:'0 0 14px',fontSize:14.5,color:'var(--ink)',lineHeight:1.95,whiteSpace:'pre-line'}},p.desc),
        p.bullets&&React.createElement('ul',{style:{margin:'0 0 14px',paddingLeft:0,listStyle:'none',display:'flex',flexDirection:'column',gap:7}},
          p.bullets.map((b,i)=>React.createElement('li',{key:i,style:{display:'flex',alignItems:'center',gap:9,fontSize:14,color:'var(--ink)'}},React.createElement(Icon,{name:'Check',size:16,color:'var(--brand)',stroke:2.6}),b))),
        p.note&&React.createElement('p',{style:{margin:0,fontSize:14,color:'var(--ink-soft)',lineHeight:1.9,whiteSpace:'pre-line'}},p.note),
        React.createElement(Sprig,{size:26,style:{position:'absolute',right:24,bottom:20,opacity:.5}})),

      /* delivery + specs */
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22,marginTop:24}},
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px'}},
          React.createElement('div',{className:'heading-row',style:{marginBottom:14}},React.createElement(Sprig,{size:18}),React.createElement('h3',{className:'font-round',style:{fontSize:16,color:'var(--brand-deep)',margin:0,fontWeight:700}},'受け渡し場所の目安')),
          React.createElement('div',{style:{display:'flex',gap:10,alignItems:'flex-start',marginBottom:14}},React.createElement(Icon,{name:'MapPin',size:20,color:'var(--brand)',style:{flex:'none',marginTop:2}}),
            React.createElement('div',null,React.createElement('div',{style:{fontSize:14.5,color:'var(--ink)',fontWeight:500}},p.campus+'内（正門付近・図書館前など）'),React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)',marginTop:4,lineHeight:1.6}},'詳細な場所・日時は取引メッセージで相談しましょう。'))),
          React.createElement('div',{style:{borderRadius:12,overflow:'hidden',marginBottom:18}},React.createElement('img',{src:'assets/campus.png',style:{width:'100%',display:'block'}})),
          React.createElement('div',{className:'heading-row',style:{marginBottom:8}},React.createElement(Sprig,{size:18}),React.createElement('h3',{className:'font-round',style:{fontSize:16,color:'var(--brand-deep)',margin:0,fontWeight:700}},'取引方法')),
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:9,fontSize:14.5,color:'var(--brand-deep)',fontWeight:700,fontFamily:'var(--font-round)'}},React.createElement(Icon,{name:'Handshake',size:19,color:'var(--brand)'}),'手渡しのみ'),
          React.createElement('p',{style:{margin:'8px 0 0',fontSize:13.5,color:'var(--ink-soft)',lineHeight:1.8}},'キャンパス内での手渡しを希望します。')),
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px'}},
          React.createElement('div',{className:'heading-row',style:{marginBottom:14}},React.createElement(Sprig,{size:18}),React.createElement('h3',{className:'font-round',style:{fontSize:16,color:'var(--brand-deep)',margin:0,fontWeight:700}},'その他の情報')),
          React.createElement('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:13.5}},
            React.createElement('tbody',null,(p.specs||[['カテゴリ',p.cat],['状態',p.cond],['キャンパス',p.campus]]).map((row,i)=>
              React.createElement('tr',{key:i,style:{borderBottom:'1px solid var(--line-soft)'}},
                React.createElement('td',{style:{padding:'11px 0',color:'var(--ink-soft)',width:'42%',verticalAlign:'top'}},row[0]),
                React.createElement('td',{style:{padding:'11px 0',color:'var(--ink)'}},row[1]))))))
      ),

      React.createElement('div',{style:{textAlign:'center',padding:'26px 0 6px'}},
        React.createElement('span',{className:'nav-link',style:{display:'inline-flex',alignItems:'center',gap:6,color:'var(--ink-faint)'}},React.createElement(Icon,{name:'TriangleAlert',size:15}),'この商品を通報する'))
    ),

    /* sticky action bar */
    React.createElement('div',{style:{position:'fixed',left:0,right:0,bottom:0,zIndex:45,display:'flex',justifyContent:'center',pointerEvents:'none'}},
      React.createElement('div',{style:{width:'100%',maxWidth:1024,background:'rgba(255,255,255,.97)',backdropFilter:'blur(10px)',borderTop:'1px solid var(--line)',padding:'14px 22px',display:'flex',gap:14,pointerEvents:'auto',boxShadow:'0 -8px 26px -18px rgba(95,129,40,.5)'}},
        React.createElement('button',{className:'btn btn-primary',style:{flex:1,padding:'16px',fontSize:16},onClick:()=>nav('chat',{partner:'taro',prod:p.id})},React.createElement(Icon,{name:'MessageSquare',size:19}),'出品者に連絡する'),
        React.createElement('button',{className:'btn btn-ghost',style:{flex:'.7',padding:'16px',fontSize:15},onClick:()=>setFav(!fav)},React.createElement(Icon,{name:'Heart',size:18,color:fav?'#e1607a':'var(--brand-deep)',style:{fill:fav?'#e1607a':'none'}}),'お気に入りに追加'))
    )
  );
}
const navBtn={width:38,height:38,borderRadius:'50%',border:'1.5px solid var(--line)',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flex:'none'};

window.DetailScreen = DetailScreen;
