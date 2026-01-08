import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function Navbar({ onSignIn, onSignUp }: NavbarProps) {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">LifeSync</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onSignIn}
              className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onSignUp}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors"
            >
              Sign up free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}