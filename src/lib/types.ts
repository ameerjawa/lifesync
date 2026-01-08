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

// Business Suite Types
export interface BusinessProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string;
  staff_count: number;
  annual_revenue?: number;
  founded_date?: string;
  business_type: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'nonprofit';
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessProject {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  client_id?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  budget?: number;
  actual_cost: number;
  progress: number;
  team_members: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BusinessTask {
  id: string;
  business_id: string;
  project_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  estimated_hours?: number;
  actual_hours: number;
  billable: boolean;
  hourly_rate?: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BusinessClient {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  status: 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
  source: string;
  lifetime_value: number;
  last_contact?: string;
  next_followup?: string;
  notes?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BusinessInvoice {
  id: string;
  business_id: string;
  client_id?: string;
  project_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  currency: string;
  notes?: string;
  line_items: InvoiceLineItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface BusinessExpense {
  id: string;
  business_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt_url?: string;
  tax_deductible: boolean;
  vendor?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessAutomation {
  id: string;
  business_id: string;
  name: string;
  type: 'invoice' | 'reminder' | 'followup' | 'task' | 'email';
  trigger_condition: string;
  action_config: Record<string, any>;
  is_active: boolean;
  last_run?: string;
  next_run?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessTeamMember {
  id: string;
  business_id: string;
  user_id: string | null;
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'contractor';
  permissions: string[];
  hourly_rate?: number;
  joined_at: string;
  profile?: Profile;
}

export interface BusinessAnalytics {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  clients: {
    total: number;
    active: number;
    new_this_month: number;
  };
  projects: {
    active: number;
    completed: number;
    overdue: number;
  };
  team: {
    productivity: number;
    utilization: number;
    satisfaction: number;
  };
}

// Task Management Types
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  parent_id?: string;
  estimated_hours?: number;
  actual_hours?: number;
  assignees: string[];
  labels: string[];
  guest_id?: string;
}

export interface TaskTemplate {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  labels: string[];
  dependencies: string[];
  assignees: string[];
  created_at: string;
  updated_at: string;
}

export interface RecurringTask {
  id: string;
  task_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval_count: number;
  days_of_week: string[];
  start_date: string;
  end_date?: string;
  last_generated?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  user_id: string;
  name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

export interface Label {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TaskHistory {
  id: string;
  task_id: string;
  user_id: string;
  field: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface TaskFilter {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  labels?: string[];
  search?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role?: 'user' | 'admin';
}