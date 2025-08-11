import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useGuestStore } from './guestStore';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error loading profile after sign in:', profileError);
          throw profileError;
        }

        // End guest session if active
        useGuestStore.getState().endGuestSession();

        set({ user: data.user, profile, error: null });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in',
        user: null,
        profile: null 
      });
      // Clear any invalid session
      await supabase.auth.signOut();
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
signUp: async (email: string, password: string, fullName: string) => {
  set({ isLoading: true, error: null });

  try {
    // Clear any existing session first
    await supabase.auth.signOut();

    // Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      throw signUpError;
    }

    // Make sure we have a valid session before continuing
    let session = (await supabase.auth.getSession()).data.session;

    if (!session) {
      // Try to get it from signUpData if available
      session = signUpData.session;

      // If still no session, it means email confirmation is enabled
      if (!session) {
        throw new Error(
          'Sign-up successful! Please check your email to confirm before logging in.'
        );
      }
    }

    const userId = session.user.id;

    // Insert profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId, // Must match auth.uid()
          email,
          full_name: fullName,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    // End guest session if active
    useGuestStore.getState().endGuestSession();

    set({
      user: session.user,
      profile: profile as Profile,
      error: null,
    });

  } catch (error) {
    console.error('Sign up error:', error);
    set({
      error: error instanceof Error ? error.message : 'Failed to sign up',
      user: null,
      profile: null,
    });
    throw error;
  } finally {
    set({ isLoading: false });
  }
},

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all state
      set({ 
        user: null, 
        profile: null,
        error: null 
      });

      // End any guest session
      useGuestStore.getState().endGuestSession();

      // Reload the page to ensure a completely fresh state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to sign out' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadUser: async () => {
    set({ isLoading: true });
    try {
      // First try to get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // If no session or session error, clear state and return
      if (sessionError || !session) {
        set({ user: null, profile: null, isLoading: false });
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Handle missing session silently - this is normal for non-authenticated users
      if (userError?.name === 'AuthApiError' && userError.status === 403) {
        set({ user: null, profile: null, isLoading: false });
        // Clear invalid session
        await supabase.auth.signOut();
        return;
      }
      
      if (userError) throw userError;
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          // Only log error if it's not a "no rows returned" error
          if (profileError.code !== 'PGRST116') {
            console.error('Error loading profile:', profileError);
          }
          set({ user: null, profile: null });
          // Clear invalid session
          await supabase.auth.signOut();
          return;
        }

        set({ user, profile: profile as Profile, error: null });
      } else {
        set({ user: null, profile: null });
      }
    } catch (error) {
      // Only log unexpected errors
      if (error?.name !== 'AuthApiError' || error?.status !== 403) {
        console.error('Error in loadUser:', error);
      }
      set({ user: null, profile: null });
      // Clear any invalid session
      await supabase.auth.signOut();
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        profile: { ...state.profile, ...data } as Profile,
        error: null
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to send reset instructions' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));