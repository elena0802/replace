create extension if not exists "pgcrypto";

create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_places_user_id_place_id_key unique (user_id, place_id)
);

create index if not exists saved_places_user_id_created_at_idx
on public.saved_places (user_id, created_at desc);

alter table public.saved_places enable row level security;

drop policy if exists "Users can select own saved places" on public.saved_places;
create policy "Users can select own saved places"
on public.saved_places
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own public saved places" on public.saved_places;
create policy "Users can insert own public saved places"
on public.saved_places
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.places
    where places.id = saved_places.place_id
      and places.is_public = true
  )
);

drop policy if exists "Users can delete own saved places" on public.saved_places;
create policy "Users can delete own saved places"
on public.saved_places
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.saved_places from anon;
revoke update on public.saved_places from authenticated;
grant select, insert, delete on public.saved_places to authenticated;
