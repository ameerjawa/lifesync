import React from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';

export function DataManagementSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your data, exports, and account deletion options.
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Export */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Download className="mr-2 h-5 w-5 text-primary-600" />
            Export Your Data
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Download a copy of your data in various formats
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Complete data export</span>
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-500">
                Export All Data
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Export specific data</span>
              <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
                <option value="tasks">Tasks</option>
                <option value="health">Health Data</option>
                <option value="finance">Financial Data</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Import */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Upload className="mr-2 h-5 w-5 text-primary-600" />
            Import Data
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Import data from other services or backups
          </p>
          <div className="mt-4">
            <label className="block">
              <span className="sr-only">Choose file</span>
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
              />
            </label>
          </div>
        </div>

        {/* Data Retention */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Database className="mr-2 h-5 w-5 text-primary-600" />
            Data Retention
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Configure how long your data is stored
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">
                Keep activity history for
              </label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
                <option value="forever">Forever</option>
              </select>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Automatically delete inactive data
              </span>
            </label>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h4 className="flex items-center text-sm font-medium text-red-900">
            <Trash2 className="mr-2 h-5 w-5 text-red-600" />
            Delete Account
          </h4>
          <p className="mt-1 text-sm text-red-500">
            Permanently delete your account and all associated data
          </p>
          <div className="mt-4">
            <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}