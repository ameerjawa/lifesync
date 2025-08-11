import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plug, ArrowRight } from 'lucide-react';
import { IntegrationsModal } from './IntegrationsModal';

export function Integrations() {
  const [showModal, setShowModal] = useState(false);

  const integrations = [
    {
      name: 'Google Calendar',
      description: 'Sync your tasks and events',
      icon: 'https://www.google.com/favicon.ico'
    },
    {
      name: 'Fitbit',
      description: 'Track your health metrics',
      icon: 'https://www.fitbit.com/favicon.ico'
    },
    {
      name: 'Slack',
      description: 'Team collaboration',
      icon: 'https://slack.com/favicon.ico'
    },
    {
      name: 'GitHub',
      description: 'Project tracking',
      icon: 'https://github.com/favicon.ico'
    }
  ];

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your favorite tools and services to streamline your workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setShowModal(true)}
              >
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={integration.icon}
                    alt={integration.name}
                    className="h-8 w-8 rounded-lg"
                  />
                  <Plug className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600">{integration.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-500"
            >
              View All Integrations
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && <IntegrationsModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}