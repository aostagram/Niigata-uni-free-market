-- =============================================================
-- user_consents 追加マイグレーション
-- 既存DB（items/profiles/chat_rooms/messages は適用済み）に、
-- 同意証跡テーブル user_consents だけを追加する。
-- SupabaseのSQL Editorに貼り付けて Run。何度実行しても安全。
-- =============================================================

create table if not exists public.user_consents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  terms_version   text not null,
  privacy_version text not null,
  agreed_at       timestamptz not null default now(),
  unique (user_id, terms_version, privacy_version)
);

create index if not exists user_consents_user_idx on public.user_consents (user_id);

alter table public.user_consents enable row level security;

drop policy if exists "users can view own consents" on public.user_consents;
create policy "users can view own consents"
  on public.user_consents for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "users can record own consent" on public.user_consents;
create policy "users can record own consent"
  on public.user_consents for insert
  to authenticated with check (auth.uid() = user_id);
