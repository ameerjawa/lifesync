import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Feature, PlanFeature } from '../../lib/types';

interface PlanManagementProps {
  features: Feature[];
  planFeatures: PlanFeature[];
  onTogglePlanFeature: (featureId: string, plan: string, enabled: boolean) => Promise<void>;
}

export function PlanManagement({
  features,
  planFeatures,
  onTogglePlanFeature
}: PlanManagementProps) {
  const isPlanFeatureEnabled = (featureId: string, plan: string) => {
    return planFeatures.some(pf => 
      pf.feature_id === featureId && pf.plan === plan
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['free', 'premium', 'enterprise'].map((plan) => (
          <div key={plan} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 capitalize mb-4">{plan} Plan</h3>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{feature.name}</span>
                  <button
                    onClick={() => onTogglePlanFeature(feature.id, plan, isPlanFeatureEnabled(feature.id, plan))}
                    className={`p-1 rounded-full ${
                      isPlanFeatureEnabled(feature.id, plan)
                        ? 'text-green-600 hover:bg-green-100'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {isPlanFeatureEnabled(feature.id, plan) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}