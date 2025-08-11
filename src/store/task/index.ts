import { create } from 'zustand';
import { createTaskActions } from './taskActions';
import { createTemplateActions } from './templateActions';
import { createRecurringActions } from './recurringActions';
import { createCommentActions } from './commentActions';
import { createAttachmentActions } from './attachmentActions';
import { createViewActions } from './viewActions';
import { createFilterActions } from './filterActions';
import { createAIActions } from './aiActions';
import type { TaskState } from './types';

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  templates: [],
  recurringTasks: [],
  comments: {},
  attachments: {},
  labels: [],
  taskHistory: {},
  filters: {},
  selectedTasks: [],
  viewMode: 'board',
  groupBy: 'status',
  sortBy: 'dueDate',
  sortDirection: 'asc',
  undoStack: [],
  redoStack: [],
  isLoading: false,
  error: null,
};

export const useTaskStore = create<TaskState>((set, get) => ({
  ...initialState,
  ...createTaskActions(set, get),
  ...createTemplateActions(set, get),
  ...createRecurringActions(set, get),
  ...createCommentActions(set, get),
  ...createAttachmentActions(set, get),
  ...createViewActions(set, get),
  ...createFilterActions(set, get),
  ...createAIActions(set, get),
}));