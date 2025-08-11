import React from 'react';
import { Plug, Check, ExternalLink } from 'lucide-react';

export function IntegrationSettings() {
  const integrations = [
    {
      name: 'Google Calendar',
      description: 'Sync your tasks and events with Google Calendar',
      connected: true,
      icon: 'https://www.google.com/favicon.ico'
    },
    {
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace',
      connected: false,
      icon: 'https://slack.com/favicon.ico'
    },
    {
      name: 'GitHub',
      description: 'Connect your GitHub repositories for task tracking',
      connected: false,
      icon: 'https://github.com/favicon.ico'
    },
    {
      name: 'Fitbit',
      description: 'Sync your health data from Fitbit',
      connected: true,
      icon: 'https://www.fitbit.com/favicon.ico'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your favorite apps and services to enhance your experience.
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <img
                src={integration.icon}
                alt={integration.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                <p className="text-sm text-gray-500">{integration.description}</p>
              </div>
            </div>
            <div>
              {integration.connected ? (
                <button className="inline-flex items-center rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  <Check className="mr-1 h-4 w-4" />
                  Connected
                </button>
              ) : (
                <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Plug className="mr-1 h-4 w-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-900">API Access</h4>
        <p className="mt-1 text-sm text-gray-500">
          Access your data programmatically using our API.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <button className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500">
            View API Documentation
            <ExternalLink className="ml-1 h-4 w-4" />
          </button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Generate API Key
          </button>
        </div>
      </div>
    </div>
  );
}