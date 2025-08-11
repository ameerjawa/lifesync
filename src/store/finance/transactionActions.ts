import { supabase } from '../../lib/supabase';
import type { FinanceState } from './types';
import type { Transaction } from '../../lib/types';

export const createTransactionActions = (set: any, get: () => FinanceState) => ({
  loadTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Load transactions with category and account details
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(name, type, color),
          account:accounts(name, type)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transactionError) throw transactionError;

      // Load split transactions
      const { data: splits, error: splitError } = await supabase
        .from('split_transactions')
        .select(`
          *,
          category:categories(name, type, color)
        `)
        .in('transaction_id', transactions?.map(t => t.id) || []);

      if (splitError) throw splitError;

      // Group split transactions by parent transaction
      const splitsByTransaction = (splits || []).reduce((acc, split) => {
        if (!acc[split.transaction_id]) {
          acc[split.transaction_id] = [];
        }
        acc[split.transaction_id].push(split);
        return acc;
      }, {} as Record<string, any[]>);

      set({
        transactions: transactions || [],
        splitTransactions: splitsByTransaction
      });
    } catch (error) {
      console.error('Error loading transactions:', error);
      set({ error: 'Failed to load transactions' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!transaction.account_id) throw new Error('Account is required');
      if (!transaction.amount) throw new Error('Amount is required');
      if (!transaction.date) throw new Error('Date is required');
      if (!transaction.type) throw new Error('Transaction type is required');
      if (!transaction.description) throw new Error('Description is required');

      // Format the transaction data
      const formattedTransaction = {
        ...transaction,
        user_id: user.id,
        date: new Date(transaction.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
        amount: Number(transaction.amount), // Ensure amount is a number
        status: transaction.status || 'completed',
        category_id: transaction.category_id || null // Allow null for category_id
      };

      // Insert the transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([formattedTransaction])
        .select(`
          *,
          category:categories(name, type, color),
          account:accounts(name, type)
        `)
        .single();

      if (error) throw error;

      // Update account balance
      if (data) {
        // Calculate the amount to update based on transaction type
        const updateAmount = data.type === 'expense' ? -data.amount : data.amount;

        // Update the account balance
        const { error: accountError } = await supabase.rpc('update_account_balance', {
          p_account_id: data.account_id,
          p_amount: updateAmount
        });

        if (accountError) throw accountError;

        // Reload accounts to get updated balances
        await get().loadAccounts();
      }

      // Update local state
      set(state => ({
        transactions: [data, ...state.transactions]
      }));

      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});