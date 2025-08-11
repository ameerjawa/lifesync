import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FileText,
  Video,
  Network,
  Briefcase,
  Brain,
  Target,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { SkillsAnalysis } from './SkillsAnalysis';
import { ResumeOptimizer } from './ResumeOptimizer';
import { InterviewSimulator } from './InterviewSimulator';
import { CareerForecast } from './CareerForecast';
import { NetworkingHub } from './NetworkingHub';
import { UpskillRecommendations } from './UpskillRecommendations';

export function CareerDashboard() {
  const [activeTab, setActiveTab] = useState('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: 'skills', name: 'Skills Analysis', icon: Brain },
    { id: 'resume', name: 'Resume Optimizer', icon: FileText },
    { id: 'interview', name: 'Interview Practice', icon: Video },
    { id: 'forecast', name: 'Career Forecast', icon: TrendingUp },
    { id: 'network', name: 'Networking', icon: Network },
    { id: 'upskill', name: 'Upskilling', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Career Navigator</h2>
              <p className="mt-2 text-indigo-100">AI-powered career development and optimization</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center rounded-lg bg-white/20 px-4 py-2 text-white hover:bg-white/30"
              >
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </button>
              <button
                className="flex items-center rounded-lg bg-white px-4 py-2 text-indigo-600 shadow-md transition-all hover:bg-indigo-50"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Goal
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3')] opacity-10"></div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, jobs, or companies..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className="mr-2 h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'skills' && <SkillsAnalysis />}
        {activeTab === 'resume' && <ResumeOptimizer />}
        {activeTab === 'interview' && <InterviewSimulator />}
        {activeTab === 'forecast' && <CareerForecast />}
        {activeTab === 'network' && <NetworkingHub />}
        {activeTab === 'upskill' && <UpskillRecommendations />}
      </div>
    </div>
  );
}