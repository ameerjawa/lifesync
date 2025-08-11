import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Brain,
  Heart,
  Wallet,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Plus,
  Sparkles
} from 'lucide-react';
import { GoalsList } from './GoalsList';
import { GoalForm } from './GoalForm';
import { GoalProgress } from './GoalProgress';
import { GoalInsights } from './GoalInsights';
import { useGoalStore } from '../../store/goalStore';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { GuestPrompt } from '../GuestPrompt';
import { UpgradePrompt } from '../trial/UpgradePrompt';

export function GoalsDashboard() {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tasks' | 'health' | 'finance'>('all');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const { goals, loadGoals, isLoading } = useGoalStore();
  const { isGuest, setReturnPath } = useGuestStore();
  const { checkFeatureAccess } = useSubscriptionStore();

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleAddGoal = () => {
    if (isGuest) {
      setReturnPath('/dashboard/goals');
      setShowGuestPrompt(true);
      return;
    }

    if (!checkFeatureAccess('unlimited_tasks')) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsAddingGoal(true);
  };

  // Calculate stats
  const stats = {
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    dueThisWeek: goals.filter(g => {
      const dueDate = new Date(g.target_date);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate >= today && dueDate <= weekFromNow;
    }).length,
    averageProgress: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Goals Dashboard</h2>
              <p className="mt-2 text-indigo-100">Track, achieve, and celebrate your progress</p>
            </div>
            <button
              onClick={handleAddGoal}
              className="flex items-center rounded-lg bg-white px-4 py-2 text-indigo-600 shadow-md transition-all hover:bg-indigo-50"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Goal
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3')] opacity-10"></div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: 'all', name: 'All Goals', icon: Target, gradient: 'from-indigo-500 to-purple-500' },
          { id: 'tasks', name: 'Tasks', icon: Brain, gradient: 'from-blue-500 to-cyan-500' },
          { id: 'health', name: 'Health', icon: Heart, gradient: 'from-rose-500 to-pink-500' },
          { id: 'finance', name: 'Finance', icon: Wallet, gradient: 'from-emerald-500 to-teal-500' }
        ].map(category => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center rounded-xl p-4 text-white transition-all bg-gradient-to-r ${category.gradient} ${
              selectedCategory === category.id ? 'ring-4 ring-indigo-200' : 'opacity-80 hover:opacity-100'
            }`}
          >
            <category.icon className="mr-3 h-6 w-6" />
            <span className="text-lg font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <Target className="mb-4 h-8 w-8 text-indigo-600" />
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Active Goals</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />
            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Completed Goals</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <Calendar className="mb-4 h-8 w-8 text-orange-600" />
            <p className="text-3xl font-bold text-gray-900">{stats.dueThisWeek}</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Due This Week</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative z-10">
            <TrendingUp className="mb-4 h-8 w-8 text-purple-600" />
            <p className="text-3xl font-bold text-gray-900">{stats.averageProgress}%</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Average Progress</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Goals List */}
        <div className="col-span-12 lg:col-span-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <GoalsList category={selectedCategory} timeframe="all" />
          </div>
        </div>

        {/* Goal Progress & Insights */}
        <div className="col-span-12 space-y-8 lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
          >
            <GoalProgress category={selectedCategory} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
          >
            <GoalInsights category={selectedCategory} />
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <GoalForm onClose={() => setIsAddingGoal(false)} />
        </div>
      )}

      {showGuestPrompt && (
        <GuestPrompt
          onClose={() => setShowGuestPrompt(false)}
          message="Sign up to create and track your goals!"
        />
      )}

      {showUpgradePrompt && (
        <UpgradePrompt
          onClose={() => setShowUpgradePrompt(false)}
          feature="Goals"
        />
      )}
    </div>
  );
}