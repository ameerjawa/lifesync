import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle, 
  Zap,
  Brain,
  Shield,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useAuthStore } from '../store/authStore';

function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'enterprise'>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { upgradePlan } = useSubscriptionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to signup
    if (!user) {
      navigate('/signup', { 
        state: { mode: 'signup', redirect: '/upgrade' }
      });
    }
  }, [user, navigate]);

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/signup', { 
        state: { mode: 'signup', redirect: '/upgrade' }
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await upgradePlan(selectedPlan);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error upgrading plan:', error);
      setError(error instanceof Error ? error.message : 'Failed to upgrade plan');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const plans = {
    free: {
      name: 'Free',
      price: 'Free',
      period: 'forever',
      features: [
        'Up to 3 tasks',
        'Basic task management',
        'Simple dashboard',
        'Community support',
        'Email notifications',
        'Mobile app access'
      ],
      icon: Brain,
      color: 'gray'
    },
    premium: {
      name: 'Premium',
      price: '$12',
      period: 'month',
      features: [
        'Unlimited tasks and projects',
        'Advanced AI insights',
        'Custom dashboards',
        'Priority support',
        'Data export',
        'API access'
      ],
      icon: Zap,
      color: 'indigo'
    },
    enterprise: {
      name: 'Enterprise',
      price: '$49',
      period: 'month',
      features: [
        'All Premium features',
        'Team collaboration',
        'Advanced security',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee'
      ],
      icon: Shield,
      color: 'purple'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to unlock your full potential
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => {
            const Icon = plan.icon;
            const isSelected = key === selectedPlan;
            const isPaid = key !== 'free';
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all ${
                  isSelected && isPaid ? 'ring-2 ring-primary-600 shadow-lg' : ''
                }`}
                onClick={() => isPaid && setSelectedPlan(key as 'premium' | 'enterprise')}
              >
                {key === 'free' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                      No Credit Card Required
                    </div>
                  </div>
                )}

                {isSelected && isPaid && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary-100 rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                )}

                <div className={`bg-${plan.color}-600 px-6 py-8 text-white`}>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="ml-3 text-xl font-semibold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-2 text-white/80">/{plan.period}</span>
                  </div>
                </div>

                <div className="p-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {key === 'free' && (
                    <button
                      onClick={() => navigate('/signup', { 
                        state: { mode: 'signup', redirect: '/upgrade' }
                      })}
                      className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {selectedPlan && (
          <div className="mt-12 text-center">
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                <>
                  Upgrade to {selectedPlan === 'premium' ? 'Premium' : 'Enterprise'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpgradePage;