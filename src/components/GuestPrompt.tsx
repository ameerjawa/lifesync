import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

interface GuestPromptProps {
  onClose: () => void;
  message?: string;
}

export function GuestPrompt({ onClose, message }: GuestPromptProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = () => {
    navigate('/signup', { 
      state: { from: location.pathname }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-center">
          <div className="bg-indigo-100 rounded-full p-3">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        
        <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">
          Ready to unlock full access?
        </h3>
        
        <p className="mb-6 text-center text-gray-600">
          {message || 'Sign up now to unlock unlimited tasks, AI insights, and more premium features!'}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleSignup}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Sign up for free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </motion.div>
  );
}