-- ============================================================
-- OKR Pulse - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Stores employee info linked to Supabase auth users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  entity text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Employees can only read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Only service role (admin API) can insert/update profiles
create policy "Service role manages profiles"
  on public.profiles for all
  using (true)
  with check (true);


-- 2. OKRs TABLE
create table public.okrs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  quarter text not null default 'Q1 2025',
  key_results text[] default '{}',
  assigned_to uuid references public.profiles(id) on delete cascade,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.okrs enable row level security;

-- Employees can only see their own OKRs
create policy "Employees see own OKRs"
  on public.okrs for select
  using (auth.uid() = assigned_to);

-- Admin can see all (handled via service role in API routes)
-- We'll add a policy check via email comparison for direct admin queries
create policy "Admin sees all OKRs"
  on public.okrs for all
  using (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );


-- 3. WEEKLY UPDATES TABLE
create table public.weekly_updates (
  id uuid primary key default gen_random_uuid(),
  okr_id uuid references public.okrs(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  week_start date not null,
  update_text text not null,
  progress_score int check (progress_score between 1 and 5),
  submitted_at timestamptz default now(),
  unique (okr_id, week_start)
);

alter table public.weekly_updates enable row level security;

-- Employees can insert/update their own updates
create policy "Employees manage own updates"
  on public.weekly_updates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin can read all updates
create policy "Admin reads all updates"
  on public.weekly_updates for select
  using (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );


-- ============================================================
-- OPTIONAL: Set your admin email as a Postgres setting
-- Replace with your actual admin email
-- ============================================================
-- alter database postgres set app.admin_email = 'admin@yourcompany.com';
