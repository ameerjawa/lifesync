/*
  # Complete Business Suite Tables

  1. New Tables
    - `business_profiles` - Main business entity (supports multiple per user)
    - `business_clients` - Client management
    - `business_projects` - Project tracking
    - `business_tasks` - Task management within projects
    - `business_invoices` - Invoice management
    - `invoice_line_items` - Invoice line items
    - `business_expenses` - Expense tracking
    - `business_automations` - Automation rules
    - `business_team_members` - Team member management
    - `business_documents` - Document storage

  2. Security
    - Enable RLS on all tables
    - Users can manage businesses they own
    - Team members can access business data based on their business_id
*/

-- Business Profiles (main table - multiple per user allowed)
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  industry text NOT NULL,
  description text,
  website text,
  phone text,
  email text,
  address text,
  logo_url text,
  staff_count int NOT NULL DEFAULT 0,
  annual_revenue numeric,
  founded_date date,
  business_type text CHECK (business_type IN 
    ('sole_proprietorship', 'partnership', 'corporation', 'llc', 'nonprofit')
  ) NOT NULL,
  tax_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Clients
CREATE TABLE IF NOT EXISTS business_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  address text,
  status text CHECK (status IN ('lead','prospect','active','inactive','churned')) NOT NULL,
  source text NOT NULL,
  lifetime_value numeric NOT NULL DEFAULT 0,
  last_contact timestamptz,
  next_followup timestamptz,
  notes text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Projects
CREATE TABLE IF NOT EXISTS business_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  client_id uuid REFERENCES business_clients(id) ON DELETE SET NULL,
  status text CHECK (status IN ('planning','active','on_hold','completed','cancelled')) NOT NULL,
  priority text CHECK (priority IN ('low','medium','high','urgent')) NOT NULL,
  start_date date,
  due_date date,
  completion_date date,
  budget numeric,
  actual_cost numeric NOT NULL DEFAULT 0,
  progress int NOT NULL DEFAULT 0,
  team_members text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Tasks
CREATE TABLE IF NOT EXISTS business_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES business_projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text CHECK (status IN ('todo','in_progress','review','completed')) NOT NULL,
  priority text CHECK (priority IN ('low','medium','high','urgent')) NOT NULL,
  due_date date,
  estimated_hours numeric,
  actual_hours numeric NOT NULL DEFAULT 0,
  billable boolean NOT NULL DEFAULT false,
  hourly_rate numeric,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Invoices
CREATE TABLE IF NOT EXISTS business_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES business_clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES business_projects(id) ON DELETE SET NULL,
  invoice_number text NOT NULL UNIQUE,
  status text CHECK (status IN ('draft','sent','paid','overdue','cancelled')) NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  subtotal numeric NOT NULL,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL,
  paid_amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES business_invoices(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL,
  rate numeric NOT NULL,
  amount numeric NOT NULL
);

-- Business Expenses
CREATE TABLE IF NOT EXISTS business_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL,
  receipt_url text,
  tax_deductible boolean NOT NULL DEFAULT false,
  vendor text,
  project_id uuid REFERENCES business_projects(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Automations
CREATE TABLE IF NOT EXISTS business_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('invoice','reminder','followup','task','email')) NOT NULL,
  trigger_condition text NOT NULL,
  action_config jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_run timestamptz,
  next_run timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Team Members
CREATE TABLE IF NOT EXISTS business_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('owner','admin','manager','employee','contractor')) NOT NULL,
  permissions text[] DEFAULT '{}',
  hourly_rate numeric,
  joined_at timestamptz NOT NULL DEFAULT now()
);

-- Business Documents
CREATE TABLE IF NOT EXISTS business_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  size bigint,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to tables with updated_at
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'business_profiles',
      'business_projects',
      'business_tasks',
      'business_clients',
      'business_invoices',
      'business_expenses',
      'business_automations'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%1$I_updated_at ON %1$I;
      CREATE TRIGGER update_%1$I_updated_at
      BEFORE UPDATE ON %1$I
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', tbl);
  END LOOP;
END$$;

-- Enable RLS on all tables
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_profiles
DROP POLICY IF EXISTS "Users can create own business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can view own business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can update own business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can delete own business_profiles" ON business_profiles;

CREATE POLICY "Users can create own business_profiles"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own business_profiles"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own business_profiles"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business_profiles"
  ON business_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for all business data (projects, tasks, clients, etc.)
DROP POLICY IF EXISTS "Users can manage own business data" ON business_projects;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_tasks;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_clients;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_invoices;
DROP POLICY IF EXISTS "Users can manage own business data" ON invoice_line_items;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_expenses;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_automations;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_team_members;
DROP POLICY IF EXISTS "Users can manage own business data" ON business_documents;

CREATE POLICY "Users can manage own business data"
  ON business_projects FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_projects.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_projects.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_tasks FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_tasks.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_tasks.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_clients FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_clients.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_clients.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_invoices FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_invoices.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_invoices.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON invoice_line_items FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles bp
    JOIN business_invoices bi ON bp.id = bi.business_id
    WHERE bi.id = invoice_line_items.invoice_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles bp
    JOIN business_invoices bi ON bp.id = bi.business_id
    WHERE bi.id = invoice_line_items.invoice_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_expenses FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_expenses.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_expenses.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_automations FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_automations.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_automations.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_team_members FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_team_members.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_team_members.business_id
  ));

CREATE POLICY "Users can manage own business data"
  ON business_documents FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_documents.business_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM business_profiles WHERE id = business_documents.business_id
  ));