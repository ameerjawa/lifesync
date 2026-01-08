import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import type { Account } from '../../lib/types';

interface AccountFormProps {
  onSubmit: (account: Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function AccountForm({ onSubmit, onClose }: AccountFormProps) {
  const [account, setAccount] = useState({
    name: '',
    type: 'checking' as const,
    balance: '',
    currency: 'USD',
    institution: '',
    account_number: '',
    is_active: true
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
        throw new Error('Please sign up to manage accounts');
      }

      // Check if user has access to finance features
      if (!checkFeatureAccess('finance_tracking')) {
        throw new Error('Please upgrade to access finance features');
      }

      // Validate required fields
      if (!account.name) throw new Error('Account name is required');
      if (!account.balance && account.balance !== '0') {
        throw new Error('Initial balance is required');
      }
      if (!account.type) throw new Error('Account type is required');

      // Format the account data
      const formattedAccount = {
        ...account,
        balance: Number(account.balance),
        is_active: account.is_active ?? true
      };

      await onSubmit(formattedAccount);
      onClose();
    } catch (error) {
      console.error('Error creating account:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
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

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Account</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Account Name
          </label>
          <input
            type="text"
            id="name"
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <select
            id="type"
            value={account.type}
            onChange={(e) => setAccount({ ...account, type: e.target.value as Account['type'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit Card</option>
            <option value="investment">Investment</option>
            <option value="loan">Loan</option>
            <option value="wallet">Digital Wallet</option>
          </select>
        </div>

        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
            Initial Balance
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="balance"
              value={account.balance}
              onChange={(e) => setAccount({ ...account, balance: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            value={account.currency}
            onChange={(e) => setAccount({ ...account, currency: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>

        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
            Financial Institution
          </label>
          <input
            type="text"
            id="institution"
            value={account.institution}
            onChange={(e) => setAccount({ ...account, institution: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Bank or institution name"
          />
        </div>

        <div>
          <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
            Account Number (Optional)
          </label>
          <input
            type="text"
            id="account_number"
            value={account.account_number}
            onChange={(e) => setAccount({ ...account, account_number: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Last 4 digits only"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={account.is_active}
            onChange={(e) => setAccount({ ...account, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Account is active
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
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}