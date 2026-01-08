import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { HealthGoal } from '../../lib/types';

interface HealthGoalFormProps {
  onSubmit: (goal: Omit<HealthGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function HealthGoalForm({ onSubmit, onClose }: HealthGoalFormProps) {
  const [goal, setGoal] = useState({
    metric_type: 'weight' as HealthGoal['metric_type'],
    target_value: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...goal,
        target_value: parseFloat(goal.target_value),
        current_value: 0
      });
    } catch (error) {
      console.error('Error submitting goal:', error);
      alert('Failed to add goal. Please try again.');
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

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Set Health Goal</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="metric_type" className="block text-sm font-medium text-gray-700">
            Metric Type
          </label>
          <select
            id="metric_type"
            value={goal.metric_type}
            onChange={(e) => setGoal({ ...goal, metric_type: e.target.value as HealthGoal['metric_type'] })}
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
          <label htmlFor="target_value" className="block text-sm font-medium text-gray-700">
            Target Value
          </label>
          <input
            type="number"
            id="target_value"
            value={goal.target_value}
            onChange={(e) => setGoal({ ...goal, target_value: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            value={goal.start_date}
            onChange={(e) => setGoal({ ...goal, start_date: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            value={goal.end_date}
            onChange={(e) => setGoal({ ...goal, end_date: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
            min={goal.start_date}
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
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
          >
            Set Goal
          </button>
        </div>
      </form>
    </motion.div>
  );
}