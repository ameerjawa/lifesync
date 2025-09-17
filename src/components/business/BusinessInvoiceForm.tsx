import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Calendar, DollarSign, Plus, Trash2 } from 'lucide-react';
import type { BusinessInvoice, BusinessClient, BusinessProject, InvoiceLineItem } from '../../lib/types';

interface BusinessInvoiceFormProps {
  clients: BusinessClient[];
  projects: BusinessProject[];
  onSubmit: (invoice: Omit<BusinessInvoice, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

export function BusinessInvoiceForm({ clients, projects, onSubmit, onClose }: BusinessInvoiceFormProps) {
  const [invoice, setInvoice] = useState({
    client_id: '',
    project_id: '',
    invoice_number: `INV-${Date.now()}`,
    status: 'draft' as const,
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    currency: 'USD',
    notes: '',
    line_items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ] as InvoiceLineItem[]
  });

  const [taxRate, setTaxRate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotals = () => {
    const subtotal = invoice.line_items.reduce((sum, item) => sum + item.amount, 0);
    const tax_amount = subtotal * (taxRate / 100);
    const total_amount = subtotal + tax_amount;
    return { subtotal, tax_amount, total_amount };
  };

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const newItems = [...invoice.line_items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount for quantity/rate changes
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoice({ ...invoice, line_items: newItems });
  };

  const addLineItem = () => {
    setInvoice({
      ...invoice,
      line_items: [
        ...invoice.line_items,
        { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }
      ]
    });
  };

  const removeLineItem = (index: number) => {
    if (invoice.line_items.length > 1) {
      setInvoice({
        ...invoice,
        line_items: invoice.line_items.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!invoice.invoice_number) throw new Error('Invoice number is required');
      if (!invoice.due_date) throw new Error('Due date is required');
      if (invoice.line_items.length === 0) throw new Error('At least one line item is required');

      const { subtotal, tax_amount, total_amount } = calculateTotals();

      await onSubmit({
        ...invoice,
        client_id: invoice.client_id || undefined,
        project_id: invoice.project_id || undefined,
        subtotal,
        tax_amount,
        total_amount,
        paid_amount: 0
      });
      onClose();
    } catch (error) {
      console.error('Error submitting invoice:', error);
      setError(error instanceof Error ? error.message : 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { subtotal, tax_amount, total_amount } = calculateTotals();

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-6 flex items-center">
        <div className="mr-4 rounded-full bg-indigo-100 p-3">
          <FileText className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Invoice</h3>
          <p className="text-sm text-gray-500">Generate an invoice for your client</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">
              Invoice Number *
            </label>
            <input
              type="text"
              id="invoice_number"
              value={invoice.invoice_number}
              onChange={(e) => setInvoice({ ...invoice, invoice_number: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              id="client"
              value={invoice.client_id}
              onChange={(e) => setInvoice({ ...invoice, client_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              id="project"
              value={invoice.project_id}
              onChange={(e) => setInvoice({ ...invoice, project_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700">
              Issue Date *
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="issue_date"
                value={invoice.issue_date}
                onChange={(e) => setInvoice({ ...invoice, issue_date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="due_date"
                value={invoice.due_date}
                onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
                min={invoice.issue_date}
              />
            </div>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              value={invoice.currency}
              onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Line Items</h4>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {invoice.line_items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Service or product description"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Qty
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rate
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={item.amount}
                    readOnly
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="p-2 text-red-600 hover:text-red-500"
                    disabled={invoice.line_items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tax:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                  <span className="text-sm font-medium">${tax_amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={invoice.notes}
            onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Payment terms, additional notes..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Invoice'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}