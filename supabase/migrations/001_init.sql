-- Run in Supabase SQL Editor or: supabase db push (after supabase link)
-- Enable Anonymous sign-ins: Authentication -> Providers -> Anonymous

create table if not exists public.workout_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  inserted_at timestamptz not null default now()
);

create table if not exists public.workout_session_exercises (
  id uuid primary key,
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  sort_order int not null
);

create table if not exists public.workout_set_entries (
  id uuid primary key,
  session_exercise_id uuid not null references public.workout_session_exercises (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  set_index int not null,
  weight numeric,
  reps int not null,
  kind text not null default 'working',
  completed_at timestamptz not null
);

alter table public.workout_sessions enable row level security;
alter table public.workout_session_exercises enable row level security;
alter table public.workout_set_entries enable row level security;

create policy "workout_sessions_own" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_session_exercises_own" on public.workout_session_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_set_entries_own" on public.workout_set_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists workout_sessions_user_idx on public.workout_sessions (user_id, started_at desc);
create index if not exists workout_session_exercises_session_idx on public.workout_session_exercises (session_id);
create index if not exists workout_set_entries_exercise_idx on public.workout_set_entries (session_exercise_id);
