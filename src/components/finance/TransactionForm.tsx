import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, DollarSign } from 'lucide-react';
import type { Account, Category, Transaction } from '../../lib/types';

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function TransactionForm({ accounts, categories, onSubmit, onClose }: TransactionFormProps) {
  const [transaction, setTransaction] = useState({
    account_id: accounts[0]?.id || '', // Set default account if available
    category_id: '',
    type: 'expense' as const,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed' as const,
    notes: '',
    is_recurring: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!transaction.account_id) throw new Error('Please select an account');
      if (!transaction.amount) throw new Error('Please enter an amount');
      if (!transaction.description) throw new Error('Please enter a description');
      if (!transaction.date) throw new Error('Please select a date');

      // Format the transaction data
      const formattedTransaction = {
        ...transaction,
        amount: Number(transaction.amount),
        date: new Date(transaction.date).toISOString(),
        category_id: transaction.category_id || null // Allow null for category_id
      };

      await onSubmit(formattedTransaction);
      onClose();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setError(error instanceof Error ? error.message : 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              value={transaction.type}
              onChange={(e) => setTransaction({ ...transaction, type: e.target.value as Transaction['type'] })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <select
              id="account"
              value={transaction.account_id}
              onChange={(e) => setTransaction({ ...transaction, account_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={transaction.category_id}
              onChange={(e) => setTransaction({ ...transaction, category_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories
                .filter((category) => category.type === transaction.type)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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
                value={transaction.amount}
                onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={transaction.description}
              onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                value={transaction.date}
                onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={transaction.notes}
              onChange={(e) => setTransaction({ ...transaction, notes: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_recurring"
              checked={transaction.is_recurring}
              onChange={(e) => setTransaction({ ...transaction, is_recurring: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-700">
              This is a recurring transaction
            </label>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-6 flex justify-end space-x-3">
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
                  <span className="ml-2">Adding...</span>
                </div>
              ) : (
                'Add Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}