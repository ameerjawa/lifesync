import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  X
} from 'lucide-react';
import { useProjectStore } from '../../store';

export function ProjectDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { projects, isLoading, loadProjects, addProject } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const projectMetrics = {
    onTrack: projects.filter(p => p.health_status === 'on_track').length,
    atRisk: projects.filter(p => p.health_status === 'at_risk').length,
    delayed: projects.filter(p => p.health_status === 'delayed').length,
    completed: projects.filter(p => p.status === 'completed').length,
    teamUtilization: 85,
    upcomingDeadlines: projects.filter(p => {
      if (!p.target_date) return false;
      const daysUntil = Math.floor((new Date(p.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 7;
    }).length
  };

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addProject({
        title: formData.get('title') as string,
        description: formData.get('description') as string || '',
        status: formData.get('status') as any || 'planning',
        priority: formData.get('priority') as any || 'medium',
        start_date: formData.get('start_date') as string || new Date().toISOString(),
        target_date: formData.get('target_date') as string || new Date().toISOString(),
        actual_cost: 0,
        completion_percentage: 0,
        health_status: 'on_track',
        risk_level: 'low',
        tags: []
      });
      setShowProjectForm(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to add project:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={() => setShowProjectForm(true)}
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
          Active Projects
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {projects.slice(0, 5).map((project) => {
                const statusStyles = project.health_status === 'on_track' ? {
                  bgClass: 'bg-green-100',
                  textClass: 'text-green-600',
                  barClass: 'bg-green-500',
                  Icon: CheckCircle
                } : project.health_status === 'at_risk' ? {
                  bgClass: 'bg-orange-100',
                  textClass: 'text-orange-600',
                  barClass: 'bg-orange-500',
                  Icon: AlertTriangle
                } : {
                  bgClass: 'bg-red-100',
                  textClass: 'text-red-600',
                  barClass: 'bg-red-500',
                  Icon: Clock
                };

                return (
                  <div key={project.id} className="relative pl-10">
                    <div className={`absolute left-0 top-1.5 h-8 w-8 rounded-full ${statusStyles.bgClass} flex items-center justify-center`}>
                      <statusStyles.Icon className={`h-5 w-5 ${statusStyles.textClass}`} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
                    <div className="mt-2 flex items-center">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full ${statusStyles.barClass}`}
                          style={{ width: `${project.completion_percentage}%` }}
                        ></div>
                      </div>
                      <span className={`ml-2 text-sm font-medium ${statusStyles.textClass}`}>
                        {project.completion_percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">New Project</h3>
              <button
                onClick={() => setShowProjectForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
                    Target Date
                  </label>
                  <input
                    type="date"
                    id="target_date"
                    name="target_date"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}