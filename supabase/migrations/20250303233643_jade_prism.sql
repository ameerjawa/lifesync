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
  -- First check if profile exists
  SELECT * INTO profile_record
  FROM profiles
  WHERE email = user_email;

  -- If profile doesn't exist, create it
  IF profile_record IS NULL THEN
    INSERT INTO profiles (
      id,
      email,
      full_name,
      trial_started_at,
      trial_end
    ) VALUES (
      gen_random_uuid(),
      user_email,
      'Trial User',
      now(),
      now() + interval '7 days'
    ) RETURNING * INTO profile_record;
  ELSE
    -- Update existing profile with trial dates
    UPDATE profiles
    SET 
      trial_started_at = now(),
      trial_end = now() + interval '7 days'
    WHERE email = user_email
    RETURNING * INTO profile_record;
  END IF;

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

  -- Return false if no profile found or trial_end is null
  IF trial_end_date IS NULL THEN
    RETURN false;
  END IF;

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

-- Create policy to allow trial users to access their profile
CREATE POLICY "Trial users can access their profile"
  ON profiles FOR ALL
  USING (email = current_setting('request.jwt.claims')::json->>'email');