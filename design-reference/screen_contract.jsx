/* ===== Contract / 取引を確定する (campus spot picker) ===== */
function ContractScreen({ nav, prod='chair', partner='taro' }){
  const p = getProduct(prod) || getProduct('chair');
  const [campus,setCampus]=useState('五十嵐キャンパス');
  const [spot,setSpot]=useState('lib');
  const [day,setDay]=useState('5/31 (土)');
  const [time,setTime]=useState('13:00');
  const [done,setDone]=useState(false);
  const spots = CAMPUS_SPOTS[campus];
  const spotName = (Object.values(CAMPUS_SPOTS).flat().find(s=>s.id===spot)||{}).name||'';

  const days=['5/30 (金)','5/31 (土)','6/1 (日)','6/3 (火)'];
  const times=['10:00','12:00','13:00','15:00','17:00','18:30'];

  const Step=({n,label,on,doneStep})=>React.createElement('div',{style:{display:'flex',alignItems:'center',gap:9}},
    React.createElement('span',{style:{width:30,height:30,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,fontFamily:'var(--font-round)',background:on||doneStep?'var(--brand)':'#e3e8d8',color:on||doneStep?'#fff':'var(--ink-faint)'}},doneStep?React.createElement(Icon,{name:'Check',size:15,stroke:3}):n),
    React.createElement('span',{style:{fontSize:13.5,color:on||doneStep?'var(--brand-deep)':'var(--ink-faint)',fontWeight:on?700:400,fontFamily:'var(--font-round)'}},label));

  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:130}},
    React.createElement(AppHeader,{nav,right:'mypage'}),
    React.createElement('main',{style:{maxWidth:840,margin:'0 auto',padding:'0 22px'}},
      React.createElement('div',{className:'nav-link',style:{display:'inline-flex',alignItems:'center',gap:8,padding:'22px 0 12px',fontSize:14.5},onClick:()=>nav('chat',{partner,prod})},React.createElement(Icon,{name:'ArrowLeft',size:18}),'チャットに戻る'),

      React.createElement('div',{className:'fade-up'},
        React.createElement('div',{className:'heading-row'},React.createElement(Icon,{name:'Handshake',size:30,color:'var(--brand-deep)'}),React.createElement('h1',{className:'font-round',style:{fontSize:30,color:'var(--ink)',margin:0,fontWeight:700}},'取引を確定する')),
        React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:14.5,margin:'10px 0 22px'}},'受け渡しの場所と日時を決めて、取引を確定しましょう。'),
        React.createElement('div',{className:'ds-card',style:{padding:'14px 22px',display:'flex',alignItems:'center',gap:20,marginBottom:22,flexWrap:'wrap'}},
          React.createElement(Step,{n:1,label:'受け渡し場所',on:true}),React.createElement('span',{style:{flex:'none',width:30,height:1,background:'var(--line)'}}),
          React.createElement(Step,{n:2,label:'日時',on:true}),React.createElement('span',{style:{flex:'none',width:30,height:1,background:'var(--line)'}}),
          React.createElement(Step,{n:3,label:'確定',on:done,doneStep:done})),

        /* product */
        React.createElement('div',{className:'ds-card',style:{padding:'16px 20px',display:'flex',alignItems:'center',gap:16,marginBottom:20}},
          React.createElement(ProductImg,{product:p,radius:12,style:{width:64,height:64},iconSize:28}),
          React.createElement('div',{style:{flex:1}},React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:16,color:'var(--ink)'}},p.title),React.createElement('div',{className:'font-round',style:{fontSize:17,fontWeight:700,color:'var(--brand-deep)',marginTop:3}},yen(p.price))),
          React.createElement('div',{style:{textAlign:'right'}},React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)'}},'取引相手'),React.createElement('div',{style:{display:'flex',alignItems:'center',gap:7,marginTop:4}},React.createElement('div',{className:'avatar',style:{width:30,height:30}},React.createElement(Icon,{name:'User',size:16,color:'#a9c172'})),React.createElement('span',{className:'font-round',style:{fontWeight:700,fontSize:14}},'新大 太郎')))),

        /* spot picker */
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px',marginBottom:20}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:16}},React.createElement('span',{style:numBadge},'1'),React.createElement('h3',{className:'font-round',style:{margin:0,fontSize:17,color:'var(--ink)',fontWeight:700}},'受け渡し場所を選ぶ')),
          React.createElement('div',{style:{display:'flex',gap:10,marginBottom:18}},
            Object.keys(CAMPUS_SPOTS).map(c=>React.createElement('button',{key:c,onClick:()=>{setCampus(c);setSpot(CAMPUS_SPOTS[c][0].id);},className:'btn',style:{padding:'11px 20px',fontSize:14,background:campus===c?'linear-gradient(135deg,var(--brand-grad-from),var(--brand-grad-to))':'#fff',color:campus===c?'#fff':'var(--ink-soft)',border:campus===c?'none':'1.5px solid var(--line)',boxShadow:campus===c?'0 6px 16px -8px rgba(110,150,50,.6)':'none'}},React.createElement(Icon,{name:'MapPin',size:15}),c))),
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}},
            spots.map(s=>{const on=spot===s.id;return React.createElement('div',{key:s.id,className:'select-card'+(on?' sel':''),onClick:()=>setSpot(s.id),style:{padding:'16px 16px',position:'relative'}},
              on&&React.createElement('span',{style:{position:'absolute',top:10,right:10,width:22,height:22,borderRadius:'50%',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'Check',size:13,color:'#fff',stroke:3})),
              React.createElement('div',{style:{width:42,height:42,borderRadius:12,background:on?'#fff':'var(--panel)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:11}},React.createElement(Icon,{name:s.icon,size:22,color:'var(--brand-deep)',stroke:1.8})),
              React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:15,color:'var(--ink)',marginBottom:3}},s.name),
              React.createElement('div',{style:{fontSize:12,color:'var(--ink-soft)',lineHeight:1.5}},s.desc))})),
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:9,marginTop:16,padding:'12px 16px',borderRadius:12,background:'var(--panel)',fontSize:13,color:'var(--ink-soft)'}},React.createElement(Icon,{name:'Info',size:16,color:'var(--brand)'}),'人通りの多い場所での受け渡しがおすすめです。安全に取引しましょう。')),

        /* datetime */
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px',marginBottom:20}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:16}},React.createElement('span',{style:numBadge},'2'),React.createElement('h3',{className:'font-round',style:{margin:0,fontSize:17,color:'var(--ink)',fontWeight:700}},'受け渡し日時を選ぶ')),
          React.createElement('div',{style:{fontSize:13,color:'var(--ink-soft)',marginBottom:9}},'日付'),
          React.createElement('div',{style:{display:'flex',gap:10,flexWrap:'wrap',marginBottom:18}},
            days.map(d=>React.createElement(Chip,{key:d,label:d,on:day===d,onClick:()=>setDay(d)}))),
          React.createElement('div',{style:{fontSize:13,color:'var(--ink-soft)',marginBottom:9}},'時間'),
          React.createElement('div',{style:{display:'flex',gap:10,flexWrap:'wrap'}},
            times.map(t=>React.createElement(Chip,{key:t,label:t,on:time===t,onClick:()=>setTime(t)})))),

        /* note */
        React.createElement('div',{className:'ds-card',style:{padding:'22px 24px'}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:14}},React.createElement('span',{style:numBadge},'3'),React.createElement('h3',{className:'font-round',style:{margin:0,fontSize:17,color:'var(--ink)',fontWeight:700}},'相手へのメッセージ（任意）')),
          React.createElement('textarea',{className:'field',rows:3,placeholder:'当日の目印や連絡事項があれば入力してください（例：緑色のリュックで向かいます）',style:{resize:'none',lineHeight:1.7}}))
      )
    ),

    /* sticky confirm */
    React.createElement('div',{style:{position:'fixed',left:0,right:0,bottom:0,zIndex:45,display:'flex',justifyContent:'center'}},
      React.createElement('div',{style:{width:'100%',maxWidth:840,background:'rgba(255,255,255,.97)',backdropFilter:'blur(10px)',borderTop:'1px solid var(--line)',padding:'14px 22px',display:'flex',alignItems:'center',gap:18,boxShadow:'0 -8px 26px -18px rgba(95,129,40,.5)'}},
        React.createElement('div',{style:{flex:1,fontSize:13.5,color:'var(--ink-soft)',display:'flex',flexWrap:'wrap',gap:'2px 14px'}},
          React.createElement('span',{style:{display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'MapPin',size:15,color:'var(--brand)'}),React.createElement('b',{style:{color:'var(--ink)',fontWeight:600}},campus+' '+spotName)),
          React.createElement('span',{style:{display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'CalendarDays',size:15,color:'var(--brand)'}),React.createElement('b',{style:{color:'var(--ink)',fontWeight:600}},day+' '+time))),
        React.createElement('button',{className:'btn btn-primary',style:{padding:'16px 30px',fontSize:16},onClick:()=>setDone(true)},React.createElement(Icon,{name:'Handshake',size:19}),'取引を確定する'))
    ),

    done&&React.createElement(ContractDone,{nav,p,campus,spotName,day,time})
  );
}

function Chip({ label, on, onClick }){
  return React.createElement('button',{onClick,className:'btn',style:{padding:'11px 20px',fontSize:14,background:on?'var(--panel)':'#fff',color:on?'var(--brand-deep)':'var(--ink-soft)',border:'1.5px solid '+(on?'var(--brand)':'var(--line)'),fontWeight:on?700:400}},label);
}
const numBadge={width:26,height:26,borderRadius:7,background:'var(--brand)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,fontFamily:'var(--font-round)',flex:'none'};

function ContractDone({ nav, p, campus, spotName, day, time }){
  return React.createElement('div',{style:{position:'fixed',inset:0,zIndex:60,background:'rgba(60,74,46,.42)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20},onClick:()=>{}},
    React.createElement('div',{className:'ds-card fade-up',style:{maxWidth:440,width:'100%',padding:'34px 32px',textAlign:'center',background:'#fff'},onClick:e=>e.stopPropagation()},
      React.createElement('div',{style:{width:84,height:84,margin:'0 auto 18px',borderRadius:'50%',background:'radial-gradient(circle,#eef5dd,#d6e7b6)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'Handshake',size:40,color:'var(--brand-deep)'})),
      React.createElement('h2',{className:'font-round',style:{fontSize:23,color:'var(--ink)',margin:'0 0 8px',fontWeight:700}},'取引が成立しました！'),
      React.createElement('p',{style:{fontSize:14,color:'var(--ink-soft)',margin:'0 0 22px',lineHeight:1.8}},'下記の内容で受け渡しを行いましょう。相手にも通知が送られました。'),
      React.createElement('div',{className:'ds-panel',style:{padding:'18px 20px',textAlign:'left',marginBottom:22,background:'var(--panel)'}},
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,paddingBottom:12,borderBottom:'1px solid var(--line)',marginBottom:12}},
          React.createElement(ProductImg,{product:p,radius:10,style:{width:48,height:48},iconSize:22}),
          React.createElement('div',null,React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:14,color:'var(--ink)'}},p.title),React.createElement('div',{style:{fontSize:14,fontWeight:700,color:'var(--brand-deep)'}},yen(p.price)))),
        React.createElement(InfoRow,{icon:'MapPin',label:'受け渡し場所',value:campus+' '+spotName}),
        React.createElement(InfoRow,{icon:'CalendarDays',label:'受け渡し日時',value:day+' '+time}),
        React.createElement(InfoRow,{icon:'Handshake',label:'取引方法',value:'手渡し'})),
      React.createElement('button',{className:'btn btn-primary',style:{width:'100%',padding:'15px',fontSize:15.5,marginBottom:10},onClick:()=>nav('rating',{prod:p.id,campus,spotName})},'受け渡しが完了したら評価する',React.createElement(Icon,{name:'ArrowRight',size:17})),
      React.createElement('button',{className:'btn btn-ghost',style:{width:'100%',padding:'13px',fontSize:14},onClick:()=>nav('chat',{prod:p.id})},'チャットに戻る')
    )
  );
}
function InfoRow({ icon, label, value }){
  return React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,padding:'5px 0'}},
    React.createElement(Icon,{name:icon,size:17,color:'var(--brand)',style:{flex:'none'}}),
    React.createElement('span',{style:{fontSize:12.5,color:'var(--ink-faint)',width:92,flex:'none'}},label),
    React.createElement('span',{className:'font-round',style:{fontSize:14,color:'var(--ink)',fontWeight:600}},value));
}

window.ContractScreen = ContractScreen;
