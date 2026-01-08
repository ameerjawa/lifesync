import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle
} from 'lucide-react';

interface GoalInsightsProps {
  category: 'all' | 'tasks' | 'health' | 'finance';
}

export function GoalInsights({ category }: GoalInsightsProps) {
  // Mock data - replace with actual insights from AI analysis
  const insights = [
    {
      type: 'trend',
      title: 'Improved Completion Rate',
      description: 'Your goal completion rate has increased by 15% this month.',
      trend: 'up',
      category: 'all'
    },
    {
      type: 'suggestion',
      title: 'Break Down Large Goals',
      description: 'Consider breaking down goals into smaller, manageable milestones.',
      category: 'tasks'
    },
    {
      type: 'warning',
      title: 'Health Goals Need Attention',
      description: 'Several health-related goals are falling behind schedule.',
      category: 'health'
    }
  ];

  const getInsightIcon = (type: string, trend?: string) => {
    switch (type) {
      case 'trend':
        return trend === 'up' ? TrendingUp : TrendingDown;
      case 'warning':
        return AlertCircle;
      case 'suggestion':
        return Lightbulb;
      default:
        return Target;
    }
  };

  const getInsightColor = (type: string, trend?: string) => {
    switch (type) {
      case 'trend':
        return trend === 'up'
          ? 'text-green-600 bg-green-100'
          : 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'suggestion':
        return 'text-primary-600 bg-primary-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
        <p className="text-sm text-gray-500">AI-powered recommendations for your goals</p>
      </div>

      <div className="space-y-4">
        {insights
          .filter(insight => category === 'all' || insight.category === category)
          .map((insight, index) => {
            const Icon = getInsightIcon(insight.type, insight.trend);
            const colorClass = getInsightColor(insight.type, insight.trend);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className={`rounded-full p-2 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}