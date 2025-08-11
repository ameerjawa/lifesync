import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, subMonths, subYears, startOfDay } from 'date-fns';
import type { HealthMetric } from '../../lib/types';

interface HealthChartProps {
  metrics: HealthMetric[];
  metricType: HealthMetric['metric_type'];
  dateRange: 'week' | 'month' | 'year' | 'all';
}

export function HealthChart({ metrics, metricType, dateRange }: HealthChartProps) {
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return subDays(now, 7);
      case 'month':
        return subMonths(now, 1);
      case 'year':
        return subYears(now, 1);
      default:
        return new Date(0);
    }
  };

  const filteredMetrics = metrics.filter(metric => 
    new Date(metric.recorded_at) >= getDateRange()
  ).sort((a, b) => 
    new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const data = filteredMetrics.map(metric => ({
    date: startOfDay(new Date(metric.recorded_at)).getTime(),
    value: metric.value
  }));

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (dateRange) {
      case 'week':
        return format(date, 'EEE');
      case 'month':
        return format(date, 'MMM d');
      case 'year':
        return format(date, 'MMM');
      default:
        return format(date, 'MMM yyyy');
    }
  };

  const getUnit = () => {
    switch (metricType) {
      case 'weight':
        return 'kg';
      case 'steps':
        return 'steps';
      case 'sleep':
        return 'hours';
    }
  }
}