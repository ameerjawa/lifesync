import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useGuestStore } from '../store/guestStore';
import { useTrialStore } from '../store/trialStore';

// Feature definitions with their availability by plan
export const FEATURES = {
  // Free features
  basic_tasks: { plans: ['free', 'premium', 'enterprise'], description: 'Basic task management' },
  basic_dashboard: { plans: ['free', 'premium', 'enterprise'], description: 'Basic dashboard' },
  basic_analytics: { plans: ['free', 'premium', 'enterprise'], description: 'Basic analytics' },
  
  // Premium features
  unlimited_tasks: { plans: ['premium', 'enterprise'], description: 'Unlimited tasks' },
  ai_insights: { plans: ['premium', 'enterprise'], description: 'AI-powered insights' },
  advanced_analytics: { plans: ['premium', 'enterprise'], description: 'Advanced analytics' },
  custom_dashboards: { plans: ['premium', 'enterprise'], description: 'Custom dashboards' },
  health_tracking: { plans: ['premium', 'enterprise'], description: 'Health tracking' },
  finance_tracking: { plans: ['premium', 'enterprise'], description: 'Finance tracking' },
  business_suite: { plans: ['premium', 'enterprise'], description: 'Business Suite access' },
  
  // Enterprise features
  team_collaboration: { plans: ['enterprise'], description: 'Team collaboration' },
  advanced_security: { plans: ['enterprise'], description: 'Advanced security' },
  custom_integrations: { plans: ['enterprise'], description: 'Custom integrations' },
  priority_support: { plans: ['enterprise'], description: 'Priority support' }
};

// Guest user restrictions
export const GUEST_LIMITS = {
  maxTasks: 3,
  sessionDuration: 30 * 60 * 1000, // 30 minutes
  features: ['basic_tasks', 'basic_dashboard']
};

// Free plan restrictions
export const FREE_LIMITS = {
  maxTasks: 10,
  maxProjects: 1,
  maxTeamMembers: 1,
  features: ['basic_tasks', 'basic_dashboard', 'basic_analytics']
};

// Trial settings
export const TRIAL_SETTINGS = {
  duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  features: Object.keys(FEATURES).filter(f => FEATURES[f].plans.includes('premium'))
};

export function usePermissions() {
  const { user, profile } = useAuthStore();
  const { plan, status } = useSubscriptionStore();
  const { isGuest } = useGuestStore();
  const { isTrialActive, trialEndDate } = useTrialStore();

  const checkFeatureAccess = (featureName: string): boolean => {
    // Guest users
    if (isGuest) {
      return GUEST_LIMITS.features.includes(featureName);
    }

    // Trial users
    if (isTrialActive && trialEndDate && new Date() < new Date(trialEndDate)) {
      return TRIAL_SETTINGS.features.includes(featureName);
    }

    // Regular users
    const feature = FEATURES[featureName];
    if (!feature) return false;

    return feature.plans.includes(plan) && status === 'active';
  };

  const getFeatureMessage = (featureName: string): string => {
    if (!user && !isGuest) {
      return 'Please sign in to access this feature';
    }

    if (isGuest) {
      return 'Create an account to access this feature';
    }

    if (isTrialActive) {
      return 'This feature is available during your trial';
    }

    if (plan === 'free') {
      return 'Upgrade to access this feature';
    }

    if (status !== 'active') {
      return 'Your subscription is not active';
    }

    return '';
  };

  const getRemainingTrialTime = (): number => {
    if (!isTrialActive || !trialEndDate) return 0;
    return Math.max(0, new Date(trialEndDate).getTime() - Date.now());
  };

  const shouldShowUpgradePrompt = (): boolean => {
    if (!isTrialActive || !trialEndDate) return false;
    
    const remainingTime = getRemainingTrialTime();
    const totalDuration = TRIAL_SETTINGS.duration;
    const progress = 1 - (remainingTime / totalDuration);

    // Show prompts at 50%, 75%, and 90% of trial duration
    return progress >= 0.5 || progress >= 0.75 || progress >= 0.9;
  };

  return {
    checkFeatureAccess,
    getFeatureMessage,
    getRemainingTrialTime,
    shouldShowUpgradePrompt,
    isGuest,
    isTrialActive,
    plan,
    status
  };
}