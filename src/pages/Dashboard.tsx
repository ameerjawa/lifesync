import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Target, ListTodo, Calendar, Heart, Wallet, Briefcase,
  BarChart3, Settings, User, Menu, X, LogOut, Shield, ChevronDown,
  Brain, TrendingUp, Building, Moon, Sun, Sparkles,
} from 'lucide-react';
import { NextLogo } from '../components/brand/NextLogo';
import { Overview } from '../components/Overview';
import { TodayScreen } from '../components/today/TodayScreen';
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
import { AIAssistant } from '../components/AIAssistant';
import { useAuthStore } from '../store/authStore';
import { useGuestStore } from '../store/guestStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useTrialStore } from '../store/trialStore';
import { GuestBanner } from '../components/GuestBanner';
import { TrialBanner } from '../components/trial/TrialBanner';
import { UpgradePrompt } from '../components/trial/UpgradePrompt';

interface NavSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'today' | 'plan' | 'life' | 'work' | 'insights' | 'ai' | 'system';
  premium?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  { id: 'today', label: 'Today', icon: Zap, group: 'today' },
  { id: 'overview', label: 'Overview', icon: TrendingUp, group: 'today' },

  { id: 'goals', label: 'Goals', icon: Target, group: 'plan' },
  { id: 'projects', label: 'Projects', icon: Building, group: 'plan', premium: true },
  { id: 'tasks', label: 'Tasks', icon: ListTodo, group: 'plan' },
  { id: 'roads', label: 'Roads', icon: Calendar, group: 'plan', premium: true },

  { id: 'career', label: 'Career', icon: Briefcase, group: 'life', premium: true },
  { id: 'finance', label: 'Money', icon: Wallet, group: 'life', premium: true },
  { id: 'health', label: 'Fitness', icon: Heart, group: 'life', premium: true },

  { id: 'business', label: 'Business', icon: Building, group: 'work', premium: true },

  { id: 'analytics', label: 'Progress', icon: BarChart3, group: 'insights', premium: true },
];

const NAV_GROUPS: { id: NavSection['group']; label: string }[] = [
  { id: 'today', label: 'Execute' },
  { id: 'plan', label: 'Plan' },
  { id: 'life', label: 'Life' },
  { id: 'work', label: 'Work' },
  { id: 'insights', label: 'Insights' },
];

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('today');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { signOut, profile } = useAuthStore();
  const { isGuest } = useGuestStore();
  const { plan, loadSubscription } = useSubscriptionStore();
  const { isTrialActive, shouldShowUpgradePrompt } = useTrialStore();

  useEffect(() => {
    if (!isGuest) loadSubscription();
  }, [isGuest, loadSubscription]);

  useEffect(() => {
    if (isTrialActive && shouldShowUpgradePrompt()) setShowUpgrade(true);
  }, [isTrialActive, shouldShowUpgradePrompt]);

  useEffect(() => {
    const saved = localStorage.getItem('next-dark-mode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('next-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('next-dark-mode', 'false');
    }
  };

  const handleSignOut = async () => {
    try { await signOut(); } catch (e) { console.error('Sign out error:', e); }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'today': return <TodayScreen />;
      case 'overview': return <Overview />;
      case 'tasks': return <TaskManager />;
      case 'health': return <HealthDashboard />;
      case 'finance': return <FinanceDashboard />;
      case 'goals': return <GoalsDashboard />;
      case 'roads': return <RoadsDashboard />;
      case 'career': return <CareerDashboard />;
      case 'projects': return <ProjectDashboard />;
      case 'business': return <BusinessDashboard />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return <SettingsPanel />;
      default: return <TodayScreen />;
    }
  };

  const currentLabel = NAV_SECTIONS.find(s => s.id === activeView)?.label || 'Today';

  return (
    <div className="min-h-screen bg-base">
      {isGuest && <GuestBanner />}
      {isTrialActive && <TrialBanner />}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-elevated border-r border-default transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-14 px-4 border-b border-default">
          <NextLogo size="sm" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>

        <nav className="px-2 py-3 overflow-y-auto h-[calc(100vh-3.5rem-5rem)]">
          {NAV_GROUPS.map(group => (
            <div key={group.id} className="mb-4">
              <p className="px-3 mb-1.5 section-label">{group.label}</p>
              {NAV_SECTIONS.filter(s => s.group === group.id).map(section => (
                <button
                  key={section.id}
                  onClick={() => { setActiveView(section.id); setSidebarOpen(false); }}
                  className={`nav-item w-full ${activeView === section.id ? 'nav-item-active' : ''}`}
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  <span>{section.label}</span>
                  {section.premium && !isGuest && plan === 'free' && (
                    <span className="ml-auto badge-neutral text-[10px] px-1.5 py-0.5">Pro</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-default p-2">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {(profile?.full_name || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-heading truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted truncate">{plan === 'free' ? 'Free plan' : plan === 'premium' ? 'Pro' : plan}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted shrink-0" />
          </button>

          {userMenuOpen && (
            <div className="mt-1 space-y-0.5">
              <button onClick={() => { setActiveView('settings'); setUserMenuOpen(false); }} className="nav-item w-full">
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button onClick={toggleDarkMode} className="nav-item w-full">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
              {profile?.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="nav-item w-full">
                  <Shield className="h-4 w-4" /> Admin
                </button>
              )}
              <button onClick={handleSignOut} className="nav-item w-full text-error-600 hover:text-error-700">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-elevated/90 backdrop-blur-sm border-b border-default flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
              <Menu className="h-5 w-5 text-heading" />
            </button>
            <h1 className="text-lg font-semibold text-heading">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
              {darkMode ? <Sun className="h-4 w-4 text-heading" /> : <Moon className="h-4 w-4 text-heading" />}
            </button>
            <button onClick={() => setActiveView('ai')} className="btn-ghost text-sm">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span className="hidden sm:inline">Ask NEXT</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <AIAssistant />

      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default Dashboard;
