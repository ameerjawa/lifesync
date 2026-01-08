import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  CreditCard, 
  ArrowRight 
} from 'lucide-react';
import { ContactForm } from './ContactForm';

interface PricingProps {
  onStartTrial: () => void;
  onSignUp: () => void;
}

export function Pricing({ onStartTrial, onSignUp }: PricingProps) {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="mt-32">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
        Choose Your Path
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-white p-8 shadow-sm relative mt-6"
        >
          {/* No Credit Card Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
              No Credit Card Required
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Basic</h3>
          <p className="text-4xl font-bold mb-2">
            Free
            <span className="text-sm font-normal text-gray-500 block mt-1">Forever</span>
          </p>
          <div className="flex items-center mb-6 mt-2">
            <CreditCard className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-green-600">No credit card needed</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Smart task management
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Basic health tracking
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Simple budget planning
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Daily insights
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Mobile app access
            </li>
          </ul>
          <button
            onClick={onSignUp}
            className="w-full py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors flex items-center justify-center"
          >
            Sign Up Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl bg-primary-600 text-white p-8 ring-4 ring-primary-600 ring-opacity-50 relative mt-6"
        >
          {/* Trial Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
              7-Day Free Trial
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Premium</h3>
          <p className="text-4xl font-bold mb-2">
            $12
            <span className="text-lg font-normal">/mo</span>
          </p>
          <div className="flex items-center mb-6">
            <CreditCard className="h-5 w-5 text-white/80 mr-2" />
            <span className="text-sm text-white/80">No credit card for trial</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-white mr-2" />
              All Basic features
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-white mr-2" />
              Advanced AI insights
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-white mr-2" />
              Integration with devices
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-white mr-2" />
              Personalized coaching
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-white mr-2" />
              Priority support
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-white mr-2" />
              Custom analytics
            </li>
          </ul>
          <button
            onClick={onStartTrial}
            className="w-full py-3 rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <p className="text-center text-sm text-white/80 mt-3">
            Try all features free for 7 days
          </p>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl bg-white p-8 shadow-sm mt-6"
        >
          <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
          <p className="text-4xl font-bold mb-6">
            $49
            <span className="text-lg font-normal">/mo</span>
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              All Premium features
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Team collaboration
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Corporate wellness
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Custom integrations
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Dedicated support
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2" />
              Advanced security
            </li>
          </ul>
          <button
            onClick={() => setShowContactForm(true)}
            className="w-full py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors flex items-center justify-center"
          >
            Contact Sales
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
}