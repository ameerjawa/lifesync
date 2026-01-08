import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useGuestStore, useSubscriptionStore, useTaskStore } from '../../store';
import type { Task, TaskFilter } from '../../lib/types';

interface TaskContextType {
  isLoading: boolean;
  isAddingTask: boolean;
  isAddingTemplate: boolean;
  isAddingRecurring: boolean;
  showFilters: boolean;
  expandedTask: string | null;
  showGuestPrompt: boolean;
  showUpgradePrompt: boolean;
  filterState: TaskFilter;
  setIsAddingTask: (value: boolean) => void;
  setIsAddingTemplate: (value: boolean) => void;
  setIsAddingRecurring: (value: boolean) => void;
  setShowFilters: (value: boolean) => void;
  setExpandedTask: (value: string | null) => void;
  setShowGuestPrompt: (value: boolean) => void;
  setShowUpgradePrompt: (value: boolean) => void;
  handleAddTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  handleFeatureAccess: (feature: string, action: () => void) => void;
  handleExpandTask: (taskId: string) => Promise<void>;
  handleUpdateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  handleFilterChange: (key: keyof TaskFilter, value: any) => void;
  handleClearFilters: () => void;
  handleDeleteTasks: (ids: string[]) => Promise<void>;
  handleDuplicateTasks: (ids: string[]) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [isAddingRecurring, setIsAddingRecurring] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const navigate = useNavigate();

  const { user, profile } = useAuthStore();
  const { isGuest, setReturnPath } = useGuestStore();
  const { plan, checkFeatureAccess } = useSubscriptionStore();

  // Filter state
  const [filterState, setFilterState] = useState<TaskFilter>({
    status: [],
    priority: [],
    labels: [],
    dueDate: {},
    assignees: [],
    search: ''
  });

  const {
    tasks,
    loadTasks,
    loadTemplates,
    loadRecurringTasks,
    loadTaskDetails,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    setFilters,
    clearFilters,
  } = useTaskStore();

  useEffect(() => {
    loadInitialData();
  }, [user, profile, isGuest]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // For guests, just load tasks without authentication
      if (isGuest) {
        // Initialize with some demo tasks for guests
        const demoTasks = [
          {
            id: 'demo-1',
            title: 'Welcome to LifeSync',
            description: 'This is a demo task to show you how the system works.',
            status: 'todo' as const,
            priority: 'medium' as const,
            due_date: new Date().toISOString(),
            labels: ['demo']
          },
          {
            id: 'demo-2',
            title: 'Try creating a task',
            description: 'Click the "Add Task" button to create your first task.',
            status: 'todo' as const,
            priority: 'high' as const,
            due_date: new Date().toISOString(),
            labels: ['demo']
          }
        ];
        useTaskStore.setState({ tasks: demoTasks, filteredTasks: demoTasks });
      } else if (user && profile) {
        await Promise.all([
          loadTasks(),
          loadTemplates(),
          loadRecurringTasks()
        ]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    if (plan === 'free' && tasks.length >= 3) {
      setShowUpgradePrompt(true);
      return;
    }

    try {
      await addTask(task);
      setIsAddingTask(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleFeatureAccess = (feature: string, action: () => void) => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    if (!checkFeatureAccess(feature)) {
      setShowUpgradePrompt(true);
      return;
    }

    action();
  };

  const handleExpandTask = async (taskId: string) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
      return;
    }

    setExpandedTask(taskId);
    if (!isGuest) {
      try {
        await loadTaskDetails(taskId);
      } catch (error) {
        console.error('Error loading task details:', error);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleFilterChange = (key: keyof TaskFilter, value: any) => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    setFilterState(prev => {
      const newState = { ...prev };
      if (Array.isArray(prev[key])) {
        const array = prev[key] as any[];
        if (array.includes(value)) {
          newState[key] = array.filter(v => v !== value);
        } else {
          newState[key] = [...array, value];
        }
      } else {
        newState[key] = value;
      }
      return newState;
    });
  };

  const handleClearFilters = () => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    clearFilters();
    setFilterState({
      status: [],
      priority: [],
      labels: [],
      dueDate: {},
      assignees: [],
      search: ''
    });
  };

  const handleDeleteTasks = async (ids: string[]) => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    try {
      await deleteTask(ids);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  const handleDuplicateTasks = async (ids: string[]) => {
    if (isGuest) {
      setReturnPath('/dashboard');
      setShowGuestPrompt(true);
      return;
    }

    try {
      await duplicateTask(ids);
    } catch (error) {
      console.error('Error duplicating tasks:', error);
    }
  };

  const value = {
    isLoading,
    isAddingTask,
    isAddingTemplate,
    isAddingRecurring,
    showFilters,
    expandedTask,
    showGuestPrompt,
    showUpgradePrompt,
    filterState,
    setIsAddingTask,
    setIsAddingTemplate,
    setIsAddingRecurring,
    setShowFilters,
    setExpandedTask,
    setShowGuestPrompt,
    setShowUpgradePrompt,
    handleAddTask,
    handleFeatureAccess,
    handleExpandTask,
    handleUpdateTaskStatus,
    handleFilterChange,
    handleClearFilters,
    handleDeleteTasks,
    handleDuplicateTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}