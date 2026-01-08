/*
  # Fix project_members RLS policies for INSERT

  1. Issue
    - The existing "Project owners can manage team members" policy has WITH CHECK as null
    - This prevents proper INSERT operations
  
  2. Fix
    - Add explicit WITH CHECK clause to the ALL policy
    - Ensure project owners can add members to their projects
*/

DROP POLICY IF EXISTS "Project owners can manage team members" ON project_members;

CREATE POLICY "Project owners can manage team members"
  ON project_members FOR ALL
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
