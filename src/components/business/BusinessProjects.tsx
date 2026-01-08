import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Calendar, Users, DollarSign, Trash2, Edit2 } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessProjectForm } from './BusinessProjectForm';

export function BusinessProjects() {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'planning' | 'active' | 'completed'>('all');

  // Zustand store subscriptions
  const projects = useBusinessStore(state => state.projects);
  const clients = useBusinessStore(state => state.clients);
  const isLoading = useBusinessStore(state => state.isLoading);
  const addProject = useBusinessStore(state => state.addProject);
  const updateProject = useBusinessStore(state => state.updateProject);
  const deleteProject = useBusinessStore(state => state.deleteProject);

  const filteredProjects = projects.filter(project =>
    selectedStatus === 'all' || project.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your business projects and track progress</p>
        </div>
        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'planning', 'active', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === status
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-2 text-sm text-gray-600">
              {project.due_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(project.due_date).toLocaleDateString()}
                </div>
              )}
              {project.budget && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Budget: ${project.budget.toLocaleString()}
                </div>
              )}
              {project.team_members?.length > 0 && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team: {project.team_members.length} members
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setEditingProject(project)}
                className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-xs"
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-xs"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStatus === 'all'
                ? 'Get started by creating your first project'
                : `No projects with status "${selectedStatus}"`}
            </p>
            {selectedStatus === 'all' && (
              <button
                onClick={() => setIsAddingProject(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {(isAddingProject || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessProjectForm
            clients={clients}
            project={editingProject || undefined}
            onSubmit={async projectData => {
              if (editingProject) {
                await updateProject(editingProject.id, projectData);
                setEditingProject(null);
              } else {
                await addProject(projectData);
              }
              setIsAddingProject(false);
            }}
            onClose={() => {
              setIsAddingProject(false);
              setEditingProject(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
