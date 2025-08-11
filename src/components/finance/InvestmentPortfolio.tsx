import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { InvestmentForm } from './InvestmentForm';
import type { Investment } from '../../lib/types';

interface InvestmentPortfolioProps {
  investments: Investment[];
  onAddInvestment?: (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function InvestmentPortfolio({ investments, onAddInvestment }: InvestmentPortfolioProps) {
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);

  const calculateReturn = (investment: Investment) => {
    const currentValue = investment.quantity * investment.current_price;
    const purchaseValue = investment.quantity * investment.purchase_price;
    const returnValue = currentValue - purchaseValue;
    const returnPercentage = (returnValue / purchaseValue) * 100;
    return { returnValue, returnPercentage };
  };

  const totalValue = investments.reduce((sum, investment) => 
    sum + (investment.quantity * investment.current_price), 0
  );

  const totalReturn = investments.reduce((sum, investment) => {
    const { returnValue } = calculateReturn(investment);
    return sum + returnValue;
  }, 0);

  const totalReturnPercentage = investments.length > 0
    ? (totalReturn / (totalValue - totalReturn)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Total Portfolio Value</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Total Return</h4>
          <p className={`mt-2 text-3xl font-semibold ${
            totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${Math.abs(totalReturn).toLocaleString()}
          </p>
          <p className={`text-sm ${
            totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalReturnPercentage.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Number of Investments</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {investments.length}
          </p>
        </div>
      </div>

      {/* Investment List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Investments</h3>
            <button
              onClick={() => setIsAddingInvestment(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              Add Investment
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {investments.map((investment, index) => {
            const { returnValue, returnPercentage } = calculateReturn(investment);
            const currentValue = investment.quantity * investment.current_price;

            return (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-2 ${
                    returnValue >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {returnValue >= 0 ? (
                      <TrendingUp className={`h-6 w-6 ${
                        returnValue >= 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <TrendingDown className={`h-6 w-6 ${
                        returnValue >= 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{investment.name}</h4>
                    <p className="text-sm text-gray-500">
                      {investment.symbol} • {investment.type}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${currentValue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    returnValue >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {returnValue >= 0 ? '+' : '-'}${Math.abs(returnValue).toLocaleString()} ({
                      returnPercentage.toFixed(2)
                    }%)
                  </p>
                </div>
              </motion.div>
            );
          })}

          {investments.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 p-2 text-gray-400">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">No investments yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first investment.
              </p>
              <button
                onClick={() => setIsAddingInvestment(true)}
                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Add Investment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Investment Form Modal */}
      {isAddingInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <InvestmentForm
            onSubmit={async (investment) => {
              if (onAddInvestment) {
                await onAddInvestment(investment);
              }
              setIsAddingInvestment(false);
            }}
            onClose={() => setIsAddingInvestment(false)}
          />
        </div>
      )}
    </div>
  );
}