import React from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SubscriptionSettingsProps {
  plan: 'free' | 'premium' | 'enterprise';
  onUpgrade: (plan: 'free' | 'premium' | 'enterprise') => Promise<void>;
  onCancel: () => Promise<void>;
}

export function SubscriptionSettings({ plan, onUpgrade, onCancel }: SubscriptionSettingsProps) {
  const handleUpgrade = async (newPlan: 'free' | 'premium' | 'enterprise') => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user');

      // Call RPC function to update subscription
      const { error } = await supabase.rpc('update_user_subscription', {
        p_user_id: user.id,
        p_new_plan: newPlan
      });

      if (error) throw error;

      // Call the onUpgrade callback to update UI state
      await onUpgrade(newPlan);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Failed to upgrade plan. Please try again.');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      await onCancel();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Subscription Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription plan and billing details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <div className={`relative rounded-lg border p-6 ${
          plan === 'free' ? 'border-2 border-indigo-600 bg-indigo-50' : 'border-gray-200'
        }`}>
          <h4 className="text-lg font-medium text-gray-900">Free</h4>
          <p className="mt-2 text-sm text-gray-500">Basic features for personal use</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Up to 3 tasks
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Basic task management
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Simple dashboard
            </li>
          </ul>
          <div className="mt-6">
            <p className="mb-2 text-2xl font-bold text-gray-900">$0</p>
            {plan === 'free' ? (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Current Plan
              </span>
            ) : (
              <button
                onClick={() => handleUpgrade('free')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Downgrade to Free
              </button>
            )}
          </div>
        </div>

        {/* Premium Plan */}
        <div className={`relative rounded-lg border p-6 ${
          plan === 'premium' ? 'border-2 border-indigo-600 bg-indigo-50' : 'border-gray-200'
        }`}>
          {plan !== 'premium' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
                Most Popular
              </span>
            </div>
          )}
          <h4 className="text-lg font-medium text-gray-900">Premium</h4>
          <p className="mt-2 text-sm text-gray-500">Advanced features for power users</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Unlimited tasks
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              AI-powered insights
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Custom dashboards
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Priority support
            </li>
          </ul>
          <div className="mt-6">
            <p className="mb-2">
              <span className="text-2xl font-bold text-gray-900">$12</span>
              <span className="text-sm text-gray-500">/month</span>
            </p>
            {plan === 'premium' ? (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Current Plan
              </span>
            ) : (
              <button
                onClick={() => handleUpgrade('premium')}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className={`relative rounded-lg border p-6 ${
          plan === 'enterprise' ? 'border-2 border-indigo-600 bg-indigo-50' : 'border-gray-200'
        }`}>
          <h4 className="text-lg font-medium text-gray-900">Enterprise</h4>
          <p className="mt-2 text-sm text-gray-500">Advanced features for teams</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              All Premium features
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Team collaboration
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Advanced security
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Custom integrations
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Dedicated support
            </li>
          </ul>
          <div className="mt-6">
            <p className="mb-2">
              <span className="text-2xl font-bold text-gray-900">$49</span>
              <span className="text-sm text-gray-500">/month</span>
            </p>
            {plan === 'enterprise' ? (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Current Plan
              </span>
            ) : (
              <button
                onClick={() => handleUpgrade('enterprise')}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Upgrade to Enterprise
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900">Billing History</h4>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${plan === 'premium' ? '12.00' : plan === 'enterprise' ? '49.00' : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Subscription */}
      {plan !== 'free' && (
        <div className="mt-8 rounded-lg border border-red-200 p-6">
          <h4 className="text-lg font-medium text-gray-900">Cancel Subscription</h4>
          <p className="mt-1 text-sm text-gray-500">
            Your subscription will continue until the end of the current billing period.
          </p>
          <button
            onClick={handleCancel}
            className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
}