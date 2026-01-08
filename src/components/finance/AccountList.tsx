import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  Building,
  PiggyBank,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import type { Account } from '../../lib/types';

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'credit':
        return CreditCard;
      case 'checking':
        return Wallet;
      case 'savings':
        return PiggyBank;
      case 'investment':
        return TrendingUp;
      case 'loan':
        return Building;
      default:
        return Wallet;
    }
  };

  const getAccountColor = (type: Account['type']) => {
    switch (type) {
      case 'credit':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-blue-600 bg-blue-100';
      case 'savings':
        return 'text-green-600 bg-green-100';
      case 'investment':
        return 'text-primary-600 bg-primary-100';
      case 'loan':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {accounts.map((account, index) => {
        const Icon = getAccountIcon(account.type);
        const colorClass = getAccountColor(account.type);

        return (
          <motion.div
            key={account.id}
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
                <h4 className="font-medium text-gray-900">{account.name}</h4>
                <p className="text-sm text-gray-500">
                  {account.institution || 'Personal Account'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <p className={`font-semibold ${
                  account.balance >= 0 ? 'text-gray-900' : 'text-red-600'
                }`}>
                  {account.currency} {Math.abs(account.balance).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}