/*
  # Fix Project Tasks and Resources RLS Policies

  1. Issues
    - WITH CHECK clauses are null for ALL policies
    - Should use direct project ownership checks instead of project_members
    
  2. Changes
    - Add proper WITH CHECK clauses
    - Simplify to use projects.user_id instead of project_members
    - Separate policies by operation type for clarity
*/

-- Project Tasks Policies
DROP POLICY IF EXISTS "Team members can manage project tasks" ON project_tasks;
DROP POLICY IF EXISTS "Team members can view project tasks" ON project_tasks;

CREATE POLICY "Users can view tasks in their projects"
  ON project_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in their projects"
  ON project_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in their projects"
  ON project_tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in their projects"
  ON project_tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Project Resources Policies
DROP POLICY IF EXISTS "Project owners and managers can manage resources" ON project_resources;
DROP POLICY IF EXISTS "Team members can view project resources" ON project_resources;

CREATE POLICY "Users can view resources in their projects"
  ON project_resources FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_resources.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create resources in their projects"
  ON project_resources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_resources.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update resources in their projects"
  ON project_resources FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_resources.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_resources.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete resources in their projects"
  ON project_resources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_resources.project_id
      AND projects.user_id = auth.uid()
    )
  );
