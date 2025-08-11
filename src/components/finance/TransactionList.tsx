import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Calendar,
  Tag
} from 'lucide-react';
import type { Transaction, Category } from '../../lib/types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return ArrowUpRight;
      case 'expense':
        return ArrowDownRight;
      case 'transfer':
        return ArrowLeftRight;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600 bg-green-100';
      case 'expense':
        return 'text-red-600 bg-red-100';
      case 'transfer':
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => {
        const Icon = getTransactionIcon(transaction.type);
        const colorClass = getTransactionColor(transaction.type);

        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${colorClass}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-1 h-4 w-4" />
                    {getCategoryName(transaction.category_id)}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income'
                  ? 'text-green-600'
                  : transaction.type === 'expense'
                  ? 'text-red-600'
                  : 'text-gray-900'
              }`}>
                {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                ${transaction.amount.toLocaleString()}
              </p>
              {transaction.status !== 'completed' && (
                <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  {transaction.status}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}