import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import type { HealthMetric } from '../../lib/types';

interface HealthMetricFormProps {
  onSubmit: (metric: Omit<HealthMetric, 'id' | 'user_id'>) => Promise<void>;
  onClose: () => void;
}

export function HealthMetricForm({ onSubmit, onClose }: HealthMetricFormProps) {
  const [metric, setMetric] = useState({
    metric_type: 'weight' as HealthMetric['metric_type'],
    value: '',
    notes: '',
    recorded_at: new Date().toISOString().split('.')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isGuest, setReturnPath } = useGuestStore();
  const { checkFeatureAccess } = useSubscriptionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Check if user is guest
      if (isGuest) {
        setReturnPath('/dashboard');
        throw new Error('Please sign up to track health metrics');
      }

      // Check if user has access to health tracking
      if (!checkFeatureAccess('health_tracking')) {
        throw new Error('Please upgrade to access health tracking features');
      }

      // Validate required fields
      if (!metric.metric_type) throw new Error('Metric type is required');
      if (!metric.value || isNaN(Number(metric.value))) {
        throw new Error('Please enter a valid value');
      }
      if (!metric.recorded_at) throw new Error('Date and time are required');

      // Submit the metric
      await onSubmit({
        ...metric,
        value: Number(metric.value)
      });

      // Close the form on success
      onClose();
    } catch (error) {
      console.error('Error submitting metric:', error);
      setError(error instanceof Error ? error.message : 'Failed to add health metric');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Health Metric</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="metric_type" className="block text-sm font-medium text-gray-700">
            Metric Type
          </label>
          <select
            id="metric_type"
            value={metric.metric_type}
            onChange={(e) => setMetric({ ...metric, metric_type: e.target.value as HealthMetric['metric_type'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="weight">Weight</option>
            <option value="steps">Steps</option>
            <option value="sleep">Sleep</option>
            <option value="water">Water</option>
            <option value="mood">Mood</option>
            <option value="exercise">Exercise</option>
            <option value="heart_rate">Heart Rate</option>
            <option value="blood_pressure">Blood Pressure</option>
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Value
          </label>
          <input
            type="number"
            id="value"
            value={metric.value}
            onChange={(e) => setMetric({ ...metric, value: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="recorded_at" className="block text-sm font-medium text-gray-700">
            Date & Time
          </label>
          <input
            type="datetime-local"
            id="recorded_at"
            value={metric.recorded_at}
            onChange={(e) => setMetric({ ...metric, recorded_at: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={metric.notes}
            onChange={(e) => setMetric({ ...metric, notes: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Adding...</span>
              </div>
            ) : (
              'Add Metric'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}