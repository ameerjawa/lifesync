import type { TaskState } from './types';
import { sortAndGroupTasks } from './utils';

export const createViewActions = (set: any, get: () => TaskState) => ({
  setViewMode: (viewMode: TaskState['viewMode']) => {
    set({ viewMode });
  },

  setGroupBy: (groupBy: TaskState['groupBy']) => {
    set({ groupBy });
    const sortedAndGroupedTasks = sortAndGroupTasks(
      get().tasks,
      get().sortBy,
      get().sortDirection,
      groupBy
    );
    set({ filteredTasks: sortedAndGroupedTasks });
  },

  setSortBy: (sortBy: TaskState['sortBy']) => {
    set({ sortBy });
    const sortedAndGroupedTasks = sortAndGroupTasks(
      get().tasks,
      sortBy,
      get().sortDirection,
      get().groupBy
    );
    set({ filteredTasks: sortedAndGroupedTasks });
  },

  toggleSortDirection: () => {
    const newDirection = get().sortDirection === 'asc' ? 'desc' : 'asc';
    set({ sortDirection: newDirection });
    const sortedAndGroupedTasks = sortAndGroupTasks(
      get().tasks,
      get().sortBy,
      newDirection,
      get().groupBy
    );
    set({ filteredTasks: sortedAndGroupedTasks });
  },

  toggleTaskSelection: (taskId: string) => {
    set(state => {
      const selectedTasks = state.selectedTasks.includes(taskId)
        ? state.selectedTasks.filter(id => id !== taskId)
        : [...state.selectedTasks, taskId];
      return { selectedTasks };
    });
  },

  clearSelectedTasks: () => {
    set({ selectedTasks: [] });
  }
});