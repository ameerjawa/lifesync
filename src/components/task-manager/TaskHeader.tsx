import React from 'react';
import { 
  Plus, 
  BookTemplate as Template, 
  Repeat, 
  LayoutGrid, 
  List, 
  Baseline as Timeline, 
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import type { TaskFilter } from '../../lib/types';

interface TaskHeaderProps {
  viewMode: 'board' | 'list' | 'timeline';
  groupBy: 'status' | 'priority' | 'assignee' | 'none';
  sortBy: 'dueDate' | 'priority' | 'title' | 'created';
  sortDirection: 'asc' | 'desc';
  showFilters: boolean;
  filterState: TaskFilter;
  onViewModeChange: (mode: 'board' | 'list' | 'timeline') => void;
  onGroupByChange: (value: 'status' | 'priority' | 'assignee' | 'none') => void;
  onSortByChange: (value: 'dueDate' | 'priority' | 'title' | 'created') => void;
  onSortDirectionToggle: () => void;
  onToggleFilters: () => void;
  onAddTask: () => void;
  onAddTemplate: () => void;
  onAddRecurring: () => void;
}

export function TaskHeader({
  viewMode,
  groupBy,
  sortBy,
  sortDirection,
  showFilters,
  filterState,
  onViewModeChange,
  onGroupByChange,
  onSortByChange,
  onSortDirectionToggle,
  onToggleFilters,
  onAddTask,
  onAddTemplate,
  onAddRecurring,
}: TaskHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
      <div className="flex flex-wrap items-center gap-4">
        {/* View Mode Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewModeChange('board')}
            className={`p-2 rounded-lg ${viewMode === 'board' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`p-2 rounded-lg ${viewMode === 'timeline' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Timeline className="h-5 w-5" />
          </button>
        </div>

        {/* Group and Sort Controls */}
        <select
          value={groupBy}
          onChange={(e) => onGroupByChange(e.target.value as any)}
          className="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="none">No Grouping</option>
          <option value="status">Group by Status</option>
          <option value="priority">Group by Priority</option>
          <option value="assignee">Group by Assignee</option>
        </select>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
            <option value="created">Sort by Created Date</option>
          </select>
          <button
            onClick={onSortDirectionToggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-5 w-5" />
            ) : (
              <SortDesc className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onToggleFilters}
            className={`flex items-center rounded-lg px-4 py-2 ${
              showFilters ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Filter className="mr-2 h-5 w-5" />
            Filters
            {Object.values(filterState).some(v => 
              Array.isArray(v) ? v.length > 0 : Boolean(v)
            ) && (
              <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                Active
              </span>
            )}
          </button>
          <button
            onClick={onAddTemplate}
            className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
          >
            <Template className="mr-2 h-5 w-5" />
            New Template
          </button>
          <button
            onClick={onAddRecurring}
            className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500"
          >
            <Repeat className="mr-2 h-5 w-5" />
            Recurring Task
          </button>
          <button
            onClick={onAddTask}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}