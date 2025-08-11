import { supabase } from '../../lib/supabase';
import type { FinanceState } from './types';

export const createCategoryActions = (set: any, get: () => FinanceState) => ({
  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      console.error('Error loading categories:', error);
      set({ error: 'Failed to load categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ categories: [...state.categories, data] }));
    } catch (error) {
      console.error('Error adding category:', error);
      set({ error: 'Failed to add category' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        categories: state.categories.map(category =>
          category.id === id ? { ...category, ...data } : category
        )
      }));
    } catch (error) {
      console.error('Error updating category:', error);
      set({ error: 'Failed to update category' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        categories: state.categories.filter(category => category.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ error: 'Failed to delete category' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});