-- Run this in the Supabase SQL Editor to create the settings record used by
-- the admin settings page and the public website.
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Browser access stays disabled. Next.js reads and writes this table on the
-- server with SUPABASE_SERVICE_ROLE_KEY.
alter table public.site_settings enable row level security;

insert into public.site_settings (id, data)
values (
  1,
  '{"companyName":"BuildVision","email":"hello@buildvision.cm","phone":"+237 6XX XXX XXX","location":"Buea, Cameroon","homeHeroImage":"","aboutImage":"","bannerImage":""}'::jsonb
)
on conflict (id) do nothing;
