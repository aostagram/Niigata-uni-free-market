/* ===== MyPage + Favorites ===== */
const MENU=[
  { key:'mypage', icon:'User', label:'マイページ' },
  { key:'mylistings', icon:'Camera', label:'出品した商品' },
  { key:'chat', icon:'Repeat', label:'取引中の商品' },
  { key:'favorites', icon:'Heart', label:'お気に入り' },
  { key:'chat', icon:'MessageSquare', label:'メッセージ' },
  { key:'notifications', icon:'Bell', label:'通知設定' },
  { key:'mypage', icon:'Settings', label:'アカウント設定' },
  { key:'mypage', icon:'HelpCircle', label:'ヘルプ・お問い合わせ' },
  { key:'login', icon:'LogOut', label:'ログアウト' },
];

function SideMenu({ nav, active }){
  return React.createElement('aside',{className:'ds-card',style:{padding:'10px',alignSelf:'start',position:'sticky',top:86}},
    MENU.map((m,i)=>{const on=m.label===active;return React.createElement('div',{key:i,onClick:()=>nav(m.key),style:{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderRadius:12,cursor:'pointer',marginBottom:2,background:on?'var(--panel)':'transparent',color:on?'var(--brand-deep)':'var(--ink-soft)',fontWeight:on?700:400,fontFamily:'var(--font-round)',fontSize:14.5}},
      React.createElement(Icon,{name:m.icon,size:19,stroke:on?2.2:1.9}),m.label)}));
}

function ProfileCard(){
  return React.createElement('div',{className:'ds-card',style:{padding:'24px 26px'}},
    React.createElement('div',{className:'heading-row',style:{marginBottom:18}},React.createElement(Sprig,{size:18}),React.createElement('span',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15}},'プロフィール')),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'auto 1fr',gap:22,alignItems:'center'}},
      React.createElement('div',{style:{display:'flex',gap:18,alignItems:'center'}},
        React.createElement('div',{style:{width:92,height:92,borderRadius:'50%',background:'radial-gradient(circle,#eef5dd,#d6e7b6)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},React.createElement(Icon,{name:'Sprout',size:44,color:'var(--brand-deep)'})),
        React.createElement('div',null,
          React.createElement('div',{className:'font-round',style:{fontSize:24,fontWeight:700,color:'var(--ink)'}},'新大 太郎'),
          React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)',margin:'2px 0 10px'}},'シンダイ タロウ'),
          React.createElement('div',{style:{fontSize:13,color:'var(--ink-soft)',display:'flex',alignItems:'center',gap:6,marginBottom:4}},React.createElement(Icon,{name:'GraduationCap',size:15,color:'var(--brand)'}),'教育学部 3年'),
          React.createElement('div',{style:{fontSize:13,color:'var(--ink-soft)',display:'flex',alignItems:'center',gap:6,marginBottom:12}},React.createElement(Icon,{name:'MapPin',size:15,color:'var(--brand)'}),'五十嵐キャンパス'),
          React.createElement('button',{className:'btn btn-ghost',style:{padding:'9px 18px',fontSize:13}},'プロフィールを編集'))),
      React.createElement('div',{className:'ds-panel',style:{padding:'18px 20px',background:'var(--panel)',display:'flex',flexDirection:'column',gap:14}},
        [['学生認証済み','学生証の確認が完了しています'],['大学メール認証済み','新潟大学のメールアドレスを使用して登録しています']].map((r,i)=>
          React.createElement('div',{key:i,style:{display:'flex',gap:12}},React.createElement(Icon,{name:'CheckCircle2',size:24,color:'var(--brand)',style:{flex:'none'}}),
            React.createElement('div',null,React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:14,color:'var(--brand-deep)'}},r[0]),React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)',marginTop:2,lineHeight:1.5}},r[1]))))))
  );
}

function MyPageScreen({ nav }){
  const stats=[['Camera','出品した商品','12件'],['CheckCircle2','取引完了','8件'],['Heart','お気に入り','15件'],['Star','評価','5.0']];
  const listed=[['chair','出品中'],['book','出品中'],['laptop','取引中'],['tote','取引完了']];
  const tiles=[['Heart','お気に入り','15件','favorites'],['MessageSquare','メッセージ','2件の未読','chat'],['Bell','通知設定','ON','notifications'],['Settings','アカウント設定','','mypage'],['HelpCircle','ヘルプ・お問い合わせ','','mypage']];
  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'24px 22px 0'}},
      React.createElement('div',{className:'fade-up',style:{display:'grid',gridTemplateColumns:'220px 1fr',gap:24}},
        React.createElement(SideMenu,{nav,active:'マイページ'}),
        React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:20}},
          React.createElement(ProfileCard,null),
          /* stats */
          React.createElement('div',{className:'ds-card',style:{padding:'4px 0',display:'grid',gridTemplateColumns:'repeat(4,1fr)'}},
            stats.map((s,i)=>React.createElement('div',{key:i,style:{padding:'20px 16px',display:'flex',alignItems:'center',gap:14,borderLeft:i?'1px solid var(--line-soft)':'none'}},
              React.createElement(Icon,{name:s[0],size:26,color:'var(--brand)',stroke:1.8}),
              React.createElement('div',null,React.createElement('div',{style:{fontSize:12.5,color:'var(--ink-soft)'}},s[1]),React.createElement('div',{className:'font-round',style:{fontSize:21,fontWeight:700,color:'var(--ink)'}},s[2],s[1]==='評価'&&React.createElement('span',{style:{fontSize:12,color:'var(--ink-soft)',fontWeight:400}},' (12件)')))))),
          /* listed */
          React.createElement('div',{className:'ds-card',style:{padding:'22px 24px'}},
            React.createElement('div',{style:{display:'flex',alignItems:'center',marginBottom:16}},React.createElement('div',{className:'heading-row'},React.createElement(Sprig,{size:18}),React.createElement('h2',{className:'font-round',style:{fontSize:18,color:'var(--brand-deep)',margin:0,fontWeight:700}},'出品した商品')),React.createElement('span',{className:'nav-link',style:{marginLeft:'auto',display:'flex',alignItems:'center',gap:4},onClick:()=>nav('mylistings')},'すべて見る',React.createElement(Icon,{name:'ChevronRight',size:15}))),
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}},
              listed.map((l,i)=>{const p=getProduct(l[0]);const tagcls=l[1]==='取引完了'?'tag-gray':l[1]==='取引中'?'tag-blue':'';return React.createElement('div',{key:i,onClick:()=>nav('detail',{id:p.id}),style:{cursor:'pointer'}},
                React.createElement('div',{style:{position:'relative',marginBottom:10}},React.createElement(ProductImg,{product:p,radius:12,style:{height:120},iconSize:40}),React.createElement('span',{className:'tag '+tagcls,style:{position:'absolute',left:8,bottom:8}},l[1])),
                React.createElement('div',{className:'clamp-2',style:{fontSize:13,color:'var(--ink)',lineHeight:1.4,minHeight:'2.8em'}},p.short),
                React.createElement('div',{className:'font-round',style:{fontSize:16,fontWeight:700,color:'var(--ink)',margin:'4px 0 6px'}},yen(p.price)),
                React.createElement('div',{style:{display:'flex',gap:14,fontSize:12,color:'var(--ink-soft)'}},React.createElement('span',{style:{display:'flex',alignItems:'center',gap:4}},React.createElement(Icon,{name:'Heart',size:13}),p.likes),React.createElement('span',{style:{display:'flex',alignItems:'center',gap:4}},React.createElement(Icon,{name:'Eye',size:13}),p.views)))})) ),
          /* in-progress */
          React.createElement('div',{className:'ds-card',style:{padding:'22px 24px'}},
            React.createElement('div',{style:{display:'flex',alignItems:'center',marginBottom:16}},React.createElement('div',{className:'heading-row'},React.createElement(Sprig,{size:18}),React.createElement('h2',{className:'font-round',style:{fontSize:18,color:'var(--brand-deep)',margin:0,fontWeight:700}},'取引中の商品')),React.createElement('span',{className:'nav-link',style:{marginLeft:'auto',display:'flex',alignItems:'center',gap:4},onClick:()=>nav('chat')},'すべて見る',React.createElement(Icon,{name:'ChevronRight',size:15}))),
            React.createElement('div',{className:'ds-panel',style:{padding:'16px 18px',display:'flex',alignItems:'center',gap:16,background:'var(--panel)'}},
              React.createElement(ProductImg,{product:getProduct('laptop'),radius:10,style:{width:64,height:64},iconSize:26}),
              React.createElement('div',{style:{minWidth:150}},React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:15,color:'var(--ink)'}},'MacBook Air 13インチ'),React.createElement('div',{className:'font-round',style:{fontSize:16,fontWeight:700,color:'var(--brand-deep)',margin:'2px 0 6px'}},'¥45,000'),React.createElement('div',{style:{fontSize:12,color:'var(--ink-soft)',marginBottom:4}},'取引相手：花子さん'),React.createElement('span',{className:'tag tag-blue'},'取引中')),
              React.createElement('div',{style:{flex:1,borderLeft:'1px solid var(--line)',paddingLeft:18}},React.createElement('div',{style:{fontSize:12,color:'var(--brand-deep)',fontWeight:700,marginBottom:4}},'最新メッセージ'),React.createElement('div',{style:{fontSize:13.5,color:'var(--ink)',marginBottom:3}},'受け渡しの日時について相談したいです！'),React.createElement('div',{style:{fontSize:11.5,color:'var(--ink-faint)'}},'2時間前')),
              React.createElement('button',{className:'btn btn-primary',style:{padding:'12px 20px',fontSize:13.5,flex:'none'},onClick:()=>nav('chat',{partner:'hanako',prod:'laptop'})},'メッセージを開く'))),
          /* tiles */
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14}},
            tiles.map((t,i)=>React.createElement('div',{key:i,onClick:()=>nav(t[3]),className:'ds-card',style:{padding:'20px 12px',textAlign:'center',cursor:'pointer'}},
              React.createElement(Icon,{name:t[0],size:26,color:'var(--brand)',stroke:1.8,style:{marginBottom:8}}),
              React.createElement('div',{className:'font-round',style:{fontSize:13,fontWeight:700,color:'var(--ink)'}},t[1]),
              t[2]&&React.createElement('div',{style:{fontSize:11.5,color:'var(--ink-soft)',marginTop:3}},t[2])))),
          React.createElement(SafetyBanner,null)
        )
      )
    ),
    React.createElement(TabBar,{active:'mypage',nav})
  );
}

function FavoritesScreen({ nav }){
  const favs=['chair','laptop','hoodie','book','airpods','tote'];
  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'34px 22px 0'}},
      React.createElement('div',{className:'fade-up'},
        React.createElement('div',{className:'heading-row'},React.createElement(Icon,{name:'Heart',size:26,color:'#e1607a'}),React.createElement('h1',{className:'font-round',style:{fontSize:30,color:'var(--ink)',margin:0,fontWeight:700}},'お気に入り')),
        React.createElement('p',{style:{color:'var(--ink-soft)',fontSize:14.5,margin:'10px 0 24px'}},'気になる商品を ',React.createElement('b',{style:{color:'var(--brand-deep)'}},favs.length+'件'),' 保存しています。'),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18}},
          favs.map(id=>React.createElement(ProductCard,{key:id,product:getProduct(id),nav,compact:true})))
      )
    ),
    React.createElement(TabBar,{active:'favorites',nav})
  );
}

Object.assign(window,{ MyPageScreen, FavoritesScreen, SideMenu });
