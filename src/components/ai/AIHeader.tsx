import { Bot, MessageSquare, Brain, Calendar, Settings, Minimize2 } from 'lucide-react';
import { useAIAssistant } from './AIAssistantProvider';
import type { AIView } from './types';

interface ViewButton {
  view: AIView;
  icon: typeof MessageSquare;
  label: string;
}

const viewButtons: ViewButton[] = [
  { view: 'chat', icon: MessageSquare, label: 'Chat' },
  { view: 'insights', icon: Brain, label: 'Insights' },
  { view: 'schedule', icon: Calendar, label: 'Schedule' },
  { view: 'help', icon: Settings, label: 'Help' }
];

export function AIHeader() {
  const { activeView, setActiveView, setIsOpen } = useAIAssistant();
  

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center">
        <Bot className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
      </div>
      <div className="flex items-center space-x-2">
        {viewButtons.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`p-2 rounded-lg ${
              activeView === view 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={label}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <Minimize2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}