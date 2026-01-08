import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Map, Flag, Compass } from 'lucide-react';
import type { Road, Milestone, Badge } from '../../lib/types';

interface RoadMapProps {
  road: Road;
  milestones: Milestone[];
  badges: Badge[];
  onMilestoneClick: (milestone: Milestone) => void;
  onBadgeEarned: (badge: Badge) => void;
  onClick: () => void;
}

export function RoadMap({
  road,
  milestones,
  badges,
  onMilestoneClick,
  onBadgeEarned,
  onClick
}: RoadMapProps) {
  const getThemeStyles = () => {
    switch (road.theme) {
      case 'futuristic':
        return {
          road: 'bg-gradient-to-r from-primary-600 to-primary-600',
          milestone: 'bg-primary-100 text-primary-600',
          completed: 'bg-primary-600 text-white'
        };
      case 'nature':
        return {
          road: 'bg-gradient-to-r from-green-600 to-emerald-600',
          milestone: 'bg-green-100 text-green-600',
          completed: 'bg-green-600 text-white'
        };
      default:
        return {
          road: 'bg-gradient-to-r from-gray-600 to-gray-800',
          milestone: 'bg-gray-100 text-gray-600',
          completed: 'bg-gray-600 text-white'
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl bg-white p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{road.title}</h2>
          <p className="text-gray-600">{road.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary-100 p-2">
            <Map className="h-6 w-6 text-primary-600" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Progress</p>
            <p className="text-2xl font-bold text-primary-600">{Math.round(road.progress)}%</p>
          </div>
        </div>
      </div>

      {/* Road Path */}
      <div className="relative py-12">
        <div className={`absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 ${themeStyles.road}`} />
        
        <div className="relative flex justify-between">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              onClick={(e) => {
                e.stopPropagation();
                onMilestoneClick(milestone);
              }}
            >
              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
                  milestone.is_completed
                    ? themeStyles.completed
                    : themeStyles.milestone
                }`}
              >
                {milestone.is_completed ? (
                  <Trophy className="h-6 w-6" />
                ) : (
                  <Compass className="h-6 w-6" />
                )}
              </div>

              <div className="absolute -bottom-16 left-1/2 w-32 -translate-x-1/2 text-center">
                <p className="font-medium text-gray-900">{milestone.title}</p>
                <p className="text-sm text-gray-500">{milestone.xp_reward} XP</p>
              </div>

              {milestone.is_completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 rounded-full bg-green-500 p-1"
                >
                  <Star className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mt-12">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Earned Badges</h3>
        <div className="flex flex-wrap gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2"
            >
              <img
                src={badge.icon_url}
                alt={badge.name}
                className="h-8 w-8"
              />
              <div>
                <p className="font-medium text-gray-900">{badge.name}</p>
                <p className="text-sm text-gray-500">{badge.xp_value} XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}