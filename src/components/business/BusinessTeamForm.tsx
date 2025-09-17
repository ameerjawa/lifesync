import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

import { X, Users, Mail, DollarSign } from 'lucide-react';
import type { BusinessTeamMember } from '../../lib/types';

interface BusinessTeamFormProps {
  onSubmit: (member: Omit<BusinessTeamMember, 'id' | 'business_id' | 'joined_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessTeamForm({ onSubmit, onClose }: BusinessTeamFormProps) {
  const [member, setMember] = useState({
    user_id: '',
    email: '', // For inviting new users
    role: 'employee' as const,
    permissions: [] as string[],
    hourly_rate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access to business management' },
    { value: 'manager', label: 'Manager', description: 'Manage projects and team members' },
    { value: 'employee', label: 'Employee', description: 'Work on assigned tasks and projects' },
    { value: 'contractor', label: 'Contractor', description: 'Limited access for external workers' }
  ];

  const availablePermissions = [
    'manage_projects',
    'manage_clients',
    'manage_invoices',
    'manage_expenses',
    'manage_team',
    'view_analytics',
    'manage_automations'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!member.email) throw new Error('Email is required');
      if (!member.role) throw new Error('Role is required');

      // For now, we'll use email as user_id (in real implementation, you'd look up or invite the user)
      await onSubmit({
        ...member,
        user_id: null, // This would be replaced with actual user lookup
        hourly_rate: member.hourly_rate ? Number(member.hourly_rate) : undefined
      });
      onClose();
    } catch (error) {
      console.error('Error submitting team member:', error);
      setError(error instanceof Error ? error.message : 'Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setMember({ ...member, role: role as any });
    
    // Set default permissions based on role
    let defaultPermissions: string[] = [];
    switch (role) {
      case 'admin':
        defaultPermissions = availablePermissions;
        break;
      case 'manager':
        defaultPermissions = ['manage_projects', 'manage_clients', 'view_analytics'];
        break;
      case 'employee':
        defaultPermissions = ['manage_projects'];
        break;
      case 'contractor':
        defaultPermissions = [];
        break;
    }
    setMember(prev => ({ ...prev, permissions: defaultPermissions }));
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
          <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
          <p className="text-sm text-gray-500">Invite a new team member to your business</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Role *
          </label>
          <div className="space-y-3">
            {roles.map((role) => (
              <label key={role.value} className="flex items-start">
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={member.role === role.value}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{role.label}</div>
                  <div className="text-sm text-gray-500">{role.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
            Hourly Rate (Optional)
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="hourly_rate"
              value={member.hourly_rate}
              onChange={(e) => setMember({ ...member, hourly_rate: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Permissions
          </label>
          <div className="space-y-2">
            {availablePermissions.map((permission) => (
              <label key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  checked={member.permissions.includes(permission)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMember({
                        ...member,
                        permissions: [...member.permissions, permission]
                      });
                    } else {
                      setMember({
                        ...member,
                        permissions: member.permissions.filter(p => p !== permission)
                      });
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
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
            disabled={isSubmitting}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Adding...</span>
              </div>
            ) : (
              'Add Team Member'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}