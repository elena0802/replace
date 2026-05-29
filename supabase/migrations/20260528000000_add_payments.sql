create extension if not exists "pgcrypto";

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

drop policy if exists "Users can select own payments" on public.payments;
create policy "Users can select own payments"
on public.payments
for select
to authenticated
using (auth.uid() = user_id);

revoke all on public.payments from anon;
revoke insert, update, delete on public.payments from authenticated;
grant select on public.payments to authenticated;
