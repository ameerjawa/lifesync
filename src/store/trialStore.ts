import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface TrialState {
  isTrialActive: boolean;
  trialStartDate: number | null;
  trialEndDate: number | null;
  setupProgress: number;
  setupSteps: {
    taskCreated: boolean;
    budgetCreated: boolean;
    healthGoalCreated: boolean;
  };
  email: string | null;

  // Actions
  startTrial: (email: string) => Promise<void>;
  endTrial: () => Promise<void>;
  updateSetupProgress: (step: keyof TrialState['setupSteps']) => void;
  getRemainingDays: () => number;
  shouldShowUpgradePrompt: () => boolean;
}

export const useTrialStore = create<TrialState>()(
  persist(
    (set, get) => ({
      isTrialActive: false,
      trialStartDate: null,
      trialEndDate: null,
      setupProgress: 0,
      setupSteps: {
        taskCreated: false,
        budgetCreated: false,
        healthGoalCreated: false,
      },
      email: null,

      startTrial: async (email: string) => {
        try {
          // Call RPC function to start trial
          const { data, error } = await supabase.rpc('start_trial', {
            user_email: email
          });

          if (error) throw error;

          set({
            isTrialActive: true,
            trialStartDate: new Date(data.trial_started_at).getTime(),
            trialEndDate: new Date(data.trial_end).getTime(),
            email,
            setupProgress: 0,
            setupSteps: {
              taskCreated: false,
              budgetCreated: false,
              healthGoalCreated: false,
            }
          });
        } catch (error) {
          console.error('Error starting trial:', error);
          throw error;
        }
      },

      endTrial: async () => {
        try {
          const { email } = get();
          if (!email) throw new Error('No trial email found');

          const { error } = await supabase.rpc('end_trial', {
            user_email: email
          });

          if (error) throw error;

          set({
            isTrialActive: false,
            trialStartDate: null,
            trialEndDate: null,
            email: null,
            setupProgress: 0,
            setupSteps: {
              taskCreated: false,
              budgetCreated: false,
              healthGoalCreated: false,
            }
          });
        } catch (error) {
          console.error('Error ending trial:', error);
          throw error;
        }
      },

      updateSetupProgress: (step) => {
        set(state => {
          const setupSteps = {
            ...state.setupSteps,
            [step]: true
          };

          // Calculate progress (each step is worth 33.33%)
          const completedSteps = Object.values(setupSteps).filter(Boolean).length;
          const progress = Math.round((completedSteps / 3) * 100);

          return {
            setupSteps,
            setupProgress: progress
          };
        });
      },

      getRemainingDays: () => {
        const { trialEndDate } = get();
        if (!trialEndDate) return 0;

        const now = Date.now();
        const remaining = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, remaining);
      },

      shouldShowUpgradePrompt: () => {
        const { trialStartDate, trialEndDate } = get();
        if (!trialStartDate || !trialEndDate) return false;

        const now = Date.now();
        const totalTrialDuration = trialEndDate - trialStartDate;
        const elapsed = now - trialStartDate;
        const progress = elapsed / totalTrialDuration;

        // Show prompts at 50%, 75%, and 90% of trial duration
        return progress >= 0.5 || progress >= 0.75 || progress >= 0.9;
      }
    }),
    {
      name: 'trial-storage',
      partialize: (state) => ({
        isTrialActive: state.isTrialActive,
        trialStartDate: state.trialStartDate,
        trialEndDate: state.trialEndDate,
        email: state.email,
        setupProgress: state.setupProgress,
        setupSteps: state.setupSteps
      })
    }
  )
);