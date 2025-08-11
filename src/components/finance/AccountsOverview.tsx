import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  Building, 
  PiggyBank, 
  TrendingUp,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { AccountForm } from './AccountForm';
import { useFinanceStore } from '../../store/financeStore';
import type { Account } from '../../lib/types';

export function AccountsOverview() {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const { accounts, addAccount, updateAccount, deleteAccount } = useFinanceStore();

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
        return 'text-purple-600 bg-purple-100';
      case 'loan':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAddAccount = async (account: Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addAccount(account);
      setIsAddingAccount(false);
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAccount(id);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleToggleAccountVisibility = async (account: Account) => {
    try {
      await updateAccount(account.id, { is_active: !account.is_active });
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account. Please try again.');
    }
  };

  const totalBalance = accounts.reduce((sum, account) => {
    // Don't include credit cards and loans in total balance
    if (account.type === 'credit' || account.type === 'loan') {
      return sum;
    }
    return sum + account.balance;
  }, 0);

  const totalDebt = accounts.reduce((sum, account) => {
    if (account.type === 'credit' || account.type === 'loan') {
      return sum + account.balance;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${totalBalance.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500">Across all active accounts</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Debt</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            ${totalDebt.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500">Credit cards and loans</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Net Worth</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${(totalBalance - totalDebt).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500">Assets minus liabilities</p>
        </div>
      </div>

      {/* Accounts List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Accounts</h3>
            <button
              onClick={() => setIsAddingAccount(true)}
              className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Account
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {accounts.map((account, index) => {
            const Icon = getAccountIcon(account.type);
            const colorClass = getAccountColor(account.type);

            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                  !account.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-3 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{account.name}</h4>
                    <p className="text-sm text-gray-500">
                      {account.institution || 'Personal Account'}
                      {account.account_number && ` (${account.account_number})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      account.type === 'credit' || account.type === 'loan'
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}>
                      {account.currency} {account.balance.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setSelectedAccount(selectedAccount === account.id ? null : account.id)}
                      className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {selectedAccount === account.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <button
                          onClick={() => handleToggleAccountVisibility(account)}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {account.is_active ? (
                            <>
                              <EyeOff className="mr-3 h-5 w-5 text-gray-400" />
                              Hide Account
                            </>
                          ) : (
                            <>
                              <Eye className="mr-3 h-5 w-5 text-gray-400" />
                              Show Account
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {/* TODO: Implement edit account */}}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="mr-3 h-5 w-5 text-gray-400" />
                          Edit Account
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-3 h-5 w-5 text-red-400" />
                          Delete Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {accounts.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500">No accounts added yet.</p>
              <button
                onClick={() => setIsAddingAccount(true)}
                className="mt-2 text-indigo-600 hover:text-indigo-500"
              >
                Add your first account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Form Modal */}
      {isAddingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <AccountForm
            onSubmit={handleAddAccount}
            onClose={() => setIsAddingAccount(false)}
          />
        </div>
      )}
    </div>
  );
}