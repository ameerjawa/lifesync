import { supabase } from '../../lib/supabase';
import type { FinanceState } from './types';
import type { SavingsGoal } from '../../lib/types';

export const createSavingsActions = (set: any, get: () => FinanceState) => ({
  loadSavingsGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('savings_goals')
        .select(`
          *,
          account:accounts(*)
        `)
        .eq('user_id', user.id)
        .order('target_date', { ascending: true });

      if (error) throw error;
      set({ savingsGoals: data || [] });
    } catch (error) {
      console.error('Error loading savings goals:', error);
      set({ error: 'Failed to load savings goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  addSavingsGoal: async (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!goal.name) throw new Error('Goal name is required');
      if (!goal.target_amount) throw new Error('Target amount is required');
      if (!goal.target_date) throw new Error('Target date is required');

      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{
          ...goal,
          user_id: user.id,
          current_amount: goal.current_amount || 0,
          is_completed: false
        }])
        .select(`
          *,
          account:accounts(*)
        `)
        .single();

      if (error) throw error;

      set(state => ({
        savingsGoals: [...state.savingsGoals, data]
      }));

      return data;
    } catch (error) {
      console.error('Error adding savings goal:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add savings goal' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});