/* ===== 取引完了・評価 ===== */
function RatingScreen({ nav, prod='chair', campus='旭町キャンパス', spotName='図書館前' }){
  const p = getProduct(prod) || getProduct('chair');
  const [rate,setRate]=useState('good');
  const [hide,setHide]=useState(false);
  const [done,setDone]=useState(false);

  const Step=({icon,n,label,on,active})=>React.createElement('div',{style:{display:'flex',alignItems:'center',gap:9}},
    React.createElement('span',{style:{width:30,height:30,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:on?'var(--brand)':'#fff',border:on?'none':'1.5px solid var(--line)',color:on?'#fff':'var(--ink-faint)',fontSize:13,fontWeight:700,fontFamily:'var(--font-round)'}},icon?React.createElement(Icon,{name:icon,size:15,stroke:3}):n),
    React.createElement('span',{style:{fontSize:13.5,color:on?'var(--brand-deep)':'var(--ink-soft)',fontWeight:active?700:400,fontFamily:'var(--font-round)'}},label));

  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:140}},
    React.createElement(AppHeader,{nav,right:'mypage',notifCount:2}),
    React.createElement('main',{style:{maxWidth:840,margin:'0 auto',padding:'0 22px'}},
      React.createElement('div',{className:'fade-up',style:{paddingTop:30}},
        React.createElement('div',{className:'heading-row'},React.createElement(Icon,{name:'Handshake',size:30,color:'var(--brand-deep)'}),React.createElement('h1',{className:'font-round',style:{fontSize:30,color:'var(--ink)',margin:0,fontWeight:700}},'取引完了・評価')),
        React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:14.5,margin:'10px 0 22px'}},'取引が完了したら、相手を評価して取引を完了しましょう。'),

        React.createElement('div',{className:'ds-card',style:{padding:'14px 22px',display:'flex',alignItems:'center',gap:16,marginBottom:22,flexWrap:'wrap'}},
          React.createElement(Step,{icon:'Check',label:'受け渡し完了',on:true}),React.createElement('span',{style:{flex:'none',width:36,height:1,background:'var(--line)'}}),
          React.createElement(Step,{n:'2',label:'評価・コメント',on:true,active:true}),React.createElement('span',{style:{flex:'none',width:36,height:1,background:'var(--line)'}}),
          React.createElement(Step,{n:'3',label:'取引完了'})),

        /* product + partner + datetime */
        React.createElement('div',{className:'ds-card',style:{padding:'18px 22px',display:'grid',gridTemplateColumns:'auto 1fr auto',gap:18,alignItems:'center',marginBottom:22}},
          React.createElement(ProductImg,{product:p,radius:12,style:{width:84,height:84},iconSize:34}),
          React.createElement('div',null,
            React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:17,color:'var(--ink)'}},p.title),
            React.createElement('div',{className:'font-round',style:{fontSize:18,fontWeight:700,color:'var(--brand-deep)',margin:'4px 0 8px'}},yen(p.price)),
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:9}},React.createElement('span',{className:'tag'},'取引相手'),React.createElement('div',{className:'avatar',style:{width:28,height:28}},React.createElement(Icon,{name:'User',size:15,color:'#a9c172'})),React.createElement('span',{className:'font-round',style:{fontWeight:700,fontSize:14}},'新大 花子さん'),React.createElement('span',{style:{fontSize:12,color:'var(--ink-soft)'}},'教育学部 2年'))),
          React.createElement('div',{style:{borderLeft:'1px solid var(--line)',paddingLeft:18,fontSize:13}},
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:7,marginBottom:10}},React.createElement(Icon,{name:'CalendarDays',size:16,color:'var(--brand)'}),React.createElement('div',null,React.createElement('div',{style:{fontSize:11,color:'var(--ink-faint)'}},'受け渡し日時'),React.createElement('div',{style:{fontWeight:600}},'2024/05/25 (土) 14:00'))),
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:7}},React.createElement(Icon,{name:'MapPin',size:16,color:'var(--brand)'}),React.createElement('div',null,React.createElement('div',{style:{fontSize:11,color:'var(--ink-faint)'}},'受け渡し場所'),React.createElement('div',{style:{fontWeight:600}},campus+' '+spotName))))),

        /* 1 evaluate */
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px',marginBottom:20}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:5}},React.createElement('span',{style:numBadge},'1'),React.createElement('h3',{className:'font-round',style:{margin:0,fontSize:17,color:'var(--ink)',fontWeight:700}},'相手を評価する')),
          React.createElement('p',{style:{margin:'0 0 16px 36px',fontSize:13.5,color:'var(--ink-soft)'}},'今回の取引相手はどうでしたか？'),
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18}},
            React.createElement('div',{onClick:()=>setRate('good'),className:'select-card'+(rate==='good'?' sel':''),style:{padding:'22px',textAlign:'center',position:'relative'}},
              rate==='good'&&React.createElement('span',{style:{position:'absolute',top:12,right:12,width:24,height:24,borderRadius:'50%',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'Check',size:14,color:'#fff',stroke:3})),
              React.createElement(Icon,{name:'Smile',size:38,color:'var(--brand-deep)',style:{marginBottom:8}}),
              React.createElement('div',{className:'font-round',style:{fontSize:17,fontWeight:700,color:'var(--brand-deep)',marginBottom:5}},'よかった'),
              React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)'}},'スムーズで気持ちの良い取引でした')),
            React.createElement('div',{onClick:()=>setRate('bad'),className:'select-card',style:{padding:'22px',textAlign:'center',borderColor:rate==='bad'?'var(--coral)':'var(--line)',background:rate==='bad'?'var(--coral-bg)':'#fff',position:'relative',boxShadow:rate==='bad'?'0 0 0 3px rgba(219,106,79,.12)':'none'}},
              rate==='bad'&&React.createElement('span',{style:{position:'absolute',top:12,right:12,width:24,height:24,borderRadius:'50%',background:'var(--coral)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'Check',size:14,color:'#fff',stroke:3})),
              React.createElement(Icon,{name:'Frown',size:38,color:'var(--coral)',style:{marginBottom:8}}),
              React.createElement('div',{className:'font-round',style:{fontSize:17,fontWeight:700,color:'var(--coral)',marginBottom:5}},'問題あり'),
              React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)'}},'連絡・対応などに問題がありました'))),
          React.createElement('div',{style:{fontSize:13.5,color:'var(--ink-soft)',marginBottom:9}},'コメントを入力する（任意）'),
          React.createElement('textarea',{className:'field',rows:3,placeholder:'取引の感想を自由に入力してください（例：親切に対応してくれた、スムーズに取引できた など）',style:{resize:'none',lineHeight:1.7}})),

        /* 2 trouble */
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px',marginBottom:20}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:5}},React.createElement('span',{style:numBadge},'2'),React.createElement('h3',{className:'font-round',style:{margin:0,fontSize:17,color:'var(--ink)',fontWeight:700}},'トラブルがあった場合（任意）')),
          React.createElement('p',{style:{margin:'0 0 14px 36px',fontSize:13.5,color:'var(--ink-soft)'}},'今回の取引で問題があった場合は、運営に報告することができます。'),
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:16,padding:'16px 18px',borderRadius:14,background:'var(--panel)',border:'1px solid var(--line)'}},
            React.createElement('div',{style:{flex:1}},React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:14.5,color:'var(--ink)',marginBottom:4}},'問題を報告する'),React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.6}},'迷惑行為や不適切な取引があった場合は、運営が内容を確認します。※報告は相手に通知されません。')),
            React.createElement('button',{className:'btn btn-ghost',style:{padding:'12px 18px',fontSize:13.5,flex:'none'}},'問題を報告する'))),

        /* 3 hide */
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px'}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:5}},React.createElement('span',{style:numBadge},'3'),React.createElement('h3',{className:'font-round',style:{margin:0,fontSize:17,color:'var(--ink)',fontWeight:700}},'商品を非公開にする')),
          React.createElement('p',{style:{margin:'0 0 14px 36px',fontSize:13.5,color:'var(--ink-soft)'}},'取引が完了したら、この商品を公開停止にすることができます。'),
          React.createElement('label',{onClick:()=>setHide(!hide),style:{display:'flex',alignItems:'flex-start',gap:13,padding:'16px 18px',borderRadius:14,background:hide?'var(--panel)':'#fff',border:'1px solid var(--line)',cursor:'pointer'}},
            React.createElement('span',{style:{width:24,height:24,borderRadius:7,border:'2px solid '+(hide?'var(--brand)':'#cfd8bf'),background:hide?'var(--brand)':'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',marginTop:1}},hide&&React.createElement(Icon,{name:'Check',size:15,color:'#fff',stroke:3})),
            React.createElement('div',null,React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:14.5,color:'var(--ink)',marginBottom:3}},'この商品を非公開にする'),React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.6}},'チェックすると、商品が非公開になり、他のユーザーに表示されなくなります。'))))
      )
    ),

    React.createElement('div',{style:{position:'fixed',left:0,right:0,bottom:0,zIndex:45,display:'flex',justifyContent:'center'}},
      React.createElement('div',{style:{width:'100%',maxWidth:840,background:'rgba(255,255,255,.97)',backdropFilter:'blur(10px)',borderTop:'1px solid var(--line)',padding:'14px 22px',textAlign:'center',boxShadow:'0 -8px 26px -18px rgba(95,129,40,.5)'}},
        React.createElement('button',{className:'btn btn-primary',style:{width:'100%',maxWidth:520,padding:'17px',fontSize:16.5},onClick:()=>setDone(true)},React.createElement(Icon,{name:'Handshake',size:20}),'取引を完了する'),
        React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)',marginTop:8}},'※ 取引完了後は、評価やコメントの変更はできません。'))),

    done&&React.createElement(RatingDone,{nav,p,rate})
  );
}

function RatingDone({ nav, p, rate }){
  return React.createElement('div',{style:{position:'fixed',inset:0,zIndex:60,background:'rgba(60,74,46,.42)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}},
    React.createElement('div',{className:'ds-card fade-up',style:{maxWidth:430,width:'100%',padding:'36px 32px',textAlign:'center',background:'#fff'}},
      React.createElement('div',{style:{width:90,height:90,margin:'0 auto 18px',borderRadius:'50%',background:'radial-gradient(circle,#eef5dd,#d6e7b6)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'PartyPopper',size:44,color:'var(--brand-deep)'})),
      React.createElement('h2',{className:'font-round',style:{fontSize:24,color:'var(--ink)',margin:'0 0 8px',fontWeight:700}},'取引が完了しました！'),
      React.createElement('p',{style:{fontSize:14,color:'var(--ink-soft)',margin:'0 0 18px',lineHeight:1.8}},'評価のご協力ありがとうございました。気持ちのよい取引が、みんなの新大フリマをつくります。'),
      React.createElement('div',{style:{display:'flex',justifyContent:'center',gap:4,marginBottom:22}},[1,2,3,4,5].map(i=>React.createElement(Icon,{key:i,name:'Star',size:26,color:'var(--star)',style:{fill:rate==='good'?'var(--star)':'none'}}))),
      React.createElement('button',{className:'btn btn-primary',style:{width:'100%',padding:'15px',fontSize:15.5,marginBottom:10},onClick:()=>nav('mypage')},'マイページへ戻る'),
      React.createElement('button',{className:'btn btn-ghost',style:{width:'100%',padding:'13px',fontSize:14},onClick:()=>nav('search')},'ほかの商品を見る'))
  );
}

window.RatingScreen = RatingScreen;
