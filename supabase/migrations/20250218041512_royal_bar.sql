/*
  # Fix profile policies and add indexes

  1. Changes
    - Add missing INSERT policy for profiles
    - Add indexes for better query performance
    - Update existing policies for better security
  
  2. Security
    - Ensure users can only access their own profiles
    - Add proper row-level security policies
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Update profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create comprehensive policies
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);