import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar, Receipt, Tag } from 'lucide-react';
import type { BusinessExpense, BusinessProject } from '../../lib/types';

interface BusinessExpenseFormProps {
  projects: BusinessProject[];
  onSubmit: (expense: Omit<BusinessExpense, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessExpenseForm({ projects, onSubmit, onClose }: BusinessExpenseFormProps) {
  const [expense, setExpense] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    project_id: '',
    tax_deductible: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = [
    'Office Supplies',
    'Software & Tools',
    'Marketing & Advertising',
    'Travel & Transportation',
    'Meals & Entertainment',
    'Professional Services',
    'Equipment',
    'Rent & Utilities',
    'Insurance',
    'Training & Education',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!expense.category) throw new Error('Category is required');
      if (!expense.description) throw new Error('Description is required');
      if (!expense.amount || Number(expense.amount) <= 0) throw new Error('Valid amount is required');
      if (!expense.date) throw new Error('Date is required');

      await onSubmit({
        ...expense,
        amount: Number(expense.amount),
        project_id: expense.project_id || undefined
      });
      onClose();
    } catch (error) {
      console.error('Error submitting expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-6 flex items-center">
        <div className="mr-4 rounded-full bg-indigo-100 p-3">
          <DollarSign className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add New Expense</h3>
          <p className="text-sm text-gray-500">Record a business expense</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="category"
                value={expense.category}
                onChange={(e) => setExpense({ ...expense, category: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount *
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                value={expense.amount}
                onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                value={expense.date}
                onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
              Vendor
            </label>
            <input
              type="text"
              id="vendor"
              value={expense.vendor}
              onChange={(e) => setExpense({ ...expense, vendor: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            value={expense.description}
            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">
            Related Project
          </label>
          <select
            id="project"
            value={expense.project_id}
            onChange={(e) => setExpense({ ...expense, project_id: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">No Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="tax_deductible"
            checked={expense.tax_deductible}
            onChange={(e) => setExpense({ ...expense, tax_deductible: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="tax_deductible" className="ml-2 block text-sm text-gray-700">
            This expense is tax deductible
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
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Add Expense'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}