import { create } from 'zustand';
import toast from 'react-hot-toast';

interface ToastState {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

export const useToastStore = create<ToastState>(() => ({
  showSuccess: (message) => {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981',
      },
    });
  },
  showError: (message) => {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#EF4444',
      },
    });
  },
  showInfo: (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#6366F1',
        color: '#FFFFFF',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
}));