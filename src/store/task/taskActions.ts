import { supabase } from '../../lib/supabase';
import { sortAndGroupTasks } from './utils';
import type { Task } from '../../lib/types';
import type { TaskState } from './types';
import { useGuestStore } from '../guestStore';

export const createTaskActions = (set: any, get: () => TaskState) => ({
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
      
      const sortedAndGroupedTasks = sortAndGroupTasks(
        data || [], 
        get().sortBy, 
        get().sortDirection, 
        get().groupBy
      );
      
      set({ 
        tasks: data || [], 
        filteredTasks: sortedAndGroupedTasks,
        error: null
      });
    } catch (error) {
      console.error('Error loading tasks:', error);
      set({ 
        error: 'Failed to load tasks. Please try again.',
        tasks: [],
        filteredTasks: []
      });
      throw error;
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
        // For guest users, set guest_id and ensure user_id is null
        taskData = {
          ...taskData,
          guest_id: getGuestId(),
          user_id: null
        };
      } else {
        // For authenticated users, set user_id and ensure guest_id is null
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
        filteredTasks: sortAndGroupTasks(
          [data, ...state.tasks],
          state.sortBy,
          state.sortDirection,
          state.groupBy
        )
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest, getGuestId } = useGuestStore.getState();
      let query = supabase.from('tasks').update(updates).eq('id', id);

      if (isGuest) {
        query = query.eq('guest_id', getGuestId());
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.map(task => task.id === id ? { ...task, ...data } : task),
        filteredTasks: sortAndGroupTasks(
          state.tasks.map(task => task.id === id ? { ...task, ...data } : task),
          state.sortBy,
          state.sortDirection,
          state.groupBy
        )
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest, getGuestId } = useGuestStore.getState();
      let query = supabase.from('tasks').delete();

      if (isGuest) {
        query = query.eq('guest_id', getGuestId());
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        query = query.eq('user_id', user.id);
      }

      query = query.in('id', ids);
      const { error } = await query;

      if (error) throw error;

      set(state => {
        const tasks = state.tasks.filter(task => !ids.includes(task.id));
        return {
          tasks,
          filteredTasks: sortAndGroupTasks(
            tasks,
            state.sortBy,
            state.sortDirection,
            state.groupBy
          ),
          selectedTasks: state.selectedTasks.filter(taskId => !ids.includes(taskId)),
          error: null
        };
      });
    } catch (error) {
      console.error('Error deleting tasks:', error);
      set({ error: 'Failed to delete tasks' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  duplicateTask: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest, getGuestId } = useGuestStore.getState();
      const tasks = get().tasks.filter(t => ids.includes(t.id));
      if (tasks.length === 0) throw new Error('No tasks found to duplicate');

      let duplicates;
      if (isGuest) {
        duplicates = tasks.map(task => ({
          title: `${task.title} (Copy)`,
          description: task.description,
          due_date: task.due_date,
          priority: task.priority,
          status: task.status,
          estimated_hours: task.estimated_hours,
          actual_hours: task.actual_hours,
          labels: task.labels,
          assignees: task.assignees,
          guest_id: getGuestId(),
          user_id: null
        }));
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        duplicates = tasks.map(task => ({
          title: `${task.title} (Copy)`,
          description: task.description,
          due_date: task.due_date,
          priority: task.priority,
          status: task.status,
          estimated_hours: task.estimated_hours,
          actual_hours: task.actual_hours,
          labels: task.labels,
          assignees: task.assignees,
          user_id: user.id,
          guest_id: null
        }));
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(duplicates)
        .select();

      if (error) throw error;

      set(state => ({
        tasks: [...(data || []), ...state.tasks],
        filteredTasks: sortAndGroupTasks(
          [...(data || []), ...state.tasks],
          state.sortBy,
          state.sortDirection,
          state.groupBy
        ),
        error: null
      }));
    } catch (error) {
      console.error('Error duplicating tasks:', error);
      set({ error: 'Failed to duplicate tasks' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadTaskDetails: async (taskId: string) => {
    try {
      await Promise.all([
        get().loadComments(taskId),
        get().loadAttachments(taskId)
      ]);
    } catch (error) {
      console.error('Error loading task details:', error);
      throw error;
    }
  }
});