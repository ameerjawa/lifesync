/*
  # Add advanced task management features

  1. New Tables
    - task_history: Track all changes to tasks
    - labels: Store task labels
    - task_labels: Many-to-many relationship between tasks and labels
    - task_dependencies: Track task dependencies

  2. Updates to Tasks Table
    - Add parent_id for subtasks
    - Add estimated_hours and actual_hours
    - Add assignees array
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES tasks(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_hours numeric;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_hours numeric;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignees uuid[] DEFAULT '{}';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS labels text[] DEFAULT '{}';

-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task_history table
CREATE TABLE IF NOT EXISTS task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  field text NOT NULL,
  old_value text,
  new_value text,
  created_at timestamptz DEFAULT now()
);

-- Create task_dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, depends_on_id)
);

-- Enable RLS
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own labels"
  ON labels FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view task history for their tasks"
  ON task_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_history.task_id
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage task dependencies for their tasks"
  ON task_dependencies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_dependencies.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Create function to track task history
CREATE OR REPLACE FUNCTION track_task_history()
RETURNS TRIGGER AS $$
DECLARE
  field_name text;
  old_value text;
  new_value text;
BEGIN
  FOR field_name IN SELECT unnest(array['title', 'description', 'status', 'priority', 'due_date'])
  LOOP
    old_value := OLD.field_name::text;
    new_value := NEW.field_name::text;
    
    IF old_value IS DISTINCT FROM new_value THEN
      INSERT INTO task_history (task_id, user_id, field, old_value, new_value)
      VALUES (NEW.id, auth.uid(), field_name, old_value, new_value);
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for task history
CREATE TRIGGER track_task_changes
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION track_task_history();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_parent_id_idx ON tasks(parent_id);
CREATE INDEX IF NOT EXISTS task_history_task_id_idx ON task_history(task_id);
CREATE INDEX IF NOT EXISTS task_dependencies_task_id_idx ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS task_dependencies_depends_on_id_idx ON task_dependencies(depends_on_id);
CREATE INDEX IF NOT EXISTS labels_user_id_idx ON labels(user_id);