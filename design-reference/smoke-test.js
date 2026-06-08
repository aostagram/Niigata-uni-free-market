/*
 * 新大フリマ プロトタイプ スモークテスト
 *
 * 各 screen_*.jsx は実体が React.createElement のみ（JSX構文なし）なので、
 * React を軽量スタブして「全画面が例外なく render を返すか」を Node で検証できる。
 * ブラウザを開けない環境でも、編集後の回帰（未定義参照・誤った関数呼び出し等）を機械的に検出する。
 *
 * 使い方:
 *   cd design-reference && node smoke-test.js
 * 期待出力: 「全12画面 render OK」/ 失敗時は画面名とエラーを表示し exit 1。
 */
const fs = require('fs');
const path = require('path');
const dir = __dirname;

// 読み込み順（HTML の <script> 順に合わせる）
const order = [
  'data.js', 'icons.jsx', 'ui.jsx',
  'screen_login.jsx', 'screen_home.jsx', 'screen_search.jsx', 'screen_detail.jsx',
  'screen_chat.jsx', 'screen_contract.jsx', 'screen_rating.jsx', 'screen_mypage.jsx', 'screen_sell.jsx',
];
const src = order.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');

// React / DOM の軽量スタブ（関数コンポーネントは呼び出さず、ツリーだけ組み立てる）
const React = {
  Fragment: 'Fragment',
  createElement: function (type, props) {
    return { type: type, props: props || {}, children: Array.prototype.slice.call(arguments, 2) };
  },
  useState: function (init) { return [typeof init === 'function' ? init() : init, function () {}]; },
  useEffect: function () {},
  useRef: function (v) { return { current: v }; },
};
const ReactDOM = { createRoot: function () { return { render: function () {} }; } };
const localStorage = { getItem: function () { return null; }, setItem: function () {} };
const window = { lucide: { icons: {} } };

const screens = [
  ['LoginScreen', { nav() {} }],
  ['HomeScreen', { nav() {} }],
  ['SearchScreen', { nav() {}, initialCat: 'すべて' }],
  ['DetailScreen', { nav() {}, productId: 'chair' }],
  ['ChatScreen', { nav() {}, partner: 'taro', prod: 'chair' }],
  ['ContractScreen', { nav() {}, prod: 'chair', partner: 'taro' }],
  ['RatingScreen', { nav() {}, prod: 'chair' }],
  ['MyPageScreen', { nav() {} }],
  ['MyListingsScreen', { nav() {} }],
  ['FavoritesScreen', { nav() {} }],
  ['SellScreen', { nav() {} }],
  ['NotificationsScreen', { nav() {} }],
];

let exported;
try {
  const harness = src + '\n;return { ' + screens.map(s => s[0]).join(', ') + ' };';
  exported = new Function('React', 'ReactDOM', 'window', 'localStorage', harness)(React, ReactDOM, window, localStorage);
} catch (e) {
  console.error('LOAD ERROR:', (e && e.stack) || e);
  process.exit(2);
}

let fails = 0;
screens.forEach(function (s) {
  const fn = exported[s[0]];
  if (typeof fn !== 'function') { console.log('MISSING  ' + s[0]); fails++; return; }
  try {
    const tree = fn(s[1]);
    if (!tree || !tree.type) { console.log('NORENDER ' + s[0]); fails++; }
    else console.log('OK       ' + s[0]);
  } catch (e) {
    console.log('RENDER ERROR ' + s[0] + ': ' + ((e && e.message) || e));
    fails++;
  }
});
console.log(fails ? ('\n' + fails + ' 件失敗') : '\n全12画面 render OK');
process.exit(fails ? 1 : 0);
