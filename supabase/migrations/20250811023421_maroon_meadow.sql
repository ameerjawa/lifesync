/*
  # Fix profiles table RLS policies

  1. Security
    - Update RLS policies to allow proper user registration and profile access
    - Allow authenticated users to insert their own profile during signup
    - Allow authenticated users to read and update their own profile data
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create comprehensive RLS policies for profiles table
CREATE POLICY "Users can insert own profile during signup"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public access for trial users (if needed)
CREATE POLICY "Trial users can access their profile"
  ON profiles
  FOR ALL
  TO public
  USING (email = ((current_setting('request.jwt.claims'::text))::json ->> 'email'::text))
  WITH CHECK (email = ((current_setting('request.jwt.claims'::text))::json ->> 'email'::text));