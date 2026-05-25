create extension if not exists "pgcrypto";

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  region text not null,
  memory text not null,
  visited_date date null,
  companion text null,
  revisit_level text not null default '좋았어요',
  space_tags text[] not null default '{}',
  is_public boolean not null default true,
  image_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists places_updated_at on public.places;

create trigger places_updated_at
before update on public.places
for each row
execute function public.update_updated_at_column();

alter table public.places enable row level security;

-- MVP test policy:
-- 로그인 도입 후 user_id 컬럼과 사용자별 RLS 정책으로 교체해야 한다.
drop policy if exists "Public places are selectable by everyone" on public.places;
create policy "Public places are selectable by everyone"
on public.places
for select
to anon, authenticated
using (is_public = true);

-- MVP test policy:
-- 로그인 도입 후 user_id 컬럼과 사용자별 RLS 정책으로 교체해야 한다.
-- 현재는 /my-places에서 로그인 없이 공개/비공개 테스트 데이터를 모두 확인하기 위한 임시 정책이다.
drop policy if exists "Anon can select all places during MVP testing" on public.places;
create policy "Anon can select all places during MVP testing"
on public.places
for select
to anon, authenticated
using (true);

-- MVP test policy:
-- 로그인 도입 후 user_id 컬럼과 사용자별 RLS 정책으로 교체해야 한다.
drop policy if exists "Anon can insert places during MVP testing" on public.places;
create policy "Anon can insert places during MVP testing"
on public.places
for insert
to anon, authenticated
with check (true);

grant select, insert on public.places to anon;
grant select, insert, update, delete on public.places to authenticated;
