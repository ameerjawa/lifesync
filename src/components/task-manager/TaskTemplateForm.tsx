import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { TaskTemplate } from '../../lib/types';

interface TaskTemplateFormProps {
  onSubmit: (template: Omit<TaskTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function TaskTemplateForm({ onSubmit, onClose }: TaskTemplateFormProps) {
  const [template, setTemplate] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    estimated_hours: '',
    labels: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...template,
        estimated_hours: template.estimated_hours ? parseFloat(template.estimated_hours) : null
      });
      onClose();
    } catch (error) {
      console.error('Error submitting template:', error);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Create Task Template</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <input
            type="text"
            id="title"
            value={template.title}
            onChange={(e) => setTemplate({ ...template, title: e.target.value })}
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
            value={template.description}
            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Default Priority
          </label>
          <select
            id="priority"
            value={template.priority}
            onChange={(e) => setTemplate({ ...template, priority: e.target.value as TaskTemplate['priority'] })}
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
            value={template.estimated_hours}
            onChange={(e) => setTemplate({ ...template, estimated_hours: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            min="0"
            step="0.5"
            placeholder="Enter estimated hours"
          />
        </div>

        <div>
          <label htmlFor="labels" className="block text-sm font-medium text-gray-700">
            Labels (comma-separated)
          </label>
          <input
            type="text"
            id="labels"
            value={template.labels.join(', ')}
            onChange={(e) => setTemplate({
              ...template,
              labels: e.target.value.split(',').map(label => label.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter labels"
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
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
          >
            Create Template
          </button>
        </div>
      </form>
    </motion.div>
  );
}