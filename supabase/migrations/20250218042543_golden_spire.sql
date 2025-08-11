/*
  # Fix task history tracking

  1. Changes
    - Drop existing task history trigger and function
    - Create new, properly functioning task history tracking
    - Add proper column access in trigger function
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS track_task_changes ON tasks;
DROP FUNCTION IF EXISTS track_task_history();

-- Create new function to track task history
CREATE OR REPLACE FUNCTION track_task_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Track title changes
  IF OLD.title IS DISTINCT FROM NEW.title THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'title', OLD.title::text, NEW.title::text);
  END IF;

  -- Track description changes
  IF OLD.description IS DISTINCT FROM NEW.description THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'description', OLD.description::text, NEW.description::text);
  END IF;

  -- Track status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'status', OLD.status::text, NEW.status::text);
  END IF;

  -- Track priority changes
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'priority', OLD.priority::text, NEW.priority::text);
  END IF;

  -- Track due_date changes
  IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'due_date', OLD.due_date::text, NEW.due_date::text);
  END IF;

  -- Track estimated_hours changes
  IF OLD.estimated_hours IS DISTINCT FROM NEW.estimated_hours THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'estimated_hours', OLD.estimated_hours::text, NEW.estimated_hours::text);
  END IF;

  -- Track actual_hours changes
  IF OLD.actual_hours IS DISTINCT FROM NEW.actual_hours THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'actual_hours', OLD.actual_hours::text, NEW.actual_hours::text);
  END IF;

  -- Track assignees changes
  IF OLD.assignees IS DISTINCT FROM NEW.assignees THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'assignees', OLD.assignees::text, NEW.assignees::text);
  END IF;

  -- Track labels changes
  IF OLD.labels IS DISTINCT FROM NEW.labels THEN
    INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'labels', OLD.labels::text, NEW.labels::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER track_task_changes
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION track_task_history();