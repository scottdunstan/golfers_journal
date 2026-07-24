-- The Yardage Book — Supabase schema
-- Run this once in your project: Supabase dashboard → SQL Editor → New query → paste → Run.

-- One row per user holding the whole journal document.
create table if not exists public.journal_docs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  doc jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.journal_docs enable row level security;

create policy "Users manage their own journal"
  on public.journal_docs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Scrapbook images for the Great Shots reservoir (compressed JPEG data URLs).
create table if not exists public.shot_images (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  data text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.shot_images enable row level security;

create policy "Users manage their own shot images"
  on public.shot_images
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
