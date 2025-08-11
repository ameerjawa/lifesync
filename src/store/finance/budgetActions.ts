import { supabase } from '../../lib/supabase';
import type { FinanceState } from './types';
import type { Budget } from '../../lib/types';

export const createBudgetActions = (set: any, get: () => FinanceState) => ({
  loadBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      set({ budgets: data || [] });
    } catch (error) {
      console.error('Error loading budgets:', error);
      set({ error: 'Failed to load budgets' });
    } finally {
      set({ isLoading: false });
    }
  },

  addBudget: async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!budget.amount) throw new Error('Budget amount is required');
      if (!budget.period) throw new Error('Budget period is required');
      if (!budget.start_date) throw new Error('Start date is required');

      // Format the budget data
      const formattedBudget = {
        ...budget,
        user_id: user.id,
        amount: Number(budget.amount),
        start_date: new Date(budget.start_date).toISOString().split('T')[0],
        end_date: budget.end_date ? new Date(budget.end_date).toISOString().split('T')[0] : null,
        rollover: budget.rollover || false
      };

      const { data, error } = await supabase
        .from('budgets')
        .insert([formattedBudget])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;

      set(state => ({
        budgets: [...state.budgets, data]
      }));

      return data;
    } catch (error) {
      console.error('Error adding budget:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add budget' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});