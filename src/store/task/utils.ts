import type { Task } from '../../lib/types';
import type { TaskState } from './types';

export function sortAndGroupTasks(
  tasks: Task[],
  sortBy: TaskState['sortBy'],
  sortDirection: TaskState['sortDirection'],
  groupBy: TaskState['groupBy']
): Task[] {
  let sorted = [...tasks];

  // Sort tasks
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        break;
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        break;
      }
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'created':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Group tasks
  if (groupBy !== 'none') {
    const grouped: Record<string, Task[]> = {};
    sorted.forEach(task => {
      const key = String(task[groupBy]);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(task);
    });

    // Flatten grouped tasks back into array
    sorted = Object.values(grouped).flat();
  }

  return sorted;
}