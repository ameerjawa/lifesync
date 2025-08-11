import { supabase } from '../../lib/supabase';
import { generateTaskSuggestions, analyzeTaskPerformance, generateTaskSchedule } from '../../lib/ai';
import { sortAndGroupTasks } from './utils';
import type { TaskState } from './types';
import type { Task } from '../../lib/types';

export const createAIActions = (set: any, get: () => TaskState) => ({
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Add suggested tasks
      for (const suggestion of suggestions) {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            title: suggestion.title,
            description: suggestion.description,
            priority: suggestion.priority,
            status: 'todo',
            due_date: new Date().toISOString(),
            estimated_hours: suggestion.estimated_duration / 60,
            labels: ['AI Suggested'],
            user_id: user.id
          }])
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
      }

      return suggestions;
    } catch (error) {
      console.error('Error getting task suggestions:', error);
      set({ error: 'Failed to get task suggestions' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  analyzeTaskPerformance: async () => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      const analysis = await analyzeTaskPerformance(tasks);
      return analysis;
    } catch (error) {
      console.error('Error analyzing tasks:', error);
      set({ error: 'Failed to analyze tasks' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  generateOptimizedSchedule: async () => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      const schedule = await generateTaskSchedule(tasks);
      return schedule;
    } catch (error) {
      console.error('Error generating schedule:', error);
      set({ error: 'Failed to generate schedule' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});