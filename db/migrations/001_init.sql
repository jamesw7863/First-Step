create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  school text not null default 'UCF',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  major text not null,
  graduation_year int not null,
  internship_types text[] not null default '{}',
  keywords text[] not null default '{}',
  locations text[] not null default '{}',
  work_style text not null check (work_style in ('remote', 'hybrid', 'onsite', 'any')) default 'any',
  updated_at timestamptz not null default now()
);

create table if not exists sources (
  id text primary key,
  name text not null,
  kind text not null,
  url text not null,
  active boolean not null default true,
  last_checked_at timestamptz
);

create table if not exists internships (
  id bigserial primary key,
  source_id text not null references sources(id),
  title text not null,
  company text not null,
  location text not null,
  work_style text not null check (work_style in ('remote', 'hybrid', 'onsite', 'any')) default 'any',
  posted_date date,
  discovered_at timestamptz not null default now(),
  apply_url text not null,
  description_snippet text not null default '',
  category_tags text[] not null default '{}',
  hash_key text not null unique
);

create table if not exists matches (
  id bigserial primary key,
  internship_id bigint not null references internships(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  match_score numeric not null,
  matched_at timestamptz not null default now(),
  unique (internship_id, user_id)
);

create table if not exists digests (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  send_date date not null,
  internship_ids bigint[] not null default '{}',
  sent_at timestamptz not null default now(),
  status text not null check (status in ('sent', 'failed')),
  provider_message text
);

create index if not exists internships_discovered_at_idx on internships(discovered_at desc);
create index if not exists internships_hash_idx on internships(hash_key);
create index if not exists matches_user_idx on matches(user_id, matched_at desc);
create index if not exists digests_user_idx on digests(user_id, send_date desc);

alter table users enable row level security;
alter table profiles enable row level security;
alter table internships enable row level security;
alter table matches enable row level security;
alter table digests enable row level security;

create policy "service role full access users" on users
for all to service_role
using (true)
with check (true);

create policy "service role full access profiles" on profiles
for all to service_role
using (true)
with check (true);

create policy "service role full access internships" on internships
for all to service_role
using (true)
with check (true);

create policy "service role full access matches" on matches
for all to service_role
using (true)
with check (true);

create policy "service role full access digests" on digests
for all to service_role
using (true)
with check (true);
