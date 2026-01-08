import React from 'react';

interface NotificationSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function NotificationSettings({ formData, setFormData }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how you want to be notified about your activities.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.notifications_enabled}
              onChange={(e) => setFormData({ ...formData, notifications_enabled: e.target.checked })}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300"></div>
          </label>
        </div>

        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.email_notifications.tasks}
              onChange={(e) => setFormData({
                ...formData,
                email_notifications: {
                  ...formData.email_notifications,
                  tasks: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Task updates and reminders</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.email_notifications.goals}
              onChange={(e) => setFormData({
                ...formData,
                email_notifications: {
                  ...formData.email_notifications,
                  goals: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Goal progress and achievements</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.email_notifications.health}
              onChange={(e) => setFormData({
                ...formData,
                email_notifications: {
                  ...formData.email_notifications,
                  health: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Health insights and reminders</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.email_notifications.finance}
              onChange={(e) => setFormData({
                ...formData,
                email_notifications: {
                  ...formData.email_notifications,
                  finance: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Financial alerts and reports</span>
          </label>
        </div>
      </div>
    </div>
  );
}