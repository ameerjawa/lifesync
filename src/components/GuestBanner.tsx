import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useGuestStore } from '../store/guestStore';
import { useNavigate } from 'react-router-dom';

export function GuestBanner() {
  const navigate = useNavigate();
  const getRemainingTasks = useGuestStore(state => state.getRemainingTasks);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary-600 text-white px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Demo Mode</span>
          <span className="text-white/70">— exploring a pre-populated NEXT workspace</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium px-3 py-1 bg-white/15 rounded-lg hover:bg-white/25 transition-colors"
        >
          Create your own NEXT
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
