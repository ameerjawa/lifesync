import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Brain, Target, TrendingUp, Award } from 'lucide-react';

const skillsData = [
  { name: 'Technical', value: 85, industry: 75 },
  { name: 'Leadership', value: 70, industry: 65 },
  { name: 'Communication', value: 90, industry: 80 },
  { name: 'Problem Solving', value: 85, industry: 70 },
  { name: 'Teamwork', value: 95, industry: 85 },
  { name: 'Adaptability', value: 80, industry: 75 }
];

const growthData = [
  { month: 'Jan', growth: 65 },
  { month: 'Feb', growth: 68 },
  { month: 'Mar', growth: 72 },
  { month: 'Apr', growth: 75 },
  { month: 'May', growth: 80 },
  { month: 'Jun', growth: 85 }
];

export function SkillsAnalysis() {
  return (
    <div className="space-y-6">
      {/* Skills Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Skills Radar</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Your Skills"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Industry Average"
                  dataKey="industry"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Growth Trajectory</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="growth" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center">
            <div className="rounded-full bg-primary-100 p-3">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              <span className="text-gray-600">Strong growth in technical skills</span>
            </li>
            <li className="flex items-start">
              <Target className="mr-2 h-5 w-5 text-blue-500" />
              <span className="text-gray-600">Above industry average in communication</span>
            </li>
            <li className="flex items-start">
              <Award className="mr-2 h-5 w-5 text-primary-500" />
              <span className="text-gray-600">Leadership skills showing potential</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Focus Areas</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Leadership Development</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-3/4 bg-green-500"></div>
              </div>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Technical Skills</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-4/5 bg-green-500"></div>
              </div>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Problem Solving</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[85%] bg-green-500"></div>
              </div>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center">
            <div className="rounded-full bg-primary-100 p-3">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Next Steps</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center">
              <button className="w-full rounded-lg border border-primary-600 px-4 py-2 text-primary-600 hover:bg-primary-50">
                Take Leadership Course
              </button>
            </li>
            <li className="flex items-center">
              <button className="w-full rounded-lg border border-primary-600 px-4 py-2 text-primary-600 hover:bg-primary-50">
                Join Mentorship Program
              </button>
            </li>
            <li className="flex items-center">
              <button className="w-full rounded-lg border border-primary-600 px-4 py-2 text-primary-600 hover:bg-primary-50">
                Schedule Skill Assessment
              </button>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}