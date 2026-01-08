import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Zap } from 'lucide-react';
import type { BusinessAutomation } from '../../lib/types';

interface BusinessAutomationFormProps {
  onSubmit: (automation: Omit<BusinessAutomation, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessAutomationForm({ onSubmit, onClose }: BusinessAutomationFormProps) {
  const [automation, setAutomation] = useState({
    name: '',
    type: 'reminder' as const,
    trigger_condition: '',
    action_config: {},
    is_active: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const automationTypes = [
    { value: 'invoice', label: 'Recurring Invoice', description: 'Generate invoices automatically' },
    { value: 'reminder', label: 'Payment Reminder', description: 'Send payment reminders' },
    { value: 'followup', label: 'Client Follow-up', description: 'Follow up with prospects' },
    { value: 'task', label: 'Task Creation', description: 'Create tasks automatically' },
    { value: 'email', label: 'Email Automation', description: 'Send automated emails' }
  ];

  const triggerConditions = [
    'Invoice overdue by 7 days',
    'New client added',
    'Project completed',
    'Task assigned',
    'Monthly recurring',
    'Weekly recurring',
    'Custom condition'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!automation.name) throw new Error('Automation name is required');
      if (!automation.trigger_condition) throw new Error('Trigger condition is required');

      await onSubmit(automation);
      onClose();
    } catch (error) {
      console.error('Error submitting automation:', error);
      setError(error instanceof Error ? error.message : 'Failed to create automation');
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
          <Zap className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create Automation</h3>
          <p className="text-sm text-gray-500">Set up automated business workflows</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Automation Name *
          </label>
          <input
            type="text"
            id="name"
            value={automation.name}
            onChange={(e) => setAutomation({ ...automation, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Automation Type *
          </label>
          <div className="mt-2 space-y-3">
            {automationTypes.map((type) => (
              <label key={type.value} className="flex items-start">
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={automation.type === type.value}
                  onChange={(e) => setAutomation({ ...automation, type: e.target.value as any })}
                  className="mt-1 h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="trigger_condition" className="block text-sm font-medium text-gray-700">
            Trigger Condition *
          </label>
          <select
            id="trigger_condition"
            value={automation.trigger_condition}
            onChange={(e) => setAutomation({ ...automation, trigger_condition: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Select Trigger</option>
            {triggerConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Action Configuration */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Action Configuration</h4>
          
          {automation.type === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Subject
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Payment Reminder"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Template
                </label>
                <textarea
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  rows={4}
                  placeholder="Dear {{client_name}}, this is a reminder that your payment is due..."
                />
              </div>
            </div>
          )}

          {automation.type === 'task' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Task Title Template
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Follow up with {{client_name}}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Assignee
                </label>
                <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
                  <option value="">Auto-assign</option>
                  <option value="owner">Business Owner</option>
                  <option value="manager">Project Manager</option>
                </select>
              </div>
            </div>
          )}

          {automation.type === 'invoice' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Template
                </label>
                <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
                  <option value="standard">Standard Invoice</option>
                  <option value="recurring">Recurring Service</option>
                  <option value="project">Project-based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Terms (Days)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="30"
                  min="1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={automation.is_active}
            onChange={(e) => setAutomation({ ...automation, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Activate this automation immediately
          </label>
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
              'Create Automation'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}