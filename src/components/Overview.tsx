import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  Wallet,
  Brain,
  Calendar,
  Target
} from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useHealthStore } from '../store/healthStore';
import { useFinanceStore } from '../store/financeStore';

export function Overview() {
  const { tasks } = useTaskStore();
  const { metrics, goals: healthGoals } = useHealthStore();
  const { accounts, transactions, savingsGoals } = useFinanceStore();

  // Calculate overview metrics
  const taskMetrics = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    dueToday: tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.due_date.split('T')[0] === today;
    }).length
  };

  const healthMetrics = {
    activeGoals: healthGoals.filter(g => g.status === 'active').length,
    recentMetrics: metrics.slice(0, 5)
  };

  const financeMetrics = {
    totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    monthlyIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    monthlySavings: savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tasks Due Today</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{taskMetrics.dueToday}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Goals</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{healthMetrics.activeGoals}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Balance</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                ${financeMetrics.totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <Wallet className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Savings</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                ${financeMetrics.monthlySavings.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Today's Tasks */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Today's Tasks</h3>
            <div className="space-y-4">
              {tasks
                .filter(task => {
                  const today = new Date().toISOString().split('T')[0];
                  return task.due_date.split('T')[0] === today;
                })
                .map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-blue-100 p-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Recent Health Metrics */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Health Updates</h3>
            <div className="space-y-4">
              {healthMetrics.recentMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-green-100 p-2">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{metric.metric_type}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(metric.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-lg font-medium text-gray-900">{metric.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Quick Actions */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <Brain className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Add Task</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <Heart className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Log Health Metric</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <Wallet className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Add Transaction</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 ${
                      transaction.type === 'income'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className={`h-4 w-4 ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`} />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}