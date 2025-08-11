import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TaskBoard } from './TaskBoard';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { TaskTimeline } from './TaskTimeline';
import { BulkActions } from './BulkActions';
import { useTaskStore } from '../../store/taskStore';
import { useTaskContext } from './TaskProvider';

export function TaskContent() {
  const {
    viewMode,
    filteredTasks,
    comments,
    attachments,
    selectedTasks,
    toggleTaskSelection,
    clearSelectedTasks,
    addComment,
    addAttachment
  } = useTaskStore();

  const {
    showFilters,
    expandedTask,
    filterState,
    handleExpandTask,
    handleUpdateTaskStatus,
    handleFilterChange,
    handleClearFilters,
    handleDeleteTasks,
    handleDuplicateTasks,
    handleFeatureAccess
  } = useTaskContext();

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showFilters && (
          <TaskFilters
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onApplyFilters={() => {
              useTaskStore.getState().setFilters(filterState);
              useTaskStore.getState().applyFilters();
            }}
            onClearFilters={handleClearFilters}
          />
        )}
      </AnimatePresence>

      <BulkActions
        selectedTasks={selectedTasks}
        onDelete={handleDeleteTasks}
        onDuplicate={handleDuplicateTasks}
        onClear={clearSelectedTasks}
      />

      <div className="grid gap-6">
        {viewMode === 'board' && (
          <TaskBoard
            tasks={filteredTasks}
            expandedTask={expandedTask}
            selectedTasks={selectedTasks}
            comments={comments}
            attachments={attachments}
            onExpand={handleExpandTask}
            onSelect={toggleTaskSelection}
            onUpdateStatus={handleUpdateTaskStatus}
            onAddComment={(taskId, content) => handleFeatureAccess('unlimited_tasks', () => addComment(taskId, content))}
            onAddAttachment={(taskId, file) => handleFeatureAccess('unlimited_tasks', () => addAttachment(taskId, file))}
          />
        )}

        {viewMode === 'list' && (
          <TaskList
            tasks={filteredTasks}
            expandedTask={expandedTask}
            selectedTasks={selectedTasks}
            comments={comments}
            attachments={attachments}
            onExpand={handleExpandTask}
            onSelect={toggleTaskSelection}
            onUpdateStatus={handleUpdateTaskStatus}
            onAddComment={(taskId, content) => handleFeatureAccess('unlimited_tasks', () => addComment(taskId, content))}
            onAddAttachment={(taskId, file) => handleFeatureAccess('unlimited_tasks', () => addAttachment(taskId, file))}
          />
        )}

        {viewMode === 'timeline' && (
          <TaskTimeline
            tasks={filteredTasks}
            onTaskClick={handleExpandTask}
          />
        )}
      </div>
    </div>
  );
}