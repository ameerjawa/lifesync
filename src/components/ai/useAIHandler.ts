import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAIAssistant } from './AIAssistantProvider';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useToastStore } from '../../store/toastStore';
import { processUserInput, executeActions } from '../../lib/ai';

export function useAIHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
     isOpen,
  setIsOpen,
    messages,
    setMessages,
    isProcessing,
    setIsProcessing,
    activeView,
    setActiveView
  } = useAIAssistant();

  const { checkFeatureAccess } = useSubscriptionStore();
  const { showError } = useToastStore();

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('tasks')) return 'tasks';
    if (path.includes('health')) return 'health';
    if (path.includes('finance')) return 'finance';
    if (path.includes('goals')) return 'goals';
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('settings')) return 'settings';
    return 'dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector('input')?.value;
    if (!input?.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      if (!checkFeatureAccess('ai_insights')) {
        throw new Error('AI assistant requires a premium subscription');
      }

      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: input }]);

      // Process input and get response with actions
      const { response, actions } = await processUserInput(input, {
        section: getCurrentSection(),
        navigate
      });

      // Execute actions with navigate function
      await executeActions(actions, navigate);

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        action: actions.length > 0 ? { type: 'actions_executed', data: actions } : undefined
      }]);

      // Switch view if needed
      if (actions.some(a => a.type === 'analyze')) {
        setActiveView('insights');
      } else if (actions.some(a => a.type === 'schedule')) {
        setActiveView('schedule');
      }

    } catch (error) {
      console.error('Error processing message:', error);
      showError(error instanceof Error ? error.message : 'An error occurred');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error 
          ? `I encountered an error: ${error.message}. How else can I help you?`
          : 'Sorry, I encountered an error. How else can I help you?'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    isProcessing,
    activeView,
    setActiveView,
    handleSubmit
  };
}