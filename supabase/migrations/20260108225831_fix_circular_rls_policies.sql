/*
  # Fix Circular RLS Policy Dependencies

  1. Problem
    - projects SELECT policy checks project_members table
    - project_members policies check projects table
    - This creates infinite recursion

  2. Solution
    - Simplify projects policies to only check user_id
    - Simplify project_members policies to avoid circular references
    - Remove complex cross-table checks that cause recursion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Project owners can manage their projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they are members of" ON projects;
DROP POLICY IF EXISTS "Project owners can manage team members" ON project_members;
DROP POLICY IF EXISTS "Team members can view project members" ON project_members;

-- Projects policies (simple, no circular references)
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Project members policies (avoid recursion by using direct project ownership)
CREATE POLICY "Project owners can view members"
  ON project_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can add members"
  ON project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update members"
  ON project_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove members"
  ON project_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  );
