import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  X,
  Send
} from 'lucide-react';

export function AdminNotifications() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'system' | 'user' | 'alerts'>('all');
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data - replace with real data
  const notifications = [
    {
      id: 1,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance in 2 hours',
      timestamp: '2025-03-15T10:00:00Z',
      status: 'pending'
    },
    {
      id: 2,
      type: 'user',
      title: 'New Enterprise Sign Up',
      message: 'TechCorp has signed up for enterprise plan',
      timestamp: '2025-03-15T09:30:00Z',
      status: 'unread'
    },
    {
      id: 3,
      type: 'alert',
      title: 'High Server Load',
      message: 'Server load exceeded 80%',
      timestamp: '2025-03-15T09:00:00Z',
      status: 'resolved'
    }
  ];

  const handleSendNotification = () => {
    // Implement notification sending logic
    console.log('Sending notification:', { message, selectedUsers });
    setMessage('');
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <button className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          <Bell className="mr-2 h-5 w-5" />
          Send Notification
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All', icon: Bell },
            { id: 'system', label: 'System', icon: Mail },
            { id: 'user', label: 'User', icon: MessageSquare },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center border-b-2 px-1 pb-4 pt-2 text-sm font-medium ${
                selectedTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications
          .filter(n => selectedTab === 'all' || n.type === selectedTab)
          .map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${
                  notification.type === 'system' ? 'bg-blue-100 text-blue-600' :
                  notification.type === 'user' ? 'bg-green-100 text-green-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {notification.type === 'system' ? <Mail className="h-5 w-5" /> :
                   notification.type === 'user' ? <MessageSquare className="h-5 w-5" /> :
                   <AlertTriangle className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  notification.status === 'unread' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {notification.status}
                </span>
                <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Send Notification Form */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Notification</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recipients
            </label>
            <select
              multiple
              value={selectedUsers}
              onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Users</option>
              <option value="premium">Premium Users</option>
              <option value="enterprise">Enterprise Users</option>
              <option value="trial">Trial Users</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your notification message..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSendNotification}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              <Send className="mr-2 h-5 w-5" />
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}