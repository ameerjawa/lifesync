import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'project' | 'meeting';
  status: string;
  priority?: string;
}

export function BusinessCalendar() {
  const { tasks, projects, isLoading } = useBusinessStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'task' | 'project'>('all');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const dateStr = date.toISOString().split('T')[0];

    tasks.forEach(task => {
      if (task.due_date && task.due_date.startsWith(dateStr)) {
        events.push({
          id: task.id,
          title: task.title,
          date: new Date(task.due_date),
          type: 'task',
          status: task.status,
          priority: task.priority
        });
      }
    });

    projects.forEach(project => {
      if (project.due_date && project.due_date === dateStr) {
        events.push({
          id: project.id,
          title: project.name,
          date: new Date(project.due_date),
          type: 'project',
          status: project.status
        });
      }
    });

    return filterType === 'all' ? events : events.filter(e => e.type === filterType);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('task')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'task'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setFilterType('project')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'project'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Projects
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const events = day ? getEventsForDate(day) : [];
            const hasEvents = events.length > 0;

            return (
              <motion.button
                key={index}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={`
                  aspect-square p-2 rounded-lg text-sm transition-all
                  ${!day ? 'invisible' : ''}
                  ${isToday(day) ? 'bg-indigo-100 font-semibold' : ''}
                  ${isSelected(day) ? 'ring-2 ring-indigo-600 bg-indigo-50' : ''}
                  ${!isToday(day) && !isSelected(day) ? 'hover:bg-gray-100' : ''}
                `}
                whileHover={day ? { scale: 1.05 } : {}}
                whileTap={day ? { scale: 0.95 } : {}}
              >
                {day && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <span className="text-gray-900">{day.getDate()}</span>
                    {hasEvents && (
                      <div className="flex space-x-1 mt-1">
                        {events.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              event.type === 'task'
                                ? 'bg-green-500'
                                : 'bg-purple-500'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events for {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>

          {selectedEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No events scheduled for this day</p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map(event => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    event.type === 'task'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {event.type === 'task' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Target className="h-5 w-5 text-purple-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {event.type} • {event.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  {event.priority && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : event.priority === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : event.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {event.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming This Week</h3>
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">
            {tasks.filter(task => {
              if (!task.due_date) return false;
              const dueDate = new Date(task.due_date);
              const today = new Date();
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return dueDate >= today && dueDate <= weekFromNow;
            }).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Tasks due this week</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Overdue</h3>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {tasks.filter(task => {
              if (!task.due_date || task.status === 'completed') return false;
              return new Date(task.due_date) < new Date();
            }).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Tasks past due date</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {tasks.filter(task => task.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Tasks completed</p>
        </div>
      </div>
    </div>
  );
}
