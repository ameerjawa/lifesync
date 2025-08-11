import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useGuestStore } from './guestStore';
import { useToastStore } from './toastStore';
import type { HealthMetric, HealthGoal, HealthInsight } from '../lib/types';

interface HealthState {
  metrics: HealthMetric[];
  goals: HealthGoal[];
  insights: HealthInsight[];
  selectedDateRange: 'week' | 'month' | 'year' | 'all';
  isLoading: boolean;
  error: string | null;

  // Actions
  loadMetrics: () => Promise<void>;
  addMetric: (metric: Omit<HealthMetric, 'id' | 'user_id'>) => Promise<void>;
  loadGoals: () => Promise<void>;
  addGoal: (goal: Omit<HealthGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<HealthGoal>) => Promise<void>;
  generateInsights: () => Promise<void>;
  setDateRange: (range: HealthState['selectedDateRange']) => void;
}

export const useHealthStore = create<HealthState>((set, get) => ({
  metrics: [],
  goals: [],
  insights: [],
  selectedDateRange: 'week',
  isLoading: false,
  error: null,

  loadMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      // Check if user is in guest mode
      const isGuest = useGuestStore.getState().isGuest;
      if (isGuest) {
        set({ metrics: [] });
        return;
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      set({ metrics: data || [] });
    } catch (error) {
      console.error('Error loading health metrics:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load health metrics' });
    } finally {
      set({ isLoading: false });
    }
  },

  addMetric: async (metric) => {
    set({ isLoading: true, error: null });
    try {
      const { isGuest } = useGuestStore.getState();
      if (isGuest) {
        throw new Error('Please sign up to track health metrics');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('add_health_metric', {
        p_metric_type: metric.metric_type,
        p_value: metric.value,
        p_notes: metric.notes || null
      });

      if (error) {
        if (error.message.includes('Invalid value for metric type')) {
          throw new Error(`Invalid value for ${metric.metric_type}. Please check the allowed range.`);
        }
        throw error;
      }

      if (!data) throw new Error('Failed to add metric');

      set(state => ({
        metrics: [data, ...state.metrics]
      }));

      // Show success toast
      useToastStore.getState().showSuccess(`${metric.metric_type} metric added successfully`);

      await get().generateInsights();
    } catch (error) {
      console.error('Error adding health metric:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add health metric' });
      // Show error toast
      useToastStore.getState().showError(error instanceof Error ? error.message : 'Failed to add health metric');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Check if user is in guest mode
      const isGuest = useGuestStore.getState().isGuest;
      if (isGuest) {
        set({ goals: [] });
        return;
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ goals: data || [] });
    } catch (error) {
      console.error('Error loading health goals:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load health goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null });
    try {
      // Check if user is in guest mode
      const isGuest = useGuestStore.getState().isGuest;
      if (isGuest) {
        throw new Error('Please sign up to create health goals');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!goal.metric_type) throw new Error('Metric type is required');
      if (!goal.target_value) throw new Error('Target value is required');
      if (!goal.start_date) throw new Error('Start date is required');
      if (!goal.end_date) throw new Error('End date is required');

      const { data, error } = await supabase
        .from('health_goals')
        .insert([{
          ...goal,
          user_id: user.id,
          status: 'active',
          current_value: 0
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        goals: [data, ...state.goals]
      }));

      return data;
    } catch (error) {
      console.error('Error adding health goal:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add health goal' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Check if user is in guest mode
      const isGuest = useGuestStore.getState().isGuest;
      if (isGuest) {
        throw new Error('Please sign up to update health goals');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        goals: state.goals.map(goal => 
          goal.id === id ? { ...goal, ...data } : goal
        )
      }));

      return data;
    } catch (error) {
      console.error('Error updating health goal:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update health goal' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  generateInsights: async () => {
    const { metrics, goals } = get();
    const insights: HealthInsight[] = [];

    // Helper function to calculate trends
    const calculateTrend = (metricType: HealthMetric['metric_type']) => {
      const relevantMetrics = metrics
        .filter(m => m.metric_type === metricType)
        .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

      if (relevantMetrics.length < 2) return null;

      const first = relevantMetrics[0].value;
      const last = relevantMetrics[relevantMetrics.length - 1].value;
      const diff = last - first;

      return {
        trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
        percentage: Math.abs((diff / first) * 100)
      };
    };

    // Generate insights for each metric type
    const metricTypes = Array.from(new Set(metrics.map(m => m.metric_type)));
    for (const type of metricTypes) {
      const trend = calculateTrend(type);
      if (trend) {
        insights.push({
          type: 'trend',
          title: `${type.replace('_', ' ')} Trend`,
          description: `Your ${type.replace('_', ' ')} has ${
            trend.trend === 'up' ? 'increased' : 
            trend.trend === 'down' ? 'decreased' : 'remained stable'
          } by ${trend.percentage.toFixed(1)}% recently.`,
          metric_type: type,
          trend: trend.trend,
          priority: trend.percentage > 10 ? 'high' : trend.percentage > 5 ? 'medium' : 'low',
          created_at: new Date().toISOString()
        });
      }
    }

    // Check goals progress
    for (const goal of goals) {
      if (goal.status === 'active') {
        const progress = (goal.current_value / goal.target_value) * 100;
        if (progress >= 100) {
          insights.push({
            type: 'achievement',
            title: 'Goal Achieved! 🎉',
            description: `Congratulations! You've reached your ${goal.metric_type.replace('_', ' ')} goal.`,
            metric_type: goal.metric_type,
            priority: 'high',
            created_at: new Date().toISOString()
          });
        } else if (progress >= 90) {
          insights.push({
            type: 'achievement',
            title: 'Almost There!',
            description: `You're ${(100 - progress).toFixed(1)}% away from your ${
              goal.metric_type.replace('_', ' ')
            } goal.`,
            metric_type: goal.metric_type,
            priority: 'medium',
            created_at: new Date().toISOString()
          });
        }
      }
    }

    set({ insights });
  },

  setDateRange: (range) => {
    set({ selectedDateRange: range });
  }
}));