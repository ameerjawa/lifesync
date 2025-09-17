import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Mail, Phone, Building } from 'lucide-react';
import type { BusinessClient } from '../../lib/types';

interface BusinessClientFormProps {
  onSubmit: (client: Omit<BusinessClient, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessClientForm({ onSubmit, onClose }: BusinessClientFormProps) {
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'lead' as const,
    source: 'direct',
    notes: '',
    tags: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!client.name) throw new Error('Client name is required');

      await onSubmit({
        ...client,
        lifetime_value: 0
      });
      onClose();
    } catch (error) {
      console.error('Error submitting client:', error);
      setError(error instanceof Error ? error.message : 'Failed to create client');
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
        <div className="mr-4 rounded-full bg-indigo-100 p-3">
          <Users className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
          <p className="text-sm text-gray-500">Create a new client record</p>
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
              Client Name *
            </label>
            <input
              type="text"
              id="name"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="company"
                value={client.company}
                onChange={(e) => setClient({ ...client, company: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={client.phone}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={client.status}
              onChange={(e) => setClient({ ...client, status: e.target.value as any })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="churned">Churned</option>
            </select>
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Source
            </label>
            <select
              id="source"
              value={client.source}
              onChange={(e) => setClient({ ...client, source: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="direct">Direct</option>
              <option value="referral">Referral</option>
              <option value="website">Website</option>
              <option value="social_media">Social Media</option>
              <option value="advertising">Advertising</option>
              <option value="cold_outreach">Cold Outreach</option>
              <option value="networking">Networking</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={client.notes}
            onChange={(e) => setClient({ ...client, notes: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={client.tags.join(', ')}
            onChange={(e) => setClient({
              ...client,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="vip, enterprise, tech"
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
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Add Client'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}