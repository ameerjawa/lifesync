import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  Target,
  Plus,
  Filter,
  Calendar,
  BarChart2,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { AccountList } from './AccountList';
import { TransactionList } from './TransactionList';
import { BudgetOverview } from './BudgetOverview';
import { SavingsGoalList } from './SavingsGoalList';
import { InvestmentDashboard } from './InvestmentDashboard';
import { FinanceAnalytics } from './FinanceAnalytics';
import { TransactionForm } from './TransactionForm';
import { AccountsOverview } from './AccountsOverview';
import { SavingsGoalForm } from './SavingsGoalForm';

export function FinanceDashboard() {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isAddingSavingsGoal, setIsAddingSavingsGoal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'budgets' | 'analytics'>('overview');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    type: [] as string[],
    dateRange: {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined
    },
    categories: [] as string[],
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    accounts,
    transactions,
    budgets,
    savingsGoals,
    investments,
    selectedDateRange,
    isLoading,
    loadAccounts,
    loadTransactions,
    loadBudgets,
    loadSavingsGoals,
    loadInvestments,
    setDateRange,
    addTransaction,
    addInvestment,
    addBudget,
    addSavingsGoal,
    categories,
    filterAndSortTransactions
  } = useFinanceStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filterAndSortTransactions) {
      filterAndSortTransactions(filters, sortBy, sortDirection);
    }
  }, [filters, sortBy, sortDirection, filterAndSortTransactions]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadAccounts(),
        loadTransactions(),
        loadBudgets(),
        loadSavingsGoals(),
        loadInvestments()
      ]);
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  };

  const handleDateRangeChange = (range: typeof selectedDateRange) => {
    setDateRange(range);
    // Calculate date range based on selection
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined = now;

    switch (range) {
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'all':
        start = undefined;
        end = undefined;
        break;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      // If clicking the same sort field, toggle direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new sort field, set it with default desc direction
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const handleFilterChange = (filterUpdates: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...filterUpdates
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      dateRange: {
        start: undefined,
        end: undefined
      },
      categories: [],
      search: ''
    });
    setShowFilters(false);
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
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Finance</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* View Mode Tabs */}
          <div className="flex overflow-x-auto rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                activeTab === 'investments'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Investments
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                activeTab === 'budgets'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Budgets
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <select
              value={selectedDateRange}
              onChange={(e) => handleDateRangeChange(e.target.value as any)}
              className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="description">Sort by Description</option>
              </select>
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                {sortDirection === 'asc' ? (
                  <SortAsc className="h-5 w-5" />
                ) : (
                  <SortDesc className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center rounded-lg px-4 py-2 ${
                showFilters ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="mr-2 h-5 w-5" />
              Filter
              {Object.values(filters).some(v => 
                Array.isArray(v) ? v.length > 0 : Boolean(v)
              ) && (
                <span className="ml-2 rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                  Active
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAddingTransaction(true)}
              className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="rounded-lg bg-white p-6 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transaction Type Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Type</h4>
              <div className="space-y-2">
                {['income', 'expense', 'transfer'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.type, type]
                          : filters.type.filter(t => t !== type);
                        handleFilterChange({ type: newTypes });
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...filters.categories, category.id]
                          : filters.categories.filter(c => c !== category.id);
                        handleFilterChange({ categories: newCategories });
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Search</h4>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Search transactions..."
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Accounts Overview */}
            <AccountsOverview />

            {/* Recent Transactions */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="text-sm text-primary-600 hover:text-primary-500">
                  View All
                </button>
              </div>
              <TransactionList
                transactions={transactions.slice(0, 5)}
                categories={categories}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Budget Overview */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <BudgetOverview
                budgets={budgets}
                transactions={transactions}
                categories={categories}
                addBudget={addBudget}
              />
            </div>

            {/* Savings Goals */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
                <button 
                  onClick={() => setIsAddingSavingsGoal(true)}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Add Goal
                </button>
              </div>
              <SavingsGoalList goals={savingsGoals} />
            </div>
          </div>
        </div>
      )}

      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <InvestmentDashboard
          investments={investments}
          onAddInvestment={addInvestment}
        />
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <BudgetOverview
            budgets={budgets}
            transactions={transactions}
            categories={categories}
            addBudget={addBudget}
          />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <FinanceAnalytics
          transactions={transactions}
          budgets={budgets}
          savingsGoals={savingsGoals}
          investments={investments}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setDateRange}
        />
      )}

      {/* Modals */}
      {(isAddingTransaction || isAddingSavingsGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
          <div className="min-h-[50vh] max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white">
            {isAddingTransaction && (
              <TransactionForm
                accounts={accounts}
                categories={categories}
                onSubmit={addTransaction}
                onClose={() => setIsAddingTransaction(false)}
              />
            )}
            {isAddingSavingsGoal && (
              <SavingsGoalForm
                accounts={accounts}
                onSubmit={addSavingsGoal}
                onClose={() => setIsAddingSavingsGoal(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}