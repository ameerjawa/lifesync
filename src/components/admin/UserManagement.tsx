import React, { useState } from 'react';
import { UserList } from './UserList';
import { UserDetails } from './UserDetails';
import type { User } from './types';

interface UserManagementProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  onUpdateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function UserManagement({
  users,
  onUpdateUser,
  onUpdateUserRole,
  onDeleteUser
}: UserManagementProps) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      await onUpdateUser(userId, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await onDeleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <span className="text-sm text-gray-500">
          {users.length} {users.length === 1 ? 'user' : 'users'} total
        </span>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 bg-blue-50 text-blue-600 p-4 rounded-lg">
          Loading...
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id}>
            <UserList
              users={[user]}
              onEdit={(userId) => setExpandedUser(expandedUser === userId ? null : userId)}
              onDelete={handleDeleteUser}
              onRoleChange={onUpdateUserRole}
            />
            {expandedUser === user.id && (
              <UserDetails
                user={user}
                onUpdate={(updates) => handleUpdateUser(user.id, updates)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}