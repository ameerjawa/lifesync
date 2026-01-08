import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BudgetForm } from './BudgetForm';
import type { Budget, Transaction } from '../../lib/types';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: { id: string; name: string; type: string }[];
  addBudget: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function BudgetOverview({ budgets = [], transactions = [], categories = [], addBudget }: BudgetOverviewProps) {
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateBudgetProgress = (budget: Budget) => {
    const startDate = new Date(budget.start_date);
    const endDate = budget.end_date ? new Date(budget.end_date) : new Date();

    const budgetTransactions = transactions.filter(t =>
      t.type === 'expense' &&
      t.category_id === budget.category_id &&
      new Date(t.date) >= startDate &&
      new Date(t.date) <= endDate
    );

    const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
    const progress = (spent / budget.amount) * 100;

    return {
      spent,
      remaining: budget.amount - spent,
      progress: Math.min(progress, 100)
    };
  };

  const handleAddBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      await addBudget(budget);
      setIsAddingBudget(false);
    } catch (error) {
      console.error('Error adding budget:', error);
      setError(error instanceof Error ? error.message : 'Failed to add budget');
      throw error; // Re-throw to let BudgetForm handle the error state
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
        <button
          onClick={() => setIsAddingBudget(true)}
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Manage Budgets
        </button>
      </div>

      {budgets.map((budget, index) => {
        const { spent, remaining, progress } = calculateBudgetProgress(budget);
        const isOverBudget = spent > budget.amount;

        return (
          <motion.div
            key={budget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {budget.category?.name || 'All Categories'}
              </h4>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  ${spent.toLocaleString()} of ${budget.amount.toLocaleString()}
                </p>
                <p className={`text-sm ${
                  isOverBudget ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isOverBudget
                    ? `$${Math.abs(remaining).toLocaleString()} over`
                    : `$${remaining.toLocaleString()} left`
                }
                </p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full rounded-full ${
                  isOverBudget
                    ? 'bg-red-600'
                    : progress > 80
                    ? 'bg-yellow-600'
                    : 'bg-green-600'
                }`}
              />
            </div>
          </motion.div>
        );
      })}

      {budgets.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <p className="text-gray-500">No budgets set up yet.</p>
          <button
            onClick={() => setIsAddingBudget(true)}
            className="mt-2 text-primary-600 hover:text-primary-500"
          >
            Create your first budget
          </button>
        </div>
      )}

      {isAddingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BudgetForm
            categories={categories}
            onSubmit={handleAddBudget}
            onClose={() => setIsAddingBudget(false)}
          />
        </div>
      )}
    </div>
  );
}