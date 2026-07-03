-- =============================================================
-- 単発データ修正: 「ニューエクスプレス ラテン語」の出品者を ゆうじ に付け替える
--
-- 背景:
--   items テーブルの当該行の user_id が、本来の出品者「ゆうじ」ではなく
--   「がたお」のプロフィールIDを指しているため、商品ページの出品者表示が
--   がたおになってしまっている。表示ロジック(items_user_id_fkey 経由の
--   profiles 参照)は正しいので、修正すべきはこの1行の user_id のみ。
--
-- 使い方:
--   Supabase ダッシュボード → SQL Editor に貼り付けて実行する。
--   (SQL Editor は service role で動くため RLS を回避して更新できる)
--   まず STEP 1 で対象と両ユーザーを目視確認してから STEP 2 を実行すること。
-- =============================================================

-- ---------- STEP 1: 現状確認(先にこれだけ実行して中身を目で見る) ----------
-- 対象商品と、いまの出品者名を確認
select i.id, i.title, i.user_id, p.full_name as current_seller, i.created_at
from public.items i
join public.profiles p on p.id = i.user_id
where i.title ilike '%ニューエクスプレス%'
   or i.title ilike '%ラテン%';

-- 「ゆうじ」候補のプロフィール(付け替え先)を確認
select id, full_name, created_at
from public.profiles
where full_name ilike '%ゆうじ%';

-- ---------- STEP 2: 付け替え(STEP 1 で ID/名前を確認できたら実行) ----------
-- 安全のためトランザクションで実行し、更新後に確認してから commit する。
-- 万一「ゆうじ」や対象商品が一意に定まらない場合は 0 件 or 例外で止まる。
begin;

with target_item as (
  select id
  from public.items
  where title ilike '%ニューエクスプレス%ラテン%'
     or (title ilike '%ラテン%' and title ilike '%ニューエクスプレス%')
), yuji as (
  select id
  from public.profiles
  where full_name ilike '%ゆうじ%'
)
update public.items i
set user_id = (select id from yuji)
where i.id = (select id from target_item)
  and (select count(*) from yuji) = 1        -- ゆうじが一意に定まる時だけ
  and (select count(*) from target_item) = 1 -- 対象商品が一意に定まる時だけ
returning i.id, i.title, i.user_id;

-- チャットルームが既にある場合は seller_id も揃えておく(なければ 0 件)。
update public.chat_rooms r
set seller_id = i.user_id
from public.items i
where r.item_id = i.id
  and (i.title ilike '%ニューエクスプレス%ラテン%'
       or (i.title ilike '%ラテン%' and i.title ilike '%ニューエクスプレス%'))
  and r.seller_id <> i.user_id;

-- 付け替え後の確認: current_seller が「ゆうじ」になっていれば OK。
select i.id, i.title, p.full_name as current_seller
from public.items i
join public.profiles p on p.id = i.user_id
where i.title ilike '%ニューエクスプレス%'
   or i.title ilike '%ラテン%';

-- 結果が正しければ commit、おかしければ rollback に書き換えて実行。
commit;
