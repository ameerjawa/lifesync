import { supabase } from '../../lib/supabase';
import type { TaskState } from './types';

export const createAttachmentActions = (set: any, get: () => TaskState) => ({
  loadAttachments: async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set(state => ({
        attachments: {
          ...state.attachments,
          [taskId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading attachments:', error);
      throw error;
    }
  },

  addAttachment: async (taskId: string, file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const filePath = `${user.id}/${taskId}/${file.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('task-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { data, error } = await supabase
        .from('task_attachments')
        .insert([{
          task_id: taskId,
          user_id: user.id,
          name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        attachments: {
          ...state.attachments,
          [taskId]: [...(state.attachments[taskId] || []), data]
        }
      }));
    } catch (error) {
      console.error('Error adding attachment:', error);
      throw error;
    }
  },

  deleteAttachment: async (id: string) => {
    try {
      const { error } = await supabase
        .from('task_attachments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newAttachments = { ...state.attachments };
        for (const taskId in newAttachments) {
          newAttachments[taskId] = newAttachments[taskId].filter(attachment => attachment.id !== id);
        }
        return { attachments: newAttachments };
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  }
});