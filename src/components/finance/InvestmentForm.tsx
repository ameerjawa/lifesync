import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar } from 'lucide-react';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import type { Investment } from '../../lib/types';

interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function InvestmentForm({ onSubmit, onClose }: InvestmentFormProps) {
  const [investment, setInvestment] = useState({
    name: '',
    type: 'stock' as Investment['type'],
    symbol: '',
    quantity: '',
    purchase_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: '',
    account_id: undefined as string | undefined
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
        throw new Error('Please sign up to manage investments');
      }

      // Check if user has access to investment features
      if (!checkFeatureAccess('finance_tracking')) {
        throw new Error('Please upgrade to access investment features');
      }

      // Validate required fields
      if (!investment.name) throw new Error('Investment name is required');
      if (!investment.type) throw new Error('Investment type is required');
      if (!investment.quantity || isNaN(Number(investment.quantity)) || Number(investment.quantity) <= 0) {
        throw new Error('Please enter a valid quantity');
      }
      if (!investment.purchase_price || isNaN(Number(investment.purchase_price)) || Number(investment.purchase_price) <= 0) {
        throw new Error('Please enter a valid purchase price');
      }
      if (!investment.current_price || isNaN(Number(investment.current_price)) || Number(investment.current_price) <= 0) {
        throw new Error('Please enter a valid current price');
      }
      if (!investment.purchase_date) throw new Error('Purchase date is required');
      if (new Date(investment.purchase_date) > new Date()) {
        throw new Error('Purchase date cannot be in the future');
      }

      // Format the investment data
      const formattedInvestment = {
        ...investment,
        quantity: Number(investment.quantity),
        purchase_price: Number(investment.purchase_price),
        current_price: Number(investment.current_price),
        account_id: investment.account_id || null,
        symbol: investment.symbol.trim().toUpperCase() || null
      };

      await onSubmit(formattedInvestment);
      onClose();
    } catch (error) {
      console.error('Error submitting investment:', error);
      setError(error instanceof Error ? error.message : 'Failed to add investment');
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

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Investment</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Investment Name
          </label>
          <input
            type="text"
            id="name"
            value={investment.name}
            onChange={(e) => setInvestment({ ...investment, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={investment.type}
            onChange={(e) => setInvestment({ ...investment, type: e.target.value as Investment['type'] })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="stock">Stock</option>
            <option value="bond">Bond</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="etf">ETF</option>
            <option value="mutual_fund">Mutual Fund</option>
            <option value="real_estate">Real Estate</option>
          </select>
        </div>

        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
            Symbol/Ticker (Optional)
          </label>
          <input
            type="text"
            id="symbol"
            value={investment.symbol}
            onChange={(e) => setInvestment({ ...investment, symbol: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., AAPL"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={investment.quantity}
            onChange={(e) => setInvestment({ ...investment, quantity: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0.000001"
            step="0.000001"
          />
        </div>

        <div>
          <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">
            Purchase Price
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="purchase_price"
              value={investment.purchase_price}
              onChange={(e) => setInvestment({ ...investment, purchase_price: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="current_price" className="block text-sm font-medium text-gray-700">
            Current Price
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="current_price"
              value={investment.current_price}
              onChange={(e) => setInvestment({ ...investment, current_price: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="purchase_date"
              value={investment.purchase_date}
              onChange={(e) => setInvestment({ ...investment, purchase_date: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={investment.notes}
            onChange={(e) => setInvestment({ ...investment, notes: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
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
                <span className="ml-2">Adding...</span>
              </div>
            ) : (
              'Add Investment'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}