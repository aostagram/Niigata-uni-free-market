-- ============================================================
-- フォロー機能テーブル（メルカリ風フォロー）
-- ユーザー(follower) が 出品者(gmail) をフォローする。
-- 出品者はスプレッドシートの出品者gmailで識別するため email で持つ。
-- Supabase SQL Editor でこの全文を実行してください（冪等）。
-- ============================================================
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_email text not null,
  created_at timestamptz not null default now(),
  unique (follower_id, following_email)
);

create index if not exists follows_following_email_idx on public.follows (following_email);
create index if not exists follows_follower_id_idx on public.follows (follower_id);

alter table public.follows enable row level security;

-- 集計（フォロワー数・フォロー中数）は公開プロフィールでも使うため select は全員許可。
drop policy if exists "follows_select_all" on public.follows;
create policy "follows_select_all" on public.follows
  for select using (true);

-- 追加・削除は自分のフォローのみ。
drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own" on public.follows
  for insert with check (auth.uid() = follower_id);

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own" on public.follows
  for delete using (auth.uid() = follower_id);
