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
      className="bg-primary-600 text-white px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span className="font-medium">NEXT Pro Trial</span>
          <span className="text-white/70">— {remainingDays} {remainingDays === 1 ? 'day' : 'days'} remaining</span>
        </div>
        <button
          onClick={() => navigate('/upgrade')}
          className="flex items-center text-sm font-medium px-3 py-1 bg-white/15 rounded-lg hover:bg-white/25 transition-colors"
        >
          Upgrade
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
