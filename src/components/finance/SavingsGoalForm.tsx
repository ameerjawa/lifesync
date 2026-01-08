import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar } from 'lucide-react';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import type { SavingsGoal } from '../../lib/types';

interface SavingsGoalFormProps {
  onSubmit: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
  accounts: Array<{ id: string; name: string; type: string }>;
}

export function SavingsGoalForm({ onSubmit, onClose, accounts }: SavingsGoalFormProps) {
  const [goal, setGoal] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    account_id: accounts[0]?.id || null,
    auto_save_rule: null,
    is_completed: false
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
        throw new Error('Please sign up to create savings goals');
      }

      // Check if user has access to finance features
      if (!checkFeatureAccess('finance_tracking')) {
        throw new Error('Please upgrade to access savings goals');
      }

      // Validate required fields
      if (!goal.name) throw new Error('Goal name is required');
      if (!goal.target_amount || isNaN(Number(goal.target_amount)) || Number(goal.target_amount) <= 0) {
        throw new Error('Please enter a valid target amount');
      }
      if (!goal.target_date) throw new Error('Target date is required');
      if (new Date(goal.target_date) <= new Date(goal.start_date)) {
        throw new Error('Target date must be after start date');
      }
      if (goal.current_amount && (isNaN(Number(goal.current_amount)) || Number(goal.current_amount) < 0)) {
        throw new Error('Please enter a valid current amount');
      }

      // Format the goal data
      const formattedGoal = {
        ...goal,
        target_amount: Number(goal.target_amount),
        current_amount: Number(goal.current_amount || 0),
        account_id: goal.account_id || null,
        auto_save_rule: goal.auto_save_rule || null,
        is_completed: false
      };

      await onSubmit(formattedGoal);
      onClose();
    } catch (error) {
      console.error('Error submitting savings goal:', error);
      setError(error instanceof Error ? error.message : 'Failed to create savings goal');
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

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Create Savings Goal</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            value={goal.name}
            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700">
            Target Amount
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="target_amount"
              value={goal.target_amount}
              onChange={(e) => setGoal({ ...goal, target_amount: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="current_amount" className="block text-sm font-medium text-gray-700">
            Initial Amount (Optional)
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="current_amount"
              value={goal.current_amount}
              onChange={(e) => setGoal({ ...goal, current_amount: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
            Target Date
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="target_date"
              value={goal.target_date}
              onChange={(e) => setGoal({ ...goal, target_date: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              required
              min={goal.start_date}
            />
          </div>
        </div>

        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">
            Linked Account (Optional)
          </label>
          <select
            id="account"
            value={goal.account_id || ''}
            onChange={(e) => setGoal({ ...goal, account_id: e.target.value || null })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">No linked account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
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
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Goal'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}