export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  created_at: string;
  avatar_url?: string;
  company?: string;
  phone?: string;
  website?: string;
  address?: string;
  timezone?: string;
  language?: string;
  notifications_enabled?: boolean;
  subscription?: {
    plan: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    current_period_start: string;
    current_period_end: string;
  };
}