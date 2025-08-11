import type { TaskState } from './types';
import type { TaskFilter } from '../../lib/types';
import { sortAndGroupTasks } from './utils';

export const createFilterActions = (set: any, get: () => TaskState) => ({
  setFilters: (filters: TaskFilter) => {
    set({ filters });
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: {} });
    const sortedAndGroupedTasks = sortAndGroupTasks(
      get().tasks,
      get().sortBy,
      get().sortDirection,
      get().groupBy
    );
    set({ filteredTasks: sortedAndGroupedTasks });
  },

  applyFilters: () => {
    const { tasks, filters, sortBy, sortDirection, groupBy } = get();
    let filtered = [...tasks];

    if (filters.status?.length) {
      filtered = filtered.filter(task => filters.status?.includes(task.status));
    }

    if (filters.priority?.length) {
      filtered = filtered.filter(task => filters.priority?.includes(task.priority));
    }

    if (filters.labels?.length) {
      filtered = filtered.filter(task => 
        task.labels?.some(label => filters.labels?.includes(label))
      );
    }

    if (filters.dueDate?.start || filters.dueDate?.end) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.due_date);
        const start = filters.dueDate?.start;
        const end = filters.dueDate?.end;
        
        if (start && end) {
          return taskDate >= start && taskDate <= end;
        } else if (start) {
          return taskDate >= start;
        } else if (end) {
          return taskDate <= end;
        }
        return true;
      });
    }

    if (filters.assignees?.length) {
      filtered = filtered.filter(task =>
        task.assignees?.some(assignee => filters.assignees?.includes(assignee))
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }

    const sortedAndGroupedTasks = sortAndGroupTasks(
      filtered,
      sortBy,
      sortDirection,
      groupBy
    );

    set({ filteredTasks: sortedAndGroupedTasks });
  }
});