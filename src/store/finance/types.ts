import type {
  Account,
  Category,
  Transaction,
  SplitTransaction,
  Budget,
  SavingsGoal,
  Investment,
  InvestmentTransaction
} from '../../lib/types';

export interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  splitTransactions: Record<string, SplitTransaction[]>;
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  investmentTransactions: Record<string, InvestmentTransaction[]>;
  selectedAccount: string | null;
  selectedDateRange: 'week' | 'month' | 'year' | 'all';
  isLoading: boolean;
  error: string | null;

  // Filter and Sort Actions
  filterAndSortTransactions: (
    filters: {
      type?: string[];
      dateRange?: { start?: Date; end?: Date };
      amount?: { min?: number; max?: number };
      categories?: string[];
      search?: string;
    },
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ) => void;

  // View Actions
  setSelectedAccount: (accountId: string | null) => void;
  setDateRange: (range: FinanceState['selectedDateRange']) => void;
}