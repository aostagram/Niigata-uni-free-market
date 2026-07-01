<<<<<<< HEAD
-- スプレッドシート在庫（stock_id）でもチャットルームを作れるように変更。
-- item_id を nullable にし、stock_id カラムを追加する。
-- Supabase SQL Editor に貼り付けて実行してください。

-- 1. stock_id カラム追加（スプレッドシートの在庫番号）
ALTER TABLE public.chat_rooms ADD COLUMN IF NOT EXISTS stock_id text;

-- 2. item_id の NOT NULL 制約を外す（stock_id だけのルームを許可）
ALTER TABLE public.chat_rooms ALTER COLUMN item_id DROP NOT NULL;

-- 3. 既存のユニーク制約を削除
ALTER TABLE public.chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_item_id_buyer_id_key;

-- 4. item_id ベースのルームは従来通りユニーク（item_id が NOT NULL の行のみ）
CREATE UNIQUE INDEX IF NOT EXISTS chat_rooms_item_buyer_uidx
  ON public.chat_rooms (item_id, buyer_id)
  WHERE item_id IS NOT NULL;

-- 5. stock_id ベースのルームもユニーク（stock_id が NOT NULL の行のみ）
CREATE UNIQUE INDEX IF NOT EXISTS chat_rooms_stock_buyer_uidx
  ON public.chat_rooms (stock_id, buyer_id)
  WHERE stock_id IS NOT NULL;

-- 6. stock_id の検索インデックス
CREATE INDEX IF NOT EXISTS chat_rooms_stock_idx ON public.chat_rooms (stock_id);
=======
-- =============================================================
-- 在庫(スプレッドシート)商品でも出品者と直接チャットできるようにする拡張
-- Supabase ダッシュボードの SQL Editor で実行してください。
--
-- 既存の chat_rooms は item_id(items テーブル)必須だが、在庫商品は items に
-- 存在しないため、stock_id(在庫番号)でも部屋を作れるようにする。
-- item_id を任意にし、stock_id+buyer で一意にする。
-- 出品者(seller_id)は profiles を参照するため、出品者がアカウント登録済みの
-- 場合のみチャットを開始できる(未登録ならアプリ側で購入フォームへ誘導)。
-- =============================================================

alter table public.chat_rooms add column if not exists stock_id text;

-- item_id を任意(NULL 許容)に。既に NULL 許容なら何もしない。
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'chat_rooms'
      and column_name = 'item_id' and is_nullable = 'NO'
  ) then
    alter table public.chat_rooms alter column item_id drop not null;
  end if;
end $$;

-- 在庫商品は item_id を持たないため、stock_id+buyer で1ルームに限定。
create unique index if not exists chat_rooms_stock_buyer_uidx
  on public.chat_rooms (stock_id, buyer_id)
  where stock_id is not null;

-- 既存の RLS ポリシー(buyer can create chat room / participants can view ...)は
-- buyer_id・seller_id ベースのため、stock_id ルームでもそのまま機能する。
>>>>>>> origin/main
