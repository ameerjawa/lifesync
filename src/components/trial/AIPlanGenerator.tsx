import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Calendar, Target, Loader2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useFinanceStore } from '../../store/financeStore';
import { useHealthStore } from '../../store/healthStore';

export function AIPlanGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { addTask } = useTaskStore();
  const { addBudget } = useFinanceStore();
  const { addHealthGoal } = useHealthStore();

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI plan generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create tasks for the week
      const weeklyTasks = [
        { title: 'Review Weekly Goals', priority: 'high', due_date: getDateOffset(1) },
        { title: 'Financial Planning Session', priority: 'medium', due_date: getDateOffset(2) },
        { title: 'Workout Session', priority: 'high', due_date: getDateOffset(3) },
        { title: 'Budget Review', priority: 'medium', due_date: getDateOffset(4) },
        { title: 'Progress Assessment', priority: 'low', due_date: getDateOffset(7) }
      ];

      // Add tasks
      for (const task of weeklyTasks) {
        await addTask(task);
      }

      // Add budget targets
      await addBudget({
        period: 'monthly',
        amount: 2000,
        start_date: new Date().toISOString()
      });

      // Add health goals
      await addHealthGoal({
        metric_type: 'steps',
        target_value: 10000,
        start_date: new Date().toISOString(),
        end_date: getDateOffset(30)
      });

      setIsComplete(true);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDateOffset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Brain className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Your Personalized Action Plan
            </h2>
            <p className="text-center text-white/80">
              Let AI analyze your goals and create a tailored 7-day plan for success
            </p>
          </div>

          <div className="p-6">
            {!isGenerating && !isComplete ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-indigo-600" />
                    <span>7-day task schedule optimized for your goals</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Target className="h-5 w-5 mr-3 text-indigo-600" />
                    <span>Personalized milestones and checkpoints</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Sparkles className="h-5 w-5 mr-3 text-indigo-600" />
                    <span>AI-powered recommendations and insights</span>
                  </div>
                </div>

                <button
                  onClick={generatePlan}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Generate My Plan
                  <Sparkles className="ml-2 h-5 w-5" />
                </button>
              </div>
            ) : isGenerating ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600">Generating your personalized plan...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Plan is Ready!
                </h3>
                <p className="text-gray-600 mb-6">
                  We've created a personalized plan to help you achieve your goals.
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View My Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}