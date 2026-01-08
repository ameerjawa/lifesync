import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Calendar, Clock, DollarSign } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessTaskForm } from './BusinessTaskForm';

export function BusinessTasks() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'todo' | 'in_progress' | 'review' | 'completed'>('all');
  
  const {
    tasks,
    projects,
    teamMembers,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = tasks.filter(task => 
    selectedStatus === 'all' || task.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Tasks</h2>
          <p className="text-gray-600">Manage tasks, track time, and handle billing</p>
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'todo', 'in_progress', 'review', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === status
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.billable && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Billable
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{task.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {task.due_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                  {task.estimated_hours && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Est: {task.estimated_hours}h
                    </div>
                  )}
                  {task.actual_hours > 0 && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Actual: {task.actual_hours}h
                    </div>
                  )}
                  {task.billable && task.hourly_rate && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${task.hourly_rate}/hr
                    </div>
                  )}
                </div>

                {task.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => updateTask(task.id, {
                    status: task.status === 'completed' ? 'todo' : 
                           task.status === 'todo' ? 'in_progress' :
                           task.status === 'in_progress' ? 'review' : 'completed'
                  })}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  {task.status === 'completed' ? 'Reopen' : 'Advance'}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStatus === 'all' 
                ? "Get started by creating your first task"
                : `No tasks with status "${selectedStatus.replace('_', ' ')}"`
              }
            </p>
            {selectedStatus === 'all' && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessTaskForm
            projects={projects}
            teamMembers={teamMembers}
            onSubmit={async (task) => {
              await addTask(task);
              setIsAddingTask(false);
            }}
            onClose={() => setIsAddingTask(false)}
          />
        </div>
      )}
    </div>
  );
}