import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useToastStore } from './toastStore';
import type {
  BusinessProfile,
  BusinessProject,
  BusinessTask,
  BusinessClient,
  BusinessInvoice,
  BusinessExpense,
  BusinessAutomation,
  BusinessTeamMember,
  BusinessAnalytics
} from '../lib/types';

interface BusinessState {
  // Data
  profile: BusinessProfile | null;
  projects: BusinessProject[];
  tasks: BusinessTask[];
  clients: BusinessClient[];
  invoices: BusinessInvoice[];
  expenses: BusinessExpense[];
  automations: BusinessAutomation[];
  teamMembers: BusinessTeamMember[];
  analytics: BusinessAnalytics | null;
  
  // UI State
  selectedProject: string | null;
  selectedClient: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadBusinessProfile: () => Promise<void>;
  createBusinessProfile: (profile: Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => Promise<void>;
  
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<BusinessProject, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<BusinessProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<BusinessTask, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<BusinessTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  loadClients: () => Promise<void>;
  addClient: (client: Omit<BusinessClient, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<BusinessClient>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  loadInvoices: () => Promise<void>;
  addInvoice: (invoice: Omit<BusinessInvoice, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<BusinessInvoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  
  loadExpenses: () => Promise<void>;
  addExpense: (expense: Omit<BusinessExpense, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<BusinessExpense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  loadAutomations: () => Promise<void>;
  addAutomation: (automation: Omit<BusinessAutomation, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAutomation: (id: string, updates: Partial<BusinessAutomation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  
  loadTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<BusinessTeamMember, 'id' | 'business_id' | 'joined_at'>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<BusinessTeamMember>) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  
  generateAnalytics: () => Promise<void>;
  
  setSelectedProject: (projectId: string | null) => void;
  setSelectedClient: (clientId: string | null) => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  // Initial state
  profile: null,
  projects: [],
  tasks: [],
  clients: [],
  invoices: [],
  expenses: [],
  automations: [],
  teamMembers: [],
  analytics: null,
  selectedProject: null,
  selectedClient: null,
  isLoading: false,
  error: null,

  // Business Profile Actions
  loadBusinessProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      set({ profile: data || null });
    } catch (error) {
      console.error('Error loading business profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load business profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  createBusinessProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .insert([{ ...profileData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Add user as business owner
      await supabase
        .from('business_team_members')
        .insert([{
          business_id: data.id,
          user_id: user.id,
          role: 'owner',
          permissions: ['all']
        }]);

      set({ profile: data });
      useToastStore.getState().showSuccess('Business profile created successfully');
    } catch (error) {
      console.error('Error creating business profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to create business profile' });
      useToastStore.getState().showError('Failed to create business profile');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBusinessProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data });
      useToastStore.getState().showSuccess('Business profile updated successfully');
    } catch (error) {
      console.error('Error updating business profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update business profile' });
      useToastStore.getState().showError('Failed to update business profile');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Project Actions
loadProjects: async () => {
  set({ isLoading: false, error: null });
  try {
    const { profile } = get();
    if (!profile) throw new Error('No business profile found');
    console.log('Profile:', profile);

    const { data, error } = await supabase
      .from('business_projects')
      .select(`*, client:business_clients(name, email)`)
      .eq('business_id', profile.id)
      .order('created_at', { ascending: false });

    console.log('Supabase response:', { data, error });

    if (error) throw error;

    // ✅ Only update projects if they actually changed
    const currentProjects = get().projects;
    const isDifferent = JSON.stringify(currentProjects) !== JSON.stringify(data || []);
    if (isDifferent) {
      set({ projects: data || [] });
    }
  } catch (err) {
    console.error('Error loading projects:', err);
    set({ error: err instanceof Error ? err.message : 'Failed to load projects' });
  } finally {
    console.log('Setting isLoading false');
    set({ isLoading: false });
  }
}

,

  addProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_projects')
        .insert([{ ...projectData, business_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ projects: [data, ...state.projects] }));
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
        .from('business_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...data } : p)
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
        .from('business_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
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

  // Task Actions
  loadTasks: async () => {
    set({ isLoading: false, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_tasks')
        .select(`
          *,
          project:business_projects(name),
          assignee:business_profiles(company_name, email)
        `)
        .eq('business_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [] });
    } catch (error) {
      console.error('Error loading tasks:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load tasks' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_tasks')
        .insert([{ ...taskData, business_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ tasks: [data, ...state.tasks] }));
      useToastStore.getState().showSuccess('Task created successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add task' });
      useToastStore.getState().showError('Failed to create task');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...data } : t)
      }));
      useToastStore.getState().showSuccess('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update task' });
      useToastStore.getState().showError('Failed to update task');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('business_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
      useToastStore.getState().showSuccess('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete task' });
      useToastStore.getState().showError('Failed to delete task');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Client Actions
  loadClients: async () => {
    set({ isLoading: false, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_clients')
        .select('*')
        .eq('business_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ clients: data || [] });
    } catch (error) {
      console.error('Error loading clients:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load clients' });
    } finally {
      set({ isLoading: false });
    }
  },

  addClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_clients')
        .insert([{ ...clientData, business_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ clients: [data, ...state.clients] }));
      useToastStore.getState().showSuccess('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add client' });
      useToastStore.getState().showError('Failed to add client');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
      }));
      useToastStore.getState().showSuccess('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update client' });
      useToastStore.getState().showError('Failed to update client');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('business_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        clients: state.clients.filter(c => c.id !== id),
        selectedClient: state.selectedClient === id ? null : state.selectedClient
      }));
      useToastStore.getState().showSuccess('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete client' });
      useToastStore.getState().showError('Failed to delete client');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Invoice Actions
  loadInvoices: async () => {
    set({ isLoading: false, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data: invoices, error: invoicesError } = await supabase
        .from('business_invoices')
        .select(`
          *,
          client:business_clients(name, email),
          project:business_projects(name)
        `)
        .eq('business_id', profile.id)
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      if (invoices && invoices.length > 0) {
        const invoiceIds = invoices.map(inv => inv.id);
        const { data: lineItems, error: lineItemsError } = await supabase
          .from('invoice_line_items')
          .select('*')
          .in('invoice_id', invoiceIds);

        if (lineItemsError) {
          console.error('Error loading line items:', lineItemsError);
        } else if (lineItems) {
          const invoicesWithLineItems = invoices.map(invoice => ({
            ...invoice,
            line_items: lineItems.filter(item => item.invoice_id === invoice.id)
          }));
          set({ invoices: invoicesWithLineItems });
          return;
        }
      }

      set({ invoices: invoices || [] });
    } catch (error) {
      console.error('Error loading invoices:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load invoices' });
    } finally {
      set({ isLoading: false });
    }
  },

addInvoice: async (invoiceData) => {
  set({ isLoading: true, error: null });
  try {
    const { profile } = get();
    if (!profile) throw new Error("No business profile found");

    const { line_items, ...invoiceFields } = invoiceData;

    // 1. Insert invoice (no line_items here)
    const { data: invoice, error: invoiceError } = await supabase
      .from("business_invoices")
      .insert([{ ...invoiceFields, business_id: profile.id }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // 2. Insert related line items if any
    if (line_items && line_items.length > 0) {
      const lineItemsToInsert = line_items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        invoice_id: invoice.id, // ✅ correct UUID foreign key
      }));

      const { error: lineItemsError } = await supabase
        .from("invoice_line_items") // ✅ correct table name
        .insert(lineItemsToInsert);

      if (lineItemsError) throw lineItemsError;
    }

    // 3. Update state with new invoice
    set((state) => ({ invoices: [invoice, ...state.invoices] }));
    useToastStore.getState().showSuccess("Invoice created successfully");

    return invoice;
  } catch (error) {
    console.error("Error adding invoice:", error);
    set({
      error: error instanceof Error ? error.message : "Failed to add invoice",
    });
    useToastStore.getState().showError("Failed to create invoice");
    throw error;
  } finally {
    set({ isLoading: false });
  }
},



  updateInvoice: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        invoices: state.invoices.map(i => i.id === id ? { ...i, ...data } : i)
      }));
      useToastStore.getState().showSuccess('Invoice updated successfully');
    } catch (error) {
      console.error('Error updating invoice:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update invoice' });
      useToastStore.getState().showError('Failed to update invoice');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInvoice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('business_invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({ invoices: state.invoices.filter(i => i.id !== id) }));
      useToastStore.getState().showSuccess('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete invoice' });
      useToastStore.getState().showError('Failed to delete invoice');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Expense Actions
  loadExpenses: async () => {
    set({ isLoading: false, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_expenses')
        .select(`
          *,
          project:business_projects(name)
        `)
        .eq('business_id', profile.id)
        .order('date', { ascending: false });

      if (error) throw error;
      set({ expenses: data || [] });
    } catch (error) {
      console.error('Error loading expenses:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load expenses' });
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_expenses')
        .insert([{ ...expenseData, business_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ expenses: [data, ...state.expenses] }));
      useToastStore.getState().showSuccess('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add expense' });
      useToastStore.getState().showError('Failed to add expense');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateExpense: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...data } : e)
      }));
      useToastStore.getState().showSuccess('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update expense' });
      useToastStore.getState().showError('Failed to update expense');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('business_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({ expenses: state.expenses.filter(e => e.id !== id) }));
      useToastStore.getState().showSuccess('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete expense' });
      useToastStore.getState().showError('Failed to delete expense');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Automation Actions
  loadAutomations: async () => {
    set({ isLoading: false, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_automations')
        .select('*')
        .eq('business_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ automations: data || [] });
    } catch (error) {
      console.error('Error loading automations:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load automations' });
    } finally {
      set({ isLoading: false });
    }
  },

  addAutomation: async (automationData) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_automations')
        .insert([{ ...automationData, business_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ automations: [data, ...state.automations] }));
      useToastStore.getState().showSuccess('Automation created successfully');
    } catch (error) {
      console.error('Error adding automation:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add automation' });
      useToastStore.getState().showError('Failed to create automation');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAutomation: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_automations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        automations: state.automations.map(a => a.id === id ? { ...a, ...data } : a)
      }));
      useToastStore.getState().showSuccess('Automation updated successfully');
    } catch (error) {
      console.error('Error updating automation:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update automation' });
      useToastStore.getState().showError('Failed to update automation');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAutomation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('business_automations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({ automations: state.automations.filter(a => a.id !== id) }));
      useToastStore.getState().showSuccess('Automation deleted successfully');
    } catch (error) {
      console.error('Error deleting automation:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete automation' });
      useToastStore.getState().showError('Failed to delete automation');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Team Member Actions
  loadTeamMembers: async () => {
    set({ isLoading: false, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_team_members')
        .select(`
          *,
          profile:business_profiles(company_name, email, logo_url)
        `)
        .eq('business_id', profile.id)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      set({ teamMembers: data || [] });
    } catch (error) {
      console.error('Error loading team members:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load team members' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTeamMember: async (memberData) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No business profile found');

      const { data, error } = await supabase
        .from('business_team_members')
        .insert([{ ...memberData, business_id: profile.id }])
        .select(`
          *,
          profile:business_profiles(company_name, email, logo_url)
        `)
        .single();

      if (error) throw error;
      set(state => ({ teamMembers: [...state.teamMembers, data] }));
      useToastStore.getState().showSuccess('Team member added successfully');
    } catch (error) {
      console.error('Error adding team member:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add team member' });
      useToastStore.getState().showError('Failed to add team member');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTeamMember: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_team_members')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profile:business_profiles(company_name, email, logo_url)
        `)
        .single();

      if (error) throw error;
      set(state => ({
        teamMembers: state.teamMembers.map(m => m.id === id ? { ...m, ...data } : m)
      }));
      useToastStore.getState().showSuccess('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update team member' });
      useToastStore.getState().showError('Failed to update team member');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeTeamMember: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('business_team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({ teamMembers: state.teamMembers.filter(m => m.id !== id) }));
      useToastStore.getState().showSuccess('Team member removed successfully');
    } catch (error) {
      console.error('Error removing team member:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to remove team member' });
      useToastStore.getState().showError('Failed to remove team member');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Analytics
  generateAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { profile, invoices, clients, projects, tasks } = get();
      if (!profile) throw new Error('No business profile found');

      // Calculate revenue metrics
      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total_amount, 0);

      const currentMonth = new Date().getMonth();
      const monthlyRevenue = invoices
        .filter(i => 
          i.status === 'paid' && 
          new Date(i.issue_date).getMonth() === currentMonth
        )
        .reduce((sum, i) => sum + i.total_amount, 0);

      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthRevenue = invoices
        .filter(i => 
          i.status === 'paid' && 
          new Date(i.issue_date).getMonth() === lastMonth
        )
        .reduce((sum, i) => sum + i.total_amount, 0);

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Calculate client metrics
      const activeClients = clients.filter(c => c.status === 'active').length;
      const newClientsThisMonth = clients.filter(c => 
        new Date(c.created_at).getMonth() === currentMonth
      ).length;

      // Calculate project metrics
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const overdueProjects = projects.filter(p => 
        p.status === 'active' && 
        p.due_date && 
        new Date(p.due_date) < new Date()
      ).length;

      // Calculate team metrics
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const totalTasks = tasks.length;
      const productivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const analytics: BusinessAnalytics = {
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
          growth: revenueGrowth
        },
        clients: {
          total: clients.length,
          active: activeClients,
          new_this_month: newClientsThisMonth
        },
        projects: {
          active: activeProjects,
          completed: completedProjects,
          overdue: overdueProjects
        },
        team: {
          productivity,
          utilization: 85, // Mock data
          satisfaction: 90 // Mock data
        }
      };

      set({ analytics });
    } catch (error) {
      console.error('Error generating analytics:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to generate analytics' });
    } finally {
      set({ isLoading: false });
    }
  },

  // UI Actions
  setSelectedProject: (projectId) => {
    set({ selectedProject: projectId });
  },

  setSelectedClient: (clientId) => {
    set({ selectedClient: clientId });
  }
}));