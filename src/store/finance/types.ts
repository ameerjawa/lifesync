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

  // Account Actions
  loadAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;

  // Category Actions
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Transaction Actions
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Budget Actions
  loadBudgets: () => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Savings Goal Actions
  loadSavingsGoals: () => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;

  // Investment Actions
  loadInvestments: () => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;

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