import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isYesterday, addDays, startOfWeek } from 'date-fns';
import type { Task } from '../../lib/types';

interface TaskTimelineProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function TaskTimeline({ tasks, onTaskClick }: TaskTimelineProps) {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i));

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
  };

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
    <div className="space-y-8">
      {days.map((day, index) => {
        const dayTasks = getTasksForDay(day);
        if (dayTasks.length === 0) return null;

        return (
          <motion.div
            key={day.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="sticky top-0 z-10 bg-white py-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDate(day)}
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              {dayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  onClick={() => onTaskClick(task.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    <span className={`ml-4 rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    {task.estimated_hours && (
                      <span>{task.estimated_hours}h estimated</span>
                    )}
                    {task.labels?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {task.labels.map((label) => (
                          <span
                            key={label}
                            className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}