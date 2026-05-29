create extension if not exists "pgcrypto";

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
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
  naver_place_id text null,
  road_address text null,
  map_url text null,
  latitude double precision null,
  longitude double precision null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.places
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.places
add column if not exists naver_place_id text null;

alter table public.places
add column if not exists road_address text null;

alter table public.places
add column if not exists map_url text null;

alter table public.places
add column if not exists latitude double precision null;

alter table public.places
add column if not exists longitude double precision null;

create index if not exists places_user_id_created_at_idx
on public.places (user_id, created_at desc);

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

-- 공개 장소는 로그인 여부와 관계없이 둘러보기/상세에서 조회할 수 있다.
drop policy if exists "Public places are selectable by everyone" on public.places;
create policy "Public places are selectable by everyone"
on public.places
for select
to anon, authenticated
using (is_public = true);

-- 로그인한 사용자는 본인이 작성한 공개/비공개 장소를 모두 조회할 수 있다.
drop policy if exists "Anon can select all places during MVP testing" on public.places;
drop policy if exists "Users can select own places" on public.places;
create policy "Users can select own places"
on public.places
for select
to authenticated
using (auth.uid() = user_id);

-- 로그인한 사용자는 본인 user_id로만 장소를 생성할 수 있다.
drop policy if exists "Anon can insert places during MVP testing" on public.places;
drop policy if exists "Users can insert own places" on public.places;
create policy "Users can insert own places"
on public.places
for insert
to authenticated
with check (auth.uid() = user_id);

-- 로그인한 사용자는 본인이 작성한 장소만 수정할 수 있다.
drop policy if exists "Anon can update places during MVP testing" on public.places;
drop policy if exists "Users can update own places" on public.places;
create policy "Users can update own places"
on public.places
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 로그인한 사용자는 본인이 작성한 장소만 삭제할 수 있다.
drop policy if exists "Anon can delete places during MVP testing" on public.places;
drop policy if exists "Users can delete own places" on public.places;
create policy "Users can delete own places"
on public.places
for delete
to authenticated
using (auth.uid() = user_id);

revoke insert, update, delete on public.places from anon;
grant select on public.places to anon;
grant select, insert, update, delete on public.places to authenticated;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id text unique not null,
  payment_key text null,
  amount integer not null,
  status text not null default 'pending',
  plan text not null default 'premium',
  created_at timestamptz not null default now(),
  approved_at timestamptz null
);

create index if not exists payments_user_id_created_at_idx
on public.payments (user_id, created_at desc);

alter table public.payments enable row level security;

-- 결제 기록은 본인 row만 조회할 수 있고, 생성/수정은 서버 API가 service role로만 수행한다.
drop policy if exists "Users can select own payments" on public.payments;
create policy "Users can select own payments"
on public.payments
for select
to authenticated
using (auth.uid() = user_id);

revoke all on public.payments from anon;
revoke insert, update, delete on public.payments from authenticated;
grant select on public.payments to authenticated;

-- Storage bucket setup:
-- Supabase Dashboard > Storage에서 place-images public bucket을 먼저 생성한다.
-- 로그인한 사용자는 places/{user_id}/... 경로에만 대표 이미지를 업로드할 수 있다.
drop policy if exists "Users can upload own place images" on storage.objects;
create policy "Users can upload own place images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'place-images'
  and split_part(name, '/', 1) = 'places'
  and split_part(name, '/', 2) = auth.uid()::text
);
