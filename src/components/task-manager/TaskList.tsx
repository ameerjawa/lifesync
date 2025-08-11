import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskComment, TaskAttachment } from '../../lib/types';

interface TaskListProps {
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

export function TaskList({
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
}: TaskListProps) {
  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
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
  );
}