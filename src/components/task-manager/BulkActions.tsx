import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Copy, X } from 'lucide-react';

interface BulkActionsProps {
  selectedTasks: string[];
  onDelete: (ids: string[]) => Promise<void>;
  onDuplicate: (ids: string[]) => Promise<void>;
  onClear: () => void;
}

export function BulkActions({
  selectedTasks,
  onDelete,
  onDuplicate,
  onClear,
}: BulkActionsProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDuplicating, setIsDuplicating] = React.useState(false);

  if (selectedTasks.length === 0) return null;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the selected tasks?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(selectedTasks);
      onClear();
    } catch (error) {
      console.error('Error deleting tasks:', error);
      alert('Failed to delete tasks. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      await onDuplicate(selectedTasks);
      onClear();
    } catch (error) {
      console.error('Error duplicating tasks:', error);
      alert('Failed to duplicate tasks. Please try again.');
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="flex items-center space-x-2 rounded-lg bg-white p-4 shadow-lg">
        <span className="text-sm font-medium text-gray-600">
          {selectedTasks.length} tasks selected
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={handleDuplicate}
          disabled={isDuplicating}
          className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDuplicating ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={onClear}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}