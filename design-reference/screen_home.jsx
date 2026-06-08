/* ===== Home / Top landing ===== */
function HomeScreen({ nav }){
  return React.createElement('div',{className:'wc-page',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'0 22px'}},

      /* hero */
      React.createElement('section',{className:'fade-up',style:{display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:32,alignItems:'center',padding:'46px 0 36px'}},
        React.createElement('div',null,
          React.createElement('div',{className:'tag',style:{marginBottom:18}},React.createElement(Icon,{name:'Sprout',size:14}),'新潟大学の学生限定マーケット'),
          React.createElement('h1',{className:'font-round',style:{fontSize:42,lineHeight:1.35,color:'var(--ink)',margin:'0 0 18px',fontWeight:700}},'新大生の「欲しい」が',React.createElement('br'),React.createElement('span',{style:{color:'var(--brand-deep)'}},'きっと見つかる。')),
          React.createElement('p',{style:{fontSize:16,color:'var(--ink-soft)',lineHeight:1.9,margin:'0 0 26px'}},'教科書も、家具も、家電も。学内の仲間どうしで、安心してゆずり合い。キャンパスで手渡しできるから、送料もかかりません。'),
          React.createElement('div',{onClick:()=>nav('search'),style:{display:'flex',alignItems:'center',gap:10,background:'#fff',border:'1.5px solid var(--line)',borderRadius:999,padding:'14px 20px',boxShadow:'var(--shadow-soft)',cursor:'pointer',marginBottom:20}},
            React.createElement(Icon,{name:'Search',size:20,color:'var(--brand)'}),
            React.createElement('span',{style:{color:'var(--ink-faint)',fontSize:15}},'何をお探しですか？（例：教科書、椅子、パソコン）')),
          React.createElement('div',{style:{display:'flex',gap:12}},
            React.createElement('button',{className:'btn btn-primary',style:{padding:'15px 30px',fontSize:15.5},onClick:()=>nav('search')},React.createElement(Icon,{name:'Search',size:18}),'商品を探す'),
            React.createElement('button',{className:'btn btn-ghost',style:{padding:'15px 28px',fontSize:15.5},onClick:()=>nav('sell')},React.createElement(Icon,{name:'Plus',size:18}),'出品する'))
        ),
        /* hero visual */
        React.createElement('div',{style:{position:'relative'}},
          React.createElement('div',{className:'ds-card',style:{padding:14,transform:'rotate(-1.5deg)'}},
            React.createElement('div',{style:{borderRadius:14,overflow:'hidden'}},
              React.createElement('img',{src:'assets/campus.png',alt:'新潟大学キャンパス',style:{width:'100%',display:'block'}})),
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'12px 6px 4px'}},
              React.createElement(Icon,{name:'MapPin',size:16,color:'var(--brand)'}),
              React.createElement('span',{style:{fontSize:13.5,color:'var(--ink-soft)'}},'五十嵐キャンパス・旭町キャンパスで受け渡し'))
          ),
          React.createElement('div',{className:'ds-card fade-up',style:{position:'absolute',bottom:-18,left:-22,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,background:'#fff'}},
            React.createElement('div',{style:{width:38,height:38,borderRadius:10,background:'var(--panel)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'ShieldCheck',size:20,color:'var(--brand-deep)'})),
            React.createElement('div',{style:{lineHeight:1.3}},React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)'}},'学生認証'),React.createElement('div',{className:'font-round',style:{fontSize:14,fontWeight:700,color:'var(--brand-deep)'}},'安心の本人確認'))),
          React.createElement('div',{className:'ds-card',style:{position:'absolute',top:-16,right:-14,padding:'10px 14px',display:'flex',alignItems:'center',gap:8,background:'#fff',whiteSpace:'nowrap'}},
            React.createElement(Icon,{name:'Truck',size:18,color:'var(--brand)'}),React.createElement('span',{className:'font-round',style:{fontSize:13,fontWeight:700,color:'var(--ink)'}},'送料0円'))
        )
      ),

      /* categories */
      React.createElement('section',{style:{padding:'18px 0'}},
        React.createElement('div',{className:'heading-row',style:{marginBottom:16}},React.createElement(Sprig,null),React.createElement('h2',{className:'font-round',style:{fontSize:20,color:'var(--ink)',margin:0,fontWeight:700}},'カテゴリから探す')),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:12}},
          CATEGORIES.map(c=>React.createElement('div',{key:c.key,onClick:()=>nav('search',{cat:c.key}),style:{cursor:'pointer',textAlign:'center'}},
            React.createElement('div',{style:{width:'100%',aspectRatio:'1',borderRadius:16,background:'#fff',border:'1.5px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8,transition:'all .15s'},onMouseEnter:e=>e.currentTarget.style.borderColor='var(--brand)',onMouseLeave:e=>e.currentTarget.style.borderColor='var(--line)'},
              React.createElement(Icon,{name:c.icon,size:26,color:'var(--brand-deep)',stroke:1.7})),
            React.createElement('div',{style:{fontSize:12,color:'var(--ink-soft)',lineHeight:1.3}},c.key)))
        )
      ),

      /* new arrivals */
      React.createElement('section',{style:{padding:'24px 0'}},
        React.createElement('div',{style:{display:'flex',alignItems:'center',marginBottom:16}},
          React.createElement('div',{className:'heading-row'},React.createElement(Sprig,null),React.createElement('h2',{className:'font-round',style:{fontSize:20,color:'var(--ink)',margin:0,fontWeight:700}},'新着の商品')),
          React.createElement('span',{className:'nav-link',style:{marginLeft:'auto',display:'flex',alignItems:'center',gap:4},onClick:()=>nav('search')},'すべて見る',React.createElement(Icon,{name:'ChevronRight',size:16}))),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}},
          PRODUCTS.slice(0,4).map(p=>React.createElement(ProductCard,{key:p.id,product:p,nav,compact:true})))
      ),

      /* campus */
      React.createElement('section',{style:{padding:'10px 0 8px'}},
        React.createElement('div',{className:'ds-panel',style:{padding:'26px 28px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,alignItems:'center',background:'var(--panel)'}},
          React.createElement('div',null,
            React.createElement('div',{className:'heading-row',style:{marginBottom:10}},React.createElement(Sprig,null),React.createElement('h2',{className:'font-round',style:{fontSize:20,color:'var(--brand-deep)',margin:0,fontWeight:700}},'キャンパスで探す')),
            React.createElement('p',{style:{margin:'0 0 16px',fontSize:14,color:'var(--ink-soft)',lineHeight:1.8}},'受け渡ししやすいキャンパスから商品を絞り込めます。'),
            React.createElement('div',{style:{display:'flex',gap:10}},
              ['五十嵐キャンパス','旭町キャンパス'].map(c=>React.createElement('button',{key:c,className:'btn btn-ghost',style:{padding:'11px 18px',fontSize:14},onClick:()=>nav('search')},React.createElement(Icon,{name:'MapPin',size:15}),c)))),
          React.createElement('div',{style:{borderRadius:14,overflow:'hidden',boxShadow:'var(--shadow-soft)'}},
            React.createElement('img',{src:'assets/campus.png',alt:'キャンパス',style:{width:'100%',display:'block'}}))
        )
      ),

      React.createElement(SafetyBanner,null),
      React.createElement(SiteFooter,null)
    ),
    React.createElement(TabBar,{active:'home',nav})
  );
}

function SafetyBanner(){
  return React.createElement('section',{style:{padding:'18px 0'}},
    React.createElement('div',{className:'ds-panel',style:{padding:'26px 30px',display:'flex',alignItems:'center',gap:20,background:'var(--panel)',overflow:'hidden',position:'relative'}},
      React.createElement('div',{style:{flex:1}},
        React.createElement('div',{className:'heading-row',style:{marginBottom:8}},React.createElement(Sprig,null),React.createElement('h3',{className:'font-round',style:{fontSize:18,color:'var(--brand-deep)',margin:0,fontWeight:700}},'安心・安全にご利用いただくために')),
        React.createElement('p',{style:{margin:0,fontSize:13.5,color:'var(--ink-soft)',lineHeight:1.8}},'新大フリマは、新潟大学の学生のみが利用できる学内限定のフリマアプリです。安全で気持ちのよい取引のために、ルールを守ってご利用ください。'),
        React.createElement('button',{className:'btn btn-ghost',style:{marginTop:16,padding:'10px 18px',fontSize:13.5}},'利用ルールを確認する')),
      React.createElement(Icon,{name:'ShieldCheck',size:96,color:'#cdddb0',stroke:1,style:{flex:'none'}})
    )
  );
}

function SiteFooter(){
  return React.createElement('footer',{style:{padding:'30px 0 10px',marginTop:10,borderTop:'1px solid var(--line-soft)'}},
    React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:'12px 24px',justifyContent:'center',color:'var(--ink-soft)',fontSize:13,fontFamily:'var(--font-round)'}},
      ['運営について','利用規約','プライバシーポリシー','お問い合わせ'].map(t=>React.createElement('span',{key:t,style:{cursor:'pointer'}},t))),
    React.createElement('div',{style:{textAlign:'center',marginTop:16,color:'var(--ink-faint)',fontSize:12}},'© 2024 新大フリマ — Niigata univ. Free Market')
  );
}

window.HomeScreen = HomeScreen;
