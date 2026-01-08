import React from 'react';
import { motion } from 'framer-motion';
import type { TaskFilter } from '../../lib/types';

interface TaskFiltersProps {
  filterState: TaskFilter;
  onFilterChange: (key: keyof TaskFilter, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function TaskFilters({
  filterState,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: TaskFiltersProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden rounded-lg bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Filter */}
        <div>
          <h3 className="mb-3 font-medium text-gray-900">Status</h3>
          <div className="space-y-2">
            {['todo', 'in_progress', 'completed'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterState.status?.includes(status)}
                  onChange={() => onFilterChange('status', status)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 capitalize">{status.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h3 className="mb-3 font-medium text-gray-900">Priority</h3>
          <div className="space-y-2">
            {['low', 'medium', 'high'].map((priority) => (
              <label key={priority} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterState.priority?.includes(priority)}
                  onChange={() => onFilterChange('priority', priority)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 capitalize">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div>
          <h3 className="mb-3 font-medium text-gray-900">Due Date</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600">From</label>
              <input
                type="date"
                value={filterState.dueDate?.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => onFilterChange('dueDate', {
                  ...filterState.dueDate,
                  start: e.target.value ? new Date(e.target.value) : undefined
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">To</label>
              <input
                type="date"
                value={filterState.dueDate?.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => onFilterChange('dueDate', {
                  ...filterState.dueDate,
                  end: e.target.value ? new Date(e.target.value) : undefined
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filterState.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClearFilters}
          className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Clear Filters
        </button>
        <button
          onClick={onApplyFilters}
          className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
}