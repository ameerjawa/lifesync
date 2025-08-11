import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AIAssistantProvider } from './AIAssistantProvider';
import { AIHeader } from './AIHeader';
import { ChatView } from './views/ChatView';
import { InsightsView } from './views/InsightsView';
import { ScheduleView } from './views/ScheduleView';
import { HelpView } from './views/HelpView';
import { useAIHandler } from './useAIHandler';

function AIAssistantContent() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [input, setInput] = useState('');
  const { isOpen, setIsOpen, activeView, handleSubmit } = useAIHandler();

  return (
    <>
      {/* AI Assistant Button */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Bell className="h-6 w-6" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-2 w-80 rounded-lg bg-white shadow-xl"
              >
                <div className="flex items-center justify-between border-b p-4">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto p-4">
                  <div className="text-center text-gray-500">
                    No notifications
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-colors"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 w-96 rounded-lg bg-white shadow-xl flex flex-col"
            style={{ height: 'calc(100vh - 120px)', maxHeight: '800px' }}
          >
            <AIHeader />
            
            <div className="flex-1 overflow-y-auto p-4">
              {activeView === 'chat' && (
                <ChatView
                  onSubmit={handleSubmit}
                  input={input}
                  setInput={setInput}
                />
              )}
              
              {activeView === 'insights' && <InsightsView />}
              {activeView === 'schedule' && <ScheduleView />}
              {activeView === 'help' && <HelpView />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function AIAssistant() {
  return (
    <AIAssistantProvider>
      <AIAssistantContent />
    </AIAssistantProvider>
  );
}