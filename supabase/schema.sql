-- Run this in Supabase SQL Editor to create the tables used by src/app/api.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  appointment_date date,
  appointment_time text,
  project_type text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Keep browser access disabled; the Next.js API uses the service role on the server.
alter table public.projects enable row level security;
alter table public.appointments enable row level security;
alter table public.messages enable row level security;
