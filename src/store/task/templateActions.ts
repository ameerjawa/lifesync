import { supabase } from '../../lib/supabase';
import type { TaskTemplate } from '../../lib/types';
import type { TaskState } from './types';

export const createTemplateActions = (set: any, get: () => TaskState) => ({
  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('task_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('title');

      if (error) throw error;
      set({ templates: data || [], error: null });
    } catch (error) {
      console.error('Error loading templates:', error);
      set({ 
        error: 'Failed to load templates. Please try again.',
        templates: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addTemplate: async (template: Omit<TaskTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('task_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;

      set(state => ({ 
        templates: [...state.templates, data]
      }));
    } catch (error) {
      console.error('Error adding template:', error);
      set({ error: 'Failed to add template' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});