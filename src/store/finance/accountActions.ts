import { supabase } from '../../lib/supabase';
import type { FinanceState } from './types';
import type { Account } from '../../lib/types';

export const createAccountActions = (set: any, get: () => FinanceState) => ({
  loadAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      set({ accounts: data || [] });
    } catch (error) {
      console.error('Error loading accounts:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load accounts' });
    } finally {
      set({ isLoading: false });
    }
  },

  addAccount: async (account: Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Call the create_account function
      const { data, error } = await supabase.rpc('create_account', {
        p_name: account.name,
        p_type: account.type,
        p_balance: account.balance,
        p_currency: account.currency || 'USD',
        p_institution: account.institution || null,
        p_account_number: account.account_number || null
      });

      if (error) {
        // Handle specific validation errors
        if (error.message.includes('Account name must be')) {
          throw new Error('Account name must be between 1 and 100 characters');
        }
        if (error.message.includes('Invalid currency code')) {
          throw new Error('Please enter a valid currency code (e.g., USD, EUR)');
        }
        if (error.message.includes('balance')) {
          throw new Error('Invalid balance for this account type');
        }
        throw error;
      }

      // Update local state
      set(state => ({
        accounts: [...state.accounts, data],
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Error adding account:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add account' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAccount: async (id: string, updates: Partial<Account>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        accounts: state.accounts.map(account =>
          account.id === id ? { ...account, ...data } : account
        ),
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update account' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAccount: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        accounts: state.accounts.filter(account => account.id !== id),
        error: null
      }));
    } catch (error) {
      console.error('Error deleting account:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete account' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
});