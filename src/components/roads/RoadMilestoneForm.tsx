import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import type { Milestone } from '../../lib/types';

interface RoadMilestoneFormProps {
  roadId: string;
  onSubmit: (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function RoadMilestoneForm({ roadId, onSubmit, onClose }: RoadMilestoneFormProps) {
  const [milestone, setMilestone] = useState({
    road_id: roadId,
    title: '',
    description: '',
    position: 0,
    xp_reward: 100,
    is_completed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!milestone.title) throw new Error('Title is required');
      if (!milestone.description) throw new Error('Description is required');
      if (milestone.xp_reward < 0) throw new Error('XP reward must be positive');

      await onSubmit(milestone);
      onClose();
    } catch (error) {
      console.error('Error creating milestone:', error);
      setError(error instanceof Error ? error.message : 'Failed to create milestone');
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

      <div className="mb-6 flex items-center">
        <div className="mr-4 rounded-full bg-primary-100 p-3">
          <Trophy className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Milestone</h3>
          <p className="text-sm text-gray-500">Create a new milestone for your journey</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={milestone.title}
            onChange={(e) => setMilestone({ ...milestone, title: e.target.value })}
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
            value={milestone.description}
            onChange={(e) => setMilestone({ ...milestone, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="number"
            id="position"
            value={milestone.position}
            onChange={(e) => setMilestone({ ...milestone, position: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="xp_reward" className="block text-sm font-medium text-gray-700">
            XP Reward
          </label>
          <input
            type="number"
            id="xp_reward"
            value={milestone.xp_reward}
            onChange={(e) => setMilestone({ ...milestone, xp_reward: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            min="0"
            required
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
            className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Add Milestone'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}