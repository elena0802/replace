alter table public.collections
add column if not exists is_public boolean not null default false;

drop policy if exists "Public collections are selectable by everyone" on public.collections;
create policy "Public collections are selectable by everyone"
on public.collections
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Everyone can select places in public collections" on public.collection_places;
create policy "Everyone can select places in public collections"
on public.collection_places
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.collections
    where collections.id = collection_places.collection_id
      and collections.is_public = true
  )
);

grant select on public.collections to anon;
grant select on public.collection_places to anon;
