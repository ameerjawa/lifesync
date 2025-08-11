import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  Clock,
  AlertTriangle,
  BarChart2,
  Brain,
  Calendar,
  Plus,
  Filter,
  Search,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export function ProjectDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  // Mock data - replace with actual data from store
  const projectMetrics = {
    onTrack: 8,
    atRisk: 3,
    delayed: 2,
    completed: 15,
    teamUtilization: 85,
    upcomingDeadlines: 5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Project Management</h2>
              <p className="mt-2 text-indigo-100">AI-powered project insights and optimization</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center rounded-lg bg-white/20 px-4 py-2 text-white hover:bg-white/30"
              >
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </button>
              <button
                className="flex items-center rounded-lg bg-white px-4 py-2 text-indigo-600 shadow-md transition-all hover:bg-indigo-50"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Project
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3')] opacity-10"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Projects On Track</p>
              <p className="mt-2 text-3xl font-semibold text-green-600">{projectMetrics.onTrack}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Utilization</p>
              <p className="mt-2 text-3xl font-semibold text-indigo-600">{projectMetrics.teamUtilization}%</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">At Risk</p>
              <p className="mt-2 text-3xl font-semibold text-orange-600">{projectMetrics.atRisk}</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
              <p className="mt-2 text-3xl font-semibold text-purple-600">{projectMetrics.upcomingDeadlines}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Brain className="mr-2 h-6 w-6 text-indigo-600" />
            AI Recommendations
          </h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-indigo-50 p-4">
              <h4 className="font-medium text-indigo-900">Resource Optimization</h4>
              <p className="mt-1 text-sm text-indigo-700">
                Consider reallocating 2 developers from Project A to Project B to meet the upcoming deadline.
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <h4 className="font-medium text-green-900">Risk Mitigation</h4>
              <p className="mt-1 text-sm text-green-700">
                Schedule a review meeting for the high-risk components identified in Project C.
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <h4 className="font-medium text-purple-900">Timeline Optimization</h4>
              <p className="mt-1 text-sm text-purple-700">
                Based on current velocity, consider adjusting sprint capacity by 15%.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <TrendingUp className="mr-2 h-6 w-6 text-indigo-600" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sprint Velocity</span>
              <div className="flex items-center">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[85%] bg-green-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Code Quality</span>
              <div className="flex items-center">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[92%] bg-indigo-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-indigo-600">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Satisfaction</span>
              <div className="flex items-center">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[88%] bg-purple-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-purple-600">88%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg bg-white p-6 shadow-lg"
      >
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <Clock className="mr-2 h-6 w-6 text-indigo-600" />
          Project Timeline
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Project A Launch</h4>
              <p className="text-sm text-gray-500">Due in 2 days</p>
              <div className="mt-2 flex items-center">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[95%] bg-green-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">95%</span>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Project B Development</h4>
              <p className="text-sm text-gray-500">At risk - Resource constraints</p>
              <div className="mt-2 flex items-center">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[60%] bg-orange-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-orange-600">60%</span>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Project C Planning</h4>
              <p className="text-sm text-gray-500">Starting next week</p>
              <div className="mt-2 flex items-center">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[15%] bg-indigo-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-indigo-600">15%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}