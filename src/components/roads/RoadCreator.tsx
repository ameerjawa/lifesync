import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Sparkles, X } from 'lucide-react';
import { useGoalStore } from '../../store/goalStore';
import type { Road } from '../../lib/types';

interface RoadCreatorProps {
  onSubmit: (road: Omit<Road, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function RoadCreator({ onSubmit, onClose }: RoadCreatorProps) {
  const [road, setRoad] = useState({
    title: '',
    description: '',
    theme: 'futuristic' as Road['theme'],
    goal_id: '',
    progress: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { goals, loadGoals } = useGoalStore();

  // Load goals when component mounts
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!road.title) throw new Error('Title is required');
      if (!road.description) throw new Error('Description is required');
      if (!road.goal_id) throw new Error('Please select a goal');

      await onSubmit(road);
      onClose();
    } catch (error) {
      console.error('Error creating road:', error);
      setError(error instanceof Error ? error.message : 'Failed to create road');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out completed goals
  const availableGoals = goals.filter(goal => goal.status === 'active');

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

      <div className="mb-6 flex items-center">
        <div className="mr-4 rounded-full bg-primary-100 p-3">
          <Map className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Road</h3>
          <p className="text-sm text-gray-500">Design your journey to success</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Select Goal
          </label>
          <select
            id="goal"
            value={road.goal_id}
            onChange={(e) => setRoad({ ...road, goal_id: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Select a goal</option>
            {availableGoals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title} ({goal.category})
              </option>
            ))}
          </select>
          {availableGoals.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              No active goals available. Create a goal first to create a road.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Road Title
          </label>
          <input
            type="text"
            id="title"
            value={road.title}
            onChange={(e) => setRoad({ ...road, title: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={road.description}
            onChange={(e) => setRoad({ ...road, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            value={road.theme}
            onChange={(e) => setRoad({ ...road, theme: e.target.value as Road['theme'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="futuristic">Futuristic</option>
            <option value="nature">Nature</option>
            <option value="minimalistic">Minimalistic</option>
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
            disabled={isSubmitting || availableGoals.length === 0}
            className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Road
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}