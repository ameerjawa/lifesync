import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Mail, UserPlus, Crown, Shield } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { BusinessTeamForm } from './BusinessTeamForm';

export function BusinessTeam() {
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  const {
    teamMembers,
    loadTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    isLoading
  } = useBusinessStore();

  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-primary-100 text-primary-800';
      case 'admin':
        return 'bg-primary-100 text-primary-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      case 'contractor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'admin':
        return Shield;
      default:
        return Users;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>
        <button
          onClick={() => setIsAddingMember(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Team Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-semibold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Members</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teamMembers.filter(m => m.role !== 'contractor').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-3">
              <Crown className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Hourly Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${teamMembers
                  .filter(m => m.hourly_rate)
                  .reduce((sum, m) => sum + (m.hourly_rate || 0), 0) / 
                  Math.max(teamMembers.filter(m => m.hourly_rate).length, 1) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => {
          const RoleIcon = getRoleIcon(member.role);
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {member.profile?.avatar_url ? (
                      <img
                        src={member.profile.avatar_url}
                        alt={member.profile.full_name || 'Team member'}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <Users className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {member.profile?.full_name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-600">{member.profile?.email}</p>
                  </div>
                </div>
                <RoleIcon className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Role</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>

                {member.hourly_rate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Hourly Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${member.hourly_rate}/hr
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Joined</span>
                  <span className="text-sm text-gray-900">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </span>
                </div>

                {member.permissions.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Permissions</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {/* TODO: Edit member */}}
                  className="flex-1 text-sm text-primary-600 hover:text-primary-500 py-2"
                >
                  Edit
                </button>
                {member.role !== 'owner' && (
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="text-sm text-red-600 hover:text-red-500 py-2 px-3"
                  >
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {teamMembers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-4">
              Invite team members to collaborate on your business
            </p>
            <button
              onClick={() => setIsAddingMember(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Team Member
            </button>
          </div>
        )}
      </div>

      {/* Team Member Form Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <BusinessTeamForm
            onSubmit={async (member) => {
              await addTeamMember(member);
              setIsAddingMember(false);
            }}
            onClose={() => setIsAddingMember(false)}
          />
        </div>
      )}
    </div>
  );
}