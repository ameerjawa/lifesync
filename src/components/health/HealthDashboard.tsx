import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  Scale,
  Moon,
  Droplets,
  Smile,
  Heart,
  Target,
  TrendingUp,
  Plus,
  Calendar
} from 'lucide-react';
import { useHealthStore } from '../../store/healthStore';
import { HealthMetricForm } from './HealthMetricForm';
import { HealthGoalForm } from './HealthGoalForm';
import { HealthChart } from './HealthChart';
import { HealthInsights } from './HealthInsights';
import type { HealthMetric } from '../../lib/types';

const metricTypes: Array<{
  type: string;
  label: string;
  icon: React.ElementType;
  unit: string;
  color: string;
  gradient: string;
}> = [
  { type: 'weight', label: 'Weight', icon: Scale, unit: 'kg', color: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500' },
  { type: 'steps', label: 'Steps', icon: Activity, unit: 'steps', color: 'text-green-600', gradient: 'from-green-500 to-emerald-500' },
  { type: 'sleep', label: 'Sleep', icon: Moon, unit: 'hours', color: 'text-primary-600', gradient: 'from-primary-500 to-primary-500' },
  { type: 'water', label: 'Water', icon: Droplets, unit: 'ml', color: 'text-cyan-600', gradient: 'from-cyan-500 to-blue-500' },
  { type: 'mood', label: 'Mood', icon: Smile, unit: 'rating', color: 'text-yellow-600', gradient: 'from-yellow-500 to-orange-500' },
  { type: 'exercise', label: 'Exercise', icon: Activity, unit: 'minutes', color: 'text-red-600', gradient: 'from-red-500 to-rose-500' },
  { type: 'heart_rate', label: 'Heart Rate', icon: Heart, unit: 'bpm', color: 'text-pink-600', gradient: 'from-pink-500 to-rose-500' },
  { type: 'blood_pressure', label: 'Blood Pressure', icon: Heart, unit: 'mmHg', color: 'text-rose-600', gradient: 'from-rose-500 to-red-500' }
];

export function HealthDashboard() {
  const [isAddingMetric, setIsAddingMetric] = React.useState(false);
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [selectedMetricType, setSelectedMetricType] = React.useState<HealthMetric['metric_type']>('weight');

  const {
    metrics,
    goals,
    insights,
    selectedDateRange,
    isLoading,
    loadMetrics,
    addMetric,
    loadGoals,
    addGoal,
    generateInsights,
    setDateRange
  } = useHealthStore();

  useEffect(() => {
    loadMetrics();
    loadGoals();
  }, []);

  useEffect(() => {
    if (metrics.length > 0) {
      generateInsights();
    }
  }, [metrics, goals]);

  const getLatestMetric = (type: HealthMetric['metric_type']) => {
    return metrics
      .filter(m => m.metric_type === type)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Health Tracking</h2>
              <p className="mt-2 text-primary-100">Monitor and improve your well-being</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAddingGoal(true)}
                className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white shadow-md transition-all hover:bg-green-400"
              >
                <Target className="mr-2 h-5 w-5" />
                Set Goal
              </button>
              <button
                onClick={() => setIsAddingMetric(true)}
                className="flex items-center rounded-lg bg-white px-4 py-2 text-primary-600 shadow-md transition-all hover:bg-primary-50"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Metric
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3')] opacity-10"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricTypes.slice(0, 4).map((metricType, index) => {
          const latest = getLatestMetric(metricType.type);
          const Icon = metricType.icon;
          
          return (
            <motion.div
              key={metricType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
              onClick={() => setSelectedMetricType(metricType.type)}
            >
              <div className="relative z-10">
                <div className={`mb-4 inline-flex rounded-xl bg-${metricType.color.split('-')[1]}-100 p-3`}>
                  <Icon className={`h-6 w-6 ${metricType.color}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {latest ? `${latest.value} ${metricType.unit}` : '--'}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">{metricType.label}</p>
                {latest && (
                  <p className="mt-2 text-xs text-gray-400">
                    Last updated: {new Date(latest.recorded_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${metricType.gradient} opacity-0 transition-opacity group-hover:opacity-5 rounded-2xl`}></div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Chart */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Trends</h3>
              <select
                value={selectedDateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <HealthChart
              metrics={metrics.filter(m => m.metric_type === selectedMetricType)}
              metricType={selectedMetricType}
              dateRange={selectedDateRange}
            />
          </motion.div>
        </div>

        {/* Insights */}
        <div className="col-span-12 lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <HealthInsights insights={insights} />
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {(isAddingMetric || isAddingGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          {isAddingMetric ? (
            <HealthMetricForm
              onSubmit={async (metric) => {
                await addMetric(metric);
                setIsAddingMetric(false);
              }}
              onClose={() => setIsAddingMetric(false)}
            />
          ) : (
            <HealthGoalForm
              onSubmit={async (goal) => {
                await addGoal(goal);
                setIsAddingGoal(false);
              }}
              onClose={() => setIsAddingGoal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}