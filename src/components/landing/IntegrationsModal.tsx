import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

interface IntegrationsModalProps {
  onClose: () => void;
}

export function IntegrationsModal({ onClose }: IntegrationsModalProps) {
  const integrations = [
    {
      name: 'Google Calendar',
      description: 'Sync your tasks and events with Google Calendar',
      icon: 'https://www.google.com/favicon.ico',
      category: 'Productivity',
      status: 'Available'
    },
    {
      name: 'Fitbit',
      description: 'Track your health metrics from your Fitbit device',
      icon: 'https://www.fitbit.com/favicon.ico',
      category: 'Health',
      status: 'Available'
    },
    {
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace',
      icon: 'https://slack.com/favicon.ico',
      category: 'Communication',
      status: 'Available'
    },
    {
      name: 'GitHub',
      description: 'Track projects and issues from GitHub repositories',
      icon: 'https://github.com/favicon.ico',
      category: 'Development',
      status: 'Available'
    },
    {
      name: 'Spotify',
      description: 'Control your music and create focus playlists',
      icon: 'https://www.spotify.com/favicon.ico',
      category: 'Lifestyle',
      status: 'Coming Soon'
    },
    {
      name: 'Notion',
      description: 'Sync notes and documents with Notion',
      icon: 'https://styles.redditmedia.com/t5_hds7r/styles/communityIcon_xuvlpc4czosd1.jpg?format=pjpg&s=17ba0c6883e07ab3695b9cb7664bd81e1d922ee1',
      category: 'Productivity',
      status: 'Coming Soon'
    },
    {
      name: 'Apple Health',
      description: 'Sync health data from your Apple devices',
      icon: 'https://www.apple.com/favicon.ico',
      category: 'Health',
      status: 'Coming Soon'
    },
    {
      name: 'Microsoft Teams',
      description: 'Collaborate with your team in Microsoft Teams',
      icon: 'https://www.microsoft.com/favicon.ico',
      category: 'Communication',
      status: 'Coming Soon'
    }
  ];

  const categories = Array.from(new Set(integrations.map(i => i.category)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Integrations</h2>
              <p className="text-sm text-gray-500">Connect your favorite tools and services</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6">
          {categories.map(category => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{category}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {integrations
                  .filter(integration => integration.category === category)
                  .map(integration => (
                    <div
                      key={integration.name}
                      className="flex items-start rounded-lg border p-4 hover:bg-gray-50"
                    >
                      <img
                        src={integration.icon}
                        alt={integration.name}
                        className="h-8 w-8 rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900">{integration.name}</h4>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            integration.status === 'Available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {integration.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{integration.description}</p>
                        {integration.status === 'Available' && (
                          <button className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Connect
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
