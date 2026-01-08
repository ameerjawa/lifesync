import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Calendar,
  Brain,
  Heart,
  Wallet,
  Filter,
  Target,
  Sparkles
} from 'lucide-react';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function AnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [activeView, setActiveView] = useState<'overview' | 'spending' | 'health' | 'tasks'>('overview');

  // Mock data - replace with actual data from stores
  const taskData = [
    { month: 'Jan', completed: 12, total: 15 },
    { month: 'Feb', completed: 15, total: 18 },
    { month: 'Mar', completed: 10, total: 14 }
  ];

  const healthData = [
    { name: 'Exercise', value: 35 },
    { name: 'Sleep', value: 25 },
    { name: 'Nutrition', value: 20 },
    { name: 'Mindfulness', value: 20 }
  ];

  const financeData = [
    { month: 'Jan', income: 5000, expenses: 3500, savings: 1500 },
    { month: 'Feb', income: 5500, expenses: 3800, savings: 1700 },
    { month: 'Mar', income: 4800, expenses: 3200, savings: 1600 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
              <p className="mt-2 text-primary-100">Track your progress across all areas</p>
            </div>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="rounded-lg border-0 bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus:ring-2 focus:ring-white/40"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3')] opacity-10"></div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: 'overview', name: 'Overview', icon: BarChart2, gradient: 'from-primary-500 to-primary-500' },
          { id: 'tasks', name: 'Tasks', icon: Brain, gradient: 'from-blue-500 to-cyan-500' },
          { id: 'health', name: 'Health', icon: Heart, gradient: 'from-rose-500 to-pink-500' },
          { id: 'spending', name: 'Finance', icon: Wallet, gradient: 'from-emerald-500 to-teal-500' }
        ].map(category => (
          <motion.button
            key={category.id}
            onClick={() => setActiveView(category.id as any)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center rounded-xl p-4 text-white transition-all ${
              activeView === category.id 
                ? `bg-gradient-to-r ${category.gradient} ring-4 ring-primary-200` 
                : `bg-gradient-to-r ${category.gradient} opacity-80 hover:opacity-100`
            }`}
          >
            <category.icon className="mr-3 h-6 w-6" />
            <span className="text-lg font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <Target className="mb-4 h-8 w-8 text-primary-600" />
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Active Goals</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <TrendingUp className="mb-4 h-8 w-8 text-green-600" />
            <p className="text-3xl font-bold text-gray-900">75%</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Success Rate</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <Calendar className="mb-4 h-8 w-8 text-orange-600" />
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Due This Week</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <Sparkles className="mb-4 h-8 w-8 text-primary-600" />
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Achievements</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Chart */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#4F46E5"
                    activeDot={{ r: 8 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    activeDot={{ r: 8 }}
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#10B981"
                    activeDot={{ r: 8 }}
                    name="Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Distribution */}
        <div className="col-span-12 lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Activity Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Task Progress */}
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Task Completion</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#4F46E5" name="Completed" />
                  <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}