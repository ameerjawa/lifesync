import React from 'react';

interface AppearanceSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function AppearanceSettings({ formData, setFormData }: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize how LifeSync looks and feels.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {['light', 'dark', 'system'].map((theme) => (
              <div
                key={theme}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 ${
                  formData.theme === theme
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => setFormData({ ...formData, theme: theme })}
              >
                <span className="capitalize">{theme}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date Format
          </label>
          <select
            value={formData.dateFormat}
            onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Format
          </label>
          <select
            value={formData.timeFormat}
            onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="12h">12-hour (1:30 PM)</option>
            <option value="24h">24-hour (13:30)</option>
          </select>
        </div>
      </div>
    </div>
  );
}