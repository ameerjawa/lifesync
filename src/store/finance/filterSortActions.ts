import type { FinanceState } from './types';
import type { Transaction } from '../../lib/types';

// Helper function to sort transactions
const sortTransactions = (
  transactions: Transaction[],
  sortBy: string,
  sortDirection: 'asc' | 'desc'
) => {
  return [...transactions].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
      default:
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

// Helper function to filter transactions
const filterTransactions = (
  transactions: Transaction[],
  filters: {
    type?: string[];
    dateRange?: { start?: Date; end?: Date };
    amount?: { min?: number; max?: number };
    categories?: string[];
    search?: string;
  }
) => {
  return transactions.filter(transaction => {
    // Filter by type
    if (filters.type?.length && !filters.type.includes(transaction.type)) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange) {
      const transactionDate = new Date(transaction.date);
      if (filters.dateRange.start && transactionDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && transactionDate > filters.dateRange.end) {
        return false;
      }
    }

    // Filter by amount range
    if (filters.amount) {
      if (filters.amount.min !== undefined && transaction.amount < filters.amount.min) {
        return false;
      }
      if (filters.amount.max !== undefined && transaction.amount > filters.amount.max) {
        return false;
      }
    }

    // Filter by categories
    if (filters.categories?.length && !filters.categories.includes(transaction.category_id || '')) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.notes?.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
};

export const createFilterSortActions = (set: any, get: () => FinanceState) => ({
  filterAndSortTransactions: (
    filters: Parameters<typeof filterTransactions>[1],
    sortBy: string = 'date',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    const { transactions } = get();
    const filteredTransactions = filterTransactions(transactions, filters);
    const sortedTransactions = sortTransactions(filteredTransactions, sortBy, sortDirection);
    set({ transactions: sortedTransactions });
  }
});