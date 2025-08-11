import { supabase } from '../../lib/supabase';
import type { FinanceState } from './types';
import type { Investment } from '../../lib/types';

export const createInvestmentActions = (set: any, get: () => FinanceState) => ({
  loadInvestments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

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
      }, {} as Record<string, any[]>);

      set({
        investments: investments || [],
        investmentTransactions: transactionsByInvestment,
        error: null
      });
    } catch (error) {
      console.error('Error loading investments:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load investments',
        investments: [],
        investmentTransactions: {}
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addInvestment: async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!investment.name) throw new Error('Investment name is required');
      if (!investment.type) throw new Error('Investment type is required');
      if (!investment.quantity || isNaN(Number(investment.quantity)) || Number(investment.quantity) <= 0) {
        throw new Error('Please enter a valid quantity');
      }
      if (!investment.purchase_price || isNaN(Number(investment.purchase_price)) || Number(investment.purchase_price) <= 0) {
        throw new Error('Please enter a valid purchase price');
      }
      if (!investment.current_price || isNaN(Number(investment.current_price)) || Number(investment.current_price) <= 0) {
        throw new Error('Please enter a valid current price');
      }
      if (!investment.purchase_date) throw new Error('Purchase date is required');
      if (new Date(investment.purchase_date) > new Date()) {
        throw new Error('Purchase date cannot be in the future');
      }

      // Format the investment data
      const formattedInvestment = {
        ...investment,
        user_id: user.id,
        quantity: Number(investment.quantity),
        purchase_price: Number(investment.purchase_price),
        current_price: Number(investment.current_price),
        account_id: investment.account_id || null,
        symbol: investment.symbol?.trim().toUpperCase() || null
      };

      const { data, error } = await supabase
        .from('investments')
        .insert([formattedInvestment])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        investments: [...state.investments, data],
        investmentTransactions: {
          ...state.investmentTransactions,
          [data.id]: []
        },
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Error adding investment:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add investment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateInvestment: async (id: string, updates: Partial<Investment>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Format numeric values
      const formattedUpdates = {
        ...updates,
        quantity: updates.quantity ? Number(updates.quantity) : undefined,
        purchase_price: updates.purchase_price ? Number(updates.purchase_price) : undefined,
        current_price: updates.current_price ? Number(updates.current_price) : undefined
      };

      const { data, error } = await supabase
        .from('investments')
        .update(formattedUpdates)
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own investments
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        investments: state.investments.map(inv => 
          inv.id === id ? { ...inv, ...data } : inv
        ),
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Error updating investment:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update investment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInvestment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own investments

      if (error) throw error;

      // Update local state
      set(state => ({
        investments: state.investments.filter(inv => inv.id !== id),
        investmentTransactions: {
          ...state.investmentTransactions,
          [id]: undefined
        },
        error: null
      }));
    } catch (error) {
      console.error('Error deleting investment:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete investment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});