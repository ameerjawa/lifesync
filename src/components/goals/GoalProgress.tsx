import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface GoalProgressProps {
  category: 'all' | 'tasks' | 'health' | 'finance';
}

export function GoalProgress({ category }: GoalProgressProps) {
  // Mock data - replace with actual data from store
  const progress = {
    total: 20,
    completed: 8,
    inProgress: 10,
    notStarted: 2,
    upcomingDeadlines: [
      { id: '1', title: 'Complete Project Milestones', due: '2025-03-01' },
      { id: '2', title: 'Reach Target Weight', due: '2025-04-15' }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
        <p className="text-sm text-gray-500">Track your goal completion rate</p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round((progress.completed / progress.total) * 100)}%
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {progress.inProgress}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <h4 className="mb-4 font-medium text-gray-900">Upcoming Deadlines</h4>
        <div className="space-y-3">
          {progress.upcomingDeadlines.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
            >
              <div className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {goal.title}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(goal.due).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}