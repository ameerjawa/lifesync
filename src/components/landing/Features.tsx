import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Heart, 
  Wallet, 
  Brain, 
  BarChart, 
  Sparkles,
  Target,
  Users,
  Shield,
  Zap
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI Task Management',
      description: 'Smart task prioritization and scheduling powered by advanced AI algorithms.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      icon: Heart,
      title: 'Health Analytics',
      description: 'Comprehensive health monitoring with personalized insights and recommendations.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Wallet,
      title: 'Financial Planning',
      description: 'Intelligent budgeting, investment tracking, and financial goal setting.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set, track, and achieve your personal and professional goals.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with integrated team features and shared workspaces.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Deep insights into your productivity, health, and financial patterns.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Everything You Need to Thrive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Powerful features designed to help you achieve your goals and live your best life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`${feature.bgColor} rounded-2xl p-4 inline-block`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">1M+</div>
            <div className="text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}