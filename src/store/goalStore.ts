import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useGuestStore } from './guestStore';
import { useToastStore } from './toastStore';
import type { Goal } from '../lib/types';

interface GoalState {
  goals: Goal[];
  selectedGoal: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  setSelectedGoal: (goalId: string | null) => void;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  selectedGoal: null,
  isLoading: false,
  error: null,

  loadGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest } = useGuestStore.getState();
      if (isGuest) {
        set({ goals: [] });
        return;
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ goals: data || [] });
    } catch (error) {
      console.error('Error loading goals:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest } = useGuestStore.getState();
      if (isGuest) {
        throw new Error('Please sign up to create goals');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!goal.title) throw new Error('Goal title is required');
      if (!goal.category) throw new Error('Goal category is required');
      if (!goal.target_date) throw new Error('Target date is required');

      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goal,
          user_id: user.id,
          status: 'active',
          progress: 0
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        goals: [data, ...state.goals]
      }));

      useToastStore.getState().showSuccess('Goal created successfully');
      return data;
    } catch (error) {
      console.error('Error adding goal:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add goal' });
      useToastStore.getState().showError(error instanceof Error ? error.message : 'Failed to add goal');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        goals: state.goals.map(goal => 
          goal.id === id ? { ...goal, ...data } : goal
        )
      }));

      useToastStore.getState().showSuccess('Goal updated successfully');
    } catch (error) {
      console.error('Error updating goal:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update goal' });
      useToastStore.getState().showError('Failed to update goal');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        goals: state.goals.filter(goal => goal.id !== id),
        selectedGoal: state.selectedGoal === id ? null : state.selectedGoal
      }));

      useToastStore.getState().showSuccess('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete goal' });
      useToastStore.getState().showError('Failed to delete goal');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedGoal: (goalId) => {
    set({ selectedGoal: goalId });
  }
}));