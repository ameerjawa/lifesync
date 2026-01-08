import React from 'react';
import { motion } from 'framer-motion';
import { Users, Edit, Trash2 } from 'lucide-react';
import type { User } from './types';

interface UserListProps {
  users: User[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => Promise<void>;
  onRoleChange: (userId: string, role: 'user' | 'admin') => Promise<void>;
}

export function UserList({ users, onEdit, onDelete, onRoleChange }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <Users className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={user.role}
                onChange={(e) => onRoleChange(user.id, e.target.value as 'user' | 'admin')}
                className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => onEdit(user.id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding new users to your application.
          </p>
        </div>
      )}
    </div>
  );
}