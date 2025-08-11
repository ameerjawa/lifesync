import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Target,
  Calendar,
  Clock,
  Brain,
  Heart,
  Wallet
} from 'lucide-react';
import { useGoalStore } from '../../store/goalStore';
import type { Goal } from '../../lib/types';

interface GoalFormProps {
  onClose: () => void;
}

export function GoalForm({ onClose }: GoalFormProps) {
  const [goal, setGoal] = useState({
    title: '',
    description: '',
    category: 'tasks' as Goal['category'],
    target_date: '',
    milestones: [] as string[],
    reminder_frequency: 'weekly' as Goal['reminder_frequency']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addGoal } = useGoalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!goal.title) throw new Error('Goal title is required');
      if (!goal.target_date) throw new Error('Target date is required');

      await addGoal(goal);
      onClose();
    } catch (error) {
      console.error('Error submitting goal:', error);
      setError(error instanceof Error ? error.message : 'Failed to create goal');
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

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Create New Goal</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Goal Title
          </label>
          <input
            type="text"
            id="title"
            value={goal.title}
            onChange={(e) => setGoal({ ...goal, title: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={goal.description}
            onChange={(e) => setGoal({ ...goal, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={goal.category}
            onChange={(e) => setGoal({ ...goal, category: e.target.value as Goal['category'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="tasks">Tasks</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
            Target Date
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="target_date"
              value={goal.target_date}
              onChange={(e) => setGoal({ ...goal, target_date: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reminder_frequency" className="block text-sm font-medium text-gray-700">
            Reminder Frequency
          </label>
          <select
            id="reminder_frequency"
            value={goal.reminder_frequency}
            onChange={(e) => setGoal({ ...goal, reminder_frequency: e.target.value as Goal['reminder_frequency'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="none">No Reminders</option>
          </select>
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
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Goal'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}