import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Users,
  DollarSign,
  FileText,
  BarChart2,
  Settings,
  Plus,
  TrendingUp,
  Calendar,
  Target,
  Briefcase
} from 'lucide-react';
import { BusinessOverview } from './BusinessOverview';
import { BusinessProjects } from './BusinessProjects';
import { BusinessTasks } from './BusinessTasks';
import { BusinessClients } from './BusinessClients';
import { BusinessInvoices } from './BusinessInvoices';
import { BusinessExpenses } from './BusinessExpenses';
import { BusinessAutomations } from './BusinessAutomations';
import { BusinessTeam } from './BusinessTeam';
import { BusinessAnalytics } from './BusinessAnalytics';
import { BusinessSettings } from './BusinessSettings';
import { BusinessSetup } from './BusinessSetup';
import { useBusinessStore } from '../../store/businessStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { UpgradePrompt } from '../trial/UpgradePrompt';

export function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const {
    profile,
    isLoading,
    loadBusinessProfile,
    loadProjects,
    loadTasks,
    loadClients,
    loadInvoices,
    loadExpenses,
    loadAutomations,
    loadTeamMembers,
    generateAnalytics
  } = useBusinessStore();

  const { plan, checkFeatureAccess } = useSubscriptionStore();

  useEffect(() => {
    // Check if user has access to Business Suite
    if (!checkFeatureAccess('business_suite')) {
      setShowUpgradePrompt(true);
      return;
    }

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await loadBusinessProfile();
      
      // If business profile exists, load all business data
      if (profile) {
        await Promise.all([
          loadProjects(),
          loadTasks(),
          loadClients(),
          loadInvoices(),
          loadExpenses(),
          loadAutomations(),
          loadTeamMembers(),
          generateAnalytics()
        ]);
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  // If user doesn't have access, show upgrade prompt
  if (!checkFeatureAccess('business_suite')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <Building className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Business Suite
            </h2>
            <p className="text-gray-600 mb-6">
              Unlock powerful business management tools with our Premium or Enterprise plans.
            </p>
            <button
              onClick={() => setShowUpgradePrompt(true)}
              className="w-full bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-500 transition-colors"
            >
              Upgrade to Access Business Suite
            </button>
          </div>
        </div>
        
        {showUpgradePrompt && (
          <UpgradePrompt
            onClose={() => setShowUpgradePrompt(false)}
            feature="Business Suite"
          />
        )}
      </div>
    );
  }

  // If no business profile exists, show setup
  if (!profile && !isLoading) {
    return <BusinessSetup />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart2 },
    { id: 'projects', name: 'Projects', icon: Target },
    { id: 'tasks', name: 'Tasks', icon: Briefcase },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'expenses', name: 'Expenses', icon: DollarSign },
    { id: 'automations', name: 'Automations', icon: Settings },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BusinessOverview />;
      case 'projects':
        return <BusinessProjects />;
      case 'tasks':
        return <BusinessTasks />;
      case 'clients':
        return <BusinessClients />;
      case 'invoices':
        return <BusinessInvoices />;
      case 'expenses':
        return <BusinessExpenses />;
      case 'automations':
        return <BusinessAutomations />;
      case 'team':
        return <BusinessTeam />;
      case 'analytics':
        return <BusinessAnalytics />;
      case 'settings':
        return <BusinessSettings />;
      default:
        return <BusinessOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {profile?.company_name || 'Business Suite'}
                </h1>
                <p className="text-sm text-gray-500">{profile?.industry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {plan === 'premium' ? 'Premium' : 'Enterprise'} Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === item.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}