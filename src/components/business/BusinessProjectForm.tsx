import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Target, Calendar, DollarSign } from 'lucide-react';
import type { BusinessProject, BusinessClient } from '../../lib/types';

interface BusinessProjectFormProps {
  clients: BusinessClient[];
  project?: BusinessProject;
  onSubmit: (project: Omit<BusinessProject, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessProjectForm({ clients, project: existingProject, onSubmit, onClose }: BusinessProjectFormProps) {
  const [project, setProject] = useState({
    name: existingProject?.name || '',
    description: existingProject?.description || '',
    client_id: existingProject?.client_id || '',
    status: (existingProject?.status || 'planning') as const,
    priority: (existingProject?.priority || 'medium') as const,
    start_date: existingProject?.start_date || '',
    due_date: existingProject?.due_date || '',
    budget: existingProject?.budget ? String(existingProject.budget) : '',
    team_members: existingProject?.team_members || [] as string[],
    tags: existingProject?.tags || [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!project.name) throw new Error('Project name is required');

      await onSubmit({
        ...project,
        client_id: project.client_id || undefined,
        start_date: project.start_date || undefined,
        due_date: project.due_date || undefined,
        budget: project.budget ? Number(project.budget) : undefined,
        actual_cost: 0,
        progress: 0
      });
      onClose();
    } catch (error) {
      console.error('Error submitting project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project');
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
          <Target className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {existingProject ? 'Edit Project' : 'Create New Project'}
          </h3>
          <p className="text-sm text-gray-500">
            {existingProject ? 'Update project details' : 'Set up a new business project'}
          </p>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              id="client"
              value={project.client_id}
              onChange={(e) => setProject({ ...project, client_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={project.status}
              onChange={(e) => setProject({ ...project, status: e.target.value as any })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              value={project.priority}
              onChange={(e) => setProject({ ...project, priority: e.target.value as any })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="start_date"
                value={project.start_date}
                onChange={(e) => setProject({ ...project, start_date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
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
                type="date"
                id="due_date"
                value={project.due_date}
                onChange={(e) => setProject({ ...project, due_date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                min={project.start_date}
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
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="budget"
              value={project.budget}
              onChange={(e) => setProject({ ...project, budget: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={project.tags.join(', ')}
            onChange={(e) => setProject({
              ...project,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="web development, mobile app, design"
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
                <span className="ml-2">{existingProject ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : (
              existingProject ? 'Update Project' : 'Create Project'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}