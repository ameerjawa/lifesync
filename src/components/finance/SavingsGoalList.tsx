import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import type { SavingsGoal } from '../../lib/types';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
}

export function SavingsGoalList({ goals }: SavingsGoalListProps) {
  const calculateTimeRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} left`;
    } else if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} left`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    }
  };

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <div className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Target className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No savings goals yet</p>
          <p className="text-sm text-gray-400 mt-1">Create a goal to start tracking your savings</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
          {goals.map((goal, index) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const remaining = goal.target_amount - goal.current_amount;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="rounded-full bg-indigo-100 p-2 mr-3">
                      <Target className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{goal.name}</h4>
                      <p className="text-sm text-gray-500">
                        {calculateTimeRemaining(goal.target_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      ${goal.current_amount.toLocaleString()} of ${goal.target_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-indigo-600 font-medium">
                      ${remaining.toLocaleString()} to go
                    </p>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        progress >= 100
                          ? 'bg-green-500'
                          : progress >= 75
                          ? 'bg-indigo-500'
                          : progress >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}