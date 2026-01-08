import React from 'react';
import { Mail, Phone, Building, Globe, Shield, Calendar, Key } from 'lucide-react';
import type { User } from './types';

interface UserDetailsProps {
  user: User;
  onUpdate: (updates: Partial<User>) => Promise<void>;
}

export function UserDetails({ user, onUpdate }: UserDetailsProps) {
  return (
    <div className="px-6 pb-6 border-t pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Profile Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => onUpdate({ email: e.target.value })}
                  className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => onUpdate({ phone: e.target.value })}
                  className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Company</label>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={user.company || ''}
                  onChange={(e) => onUpdate({ company: e.target.value })}
                  className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Website</label>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="url"
                  value={user.website || ''}
                  onChange={(e) => onUpdate({ website: e.target.value })}
                  className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Account Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Current Plan</label>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {user.subscription?.plan || 'free'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Status</label>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.subscription?.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                  user.subscription?.status === 'past_due' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.subscription?.status || 'free'}
                </span>
              </div>
            </div>
            {user.subscription?.current_period_start && (
              <div>
                <label className="block text-sm text-gray-500 mb-1">Subscription Period</label>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {new Date(user.subscription.current_period_start).toLocaleDateString()} - {' '}
                    {new Date(user.subscription.current_period_end).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Account Created</label>
              <div className="flex items-center">
                <Key className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}