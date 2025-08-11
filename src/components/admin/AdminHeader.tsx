import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between mb-8">
        <div className="space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Platform
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onTabChange('features')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'features'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="mr-2 h-5 w-5" />
            Features
          </button>
          <button
            onClick={() => onTabChange('plans')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'plans'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="mr-2 h-5 w-5" />
            Plans
          </button>
          <button
            onClick={() => onTabChange('users')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="mr-2 h-5 w-5" />
            Users
          </button>
        </div>
      </div>
    </>
  );
}