create extension if not exists "pgcrypto";

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_places (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint collection_places_collection_id_place_id_key unique (collection_id, place_id)
);

create index if not exists collections_user_id_created_at_idx
on public.collections (user_id, created_at desc);

create index if not exists collection_places_collection_id_created_at_idx
on public.collection_places (collection_id, created_at desc);

create index if not exists collection_places_place_id_idx
on public.collection_places (place_id);

alter table public.collections enable row level security;
alter table public.collection_places enable row level security;

drop policy if exists "Users can select own collections" on public.collections;
create policy "Users can select own collections"
on public.collections
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own collections" on public.collections;
create policy "Users can insert own collections"
on public.collections
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own collections" on public.collections;
create policy "Users can update own collections"
on public.collections
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own collections" on public.collections;
create policy "Users can delete own collections"
on public.collections
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can select places in own collections" on public.collection_places;
create policy "Users can select places in own collections"
on public.collection_places
for select
to authenticated
using (
  exists (
    select 1
    from public.collections
    where collections.id = collection_places.collection_id
      and collections.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert places into own collections" on public.collection_places;
create policy "Users can insert places into own collections"
on public.collection_places
for insert
to authenticated
with check (
  exists (
    select 1
    from public.collections
    where collections.id = collection_places.collection_id
      and collections.user_id = auth.uid()
  )
  and exists (
    select 1
    from public.places
    where places.id = collection_places.place_id
      and (
        places.is_public = true
        or places.user_id = auth.uid()
      )
  )
);

drop policy if exists "Users can delete places from own collections" on public.collection_places;
create policy "Users can delete places from own collections"
on public.collection_places
for delete
to authenticated
using (
  exists (
    select 1
    from public.collections
    where collections.id = collection_places.collection_id
      and collections.user_id = auth.uid()
  )
);

revoke all on public.collections from anon;
revoke all on public.collection_places from anon;
grant select, insert, update, delete on public.collections to authenticated;
grant select, insert, delete on public.collection_places to authenticated;
