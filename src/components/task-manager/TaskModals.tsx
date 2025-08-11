import React from 'react';
import { TaskForm } from './TaskForm';
import { TaskTemplateForm } from './TaskTemplateForm';
import { RecurringTaskForm } from './RecurringTaskForm';
import { GuestPrompt } from '../GuestPrompt';
import { UpgradePrompt } from '../trial/UpgradePrompt';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useTaskContext } from './TaskProvider';

export function TaskModals() {
  const { user } = useAuthStore();
  const { addTemplate, addRecurringTask } = useTaskStore();
  const {
    isAddingTask,
    isAddingTemplate,
    isAddingRecurring,
    showGuestPrompt,
    showUpgradePrompt,
    setIsAddingTask,
    setIsAddingTemplate,
    setIsAddingRecurring,
    setShowGuestPrompt,
    setShowUpgradePrompt,
    handleAddTask
  } = useTaskContext();

  return (
    <>
      {/* Task Form Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <TaskForm
            onSubmit={handleAddTask}
            onClose={() => setIsAddingTask(false)}
          />
        </div>
      )}

      {/* Template Form Modal */}
      {isAddingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <TaskTemplateForm
            onSubmit={async (template) => {
              if (!user) return;
              await addTemplate({
                ...template,
                user_id: user.id
              });
              setIsAddingTemplate(false);
            }}
            onClose={() => setIsAddingTemplate(false)}
          />
        </div>
      )}

      {/* Recurring Task Form Modal */}
      {isAddingRecurring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <RecurringTaskForm
            onSubmit={async (task, recurring) => {
              if (!user) return;
              await addRecurringTask(
                { ...task, user_id: user.id },
                recurring
              );
              setIsAddingRecurring(false);
            }}
            onClose={() => setIsAddingRecurring(false)}
          />
        </div>
      )}

      {/* Guest Prompt */}
      {showGuestPrompt && (
        <GuestPrompt
          onClose={() => setShowGuestPrompt(false)}
          message="Sign up to start managing your tasks and unlock all features!"
        />
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt
          onClose={() => setShowUpgradePrompt(false)}
          feature="Task Management"
        />
      )}
    </>
  );
}