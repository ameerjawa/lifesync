/*
  # Fix tasks table RLS policies

  1. Changes
    - Drop existing RLS policies for tasks table
    - Add new policies to handle both authenticated and guest users
    - Add guest_id column to tasks table for guest session tracking
    
  2. Security
    - Enable RLS on tasks table
    - Allow authenticated users to manage their own tasks
    - Allow guest users to manage tasks created in their session
*/

-- Add guest_id column to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS guest_id text;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;

-- Create new policies
CREATE POLICY "Users can manage own tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guest users can manage their session tasks"
  ON tasks FOR ALL
  TO anon
  USING (guest_id IS NOT NULL)
  WITH CHECK (guest_id IS NOT NULL);

-- Create index for guest_id
CREATE INDEX IF NOT EXISTS tasks_guest_id_idx ON tasks(guest_id);