import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, BarChart2, Brain, Heart, Target, Wallet } from 'lucide-react';
import { useAIAssistant } from './AIAssistantProvider';
import { useToastStore } from '../../store/toastStore';
import type { Suggestion } from './types';

export function QuickSuggestions() {
  const location = useLocation();
  const { setMessages, setIsProcessing, setActiveView } = useAIAssistant();
  const { showSuccess } = useToastStore();

  const handleAction = async (action: string) => {
    setMessages(prev => [...prev, { role: 'user', content: action }]);
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showSuccess('Action started');
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'll help you ${action.toLowerCase()}. What would you like to do specifically?`
      }]);
    } catch (error) {
      console.error('Error processing action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSuggestions = (): Suggestion[] => {
    const path = location.pathname;
    
    if (path.includes('tasks')) {
      return [
        {
          text: "Create task",
          icon: Calendar,
          action: () => handleAction("Create a new task")
        },
        {
          text: "Analyze tasks",
          icon: BarChart2,
          action: () => {
            handleAction("Analyze my task performance");
            setActiveView('insights');
          }
        },
        {
          text: "Schedule",
          icon: Brain,
          action: () => {
            handleAction("Optimize my schedule");
            setActiveView('schedule');
          }
        }
      ];
    }
    
    if (path.includes('health')) {
      return [
        {
          text: "Track metric",
          icon: Heart,
          action: () => handleAction("Track a health metric")
        },
        {
          text: "Set goal",
          icon: Target,
          action: () => handleAction("Set a health goal")
        },
        {
          text: "Insights",
          icon: Brain,
          action: () => setActiveView('insights')
        }
      ];
    }
    
    if (path.includes('finance')) {
      return [
        {
          text: "Add transaction",
          icon: Wallet,
          action: () => handleAction("Add a transaction")
        },
        {
          text: "Budget",
          icon: BarChart2,
          action: () => handleAction("Analyze my budget")
        },
        {
          text: "Invest",
          icon: Brain,
          action: () => handleAction("Get investment advice")
        }
      ];
    }
    
    return [
      {
        text: "Overview",
        icon: BarChart2,
        action: () => handleAction("Show me an overview")
      },
      {
        text: "Goals",
        icon: Target,
        action: () => handleAction("Help me set goals")
      },
      {
        text: "Analytics",
        icon: Brain,
        action: () => setActiveView('insights')
      }
    ];
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">Quick Actions:</p>
      <div className="flex flex-wrap gap-2">
        {getSuggestions().map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={index}
              onClick={suggestion.action}
              className="flex items-center space-x-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm transition-all hover:shadow"
            >
              <Icon className="h-4 w-4 text-primary-600" />
              <span>{suggestion.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}