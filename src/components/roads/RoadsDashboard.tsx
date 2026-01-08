import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, Filter, SortAsc, SortDesc } from 'lucide-react';
import { RoadMap } from './RoadMap';
import { RoadCanvas } from './RoadCanvas';
import { RoadCreator } from './RoadCreator';
import { useRoadStore } from '../../store/roadStore';
import { useGuestStore } from '../../store/guestStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { GuestPrompt } from '../GuestPrompt';
import { UpgradePrompt } from '../trial/UpgradePrompt';
import type { Road, Milestone, Badge } from '../../lib/types';

export function RoadsDashboard() {
  const [isAddingRoad, setIsAddingRoad] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);

  const {
    roads,
    milestones,
    badges,
    userBadges,
    isLoading,
    loadRoads,
    loadMilestones,
    loadBadges,
    addRoad,
    completeMilestone,
    awardBadge
  } = useRoadStore();

  const { isGuest, setReturnPath } = useGuestStore();
  const { checkFeatureAccess } = useSubscriptionStore();

  // Load data when component mounts
  useEffect(() => {
    loadRoads();
    loadBadges();
  }, [loadRoads, loadBadges]);

  const handleCreateRoad = async (road: Omit<Road, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addRoad(road);
      setIsAddingRoad(false);
    } catch (error) {
      console.error('Error creating road:', error);
      throw error;
    }
  };

  const handleAddRoad = () => {
    if (isGuest) {
      setReturnPath('/dashboard/roads');
      setShowGuestPrompt(true);
      return;
    }

    if (!checkFeatureAccess('custom_dashboards')) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsAddingRoad(true);
  };

  const handleMilestoneClick = async (milestone: Milestone) => {
    if (!milestone.is_completed) {
      try {
        await completeMilestone(milestone.id);
      } catch (error) {
        console.error('Error completing milestone:', error);
      }
    }
  };

  const handleBadgeEarned = async (badge: Badge) => {
    try {
      await awardBadge(badge.id);
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const handleRoadClick = (road: Road) => {
    setSelectedRoad(road);
    setShowCanvas(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Your Journey</h2>
              <p className="mt-2 text-primary-100">Track your progress and unlock achievements</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCanvas(!showCanvas)}
                className="flex items-center rounded-lg bg-white/20 px-4 py-2 text-white shadow-md transition-all hover:bg-white/30"
              >
                <Map className="mr-2 h-5 w-5" />
                {showCanvas ? 'Hide Map' : 'Show Map'}
              </button>
              <button
                onClick={handleAddRoad}
                className="flex items-center rounded-lg bg-white px-4 py-2 text-primary-600 shadow-md transition-all hover:bg-primary-50"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Road
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3')] opacity-10"></div>
      </div>

      {/* Canvas View */}
      {showCanvas && selectedRoad && (
        <RoadCanvas
          road={selectedRoad}
          milestones={milestones.filter(m => m.road_id === selectedRoad.id)}
          onMilestoneClick={handleMilestoneClick}
        />
      )}

      {/* Roads Grid */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
          </div>
        ) : roads.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="mx-auto w-12 rounded-full bg-primary-100 p-3">
              <Map className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No roads yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first road to success.</p>
            <button
              onClick={handleAddRoad}
              className="mt-4 text-primary-600 hover:text-primary-500"
            >
              Create your first road
            </button>
          </div>
        ) : (
          roads.map((road) => (
            <RoadMap
              key={road.id}
              road={road}
              milestones={milestones.filter(m => m.road_id === road.id)}
              badges={badges}
              onMilestoneClick={handleMilestoneClick}
              onBadgeEarned={handleBadgeEarned}
              onClick={() => handleRoadClick(road)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {isAddingRoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <RoadCreator
            onSubmit={handleCreateRoad}
            onClose={() => setIsAddingRoad(false)}
          />
        </div>
      )}

      {showGuestPrompt && (
        <GuestPrompt
          onClose={() => setShowGuestPrompt(false)}
          message="Sign up to create and track your journey!"
        />
      )}

      {showUpgradePrompt && (
        <UpgradePrompt
          onClose={() => setShowUpgradePrompt(false)}
          feature="Road Maps"
        />
      )}
    </div>
  );
}