import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Calendar, Clock, DollarSign } from 'lucide-react';
import type { BusinessTask, BusinessProject, BusinessTeamMember } from '../../lib/types';

interface BusinessTaskFormProps {
  projects: BusinessProject[];
  teamMembers: BusinessTeamMember[];
  onSubmit: (task: Omit<BusinessTask, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessTaskForm({ projects, teamMembers, onSubmit, onClose }: BusinessTaskFormProps) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    project_id: '',
    assignee_id: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    due_date: '',
    estimated_hours: '',
    billable: false,
    hourly_rate: '',
    tags: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!task.title) throw new Error('Task title is required');

      await onSubmit({
        ...task,
        project_id: task.project_id || undefined,
        assignee_id: task.assignee_id || undefined,
        due_date: task.due_date || undefined,
        estimated_hours: task.estimated_hours ? Number(task.estimated_hours) : undefined,
        hourly_rate: task.hourly_rate ? Number(task.hourly_rate) : undefined,
        actual_hours: 0
      });
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
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

      <div className="mb-6 flex items-center">
        <div className="mr-4 rounded-full bg-primary-100 p-3">
          <Briefcase className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
          <p className="text-sm text-gray-500">Add a new business task</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title *
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
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              id="project"
              value={task.project_id}
              onChange={(e) => setTask({ ...task, project_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
              Assignee
            </label>
            <select
              id="assignee"
              value={task.assignee_id}
              onChange={(e) => setTask({ ...task, assignee_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.user_id}>
                  {member.profile?.full_name || member.profile?.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value as any })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="due_date"
                value={task.due_date}
                onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700">
              Estimated Hours
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="estimated_hours"
                value={task.estimated_hours}
                onChange={(e) => setTask({ ...task, estimated_hours: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.5"
              />
            </div>
          </div>
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

        {/* Billing Section */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="billable"
              checked={task.billable}
              onChange={(e) => setTask({ ...task, billable: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="billable" className="ml-2 block text-sm font-medium text-gray-700">
              This is a billable task
            </label>
          </div>

          {task.billable && (
            <div>
              <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                Hourly Rate
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="hourly_rate"
                  value={task.hourly_rate}
                  onChange={(e) => setTask({ ...task, hourly_rate: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={task.tags.join(', ')}
            onChange={(e) => setTask({
              ...task,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="development, design, testing"
          />
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
            disabled={isSubmitting}
            className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}