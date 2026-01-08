import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  Scale,
  Moon,
  Droplets,
  Smile,
  Heart,
  Target,
  TrendingUp,
  Plus,
  Calendar,
  Bell,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHealthStore, useFinanceStore, useTaskStore } from '../store';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminOverview } from '../components/admin/AdminOverview';
import { FeatureManagement } from '../components/admin/FeatureManagement';
import { PlanManagement } from '../components/admin/PlanManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminNotifications } from '../components/admin/AdminNotifications';
import { useToastStore } from '../store/toastStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [planFeatures, setPlanFeatures] = useState([]);
  const [users, setUsers] = useState([]);
  const { showSuccess, showError } = useToastStore();
  
  const { metrics, goals: healthGoals, loadMetrics, loadGoals } = useHealthStore();
  const { accounts, transactions, loadAccounts, loadTransactions } = useFinanceStore();
  const { tasks, loadTasks } = useTaskStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load basic stats
        await Promise.all([
          loadMetrics(),
          loadGoals(),
          loadAccounts(),
          loadTransactions(),
          loadTasks()
        ]);

        // Load features
        const { data: featuresData, error: featuresError } = await supabase
          .from('feature_flags')
          .select('*')
          .order('name');
        
        if (featuresError) throw featuresError;
        setFeatures(featuresData || []);

        // Load plan features
        const { data: planFeaturesData, error: planFeaturesError } = await supabase
          .from('plan_features')
          .select('*');
        
        if (planFeaturesError) throw planFeaturesError;
        setPlanFeatures(planFeaturesData || []);

        // Load users with profiles
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select(`
            *,
            subscription:subscriptions(
              plan,
              status,
              current_period_end
            )
          `)
          .order('created_at', { ascending: false });
        
        if (usersError) throw usersError;
        setUsers(usersData || []);

      } catch (error) {
        console.error('Error loading admin data:', error);
        showError('Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddFeature = async (feature) => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .insert([feature])
        .select()
        .single();

      if (error) throw error;
      setFeatures([...features, data]);
      showSuccess('Feature added successfully');
    } catch (error) {
      console.error('Error adding feature:', error);
      showError('Failed to add feature');
      throw error;
    }
  };

  const handleUpdateFeature = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFeatures(features.map(f => f.id === id ? data : f));
      showSuccess('Feature updated successfully');
    } catch (error) {
      console.error('Error updating feature:', error);
      showError('Failed to update feature');
      throw error;
    }
  };

  const handleDeleteFeature = async (id) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFeatures(features.filter(f => f.id !== id));
      showSuccess('Feature deleted successfully');
    } catch (error) {
      console.error('Error deleting feature:', error);
      showError('Failed to delete feature');
      throw error;
    }
  };

  const handleTogglePlanFeature = async (featureId, plan, enabled) => {
    try {
      if (enabled) {
        // Remove feature from plan
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
        // Add feature to plan
        const { data, error } = await supabase
          .from('plan_features')
          .insert([{ feature_id: featureId, plan }])
          .select()
          .single();

        if (error) throw error;
        setPlanFeatures([...planFeatures, data]);
      }
      showSuccess('Plan features updated successfully');
    } catch (error) {
      console.error('Error updating plan features:', error);
      showError('Failed to update plan features');
      throw error;
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      setUsers(users.map(user => user.id === userId ? { ...user, ...data } : user));
      showSuccess('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      showError('Failed to update user');
      throw error;
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
      showSuccess('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('Failed to update user role');
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      setUsers(users.filter(user => user.id !== userId));
      showSuccess('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Failed to delete user');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your platform and monitor key metrics</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'features', name: 'Features', icon: Target },
              { id: 'plans', name: 'Plans', icon: Scale },
              { id: 'users', name: 'Users', icon: Heart },
              { id: 'notifications', name: 'Notifications', icon: Bell },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow'
                      : 'text-gray-500 hover:bg-white hover:text-gray-900'
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
        <div className="space-y-6">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'features' && (
            <FeatureManagement
              features={features}
              planFeatures={planFeatures}
              onAddFeature={handleAddFeature}
              onUpdateFeature={handleUpdateFeature}
              onDeleteFeature={handleDeleteFeature}
              onTogglePlanFeature={handleTogglePlanFeature}
            />
          )}
          {activeTab === 'plans' && (
            <PlanManagement
              features={features}
              planFeatures={planFeatures}
              onTogglePlanFeature={handleTogglePlanFeature}
            />
          )}
          {activeTab === 'users' && (
            <UserManagement
              users={users}
              onUpdateUser={handleUpdateUser}
              onUpdateUserRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
            />
          )}
          {activeTab === 'notifications' && <AdminNotifications />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

export { AdminDashboard }