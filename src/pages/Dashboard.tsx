import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calendar as CalendarIcon, 
  BarChart, 
  Clock, 
  Heart,
  Home,
  Settings,
  User,
  Wallet,
  Menu,
  X,
  LogOut,
  Shield,
  Map,
  Briefcase,
  Target,
  Building
} from 'lucide-react';
import { Overview } from '../components/Overview';
import { TaskManager } from '../components/task-manager/TaskManager';
import { HealthDashboard } from '../components/health/HealthDashboard';
import { FinanceDashboard } from '../components/finance/FinanceDashboard';
import { GoalsDashboard } from '../components/goals/GoalsDashboard';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { RoadsDashboard } from '../components/roads/RoadsDashboard';
import { CareerDashboard } from '../components/career/CareerDashboard';
import { ProjectDashboard } from '../components/project/ProjectDashboard';
import { BusinessDashboard } from '../components/business/BusinessDashboard';
import { GuestBanner } from '../components/GuestBanner';
import { AIAssistant } from '../components/AIAssistant';
import { useAuthStore } from '../store/authStore';
import { useGuestStore } from '../store/guestStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useTrialStore } from '../store/trialStore';
import { TrialBanner } from '../components/trial/TrialBanner';
import { UpgradePrompt } from '../components/trial/UpgradePrompt';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const navigate = useNavigate();
  const { signOut, profile } = useAuthStore();
  const { isGuest } = useGuestStore();
  const { plan, loadSubscription } = useSubscriptionStore();
  const { isTrialActive, shouldShowUpgradePrompt } = useTrialStore();

  useEffect(() => {
    if (!isGuest) {
      loadSubscription();
    }
  }, [isGuest, loadSubscription]);

  useEffect(() => {
    if (isTrialActive && shouldShowUpgradePrompt()) {
      setShowUpgradePrompt(true);
    }
  }, [isTrialActive, shouldShowUpgradePrompt]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const navigation = [
    { id: 'overview', name: 'Overview', href: '#', icon: Home },
    { id: 'tasks', name: 'Tasks', href: '#', icon: Brain },
    { id: 'health', name: 'Health', href: '#', icon: Heart, premium: true },
    { id: 'finance', name: 'Finance', href: '#', icon: Wallet, premium: true },
    { id: 'goals', name: 'Goals', href: '#', icon: CalendarIcon },
    { id: 'roads', name: 'Roads', href: '#', icon: Map, premium: true },
    { id: 'career', name: 'Career', href: '#', icon: Briefcase, premium: true },
    { id: 'projects', name: 'Projects', href: '#', icon: Target, premium: true },
    { id: 'business', name: 'Business Suite', href: '#', icon: Building, premium: true },
    { id: 'analytics', name: 'Analytics', href: '#', icon: BarChart, premium: true }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'tasks':
        return <TaskManager />;
      case 'health':
        return <HealthDashboard />;
      case 'finance':
        return <FinanceDashboard />;
      case 'goals':
        return <GoalsDashboard />;
      case 'roads':
        return <RoadsDashboard />;
      case 'career':
        return <CareerDashboard />;
      case 'projects':
        return <ProjectDashboard />;
      case 'business':
        return <BusinessDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guest Banner */}
      {isGuest && <GuestBanner />}

      {/* Show trial banner if in trial */}
      {isTrialActive && <TrialBanner />}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">LifeSync</h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group ${
                activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : ''
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${
                activeTab === item.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
              }`} />
              {item.name}
              {item.premium && !isGuest && plan === 'free' && (
                <span className="ml-auto text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </button>
          ))}

          {/* Settings and Admin Panel */}
          <div className="pt-4 border-t">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group ${
                activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : ''
              }`}
            >
              <Settings className={`h-5 w-5 mr-3 ${
                activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
              }`} />
              Settings
            </button>

            {/* Admin Panel Button - Only shown for admin users */}
            {profile?.role === 'admin' && (
              <button
                onClick={handleAdminPanel}
                className="flex w-full items-center px-4 py-3 text-purple-700 rounded-lg hover:bg-purple-50 group"
              >
                <Shield className="h-5 w-5 mr-3 text-purple-400 group-hover:text-purple-600" />
                Admin Panel
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 group"
            >
              <LogOut className="h-5 w-5 mr-3 text-red-400 group-hover:text-red-600" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Upgrade prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt onClose={() => setShowUpgradePrompt(false)} />
      )}
    </div>
  );
}

export default Dashboard;