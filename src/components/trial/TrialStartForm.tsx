import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useTrialStore } from '../../store/trialStore';
import { useNavigate } from 'react-router-dom';

export function TrialStartForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { startTrial } = useTrialStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await startTrial(email);
      navigate('/setup');
    } catch (error) {
      console.error('Error starting trial:', error);
      setError('Failed to start trial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Start Your 7-Day Premium Trial
        </h2>
        <p className="text-gray-600">
          Experience all premium features free for 7 days. No credit card required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          By starting a trial, you agree to our{' '}
          <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </p>
      </form>

      <div className="mt-8 space-y-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-600">Full access to all premium features</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-600">AI-powered insights and recommendations</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-600">Personalized 7-day action plan</span>
        </div>
      </div>
    </motion.div>
  );
}