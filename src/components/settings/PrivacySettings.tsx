import React from 'react';
import { Shield, Eye, Lock, Bell } from 'lucide-react';

export function PrivacySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your privacy preferences and data sharing settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Collection */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Shield className="mr-2 h-5 w-5 text-indigo-600" />
            Data Collection
          </h4>
          <div className="mt-4 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Allow analytics data collection
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Share usage statistics to improve the service
              </span>
            </label>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Eye className="mr-2 h-5 w-5 text-indigo-600" />
            Profile Visibility
          </h4>
          <div className="mt-4 space-y-4">
            <label className="block text-sm text-gray-700">
              Who can see my profile
            </label>
            <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500">
              <option value="public">Everyone</option>
              <option value="contacts">Only Contacts</option>
              <option value="private">Only Me</option>
            </select>
          </div>
        </div>

        {/* Activity Status */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Bell className="mr-2 h-5 w-5 text-indigo-600" />
            Activity Status
          </h4>
          <div className="mt-4 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Show when I'm active
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Show read receipts
              </span>
            </label>
          </div>
        </div>

        {/* Third-Party Data Sharing */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Lock className="mr-2 h-5 w-5 text-indigo-600" />
            Third-Party Data Sharing
          </h4>
          <div className="mt-4 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Allow third-party integrations to access my data
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Share data with partners for improved services
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}