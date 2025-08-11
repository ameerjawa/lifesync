import type { 
  Task, 
  TaskFilter, 
  Label, 
  TaskHistory,
  TaskTemplate,
  RecurringTask,
  TaskComment,
  TaskAttachment 
} from '../../lib/types';

export interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  templates: TaskTemplate[];
  recurringTasks: RecurringTask[];
  comments: Record<string, TaskComment[]>;
  attachments: Record<string, TaskAttachment[]>;
  labels: Label[];
  taskHistory: Record<string, TaskHistory[]>;
  filters: TaskFilter;
  selectedTasks: string[];
  viewMode: 'list' | 'board' | 'timeline';
  groupBy: 'status' | 'priority' | 'assignee' | 'none';
  sortBy: 'dueDate' | 'priority' | 'title' | 'created';
  sortDirection: 'asc' | 'desc';
  undoStack: { action: string; data: any }[];
  redoStack: { action: string; data: any }[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTaskDetails: (taskId: string) => Promise<void>;
}