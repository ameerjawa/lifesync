import React from 'react';
import { Shield } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and privacy settings.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Shield className="mr-2 h-5 w-5 text-indigo-600" />
            Password
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Last changed 3 months ago
          </p>
          <button className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
            Change Password
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Shield className="mr-2 h-5 w-5 text-indigo-600" />
            Two-Factor Authentication
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Add an extra layer of security to your account
          </p>
          <button className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
            Enable 2FA
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Shield className="mr-2 h-5 w-5 text-red-600" />
            Delete Account
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Permanently delete your account and all data
          </p>
          <button className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}