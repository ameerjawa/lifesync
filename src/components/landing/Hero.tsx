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
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-teal-50/50 to-white pt-32 pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary-200 to-accent-100 opacity-40 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-secondary-200 to-primary-100 opacity-40 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-radial from-accent-100/20 to-transparent blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 text-primary-700 text-sm font-semibold animate-bounce-subtle"
            >
              <Sparkles className="inline h-4 w-4 mr-2" />
              AI-Powered Life Management
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl text-shadow-lg animate-fade-in-down">
              Your Life, <span className="gradient-text">Synchronized</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 animate-fade-in-up">
              Harness the power of AI to optimize your daily life. From scheduling to health tracking,
              financial planning to personal growth—all in one intelligent platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-scale-in"
          >
            <button
              onClick={onStartTrial}
              className="group flex items-center btn-primary glow-primary"
            >
              <Sparkles className="mr-2 h-5 w-5 animate-pulse-slow" />
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </button>
            <button
              onClick={handleTryDemo}
              className="group flex items-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-lg border-2 border-slate-200 transition-all hover:bg-gray-50 hover:shadow-xl hover:border-primary-300 hover:scale-105 active:scale-95"
            >
              Try Demo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="card-hover group animate-fade-in-up">
              <div className="p-8">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-3 shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/50 transition-all group-hover:scale-110 group-hover:rotate-3">
                  <Brain className="h-full w-full text-white" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">AI-Powered Tasks</h3>
                <p className="mt-2 text-gray-600">Smart task management with AI optimization</p>
              </div>
            </div>
            <div className="card-hover group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="p-8">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-red-400 to-pink-600 p-3 shadow-lg shadow-red-500/30 group-hover:shadow-xl group-hover:shadow-red-500/50 transition-all group-hover:scale-110 group-hover:rotate-3">
                  <Heart className="h-full w-full text-white" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">Health Tracking</h3>
                <p className="mt-2 text-gray-600">Comprehensive health and wellness monitoring</p>
              </div>
            </div>
            <div className="card-hover group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="p-8">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary-400 to-emerald-600 p-3 shadow-lg shadow-secondary-500/30 group-hover:shadow-xl group-hover:shadow-secondary-500/50 transition-all group-hover:scale-110 group-hover:rotate-3">
                  <Wallet className="h-full w-full text-white" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">Finance Management</h3>
                <p className="mt-2 text-gray-600">Smart budgeting and investment insights</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}