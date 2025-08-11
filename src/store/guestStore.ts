import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface GuestState {
  isGuest: boolean;
  guestStartTime: number | null;
  taskCount: number;
  maxTasks: number;
  returnPath: string | null;
  guestId: string | null;
  
  // Actions
  startGuestSession: () => void;
  endGuestSession: () => void;
  incrementTaskCount: () => boolean;
  shouldPromptSignup: () => boolean;
  getRemainingTasks: () => number;
  setReturnPath: (path: string) => void;
  getReturnPath: () => string | null;
  clearReturnPath: () => void;
  getGuestId: () => string;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set, get) => ({
      isGuest: false,
      guestStartTime: null,
      taskCount: 0,
      maxTasks: 3,
      returnPath: null,
      guestId: null,

      startGuestSession: () => {
        const guestId = crypto.randomUUID();
        set({
          isGuest: true,
          guestStartTime: Date.now(),
          taskCount: 0,
          guestId
        });
        
        // Set guest context in Supabase
        supabase.rpc('set_guest_context', { guest_id: guestId });
      },

      endGuestSession: () => {
        set({
          isGuest: false,
          guestStartTime: null,
          taskCount: 0,
          guestId: null
        });
      },

      incrementTaskCount: () => {
        const { taskCount, maxTasks } = get();
        if (taskCount >= maxTasks) {
          return false;
        }
        set({ taskCount: taskCount + 1 });
        return true;
      },

      shouldPromptSignup: () => {
        const { taskCount, maxTasks, guestStartTime } = get();
        if (!guestStartTime) return false;

        return taskCount >= maxTasks || 
               (Date.now() - guestStartTime) > 30 * 60 * 1000;
      },

      getRemainingTasks: () => {
        const { taskCount, maxTasks } = get();
        return Math.max(0, maxTasks - taskCount);
      },

      setReturnPath: (path: string) => {
        set({ returnPath: path });
      },

      getReturnPath: () => {
        return get().returnPath;
      },

      clearReturnPath: () => {
        set({ returnPath: null });
      },

      getGuestId: () => {
        return get().guestId || crypto.randomUUID();
      }
    }),
    {
      name: 'guest-storage',
      partialize: (state) => ({
        isGuest: state.isGuest,
        guestStartTime: state.guestStartTime,
        taskCount: state.taskCount,
        returnPath: state.returnPath,
        guestId: state.guestId
      })
    }
  )
);