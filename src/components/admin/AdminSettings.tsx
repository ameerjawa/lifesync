import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Mail,
  Bell,
  Database,
  Server,
  Save,
  RefreshCw
} from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 100,
    maxFileSize: 10,
    retentionDays: 30,
    backupFrequency: 'daily'
  });

  const handleSave = () => {
    // Implement settings save logic
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow-lg"
      >
        <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-6">
          <Shield className="mr-2 h-5 w-5 text-primary-600" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500">
                Enable maintenance mode to prevent user access
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Debug Mode
              </label>
              <p className="text-sm text-gray-500">
                Enable detailed error logging
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => setSettings({ ...settings, debugMode: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg bg-white p-6 shadow-lg"
      >
        <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-6">
          <Bell className="mr-2 h-5 w-5 text-primary-600" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive system notifications via email
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                System Alerts
              </label>
              <p className="text-sm text-gray-500">
                Receive critical system alerts
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.systemAlerts}
                onChange={(e) => setSettings({ ...settings, systemAlerts: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg bg-white p-6 shadow-lg"
      >
        <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-6">
          <Server className="mr-2 h-5 w-5 text-primary-600" />
          System Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              API Rate Limit (requests/minute)
            </label>
            <input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => setSettings({ ...settings, apiRateLimit: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Retention (days)
            </label>
            <input
              type="number"
              value={settings.retentionDays}
              onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setSettings({
            emailNotifications: true,
            systemAlerts: true,
            maintenanceMode: false,
            debugMode: false,
            apiRateLimit: 100,
            maxFileSize: 10,
            retentionDays: 30,
            backupFrequency: 'daily'
          })}
          className="inline-flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}