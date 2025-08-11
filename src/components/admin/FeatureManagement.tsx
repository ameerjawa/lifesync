import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Feature, PlanFeature } from '../../lib/types';

interface FeatureManagementProps {
  features: Feature[];
  planFeatures: PlanFeature[];
  onAddFeature: (feature: { name: string; description: string }) => Promise<void>;
  onUpdateFeature: (id: string, updates: Partial<Feature>) => Promise<void>;
  onDeleteFeature: (id: string) => Promise<void>;
  onTogglePlanFeature: (featureId: string, plan: string, enabled: boolean) => Promise<void>;
}

export function FeatureManagement({
  features,
  planFeatures,
  onAddFeature,
  onUpdateFeature,
  onDeleteFeature,
  onTogglePlanFeature
}: FeatureManagementProps) {
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [newFeature, setNewFeature] = useState({ name: '', description: '' });

  const isPlanFeatureEnabled = (featureId: string, plan: string) => {
    return planFeatures.some(pf => 
      pf.feature_id === featureId && pf.plan === plan
    );
  };

  const handleAddFeature = async () => {
    try {
      await onAddFeature(newFeature);
      setIsAddingFeature(false);
      setNewFeature({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding feature:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Feature Flags</h2>
        <button
          onClick={() => setIsAddingFeature(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Feature
        </button>
      </div>

      {isAddingFeature && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Add New Feature</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Feature Name
              </label>
              <input
                type="text"
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingFeature(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFeature}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                Add Feature
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Free
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enterprise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {features.map((feature) => (
              <tr key={feature.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editingFeature?.id === feature.id ? (
                    <input
                      type="text"
                      value={editingFeature.name}
                      onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                      className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    feature.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingFeature?.id === feature.id ? (
                    <input
                      type="text"
                      value={editingFeature.description}
                      onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                      className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    feature.description
                  )}
                </td>
                {['free', 'premium', 'enterprise'].map((plan) => (
                  <td key={plan} className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    {editingFeature?.id === feature.id ? (
                      <>
                        <button
                          onClick={() => onUpdateFeature(feature.id, editingFeature)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingFeature(null)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingFeature(feature)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDeleteFeature(feature.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}