import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserPreferences {
  id?: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  language: string;
  timezone: string;
  date_format: string;
  currency: string;
  custom_settings: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface PreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;

  loadPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  setCustomSetting: (key: string, value: any) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: null,
  isLoading: false,
  error: null,

  loadPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const defaultPreferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          theme: 'system',
          notifications_enabled: true,
          email_notifications: true,
          push_notifications: false,
          language: navigator.language.split('-')[0] || 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          date_format: 'MM/DD/YYYY',
          currency: 'USD',
          custom_settings: {}
        };

        const { data: newData, error: insertError } = await supabase
          .from('user_preferences')
          .insert([defaultPreferences])
          .select()
          .single();

        if (insertError) throw insertError;
        set({ preferences: newData, error: null });
      } else {
        set({ preferences: data, error: null });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load preferences',
        preferences: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePreferences: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ preferences: data, error: null });
    } catch (error) {
      console.error('Error updating preferences:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update preferences' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setCustomSetting: async (key: string, value: any) => {
    const currentPreferences = get().preferences;
    if (!currentPreferences) {
      await get().loadPreferences();
      return get().setCustomSetting(key, value);
    }

    const newCustomSettings = {
      ...currentPreferences.custom_settings,
      [key]: value
    };

    await get().updatePreferences({ custom_settings: newCustomSettings });
  }
}));
