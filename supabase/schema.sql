-- =============================================================
-- 新大フリマ データベーススキーマ
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行してください。
-- =============================================================

-- ---------- profiles(ユーザープロフィール) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ---------- items(出品) ----------
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 100),
  category    text not null check (category in ('textbook', 'game')),
  description text not null default '',
  price       integer not null default 0 check (price >= 0), -- 0 = 無料で譲渡
  image_url   text,
  status      text not null default 'available'
              check (status in ('available', 'sold')),
  created_at  timestamptz not null default now()
);

create index if not exists items_created_at_idx on public.items (created_at desc);
create index if not exists items_category_idx on public.items (category);
create index if not exists items_user_idx on public.items (user_id);

-- ---------- chat_rooms(取引チャットルーム) ----------
create table if not exists public.chat_rooms (
  id         uuid primary key default gen_random_uuid(),
  item_id    uuid not null references public.items (id) on delete cascade,
  buyer_id   uuid not null references public.profiles (id) on delete cascade,
  seller_id  uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (item_id, buyer_id) -- 1つの出品につき購入希望者ごとに1ルーム
);

create index if not exists chat_rooms_buyer_idx on public.chat_rooms (buyer_id);
create index if not exists chat_rooms_seller_idx on public.chat_rooms (seller_id);

-- ---------- messages(チャットメッセージ) ----------
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references public.chat_rooms (id) on delete cascade,
  sender_id    uuid not null references public.profiles (id) on delete cascade,
  message_text text not null check (char_length(message_text) between 1 and 2000),
  created_at   timestamptz not null default now()
);

create index if not exists messages_room_idx on public.messages (room_id, created_at);

-- =============================================================
-- 新規ユーザー登録時に profiles を自動作成するトリガー
-- ここで新潟大学ドメイン以外のメールは登録を拒否する(サーバー側の最終防壁)。
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null
     or new.email not ilike '%@mail.cc.niigata-u.ac.jp' then
    raise exception '新潟大学のメールアドレス(@mail.cc.niigata-u.ac.jp)のみ登録できます。';
  end if;

  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles   enable row level security;
alter table public.items      enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.messages   enable row level security;

-- ----- profiles -----
drop policy if exists "profiles are viewable by authenticated users" on public.profiles;
create policy "profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated using (true);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
  on public.profiles for update
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ----- items -----
drop policy if exists "items are viewable by authenticated users" on public.items;
create policy "items are viewable by authenticated users"
  on public.items for select
  to authenticated using (true);

drop policy if exists "users can create own items" on public.items;
create policy "users can create own items"
  on public.items for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "users can update own items" on public.items;
create policy "users can update own items"
  on public.items for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can delete own items" on public.items;
create policy "users can delete own items"
  on public.items for delete
  to authenticated using (auth.uid() = user_id);

-- ----- chat_rooms -----
drop policy if exists "participants can view chat rooms" on public.chat_rooms;
create policy "participants can view chat rooms"
  on public.chat_rooms for select
  to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "buyer can create chat room" on public.chat_rooms;
create policy "buyer can create chat room"
  on public.chat_rooms for insert
  to authenticated with check (auth.uid() = buyer_id);

-- ----- messages -----
drop policy if exists "participants can view messages" on public.messages;
create policy "participants can view messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_rooms r
      where r.id = room_id
        and (r.buyer_id = auth.uid() or r.seller_id = auth.uid())
    )
  );

drop policy if exists "participants can send messages" on public.messages;
create policy "participants can send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.chat_rooms r
      where r.id = room_id
        and (r.buyer_id = auth.uid() or r.seller_id = auth.uid())
    )
  );

-- =============================================================
-- リアルタイム(チャット用)
-- =============================================================
alter publication supabase_realtime add table public.messages;

-- =============================================================
-- ストレージ: 出品画像バケット
-- ダッシュボードの Storage で「item-images」バケットを public で
-- 作成してもOK。下記 SQL でも作成できる。
-- =============================================================
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

drop policy if exists "item images are publicly readable" on storage.objects;
create policy "item images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'item-images');

drop policy if exists "authenticated users can upload item images" on storage.objects;
create policy "authenticated users can upload item images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'item-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users can delete own item images" on storage.objects;
create policy "users can delete own item images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'item-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
