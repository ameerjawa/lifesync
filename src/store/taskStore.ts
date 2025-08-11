import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateTaskSuggestions } from '../lib/ai';
import { useGuestStore } from './guestStore';
import { useToastStore } from './toastStore';
import type { 
  Task, 
  TaskFilter, 
  Label, 
  TaskHistory,
  TaskTemplate,
  RecurringTask,
  TaskComment,
  TaskAttachment 
} from '../lib/types';

interface TaskState {
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
  
  // Task Actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (ids: string[]) => Promise<void>;
  duplicateTask: (ids: string[]) => Promise<void>;
  
  // Template Actions
  loadTemplates: () => Promise<void>;
  addTemplate: (template: Omit<TaskTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  createTaskFromTemplate: (templateId: string) => Promise<void>;
  
  // Recurring Task Actions
  loadRecurringTasks: () => Promise<void>;
  addRecurringTask: (task: Omit<Task, 'id'>, recurring: Omit<RecurringTask, 'id' | 'task_id'>) => Promise<void>;
  updateRecurringTask: (id: string, updates: Partial<RecurringTask>) => Promise<void>;
  
  // Comment Actions
  loadComments: (taskId: string) => Promise<void>;
  addComment: (taskId: string, content: string, parentId?: string) => Promise<void>;
  updateComment: (id: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  
  // Attachment Actions
  loadAttachments: (taskId: string) => Promise<void>;
  addAttachment: (taskId: string, file: File) => Promise<void>;
  deleteAttachment: (id: string) => Promise<void>;
  
  // View Actions
  setViewMode: (mode: TaskState['viewMode']) => void;
  setGroupBy: (groupBy: TaskState['groupBy']) => void;
  setSortBy: (sortBy: TaskState['sortBy']) => void;
  toggleSortDirection: () => void;
  toggleTaskSelection: (taskId: string) => void;
  clearSelectedTasks: () => void;
  
  // Filter Actions
  setFilters: (filters: TaskFilter) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  
  // AI Actions
  getTaskSuggestions: () => Promise<any[]>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  templates: [],
  recurringTasks: [],
  comments: {},
  attachments: {},
  labels: [],
  taskHistory: {},
  filters: {},
  selectedTasks: [],
  viewMode: 'board',
  groupBy: 'status',
  sortBy: 'dueDate',
  sortDirection: 'asc',
  undoStack: [],
  redoStack: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest, getGuestId } = useGuestStore.getState();
      let query = supabase.from('tasks').select('*');

      if (isGuest) {
        // For guest users, filter by guest_id
        const guestId = getGuestId();
        query = query.eq('guest_id', guestId);
      } else {
        // For authenticated users, filter by user_id
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [], filteredTasks: data || [] });
    } catch (error) {
      console.error('Error loading tasks:', error);
      set({ error: 'Failed to load tasks' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest, getGuestId } = useGuestStore.getState();
      let taskData: any = { ...task };

      if (isGuest) {
        taskData = {
          ...taskData,
          guest_id: getGuestId(),
          user_id: null
        };
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        taskData = {
          ...taskData,
          user_id: user.id,
          guest_id: null
        };
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        tasks: [data, ...state.tasks],
        filteredTasks: [data, ...state.filteredTasks]
      }));

      // Show success toast
      useToastStore.getState().showSuccess('Task created successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
      // Show error toast
      useToastStore.getState().showError('Failed to create task');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.map(task => task.id === id ? { ...task, ...data } : task),
        filteredTasks: state.filteredTasks.map(task => task.id === id ? { ...task, ...data } : task)
      }));

      // Show success toast
      useToastStore.getState().showSuccess('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task' });
      // Show error toast
      useToastStore.getState().showError('Failed to update task');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', ids);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.filter(task => !ids.includes(task.id)),
        filteredTasks: state.filteredTasks.filter(task => !ids.includes(task.id)),
        selectedTasks: state.selectedTasks.filter(id => !ids.includes(id))
      }));

      // Show success toast
      useToastStore.getState().showSuccess(`${ids.length > 1 ? 'Tasks' : 'Task'} deleted successfully`);
    } catch (error) {
      console.error('Error deleting tasks:', error);
      set({ error: 'Failed to delete tasks' });
      // Show error toast
      useToastStore.getState().showError('Failed to delete tasks');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  duplicateTask: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const tasksToDuplicate = get().tasks.filter(task => ids.includes(task.id));
      const duplicates = tasksToDuplicate.map(task => ({
        ...task,
        id: undefined,
        title: `${task.title} (Copy)`,
        created_at: undefined,
        updated_at: undefined
      }));

      const { data, error } = await supabase
        .from('tasks')
        .insert(duplicates)
        .select();

      if (error) throw error;

      set(state => ({
        tasks: [...(data || []), ...state.tasks],
        filteredTasks: [...(data || []), ...state.filteredTasks]
      }));
    } catch (error) {
      console.error('Error duplicating tasks:', error);
      set({ error: 'Failed to duplicate tasks' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('task_templates')
        .select('*')
        .order('title');

      if (error) throw error;
      set({ templates: data || [] });
    } catch (error) {
      console.error('Error loading templates:', error);
      set({ error: 'Failed to load templates' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTemplate: async (template) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('task_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ templates: [...state.templates, data] }));
    } catch (error) {
      console.error('Error adding template:', error);
      set({ error: 'Failed to add template' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createTaskFromTemplate: async (templateId) => {
    set({ isLoading: true, error: null });
    try {
      const template = get().templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const task = {
        title: template.title,
        description: template.description,
        priority: template.priority,
        status: 'todo' as const,
        estimated_hours: template.estimated_hours,
        labels: template.labels
      };

      await get().addTask(task);
    } catch (error) {
      console.error('Error creating task from template:', error);
      set({ error: 'Failed to create task from template' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadRecurringTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('recurring_tasks')
        .select(`
          *,
          task:tasks(*)
        `);

      if (error) throw error;
      set({ recurringTasks: data || [] });
    } catch (error) {
      console.error('Error loading recurring tasks:', error);
      set({ error: 'Failed to load recurring tasks' });
    } finally {
      set({ isLoading: false });
    }
  },

  addRecurringTask: async (task, recurring) => {
    set({ isLoading: true, error: null });
    try {
      // First create the task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (taskError) throw taskError;

      // Then create the recurring configuration
      const { error: recurringError } = await supabase
        .from('recurring_tasks')
        .insert([{
          ...recurring,
          task_id: taskData.id,
          last_generated: new Date().toISOString()
        }]);

      if (recurringError) throw recurringError;

      set(state => ({
        tasks: [taskData, ...state.tasks],
        filteredTasks: [taskData, ...state.filteredTasks]
      }));
    } catch (error) {
      console.error('Error creating recurring task:', error);
      set({ error: 'Failed to create recurring task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRecurringTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('recurring_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        recurringTasks: state.recurringTasks.map(rt => 
          rt.id === id ? { ...rt, ...data } : rt
        )
      }));
    } catch (error) {
      console.error('Error updating recurring task:', error);
      set({ error: 'Failed to update recurring task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadComments: async (taskId) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set(state => ({
        comments: {
          ...state.comments,
          [taskId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading comments:', error);
      throw error;
    }
  },

  addComment: async (taskId, content, parentId) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert([{
          task_id: taskId,
          content,
          parent_id: parentId
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        comments: {
          ...state.comments,
          [taskId]: [...(state.comments[taskId] || []), data]
        }
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  updateComment: async (id, content) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .update({ content })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => {
        const newComments = { ...state.comments };
        for (const taskId in newComments) {
          newComments[taskId] = newComments[taskId].map(comment =>
            comment.id === id ? { ...comment, content } : comment
          );
        }
        return { comments: newComments };
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  deleteComment: async (id) => {
    try {
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newComments = { ...state.comments };
        for (const taskId in newComments) {
          newComments[taskId] = newComments[taskId].filter(comment => comment.id !== id);
        }
        return { comments: newComments };
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  loadAttachments: async (taskId) => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set(state => ({
        attachments: {
          ...state.attachments,
          [taskId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading attachments:', error);
      throw error;
    }
  },

  addAttachment: async (taskId, file) => {
    try {
      const filePath = `${taskId}/${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('task-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('task_attachments')
        .insert([{
          task_id: taskId,
          name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        attachments: {
          ...state.attachments,
          [taskId]: [...(state.attachments[taskId] || []), data]
        }
      }));
    } catch (error) {
      console.error('Error adding attachment:', error);
      throw error;
    }
  },

  deleteAttachment: async (id) => {
    try {
      const { error } = await supabase
        .from('task_attachments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newAttachments = { ...state.attachments };
        for (const taskId in newAttachments) {
          newAttachments[taskId] = newAttachments[taskId].filter(attachment => attachment.id !== id);
        }
        return { attachments: newAttachments };
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  setGroupBy: (groupBy) => {
    set({ groupBy });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  toggleSortDirection: () => {
    set(state => ({
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  },

  toggleTaskSelection: (taskId) => {
    set(state => ({
      selectedTasks: state.selectedTasks.includes(taskId)
        ? state.selectedTasks.filter(id => id !== taskId)
        : [...state.selectedTasks, taskId]
    }));
  },

  clearSelectedTasks: () => {
    set({ selectedTasks: [] });
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  applyFilters: () => {
    const { tasks, filters } = get();
    let filtered = [...tasks];

    if (filters.status?.length) {
      filtered = filtered.filter(task => filters.status?.includes(task.status));
    }

    if (filters.priority?.length) {
      filtered = filtered.filter(task => filters.priority?.includes(task.priority));
    }

    if (filters.labels?.length) {
      filtered = filtered.filter(task => 
        task.labels?.some(label => filters.labels?.includes(label))
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }

    set({ filteredTasks: filtered });
  },

  getTaskSuggestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      const suggestions = await generateTaskSuggestions(tasks, {
        preferredWorkingHours: [9, 17],
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        taskPreferences: {
          maxDailyTasks: 5,
          preferredTaskDuration: 120,
        }
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting task suggestions:', error);
      set({ error: 'Failed to get task suggestions' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));