import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock4, 
  CheckCircle, 
  AlertCircle, 
  ChevronUp, 
  ChevronDown,
  FileText,
  Link,
  Users
} from 'lucide-react';
import type { Task, TaskComment, TaskAttachment } from '../../lib/types';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  isSelected: boolean;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  onExpand: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onAddComment: (taskId: string, content: string) => void;
  onAddAttachment: (taskId: string, file: File) => void;
}

export function TaskCard({
  task,
  isExpanded,
  isSelected,
  comments,
  attachments,
  onExpand,
  onSelect,
  onUpdateStatus,
  onAddComment,
  onAddAttachment
}: TaskCardProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <div className="ml-4 flex items-start space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(task.id)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <button
            onClick={() => onExpand(task.id)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
          {task.estimated_hours && (
            <div className="flex items-center">
              <Clock4 className="mr-1.5 h-4 w-4" />
              {task.estimated_hours}h
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {task.status !== 'completed' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'completed')}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-green-600"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          )}
          {task.status === 'todo' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'in_progress')}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
            >
              <AlertCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="border-t pt-4">
              {/* Comments Section */}
              <div className="mb-4">
                <h5 className="mb-2 font-medium text-gray-900">Comments</h5>
                <div className="space-y-3">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-gray-50 p-3">
                      <p className="text-sm text-gray-600">{comment.content}</p>
                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const content = e.currentTarget.value.trim();
                        if (content) {
                          onAddComment(task.id, content);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Attachments Section */}
              <div className="mb-4">
                <h5 className="mb-2 font-medium text-gray-900">Attachments</h5>
                <div className="space-y-2">
                  {attachments?.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{attachment.name}</span>
                      </div>
                      <button className="text-primary-600 hover:text-primary-500">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="block">
                    <span className="sr-only">Add attachment</span>
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onAddAttachment(task.id, file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-2">
                {task.dependencies?.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Link className="mr-2 h-4 w-4" />
                    <span>Dependencies: {task.dependencies.join(', ')}</span>
                  </div>
                )}
                {task.assignees?.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Assignees: {task.assignees.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}