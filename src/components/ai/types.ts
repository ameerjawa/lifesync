import type { LucideIcon } from 'lucide-react';

export type AIView = 'chat' | 'insights' | 'schedule' | 'help';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: string;
    data?: any;
  };
}

export interface Suggestion {
  text: string;
  icon: LucideIcon;
  action: () => void;
}