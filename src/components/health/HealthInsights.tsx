import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trophy,
  LineChart,
  Lightbulb
} from 'lucide-react';
import type { HealthInsight } from '../../lib/types';

interface HealthInsightsProps {
  insights: HealthInsight[];
}

export function HealthInsights({ insights }: HealthInsightsProps) {
  const getIcon = (insight: HealthInsight) => {
    if (insight.type === 'achievement') return Trophy;
    if (insight.type === 'trend') {
      if (insight.trend === 'up') return TrendingUp;
      if (insight.trend === 'down') return TrendingDown;
      return Minus;
    }
    return Lightbulb;
  };

  const getColor = (insight: HealthInsight) => {
    if (insight.type === 'achievement') return 'text-yellow-600 bg-yellow-100';
    if (insight.type === 'trend') {
      if (insight.trend === 'up') return 'text-green-600 bg-green-100';
      if (insight.trend === 'down') return 'text-red-600 bg-red-100';
      return 'text-blue-600 bg-blue-100';
    }
    return 'text-primary-600 bg-primary-100';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight);
          const color = getColor(insight);
          
          return (
            <motion.div
              key={`${insight.type}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <div className={`rounded-full p-3 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{insight.description}</p>
                  {insight.metric_type && (
                    <p className="mt-2 text-xs text-gray-500">
                      {insight.metric_type.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}