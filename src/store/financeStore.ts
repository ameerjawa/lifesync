import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
  Account,
  Category,
  Transaction,
  SplitTransaction,
  Budget,
  SavingsGoal,
  Investment,
  InvestmentTransaction
} from '../lib/types';

interface FinanceState {
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
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  accounts: [],
  categories: [],
  transactions: [],
  splitTransactions: {},
  budgets: [],
  savingsGoals: [],
  investments: [],
  investmentTransactions: {},
  selectedAccount: null,
  selectedDateRange: 'month',
  isLoading: false,
  error: null,

  loadAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Handle missing session silently
      if (authError?.name === 'AuthSessionMissingError') {
        set({ accounts: [] });
        return;
      }
      
      if (authError) throw authError;
      if (!user) return;

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      set({ accounts: data || [] });
    } catch (error) {
      // Only log unexpected errors
      if (error?.name !== 'AuthSessionMissingError') {
        console.error('Error loading accounts:', error);
      }
      set({ error: 'Failed to load accounts' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Handle missing session silently
      if (authError?.name === 'AuthSessionMissingError') {
        set({ transactions: [], splitTransactions: {} });
        return;
      }
      
      if (authError) throw authError;
      if (!user) return;

      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transactionError) throw transactionError;

      // Load split transactions
      const { data: splits, error: splitError } = await supabase
        .from('split_transactions')
        .select('*')
        .in('transaction_id', transactions?.map(t => t.id) || []);

      if (splitError) throw splitError;

      // Group split transactions by parent transaction
      const splitsByTransaction = (splits || []).reduce((acc, split) => {
        if (!acc[split.transaction_id]) {
          acc[split.transaction_id] = [];
        }
        acc[split.transaction_id].push(split);
        return acc;
      }, {} as Record<string, SplitTransaction[]>);

      set({
        transactions: transactions || [],
        splitTransactions: splitsByTransaction
      });
    } catch (error) {
      // Only log unexpected errors
      if (error?.name !== 'AuthSessionMissingError') {
        console.error('Error loading transactions:', error);
      }
      set({ error: 'Failed to load transactions' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Handle missing session silently
      if (authError?.name === 'AuthSessionMissingError') {
        set({ budgets: [] });
        return;
      }
      
      if (authError) throw authError;
      if (!user) return;

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      set({ budgets: data || [] });
    } catch (error) {
      // Only log unexpected errors
      if (error?.name !== 'AuthSessionMissingError') {
        console.error('Error loading budgets:', error);
      }
      set({ error: 'Failed to load budgets' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadSavingsGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Handle missing session silently
      if (authError?.name === 'AuthSessionMissingError') {
        set({ savingsGoals: [] });
        return;
      }
      
      if (authError) throw authError;
      if (!user) return;

      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('target_date', { ascending: true });

      if (error) throw error;
      set({ savingsGoals: data || [] });
    } catch (error) {
      // Only log unexpected errors
      if (error?.name !== 'AuthSessionMissingError') {
        console.error('Error loading savings goals:', error);
      }
      set({ error: 'Failed to load savings goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadInvestments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Handle missing session silently
      if (authError?.name === 'AuthSessionMissingError') {
        set({ investments: [], investmentTransactions: {} });
        return;
      }
      
      if (authError) throw authError;
      if (!user) return;

      const { data: investments, error: investmentError } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (investmentError) throw investmentError;

      // Load investment transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('investment_transactions')
        .select('*')
        .in('investment_id', investments?.map(i => i.id) || [])
        .order('date', { ascending: false });

      if (transactionError) throw transactionError;

      // Group transactions by investment
      const transactionsByInvestment = (transactions || []).reduce((acc, transaction) => {
        if (!acc[transaction.investment_id]) {
          acc[transaction.investment_id] = [];
        }
        acc[transaction.investment_id].push(transaction);
        return acc;
      }, {} as Record<string, InvestmentTransaction[]>);

      set({
        investments: investments || [],
        investmentTransactions: transactionsByInvestment
      });
    } catch (error) {
      // Only log unexpected errors
      if (error?.name !== 'AuthSessionMissingError') {
        console.error('Error loading investments:', error);
      }
      set({ error: 'Failed to load investments' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedAccount: (accountId) => {
    set({ selectedAccount: accountId });
  },

  setDateRange: (range) => {
    set({ selectedDateRange: range });
  },

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError?.name === 'AuthSessionMissingError') {
        set({ categories: [] });
        return;
      }

      if (authError) throw authError;
      if (!user) return;

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      if (error?.name !== 'AuthSessionMissingError') {
        console.error('Error loading categories:', error);
      }
      set({ error: 'Failed to load categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  addAccount: async (accountData: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('accounts')
        .insert([{ ...accountData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ accounts: [...state.accounts, data] }));
    } catch (error) {
      console.error('Error adding account:', error);
      set({ error: 'Failed to add account' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transactionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ transactions: [data, ...state.transactions] }));

      await get().loadAccounts();
    } catch (error) {
      console.error('Error adding transaction:', error);
      set({ error: 'Failed to add transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addBudget: async (budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...budgetData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ budgets: [data, ...state.budgets] }));
    } catch (error) {
      console.error('Error adding budget:', error);
      set({ error: 'Failed to add budget' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addInvestment: async (investmentData: Omit<Investment, 'id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('investments')
        .insert([{ ...investmentData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ investments: [...state.investments, data] }));
    } catch (error) {
      console.error('Error adding investment:', error);
      set({ error: 'Failed to add investment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

