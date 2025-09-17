-- business_profiles.sql

-- 1. Create table
create table if not exists business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_name text not null,
  industry text not null,
  description text,
  website text,
  phone text,
  email text,
  address text,
  logo_url text,
  staff_count int not null default 0,
  annual_revenue numeric,
  founded_date date,
  business_type text check (business_type in 
    ('sole_proprietorship', 'partnership', 'corporation', 'llc', 'nonprofit')
  ) not null,
  tax_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- 3. Enable Row Level Security
alter table business_profiles enable row level security;

-- 4. Policies (similar to "accounts")
-- INSERT: users can only insert their own records
create policy "Users can create own business_profiles"
on business_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

-- SELECT: users can view their own records
create policy "Users can view own business_profiles"
on business_profiles
for select
to authenticated
using (auth.uid() = user_id);

-- UPDATE: users can update their own records
create policy "Users can update own business_profiles"
on business_profiles
for update
to authenticated
using (auth.uid() = user_id);

-- DELETE: users can delete their own records
create policy "Users can delete own business_profiles"
on business_profiles
for delete
to authenticated
using (auth.uid() = user_id);


-- business_suite.sql

-- ============================================================
-- 3. Business Clients
-- ============================================================
create table if not exists business_clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  company text,
  address text,
  status text check (status in ('lead','prospect','active','inactive','churned')) not null,
  source text not null,
  lifetime_value numeric not null default 0,
  last_contact timestamptz,
  next_followup timestamptz,
  notes text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 1. Business Projects
-- ============================================================
create table if not exists business_projects (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  name text not null,
  description text,
  client_id uuid references business_clients(id) on delete set null,
  status text check (status in ('planning','active','on_hold','completed','cancelled')) not null,
  priority text check (priority in ('low','medium','high','urgent')) not null,
  start_date date,
  due_date date,
  completion_date date,
  budget numeric,
  actual_cost numeric not null default 0,
  progress int not null default 0,
  team_members text[] default '{}',
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 2. Business Tasks
-- ============================================================
create table if not exists business_tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  project_id uuid references business_projects(id) on delete set null,
  title text not null,
  description text,
  assignee_id uuid references auth.users(id) on delete set null,
  status text check (status in ('todo','in_progress','review','completed')) not null,
  priority text check (priority in ('low','medium','high','urgent')) not null,
  due_date date,
  estimated_hours numeric,
  actual_hours numeric not null default 0,
  billable boolean not null default false,
  hourly_rate numeric,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);



-- ============================================================
-- 4. Business Invoices
-- ============================================================
create table if not exists business_invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  client_id uuid references business_clients(id) on delete set null,
  project_id uuid references business_projects(id) on delete set null,
  invoice_number text not null unique,
  status text check (status in ('draft','sent','paid','overdue','cancelled')) not null,
  issue_date date not null,
  due_date date not null,
  subtotal numeric not null,
  tax_amount numeric not null default 0,
  total_amount numeric not null,
  paid_amount numeric not null default 0,
  currency text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references business_invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric not null,
  rate numeric not null,
  amount numeric not null
);

-- ============================================================
-- 5. Business Expenses
-- ============================================================
create table if not exists business_expenses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  category text not null,
  description text not null,
  amount numeric not null,
  date date not null,
  receipt_url text,
  tax_deductible boolean not null default false,
  vendor text,
  project_id uuid references business_projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 6. Business Automations
-- ============================================================
create table if not exists business_automations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  name text not null,
  type text check (type in ('invoice','reminder','followup','task','email')) not null,
  trigger_condition text not null,
  action_config jsonb not null,
  is_active boolean not null default true,
  last_run timestamptz,
  next_run timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 7. Business Team Members
-- ============================================================
create table if not exists business_team_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('owner','admin','manager','employee','contractor')) not null,
  permissions text[] default '{}',
  hourly_rate numeric,
  joined_at timestamptz not null default now()
);

-- ============================================================
-- 8. Business Documents (new)
-- ============================================================
create table if not exists business_documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business_profiles(id) on delete cascade not null,
  name text not null,
  description text,
  file_url text not null,
  file_type text,
  size bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Timestamps auto-update trigger
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach triggers to tables with updated_at
do $$
declare
  tbl text;
begin
  for tbl in 
    select unnest(array[
      'business_projects',
      'business_tasks',
      'business_clients',
      'business_invoices',
      'business_expenses',
      'business_automations'
    ])
  loop
    execute format('
      drop trigger if exists update_%1$I_updated_at on %1$I;
      create trigger update_%1$I_updated_at
      before update on %1$I
      for each row execute function update_updated_at_column();', tbl);
  end loop;
end$$;

-- ============================================================
-- RLS Policies (same as business_profiles)
-- ============================================================
alter table business_projects enable row level security;
alter table business_tasks enable row level security;
alter table business_clients enable row level security;
alter table business_invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table business_expenses enable row level security;
alter table business_automations enable row level security;
alter table business_team_members enable row level security;
alter table business_documents enable row level security;

-- Example policy (repeat for each table, adjusting id field)
create policy "Users can manage own business data"
on business_projects
for all
to authenticated
using (auth.uid() in (
  select user_id from business_profiles bp where bp.id = business_projects.business_id
))
with check (auth.uid() in (
  select user_id from business_profiles bp where bp.id = business_projects.business_id
));




