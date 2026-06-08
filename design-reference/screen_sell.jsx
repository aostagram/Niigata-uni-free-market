/* ===== Sell + Notifications + MyListings ===== */
function SellScreen({ nav }){
  const conds=['新品・未使用','未使用に近い','目立った傷や汚れなし','やや傷や汚れあり','傷や汚れあり','全体的に状態が悪い'];
  const [cond,setCond]=useState('新品・未使用');
  const [method,setMethod]=useState('手渡しのみ');
  const [done,setDone]=useState(false);
  const Step=({n,label,on})=>React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:6}},
    React.createElement('span',{style:{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-round)',background:on?'var(--brand)':'#e3e8d8',color:on?'#fff':'var(--ink-faint)'}},n),
    React.createElement('span',{style:{fontSize:12.5,color:on?'var(--brand-deep)':'var(--ink-faint)',fontFamily:'var(--font-round)',fontWeight:on?700:400}},label));
  const Sect=({title,children})=>React.createElement('div',{className:'ds-card',style:{padding:'24px 26px',marginBottom:20}},
    React.createElement('div',{className:'heading-row',style:{marginBottom:18}},React.createElement(Sprig,{size:19}),React.createElement('h2',{className:'font-round',style:{fontSize:18,color:'var(--ink)',margin:0,fontWeight:700}},title)),children);
  const Label=({children})=>React.createElement('div',{style:{fontSize:13.5,color:'var(--ink)',fontWeight:500,marginBottom:8}},children);

  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:40}},
    React.createElement(AppHeader,{nav,right:'mypage'}),
    React.createElement('main',{style:{maxWidth:920,margin:'0 auto',padding:'0 22px'}},
      React.createElement('div',{className:'fade-up',style:{display:'flex',alignItems:'flex-start',gap:20,padding:'34px 0 26px',flexWrap:'wrap'}},
        React.createElement('div',{style:{flex:1,minWidth:240}},
          React.createElement('div',{className:'heading-row'},React.createElement('h1',{className:'font-round',style:{fontSize:32,color:'var(--ink)',margin:0,fontWeight:700}},'商品を出品する'),React.createElement(Sprig,{size:24})),
          React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:14.5,margin:'10px 0 0'}},'必要な情報を入力して、商品を出品しましょう。')),
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:14,paddingTop:6}},
          React.createElement(Step,{n:'1',label:'情報入力',on:true}),React.createElement('span',{style:{width:30,height:1,background:'var(--line)',borderTop:'2px dashed var(--line)'}}),
          React.createElement(Step,{n:'2',label:'内容確認'}),React.createElement('span',{style:{width:30,height:1,borderTop:'2px dashed var(--line)'}}),
          React.createElement(Step,{n:'3',label:'出品完了'}))),

      /* photos */
      React.createElement(Sect,{title:'商品写真'},
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1.5fr repeat(4,1fr)',gap:14}},
          React.createElement('div',{style:{aspectRatio:'1',borderRadius:16,border:'2px dashed var(--brand)',background:'rgba(132,173,63,.04)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',gridRow:'span 2',padding:16,textAlign:'center'}},
            React.createElement('div',{style:{width:62,height:62,borderRadius:'50%',background:'var(--panel)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}},React.createElement(Icon,{name:'Camera',size:28,color:'var(--brand-deep)'})),
            React.createElement('div',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:14}},'写真を追加する'),
            React.createElement('div',{style:{fontSize:11.5,color:'var(--ink-soft)',marginTop:5,lineHeight:1.5}},'ドラッグ＆ドロップ',React.createElement('br'),'またはクリックして選択'),
            React.createElement('div',{style:{fontSize:11,color:'var(--ink-faint)',marginTop:12}},'※最大10枚まで登録できます')),
          [...Array(8)].map((_,i)=>React.createElement('div',{key:i,style:{aspectRatio:'1',borderRadius:14,border:'1.5px solid var(--line)',background:'#fafcf5',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}},
            React.createElement(Icon,{name:'Image',size:26,color:'#cdd6bd'}),
            React.createElement('span',{style:{position:'absolute',bottom:8,right:8,width:22,height:22,borderRadius:'50%',background:'var(--panel)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'Plus',size:13,color:'var(--brand-deep)'}))))),
        React.createElement('div',{style:{fontSize:12,color:'var(--brand-deep)',marginTop:12}},'※1枚目がメイン画像になります')),

      /* condition */
      React.createElement(Sect,{title:'商品の状態'},
        React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:10}},
          conds.map(c=>React.createElement('button',{key:c,onClick:()=>setCond(c),className:'btn',style:{padding:'12px 18px',fontSize:13.5,background:cond===c?'var(--panel)':'#fff',color:cond===c?'var(--brand-deep)':'var(--ink-soft)',border:'1.5px solid '+(cond===c?'var(--brand)':'var(--line)'),fontWeight:cond===c?700:400,gap:8}},
            React.createElement('span',{style:{width:16,height:16,borderRadius:'50%',border:'2px solid '+(cond===c?'var(--brand)':'#cfd8bf'),display:'flex',alignItems:'center',justifyContent:'center'}},cond===c&&React.createElement('span',{style:{width:8,height:8,borderRadius:'50%',background:'var(--brand)'}})),c))),
        React.createElement('div',{className:'ds-panel',style:{marginTop:16,padding:'14px 18px',display:'flex',gap:11,background:'var(--panel)'}},React.createElement(Sprig,{size:20}),React.createElement('div',null,React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:13.5,color:'var(--brand-deep)',marginBottom:3}},'状態の目安'),React.createElement('div',{style:{fontSize:13,color:'var(--ink-soft)',lineHeight:1.6}},'商品の状態を正確に伝えることで、スムーズなお取引につながります。')))),

      /* name */
      React.createElement(Sect,{title:'商品名'},
        React.createElement('input',{className:'field',placeholder:'商品名を入力してください（40文字以内）'}),
        React.createElement('div',{style:{textAlign:'right',fontSize:12,color:'var(--ink-faint)',marginTop:8}},'0 / 40')),

      /* overview */
      React.createElement(Sect,{title:'その他概要'},
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px 24px'}},
          React.createElement('div',null,React.createElement(Label,null,'カテゴリ'),React.createElement(SelectBox,{placeholder:'カテゴリを選択してください'})),
          React.createElement('div',null,React.createElement(Label,null,'ブランド（任意）'),React.createElement('input',{className:'field',placeholder:'ブランド名を入力してください'})),
          React.createElement('div',null,React.createElement(Label,null,'価格'),React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10}},React.createElement('input',{className:'field',placeholder:'¥ 価格を入力してください'}),React.createElement('span',{style:{color:'var(--ink-soft)',fontSize:14}},'円'))),
          React.createElement('div',{style:{gridRow:'span 3'}},React.createElement(Label,null,'説明'),React.createElement('textarea',{className:'field',rows:8,placeholder:'商品の説明を入力してください（1000文字以内）',style:{resize:'none',lineHeight:1.7}}),React.createElement('div',{style:{textAlign:'right',fontSize:12,color:'var(--ink-faint)',marginTop:6}},'0 / 1000')),
          React.createElement('div',null,React.createElement(Label,null,'受け渡し方法'),React.createElement(SelectBox,{placeholder:'受け渡し方法を選択してください'})),
          React.createElement('div',null,React.createElement(Label,null,'受け渡し場所'),React.createElement('input',{className:'field',placeholder:'受け渡し場所を入力してください（例：新大正門前）'})),
          React.createElement('div',null,React.createElement(Label,null,'取引方法'),React.createElement('div',{style:{display:'flex',gap:24,paddingTop:6}},
            ['手渡しのみ','配送も可能'].map(m=>React.createElement('label',{key:m,onClick:()=>setMethod(m),style:{display:'flex',alignItems:'center',gap:9,cursor:'pointer',fontSize:14,color:'var(--ink)'}},
              React.createElement('span',{style:{width:18,height:18,borderRadius:'50%',border:'2px solid '+(method===m?'var(--brand)':'#cfd8bf'),display:'flex',alignItems:'center',justifyContent:'center'}},method===m&&React.createElement('span',{style:{width:9,height:9,borderRadius:'50%',background:'var(--brand)'}})),m))))),
        React.createElement('div',{style:{marginTop:18}},React.createElement(Label,null,'タグ（任意）'),React.createElement('input',{className:'field',placeholder:'タグを追加（例：教科書、参考書）'}),React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)',marginTop:7}},'※スペースで区切って複数のタグを入力できます'))),

      React.createElement('div',{style:{display:'flex',gap:16,alignItems:'center',padding:'8px 0 30px'}},
        React.createElement('button',{className:'btn btn-ghost',style:{padding:'15px 26px',fontSize:14.5},onClick:()=>nav('mypage')},'下書きとして保存'),
        React.createElement('button',{className:'btn btn-primary',style:{flex:1,padding:'17px',fontSize:16.5},onClick:()=>setDone(true)},'確認画面へ進む',React.createElement(Icon,{name:'ArrowRight',size:18})))
    ),
    done&&React.createElement(SellDone,{nav})
  );
}

function SellDone({ nav }){
  return React.createElement('div',{style:{position:'fixed',inset:0,zIndex:60,background:'rgba(60,74,46,.42)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}},
    React.createElement('div',{className:'ds-card fade-up',style:{maxWidth:420,width:'100%',padding:'36px 32px',textAlign:'center',background:'#fff'}},
      React.createElement('div',{style:{width:88,height:88,margin:'0 auto 18px',borderRadius:'50%',background:'radial-gradient(circle,#eef5dd,#d6e7b6)',display:'flex',alignItems:'center',justifyContent:'center'}},React.createElement(Icon,{name:'CheckCircle2',size:44,color:'var(--brand-deep)'})),
      React.createElement('h2',{className:'font-round',style:{fontSize:23,color:'var(--ink)',margin:'0 0 8px',fontWeight:700}},'出品が完了しました！'),
      React.createElement('p',{style:{fontSize:14,color:'var(--ink-soft)',margin:'0 0 22px',lineHeight:1.8}},'あなたの商品が新大フリマに公開されました。メッセージが届いたら通知でお知らせします。'),
      React.createElement('button',{className:'btn btn-primary',style:{width:'100%',padding:'15px',fontSize:15.5,marginBottom:10},onClick:()=>nav('mylistings')},'出品した商品を見る'),
      React.createElement('button',{className:'btn btn-ghost',style:{width:'100%',padding:'13px',fontSize:14},onClick:()=>nav('home')},'ホームに戻る'))
  );
}

function NotificationsScreen({ nav }){
  const iconBg={message:'#e3edf7',like:'#fbe9ee',deal:'#eaf2d6',star:'#fdf3da',system:'var(--panel)'};
  const iconCol={message:'#4d7bb0',like:'#e1607a',deal:'var(--brand-deep)',star:'#c8a02e',system:'var(--brand-deep)'};
  const [filter,setFilter]=useState('すべて');
  const important=n=>n.type==='deal'||n.type==='system';
  const list=NOTIFICATIONS.filter(n=>filter==='未読のみ'?n.unread:filter==='重要'?important(n):true);
  const unreadCount=NOTIFICATIONS.filter(n=>n.unread).length;
  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav,notifCount:unreadCount}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'24px 22px 0'}},
      React.createElement('div',{className:'fade-up',style:{display:'grid',gridTemplateColumns:'220px 1fr',gap:24}},
        React.createElement(SideMenu,{nav,active:'通知設定'}),
        React.createElement('div',null,
          React.createElement('div',{style:{display:'flex',alignItems:'flex-end',gap:16,flexWrap:'wrap'}},
            React.createElement('div',{style:{flex:1,minWidth:200}},
              React.createElement('div',{className:'heading-row'},React.createElement(Icon,{name:'Bell',size:24,color:'var(--brand-deep)'}),React.createElement('h1',{className:'font-round',style:{fontSize:26,color:'var(--ink)',margin:0,fontWeight:700}},'通知')),
              React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:13.5,margin:'8px 0 0'}},'メッセージ・いいね・取引のお知らせが届きます。')),
            React.createElement('span',{className:'nav-link',style:{display:'flex',alignItems:'center',gap:5},onClick:()=>setFilter('すべて')},React.createElement(Icon,{name:'CheckCheck',size:15}),'すべて既読にする')),
          React.createElement('div',{style:{display:'flex',gap:10,margin:'16px 0 18px',flexWrap:'wrap'}},
            ['すべて','未読のみ','重要'].map(t=>{const on=filter===t;const badge=t==='未読のみ'&&unreadCount?unreadCount:null;
              return React.createElement('button',{key:t,onClick:()=>setFilter(t),className:'btn',style:{padding:'9px 18px',fontSize:13.5,background:on?'var(--panel)':'#fff',color:on?'var(--brand-deep)':'var(--ink-soft)',border:'1.5px solid '+(on?'var(--brand)':'var(--line)'),fontWeight:on?700:400}},t,
                badge&&React.createElement('span',{style:{marginLeft:6,background:'var(--coral)',color:'#fff',fontSize:11,borderRadius:999,padding:'1px 7px',fontWeight:700}},badge))})),
          React.createElement('div',{className:'ds-card',style:{overflow:'hidden'}},
            list.length?list.map((n,i)=>React.createElement('div',{key:n.id,onClick:()=>nav(n.type==='message'?'chat':'mypage'),style:{display:'flex',gap:15,padding:'18px 22px',borderBottom:i<list.length-1?'1px solid var(--line-soft)':'none',cursor:'pointer',background:n.unread?'rgba(132,173,63,.05)':'transparent',alignItems:'center'}},
              React.createElement('div',{style:{width:46,height:46,borderRadius:'50%',background:iconBg[n.type],display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},React.createElement(Icon,{name:n.icon,size:21,color:iconCol[n.type]})),
              React.createElement('div',{style:{flex:1,minWidth:0}},React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:14.5,color:'var(--ink)',marginBottom:3}},n.title),React.createElement('div',{style:{fontSize:13,color:'var(--ink-soft)',lineHeight:1.6}},n.body)),
              React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,flex:'none'}},
                React.createElement('div',{style:{textAlign:'right'}},React.createElement('div',{style:{fontSize:12,color:'var(--ink-faint)'}},n.time),n.unread&&React.createElement('span',{style:{display:'inline-block',width:9,height:9,borderRadius:'50%',background:'var(--coral)',marginTop:6}})),
                React.createElement(Icon,{name:'ChevronRight',size:18,color:'var(--ink-faint)'}))))
            :React.createElement('div',{style:{padding:'48px 22px',textAlign:'center',color:'var(--ink-faint)',fontSize:14}},'表示する通知はありません'))
        )
      )
    ),
    React.createElement(TabBar,{active:'',nav})
  );
}

function MyListingsScreen({ nav }){
  const tabs=[['すべて',12],['出品中',8],['取引中',3],['売却済み',1],['公開停止中',0]];
  const [tab,setTab]=useState('すべて');
  const rows=[['chair','出品中','2024/05/20'],['book','出品中','2024/05/18'],['laptop','取引中','2024/05/15'],['tote','売却済み','2024/05/10'],['desk','出品中','2024/05/05']];
  const filtered=tab==='すべて'?rows:rows.filter(r=>r[1]===tab);
  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'24px 22px 0'}},
      React.createElement('div',{className:'fade-up',style:{display:'grid',gridTemplateColumns:'220px 1fr',gap:24}},
        React.createElement(SideMenu,{nav,active:'出品した商品'}),
        React.createElement('div',null,
          React.createElement('div',{className:'heading-row',style:{marginBottom:6}},React.createElement(Icon,{name:'Camera',size:24,color:'var(--brand-deep)'}),React.createElement('h1',{className:'font-round',style:{fontSize:26,color:'var(--ink)',margin:0,fontWeight:700}},'出品した商品')),
          React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:13.5,margin:'8px 0 18px'}},'出品した商品の一覧です。商品情報の編集や、公開停止・削除などの管理ができます。'),
          React.createElement('div',{style:{display:'flex',gap:10,flexWrap:'wrap',marginBottom:18}},
            tabs.map(t=>React.createElement('button',{key:t[0],onClick:()=>setTab(t[0]),className:'btn',style:{padding:'10px 18px',fontSize:13.5,background:tab===t[0]?'var(--panel)':'#fff',color:tab===t[0]?'var(--brand-deep)':'var(--ink-soft)',border:'1.5px solid '+(tab===t[0]?'var(--brand)':'var(--line)'),fontWeight:tab===t[0]?700:400}},t[0]+'（'+t[1]+'）'))),
          React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:16}},
            filtered.map((r,i)=>{const p=getProduct(r[0]);
              return React.createElement('div',{key:i,className:'ds-card',style:{padding:'18px 20px',display:'grid',gridTemplateColumns:'130px 1fr auto',gap:20,alignItems:'center'}},
                React.createElement(ProductImg,{product:p,radius:12,style:{height:130},iconSize:44}),
                React.createElement('div',null,
                  React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:7}},React.createElement('span',{className:'font-round',style:{fontWeight:700,fontSize:16,color:'var(--ink)'}},p.title),React.createElement(StatusBadge,{status:r[1]})),
                  React.createElement('div',{className:'font-round',style:{fontSize:19,fontWeight:700,color:'var(--ink)',marginBottom:10}},yen(p.price)),
                  React.createElement('div',{style:{display:'flex',gap:18,fontSize:12.5,color:'var(--ink-soft)',marginBottom:6,flexWrap:'wrap',alignItems:'center'}},React.createElement('span',{style:{whiteSpace:'nowrap'}},'出品日：'+r[2]),React.createElement('span',{style:{display:'flex',alignItems:'center',gap:4}},React.createElement(Icon,{name:'Eye',size:13}),p.views),React.createElement('span',{style:{display:'flex',alignItems:'center',gap:4}},React.createElement(Icon,{name:'Heart',size:13}),p.likes)),
                  React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)'}},'状態：'+p.cond+'　/　受け渡し：'+p.campus+'周辺')),
                React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:8,minWidth:150}},
                  [['Pencil','編集する'],['Tag','価格を変更'],['Sparkles','商品状態を変更'],r[1]==='取引中'?['CheckCircle2','取引を完了する']:['PauseCircle','出品を停止する']].map((b,j)=>React.createElement('button',{key:j,className:'btn btn-ghost',style:{padding:'9px 14px',fontSize:12.5,justifyContent:'flex-start'},onClick:()=>b[1]==='取引を完了する'?nav('rating',{prod:p.id}):null},React.createElement(Icon,{name:b[0],size:14}),b[1])),
                  React.createElement('button',{className:'btn',style:{padding:'9px 14px',fontSize:12.5,justifyContent:'flex-start',background:'#fff',border:'1.5px solid var(--coral-line)',color:'var(--coral)'}},React.createElement(Icon,{name:'Trash2',size:14}),'削除する')))}))
        )
      )
    ),
    React.createElement(TabBar,{active:'mypage',nav})
  );
}

Object.assign(window,{ SellScreen, NotificationsScreen, MyListingsScreen });
