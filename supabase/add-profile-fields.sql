alter table public.profiles add column if not exists nickname text;
alter table public.profiles add column if not exists grade text;
alter table public.profiles add column if not exists faculty text;
alter table public.profiles add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null or new.email not ilike '%@mail.cc.niigata-u.ac.jp' then
    raise exception '新潟大学のメールアドレス(@mail.cc.niigata-u.ac.jp)のみ登録できます。';
  end if;
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;
