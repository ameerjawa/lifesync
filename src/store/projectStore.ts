import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useToastStore } from './toastStore';
import type { Project, ProjectMember, ProjectTask, ProjectResource } from '../lib/types';

interface ProjectState {
  projects: Project[];
  selectedProject: string | null;
  members: Record<string, ProjectMember[]>;
  tasks: Record<string, ProjectTask[]>;
  resources: Record<string, ProjectResource[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  loadProjectMembers: (projectId: string) => Promise<void>;
  addProjectMember: (member: Omit<ProjectMember, 'id' | 'joined_at'>) => Promise<void>;
  updateProjectMember: (id: string, updates: Partial<ProjectMember>) => Promise<void>;
  removeProjectMember: (id: string) => Promise<void>;
  
  loadProjectTasks: (projectId: string) => Promise<void>;
  addProjectTask: (task: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProjectTask: (id: string, updates: Partial<ProjectTask>) => Promise<void>;
  deleteProjectTask: (id: string) => Promise<void>;
  
  loadProjectResources: (projectId: string) => Promise<void>;
  addProjectResource: (resource: Omit<ProjectResource, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProjectResource: (id: string, updates: Partial<ProjectResource>) => Promise<void>;
  deleteProjectResource: (id: string) => Promise<void>;
  
  setSelectedProject: (projectId: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  members: {},
  tasks: {},
  resources: {},
  isLoading: false,
  error: null,

  loadProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          members:project_members(
            *,
            profile:profiles(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [] });
    } catch (error) {
      console.error('Error loading projects:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load projects' });
    } finally {
      set({ isLoading: false });
    }
  },

  addProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Add creator as project owner
      await supabase
        .from('project_members')
        .insert([{
          project_id: data.id,
          user_id: user.id,
          role: 'owner',
          allocation_percentage: 100
        }]);

      set(state => ({
        projects: [data, ...state.projects]
      }));

      useToastStore.getState().showSuccess('Project created successfully');
    } catch (error) {
      console.error('Error adding project:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add project' });
      useToastStore.getState().showError('Failed to create project');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: state.projects.map(project => 
          project.id === id ? { ...project, ...data } : project
        )
      }));

      useToastStore.getState().showSuccess('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update project' });
      useToastStore.getState().showError('Failed to update project');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
        selectedProject: state.selectedProject === id ? null : state.selectedProject
      }));

      useToastStore.getState().showSuccess('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete project' });
      useToastStore.getState().showError('Failed to delete project');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadProjectMembers: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('project_id', projectId)
        .order('joined_at', { ascending: true });

      if (error) throw error;

      set(state => ({
        members: {
          ...state.members,
          [projectId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading project members:', error);
      throw error;
    }
  },

  addProjectMember: async (member) => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .insert([member])
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();

      if (error) throw error;

      set(state => ({
        members: {
          ...state.members,
          [member.project_id]: [
            ...(state.members[member.project_id] || []),
            data
          ]
        }
      }));
    } catch (error) {
      console.error('Error adding project member:', error);
      throw error;
    }
  },

  updateProjectMember: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();

      if (error) throw error;

      set(state => {
        const newMembers = { ...state.members };
        for (const projectId in newMembers) {
          newMembers[projectId] = newMembers[projectId].map(member =>
            member.id === id ? { ...member, ...data } : member
          );
        }
        return { members: newMembers };
      });
    } catch (error) {
      console.error('Error updating project member:', error);
      throw error;
    }
  },

  removeProjectMember: async (id) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newMembers = { ...state.members };
        for (const projectId in newMembers) {
          newMembers[projectId] = newMembers[projectId].filter(member => member.id !== id);
        }
        return { members: newMembers };
      });
    } catch (error) {
      console.error('Error removing project member:', error);
      throw error;
    }
  },

  loadProjectTasks: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          *,
          assignee:profiles(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set(state => ({
        tasks: {
          ...state.tasks,
          [projectId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading project tasks:', error);
      throw error;
    }
  },

  addProjectTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert([task])
        .select(`
          *,
          assignee:profiles(*)
        `)
        .single();

      if (error) throw error;

      set(state => ({
        tasks: {
          ...state.tasks,
          [task.project_id]: [
            data,
            ...(state.tasks[task.project_id] || [])
          ]
        }
      }));
    } catch (error) {
      console.error('Error adding project task:', error);
      throw error;
    }
  },

  updateProjectTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          assignee:profiles(*)
        `)
        .single();

      if (error) throw error;

      set(state => {
        const newTasks = { ...state.tasks };
        for (const projectId in newTasks) {
          newTasks[projectId] = newTasks[projectId].map(task =>
            task.id === id ? { ...task, ...data } : task
          );
        }
        return { tasks: newTasks };
      });
    } catch (error) {
      console.error('Error updating project task:', error);
      throw error;
    }
  },

  deleteProjectTask: async (id) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newTasks = { ...state.tasks };
        for (const projectId in newTasks) {
          newTasks[projectId] = newTasks[projectId].filter(task => task.id !== id);
        }
        return { tasks: newTasks };
      });
    } catch (error) {
      console.error('Error deleting project task:', error);
      throw error;
    }
  },

  loadProjectResources: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set(state => ({
        resources: {
          ...state.resources,
          [projectId]: data || []
        }
      }));
    } catch (error) {
      console.error('Error loading project resources:', error);
      throw error;
    }
  },

  addProjectResource: async (resource) => {
    try {
      const { data, error } = await supabase
        .from('project_resources')
        .insert([resource])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        resources: {
          ...state.resources,
          [resource.project_id]: [
            data,
            ...(state.resources[resource.project_id] || [])
          ]
        }
      }));
    } catch (error) {
      console.error('Error adding project resource:', error);
      throw error;
    }
  },

  updateProjectResource: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('project_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => {
        const newResources = { ...state.resources };
        for (const projectId in newResources) {
          newResources[projectId] = newResources[projectId].map(resource =>
            resource.id === id ? { ...resource, ...data } : resource
          );
        }
        return { resources: newResources };
      });
    } catch (error) {
      console.error('Error updating project resource:', error);
      throw error;
    }
  },

  deleteProjectResource: async (id) => {
    try {
      const { error } = await supabase
        .from('project_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const newResources = { ...state.resources };
        for (const projectId in newResources) {
          newResources[projectId] = newResources[projectId].filter(resource => resource.id !== id);
        }
        return { resources: newResources };
      });
    } catch (error) {
      console.error('Error deleting project resource:', error);
      throw error;
    }
  },

  setSelectedProject: (projectId) => {
    set({ selectedProject: projectId });
  }
}));