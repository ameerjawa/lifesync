import { supabase } from '../../lib/supabase';
import { sortAndGroupTasks } from './utils';
import type { Task, RecurringTask } from '../../lib/types';
import type { TaskState } from './types';

export const createRecurringActions = (set: any, get: () => TaskState) => ({
  loadRecurringTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('recurring_tasks')
        .select(`
          *,
          task:tasks(*)
        `)
        .eq('task:tasks.user_id', user.id);

      if (error) throw error;
      set({ recurringTasks: data || [], error: null });
    } catch (error) {
      console.error('Error loading recurring tasks:', error);
      set({ 
        error: 'Failed to load recurring tasks. Please try again.',
        recurringTasks: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addRecurringTask: async (
    task: Omit<Task, 'id'>, 
    recurring: Omit<RecurringTask, 'id' | 'task_id'>
  ) => {
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
        filteredTasks: sortAndGroupTasks(
          [taskData, ...state.tasks],
          state.sortBy,
          state.sortDirection,
          state.groupBy
        )
      }));
    } catch (error) {
      console.error('Error creating recurring task:', error);
      set({ error: 'Failed to create recurring task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRecurringTask: async (id: string, updates: Partial<RecurringTask>) => {
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
  }
});