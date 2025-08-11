-- Drop existing functions first
DROP FUNCTION IF EXISTS start_trial(text);
DROP FUNCTION IF EXISTS check_trial_status(text);
DROP FUNCTION IF EXISTS end_trial(text);

-- Add trial-related columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_end timestamptz,
ADD COLUMN IF NOT EXISTS trial_started_at timestamptz;

-- Create index for trial_end
CREATE INDEX IF NOT EXISTS profiles_trial_end_idx ON profiles(trial_end);

-- Create function to start trial
CREATE OR REPLACE FUNCTION start_trial(user_email text)
RETURNS profiles AS $$
DECLARE
  profile_record profiles;
BEGIN
  UPDATE profiles
  SET 
    trial_started_at = now(),
    trial_end = now() + interval '7 days'
  WHERE email = user_email
  RETURNING * INTO profile_record;

  RETURN profile_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check trial status
CREATE OR REPLACE FUNCTION check_trial_status(user_email text)
RETURNS boolean AS $$
DECLARE
  trial_end_date timestamptz;
BEGIN
  SELECT trial_end INTO trial_end_date
  FROM profiles
  WHERE email = user_email;

  RETURN trial_end_date > now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to end trial
CREATE OR REPLACE FUNCTION end_trial(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET trial_end = now()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;