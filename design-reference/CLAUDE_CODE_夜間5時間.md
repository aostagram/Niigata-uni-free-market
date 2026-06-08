# Claude Code 夜間5時間 — デザイン完成プロンプト

**使い方**: 下の「━━━ ここからコピペ ━━━」〜「━━━ ここまで ━━━」を Claude Code の新規チャットに貼る。  
リポジトリを codebase 添付するか、`design-reference/` フォルダごと渡す。

---

## オーナーが寝る前に30秒だけ

1. Claude Code を開く
2. 下のプロンプト全文を貼る
3. `design-reference/assets/` と `デザインイメージ素材/` を添付（またはリポジトリ全体）
4. 「開始して。5時間かかっても止まらず最後までやって」と送る

---

━━━ **ここからコピペ** ━━━

```
あなたは一流のフロントエンドエンジニア兼UIデザイナーです。
オーナーは5時間寝ます。この間、**止まらず**デザイン実装を最後まで進めてください。
質問で止まらない。判断に迷ったらモックアップ画像を正として進める。

## プロジェクト
新潟大学専用フリマ「新大フリマ」（Niigata univ. Free Market）

## ゴール（今夜の成果物）
`design-reference/新大フリマ.html` を開くだけで、**全画面がモックアップに近い見た目**で動くSPAプロトタイプ。
その後 `src/` への移植は別フェーズ。今夜は **design-reference/** を完成させる。

## 正（Source of Truth）

### 素材スプライト（切り出して使う）
- `design-reference/assets/index_sheet1.png`（#001〜#099 バッジ・アイコン・ボタン・ロゴ）
- `design-reference/assets/index_sheet2.png`（水彩・装飾・追加アイコン）
- 同ファイルが `デザインイメージ素材/index_sheet1.png` `index_sheet2.png` にもある

### 完成見本（各画面の正解デザイン）
| 画面 | 参照PNG（design-reference/assets/ または デザインイメージ素材/） |
|------|------------------------------------------------------------------|
| トップ/ホーム | `top.png` / `本番top画像.png` |
| ログイン | `login.png` / `ログイン画面.png` |
| 商品検索一覧 | `search.png` |
| 商品詳細 | `detail.png` |
| チャット | `chat.png` / `チャット画面.png` |
| マイページ | `mypage.png` / `マイページ.png` |
| 出品した商品 | `mylistings.png` / `自分の出品商品.png` |
| 通知 | `notifications.png` / `通知画面.png` |
| 出品フォーム | `sell.png` / `出品画面.png` |
| 取引完了・評価 | `rating.png` / `取引完了評価.png` |
| 商品サムネ | `prod_book.png` `prod_chair.png` `prod_laptop.png` `prod_desk.png` `prod_tote.png` |
| キャンパス | `campus.png` |

### デザイントークン（変更しない）
- `design-reference/app.css` / `styles.css` / `tailwind.config.js`
- `src/app/globals.css` の brand 色（`#0b7a4b` 系）と同期
- 水彩ユーティリティ `.wc-bleed` `.wc-wash`（styles.css）

## 現状（壊れている・未完了）

| 問題 | 対応 |
|------|------|
| `home.html` が空 | 削除 or `新大フリマ.html` へリダイレクト用1行HTML |
| 画面がモックと乖離 | 各 `screen_*.jsx` を見本PNGに合わせて全面調整 |
| index_sheet の素材未使用 | `icons.jsx` または CSS sprite で #007出品中 #010取引中 等を使う |
| サイドバー付きデスクトップUI | マイページ・通知・出品一覧は **左サイドバー+メイン** レイアウト（見本どおり） |
| スマホ下部タブ | `ui.jsx` の TabBar を全画面で統一 |

## 実装ファイル構成（触る場所）

```
design-reference/
├── 新大フリマ.html          # エントリ（変更不要ならそのまま）
├── main.jsx                 # ルーティング
├── ui.jsx                   # Logo, Header, TabBar, 共通部品
├── icons.jsx                # Lucide + スプライト素材
├── app.css                  # デザインシステム
├── data.js                  # ダミーデータ
├── screen_login.jsx
├── screen_home.jsx          # トップ（ヒーロー+新着+学部グリッド）
├── screen_search.jsx        # 商品を探す（サイドバー絞り込み+3列グリッド）
├── screen_detail.jsx        # 商品詳細
├── screen_chat.jsx          # チャット（左リスト+右会話）
├── screen_contract.jsx      # 受け渡し場所選択
├── screen_rating.jsx        # 取引完了・評価
├── screen_mypage.jsx        # マイページ（サイドバー+統計+出品グリッド）
├── screen_sell.jsx          # 出品フォーム（3ステップ見出し）
└── assets/                  # PNG素材
```

## 全タスク一覧（今夜やること — 全部）

### Phase 0: 準備（30分）
- [ ] T0-1: 全モックアップPNGを開き、画面ごとに差分メモ（`design-reference/MOCKUP_GAP.md` に簡潔に）
- [ ] T0-2: `index_sheet1.png` から使うスプライト座標表を `design-reference/SPRITE_MAP.md` に作成（出品中/取引中/売却済み/ロゴ/バッジ）
- [ ] T0-3: `ui.jsx` に `StatusBadge`, `SidebarLayout`, `PageShell` を追加（マイページ系で共用）

### Phase 1: 共通コンポーネント（45分）
- [ ] T1-1: Logo を見本どおり（丸+袋+葉、`index_sheet` #006 参照）
- [ ] T1-2: AppHeader — 通知ベル+赤バッジ、「+出品する」/「マイページ」切替
- [ ] T1-3: TabBar — 5タブ（ホーム/商品を探す/チャット/お気に入り/マイページ）、アクティブは緑ピル背景
- [ ] T1-4: StatusBadge — 出品中(緑)/取引中(青)/売却済(灰)/予約済 をスプライト or CSS再現
- [ ] T1-5: 水彩背景 — ページ上下のにじみ（index_sheet2 + CSS）

### Phase 2: 画面別実装（各45〜60分）

#### ログイン `screen_login.jsx`
- [ ] T2-1: 見本 `login.png` ピクセル寄せ（葉っぱ飾り、Googleログインボタン、同意2チェック、無効ボタン）
- [ ] T2-2: チェック2つでログインボタン有効化 → `nav('home')`

#### トップ `screen_home.jsx`
- [ ] T2-3: ヒーロー `campus.png` + コピー「新大生だけの、安心・即手に入るフリマ」
- [ ] T2-4: CTA「出品する」「商品を探す」
- [ ] T2-5: キャンパス pill（五十嵐/旭町）、学部アイコングリッド
- [ ] T2-6: 3ステップ（探す→チャット→手渡し）
- [ ] T2-7: 新着商品カード6枚（`prod_*.png`、ハート、価格）
- [ ] T2-8: フッターCTA + リンク

#### 商品検索 `screen_search.jsx`
- [ ] T2-9: 見本 `search.png` — 左フィルター（カテゴリ/学部/並び替え/価格帯）
- [ ] T2-10: 右3列グリッド、FAB「出品する」、ページネーション
- [ ] T2-11: 商品カード — バッジ・キャンパス・学部・時間

#### 商品詳細 `screen_detail.jsx`
- [ ] T2-12: 見本 `detail.png` — ギャラリー、出品者カード、受け渡し・取引方法
- [ ] T2-13: 固定フッター「出品者に連絡する」「お気に入り」

#### チャット `screen_chat.jsx`
- [ ] T2-14: 見本 `chat.png` — 左メッセージ一覧、右会話
- [ ] T2-15: 商品ヘッダー、吹き出し色、画像3枚、取引確定ボタン→contract

#### 受け渡し `screen_contract.jsx`
- [ ] T2-16: 新大のスポット選択（中央図書館前、第1食堂前、五十嵐/旭町）
- [ ] T2-17: 日時選択 → rating へ

#### 評価 `screen_rating.jsx`
- [ ] T2-18: 見本 `rating.png` — 3ステップ、よかった/問題あり、コメント、完了ボタン

#### マイページ `screen_mypage.jsx`
- [ ] T2-19: 見本 `mypage.png` — **SidebarLayout**（左メニュー+時計塔イラスト）
- [ ] T2-20: プロフィール、認証バッジ、統計4つ、出品グリッド4枚、取引中カード

#### 出品一覧 `screen_mylistings`（main.jsx にルートあり — ファイルなければ作成）
- [ ] T2-21: 見本 `mylistings.png` — タブ（すべて/出品中/取引中/売却済み）
- [ ] T2-22: 商品行+操作ボタン（編集/価格変更/削除）

#### 通知 `screen_notifications`（同上）
- [ ] T2-23: 見本 `notifications.png` — フィルタタブ、通知カード一覧

#### 出品 `screen_sell.jsx`
- [ ] T2-24: 見本 `sell.png` — 3ステップ、写真10枠、状態ラジオ、フォーム

### Phase 3: 仕上げ（30分）
- [ ] T3-1: 全画面遷移テスト（login→home→search→detail→chat→contract→rating）
- [ ] T3-2: `home.html` 修復（`新大フリマ.html` への meta refresh または同等）
- [ ] T3-3: `design-reference/README.md` にプレビュー手順追記
- [ ] T3-4: 完了報告 `design-reference/OVERNIGHT_REPORT.md`（やったこと/未完了/明日やること）

## 技術制約
- React 18 + Babel standalone（`新大フリマ.html` の構成を維持）
- アイコン: Lucide（`icons.jsx`）+ 必要ならスプライトPNG
- **触らない**: `scripts/nextextbook/`（GAS）、Supabase 本番ロジック、`src/` は今夜触らない（移植は別PR）
- **コミット**: 意味のある単位でコミット可（メッセージ日本語OK）。push はしない

## 受け入れ基準（朝チェック）
1. ブラウザで `design-reference/新大フリマ.html` を開ける（ローカルサーバー or file://）
2. ログイン→ホーム→検索→詳細→チャット→契約→評価 がクリックで遷移する
3. 各画面が添付モックアップの **レイアウト・色・余白** に概ね一致（80%以上）
4. `index_sheet1` のステータスバッジが商品カードに表示される
5. `OVERNIGHT_REPORT.md` がある

## 作業方針
- 1画面ずつ「見本PNGを横に見ながら」実装→次へ。止まらない
- 完璧より **全画面を一通りモック寄せ** を優先
- 5時間で終わらなければ OVERNIGHT_REPORT に残タスクを書いて終了

開始してください。最初に Phase 0 から着手し、進捗をこまめにコミットしてください。
```

━━━ **ここまでコピペ** ━━━

---

## 朝の確認チェックリスト（オーナー用）

- [ ] `design-reference/新大フリマ.html` をブラウザで開いた
- [ ] ログイン画面が見本に近い
- [ ] ホーム・検索・詳細・チャット・マイページが見本に近い
- [ ] `design-reference/OVERNIGHT_REPORT.md` を読んだ
- [ ] git log で今夜のコミットを確認した

## プレビューの開き方

```bash
cd "/Users/lelele/Desktop/素人がアプリ開発/niigata-uni free market/design-reference"
python3 -m http.server 8765
```

ブラウザ: http://localhost:8765/新大フリマ.html
