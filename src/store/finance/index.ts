import { create } from 'zustand';
import { createAccountActions } from './accountActions';
import { createCategoryActions } from './categoryActions';
import { createTransactionActions } from './transactionActions';
import { createBudgetActions } from './budgetActions';
import { createSavingsActions } from './savingsActions';
import { createInvestmentActions } from './investmentActions';
import { createViewActions } from './viewActions';
import { createFilterSortActions } from './filterSortActions';
import type { FinanceState } from './types';

const initialState: Omit<FinanceState, keyof ReturnType<typeof createActions>> = {
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
};

const createActions = (set: any, get: () => FinanceState) => ({
  ...createAccountActions(set, get),
  ...createCategoryActions(set, get),
  ...createTransactionActions(set, get),
  ...createBudgetActions(set, get),
  ...createSavingsActions(set, get),
  ...createInvestmentActions(set, get),
  ...createViewActions(set),
  ...createFilterSortActions(set, get)
});

export const useFinanceStore = create<FinanceState>((set, get) => ({
  ...initialState,
  ...createActions(set, get)
}));