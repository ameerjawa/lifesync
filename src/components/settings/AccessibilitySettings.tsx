import React from 'react';

export function AccessibilitySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Accessibility</h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize your experience to make LifeSync more accessible.
        </p>
      </div>

      <div className="space-y-4">
        {/* Text Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Text Size
          </label>
          <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="x-large">Extra Large</option>
          </select>
        </div>

        {/* Contrast Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contrast
          </label>
          <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="normal">Normal</option>
            <option value="high">High Contrast</option>
          </select>
        </div>

        {/* Animation Settings */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Reduce motion</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Minimize animations and transitions
          </p>
        </div>

        {/* Screen Reader Settings */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enhanced screen reader support</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Add additional descriptions for screen readers
          </p>
        </div>

        {/* Keyboard Navigation */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enhanced keyboard navigation</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Improve keyboard focus indicators and shortcuts
          </p>
        </div>

        {/* Color Blindness Support */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color Blindness Support
          </label>
          <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="none">None</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
        </div>
      </div>
    </div>
  );
}