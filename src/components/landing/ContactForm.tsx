import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Building, Phone, Send } from 'lucide-react';

interface ContactFormProps {
  onClose: () => void;
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message for WhatsApp
    const whatsappMessage = `
*New Sales Inquiry*
Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}
    `.trim();

    // Create WhatsApp URL with the formatted message
    const whatsappUrl = `https://wa.me/16729621808?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Close the form
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Sales</h2>
          <p className="mb-6 text-gray-600">
            Fill out the form below and we'll connect with you on WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 flex rounded-lg border border-gray-300 shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full rounded-r-lg border-0 px-4 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1 flex rounded-lg border border-gray-300 shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <Building className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="block w-full rounded-r-lg border-0 px-4 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 flex rounded-lg border border-gray-300 shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-r-lg border-0 px-4 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 flex rounded-lg border border-gray-300 shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <Phone className="h-5 w-5" />
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full rounded-r-lg border-0 px-4 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={4}
                required
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
                className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500"
              >
                <Send className="mr-2 h-5 w-5" />
                Continue on WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}