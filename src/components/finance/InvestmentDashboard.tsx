import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart2, 
  Calendar, 
  Plus,
  History,
  PieChart as ChartPie,
  LineChart
} from 'lucide-react';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentPortfolio } from './InvestmentPortfolio';
import type { Investment } from '../../lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface InvestmentDashboardProps {
  investments: Investment[];
  onAddInvestment: (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function InvestmentDashboard({ investments, onAddInvestment }: InvestmentDashboardProps) {
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
  const [activeView, setActiveView] = useState<'portfolio' | 'allocation' | 'performance' | 'history'>('portfolio');

  // Calculate portfolio metrics
  const totalValue = investments.reduce((sum, inv) => 
    sum + (inv.quantity * inv.current_price), 0
  );

  const totalCost = investments.reduce((sum, inv) => 
    sum + (inv.quantity * inv.purchase_price), 0
  );

  const totalReturn = totalValue - totalCost;
  const totalReturnPercentage = ((totalValue / totalCost) - 1) * 100;

  // Calculate asset allocation
  const assetAllocation = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + (inv.quantity * inv.current_price);
    return acc;
  }, {} as Record<string, number>);

  const allocationData = Object.entries(assetAllocation).map(([type, value]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    value
  }));

  // Calculate performance data
  const performanceData = investments.map(inv => {
    const currentValue = inv.quantity * inv.current_price;
    const costBasis = inv.quantity * inv.purchase_price;
    const returnValue = currentValue - costBasis;
    const returnPercentage = (returnValue / costBasis) * 100;

    return {
      name: inv.name,
      currentValue,
      returnValue,
      returnPercentage
    };
  });

  // Prepare history data (mock data - replace with actual transaction history)
  const historyData = investments.map(inv => ({
    date: new Date(inv.purchase_date).toLocaleDateString(),
    type: 'Purchase',
    name: inv.name,
    quantity: inv.quantity,
    price: inv.purchase_price,
    total: inv.quantity * inv.purchase_price
  }));

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Portfolio Value</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${totalValue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Total Return</h4>
          <div className="mt-2 flex items-baseline">
            <p className={`text-3xl font-semibold ${
              totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${Math.abs(totalReturn).toLocaleString()}
            </p>
            <p className={`ml-2 text-sm ${
              totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalReturnPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Performance</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className={`rounded-lg px-2 py-1 text-sm ${
                  selectedTimeframe === timeframe
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Number of Investments</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {investments.length}
          </p>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveView('portfolio')}
            className={`flex items-center rounded-lg px-4 py-2 ${
              activeView === 'portfolio'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Portfolio
          </button>
          <button
            onClick={() => setActiveView('allocation')}
            className={`flex items-center rounded-lg px-4 py-2 ${
              activeView === 'allocation'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChartPie className="mr-2 h-5 w-5" />
            Asset Allocation
          </button>
          <button
            onClick={() => setActiveView('performance')}
            className={`flex items-center rounded-lg px-4 py-2 ${
              activeView === 'performance'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LineChart className="mr-2 h-5 w-5" />
            Performance
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`flex items-center rounded-lg px-4 py-2 ${
              activeView === 'history'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="mr-2 h-5 w-5" />
            History
          </button>
        </div>
        <button
          onClick={() => setIsAddingInvestment(true)}
          className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Investment
        </button>
      </div>

      {/* Main Content */}
      <div className="rounded-lg bg-gray-50 p-4 sm:p-6">
        {activeView === 'portfolio' && (
          <InvestmentPortfolio 
            investments={investments}
            onAddInvestment={onAddInvestment}
          />
        )}

        {activeView === 'allocation' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Asset Allocation</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">By Asset Type</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Allocation Details</h4>
                <div className="space-y-4">
                  {allocationData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="h-4 w-4 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${item.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {((item.value / totalValue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Performance Analysis</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Investment Returns</h4>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="currentValue" fill="#4F46E5" name="Current Value" />
                      <Bar dataKey="returnValue" fill="#10B981" name="Return" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'history' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Transaction History</h3>
            <div className="overflow-x-auto rounded-lg bg-white shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyData.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Investment Form Modal */}
      {isAddingInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
          <div className="min-h-[50vh] max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white">
            <InvestmentForm
              onSubmit={async (investment) => {
                await onAddInvestment(investment);
                setIsAddingInvestment(false);
              }}
              onClose={() => setIsAddingInvestment(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}