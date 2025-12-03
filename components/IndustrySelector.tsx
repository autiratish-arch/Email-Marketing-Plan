import React from 'react';
import { INDUSTRIES } from '../constants';
import { Industry } from '../types';
import { Briefcase, ChevronRight } from 'lucide-react';

interface IndustrySelectorProps {
  selectedIndustry: Industry;
  onSelect: (industry: Industry) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ selectedIndustry, onSelect }) => {
  return (
    <div className="w-full lg:w-64 bg-white lg:border-r border-gray-200 lg:h-[calc(100vh-64px)] overflow-y-auto shrink-0">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Industry</h2>
      </div>
      <div className="p-2 space-y-1">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            onClick={() => onSelect(ind)}
            className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              selectedIndustry === ind
                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase className={`h-4 w-4 ${selectedIndustry === ind ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="truncate text-left">{ind}</span>
            </div>
            {selectedIndustry === ind && <ChevronRight className="h-4 w-4 text-blue-500" />}
          </button>
        ))}
      </div>
    </div>
  );
};
