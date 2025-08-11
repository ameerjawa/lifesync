-- Drop existing functions first
DROP FUNCTION IF EXISTS start_trial(text);
DROP FUNCTION IF EXISTS check_trial_status(text);
DROP FUNCTION IF EXISTS end_trial(text);

-- Create trial_users table to track trials separately
CREATE TABLE IF NOT EXISTS trial_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  trial_started_at timestamptz DEFAULT now(),
  trial_end_date timestamptz NOT NULL,
  setup_progress integer DEFAULT 0,
  setup_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trial_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can create trial users"
  ON trial_users FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own trial"
  ON trial_users FOR SELECT
  TO public
  USING (email = current_setting('request.jwt.claims')::json->>'email');

-- Create function to start trial
CREATE OR REPLACE FUNCTION start_trial(user_email text)
RETURNS trial_users AS $$
DECLARE
  trial_record trial_users;
BEGIN
  -- Check if user already has a trial
  SELECT * INTO trial_record
  FROM trial_users
  WHERE email = user_email;

  IF trial_record IS NOT NULL THEN
    RAISE EXCEPTION 'Trial already exists for this email';
  END IF;

  -- Create new trial
  INSERT INTO trial_users (
    email,
    trial_started_at,
    trial_end_date
  ) VALUES (
    user_email,
    now(),
    now() + interval '7 days'
  ) RETURNING * INTO trial_record;

  RETURN trial_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check trial status
CREATE OR REPLACE FUNCTION check_trial_status(user_email text)
RETURNS boolean AS $$
DECLARE
  trial_record trial_users;
BEGIN
  SELECT * INTO trial_record
  FROM trial_users
  WHERE email = user_email;

  IF trial_record IS NULL THEN
    RETURN false;
  END IF;

  RETURN trial_record.trial_end_date > now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to end trial
CREATE OR REPLACE FUNCTION end_trial(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE trial_users
  SET trial_end_date = now()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes
CREATE INDEX IF NOT EXISTS trial_users_email_idx ON trial_users(email);
CREATE INDEX IF NOT EXISTS trial_users_trial_end_date_idx ON trial_users(trial_end_date);

-- Create trigger for updated_at
CREATE TRIGGER set_trial_users_updated_at
  BEFORE UPDATE ON trial_users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();