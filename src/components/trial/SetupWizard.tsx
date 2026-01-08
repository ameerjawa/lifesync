import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Wallet, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTrialStore, useTaskStore, useFinanceStore, useHealthStore } from '../../store';

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { setupProgress, updateSetupProgress } = useTrialStore();
  const { addTask } = useTaskStore();
  const { addBudget } = useFinanceStore();
  const { addHealthGoal } = useHealthStore();

  const handleTaskCreation = async (taskData: any) => {
    try {
      await addTask(taskData);
      updateSetupProgress('taskCreated');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleBudgetCreation = async (budgetData: any) => {
    try {
      await addBudget(budgetData);
      updateSetupProgress('budgetCreated');
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleHealthGoalCreation = async (goalData: any) => {
    try {
      await addHealthGoal(goalData);
      updateSetupProgress('healthGoalCreated');
    } catch (error) {
      console.error('Error creating health goal:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm font-medium text-indigo-600">{setupProgress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${setupProgress}%` }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1: Task Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: currentStep === 1 ? 1 : 0.5, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Create Your First Task</h3>
              {setupProgress >= 33 && (
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </div>
            {currentStep === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="What would you like to accomplish?"
                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleTaskCreation({ title: 'Sample Task' })}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Task
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Step 2: Budget Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: currentStep === 2 ? 1 : 0.5, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Set Your Budget</h3>
              {setupProgress >= 66 && (
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </div>
            {currentStep === 2 && (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Monthly budget amount"
                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleBudgetCreation({ amount: 1000 })}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Set Budget
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Step 3: Health Goal Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: currentStep === 3 ? 1 : 0.5, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Set a Health Goal</h3>
              {setupProgress >= 100 && (
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </div>
            {currentStep === 3 && (
              <div className="space-y-4">
                <select className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="">Select a goal type</option>
                  <option value="weight">Weight Goal</option>
                  <option value="steps">Daily Steps</option>
                  <option value="sleep">Sleep Hours</option>
                </select>
                <button
                  onClick={() => handleHealthGoalCreation({ type: 'weight', target: 70 })}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Set Health Goal
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Final Step - AI Plan Generation */}
        {setupProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white"
          >
            <h3 className="text-xl font-semibold mb-4">🎉 Setup Complete!</h3>
            <p className="mb-4">Ready to generate your personalized 7-day plan?</p>
            <button className="w-full bg-white text-indigo-600 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 transition-colors">
              Generate My Plan
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}