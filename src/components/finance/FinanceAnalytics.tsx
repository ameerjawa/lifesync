import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Calendar,
  Brain,
  Heart,
  Wallet,
  Filter
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
import type { Transaction, Budget, SavingsGoal, Investment } from '../../lib/types';

interface FinanceAnalyticsProps {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  selectedDateRange: 'week' | 'month' | 'year' | 'all';
  onDateRangeChange: (range: 'week' | 'month' | 'year' | 'all') => void;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function FinanceAnalytics({
  transactions,
  budgets,
  savingsGoals,
  investments,
  selectedDateRange,
  onDateRangeChange
}: FinanceAnalyticsProps) {
  const [activeView, setActiveView] = useState<'overview' | 'spending' | 'budgets' | 'investments'>('overview');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  useEffect(() => {
    // Filter transactions based on date range
    const now = new Date();
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      switch (selectedDateRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return transactionDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return transactionDate >= yearAgo;
        default:
          return true;
      }
    });
    setFilteredTransactions(filtered);
  }, [transactions, selectedDateRange]);

  // Calculate spending metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Prepare spending by category data
  const spendingByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare monthly spending data
  const monthlySpending = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlySpending).map(([month, amount]) => ({
    month,
    amount
  }));

  // Calculate budget progress
  const budgetProgress = budgets.map(budget => {
    const spent = filteredTransactions
      .filter(t => 
        t.type === 'expense' &&
        t.category_id === budget.category_id
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: budget.category?.name || 'All Categories',
      budget: budget.amount,
      spent,
      remaining: budget.amount - spent
    };
  });

  // Calculate investment performance
  const investmentPerformance = investments.map(inv => {
    const currentValue = inv.quantity * inv.current_price;
    const costBasis = inv.quantity * inv.purchase_price;
    const returnValue = currentValue - costBasis;
    const returnPercentage = (returnValue / costBasis) * 100;

    return {
      name: inv.name,
      value: currentValue,
      return: returnValue,
      returnPercentage
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <div className="flex flex-wrap gap-2 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                activeView === 'overview'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <BarChart2 className="mr-2 h-5 w-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveView('spending')}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                activeView === 'spending'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Spending
            </button>
            <button
              onClick={() => setActiveView('budgets')}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                activeView === 'budgets'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Brain className="mr-2 h-5 w-5" />
              Budgets
            </button>
            <button
              onClick={() => setActiveView('investments')}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                activeView === 'investments'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Investments
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange(e.target.value as any)}
            className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Overview */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Total Income</h4>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                ${totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
              <p className="mt-2 text-3xl font-semibold text-red-600">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Net Savings</h4>
              <div className="mt-2 flex items-baseline">
                <p className={`text-3xl font-semibold ${
                  netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(netSavings).toLocaleString()}
                </p>
                <p className={`ml-2 text-sm ${
                  netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Investment Returns</h4>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-green-600">
                  ${investmentPerformance.reduce((sum, inv) => sum + inv.return, 0).toLocaleString()}
                </p>
                <p className="ml-2 text-sm text-green-600">
                  {(investmentPerformance.reduce((sum, inv) => sum + inv.returnPercentage, 0) / investmentPerformance.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Spending Trend */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Monthly Spending Trend</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#4F46E5"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending by Category */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Spending by Category</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spending Analysis */}
      {activeView === 'spending' && (
        <div className="space-y-6">
          {/* Spending by Category Chart */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Spending by Category</h4>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Budget Analysis */}
      {activeView === 'budgets' && (
        <div className="space-y-6">
          {/* Budget Progress */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Budget Progress</h4>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spent" stackId="a" fill="#EF4444" name="Spent" />
                  <Bar dataKey="remaining" stackId="a" fill="#10B981" name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Investment Analysis */}
      {activeView === 'investments' && (
        <div className="space-y-6">
          {/* Asset Allocation */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Investment Performance</h4>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4F46E5" name="Current Value" />
                  <Bar dataKey="return" fill="#10B981" name="Return" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}