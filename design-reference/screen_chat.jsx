/* ===== Chat ===== */
function ChatScreen({ nav, partner='taro', prod='chair' }){
  const p = getProduct(prod) || getProduct('chair');
  const active = CHAT_THREADS.find(t=>t.id===partner) || CHAT_THREADS[0];
  const scroller = useRef(null);
  useEffect(()=>{ if(scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; },[]);

  return React.createElement('div',{className:'wc-soft',style:{minHeight:'100vh',paddingBottom:96}},
    React.createElement(AppHeader,{nav,right:'mypage'}),
    React.createElement('main',{style:{maxWidth:1024,margin:'0 auto',padding:'18px 22px 0'}},
      React.createElement('div',{className:'fade-up ds-card',style:{display:'grid',gridTemplateColumns:'300px 1fr',overflow:'hidden',height:'calc(100vh - 150px)',minHeight:560}},

        /* thread list */
        React.createElement('div',{style:{borderRight:'1px solid var(--line)',display:'flex',flexDirection:'column',background:'rgba(255,255,255,.5)'}},
          React.createElement('div',{style:{padding:'20px 20px 14px'}},
            React.createElement('div',{className:'heading-row',style:{marginBottom:14}},React.createElement('span',{className:'font-round',style:{fontSize:21,fontWeight:700,color:'var(--ink)'}},'メッセージ'),React.createElement(Sprig,{size:20,style:{marginLeft:'auto'}})),
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:9,background:'#fff',border:'1.5px solid var(--line)',borderRadius:12,padding:'10px 14px'}},
              React.createElement(Icon,{name:'Search',size:17,color:'var(--brand)'}),
              React.createElement('input',{placeholder:'メッセージを検索',style:{border:'none',outline:'none',flex:1,fontSize:13.5,background:'transparent',fontFamily:'var(--font-body)'}}))),
          React.createElement('div',{className:'thin-scroll',style:{overflowY:'auto',flex:1,padding:'0 12px'}},
            CHAT_THREADS.map(t=>{const on=t.id===partner; const tp=getProduct(t.prod);
              return React.createElement('div',{key:t.id,onClick:()=>nav('chat',{partner:t.id,prod:t.prod}),style:{display:'flex',gap:11,padding:'13px 12px',borderRadius:14,cursor:'pointer',marginBottom:4,background:on?'var(--panel)':'transparent',border:'1px solid '+(on?'var(--line)':'transparent')}},
                React.createElement('div',{style:{width:46,height:46,borderRadius:'50%',overflow:'hidden',flex:'none',background:'var(--panel-2)',display:'flex',alignItems:'center',justifyContent:'center'}},
                  tp&&tp.img?React.createElement('img',{src:tp.img,style:{width:'100%',height:'100%',objectFit:'cover'}}):React.createElement(Icon,{name:'User',size:22,color:'#a9c172'})),
                React.createElement('div',{style:{flex:1,minWidth:0}},
                  React.createElement('div',{style:{display:'flex',alignItems:'center'}},React.createElement('span',{className:'font-round',style:{fontWeight:700,fontSize:14.5,color:'var(--ink)'}},t.name),React.createElement('span',{style:{marginLeft:'auto',fontSize:11.5,color:'var(--ink-faint)'}},t.time)),
                  React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginTop:3}},React.createElement('span',{style:{fontSize:12.5,color:'var(--ink-soft)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}},t.last),
                    t.unread>0&&React.createElement('span',{style:{background:'var(--brand)',color:'#fff',fontSize:11,minWidth:18,height:18,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flex:'none',fontWeight:700}},t.unread))))})),
          React.createElement('div',{style:{padding:14}},React.createElement('button',{className:'btn btn-ghost',style:{width:'100%',padding:'11px',fontSize:13.5}},'すべてのメッセージを見る',React.createElement(Icon,{name:'ArrowRight',size:15})))
        ),

        /* conversation */
        React.createElement('div',{style:{display:'flex',flexDirection:'column',minWidth:0}},
          /* product header */
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:14,padding:'15px 22px',borderBottom:'1px solid var(--line)'}},
            React.createElement(ProductImg,{product:p,radius:10,style:{width:52,height:52},iconSize:24}),
            React.createElement('div',{style:{flex:1,minWidth:0}},React.createElement('div',{className:'font-round',style:{fontWeight:700,fontSize:15,color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},p.title),React.createElement('div',{className:'font-round',style:{fontSize:15,fontWeight:700,color:'var(--brand-deep)',marginTop:2}},yen(p.price))),
            React.createElement('button',{className:'btn btn-ghost',style:{padding:'10px 16px',fontSize:13},onClick:()=>nav('detail',{id:p.id})},'商品ページへ',React.createElement(Icon,{name:'ExternalLink',size:14}))),

          /* messages */
          React.createElement('div',{ref:scroller,className:'thin-scroll',style:{flex:1,overflowY:'auto',padding:'20px 22px',display:'flex',flexDirection:'column',gap:14}},
            React.createElement('div',{style:{textAlign:'center'}},React.createElement('span',{style:{background:'#fff',border:'1px solid var(--line)',color:'var(--ink-soft)',fontSize:12,padding:'5px 16px',borderRadius:999}},'5月27日（月）')),
            CHAT_MESSAGES.map((m,i)=>React.createElement(Bubble,{key:i,m,prod:p}))),

          /* deal CTA + input */
          React.createElement('div',{style:{borderTop:'1px solid var(--line)'}},
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',background:'var(--panel)'}},
              React.createElement(Icon,{name:'Handshake',size:20,color:'var(--brand-deep)'}),
              React.createElement('span',{style:{fontSize:13.5,color:'var(--ink-soft)',flex:1}},'受け渡しの相談がまとまったら取引を確定しましょう。'),
              React.createElement('button',{className:'btn btn-primary',style:{padding:'12px 22px',fontSize:14.5},onClick:()=>nav('contract',{prod:p.id,partner})},React.createElement(Icon,{name:'Handshake',size:17}),'取引を確定する')),
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,padding:'14px 22px'}},
              React.createElement('button',{style:{...navBtn,border:'1.5px solid var(--line)'}},React.createElement(Icon,{name:'Paperclip',size:18,color:'var(--ink-soft)'})),
              React.createElement('input',{placeholder:'メッセージを入力...',style:{flex:1,border:'1.5px solid var(--line)',borderRadius:999,padding:'12px 18px',outline:'none',fontSize:14,fontFamily:'var(--font-body)'}}),
              React.createElement('button',{style:{...navBtn,border:'1.5px solid var(--line)'}},React.createElement(Icon,{name:'Smile',size:18,color:'var(--ink-soft)'})),
              React.createElement('button',{className:'btn btn-primary',style:{width:46,height:46,borderRadius:'50%',padding:0,flex:'none'}},React.createElement(Icon,{name:'Send',size:19}))),
            React.createElement('div',{style:{display:'flex',alignItems:'center',padding:'0 22px 12px',fontSize:12,color:'var(--ink-faint)'}},
              React.createElement('span',null,'※ 不適切なメッセージを見つけた場合は、運営に報告してください。'),
              React.createElement('span',{style:{marginLeft:'auto',display:'flex',alignItems:'center',gap:5}},React.createElement(Icon,{name:'TriangleAlert',size:14}),'通報する')))
        )
      )
    ),
    React.createElement(TabBar,{active:'chat',nav})
  );
}

function Bubble({ m, prod }){
  const me = m.from==='me';
  const av = React.createElement('div',{style:{width:34,height:34,borderRadius:'50%',flex:'none',display:'flex',alignItems:'center',justifyContent:'center',background:me?'var(--panel)':'transparent',border:me?'none':'1px solid var(--line)'}},
    React.createElement(Icon,{name:me?'Sprout':'User',size:18,color:me?'var(--brand)':'#a9c172'}));
  const meta = React.createElement('div',{style:{fontSize:11,color:'var(--ink-faint)',display:'flex',flexDirection:'column',justifyContent:'flex-end',gap:2,paddingBottom:2}},
    me&&m.read&&React.createElement('span',null,'既読'),React.createElement('span',null,m.time));
  const content = React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:8,alignItems:me?'flex-end':'flex-start'}},
    !me&&React.createElement('span',{style:{fontSize:12.5,color:'var(--ink-soft)',fontWeight:500}},'新大 太郎'),
    React.createElement('div',{className:'bubble '+(me?'bubble-sent':'bubble-recv')},m.text),
    m.photos&&React.createElement('div',{style:{display:'flex',gap:8}},[0,1,2].map(i=>React.createElement('div',{key:i,style:{width:110,height:88,borderRadius:10,overflow:'hidden',border:'1px solid var(--line)'}},React.createElement('img',{src:prod.img,style:{width:'100%',height:'100%',objectFit:'cover'}})))));
  return React.createElement('div',{style:{display:'flex',gap:10,justifyContent:me?'flex-end':'flex-start',maxWidth:'85%',alignSelf:me?'flex-end':'flex-start',flexDirection:me?'row':'row'}},
    !me&&av,
    me?[meta,content].map((x,i)=>React.createElement(React.Fragment,{key:i},x)):content,
    me&&av
  );
}

window.ChatScreen = ChatScreen;
