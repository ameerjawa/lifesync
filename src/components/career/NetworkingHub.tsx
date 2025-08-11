import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  UserPlus,
  MessageSquare,
  Calendar,
  Building,
  MapPin,
  Search,
  Filter
} from 'lucide-react';

export function NetworkingHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const connections = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      mutual: 12,
      status: 'connected'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      company: 'InnovateLabs',
      location: 'New York, NY',
      mutual: 8,
      status: 'pending'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      role: 'Engineering Manager',
      company: 'StartupX',
      location: 'Austin, TX',
      mutual: 15,
      status: 'connected'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Meetup 2025',
      date: '2025-03-15',
      location: 'San Francisco',
      attendees: 150,
      type: 'in-person'
    },
    {
      id: 2,
      title: 'Virtual Networking Coffee',
      date: '2025-03-20',
      location: 'Online',
      attendees: 25,
      type: 'virtual'
    },
    {
      id: 3,
      title: 'Women in Tech Conference',
      date: '2025-04-01',
      location: 'Chicago',
      attendees: 500,
      type: 'in-person'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections, companies, or events..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Connections</option>
            <option value="pending">Pending</option>
            <option value="connected">Connected</option>
          </select>
          <button className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
            <UserPlus className="mr-2 h-5 w-5" />
            Add Connection
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Users className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Connections</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">247</p>
          <p className="text-sm text-gray-500">+12 this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Building className="h-6 w-6 text-green-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Companies</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">85</p>
          <p className="text-sm text-gray-500">Across 12 industries</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Messages</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">32</p>
          <p className="text-sm text-gray-500">8 unread</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-orange-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Events</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-500">Upcoming this month</p>
        </motion.div>
      </div>

      {/* Connections and Events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Connections */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Connections</h3>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{connection.name}</h4>
                    <p className="text-sm text-gray-500">{connection.role}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <Building className="mr-1 h-4 w-4" />
                      {connection.company}
                      <MapPin className="ml-2 mr-1 h-4 w-4" />
                      {connection.location}
                    </div>
                  </div>
                </div>
                <button className="rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    event.type === 'virtual'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(event.date).toLocaleDateString()}
                  <MapPin className="ml-2 mr-1 h-4 w-4" />
                  {event.location}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {event.attendees} attendees
                  </span>
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
                    RSVP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}