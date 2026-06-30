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