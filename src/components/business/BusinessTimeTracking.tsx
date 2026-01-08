import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  Square,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart2
} from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';

interface TimeEntry {
  id: string;
  project_id: string;
  task_id?: string;
  description: string;
  start_time: string;
  end_time?: string;
  duration: number;
  billable: boolean;
  hourly_rate?: number;
}

export function BusinessTimeTracking() {
  const { projects, tasks } = useBusinessStore();
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntry>>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    if (!currentEntry.project_id) return;

    setIsTracking(true);
    setElapsedTime(0);
    setCurrentEntry({
      ...currentEntry,
      start_time: new Date().toISOString()
    });
  };

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const stopTracking = () => {
    if (!currentEntry.project_id) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      project_id: currentEntry.project_id!,
      task_id: currentEntry.task_id,
      description: currentEntry.description || '',
      start_time: currentEntry.start_time || new Date().toISOString(),
      end_time: new Date().toISOString(),
      duration: elapsedTime,
      billable: currentEntry.billable || false,
      hourly_rate: currentEntry.hourly_rate
    };

    setTimeEntries(prev => [newEntry, ...prev]);
    setIsTracking(false);
    setElapsedTime(0);
    setCurrentEntry({});
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
  const billableHours = timeEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + entry.duration, 0) / 3600;
  const totalRevenue = timeEntries
    .filter(entry => entry.billable && entry.hourly_rate)
    .reduce((sum, entry) => sum + (entry.duration / 3600) * (entry.hourly_rate || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="h-6 w-6 text-indigo-600 mr-3" />
          Time Tracking
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                value={currentEntry.project_id || ''}
                onChange={e => setCurrentEntry({ ...currentEntry, project_id: e.target.value })}
                disabled={isTracking}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task (Optional)
              </label>
              <select
                value={currentEntry.task_id || ''}
                onChange={e => setCurrentEntry({ ...currentEntry, task_id: e.target.value })}
                disabled={isTracking || !currentEntry.project_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">No specific task</option>
                {tasks
                  .filter(task => task.project_id === currentEntry.project_id)
                  .map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={currentEntry.description || ''}
              onChange={e => setCurrentEntry({ ...currentEntry, description: e.target.value })}
              disabled={isTracking}
              placeholder="What are you working on?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentEntry.billable || false}
                onChange={e => setCurrentEntry({ ...currentEntry, billable: e.target.checked })}
                disabled={isTracking}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Billable</span>
            </label>

            {currentEntry.billable && (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Rate:</label>
                <input
                  type="number"
                  value={currentEntry.hourly_rate || ''}
                  onChange={e => setCurrentEntry({ ...currentEntry, hourly_rate: parseFloat(e.target.value) })}
                  disabled={isTracking}
                  placeholder="$/hr"
                  className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-4xl font-mono font-bold text-gray-900">
              {formatTime(elapsedTime)}
            </div>

            <div className="flex items-center space-x-3">
              {!isTracking ? (
                <button
                  onClick={startTracking}
                  disabled={!currentEntry.project_id}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseTracking}
                    className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={stopTracking}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Hours</h3>
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalHours.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Hours tracked</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Billable Hours</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{billableHours.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalHours > 0 ? `${((billableHours / totalHours) * 100).toFixed(0)}%` : '0%'} of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue</h3>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">From billable hours</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Time Entries</h3>

        {timeEntries.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No time entries yet. Start tracking time to see your entries here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {timeEntries.map(entry => {
              const project = projects.find(p => p.id === entry.project_id);
              const task = entry.task_id ? tasks.find(t => t.id === entry.task_id) : null;
              const revenue = entry.billable && entry.hourly_rate
                ? (entry.duration / 3600) * entry.hourly_rate
                : 0;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.billable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.billable ? 'Billable' : 'Non-billable'}
                      </div>
                      <p className="font-medium text-gray-900">{project?.title || 'Unknown Project'}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.description || task?.title || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.start_time).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTime(entry.duration)}
                    </p>
                    {entry.billable && entry.hourly_rate && (
                      <p className="text-sm text-green-600 font-medium">
                        ${revenue.toFixed(2)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
