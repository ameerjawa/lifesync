import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export function UpskillRecommendations() {
  const courses = [
    {
      id: 1,
      title: 'Advanced Machine Learning',
      provider: 'TechAcademy',
      duration: '12 weeks',
      level: 'Advanced',
      rating: 4.8,
      students: 1250,
      progress: 0,
      skills: ['Python', 'TensorFlow', 'Neural Networks']
    },
    {
      id: 2,
      title: 'Cloud Architecture Mastery',
      provider: 'CloudPro',
      duration: '8 weeks',
      level: 'Intermediate',
      rating: 4.9,
      students: 980,
      progress: 35,
      skills: ['AWS', 'Azure', 'DevOps']
    },
    {
      id: 3,
      title: 'Leadership & Team Management',
      provider: 'Management Institute',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.7,
      students: 2100,
      progress: 0,
      skills: ['Leadership', 'Communication', 'Team Building']
    }
  ];

  const certifications = [
    {
      id: 1,
      name: 'AWS Solutions Architect',
      organization: 'Amazon Web Services',
      validity: '2 years',
      difficulty: 'Advanced',
      marketValue: 'High'
    },
    {
      id: 2,
      name: 'Project Management Professional',
      organization: 'PMI',
      validity: '3 years',
      difficulty: 'Intermediate',
      marketValue: 'High'
    },
    {
      id: 3,
      name: 'Full Stack Development',
      organization: 'TechCert',
      validity: 'Lifetime',
      difficulty: 'Intermediate',
      marketValue: 'Medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Recommended Courses */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Recommended Courses</h3>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-500">
            View All
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{course.title}</h4>
                <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
                  {course.level}
                </span>
              </div>
              
              <p className="mt-1 text-sm text-gray-500">{course.provider}</p>
              
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  {course.rating}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {course.students}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-primary-600">{course.progress}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500">
                {course.progress > 0 ? 'Continue Course' : 'Start Course'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Certifications */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center">
          <Award className="h-6 w-6 text-primary-600" />
          <h3 className="ml-2 text-lg font-semibold text-gray-900">Recommended Certifications</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  cert.marketValue === 'High'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {cert.marketValue} Value
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">{cert.organization}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Validity: {cert.validity}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Difficulty: {cert.difficulty}
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg border border-primary-600 px-4 py-2 text-primary-600 hover:bg-primary-50">
                Learn More
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h3 className="ml-2 text-lg font-semibold text-gray-900">Your Learning Path</h3>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Foundations</h4>
              <p className="text-sm text-gray-500">Complete basic certifications and courses</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Advanced Skills</h4>
              <p className="text-sm text-gray-500">Specialize in key technologies</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Leadership</h4>
              <p className="text-sm text-gray-500">Develop management and leadership abilities</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}