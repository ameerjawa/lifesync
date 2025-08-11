import React from 'react';

export function HelpView() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Available Commands</h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Try these commands:</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• "Create a task to [description]"</li>
          <li>• "Analyze my task performance"</li>
          <li>• "Generate an optimized schedule"</li>
          <li>• "Go to [section]"</li>
          <li>• "Show me my [health/finance/goals] analytics"</li>
          <li>• "Set a reminder for [task/event]"</li>
          <li>• "Track my [health metric]"</li>
          <li>• "Add a transaction of [amount]"</li>
        </ul>
      </div>
    </div>
  );
}