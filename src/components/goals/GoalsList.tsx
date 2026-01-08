import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Brain,
  Heart,
  Wallet,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useGoalStore } from '../../store/goalStore';
import type { Goal } from '../../lib/types';

interface GoalsListProps {
  category: 'all' | 'tasks' | 'health' | 'finance';
  timeframe: 'week' | 'month' | 'year' | 'all';
}

export function GoalsList({ category, timeframe }: GoalsListProps) {
  const { goals, updateGoal, deleteGoal } = useGoalStore();

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'tasks':
        return Brain;
      case 'health':
        return Heart;
      case 'finance':
        return Wallet;
      default:
        return Target;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'tasks':
        return 'text-primary-600 bg-primary-100';
      case 'health':
        return 'text-green-600 bg-green-100';
      case 'finance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter goals based on category and timeframe
  const filteredGoals = goals.filter(goal => {
    // Category filter
    if (category !== 'all' && goal.category !== category) {
      return false;
    }

    // Timeframe filter
    const targetDate = new Date(goal.target_date);
    const now = new Date();
    switch (timeframe) {
      case 'week':
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return targetDate >= now && targetDate <= weekFromNow;
      case 'month':
        const monthFromNow = new Date();
        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
        return targetDate >= now && targetDate <= monthFromNow;
      case 'year':
        const yearFromNow = new Date();
        yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
        return targetDate >= now && targetDate <= yearFromNow;
      default:
        return true;
    }
  });

  const handleStatusChange = async (goal: Goal, newStatus: Goal['status']) => {
    try {
      await updateGoal(goal.id, {
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : goal.progress
      });
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="space-y-4">
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Target className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No goals found</p>
          <p className="text-sm text-gray-400 mt-1">Create a goal to get started</p>
        </div>
      ) : (
        filteredGoals.map((goal) => {
          const Icon = getCategoryIcon(goal.category);
          const colorClass = getCategoryColor(goal.category);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-2 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                    goal.status === 'abandoned' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {goal.status}
                  </span>
                  <div className="relative">
                    <button
                      className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={() => handleStatusChange(goal, 'completed')}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-3 h-5 w-5 text-red-500" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Due {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {goal.progress}% Complete
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      goal.progress >= 100 ? 'bg-green-500' :
                      goal.progress >= 75 ? 'bg-primary-500' :
                      goal.progress >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {goal.milestones && goal.milestones.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Milestones</h5>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
}