import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useGuestStore } from '../store/guestStore';
import { useTrialStore } from '../store/trialStore';

export type PlanTier = 'free' | 'pro' | 'business';

export type FeatureKey =
  | 'basic_tasks'
  | 'basic_dashboard'
  | 'today_view'
  | 'manual_big3'
  | 'basic_habits'
  | 'unlimited_goals'
  | 'unlimited_projects'
  | 'next_move'
  | 'ai_goal_engine'
  | 'smart_replanning'
  | 'execution_intelligence'
  | 'weekly_ai_review'
  | 'decision_lab'
  | 'advanced_ai'
  | 'career_hub'
  | 'finance_hub'
  | 'fitness_wellness'
  | 'personal_context'
  | 'business_workspace'
  | 'crm'
  | 'invoicing'
  | 'business_finance'
  | 'time_tracking'
  | 'team_capabilities'
  | 'business_analytics'
  | 'advanced_progress'
  | 'longer_history';

export const FEATURES: Record<FeatureKey, { plans: PlanTier[]; description: string; category: string }> = {
  basic_tasks: { plans: ['free', 'pro', 'business'], description: 'Core task management', category: 'core' },
  basic_dashboard: { plans: ['free', 'pro', 'business'], description: 'Basic dashboard', category: 'core' },
  today_view: { plans: ['free', 'pro', 'business'], description: 'Today dashboard with Big 3 and NEXT Move', category: 'core' },
  manual_big3: { plans: ['free', 'pro', 'business'], description: 'Manually set your daily Big 3', category: 'core' },
  basic_habits: { plans: ['free', 'pro', 'business'], description: 'Basic habit tracking', category: 'core' },

  unlimited_goals: { plans: ['pro', 'business'], description: 'Unlimited goals', category: 'plan' },
  unlimited_projects: { plans: ['pro', 'business'], description: 'Unlimited projects', category: 'plan' },
  next_move: { plans: ['pro', 'business'], description: 'NEXT Move intelligence', category: 'ai' },
  ai_goal_engine: { plans: ['pro', 'business'], description: 'AI Goal Engine', category: 'ai' },
  smart_replanning: { plans: ['pro', 'business'], description: 'Smart Replanning', category: 'ai' },
  execution_intelligence: { plans: ['pro', 'business'], description: 'Execution Intelligence insights', category: 'ai' },
  weekly_ai_review: { plans: ['pro', 'business'], description: 'Weekly AI Review', category: 'ai' },
  decision_lab: { plans: ['pro', 'business'], description: 'Decision Lab', category: 'ai' },
  advanced_ai: { plans: ['pro', 'business'], description: 'Advanced ASK NEXT with context', category: 'ai' },
  personal_context: { plans: ['pro', 'business'], description: 'Personal context & memory', category: 'ai' },

  career_hub: { plans: ['pro', 'business'], description: 'Career Hub', category: 'life' },
  finance_hub: { plans: ['pro', 'business'], description: 'Finance Hub', category: 'life' },
  fitness_wellness: { plans: ['pro', 'business'], description: 'Fitness & Wellness', category: 'life' },
  advanced_progress: { plans: ['pro', 'business'], description: 'Advanced progress analytics', category: 'life' },
  longer_history: { plans: ['pro', 'business'], description: 'Longer data history', category: 'life' },

  business_workspace: { plans: ['business'], description: 'Business workspace', category: 'work' },
  crm: { plans: ['business'], description: 'CRM & clients', category: 'work' },
  invoicing: { plans: ['business'], description: 'Invoicing', category: 'work' },
  business_finance: { plans: ['business'], description: 'Business finance', category: 'work' },
  time_tracking: { plans: ['business'], description: 'Time tracking', category: 'work' },
  team_capabilities: { plans: ['business'], description: 'Team capabilities', category: 'work' },
  business_analytics: { plans: ['business'], description: 'Business analytics', category: 'work' },
};

export const GUEST_LIMITS = {
  maxTasks: 3,
  sessionDuration: 30 * 60 * 1000,
  features: ['basic_tasks', 'basic_dashboard', 'today_view'] as FeatureKey[],
};

export const FREE_LIMITS = {
  maxActiveGoals: 3,
  maxTasks: 50,
  maxProjects: 3,
  features: ['basic_tasks', 'basic_dashboard', 'today_view', 'manual_big3', 'basic_habits'] as FeatureKey[],
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  pro: 'Pro',
  business: 'Business',
};

export const PLAN_PRICES: Record<PlanTier, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  pro: { monthly: 12, annual: 99 },
  business: { monthly: 29, annual: 290 },
};

export const TRIAL_SETTINGS = {
  duration: 14 * 24 * 60 * 60 * 1000,
  plan: 'pro' as PlanTier,
};

export function usePermissions() {
  const { user, profile } = useAuthStore();
  const { plan, status } = useSubscriptionStore();
  const { isGuest } = useGuestStore();
  const { isTrialActive, trialEndDate } = useTrialStore();

  const currentPlan: PlanTier = plan === 'premium' ? 'pro' : plan === 'enterprise' ? 'business' : (plan as PlanTier) || 'free';

  const canUse = (feature: FeatureKey): boolean => {
    if (isGuest) return GUEST_LIMITS.features.includes(feature);

    const isOnTrial = isTrialActive && trialEndDate && new Date() < new Date(trialEndDate);
    const effectivePlan: PlanTier = isOnTrial ? 'pro' : currentPlan;

    const f = FEATURES[feature];
    if (!f) return false;
    return f.plans.includes(effectivePlan) && (status === 'active' || isOnTrial || effectivePlan === 'free');
  };

  const getLimit = (key: 'active_goals' | 'ai_messages'): number => {
    if (isGuest) return key === 'active_goals' ? 0 : 3;
    if (currentPlan === 'free') return key === 'active_goals' ? 3 : 10;
    if (currentPlan === 'pro') return key === 'active_goals' ? Infinity : 200;
    return Infinity;
  };

  const getFeatureMessage = (feature: FeatureKey): string => {
    if (!user && !isGuest) return 'Please sign in to access this feature';
    if (isGuest) return 'Create an account to access this feature';
    if (isTrialActive) return 'This feature is available during your trial';
    if (currentPlan === 'free') return 'Upgrade to NEXT Pro to access this feature';
    if (status !== 'active') return 'Your subscription is not active';
    return '';
  };

  const getRemainingTrialTime = (): number => {
    if (!isTrialActive || !trialEndDate) return 0;
    return Math.max(0, new Date(trialEndDate).getTime() - Date.now());
  };

  return {
    canUse,
    getLimit,
    getFeatureMessage,
    getRemainingTrialTime,
    isGuest,
    isTrialActive,
    plan: currentPlan,
    status,
    PLAN_LABELS,
    PLAN_PRICES,
  };
}
