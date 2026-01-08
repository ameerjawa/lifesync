import React, { useState } from 'react';
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  CreditCard,
  Plug,
  Shield,
  Eye,
  Database,
  Settings as SettingsIcon,
  LogOut,
  Save
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { supabase } from '../../lib/supabase';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { AppearanceSettings } from './AppearanceSettings';
import { PreferenceSettings } from './PreferenceSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { IntegrationSettings } from './IntegrationSettings';
import { PrivacySettings } from './PrivacySettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import { DataManagementSettings } from './DataManagementSettings';

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, profile, updateProfile, signOut } = useAuthStore();
  const { plan, upgradePlan, cancelSubscription } = useSubscriptionStore();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    company: profile?.company || '',
    phone: profile?.phone || '',
    website: profile?.website || '',
    address: profile?.address || '',
    timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: profile?.language || navigator.language,
    notifications_enabled: profile?.notifications_enabled || false,
    email_notifications: {
      tasks: true,
      goals: true,
      health: true,
      finance: true
    },
    theme: 'light',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgrade = async (newPlan: 'premium' | 'enterprise') => {
    if (!confirm(`Are you sure you want to switch to the ${newPlan} plan?`)) {
      return;
    }

    setIsSaving(true);
    try {
      await upgradePlan(newPlan);
      alert('Plan updated successfully!');
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Failed to upgrade plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setIsSaving(true);
    try {
      await cancelSubscription();
      alert('Subscription cancelled successfully. You will have access until the end of your current billing period.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
    { id: 'integrations', name: 'Integrations', icon: Plug },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'accessibility', name: 'Accessibility', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            profile={profile}
            formData={formData}
            setFormData={setFormData}
            isUploading={isUploading}
            handleAvatarUpload={handleAvatarUpload}
          />
        );

      case 'notifications':
        return (
          <NotificationSettings
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 'security':
        return <SecuritySettings />;

      case 'appearance':
        return (
          <AppearanceSettings
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 'preferences':
        return (
          <PreferenceSettings
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 'subscription':
        return (
          <SubscriptionSettings
            plan={plan}
            onUpgrade={handleUpgrade}
            onCancel={handleCancelSubscription}
          />
        );

      case 'integrations':
        return <IntegrationSettings />;

      case 'privacy':
        return <PrivacySettings />;

      case 'accessibility':
        return <AccessibilitySettings />;

      case 'data':
        return <DataManagementSettings />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Sidebar */}
            <aside className="py-6 lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center space-x-3 px-6 py-3 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}

                <button
                  onClick={signOut}
                  className="flex w-full items-center space-x-3 px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Main content */}
            <div className="divide-y divide-gray-200 lg:col-span-9">
              <div className="px-6 py-6">
                {renderTabContent()}

                {/* Save Button */}
                {activeTab !== 'subscription' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}