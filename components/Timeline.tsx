import React, { useRef, useEffect } from 'react';
import { FLOW_STRUCTURE } from '../constants';
import { GeneratedContent, Industry, EmailNode, MonthData } from '../types';
import { TimelineCard } from './TimelineCard';

interface TimelineProps {
  savedEmails: Record<string, GeneratedContent>;
  onSaveEmail: (nodeId: string, content: GeneratedContent) => void;
  currentIndustry: Industry;
  activeNodeId?: string | null;
  onNodeSelect?: (node: EmailNode, month: MonthData) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  savedEmails, 
  onSaveEmail, 
  currentIndustry 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when industry changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentIndustry]);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto relative h-[calc(100vh-64px)]" ref={scrollRef}>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Campaign Flow</h2>
          <p className="mt-2 text-sm text-gray-500">133-Day comprehensive engagement strategy</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 -z-10" />

          {FLOW_STRUCTURE.map((month) => (
            <div key={month.month} className="mb-12 relative group">
              {/* Month Marker */}
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white border-4 border-blue-50 rounded-full shadow-sm z-10 font-bold text-blue-600 text-lg">
                  M{month.month}
                </div>
                <div className="ml-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Month {month.month}</span>
                  <h3 className="text-md font-bold text-gray-900">{month.theme}</h3>
                </div>
              </div>

              {/* Email Nodes */}
              <div className="space-y-4 pl-16">
                {month.emails.map((email) => {
                  const savedKey = `${currentIndustry}-${email.id}`;
                  const savedContent = savedEmails[savedKey] || null;

                  return (
                    <TimelineCard
                      key={email.id}
                      node={email}
                      month={month}
                      industry={currentIndustry}
                      savedContent={savedContent}
                      onSave={onSaveEmail}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* End Marker */}
          <div className="flex items-center pl-6 pb-12">
             <div className="w-4 h-4 bg-gray-300 rounded-full" />
             <span className="ml-4 text-sm text-gray-400 italic">Campaign Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};