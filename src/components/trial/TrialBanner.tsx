import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { usePermissions } from '../../lib/permissions';

export function TrialBanner() {
  const navigate = useNavigate();
  const { getRemainingTrialTime } = usePermissions();

  const remainingDays = Math.ceil(getRemainingTrialTime() / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-600 to-primary-600 text-white px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Clock className="h-5 w-5" />
          <span>
            Premium Trial: {remainingDays} {remainingDays === 1 ? 'day' : 'days'} remaining
          </span>
        </div>
        <button
          onClick={() => navigate('/upgrade')}
          className="flex items-center px-4 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
        >
          Upgrade now
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}