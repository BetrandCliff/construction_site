-- Run this in Supabase SQL Editor to create the tables used by src/app/api.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Project document',
  file_url text not null,
  file_size text,
  created_at timestamptz not null default now()
);
insert into public.site_settings (id, data) values (1, '{"companyName":"BuildVision","email":"hello@buildvision.cm","phone":"+237 6XX XXX XXX","location":"Buea, Cameroon"}') on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict (id) do update set public = excluded.public;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 104857600, array['image/jpeg','image/png','image/webp','image/avif','image/gif','model/gltf-binary','model/gltf+json','application/octet-stream','application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

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
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
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
alter table public.designs enable row level security;
alter table public.site_settings enable row level security;
alter table public.documents enable row level security;
alter table public.appointments enable row level security;
alter table public.messages enable row level security;

-- These are safe to run again when upgrading an existing installation.
alter table public.appointments add column if not exists status text not null default 'Pending';
