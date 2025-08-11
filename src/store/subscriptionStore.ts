import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SubscriptionState {
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  features: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSubscription: () => Promise<void>;
  checkFeatureAccess: (featureName: string) => boolean;
  upgradePlan: (plan: 'premium' | 'enterprise') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  startTrial: (email: string) => Promise<void>;
  endTrial: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plan: 'free',
  status: 'active',
  features: [],
  isLoading: false,
  error: null,

  loadSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ plan: 'free', status: 'active', features: [] });
        return;
      }

      // Get user's profile with subscription using explicit relationship
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          subscription:subscriptions!profiles_subscription_id_fkey(*)
        `)
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get available features for the plan
      const { data: features, error: featuresError } = await supabase
        .from('feature_flags')
        .select(`
          name,
          plan_features!inner(plan)
        `)
        .eq('plan_features.plan', profile?.subscription?.plan || 'free');

      if (featuresError) throw featuresError;

      set({
        plan: profile?.subscription?.plan || 'free',
        status: profile?.subscription?.status || 'active',
        features: features?.map(f => f.name) || []
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
      set({ error: 'Failed to load subscription details' });
    } finally {
      set({ isLoading: false });
    }
  },

  checkFeatureAccess: (featureName: string) => {
    const { plan, status, features } = get();
    
    // If user is premium or enterprise with active status, they have access to all features
    if ((plan === 'premium' || plan === 'enterprise') && status === 'active') {
      return true;
    }
    
    // For free plan, check if feature is in the features list
    return features.includes(featureName);
  },

  upgradePlan: async (plan: 'premium' | 'enterprise') => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Call the RPC function to update the subscription
      const { error } = await supabase.rpc('update_user_subscription', {
        p_user_id: user.id,
        p_new_plan: plan
      });

      if (error) throw error;

      // Reload subscription details
      await get().loadSubscription();
    } catch (error) {
      console.error('Error upgrading plan:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to upgrade plan' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancel_at_period_end: true
        })
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      set(state => ({
        ...state,
        status: 'cancelled'
      }));
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to cancel subscription' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  startTrial: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .rpc('start_trial', { user_email: email });

      if (error) throw error;

      set({
        plan: 'premium',
        status: 'trialing'
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to start trial' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  endTrial: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .rpc('end_trial', { user_email: user.email });

      if (error) throw error;

      set({
        plan: 'free',
        status: 'active'
      });
    } catch (error) {
      console.error('Error ending trial:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to end trial' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));