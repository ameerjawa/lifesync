import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Calendar,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('month');
  const [metric, setMetric] = useState('users');

  // Mock data - replace with real data from your analytics service
  const userMetrics = {
    totalUsers: 1250,
    activeUsers: 980,
    churnRate: 2.3,
    userGrowth: 15.2,
    averageSessionTime: '12m 30s',
    retentionRate: 85
  };

  const revenueMetrics = {
    totalRevenue: 156000,
    mrr: 15600,
    arr: 187200,
    averageRevenue: 125,
    lifetimeValue: 850,
    acquisitionCost: 50
  };

  const usageMetrics = {
    tasksCreated: 12500,
    goalsCompleted: 4500,
    activeProjects: 850,
    averageTasksPerUser: 25,
    averageGoalsPerUser: 5
  };

  const timeSeriesData = [
    { date: '2025-01', users: 800, revenue: 12000, tasks: 8000 },
    { date: '2025-02', users: 950, revenue: 13500, tasks: 9500 },
    { date: '2025-03', users: 1100, revenue: 14800, tasks: 11000 },
    { date: '2025-04', users: 1250, revenue: 15600, tasks: 12500 }
  ];

  const planDistribution = [
    { name: 'Free', value: 900 },
    { name: 'Premium', value: 320 },
    { name: 'Enterprise', value: 30 }
  ];

  const featureUsage = [
    { name: 'Task Management', usage: 95 },
    { name: 'Goal Tracking', usage: 85 },
    { name: 'Health Analytics', usage: 75 },
    { name: 'Financial Planning', usage: 65 }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>

          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="users">Users</option>
            <option value="revenue">Revenue</option>
            <option value="usage">Usage</option>
          </select>

          <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
        </div>

        <button className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{userMetrics.totalUsers}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">{userMetrics.userGrowth}% growth</span>
            <span className="ml-2 text-gray-500">vs. last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">${revenueMetrics.mrr}</p>
            </div>
            <div className="rounded-full bg-primary-100 p-3">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">8.2% growth</span>
            <span className="ml-2 text-gray-500">vs. last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{userMetrics.activeUsers}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
            <span className="text-red-500">{userMetrics.churnRate}% churn</span>
            <span className="ml-2 text-gray-500">this month</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Growth Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Growth Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Feature Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Retention Rate</span>
                <span className="font-medium text-gray-900">{userMetrics.retentionRate}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${userMetrics.retentionRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Avg. Session Time</span>
                <span className="font-medium text-gray-900">{userMetrics.averageSessionTime}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-primary-500" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Avg. Revenue/User</span>
              <span className="font-medium text-gray-900">${revenueMetrics.averageRevenue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Lifetime Value</span>
              <span className="font-medium text-gray-900">${revenueMetrics.lifetimeValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Acquisition Cost</span>
              <span className="font-medium text-gray-900">${revenueMetrics.acquisitionCost}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}