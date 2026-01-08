import React from 'react';
import { useTaskStore } from '../../../store';

export function ScheduleView() {
  const { tasks } = useTaskStore();

  const upcomingTasks = tasks
    .filter(task => new Date(task.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Upcoming Tasks</h4>
      {upcomingTasks.map(task => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <p className="font-medium text-gray-900">{task.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(task.due_date).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  );
}