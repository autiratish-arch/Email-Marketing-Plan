import React, { useState, useRef, useEffect } from 'react';
import { EmailNode, MonthData, GeneratedContent, Industry } from '../types';
import { generateEmailContent } from '../services/geminiService';
import { IconWrapper } from './IconWrapper';
import { 
  CheckCircle2, ChevronDown, ChevronUp, Sparkles, 
  Loader2, PenLine, RefreshCw, Copy, Check, 
  Bold, Italic, Underline, List, Send, X 
} from 'lucide-react';

interface TimelineCardProps {
  node: EmailNode;
  month: MonthData;
  industry: Industry;
  savedContent: GeneratedContent | null;
  onSave: (nodeId: string, content: GeneratedContent) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ 
  node, 
  month, 
  industry, 
  savedContent, 
  onSave 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Local state for editing
  const [editForm, setEditForm] = useState<GeneratedContent>({
    subject: '',
    bodySnippet: '',
    keyPoints: [],
    emailBody: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize edit form when saved content updates
  useEffect(() => {
    if (savedContent) {
      setEditForm(savedContent);
    }
  }, [savedContent]);

  // Sync editor content with state when opening edit mode
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = editForm.emailBody || '';
    }
  }, [isEditing]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleGenerate = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isExpanded) setIsExpanded(true);
    
    setLoading(true);
    setError(null);
    try {
      const result = await generateEmailContent(
        industry,
        node.title,
        node.type,
        month.theme,
        node.day
      );
      // Automatically save to parent state
      onSave(node.id, result); 
      setEditForm(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualDraft = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isExpanded) setIsExpanded(true);

    const emptyDraft: GeneratedContent = {
      subject: "",
      bodySnippet: "Manual Draft",
      keyPoints: ["User generated content"],
      emailBody: "Dear [First Name],<br/><br/>Start writing your email here...",
      generatedAt: Date.now()
    };
    setEditForm(emptyDraft);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(node.id, { ...editForm, generatedAt: Date.now() });
      setIsEditing(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleCancelEdit = () => {
    if (savedContent) {
      setEditForm(savedContent);
    }
    setIsEditing(false);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditForm(prev => ({ ...prev, emailBody: editorRef.current?.innerHTML || '' }));
    }
  };

  const execFormat = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
  };

  const copyToClipboard = () => {
    if (!savedContent) return;
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = savedContent.emailBody;
    const bodyText = tempDiv.textContent || tempDiv.innerText || "";
    const fullText = `Subject: ${savedContent.subject}\n\n${bodyText}`;
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = !!savedContent;

  return (
    <div className={`
      relative flex flex-col rounded-xl border transition-all duration-300 bg-white
      ${isExpanded ? 'shadow-lg ring-1 ring-blue-500/20 border-blue-500' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
    `}>
      {/* --- Card Header (Click to Expand) --- */}
      <div 
        onClick={toggleExpand}
        className="flex items-center p-4 cursor-pointer select-none"
      >
        {/* Connecting Dot */}
        <div className={`absolute -left-[33px] top-[28px] w-4 h-4 rounded-full border-2 z-10 transition-colors duration-300 ${
          isExpanded 
            ? 'bg-blue-600 border-white ring-2 ring-blue-600' 
            : hasContent
              ? 'bg-green-500 border-white ring-2 ring-green-100'
              : 'bg-gray-100 border-gray-300'
        }`} />
        <div className={`absolute -left-[33px] top-[28px] w-8 h-0.5 bg-gray-200 ${isExpanded ? 'bg-blue-400' : ''}`} />

        <div className={`flex-shrink-0 p-2 rounded-lg mr-4 transition-colors ${
          isExpanded 
            ? 'bg-blue-100 text-blue-700' 
            : hasContent
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-50 text-gray-500'
        }`}>
          {hasContent ? <CheckCircle2 className="w-5 h-5" /> : <IconWrapper type={node.type} className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold ${isExpanded ? 'text-blue-700' : 'text-gray-900'}`}>
              {node.title}
            </h4>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              hasContent 
                ? 'bg-green-50 text-green-700 ring-green-600/20' 
                : 'bg-gray-50 text-gray-600 ring-gray-500/10'
            }`}>
              Day {node.day}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {hasContent && !isExpanded ? `Subject: ${savedContent.subject}` : node.description}
          </p>
        </div>

        <div className="ml-2 text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* --- Expanded Content Area --- */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in border-t border-gray-100">
          
          {/* Metadata / Focus */}
          <div className="py-3 mb-4 border-b border-gray-100">
             <p className="text-xs text-gray-500 leading-relaxed">
               <span className="font-semibold text-blue-600 uppercase tracking-wide">Focus: </span>
               {node.description}
             </p>
          </div>

          {/* Loading State */}
          {loading && (
             <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Generating tailored content for {industry}...</p>
             </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-4 text-sm">
              <p>Error: {error}</p>
              <button onClick={(e) => handleGenerate(e)} className="underline font-semibold mt-1">Try Again</button>
            </div>
          )}

          {/* Empty State (No Content) */}
          {!hasContent && !loading && !isEditing && (
             <div className="text-center py-8 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-gray-900 font-medium text-sm">No Content Yet</h3>
                <p className="text-xs text-gray-500 mb-4">Generate an AI draft or write your own.</p>
                <div className="flex gap-2 justify-center">
                   <button 
                      onClick={(e) => handleGenerate(e)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 shadow-sm text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                   >
                      <Sparkles className="w-3 h-3" />
                      Generate Draft
                   </button>
                   <button 
                      onClick={(e) => handleManualDraft(e)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 shadow-sm text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                   >
                      <PenLine className="w-3 h-3" />
                      Write Manually
                   </button>
                </div>
             </div>
          )}

          {/* Display Mode (Saved Content) */}
          {hasContent && !loading && !isEditing && (
            <div className="relative group/content">
              {/* Header for Email Body */}
              <div className="flex items-center justify-between mb-2">
                 <h5 className="text-sm font-bold text-blue-800">Full Email Draft for {industry}:</h5>
                 <div className="flex gap-2 opacity-100 transition-opacity">
                    <button 
                      onClick={copyToClipboard}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Copy to Clipboard"
                    >
                       {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit Email"
                    >
                       <PenLine className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {/* Read-Only View */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 shadow-inner">
                 <div className="mb-4 pb-4 border-b border-gray-200 border-dashed">
                    <span className="font-semibold text-gray-900">Subject: </span>
                    {savedContent.subject}
                 </div>
                 <div 
                   className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2"
                   dangerouslySetInnerHTML={{ __html: savedContent.emailBody }} 
                 />
              </div>

              <div className="mt-4 flex justify-end">
                  <button 
                     onClick={(e) => handleGenerate(e)}
                     className="text-xs text-gray-400 hover:text-blue-600 underline flex items-center gap-1"
                  >
                     <RefreshCw className="w-3 h-3" />
                     Regenerate
                  </button>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="animate-fade-in bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
               <div className="px-4 py-3 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-700 uppercase">Editing Email</span>
                  <button onClick={handleCancelEdit} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Subject Line</label>
                    <input 
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="w-full text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                      placeholder="Enter subject line..."
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-2 border-b border-gray-100 pb-2">
                       <button onClick={() => execFormat('bold')} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Bold className="w-3.5 h-3.5" /></button>
                       <button onClick={() => execFormat('italic')} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Italic className="w-3.5 h-3.5" /></button>
                       <button onClick={() => execFormat('underline')} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Underline className="w-3.5 h-3.5" /></button>
                       <button onClick={() => execFormat('insertUnorderedList')} className="p-1 hover:bg-gray-100 rounded text-gray-600"><List className="w-3.5 h-3.5" /></button>
                    </div>
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorInput}
                      className="w-full min-h-[200px] text-sm text-gray-700 outline-none p-2 border border-gray-200 rounded-md"
                      data-placeholder="Write your email body..."
                    />
                  </div>
               </div>

               <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  <button 
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5"
                  >
                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    Save Changes
                  </button>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};