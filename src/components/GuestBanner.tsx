import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useGuestStore } from '../store/guestStore';

export function GuestBanner() {
  const guestStartTime = useGuestStore(state => state.guestStartTime);
  const getRemainingTasks = useGuestStore(state => state.getRemainingTasks);

  const getRemainingTime = () => {
    if (!guestStartTime) return '0 minutes';
    const elapsed = Date.now() - guestStartTime;
    const remaining = Math.max(0, 30 * 60 * 1000 - elapsed);
    const minutes = Math.ceil(remaining / (60 * 1000));
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        <span>
          Guest session: {getRemainingTasks()} tasks remaining • {getRemainingTime()} left
        </span>
      </div>
    </motion.div>
  );
}