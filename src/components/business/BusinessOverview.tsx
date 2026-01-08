import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

interface BusinessOverviewProps {
  onNavigate?: (tab: string) => void;
}

export function BusinessOverview({ onNavigate }: BusinessOverviewProps) {
  const {
    analytics,
    projects,
    tasks,
    clients,
    invoices,
    generateAnalytics,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    generateAnalytics();
  }, [generateAnalytics]);

  // Prepare chart data
  const revenueData = [
    { month: 'Jan', revenue: analytics?.revenue.monthly || 0 },
    { month: 'Feb', revenue: (analytics?.revenue.monthly || 0) * 0.9 },
    { month: 'Mar', revenue: analytics?.revenue.monthly || 0 }
  ];

  const projectStatusData = [
    { name: 'Active', value: analytics?.projects.active || 0 },
    { name: 'Completed', value: analytics?.projects.completed || 0 },
    { name: 'Overdue', value: analytics?.projects.overdue || 0 }
  ];

  const upcomingTasks = tasks
    .filter(task => task.due_date && new Date(task.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  const recentClients = clients
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${analytics?.revenue.monthly.toLocaleString() || '0'}
              </p>
              <p className={`text-sm ${
                (analytics?.revenue.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(analytics?.revenue.growth || 0) >= 0 ? '+' : ''}{analytics?.revenue.growth.toFixed(1) || '0'}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Clients</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.clients.active || 0}
              </p>
              <p className="text-sm text-blue-600">
                +{analytics?.clients.new_this_month || 0} this month
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.projects.active || 0}
              </p>
              <p className="text-sm text-purple-600">
                {analytics?.projects.completed || 0} completed
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Productivity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.team.productivity.toFixed(0) || '0'}%
              </p>
              <p className="text-sm text-orange-600">
                {analytics?.team.utilization || 0}% utilization
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Tasks</h3>
          <div className="space-y-4">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 ${
                      task.priority === 'urgent' ? 'bg-red-100' :
                      task.priority === 'high' ? 'bg-orange-100' :
                      task.priority === 'medium' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        task.priority === 'urgent' ? 'text-red-600' :
                        task.priority === 'high' ? 'text-orange-600' :
                        task.priority === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Clients</h3>
          <div className="space-y-4">
            {recentClients.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No clients yet</p>
            ) : (
              recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.company || client.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' :
                    client.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                    client.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Alerts & Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Important Alerts</h3>
        <div className="space-y-4">
          {invoices.filter(inv => inv.status === 'pending').length > 0 && (
            <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">
                  {invoices.filter(inv => inv.status === 'pending').length} Pending Invoice{invoices.filter(inv => inv.status === 'pending').length > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Review and send invoices to clients
                </p>
              </div>
            </div>
          )}

          {tasks.filter(task => task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed').length > 0 && (
            <div className="flex items-start p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-900">
                  {tasks.filter(task => task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed').length} Overdue Task{tasks.filter(task => task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed').length > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Address overdue tasks immediately
                </p>
              </div>
            </div>
          )}

          {projects.filter(p => p.status === 'active').length === 0 && (
            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">No Active Projects</p>
                <p className="text-sm text-blue-700 mt-1">
                  Create your first project to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => onNavigate?.('projects')}
            className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Target className="h-6 w-6 text-indigo-600 mr-3" />
            <span className="font-medium text-indigo-900">New Project</span>
          </button>
          <button
            onClick={() => onNavigate?.('clients')}
            className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Add Client</span>
          </button>
          <button
            onClick={() => onNavigate?.('invoices')}
            className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileText className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium text-purple-900">Create Invoice</span>
          </button>
          <button
            onClick={() => onNavigate?.('expenses')}
            className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <DollarSign className="h-6 w-6 text-orange-600 mr-3" />
            <span className="font-medium text-orange-900">Add Expense</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}