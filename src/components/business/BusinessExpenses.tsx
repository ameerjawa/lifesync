import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Calendar, Receipt, Tag } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessExpenseForm } from './BusinessExpenseForm';

export function BusinessExpenses() {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const {
    expenses,
    projects,
    loadExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const categories = Array.from(new Set(expenses.map(e => e.category)));
  
  const filteredExpenses = expenses.filter(expense => 
    selectedCategory === 'all' || expense.category === selectedCategory
  );

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const currentMonth = new Date().getMonth();
      return expenseDate.getMonth() === currentMonth;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const taxDeductibleAmount = expenses
    .filter(expense => expense.tax_deductible)
    .reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Expenses</h2>
          <p className="text-gray-600">Track and categorize your business expenses</p>
        </div>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${monthlyExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <Receipt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tax Deductible</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${taxDeductibleAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Deductible
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </div>
                      {expense.vendor && (
                        <div className="text-sm text-gray-500">
                          Vendor: {expense.vendor}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.tax_deductible ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {expense.receipt_url && (
                        <button className="text-indigo-600 hover:text-indigo-500">
                          <Receipt className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory === 'all' 
                ? "Get started by adding your first expense"
                : `No expenses in category "${selectedCategory}"`
              }
            </p>
            {selectedCategory === 'all' && (
              <button
                onClick={() => setIsAddingExpense(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Expense
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expense Form Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessExpenseForm
            projects={projects}
            onSubmit={async (expense) => {
              await addExpense(expense);
              setIsAddingExpense(false);
            }}
            onClose={() => setIsAddingExpense(false)}
          />
        </div>
      )}
    </div>
  );
}