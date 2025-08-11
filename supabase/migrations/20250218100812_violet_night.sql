/*
  # Add Finance Management Tables

  1. New Tables
    - `accounts`
      - Bank accounts, credit cards, investment accounts
      - Balance tracking and account types
      - Connection status for bank integrations

    - `transactions`
      - Income and expenses
      - Categories and subcategories
      - Recurring transaction tracking
      - Split transaction support

    - `budgets`
      - Monthly/yearly budget targets
      - Category-based budget allocation
      - Rollover settings

    - `savings_goals`
      - Target amount and deadline
      - Progress tracking
      - Auto-save rules

    - `investments`
      - Portfolio tracking
      - Asset allocation
      - Performance history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create enum types
CREATE TYPE account_type AS ENUM (
  'checking',
  'savings',
  'credit',
  'investment',
  'loan',
  'wallet'
);

CREATE TYPE transaction_type AS ENUM (
  'income',
  'expense',
  'transfer'
);

CREATE TYPE transaction_status AS ENUM (
  'pending',
  'completed',
  'cancelled'
);

CREATE TYPE budget_period AS ENUM (
  'monthly',
  'yearly'
);

CREATE TYPE investment_type AS ENUM (
  'stock',
  'bond',
  'crypto',
  'etf',
  'mutual_fund',
  'real_estate'
);

-- Create accounts table
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type account_type NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  institution text,
  account_number text,
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type transaction_type NOT NULL,
  icon text,
  color text,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id),
  type transaction_type NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  status transaction_status DEFAULT 'completed',
  is_recurring boolean DEFAULT false,
  recurring_rule jsonb,
  location text,
  notes text,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create split_transactions table
CREATE TABLE split_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id),
  amount numeric NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id),
  period budget_period NOT NULL,
  amount numeric NOT NULL,
  start_date date NOT NULL,
  end_date date,
  rollover boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create savings_goals table
CREATE TABLE savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric DEFAULT 0,
  start_date date NOT NULL,
  target_date date NOT NULL,
  account_id uuid REFERENCES accounts(id),
  auto_save_rule jsonb,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create investments table
CREATE TABLE investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES accounts(id),
  type investment_type NOT NULL,
  symbol text,
  name text NOT NULL,
  quantity numeric NOT NULL,
  purchase_price numeric NOT NULL,
  current_price numeric NOT NULL,
  purchase_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create investment_transactions table
CREATE TABLE investment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id uuid REFERENCES investments(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  quantity numeric NOT NULL,
  price numeric NOT NULL,
  date date NOT NULL,
  fees numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own accounts"
  ON accounts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own categories"
  ON categories FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own split transactions"
  ON split_transactions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = split_transactions.transaction_id
    AND transactions.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own budgets"
  ON budgets FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own savings goals"
  ON savings_goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own investments"
  ON investments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own investment transactions"
  ON investment_transactions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM investments
    WHERE investments.id = investment_transactions.investment_id
    AND investments.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX accounts_user_id_idx ON accounts(user_id);
CREATE INDEX categories_user_id_idx ON categories(user_id);
CREATE INDEX categories_parent_id_idx ON categories(parent_id);
CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX transactions_account_id_idx ON transactions(account_id);
CREATE INDEX transactions_category_id_idx ON transactions(category_id);
CREATE INDEX transactions_date_idx ON transactions(date);
CREATE INDEX split_transactions_transaction_id_idx ON split_transactions(transaction_id);
CREATE INDEX budgets_user_id_idx ON budgets(user_id);
CREATE INDEX budgets_category_id_idx ON budgets(category_id);
CREATE INDEX savings_goals_user_id_idx ON savings_goals(user_id);
CREATE INDEX investments_user_id_idx ON investments(user_id);
CREATE INDEX investments_account_id_idx ON investments(account_id);
CREATE INDEX investment_transactions_investment_id_idx ON investment_transactions(investment_id);

-- Create function to update account balance
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'income' THEN
      UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.type = 'income' THEN
      UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
    
    IF NEW.type = 'income' THEN
      UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type = 'income' THEN
      UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for account balance updates
CREATE TRIGGER update_account_balance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_balance();

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_savings_goals_updated_at
  BEFORE UPDATE ON savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();