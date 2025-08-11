import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      // Add retry logic for failed requests
      const fetch = window.fetch;
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000; // 1 second

      return new Promise((resolve, reject) => {
        const attemptFetch = (retryCount: number) => {
          fetch(...args)
            .then(resolve)
            .catch((error) => {
              if (retryCount < MAX_RETRIES) {
                setTimeout(() => attemptFetch(retryCount + 1), RETRY_DELAY);
              } else {
                reject(error);
              }
            });
        };
        attemptFetch(0);
      });
    }
  }
});