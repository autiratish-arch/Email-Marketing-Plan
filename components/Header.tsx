import React from 'react';
import { Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Softcore Solutions</h1>
              <p className="text-xs text-gray-500 font-medium">Netsuite Email Marketing Plan</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Gemini 2.5 Flash
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};