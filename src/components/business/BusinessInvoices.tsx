import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Calendar, DollarSign, Eye } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessInvoiceForm } from './BusinessInvoiceForm';

export function BusinessInvoices() {
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
  
  const {
    invoices,
    clients,
    projects,
    loadInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = invoices.filter(invoice => 
    selectedStatus === 'all' || invoice.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total_amount, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'sent')
    .reduce((sum, i) => sum + i.total_amount, 0);

  const overdueAmount = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + i.total_amount, 0);

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
          <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
          <p className="text-gray-600">Create and manage invoices for your clients</p>
        </div>
        <button
          onClick={() => setIsAddingInvoice(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${overdueAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === status
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.invoice_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.client?.name || 'No Client'}
                    </div>
                    {invoice.project?.name && (
                      <div className="text-sm text-gray-500">
                        Project: {invoice.project.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.total_amount.toLocaleString()}
                    </div>
                    {invoice.paid_amount > 0 && invoice.paid_amount < invoice.total_amount && (
                      <div className="text-sm text-gray-500">
                        ${invoice.paid_amount.toLocaleString()} paid
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-500">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateInvoice(invoice.id, {
                          status: invoice.status === 'draft' ? 'sent' :
                                  invoice.status === 'sent' ? 'paid' : invoice.status
                        })}
                        className="text-green-600 hover:text-green-500"
                      >
                        {invoice.status === 'draft' ? 'Send' :
                         invoice.status === 'sent' ? 'Mark Paid' : 'Update'}
                      </button>
                      <button
                        onClick={() => deleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStatus === 'all' 
                ? "Get started by creating your first invoice"
                : `No invoices with status "${selectedStatus}"`
              }
            </p>
            {selectedStatus === 'all' && (
              <button
                onClick={() => setIsAddingInvoice(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Invoice
              </button>
            )}
          </div>
        )}
      </div>

      {/* Invoice Form Modal */}
      {isAddingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessInvoiceForm
            clients={clients}
            projects={projects}
            onSubmit={async (invoice) => {
              await addInvoice(invoice);
              setIsAddingInvoice(false);
            }}
            onClose={() => setIsAddingInvoice(false)}
          />
        </div>
      )}
    </div>
  );
}