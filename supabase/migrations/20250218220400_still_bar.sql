/*
  # Trial and Subscription System

  1. New Tables
    - trial_users
      - Tracks users in trial period
      - Stores trial start/end dates
      - Tracks setup progress
    
  2. Functions
    - check_trial_status
    - update_trial_progress
    
  3. Triggers
    - Auto-expire trials
    - Track trial progress
*/

-- Create trial_users table
CREATE TABLE trial_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  trial_start_date timestamptz NOT NULL DEFAULT now(),
  trial_end_date timestamptz NOT NULL,
  setup_progress integer DEFAULT 0,
  setup_completed boolean DEFAULT false,
  task_created boolean DEFAULT false,
  budget_created boolean DEFAULT false,
  health_goal_created boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trial_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own trial data"
  ON trial_users FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update own trial data"
  ON trial_users FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- Create function to check trial status
CREATE OR REPLACE FUNCTION check_trial_status(user_email text)
RETURNS boolean AS $$
DECLARE
  trial_record trial_users%ROWTYPE;
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

-- Create function to update trial progress
CREATE OR REPLACE FUNCTION update_trial_progress()
RETURNS trigger AS $$
BEGIN
  -- Calculate progress (each step is worth 33.33%)
  NEW.setup_progress := (
    (CASE WHEN NEW.task_created THEN 1 ELSE 0 END) +
    (CASE WHEN NEW.budget_created THEN 1 ELSE 0 END) +
    (CASE WHEN NEW.health_goal_created THEN 1 ELSE 0 END)
  ) * 33.33;

  -- Check if all steps are completed
  NEW.setup_completed := 
    NEW.task_created AND 
    NEW.budget_created AND 
    NEW.health_goal_created;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trial progress
CREATE TRIGGER update_trial_progress_trigger
  BEFORE UPDATE ON trial_users
  FOR EACH ROW
  EXECUTE FUNCTION update_trial_progress();

-- Create function to start trial
CREATE OR REPLACE FUNCTION start_trial(user_email text)
RETURNS trial_users AS $$
DECLARE
  trial_record trial_users%ROWTYPE;
BEGIN
  -- Check if user already has a trial
  SELECT * INTO trial_record
  FROM trial_users
  WHERE email = user_email;

  IF trial_record IS NOT NULL THEN
    RAISE EXCEPTION 'User already has a trial';
  END IF;

  -- Create new trial
  INSERT INTO trial_users (
    email,
    trial_start_date,
    trial_end_date
  ) VALUES (
    user_email,
    now(),
    now() + interval '7 days'
  ) RETURNING * INTO trial_record;

  RETURN trial_record;
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

-- Add indexes
CREATE INDEX trial_users_email_idx ON trial_users(email);
CREATE INDEX trial_users_trial_end_date_idx ON trial_users(trial_end_date);