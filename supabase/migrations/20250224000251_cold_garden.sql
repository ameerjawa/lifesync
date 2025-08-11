/*
  # Project Management Schema

  1. New Tables
    - `projects`
      - Core project information
      - Status tracking
      - Resource allocation
    - `project_members`
      - Team member assignments
      - Role tracking
    - `project_tasks`
      - Project-specific tasks
      - Dependencies and milestones
    - `project_resources`
      - Resource allocation tracking
      - Utilization metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for team-based access
*/

-- Create project status enum
CREATE TYPE project_status AS ENUM (
  'planning',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled'
);

-- Create project role enum
CREATE TYPE project_role AS ENUM (
  'owner',
  'manager',
  'member',
  'viewer'
);

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status project_status DEFAULT 'planning',
  start_date date,
  target_date date,
  actual_end_date date,
  budget numeric,
  actual_cost numeric DEFAULT 0,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  risk_level text CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'low',
  completion_percentage numeric DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  health_status text CHECK (health_status IN ('on_track', 'at_risk', 'delayed')) DEFAULT 'on_track',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project members table
CREATE TABLE project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role project_role DEFAULT 'member',
  allocation_percentage numeric DEFAULT 100 CHECK (allocation_percentage > 0 AND allocation_percentage <= 100),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create project tasks table
CREATE TABLE project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  assignee_id uuid REFERENCES profiles(id),
  status text CHECK (status IN ('todo', 'in_progress', 'completed', 'blocked')) DEFAULT 'todo',
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  estimated_hours numeric,
  actual_hours numeric DEFAULT 0,
  start_date date,
  due_date date,
  completed_at timestamptz,
  dependencies uuid[] DEFAULT '{}',
  is_milestone boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project resources table
CREATE TABLE project_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  quantity numeric DEFAULT 1,
  cost_per_unit numeric DEFAULT 0,
  total_cost numeric DEFAULT 0,
  start_date date,
  end_date date,
  utilization_percentage numeric DEFAULT 100 CHECK (utilization_percentage >= 0 AND utilization_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view projects they are members of"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Project owners can manage their projects"
  ON projects FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team members can view project members"
  ON project_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage team members"
  ON project_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view project tasks"
  ON project_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = project_tasks.project_id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can manage project tasks"
  ON project_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = project_tasks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('owner', 'manager', 'member')
    )
  );

CREATE POLICY "Team members can view project resources"
  ON project_resources FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = project_resources.project_id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners and managers can manage resources"
  ON project_resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = project_resources.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('owner', 'manager')
    )
  );

-- Create indexes
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_status_idx ON projects(status);
CREATE INDEX project_members_project_id_idx ON project_members(project_id);
CREATE INDEX project_members_user_id_idx ON project_members(user_id);
CREATE INDEX project_tasks_project_id_idx ON project_tasks(project_id);
CREATE INDEX project_tasks_assignee_id_idx ON project_tasks(assignee_id);
CREATE INDEX project_resources_project_id_idx ON project_resources(project_id);

-- Create trigger for updated_at
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_project_tasks_updated_at
  BEFORE UPDATE ON project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_project_resources_updated_at
  BEFORE UPDATE ON project_resources
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();