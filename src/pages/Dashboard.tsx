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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      {/* Guest Banner */}
      {isGuest && <GuestBanner />}

      {/* Show trial banner if in trial */}
      {isTrialActive && <TrialBanner />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r border-primary-200/30 shadow-2xl transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 animate-slide-in-right`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-200/30">
          <h1 className="text-2xl font-bold gradient-text">LifeSync</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-100/50 transition-all"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-primary-200/30">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-primary-50/50 to-secondary-50/50 hover:from-primary-100/50 hover:to-secondary-100/50 transition-all duration-300 hover-lift cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shadow-lg ring-2 ring-white/50">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-gray-600">{profile?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-300px)]">
          {navigation.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex w-full items-center px-4 py-3 text-gray-700 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 group animate-fade-in ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'hover:bg-white/50'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 transition-all ${
                activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-primary-600 group-hover:scale-110'
              }`} />
              <span className="font-medium">{item.name}</span>
              {item.premium && !isGuest && plan === 'free' && (
                <span className="ml-auto badge-primary text-xs">
                  Pro
                </span>
              )}
            </button>
          ))}

          {/* Settings and Admin Panel */}
          <div className="pt-4 border-t border-primary-200/30 mt-4">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center px-4 py-3 text-gray-700 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 group ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'hover:bg-white/50'
              }`}
            >
              <Settings className={`h-5 w-5 mr-3 transition-all ${
                activeTab === 'settings' ? 'text-white' : 'text-gray-400 group-hover:text-primary-600 group-hover:scale-110'
              }`} />
              <span className="font-medium">Settings</span>
            </button>

            {/* Admin Panel Button - Only shown for admin users */}
            {profile?.role === 'admin' && (
              <button
                onClick={handleAdminPanel}
                className="flex w-full items-center px-4 py-3 text-gray-700 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 group hover:bg-white/50 mt-1"
              >
                <Shield className="h-5 w-5 mr-3 text-primary-400 group-hover:text-primary-600 group-hover:scale-110 transition-all" />
                <span className="font-medium">Admin Panel</span>
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-3 text-red-600 rounded-xl hover:bg-red-50/80 hover:scale-105 active:scale-95 transition-all duration-200 group mt-1"
            >
              <LogOut className="h-5 w-5 mr-3 text-red-400 group-hover:text-red-600 group-hover:scale-110 transition-all" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="sticky top-0 z-40 glass-effect border-b border-primary-200/30 shadow-md backdrop-blur-md animate-fade-in-down">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-primary-100/50 transition-all hover:scale-110 active:scale-95"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-gray-900">
                {navigation.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 animate-fade-in">
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