/* ===== Login + Home(Top) ===== */

function LoginScreen({ nav }){
  const [a,setA]=useState(false), [b,setB]=useState(false);
  const ok=a&&b;
  const Check=({on,set,children})=>React.createElement('label',{style:{display:'flex',alignItems:'center',gap:12,cursor:'pointer',padding:'4px 0'}},
    React.createElement('span',{onClick:()=>set(!on),style:{width:24,height:24,borderRadius:7,border:'2px solid '+(on?'var(--brand)':'#cfd8bf'),background:on?'var(--brand)':'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',flex:'none'}},
      on&&React.createElement(Icon,{name:'Check',size:15,color:'#fff',stroke:3})),
    React.createElement('span',{style:{fontSize:15}},children)
  );
  return React.createElement('div',{className:'wc-page',style:{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',padding:'40px 20px'}},
    React.createElement('div',{className:'fade-up',style:{width:'100%',maxWidth:560,display:'flex',flexDirection:'column',alignItems:'center'}},
      React.createElement('div',{style:{width:230,height:230,borderRadius:'50%',background:'radial-gradient(circle at 50% 42%, #fff 18%, rgba(212,234,191,.55) 55%, rgba(170,205,110,.25) 78%, transparent 82%)',display:'flex',alignItems:'center',justifyContent:'center',marginTop:20}},
        React.createElement('div',{style:{textAlign:'center'}},
          React.createElement('div',{style:{position:'relative',display:'inline-flex'}},
            React.createElement(Icon,{name:'ShoppingBag',size:74,color:'var(--brand-deep)',stroke:1.7}),
            React.createElement(Icon,{name:'Lock',size:25,color:'var(--brand-deep)',stroke:2.2,style:{position:'absolute',left:'50%',top:'56%',transform:'translate(-50%,-50%)'}})),
          React.createElement('div',{className:'font-round',style:{fontSize:38,fontWeight:700,color:'var(--logo)',marginTop:6,letterSpacing:'.04em'}},'新大フリマ'),
          React.createElement('div',{className:'font-latin',style:{fontSize:13,color:'var(--brand)',letterSpacing:'.1em',marginTop:4}},'Niigata univ. Free Market')
        )
      ),
      React.createElement('h1',{className:'font-round',style:{fontSize:27,color:'var(--ink)',fontWeight:500,margin:'26px 0 14px',textAlign:'center'}},'新大生の「欲しい」がきっと見つかる。'),
      React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,color:'var(--brand)',margin:'2px 0 14px'}},
        React.createElement('span',{style:{width:60,height:1,background:'var(--line)'}}),React.createElement(Sprig,{size:20}),React.createElement('span',{style:{width:60,height:1,background:'var(--line)'}})),
      React.createElement('p',{style:{textAlign:'center',color:'var(--ink-soft)',fontSize:16,lineHeight:1.8,margin:'0 0 26px'}},'新潟大学の学生のための',React.createElement('br'),'フリマアプリです。'),

      React.createElement('button',{className:'btn',style:{width:'100%',background:'#fff',border:'1.5px solid var(--line)',padding:'17px',fontSize:15.5,color:'var(--ink)',boxShadow:'var(--shadow-soft)',gap:12},onClick:()=>nav('home')},
        React.createElement(GoogleG,null),'新潟大学の Google アカウントでログイン'),

      React.createElement('div',{className:'ds-panel',style:{width:'100%',marginTop:18,padding:'18px 20px',display:'flex',gap:14,background:'var(--panel)'}},
        React.createElement(Icon,{name:'GraduationCap',size:30,color:'var(--brand)',stroke:1.7,style:{flex:'none',marginTop:2}}),
        React.createElement('div',null,
          React.createElement('div',{className:'font-round',style:{fontWeight:700,color:'var(--brand-deep)',fontSize:15,marginBottom:4}},'学生のみの非公式団体です'),
          React.createElement('p',{style:{margin:0,fontSize:13.5,color:'var(--ink-soft)',lineHeight:1.7}},'新大フリマは、新潟大学の学生による学生のための非公式団体です。教職員の方はご利用いただけません。'))
      ),

      React.createElement('div',{style:{width:'100%',marginTop:16,padding:'20px 22px',border:'1.5px solid var(--line)',borderRadius:'var(--radius)',background:'rgba(255,255,255,.6)'}},
        React.createElement('div',{style:{fontSize:14.5,color:'var(--brand-deep)',fontWeight:500,marginBottom:10,fontFamily:'var(--font-round)'}},'ログインするには、以下の両方にチェックを入れてください。'),
        React.createElement(Check,{on:a,set:setA},React.createElement('span',null,React.createElement('span',{style:{color:'var(--brand-deep)',textDecoration:'underline'}},'利用規約'),' に同意します')),
        React.createElement(Check,{on:b,set:setB},React.createElement('span',null,React.createElement('span',{style:{color:'var(--brand-deep)',textDecoration:'underline'}},'プライバシーポリシー'),' に同意します')),
        React.createElement('button',{className:'btn '+(ok?'btn-primary':'btn-disabled'),disabled:!ok,onClick:()=>ok&&nav('home'),style:{width:'100%',marginTop:14,padding:'16px',fontSize:16}},'上記に同意してログイン')
      ),

      React.createElement('div',{style:{display:'flex',gap:12,alignItems:'center',marginTop:16,color:'var(--ink-soft)',fontSize:13.5,lineHeight:1.7}},
        React.createElement('div',{style:{width:34,height:34,borderRadius:'50%',background:'var(--brand)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},React.createElement(Icon,{name:'AlertCircle',size:20})),
        React.createElement('span',null,'チェックが入っていない場合は、ログインボタンを押すことができません。')),

      React.createElement('div',{style:{display:'flex',gap:'18px 26px',flexWrap:'wrap',justifyContent:'center',marginTop:30,color:'var(--brand-deep)',fontSize:13.5,fontFamily:'var(--font-round)'}},
        ['利用規約','プライバシーポリシー','よくある質問','お問い合わせ'].map(t=>React.createElement('span',{key:t,style:{cursor:'pointer'}},t))),
      React.createElement('div',{style:{marginTop:16,color:'var(--ink-faint)',fontSize:12.5}},'© 2024 新大フリマ')
    )
  );
}

function GoogleG(){
  return React.createElement('svg',{width:22,height:22,viewBox:'0 0 48 48'},
    React.createElement('path',{fill:'#EA4335',d:'M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'}),
    React.createElement('path',{fill:'#4285F4',d:'M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'}),
    React.createElement('path',{fill:'#FBBC05',d:'M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'}),
    React.createElement('path',{fill:'#34A853',d:'M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'})
  );
}

window.LoginScreen = LoginScreen;
