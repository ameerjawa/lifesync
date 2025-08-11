// Add these types to the existing types.ts file
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string;
  target_date: string;
  actual_end_date?: string;
  budget?: number;
  actual_cost: number;
  priority: 'low' | 'medium' | 'high';
  risk_level: 'low' | 'medium' | 'high';
  completion_percentage: number;
  health_status: 'on_track' | 'at_risk' | 'delayed';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'member' | 'viewer';
  allocation_percentage: number;
  joined_at: string;
  profile?: Profile;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  assignee_id?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  actual_hours: number;
  start_date?: string;
  due_date?: string;
  completed_at?: string;
  dependencies: string[];
  is_milestone: boolean;
  created_at: string;
  updated_at: string;
  assignee?: Profile;
}

export interface ProjectResource {
  id: string;
  project_id: string;
  name: string;
  type: string;
  quantity: number;
  cost_per_unit: number;
  total_cost: number;
  start_date?: string;
  end_date?: string;
  utilization_percentage: number;
  created_at: string;
  updated_at: string;
}