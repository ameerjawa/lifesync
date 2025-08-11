import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskComment, TaskAttachment } from '../../lib/types';

interface TaskBoardProps {
  tasks: Task[];
  expandedTask: string | null;
  selectedTasks: string[];
  comments: Record<string, TaskComment[]>;
  attachments: Record<string, TaskAttachment[]>;
  onExpand: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onAddComment: (taskId: string, content: string) => void;
  onAddAttachment: (taskId: string, file: File) => void;
}

export function TaskBoard({
  tasks,
  expandedTask,
  selectedTasks,
  comments,
  attachments,
  onExpand,
  onSelect,
  onUpdateStatus,
  onAddComment,
  onAddAttachment,
}: TaskBoardProps) {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'todo':
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {['todo', 'in_progress', 'completed'].map((status) => (
        <div key={status} className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <span className={`mr-2 h-2.5 w-2.5 rounded-full ${getStatusColor(status as Task['status'])}`} />
            {status.replace('_', ' ')}
          </h3>
          <div className="space-y-4">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isExpanded={expandedTask === task.id}
                  isSelected={selectedTasks.includes(task.id)}
                  comments={comments[task.id] || []}
                  attachments={attachments[task.id] || []}
                  onExpand={onExpand}
                  onSelect={onSelect}
                  onUpdateStatus={onUpdateStatus}
                  onAddComment={onAddComment}
                  onAddAttachment={onAddAttachment}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}