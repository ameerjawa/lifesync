import { supabase } from '../../lib/supabase';
import type { TaskState } from './types';

export const createCommentActions = (set: any, get: () => TaskState) => ({
  loadComments: async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set(state => ({
        comments: {
          ...state.comments,
          [taskId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading comments:', error);
      throw error;
    }
  },

  addComment: async (taskId: string, content: string, parentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('task_comments')
        .insert([{
          task_id: taskId,
          user_id: user.id,
          content,
          parent_id: parentId
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        comments: {
          ...state.comments,
          [taskId]: [...(state.comments[taskId] || []), data]
        }
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  updateComment: async (id: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .update({ content })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => {
        const newComments = { ...state.comments };
        for (const taskId in newComments) {
          newComments[taskId] = newComments[taskId].map(comment =>
            comment.id === id ? { ...comment, content } : comment
          );
        }
        return { comments: newComments };
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  deleteComment: async (id: string) => {
    try {
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newComments = { ...state.comments };
        for (const taskId in newComments) {
          newComments[taskId] = newComments[taskId].filter(comment => comment.id !== id);
        }
        return { comments: newComments };
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
});