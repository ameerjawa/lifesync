import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Play, Pause, Calendar, Zap, X } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessAutomationForm } from './BusinessAutomationForm';

export function BusinessAutomations() {
  const [isAddingAutomation, setIsAddingAutomation] = useState(false);
  
  const {
    automations,
    loadAutomations,
    addAutomation,
    updateAutomation,
    deleteAutomation,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      case 'followup':
        return 'bg-purple-100 text-purple-800';
      case 'task':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleAutomation = async (automation: any) => {
    try {
      await updateAutomation(automation.id, { is_active: !automation.is_active });
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Automations</h2>
          <p className="text-gray-600">Automate repetitive business tasks and workflows</p>
        </div>
        <button
          onClick={() => setIsAddingAutomation(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Automation
        </button>
      </div>

      {/* Automation Templates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-gray-300 hover:border-indigo-300 cursor-pointer"
          onClick={() => setIsAddingAutomation(true)}
        >
          <div className="text-center">
            <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recurring Invoices</h3>
            <p className="text-sm text-gray-500">Automatically generate invoices for recurring clients</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-gray-300 hover:border-indigo-300 cursor-pointer"
          onClick={() => setIsAddingAutomation(true)}
        >
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Follow-up Reminders</h3>
            <p className="text-sm text-gray-500">Send automatic follow-up emails to prospects</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-gray-300 hover:border-indigo-300 cursor-pointer"
          onClick={() => setIsAddingAutomation(true)}
        >
          <div className="text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Task Assignment</h3>
            <p className="text-sm text-gray-500">Automatically assign tasks based on criteria</p>
          </div>
        </motion.div>
      </div>

      {/* Active Automations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Automations</h3>
        
        {automations.map((automation, index) => (
          <motion.div
            key={automation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${automation.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Settings className={`h-5 w-5 ${automation.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{automation.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(automation.type)}`}>
                      {automation.type}
                    </span>
                    <span>Trigger: {automation.trigger_condition}</span>
                    {automation.last_run && (
                      <span>Last run: {new Date(automation.last_run).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAutomation(automation)}
                  className={`p-2 rounded-lg ${
                    automation.is_active
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {automation.is_active ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => deleteAutomation(automation.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {automations.length === 0 && (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No automations yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first automation to streamline your business processes
            </p>
            <button
              onClick={() => setIsAddingAutomation(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Automation
            </button>
          </div>
        )}
      </div>

      {/* Automation Form Modal */}
      {isAddingAutomation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessAutomationForm
            onSubmit={async (automation) => {
              await addAutomation(automation);
              setIsAddingAutomation(false);
            }}
            onClose={() => setIsAddingAutomation(false)}
          />
        </div>
      )}
    </div>
  );
}