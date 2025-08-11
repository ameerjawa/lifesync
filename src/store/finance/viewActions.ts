import type { FinanceState } from './types';

export const createViewActions = (set: any) => ({
  setSelectedAccount: (accountId: string | null) => {
    set({ selectedAccount: accountId });
  },

  setDateRange: (range: FinanceState['selectedDateRange']) => {
    set({ selectedDateRange: range });
  }
});