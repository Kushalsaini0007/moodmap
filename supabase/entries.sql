-- Run this in Supabase: SQL Editor → New query → Paste → Run
-- Creates `public.entries` with RLS so users only see and insert their own rows.

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mood text not null,
  journal_text text not null default '',
  created_at timestamptz not null default now(),
  constraint entries_mood_check check (
    mood in ('happy', 'neutral', 'sad', 'anxious', 'productive')
  )
);

comment on table public.entries is 'MoodMap user journal rows; one row per save from the dashboard.';

create index if not exists entries_user_created_idx
  on public.entries (user_id, created_at desc);

alter table public.entries enable row level security;

create policy "entries_select_own"
  on public.entries
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "entries_insert_own"
  on public.entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "entries_update_own"
  on public.entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "entries_delete_own"
  on public.entries
  for delete
  to authenticated
  using (auth.uid() = user_id);
