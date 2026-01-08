import React from 'react';
import { useLocation } from 'react-router-dom';
import { Brain, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useAIAssistant } from '../AIAssistantProvider';
import { useTaskStore, useHealthStore, useFinanceStore } from '../../../store';

export function InsightsView() {
  const location = useLocation();
  const { analysisData } = useAIAssistant();
  const { tasks } = useTaskStore();
  const { metrics: healthMetrics, goals: healthGoals } = useHealthStore();
  const { transactions, budgets } = useFinanceStore();

  const getInsights = () => {
    const path = location.pathname;

    if (path.includes('tasks')) {
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
      
      return {
        metricData: [
          { label: 'Total Tasks', value: tasks.length },
          { label: 'Completion Rate', value: `${completionRate}%` }
        ],
        insights: analysisData?.insights || [],
        recommendations: analysisData?.recommendations || []
      };
    }

    if (path.includes('health')) {
      const activeGoals = healthGoals.filter(g => g.status === 'active').length;
      const recentMetrics = healthMetrics.slice(0, 5);
      
      return {
        metricData: [
          { label: 'Active Goals', value: activeGoals },
          { label: 'Tracked Metrics', value: healthMetrics.length }
        ],
        insights: recentMetrics.map(m => `${m.metric_type}: ${m.value}`),
        recommendations: [
          'Track metrics regularly for better insights',
          'Set realistic health goals',
          'Monitor your progress weekly'
        ]
      };
    }

    if (path.includes('finance')) {
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        metricData: [
          { label: 'Total Income', value: `$${totalIncome.toLocaleString()}` },
          { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}` }
        ],
        insights: [
          `Net savings: $${(totalIncome - totalExpenses).toLocaleString()}`,
          `Savings rate: ${totalIncome ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%`
        ],
        recommendations: [
          'Review your budget allocations',
          'Track expenses by category',
          'Set up automatic savings'
        ]
      };
    }

    // Default overview insights
    return {
      metricData: [
        { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'completed').length },
        { label: 'Health Goals', value: healthGoals.length },
        { label: 'Active Budgets', value: budgets.length }
      ],
      insights: [
        'Track your progress across all areas',
        'Set goals for better results',
        'Monitor your metrics regularly'
      ],
      recommendations: [
        'Review your dashboard daily',
        'Set realistic goals',
        'Use the AI assistant for help'
      ]
    };
  };

  const { metricData, insights, recommendations } = getInsights();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metricData.map((metric, index) => (
          <div key={index} className="rounded-lg bg-primary-50 p-4">
            <h4 className="font-medium text-primary-900">{metric.label}</h4>
            <p className="mt-2 text-2xl font-bold text-primary-600">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <Brain className="h-5 w-5 text-primary-600 flex-shrink-0" />
              <p className="text-gray-600">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-gray-600">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}