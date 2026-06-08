/* ===== Shared data ===== */
const PRODUCTS = [
  { id:'chair', title:'オフィスチェア（メッシュ・肘掛け付き）', short:'オフィスチェア（メッシュ）', price:2000, cat:'家具・インテリア', icon:'Armchair',
    img:'assets/prod_chair.png', campus:'旭町キャンパス', dept:'人文学部', cond:'目立った傷や汚れなし', ago:'3時間前', likes:5, views:68,
    desc:'在宅ワーク用に購入したオフィスチェアです。\n引っ越しに伴い不要になったため出品します。\nメッシュ素材で通気性がよく、長時間の作業でも快適です。\n昇降機能・リクライニング機能も問題なく使えます。',
    bullets:['高さ調整可能','リクライニング機能付き','肘掛け付き','キャスター付きで移動もスムーズ'],
    note:'丁寧に使用していたため、目立つ傷や汚れはありません。\nアルコール清掃済みです。\n気になる点があればお気軽にご質問ください！',
    specs:[['カテゴリ','家具・インテリア > 椅子・チェア'],['ブランド','—'],['色','ブラック'],['サイズ','幅60cm × 奥行60cm × 高さ110cm（調整可）'],['購入時期','2023年4月'],['使用期間','約6ヶ月'],['ペットの有無','なし'],['喫煙の有無','なし']] },
  { id:'book', title:'微分積分学（第4版）', short:'微分積分学（第4版）', price:1200, cat:'本・教科書', icon:'BookOpen',
    img:'assets/prod_book.png', campus:'五十嵐キャンパス', dept:'経済科学部', cond:'目立った傷や汚れなし', ago:'2時間前', likes:2, views:32,
    desc:'講義で使用していた教科書です。書き込みは少なめ、状態は良好です。' },
  { id:'laptop', title:'MacBook Air 13インチ', short:'MacBook Air 13インチ', price:45000, cat:'パソコン・家電', icon:'Laptop',
    img:'assets/prod_laptop.png', campus:'五十嵐キャンパス', dept:'法学部', cond:'目立った傷や汚れなし', ago:'5時間前', likes:3, views:124,
    desc:'2021年モデル。バッテリー良好、付属品完備。動作確認済みです。' },
  { id:'tote', title:'トートバッグ（アイボリー）', short:'トートバッグ（アイボリー）', price:500, cat:'ファッション', icon:'ShoppingBag',
    img:'assets/prod_tote.png', campus:'旭町キャンパス', dept:'人文学部', cond:'目立った傷や汚れなし', ago:'6時間前', likes:1, views:20,
    desc:'数回のみ使用。キャンバス地でしっかりしています。' },
  { id:'desk', title:'学習机セット（イス付き）', short:'学習机セット（イス付き）', price:3000, cat:'家具・インテリア', icon:'Table2',
    img:'assets/prod_desk.png', campus:'五十嵐キャンパス', dept:'教育学部', cond:'やや傷や汚れあり', ago:'8時間前', likes:4, views:46,
    desc:'卒業に伴い出品。引き出し付きで収納たっぷり。' },
  { id:'hoodie', title:'パーカー（グリーン・M）', short:'パーカー（グリーン・M）', price:800, cat:'ファッション', icon:'Shirt',
    img:null, campus:'旭町キャンパス', dept:'創生学部', cond:'未使用に近い', ago:'9時間前', likes:7, views:54,
    desc:'1〜2回着用のみ。きれいな状態です。' },
  { id:'airpods', title:'ワイヤレスイヤホン', short:'ワイヤレスイヤホン', price:1500, cat:'パソコン・家電', icon:'Headphones',
    img:null, campus:'五十嵐キャンパス', dept:'理学部', cond:'目立った傷や汚れなし', ago:'10時間前', likes:9, views:88,
    desc:'動作確認済み。ケース・付属品あり。' },
  { id:'ball', title:'サッカーボール（5号球）', short:'サッカーボール（5号球）', price:600, cat:'スポーツ・趣味', icon:'Volleyball',
    img:null, campus:'旭町キャンパス', dept:'教育学部', cond:'やや傷や汚れあり', ago:'12時間前', likes:3, views:41,
    desc:'公式試合球。使用感はありますが問題なく使えます。' },
  { id:'linalg', title:'線形代数学入門', short:'線形代数学入門', price:1000, cat:'本・教科書', icon:'BookMarked',
    img:null, campus:'五十嵐キャンパス', dept:'工学部', cond:'目立った傷や汚れなし', ago:'13時間前', likes:5, views:60,
    desc:'マーカー跡少なめ。カバー付き。' },
];

const CATEGORIES = [
  { key:'すべて', icon:'LayoutGrid' },
  { key:'本・教科書', icon:'BookOpen' },
  { key:'パソコン・家電', icon:'Laptop' },
  { key:'家具・インテリア', icon:'Armchair' },
  { key:'ファッション', icon:'Shirt' },
  { key:'スポーツ・趣味', icon:'Volleyball' },
  { key:'その他', icon:'MoreHorizontal' },
];

const CHAT_THREADS = [
  { id:'taro', name:'新大 太郎', last:'はい、大丈夫です！', time:'10:45', unread:2, prod:'chair' },
  { id:'hanako', name:'花子', last:'ありがとうございます！', time:'昨日', unread:1, prod:'laptop' },
  { id:'sato', name:'佐藤 健', last:'了解しました！', time:'2日前', unread:0, prod:'book' },
  { id:'yuto', name:'ゆうと', last:'写真ありがとうございます！', time:'3日前', unread:0, prod:'desk' },
  { id:'ichiro', name:'新大 一郎', last:'ご検討よろしくお願いします。', time:'5日前', unread:0, prod:'tote' },
];

const CHAT_MESSAGES = [
  { from:'them', text:'はじめまして！\nこちらの商品はまだありますか？', time:'10:15' },
  { from:'me', text:'はじめまして！\nはい、まだあります！', time:'10:18', read:true },
  { from:'them', text:'購入を検討しているのですが、\n実物の写真を追加していただくことは\n可能でしょうか？', time:'10:20' },
  { from:'me', text:'もちろんです！\n以下に写真を追加しました。', time:'10:22', read:true, photos:true },
  { from:'them', text:'ありがとうございます！\nとてもきれいですね！\n購入させていただきたいです。', time:'10:30' },
  { from:'me', text:'ありがとうございます！\n受け渡し方法や日時について、\nご希望はありますか？', time:'10:32', read:true },
  { from:'them', text:'平日の夕方か、土日だと助かります！\nキャンパス内での受け渡し希望です。', time:'10:35' },
  { from:'me', text:'かしこまりました！\nそれでは、土曜日の13時頃はいかがでしょうか？\n正門付近での受け渡しを考えています。', time:'10:42', read:true },
  { from:'them', text:'はい、大丈夫です！', time:'10:45' },
];

const CAMPUS_SPOTS = {
  '五十嵐キャンパス':[
    { id:'main-gate', name:'正門前', desc:'バス停すぐ・分かりやすい', icon:'DoorOpen' },
    { id:'lib', name:'中央図書館前', desc:'静かで落ち着いた場所', icon:'Library' },
    { id:'cafe1', name:'第1食堂前', desc:'昼休みは混雑注意', icon:'UtensilsCrossed' },
    { id:'coop', name:'生協前', desc:'待ち合わせの定番', icon:'Store' },
    { id:'edu', name:'総合教育研究棟前', desc:'講義棟エリア', icon:'GraduationCap' },
    { id:'hall', name:'大学会館前', desc:'広場で目印になりやすい', icon:'Building2' },
  ],
  '旭町キャンパス':[
    { id:'a-lib', name:'図書館前', desc:'旭町の待ち合わせ定番', icon:'Library' },
    { id:'a-gate', name:'正門前', desc:'通りに面して分かりやすい', icon:'DoorOpen' },
    { id:'a-hosp', name:'医歯学総合病院前', desc:'バスロータリー付近', icon:'Building2' },
  ],
};

const NOTIFICATIONS = [
  { id:1, type:'message', icon:'MessageSquare', title:'新大 太郎さんからメッセージ', body:'はい、大丈夫です！', time:'10:45', unread:true },
  { id:2, type:'like', icon:'Heart', title:'あなたの商品にいいねがつきました', body:'「オフィスチェア（メッシュ・肘掛け付き）」', time:'9:20', unread:true },
  { id:3, type:'deal', icon:'Handshake', title:'取引が成立しました', body:'「MacBook Air 13インチ」の受け渡し日時が確定しました', time:'昨日', unread:false },
  { id:4, type:'star', icon:'Star', title:'新しい評価が届きました', body:'花子さんから「よかった」の評価', time:'2日前', unread:false },
  { id:5, type:'system', icon:'Sprout', title:'新大フリマからのお知らせ', body:'安心・安全にご利用いただくためのガイドを公開しました', time:'3日前', unread:false },
];

const yen = n => '¥' + n.toLocaleString('ja-JP');
const getProduct = id => PRODUCTS.find(p=>p.id===id);

Object.assign(window, { PRODUCTS, CATEGORIES, CHAT_THREADS, CHAT_MESSAGES, CAMPUS_SPOTS, NOTIFICATIONS, yen, getProduct });
