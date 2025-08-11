import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateRoadImage, generateMilestoneImage } from '../lib/ai';
import type { Road, Milestone, Badge, UserBadge } from '../lib/types';

interface RoadState {
  roads: Road[];
  milestones: Milestone[];
  badges: Badge[];
  userBadges: UserBadge[];
  selectedRoad: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadRoads: () => Promise<void>;
  addRoad: (road: Omit<Road, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRoad: (id: string, updates: Partial<Road>) => Promise<void>;
  deleteRoad: (id: string) => Promise<void>;
  
  loadMilestones: (roadId: string) => Promise<void>;
  addMilestone: (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  completeMilestone: (id: string) => Promise<void>;
  
  loadBadges: () => Promise<void>;
  awardBadge: (badgeId: string) => Promise<void>;
  
  setSelectedRoad: (roadId: string | null) => void;
}

export const useRoadStore = create<RoadState>((set, get) => ({
  roads: [],
  milestones: [],
  badges: [],
  userBadges: [],
  selectedRoad: null,
  isLoading: false,
  error: null,

  loadRoads: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('roads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ roads: data || [] });
    } catch (error) {
      console.error('Error loading roads:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load roads' });
    } finally {
      set({ isLoading: false });
    }
  },

  addRoad: async (road) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      // Generate road image
      const imageUrl = await generateRoadImage(road as Road, road.theme);

      const { data, error } = await supabase
        .from('roads')
        .insert([{ 
          ...road, 
          user_id: user.id,
          image_url: imageUrl
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        roads: [data, ...state.roads]
      }));

      return data;
    } catch (error) {
      console.error('Error adding road:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add road' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRoad: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('roads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        roads: state.roads.map(road => 
          road.id === id ? { ...road, ...data } : road
        )
      }));
    } catch (error) {
      console.error('Error updating road:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update road' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRoad: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('roads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        roads: state.roads.filter(road => road.id !== id),
        selectedRoad: state.selectedRoad === id ? null : state.selectedRoad
      }));
    } catch (error) {
      console.error('Error deleting road:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete road' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadMilestones: async (roadId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('road_id', roadId)
        .order('position');

      if (error) throw error;
      set({ milestones: data || [] });
    } catch (error) {
      console.error('Error loading milestones:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load milestones' });
    } finally {
      set({ isLoading: false });
    }
  },

  addMilestone: async (milestone) => {
    set({ isLoading: true, error: null });
    try {
      // Generate milestone image
      const imageUrl = await generateMilestoneImage(milestone as Milestone);

      const { data, error } = await supabase
        .from('milestones')
        .insert([{ ...milestone, image_url: imageUrl }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        milestones: [...state.milestones, data]
      }));
    } catch (error) {
      console.error('Error adding milestone:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add milestone' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  completeMilestone: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('milestones')
        .update({
          is_completed: true,
          completion_date: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        milestones: state.milestones.map(milestone =>
          milestone.id === id ? { ...milestone, ...data } : milestone
        )
      }));

      // Update road progress
      const { milestones, roads } = get();
      const milestone = milestones.find(m => m.id === id);
      if (milestone) {
        const roadMilestones = milestones.filter(m => m.road_id === milestone.road_id);
        const completedCount = roadMilestones.filter(m => m.is_completed).length;
        const progress = (completedCount / roadMilestones.length) * 100;

        await get().updateRoad(milestone.road_id, { progress });
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to complete milestone' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadBadges: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (userBadgesError) throw userBadgesError;

      set({
        badges: badges || [],
        userBadges: userBadges || []
      });
    } catch (error) {
      console.error('Error loading badges:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load badges' });
    } finally {
      set({ isLoading: false });
    }
  },

  awardBadge: async (badgeId) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_badges')
        .insert([{
          user_id: user.id,
          badge_id: badgeId,
          earned_at: new Date().toISOString()
        }])
        .select('*, badge:badges(*)')
        .single();

      if (error) throw error;

      set(state => ({
        userBadges: [...state.userBadges, data]
      }));
    } catch (error) {
      console.error('Error awarding badge:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to award badge' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRoad: (roadId) => {
    set({ selectedRoad: roadId });
  }
}));