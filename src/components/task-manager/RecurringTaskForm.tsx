import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Task, RecurringTask } from '../../lib/types';

interface RecurringTaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>, recurring: Omit<RecurringTask, 'id' | 'task_id'>) => Promise<void>;
  onClose: () => void;
}

export function RecurringTaskForm({ onSubmit, onClose }: RecurringTaskFormProps) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    estimated_hours: '',
    labels: [] as string[],
    status: 'todo' as const,
  });

  const [recurring, setRecurring] = useState({
    frequency: 'weekly' as const,
    interval_count: 1,
    days_of_week: ['monday'] as string[], // Default to Monday
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!task.title) {
        throw new Error('Title is required');
      }

      if (!recurring.start_date) {
        throw new Error('Start date is required');
      }

      // If it's weekly frequency, ensure at least one day is selected
      if (recurring.frequency === 'weekly' && recurring.days_of_week.length === 0) {
        throw new Error('Please select at least one day of the week');
      }

      // Create the task with the start date as the due date
      const taskData = {
        ...task,
        due_date: new Date(recurring.start_date).toISOString(),
        estimated_hours: task.estimated_hours ? parseFloat(task.estimated_hours) : null,
      };

      // Create the recurring configuration
      const recurringData = {
        ...recurring,
        // Convert dates to ISO format
        start_date: recurring.start_date,
        end_date: recurring.end_date || null,
        days_of_week: recurring.frequency === 'weekly' ? recurring.days_of_week : [],
      };

      await onSubmit(taskData, recurringData);
      onClose();
    } catch (error) {
      console.error('Error creating recurring task:', error);
      alert(error instanceof Error ? error.message : 'Failed to create recurring task');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Create Recurring Task</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Task Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Task Details</h4>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value as Task['priority'] })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimated_hours"
                value={task.estimated_hours}
                onChange={(e) => setTask({ ...task, estimated_hours: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label htmlFor="labels" className="block text-sm font-medium text-gray-700">
                Labels (comma-separated)
              </label>
              <input
                type="text"
                id="labels"
                value={task.labels.join(', ')}
                onChange={(e) => setTask({
                  ...task,
                  labels: e.target.value.split(',').map(label => label.trim()).filter(Boolean)
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter labels"
              />
            </div>
          </div>

          {/* Recurring Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Recurring Settings</h4>
            
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <select
                id="frequency"
                value={recurring.frequency}
                onChange={(e) => setRecurring({ 
                  ...recurring, 
                  frequency: e.target.value as RecurringTask['frequency'],
                  // Reset days of week if not weekly
                  days_of_week: e.target.value === 'weekly' ? recurring.days_of_week : []
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label htmlFor="interval_count" className="block text-sm font-medium text-gray-700">
                Repeat Every
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="number"
                  id="interval_count"
                  value={recurring.interval_count}
                  onChange={(e) => setRecurring({ 
                    ...recurring, 
                    interval_count: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                  className="block w-20 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="1"
                  required
                />
                <span className="text-gray-700">
                  {recurring.frequency === 'daily' ? 'days' :
                   recurring.frequency === 'weekly' ? 'weeks' :
                   recurring.frequency === 'monthly' ? 'months' : 'years'}
                </span>
              </div>
            </div>

            {recurring.frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Repeat On
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={recurring.days_of_week.includes(day)}
                        onChange={(e) => {
                          const days = e.target.checked
                            ? [...recurring.days_of_week, day]
                            : recurring.days_of_week.filter(d => d !== day);
                          setRecurring({ ...recurring, days_of_week: days });
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 capitalize">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                value={recurring.start_date}
                onChange={(e) => setRecurring({ ...recurring, start_date: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="end_date"
                value={recurring.end_date}
                onChange={(e) => setRecurring({ ...recurring, end_date: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                min={recurring.start_date}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
          >
            Create Recurring Task
          </button>
        </div>
      </form>
    </motion.div>
  );
}