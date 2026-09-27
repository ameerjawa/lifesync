import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Check, Plus, X, Clock, Target, TrendingUp, ArrowRight,
  Sparkles, Calendar, AlertCircle, Flame, ListTodo,
} from 'lucide-react';
import { useTaskStore, useHealthStore } from '../../store';
import { useGoalStore } from '../../store/goalStore';
import { useAuthStore } from '../../store/authStore';
import { useGuestStore } from '../../store/guestStore';

interface Big3Item {
  id: string;
  title: string;
  completed: boolean;
}

export function TodayScreen() {
  const { tasks, loadTasks, updateTask } = useTaskStore();
  const { goals, loadGoals } = useGoalStore();
  const { metrics, loadMetrics } = useHealthStore();
  const { profile } = useAuthStore();
  const { isGuest } = useGuestStore();

  const [big3, setBig3] = useState<Big3Item[]>([]);
  const [showAddBig3, setShowAddBig3] = useState(false);
  const [newBig3Title, setNewBig3Title] = useState('');
  const [nextMoveExpanded, setNextMoveExpanded] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isGuest) {
      loadTasks();
      loadGoals();
      loadMetrics();
    }
  }, [isGuest, loadTasks, loadGoals, loadMetrics]);

  // Load Big 3 from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`next-big3-${todayStr}`);
    if (saved) {
      setBig3(JSON.parse(saved));
    }
  }, [todayStr]);

  const saveBig3 = (items: Big3Item[]) => {
    setBig3(items);
    localStorage.setItem(`next-big3-${todayStr}`, JSON.stringify(items));
  };

  const addBig3 = () => {
    if (!newBig3Title.trim()) return;
    saveBig3([...big3, { id: crypto.randomUUID(), title: newBig3Title.trim(), completed: false }]);
    setNewBig3Title('');
    setShowAddBig3(false);
  };

  const toggleBig3 = (id: string) => {
    saveBig3(big3.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const removeBig3 = (id: string) => {
    saveBig3(big3.filter(item => item.id !== id));
  };

  // Demo data for guest users
  const demoBig3: Big3Item[] = useMemo(() => [
    { id: '1', title: 'Finish portfolio site copy', completed: true },
    { id: '2', title: 'TypeScript interview prep (60 min)', completed: false },
    { id: '3', title: '30-min evening run', completed: false },
  ], []);

  const displayBig3 = isGuest ? demoBig3 : big3;
  const big3Done = displayBig3.filter(b => b.completed).length;

  // Today's tasks from store
  const todayTasks = useMemo(() => {
    if (isGuest) {
      return [
        { id: 'd1', title: 'Review TypeScript generics chapter', status: 'todo', priority: 'high', due_date: todayStr },
        { id: 'd2', title: 'Send follow-up email to recruiter', status: 'completed', priority: 'high', due_date: todayStr },
        { id: 'd3', title: 'Update budget spreadsheet', status: 'todo', priority: 'medium', due_date: todayStr },
        { id: 'd4', title: 'Read 20 pages — Atomic Habits', status: 'todo', priority: 'low', due_date: todayStr },
      ] as any[];
    }
    return tasks.filter(t => {
      const dueDate = t.due_date ? new Date(t.due_date).toISOString().split('T')[0] : null;
      return dueDate === todayStr;
    });
  }, [tasks, todayStr, isGuest]);

  const completedToday = todayTasks.filter((t: any) => t.status === 'completed').length;

  // Active goals
  const activeGoals = isGuest ? [
    { id: 'g1', title: 'Become a software engineer', category: 'career', progress: 65, target_date: '2026-12-01' },
    { id: 'g2', title: 'Save $20,000 emergency fund', category: 'money', progress: 42, target_date: '2026-06-30' },
    { id: 'g3', title: 'Run a 10K', category: 'fitness', progress: 55, target_date: '2026-03-15' },
  ] as any[] : goals.filter((g: any) => g.status === 'active').slice(0, 3);

  // NEXT Move recommendation (demo/logic-based)
  const nextMove = useMemo(() => {
    if (isGuest || todayTasks.length === 0) {
      return {
        title: 'Complete your TypeScript interview preparation',
        reasoning: 'Interview tomorrow. Career is your #1 priority. You have 75 minutes available before work.',
        estimatedMinutes: 60,
        why: [
          'Interview scheduled for tomorrow at 10 AM',
          'Career goal is currently your #1 priority',
          'This task is time-sensitive and high-impact',
          'Estimated duration fits your available time block',
        ],
      };
    }

    const highPriority = todayTasks.find((t: any) => t.priority === 'high' && t.status !== 'completed');
    if (highPriority) {
      return {
        title: highPriority.title,
        reasoning: 'This is your highest-priority task due today.',
        estimatedMinutes: (highPriority as any).estimated_hours ? Math.round((highPriority as any).estimated_hours * 60) : 45,
        why: ['Highest priority task', 'Due today', 'Completing it early frees up your day'],
      };
    }

    const incomplete = todayTasks.find((t: any) => t.status !== 'completed');
    if (incomplete) {
      return {
        title: incomplete.title,
        reasoning: 'This task is due today and hasn\'t been started yet.',
        estimatedMinutes: 30,
        why: ['Due today', 'Not yet started'],
      };
    }

    return {
      title: 'Plan tomorrow',
      reasoning: 'You\'ve completed everything for today. Take 5 minutes to set up tomorrow.',
      estimatedMinutes: 5,
      why: ['All tasks completed', 'Planning ahead improves execution'],
    };
  }, [todayTasks, isGuest]);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-heading">
          {greeting}, {profile?.full_name?.split(' ')[0] || 'Alex'}.
        </h2>
        <p className="text-body mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* NEXT Move */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/30 dark:to-accent-950/20 border border-primary-200 dark:border-primary-900/50 p-5"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">
          <Zap className="h-3.5 w-3.5" />
          Your NEXT Move
        </div>
        <p className="mt-2 text-lg font-bold text-heading">{nextMove.title}</p>
        <p className="mt-1.5 text-sm text-body">{nextMove.reasoning}</p>

        <AnimatePresence>
          {nextMoveExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-900/50">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Why this?</p>
                <ul className="space-y-1.5">
                  {nextMove.why.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-body">
                      <Check className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex gap-2">
          {!isGuest && (
            <button
              onClick={() => {
                const task = todayTasks.find((t: any) => t.title === nextMove.title);
                if (task) updateTask(task.id, { status: 'in_progress' });
              }}
              className="btn-primary text-sm"
            >
              Start now
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setNextMoveExpanded(!nextMoveExpanded)} className="btn-ghost text-sm">
            {nextMoveExpanded ? 'Hide why' : 'Why this?'}
          </button>
        </div>
      </motion.div>

      {/* Big 3 + Progress */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Big 3 */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-heading">Today's Big 3</h3>
            <span className="text-xs text-muted">{big3Done} of {displayBig3.length} done</span>
          </div>

          <div className="space-y-2">
            {displayBig3.length === 0 && !showAddBig3 && (
              <div className="text-center py-8">
                <Target className="h-8 w-8 text-muted mx-auto mb-2" />
                <p className="text-sm text-body">Choose your 3 most important actions for today.</p>
                {!isGuest && (
                  <button onClick={() => setShowAddBig3(true)} className="btn-primary mt-3 text-sm">
                    <Plus className="h-4 w-4" /> Set your Big 3
                  </button>
                )}
              </div>
            )}

            {displayBig3.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50 group">
                <button
                  onClick={() => !isGuest && toggleBig3(item.id)}
                  className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    item.completed ? 'bg-success-500' : 'border-2 border-ink-300 dark:border-ink-600 hover:border-primary-400'
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3 text-white" />}
                </button>
                <span className={`text-sm flex-1 ${item.completed ? 'text-muted line-through' : 'text-heading font-medium'}`}>
                  {item.title}
                </span>
                {!isGuest && (
                  <button onClick={() => removeBig3(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4 text-muted hover:text-error-500" />
                  </button>
                )}
              </div>
            ))}

            {showAddBig3 && (
              <div className="flex gap-2 py-2">
                <input
                  autoFocus
                  value={newBig3Title}
                  onChange={e => setNewBig3Title(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addBig3()}
                  placeholder="What's your next big action?"
                  className="input-field flex-1"
                />
                <button onClick={addBig3} className="btn-primary text-sm">Add</button>
                <button onClick={() => setShowAddBig3(false)} className="btn-ghost text-sm">Cancel</button>
              </div>
            )}

            {displayBig3.length > 0 && displayBig3.length < 3 && !showAddBig3 && !isGuest && (
              <button onClick={() => setShowAddBig3(true)} className="flex items-center gap-2 py-2 px-3 text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">
                <Plus className="h-4 w-4" /> Add Big 3 item
              </button>
            )}
          </div>
        </div>

        {/* Progress today */}
        <div className="card p-5">
          <h3 className="font-semibold text-heading mb-4">Progress Today</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-body">Big 3</span>
                <span className="text-muted">{big3Done}/{displayBig3.length || 3}</span>
              </div>
              <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${displayBig3.length ? (big3Done / displayBig3.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-body">Tasks</span>
                <span className="text-muted">{completedToday}/{todayTasks.length}</span>
              </div>
              <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                <div className="h-full bg-success-500 rounded-full transition-all duration-300"
                  style={{ width: `${todayTasks.length ? (completedToday / todayTasks.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="pt-3 border-t border-default">
              <div className="flex items-center gap-2 text-sm text-body">
                <Flame className="h-4 w-4 text-warning-500" />
                <span>3-day execution streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks + Active Goals */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Tasks */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-heading flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-muted" />
              Today's Tasks
            </h3>
            <span className="text-xs text-muted">{todayTasks.length} total</span>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted mx-auto mb-2" />
              <p className="text-sm text-body">No tasks due today. Enjoy the breathing room.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {todayTasks.map((task: any) => (
                <div key={task.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50 group">
                  <button
                    onClick={() => !isGuest && updateTask(task.id, {
                      status: task.status === 'completed' ? 'todo' : 'completed'
                    })}
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      task.status === 'completed'
                        ? 'bg-success-500 border-success-500'
                        : 'border-ink-300 dark:border-ink-600 hover:border-primary-400'
                    }`}
                  >
                    {task.status === 'completed' && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${task.status === 'completed' ? 'text-muted line-through' : 'text-heading font-medium'}`}>
                      {task.title}
                    </p>
                  </div>
                  <span className={`badge text-[10px] ${
                    task.priority === 'high' ? 'badge-error' :
                    task.priority === 'medium' ? 'badge-warning' :
                    'badge-neutral'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div className="card p-5">
          <h3 className="font-semibold text-heading mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted" />
            Active Goals
          </h3>
          {activeGoals.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-8 w-8 text-muted mx-auto mb-2" />
              <p className="text-sm text-body">No active goals yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal: any) => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-heading font-medium truncate">{goal.title}</span>
                    <span className="text-muted shrink-0 ml-2">{goal.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${goal.progress || 0}%` }} />
                  </div>
                  <p className="text-xs text-muted mt-1 capitalize">{goal.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
