import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Minimize2,
  Bot,
  Brain,
  Calendar,
  BarChart2
} from 'lucide-react';
import { useTaskStore, useSubscriptionStore } from '../../store';
import { analyzeTaskPerformance, generateTaskSchedule } from '../../lib/ai';
import type { Task } from '../../lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: 'add' | 'edit' | 'delete' | 'analyze' | 'schedule';
    task?: Task;
    taskId?: string;
    data?: any;
  };
}

export function TaskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m your AI task assistant. I can help you:\n• Create and manage tasks\n• Analyze your task performance\n• Generate optimized schedules\n• Provide productivity insights'
  }]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'analysis' | 'schedule'>('chat');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { 
    tasks,
    addTask,
    updateTask,
    deleteTask,
    loadTasks
  } = useTaskStore();

  const { checkFeatureAccess } = useSubscriptionStore();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load data when switching tabs
  useEffect(() => {
    const loadTabData = async () => {
      if (!checkFeatureAccess('ai_insights')) {
        return;
      }

      setIsProcessing(true);
      try {
        if (activeView === 'analysis' && !analysisData) {
          const analysis = await analyzeTaskPerformance(tasks);
          setAnalysisData(analysis);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Here's your task analysis:\n\n${analysis.insights.join('\n')}\n\nRecommendations:\n${analysis.recommendations.join('\n')}`,
            action: {
              type: 'analyze',
              data: analysis
            }
          }]);
        } else if (activeView === 'schedule' && !scheduleData) {
          const schedule = await generateTaskSchedule(tasks);
          setScheduleData(schedule);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I've generated an optimized schedule for your tasks. Would you like me to apply these changes?",
            action: {
              type: 'schedule',
              data: schedule
            }
          }]);
        }
      } catch (error) {
        console.error(`Error loading ${activeView} data:`, error);
      } finally {
        setIsProcessing(false);
      }
    };

    loadTabData();
  }, [activeView, tasks, checkFeatureAccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      if (!checkFeatureAccess('ai_insights')) {
        throw new Error('AI assistant is only available with a premium subscription');
      }

      const lowerMessage = userMessage.toLowerCase();
      
      // Task Analysis
      if (lowerMessage.includes('analyze') || lowerMessage.includes('performance') || lowerMessage.includes('insights')) {
        const analysis = await analyzeTaskPerformance(tasks);
        setAnalysisData(analysis);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Here's your task analysis:\n\n${analysis.insights.join('\n')}\n\nRecommendations:\n${analysis.recommendations.join('\n')}`,
          action: {
            type: 'analyze',
            data: analysis
          }
        }]);
        setActiveView('analysis');
        return;
      }

      // Schedule Generation
      if (lowerMessage.includes('schedule') || lowerMessage.includes('plan') || lowerMessage.includes('organize')) {
        const schedule = await generateTaskSchedule(tasks);
        setScheduleData(schedule);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I've generated an optimized schedule for your tasks. Would you like me to apply these changes?",
          action: {
            type: 'schedule',
            data: schedule
          }
        }]);
        setActiveView('schedule');
        return;
      }

      // Task Creation
      if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new task')) {
        const title = userMessage.replace(/create|add|new task/gi, '').trim();
        const newTask = {
          title,
          description: '',
          status: 'todo' as const,
          priority: 'medium' as const,
          due_date: new Date().toISOString(),
          labels: ['AI Created']
        };

        await addTask(newTask);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've created a new task: "${title}". Would you like to add more details to this task?`,
          action: { type: 'add', task: newTask }
        }]);
      }
      // Task Status Update
      else if (lowerMessage.includes('complete') || lowerMessage.includes('mark') || lowerMessage.includes('done')) {
        const taskTitle = userMessage.replace(/complete|mark|done|as/gi, '').trim();
        const task = tasks.find(t => t.title.toLowerCase().includes(taskTitle.toLowerCase()));
        
        if (task) {
          await updateTask(task.id, { status: 'completed' });
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I've marked "${task.title}" as complete. Great job! Is there anything else you'd like to do?`,
            action: { type: 'edit', taskId: task.id }
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I couldn't find a task matching "${taskTitle}". Can you try again with a different task name?`
          }]);
        }
      }
      // Task Deletion
      else if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
        const taskTitle = userMessage.replace(/delete|remove/gi, '').trim();
        const task = tasks.find(t => t.title.toLowerCase().includes(taskTitle.toLowerCase()));
        
        if (task) {
          await deleteTask([task.id]);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I've deleted the task "${task.title}". Is there anything else you need help with?`,
            action: { type: 'delete', taskId: task.id }
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I couldn't find a task matching "${taskTitle}". Can you try again with a different task name?`
          }]);
        }
      }
      // Help message
      else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I can help you manage your tasks. Try saying:
• "Create a task to [task description]"
• "Analyze my task performance"
• "Generate an optimized schedule"
• "Mark [task name] as complete"
• "Delete [task name]"

What would you like to do?`
        }]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderAnalysisContent = () => {
    if (!analysisData) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-primary-900">Completion Rate</p>
            <p className="text-2xl font-bold text-primary-600">
              {Math.round(analysisData.completion_rate)}%
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-900">Overdue Tasks</p>
            <p className="text-2xl font-bold text-red-600">
              {analysisData.overdue_tasks}
            </p>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium mb-2">Priority Distribution</h5>
          <div className="space-y-2">
            {Object.entries(analysisData.priority_distribution).map(([priority, count]) => (
              <div key={priority} className="flex items-center">
                <span className="w-20 capitalize">{priority}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      priority === 'high' ? 'bg-red-500' :
                      priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(count as number / tasks.length) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-2">Insights</h5>
          <ul className="space-y-2">
            {analysisData.insights.map((insight: string, index: number) => (
              <li key={index} className="flex items-start">
                <Brain className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-medium mb-2">Recommendations</h5>
          <ul className="space-y-2">
            {analysisData.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderScheduleContent = () => {
    if (!scheduleData) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {scheduleData.map((task: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{task.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(task.suggested_start_time).toLocaleString()}
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
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 rounded-lg bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Task Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`p-2 rounded-lg ${activeView === 'chat' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveView('analysis')}
                  className={`p-2 rounded-lg ${activeView === 'analysis' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveView('schedule')}
                  className={`p-2 rounded-lg ${activeView === 'schedule' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Calendar className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-96 overflow-y-auto p-4">
              {activeView === 'chat' && (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        {message.action && (
                          <div className="mt-2 flex items-center text-xs">
                            {message.action.type === 'add' && <Plus className="mr-1 h-3 w-3" />}
                            {message.action.type === 'edit' && <Edit3 className="mr-1 h-3 w-3" />}
                            {message.action.type === 'delete' && <Trash2 className="mr-1 h-3 w-3" />}
                            <span>
                              {message.action.type === 'add' && 'Task added'}
                              {message.action.type === 'edit' && 'Task updated'}
                              {message.action.type === 'delete' && 'Task deleted'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-gray-100 px-4 py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {activeView === 'analysis' && renderAnalysisContent()}
              {activeView === 'schedule' && renderScheduleContent()}
            </div>

            {activeView === 'chat' && (
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    rows={1}
                    disabled={isProcessing}
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    className="rounded-lg bg-primary-600 p-2 text-white hover:bg-primary-500 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-500"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
}