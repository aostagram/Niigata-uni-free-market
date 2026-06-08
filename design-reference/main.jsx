/* ===== App state machine ===== */
function App(){
  const [route,setRoute]=useState(()=>{
    try{ const s=JSON.parse(localStorage.getItem('niidai_route')||'null'); if(s&&s.screen) return s; }catch(e){}
    return { screen:'login', params:{} };
  });
  const nav=(screen,params={})=>{
    const r={ screen, params };
    setRoute(r);
    try{ localStorage.setItem('niidai_route',JSON.stringify(r)); }catch(e){}
    window.scrollTo({top:0,behavior:'auto'});
  };
  const p=route.params||{};
  let view;
  switch(route.screen){
    case 'login': view=React.createElement(LoginScreen,{nav}); break;
    case 'home': view=React.createElement(HomeScreen,{nav}); break;
    case 'search': view=React.createElement(SearchScreen,{nav,initialCat:p.cat||'すべて'}); break;
    case 'detail': view=React.createElement(DetailScreen,{nav,productId:p.id}); break;
    case 'chat': view=React.createElement(ChatScreen,{nav,partner:p.partner||'taro',prod:p.prod||'chair'}); break;
    case 'contract': view=React.createElement(ContractScreen,{nav,prod:p.prod||'chair',partner:p.partner||'taro'}); break;
    case 'rating': view=React.createElement(RatingScreen,{nav,prod:p.prod||'chair',campus:p.campus,spotName:p.spotName}); break;
    case 'mypage': view=React.createElement(MyPageScreen,{nav}); break;
    case 'mylistings': view=React.createElement(MyListingsScreen,{nav}); break;
    case 'favorites': view=React.createElement(FavoritesScreen,{nav}); break;
    case 'sell': view=React.createElement(SellScreen,{nav}); break;
    case 'notifications': view=React.createElement(NotificationsScreen,{nav}); break;
    default: view=React.createElement(HomeScreen,{nav});
  }
  return React.createElement(React.Fragment,{key:route.screen},view);
}

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
