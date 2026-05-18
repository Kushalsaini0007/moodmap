-- Add AI-generated insight column (run in Supabase SQL Editor after initial entries setup)

alter table public.entries
  add column if not exists ai_insight text;

comment on column public.entries.ai_insight is 'Short reflective insight generated from mood + journal when the user saves.';
