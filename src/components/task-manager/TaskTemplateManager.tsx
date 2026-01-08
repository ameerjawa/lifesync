import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText, X } from 'lucide-react';
import { useTaskStore } from '../../store';
import type { TaskTemplate } from '../../lib/types';

export function TaskTemplateManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { templates, isLoading, loadTemplates, addTemplate } = useTaskStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addTemplate({
        user_id: '',
        title: formData.get('title') as string,
        description: formData.get('description') as string || undefined,
        priority: formData.get('priority') as any || 'medium',
        estimated_hours: formData.get('estimated_hours') ? parseFloat(formData.get('estimated_hours') as string) : undefined,
        labels: [],
        dependencies: [],
        assignees: []
      });
      setShowForm(false);
      setEditingTemplate(null);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Templates</h2>
          <p className="mt-1 text-sm text-gray-500">Create reusable templates for common tasks</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Template
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No templates yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first template to quickly add common tasks
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                  {template.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  )}
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 ${
                      template.priority === 'high' ? 'bg-red-100 text-red-800' :
                      template.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {template.priority}
                    </span>
                    {template.estimated_hours && (
                      <span>{template.estimated_hours}h</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowForm(true);
                    }}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Template Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={editingTemplate?.title}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={editingTemplate?.description}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue={editingTemplate?.priority || 'medium'}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                    name="estimated_hours"
                    step="0.5"
                    min="0"
                    defaultValue={editingTemplate?.estimated_hours}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTemplate(null);
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
