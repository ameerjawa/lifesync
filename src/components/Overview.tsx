import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  Wallet,
  Brain,
  Calendar,
  Target,
  Plus
} from 'lucide-react';
import { useTaskStore, useHealthStore, useFinanceStore } from '../store';

export function Overview() {
  const { tasks, addTask } = useTaskStore();
  const { metrics, goals: healthGoals, addMetric } = useHealthStore();
  const { accounts, transactions, savingsGoals, addTransaction } = useFinanceStore();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleQuickAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addTask({
        title: formData.get('title') as string,
        description: formData.get('description') as string || '',
        status: 'todo',
        priority: 'medium',
        due_date: formData.get('due_date') as string || new Date().toISOString(),
      });
      setShowTaskForm(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddHealthMetric = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addMetric({
        metric_type: formData.get('metric_type') as string,
        value: parseFloat(formData.get('value') as string),
        unit: formData.get('unit') as string || '',
        recorded_at: new Date().toISOString(),
      });
      setShowHealthForm(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to add health metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addTransaction({
        account_id: formData.get('account_id') as string,
        type: formData.get('type') as 'income' | 'expense',
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        category: formData.get('category') as string || 'other',
        date: formData.get('date') as string || new Date().toISOString(),
      });
      setShowTransactionForm(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              {!showTaskForm ? (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Brain className="mr-3 h-5 w-5 text-blue-500" />
                    <span className="font-medium text-gray-700">Add Task</span>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400" />
                </button>
              ) : (
                <form onSubmit={handleQuickAddTask} className="rounded-lg border p-4 space-y-3">
                  <input
                    name="title"
                    placeholder="Task title"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    name="due_date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!showHealthForm ? (
                <button
                  onClick={() => setShowHealthForm(true)}
                  className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Heart className="mr-3 h-5 w-5 text-green-500" />
                    <span className="font-medium text-gray-700">Log Health Metric</span>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400" />
                </button>
              ) : (
                <form onSubmit={handleQuickAddHealthMetric} className="rounded-lg border p-4 space-y-3">
                  <select
                    name="metric_type"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select metric type</option>
                    <option value="weight">Weight</option>
                    <option value="steps">Steps</option>
                    <option value="sleep">Sleep (hours)</option>
                    <option value="water">Water (glasses)</option>
                    <option value="exercise">Exercise (minutes)</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      name="value"
                      type="number"
                      step="0.1"
                      placeholder="Value"
                      required
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <input
                      name="unit"
                      placeholder="Unit"
                      className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Logging...' : 'Log'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHealthForm(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!showTransactionForm ? (
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Wallet className="mr-3 h-5 w-5 text-indigo-500" />
                    <span className="font-medium text-gray-700">Add Transaction</span>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400" />
                </button>
              ) : (
                <form onSubmit={handleQuickAddTransaction} className="rounded-lg border p-4 space-y-3">
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input
                    name="description"
                    placeholder="Description"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {accounts.length > 0 && (
                    <select
                      name="account_id"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || accounts.length === 0}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTransactionForm(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                  {accounts.length === 0 && (
                    <p className="text-sm text-red-600">Create an account first</p>
                  )}
                </form>
              )}
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