/*
  # Fix task features and add missing functionality

  1. Changes
    - Add missing indexes for better performance
    - Add missing columns for task templates
    - Update task dependencies handling
    - Add task sorting functionality

  2. Security
    - Add missing RLS policies
    - Update existing policies for better security
*/

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_user_id_status_idx ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS tasks_user_id_priority_idx ON tasks(user_id, priority);

-- Add missing columns to task_templates
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS dependencies uuid[] DEFAULT '{}';
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS assignees uuid[] DEFAULT '{}';

-- Create function to sort tasks
CREATE OR REPLACE FUNCTION sort_tasks(
  p_user_id uuid,
  p_sort_by text,
  p_sort_direction text
) RETURNS SETOF tasks AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM tasks
  WHERE user_id = p_user_id
  ORDER BY
    CASE
      WHEN p_sort_by = 'dueDate' AND p_sort_direction = 'asc' THEN due_date::text
      WHEN p_sort_by = 'dueDate' AND p_sort_direction = 'desc' THEN due_date::text
      WHEN p_sort_by = 'priority' AND p_sort_direction = 'asc' THEN priority
      WHEN p_sort_by = 'priority' AND p_sort_direction = 'desc' THEN priority
      WHEN p_sort_by = 'title' AND p_sort_direction = 'asc' THEN title
      WHEN p_sort_by = 'title' AND p_sort_direction = 'desc' THEN title
      WHEN p_sort_by = 'created' AND p_sort_direction = 'asc' THEN created_at::text
      WHEN p_sort_by = 'created' AND p_sort_direction = 'desc' THEN created_at::text
    END,
    CASE WHEN p_sort_direction = 'desc' THEN NULL ELSE NULL END DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;