import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Mail, Phone, Building } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessClientForm } from './BusinessClientForm';

export function BusinessClients() {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'lead' | 'prospect' | 'active' | 'inactive'>('all');
  
  const {
    clients,
    loadClients,
    addClient,
    updateClient,
    deleteClient,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filteredClients = clients.filter(client => 
    selectedStatus === 'all' || client.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'churned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600">Manage your client relationships and communications</p>
        </div>
        <button
          onClick={() => setIsAddingClient(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'lead', 'prospect', 'active', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === status
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-gray-600 mb-2">{client.company}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {client.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {client.phone}
                </div>
              )}
              {client.address && (
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {client.address}
                </div>
              )}
            </div>

            {/* Client Value */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Lifetime Value</span>
              <span className="font-medium text-gray-900">
                ${client.lifetime_value.toLocaleString()}
              </span>
            </div>

            {/* Last Contact */}
            {client.last_contact && (
              <div className="text-xs text-gray-500 mb-4">
                Last contact: {new Date(client.last_contact).toLocaleDateString()}
              </div>
            )}

            {/* Next Follow-up */}
            {client.next_followup && (
              <div className="text-xs text-gray-500 mb-4">
                Next follow-up: {new Date(client.next_followup).toLocaleDateString()}
              </div>
            )}

            {/* Tags */}
            {client.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => updateClient(client.id, {
                  status: client.status === 'lead' ? 'prospect' :
                          client.status === 'prospect' ? 'active' : client.status
                })}
                className="flex-1 text-sm text-primary-600 hover:text-primary-500 py-2"
              >
                {client.status === 'lead' ? 'Convert to Prospect' :
                 client.status === 'prospect' ? 'Convert to Active' : 'Contact'}
              </button>
              <button
                onClick={() => deleteClient(client.id)}
                className="text-sm text-red-600 hover:text-red-500 py-2 px-3"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStatus === 'all' 
                ? "Get started by adding your first client"
                : `No clients with status "${selectedStatus}"`
              }
            </p>
            {selectedStatus === 'all' && (
              <button
                onClick={() => setIsAddingClient(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Client
              </button>
            )}
          </div>
        )}
      </div>

      {/* Client Form Modal */}
      {isAddingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessClientForm
            onSubmit={async (client) => {
              await addClient(client);
              setIsAddingClient(false);
            }}
            onClose={() => setIsAddingClient(false)}
          />
        </div>
      )}
    </div>
  );
}