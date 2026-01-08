import React from 'react';
import { useGuestStore, useTaskStore } from '../../store';
import { TaskProvider, useTaskContext } from './TaskProvider';
import { TaskHeader } from './TaskHeader';
import { TaskContent } from './TaskContent';
import { TaskModals } from './TaskModals';
import { TaskAI } from './TaskAI';

function TaskManagerContent() {
  const {
    viewMode,
    groupBy,
    sortBy,
    sortDirection,
    filterState,
    showFilters,
    setShowFilters,
    handleFeatureAccess,
    setIsAddingTask,
    setIsAddingTemplate,
    setIsAddingRecurring
  } = useTaskContext();

  return (
    <div className="space-y-6">
      <TaskHeader
        viewMode={viewMode}
        groupBy={groupBy}
        sortBy={sortBy}
        sortDirection={sortDirection}
        showFilters={showFilters}
        filterState={filterState}
        onViewModeChange={(mode) => handleFeatureAccess('custom_dashboards', () => useTaskStore.getState().setViewMode(mode))}
        onGroupByChange={(value) => handleFeatureAccess('custom_dashboards', () => useTaskStore.getState().setGroupBy(value))}
        onSortByChange={useTaskStore.getState().setSortBy}
        onSortDirectionToggle={useTaskStore.getState().toggleSortDirection}
        onToggleFilters={() => handleFeatureAccess('advanced_analytics', () => setShowFilters(!showFilters))}
        onAddTask={() => setIsAddingTask(true)}
        onAddTemplate={() => handleFeatureAccess('unlimited_tasks', () => setIsAddingTemplate(true))}
        onAddRecurring={() => handleFeatureAccess('unlimited_tasks', () => setIsAddingRecurring(true))}
      />
      
      <TaskContent />
      <TaskModals />
      <TaskAI />
    </div>
  );
}

export function TaskManager() {
  const { isGuest } = useGuestStore();

  return (
    <TaskProvider>
      <TaskManagerContent />
    </TaskProvider>
  );
}