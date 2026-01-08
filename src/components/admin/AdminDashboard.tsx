import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Flag,
  Home,
  ArrowLeft,
  BarChart2,
  DollarSign,
  Activity,
  Settings,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { AdminHeader } from './AdminHeader';
import { AdminOverview } from './AdminOverview';
import { FeatureManagement } from './FeatureManagement';
import { PlanManagement } from './PlanManagement';
import { UserManagement } from './UserManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { AdminNotifications } from './AdminNotifications';
import type { Feature, PlanFeature } from '../../lib/types';

export function AdminDashboard() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'plans' | 'users' | 'analytics' | 'settings' | 'notifications'>('overview');
  
  const { profile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [profile, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load features
      const { data: featuresData, error: featuresError } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (featuresError) throw featuresError;
      setFeatures(featuresData);

      // Load plan features
      const { data: planFeaturesData, error: planFeaturesError } = await supabase
        .from('plan_features')
        .select('*');

      if (planFeaturesError) throw planFeaturesError;
      setPlanFeatures(planFeaturesData);

    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary-600" />
              <span className="ml-2 font-semibold text-gray-900">Admin Panel</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'overview' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'features' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Flag className="mr-3 h-5 w-5" />
              Features
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'plans' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="mr-3 h-5 w-5" />
              Plans
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'users' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'analytics' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              Analytics
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'notifications' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              Back to Platform
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <AdminHeader activeTab={activeTab} />

          <div className="p-6">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && <AdminOverview />}
                {activeTab === 'features' && (
                  <FeatureManagement
                    features={features}
                    planFeatures={planFeatures}
                    onAddFeature={async (feature) => {
                      const { data, error } = await supabase
                        .from('feature_flags')
                        .insert([feature])
                        .select()
                        .single();

                      if (error) throw error;
                      setFeatures([...features, data]);
                    }}
                    onUpdateFeature={async (id, updates) => {
                      const { data, error } = await supabase
                        .from('feature_flags')
                        .update(updates)
                        .eq('id', id)
                        .select()
                        .single();

                      if (error) throw error;
                      setFeatures(features.map(f => f.id === id ? data : f));
                    }}
                    onDeleteFeature={async (id) => {
                      const { error } = await supabase
                        .from('feature_flags')
                        .delete()
                        .eq('id', id);

                      if (error) throw error;
                      setFeatures(features.filter(f => f.id !== id));
                    }}
                    onTogglePlanFeature={async (featureId, plan, enabled) => {
                      if (enabled) {
                        const { error } = await supabase
                          .from('plan_features')
                          .delete()
                          .eq('feature_id', featureId)
                          .eq('plan', plan);

                        if (error) throw error;
                        setPlanFeatures(planFeatures.filter(pf => 
                          !(pf.feature_id === featureId && pf.plan === plan)
                        ));
                      } else {
                        const { data, error } = await supabase
                          .from('plan_features')
                          .insert([{ feature_id: featureId, plan }])
                          .select()
                          .single();

                        if (error) throw error;
                        setPlanFeatures([...planFeatures, data]);
                      }
                    }}
                  />
                )}
                {activeTab === 'plans' && (
                  <PlanManagement
                    features={features}
                    planFeatures={planFeatures}
                    onTogglePlanFeature={async (featureId, plan, enabled) => {
                      if (enabled) {
                        const { error } = await supabase
                          .from('plan_features')
                          .delete()
                          .eq('feature_id', featureId)
                          .eq('plan', plan);

                        if (error) throw error;
                        setPlanFeatures(planFeatures.filter(pf => 
                          !(pf.feature_id === featureId && pf.plan === plan)
                        ));
                      } else {
                        const { data, error } = await supabase
                          .from('plan_features')
                          .insert([{ feature_id: featureId, plan }])
                          .select()
                          .single();

                        if (error) throw error;
                        setPlanFeatures([...planFeatures, data]);
                      }
                    }}
                  />
                )}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'analytics' && <AdminAnalytics />}
                {activeTab === 'notifications' && <AdminNotifications />}
                {activeTab === 'settings' && <AdminSettings />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}