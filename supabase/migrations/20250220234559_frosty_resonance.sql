/*
  # Fix tasks table RLS policies and guest access

  1. Changes
    - Drop existing RLS policies for tasks table
    - Add new policies to handle both authenticated and guest users
    - Add guest_id column to tasks table
    - Add public access for guest users
    
  2. Security
    - Enable RLS on tasks table
    - Allow authenticated users to manage their own tasks
    - Allow guest users to manage tasks with their guest_id
    - Ensure proper isolation between guest sessions
*/

-- Add guest_id column if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS guest_id text;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
DROP POLICY IF EXISTS "Guest users can manage their session tasks" ON tasks;

-- Create comprehensive policies
CREATE POLICY "Users can manage own tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guest users can manage their session tasks"
  ON tasks FOR ALL
  TO public
  USING (guest_id = coalesce(current_setting('app.guest_id', true), ''))
  WITH CHECK (guest_id = coalesce(current_setting('app.guest_id', true), ''));

-- Create index for guest_id
CREATE INDEX IF NOT EXISTS tasks_guest_id_idx ON tasks(guest_id);

-- Create function to set guest context
CREATE OR REPLACE FUNCTION set_guest_context(guest_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.guest_id', guest_id, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;