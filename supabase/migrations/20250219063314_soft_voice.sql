/*
  # Fix Account Creation and RLS Policies

  1. Changes
    - Add comprehensive RLS policies for accounts table
    - Add validation function for account creation
    - Add function to safely update account balance
  
  2. Security
    - Enable RLS on accounts table
    - Add policies for account management
    - Add security definer functions for balance updates
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own accounts" ON accounts;

-- Create comprehensive policies
CREATE POLICY "Users can view own accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
  ON accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to validate account creation
CREATE OR REPLACE FUNCTION validate_account(
  p_name text,
  p_type account_type,
  p_balance numeric,
  p_currency text
) RETURNS boolean AS $$
BEGIN
  -- Validate name
  IF length(p_name) < 1 OR length(p_name) > 100 THEN
    RAISE EXCEPTION 'Account name must be between 1 and 100 characters';
  END IF;

  -- Validate currency
  IF NOT p_currency ~ '^[A-Z]{3}$' THEN
    RAISE EXCEPTION 'Invalid currency code';
  END IF;

  -- Validate balance based on account type
  CASE p_type
    WHEN 'credit' THEN
      IF p_balance > 0 THEN
        RAISE EXCEPTION 'Credit account balance must be negative or zero';
      END IF;
    WHEN 'loan' THEN
      IF p_balance > 0 THEN
        RAISE EXCEPTION 'Loan account balance must be negative or zero';
      END IF;
    ELSE
      IF p_balance < 0 THEN
        RAISE EXCEPTION 'Account balance cannot be negative for this account type';
      END IF;
  END CASE;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Create function to safely create account
CREATE OR REPLACE FUNCTION create_account(
  p_name text,
  p_type account_type,
  p_balance numeric,
  p_currency text DEFAULT 'USD',
  p_institution text DEFAULT NULL,
  p_account_number text DEFAULT NULL
) RETURNS accounts AS $$
DECLARE
  v_account accounts;
BEGIN
  -- Validate the account
  PERFORM validate_account(p_name, p_type, p_balance, p_currency);

  -- Create the account
  INSERT INTO accounts (
    user_id,
    name,
    type,
    balance,
    currency,
    institution,
    account_number,
    is_active
  ) VALUES (
    auth.uid(),
    p_name,
    p_type,
    p_balance,
    p_currency,
    p_institution,
    p_account_number,
    true
  ) RETURNING * INTO v_account;

  RETURN v_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to safely update account balance
CREATE OR REPLACE FUNCTION update_account_balance(
  p_account_id uuid,
  p_amount numeric
) RETURNS void AS $$
BEGIN
  -- Verify account belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM accounts
    WHERE id = p_account_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Account not found or access denied';
  END IF;

  -- Update the balance
  UPDATE accounts
  SET 
    balance = balance + p_amount,
    updated_at = now()
  WHERE id = p_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;