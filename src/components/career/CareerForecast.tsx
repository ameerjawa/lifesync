import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';

const salaryData = [
  { year: '2025', salary: 85000, industry: 80000 },
  { year: '2026', salary: 95000, industry: 85000 },
  { year: '2027', salary: 110000, industry: 92000 },
  { year: '2028', salary: 130000, industry: 100000 },
  { year: '2029', salary: 150000, industry: 110000 }
];

const jobGrowthData = [
  { role: 'Current', demand: 100 },
  { role: 'Senior', demand: 85 },
  { role: 'Lead', demand: 65 },
  { role: 'Manager', demand: 45 },
  { role: 'Director', demand: 25 }
];

export function CareerForecast() {
  return (
    <div className="space-y-6">
      {/* Career Path Visualization */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Salary Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="salary"
                  name="Your Trajectory"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="industry"
                  name="Industry Average"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Job Market Demand</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={jobGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="demand"
                  name="Market Demand"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Career Milestones */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">Career Milestones</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Senior Role</h4>
              <p className="text-sm text-gray-500">Expected: Q4 2025</p>
              <p className="mt-1 text-gray-600">Lead technical initiatives and mentor junior team members</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Team Lead</h4>
              <p className="text-sm text-gray-500">Expected: Q2 2027</p>
              <p className="mt-1 text-gray-600">Manage team of 5-7 developers and coordinate projects</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Engineering Manager</h4>
              <p className="text-sm text-gray-500">Expected: Q3 2029</p>
              <p className="mt-1 text-gray-600">Department-wide technical strategy and team growth</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Industry Trends</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Growing demand for AI/ML expertise</li>
            <li>• Increased remote work opportunities</li>
            <li>• Focus on cross-functional skills</li>
            <li>• Rise of DevOps practices</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Users className="h-6 w-6 text-green-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Skill Demand</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Cloud architecture (+45%)</li>
            <li>• Data science (+38%)</li>
            <li>• Security expertise (+32%)</li>
            <li>• Agile leadership (+28%)</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-purple-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Opportunities</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• 150+ relevant openings nearby</li>
            <li>• 15 companies actively hiring</li>
            <li>• 5 fast-growing startups</li>
            <li>• 3 leadership positions</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}