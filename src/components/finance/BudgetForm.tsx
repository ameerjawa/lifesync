import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar } from 'lucide-react';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import type { Budget } from '../../lib/types';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
  categories: { id: string; name: string; type: string }[];
}

export function BudgetForm({ onSubmit, onClose, categories = [] }: BudgetFormProps) {
  const [budget, setBudget] = useState({
    category_id: categories[0]?.id || null,
    period: 'monthly' as const,
    amount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    rollover: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isGuest, setReturnPath } = useGuestStore();
  const { checkFeatureAccess } = useSubscriptionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Check if user is guest
      if (isGuest) {
        setReturnPath('/dashboard');
        throw new Error('Please sign up to manage budgets');
      }

      // Check if user has access to finance features
      if (!checkFeatureAccess('finance_tracking')) {
        throw new Error('Please upgrade to access budget features');
      }

      // Validate required fields
      if (!budget.amount || isNaN(Number(budget.amount))) {
        throw new Error('Please enter a valid budget amount');
      }
      if (!budget.period) throw new Error('Budget period is required');
      if (!budget.start_date) throw new Error('Start date is required');
      if (budget.end_date && new Date(budget.end_date) < new Date(budget.start_date)) {
        throw new Error('End date must be after start date');
      }

      // Format the budget data
      const formattedBudget = {
        ...budget,
        amount: Number(budget.amount),
        category_id: budget.category_id || null,
        end_date: budget.end_date || null,
        rollover: budget.rollover || false
      };

      await onSubmit(formattedBudget);
      onClose();
    } catch (error) {
      console.error('Error submitting budget:', error);
      setError(error instanceof Error ? error.message : 'Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Create Budget</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category (Optional)
          </label>
          <select
            id="category"
            value={budget.category_id || ''}
            onChange={(e) => setBudget({ ...budget, category_id: e.target.value || null })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700">
            Period
          </label>
          <select
            id="period"
            value={budget.period}
            onChange={(e) => setBudget({ ...budget, period: e.target.value as Budget['period'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              value={budget.amount}
              onChange={(e) => setBudget({ ...budget, amount: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="start_date"
              value={budget.start_date}
              onChange={(e) => setBudget({ ...budget, start_date: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            End Date (Optional)
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="end_date"
              value={budget.end_date}
              onChange={(e) => setBudget({ ...budget, end_date: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              min={budget.start_date}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rollover"
            checked={budget.rollover}
            onChange={(e) => setBudget({ ...budget, rollover: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="rollover" className="ml-2 block text-sm text-gray-700">
            Roll over unused budget to next period
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Budget'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}