import React, { useState } from 'react';
import { Header } from './components/Header';
import { IndustrySelector } from './components/IndustrySelector';
import { Timeline } from './components/Timeline';
import { Industry, GeneratedContent } from './types';
import { INDUSTRIES } from './constants';

const App: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(INDUSTRIES[0]);
  
  // State to store saved emails. Key format: "Industry-NodeId"
  const [savedEmails, setSavedEmails] = useState<Record<string, GeneratedContent>>({});

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
  };

  const handleSaveEmail = (nodeId: string, content: GeneratedContent) => {
    const key = `${selectedIndustry}-${nodeId}`;
    setSavedEmails(prev => ({
      ...prev,
      [key]: content
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Industry Selection */}
        <div className="hidden lg:block">
          <IndustrySelector 
            selectedIndustry={selectedIndustry} 
            onSelect={handleIndustrySelect} 
          />
        </div>

        {/* Center - Flow Visualization */}
        <div className="flex-1 flex flex-col relative min-w-0">
          {/* Mobile Industry Dropdown */}
          <div className="lg:hidden p-4 border-b border-gray-200 bg-white">
            <label className="text-xs font-semibold text-gray-500 uppercase">Industry</label>
            <select 
              value={selectedIndustry} 
              onChange={(e) => handleIndustrySelect(e.target.value as Industry)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm border"
            >
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <Timeline 
            savedEmails={savedEmails}
            onSaveEmail={handleSaveEmail}
            currentIndustry={selectedIndustry}
          />
        </div>
      </main>
    </div>
  );
};

export default App;