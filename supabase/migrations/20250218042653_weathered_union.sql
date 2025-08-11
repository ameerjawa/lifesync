/*
  # Enhance task management system

  1. New Tables
    - task_templates
      - Pre-defined task templates for quick task creation
    - recurring_tasks
      - Configuration for recurring task patterns
    - task_comments
      - Comments and discussions on tasks
    - task_attachments
      - File attachments metadata for tasks
  
  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user access
*/

-- Create task templates table
CREATE TABLE task_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  estimated_hours numeric,
  labels text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recurring tasks table
CREATE TABLE recurring_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  interval_count integer DEFAULT 1,
  days_of_week text[] DEFAULT '{}',
  start_date date NOT NULL,
  end_date date,
  last_generated timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task comments table
CREATE TABLE task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES task_comments(id),
  mentions uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task attachments table
CREATE TABLE task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for task templates
CREATE POLICY "Users can manage own task templates"
  ON task_templates FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for recurring tasks
CREATE POLICY "Users can manage recurring tasks for their tasks"
  ON recurring_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = recurring_tasks.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Create policies for task comments
CREATE POLICY "Users can manage own comments"
  ON task_comments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Create policies for task attachments
CREATE POLICY "Users can manage own attachments"
  ON task_attachments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_attachments.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX task_templates_user_id_idx ON task_templates(user_id);
CREATE INDEX recurring_tasks_task_id_idx ON recurring_tasks(task_id);
CREATE INDEX task_comments_task_id_idx ON task_comments(task_id);
CREATE INDEX task_comments_parent_id_idx ON task_comments(parent_id);
CREATE INDEX task_attachments_task_id_idx ON task_attachments(task_id);

-- Add function to handle recurring tasks
CREATE OR REPLACE FUNCTION generate_recurring_tasks()
RETURNS void AS $$
DECLARE
  rec RECORD;
  next_date DATE;
  new_task_id uuid;
BEGIN
  FOR rec IN
    SELECT r.*, t.*
    FROM recurring_tasks r
    JOIN tasks t ON t.id = r.task_id
    WHERE (r.last_generated IS NULL OR r.last_generated < now() - INTERVAL '1 day')
    AND (r.end_date IS NULL OR r.end_date >= CURRENT_DATE)
  LOOP
    -- Calculate next occurrence
    next_date := CASE rec.frequency
      WHEN 'daily' THEN CURRENT_DATE + (rec.interval_count || ' days')::INTERVAL
      WHEN 'weekly' THEN CURRENT_DATE + (rec.interval_count || ' weeks')::INTERVAL
      WHEN 'monthly' THEN CURRENT_DATE + (rec.interval_count || ' months')::INTERVAL
      WHEN 'yearly' THEN CURRENT_DATE + (rec.interval_count || ' years')::INTERVAL
    END;

    -- Skip if not matching days of week
    IF rec.frequency = 'weekly' AND 
       array_length(rec.days_of_week, 1) > 0 AND 
       NOT (EXTRACT(DOW FROM next_date)::text = ANY(rec.days_of_week)) THEN
      CONTINUE;
    END IF;

    -- Create new task
    INSERT INTO tasks (
      user_id,
      title,
      description,
      due_date,
      priority,
      status,
      estimated_hours,
      labels
    ) VALUES (
      rec.user_id,
      rec.title,
      rec.description,
      next_date + COALESCE(rec.due_date::time, '00:00:00'::time),
      rec.priority,
      'todo',
      rec.estimated_hours,
      rec.labels
    ) RETURNING id INTO new_task_id;

    -- Update last generated timestamp
    UPDATE recurring_tasks
    SET last_generated = now()
    WHERE id = rec.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_task_templates_updated_at
  BEFORE UPDATE ON task_templates
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_recurring_tasks_updated_at
  BEFORE UPDATE ON recurring_tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();