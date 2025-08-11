import React, { createContext, useContext, useState } from 'react';
import type { Message, AIView } from './types';

interface AIAssistantContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  activeView: AIView;
  setActiveView: (view: AIView) => void;
  analysisData: any;
  setAnalysisData: (data: any) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeView, setActiveView] = useState<AIView>('chat');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        setMessages,
        activeView,
        setActiveView,
        analysisData,
        setAnalysisData,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}