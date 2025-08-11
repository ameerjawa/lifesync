import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Heart, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGuestStore } from '../../store/guestStore';

interface HeroProps {
  onStartTrial: () => void;
}

export function Hero({ onStartTrial }: HeroProps) {
  const navigate = useNavigate();
  const startGuestSession = useGuestStore(state => state.startGuestSession);

  const handleTryDemo = () => {
    startGuestSession();
    navigate('/dashboard');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white pt-32 pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-100 to-purple-50 opacity-50 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Life, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Synchronized</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Harness the power of AI to optimize your daily life. From scheduling to health tracking, 
              financial planning to personal growth—all in one intelligent platform.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              onClick={onStartTrial}
              className="group flex items-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-xl"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={handleTryDemo}
              className="group flex items-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            >
              Try Demo
            </button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <Brain className="mx-auto h-12 w-12 text-indigo-600" />
              <h3 className="mt-4 text-lg font-semibold">AI-Powered Tasks</h3>
              <p className="mt-2 text-gray-600">Smart task management with AI optimization</p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <Heart className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="mt-4 text-lg font-semibold">Health Tracking</h3>
              <p className="mt-2 text-gray-600">Comprehensive health and wellness monitoring</p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <Wallet className="mx-auto h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-lg font-semibold">Finance Management</h3>
              <p className="mt-2 text-gray-600">Smart budgeting and investment insights</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}