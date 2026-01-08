import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  CheckCircle,
  ArrowRight,
  Zap,
  Brain,
  Heart,
  BarChart2,
  Shield,
  Lock
} from 'lucide-react';
import { useTrialStore } from '../../store/trialStore';
import { useNavigate } from 'react-router-dom';
import { useGuestStore } from '../../store/guestStore';
import { useAuthStore } from '../../store/authStore';

interface UpgradePromptProps {
  onClose: () => void;
  feature?: string;
}

export function UpgradePrompt({ onClose, feature }: UpgradePromptProps) {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'enterprise'>('premium');
  const { getRemainingDays } = useTrialStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isGuest } = useGuestStore();
  const remainingDays = getRemainingDays();

  const handleUpgradeClick = () => {
    if (!user || isGuest) {
      navigate('/signup', { state: { mode: 'signup', redirect: '/upgrade' } });
    } else {
      navigate('/upgrade');
    }
    onClose();
  };

  const plans = [
    {
      name: 'Premium',
      price: '$12',
      period: 'month',
      features: [
        'Unlimited tasks and projects',
        'Advanced AI insights',
        'Custom dashboards',
        'Priority support',
        'Data export'
      ],
      icon: Zap,
      color: 'indigo',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'month',
      features: [
        'All Premium features',
        'Team collaboration',
        'Advanced security',
        'Custom integrations',
        'Dedicated support'
      ],
      icon: Shield,
      color: 'purple',
      recommended: false
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Panel - Feature Showcase */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-600 p-8 text-white">
              <div className="mb-6">
                <div className="mb-4 inline-flex rounded-full bg-white/20 p-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">
                  {feature ? 'Unlock Premium Features' : 'Upgrade Your Experience'}
                </h2>
                <p className="text-white/80">
                  {feature
                    ? `Unlock ${feature} and all premium features`
                    : isGuest 
                      ? 'Sign up now to unlock all premium features!'
                      : `Only ${remainingDays} days left in your trial. Don't lose access!`}
                </p>
              </div>

              <div className="space-y-6">
                <FeatureHighlight
                  icon={Brain}
                  title="AI-Powered Insights"
                  description="Get personalized recommendations and task optimization"
                />
                <FeatureHighlight
                  icon={Heart}
                  title="Health & Wellness"
                  description="Track your health goals and habits with advanced analytics"
                />
                <FeatureHighlight
                  icon={BarChart2}
                  title="Advanced Analytics"
                  description="Deep insights into your productivity and progress"
                />
              </div>
            </div>

            {/* Right Panel - Plan Selection */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Choose Your Plan</h3>
                <p className="text-sm text-gray-500">Select the plan that best fits your needs</p>
              </div>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name.toLowerCase() as 'premium' | 'enterprise')}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedPlan === plan.name.toLowerCase()
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <plan.icon className={`h-6 w-6 ${
                          selectedPlan === plan.name.toLowerCase() ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{plan.name}</h4>
                          <p className="text-sm text-gray-500">
                            {plan.price}/{plan.period}
                          </p>
                        </div>
                      </div>
                      {plan.recommended && (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleUpgradeClick}
                  className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-500"
                >
                  {isGuest ? (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Sign Up Now
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Upgrade to {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                    </>
                  )}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full rounded-lg px-6 py-3 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Maybe Later
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                30-day money-back guarantee • Cancel anytime
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FeatureHighlight({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start space-x-4"
    >
      <div className="rounded-lg bg-white/10 p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </motion.div>
  );
}