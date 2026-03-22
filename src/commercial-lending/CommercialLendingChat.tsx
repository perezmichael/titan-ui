import { useState, useRef, useEffect } from 'react';
import { Sparkles, FileText, Zap, ChevronDown, X, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Borrower {
  id: string;
  name: string;
  noteNumber: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockBorrowers: Borrower[] = [
  { id: '1', name: 'VFN Holdings Inc',          noteNumber: '20240001-001' },
  { id: '2', name: 'GH3 Cler SNU',              noteNumber: '20230045-001' },
  { id: '3', name: 'Fibernet Solutions LLC',    noteNumber: '20240078-001' },
  { id: '4', name: 'Retail Plaza Holdings',     noteNumber: '20230122-001' },
  { id: '5', name: 'Healthcare Properties Inc', noteNumber: '20240055-001' },
  { id: '6', name: 'Meridian Office Partners',  noteNumber: '20230198-001' },
];

const workflows: Workflow[] = [
  {
    id: 'deal-qa',
    name: 'Deal QA',
    description: '7-step quality assurance review of loan documentation and data extraction',
    steps: 7,
  },
  {
    id: 'annual-review',
    name: 'Annual Review',
    description: '8-step credit assessment for ongoing creditworthiness and covenant compliance',
    steps: 8,
  },
];

// ─── Suggested questions ──────────────────────────────────────────────────────

const globalSuggestions = [
  'Which loans have maturities in the next 90 days?',
  'Show borrowers with upcoming renewals',
  'What is the total Data Center exposure?',
];

const recordSuggestions = [
  "What's the current DSCR?",
  'Any open covenant exceptions?',
  'When does this deal mature?',
  'Show recent documents',
];

// ─── Mock responses ───────────────────────────────────────────────────────────

function getMockResponse(query: string, recordName?: string, workflowId?: string): string {
  if (workflowId === 'deal-qa') {
    return `Starting Deal QA workflow${recordName ? ` for **${recordName}**` : ''}. This 7-step review will verify loan documentation and data extraction.\n\n**Step 1: Verify Borrower & Deal Structure**\n\nLet's confirm the basic deal information. Shall I proceed?`;
  }
  if (workflowId === 'annual-review') {
    return `Starting Annual Review${recordName ? ` for **${recordName}**` : ''}. This 8-step credit assessment evaluates ongoing creditworthiness and covenant compliance.\n\n**Step 1: Collect & Verify Current Financials**\n\nLet's verify the financial statements on file. Shall I proceed?`;
  }
  const q = query.toLowerCase();
  if (q.includes('maturity') || q.includes('maturities') || (q.includes('90') && q.includes('days'))) {
    return 'Found 2 loans with maturities in the next 90 days:\n\n• **GH3 Cler SNU** — Matures Aug 30, 2026 · $4.75M · Renewal pending\n• **Retail Plaza Holdings** — Matures Jun 30, 2026 · $8.2M · Docs outstanding';
  }
  if (q.includes('risk rating 4') || q.includes('risk rating 5') || q.includes('4 or 5')) {
    return 'Found 1 borrower with risk rating 4 or above:\n\n• **Retail Plaza Holdings** — RR4 Satisfactory · $8.2M exposure';
  }
  if (q.includes('data center')) {
    return 'Data Center portfolio: **1 loan**, total credit exposure **$9.8M** (VFN Holdings Inc, RR2, Active).';
  }
  if (q.includes('dscr') || q.includes('debt service')) {
    return `DSCR for ${recordName ? `**${recordName}**` : 'this deal'} is **1.43x** as of Q4 2025 — above the 1.25x policy minimum. Leverage at covenant threshold (5.5x).`;
  }
  if (q.includes('covenant') || q.includes('exception')) {
    return 'One open exception: appraisal approaching 18-month staleness in May 2026. No covenant violations. Leverage at max threshold (5.5x) — monitor closely.';
  }
  if (q.includes('matur')) {
    return `${recordName ? `**${recordName}**` : 'This deal'} matures **December 15, 2027** — approximately 21 months remaining.`;
  }
  if (q.includes('document')) {
    return recordName
      ? `Found 4 documents on file for **${recordName}**: Term Sheet (01/15/2024), Financial Statements Q4 2024 (01/15/2025), Appraisal Report (08/10/2024), Credit Agreement (01/15/2024).`
      : 'Your portfolio has 24 documents across 6 borrowers. Select a record to see deal-specific documents.';
  }
  return recordName
    ? `I've reviewed the documents on file for **${recordName}**. Try asking about DSCR, covenants, maturity, guarantors, or collateral.`
    : "I can help with that. Try asking about maturities, risk ratings, or asset class exposure.";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AgentSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface CommercialLendingChatProps {
  onChatStarted?: () => void;
  onSessionCreated?: (session: AgentSession) => void;
}

export function CommercialLendingChat({ onChatStarted, onSessionCreated }: CommercialLendingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<Borrower[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showRecordDropdown, setShowRecordDropdown] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [pendingWorkflow, setPendingWorkflow] = useState<Workflow | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (recordDropdownRef.current && !recordDropdownRef.current.contains(e.target as Node)) {
        setShowRecordDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = selectedRecords.length === 1 ? recordSuggestions : globalSuggestions;
  const hasMessages = messages.length > 0;

  const toggleRecord = (b: Borrower) => {
    setSelectedRecords(prev =>
      prev.some(r => r.id === b.id) ? prev.filter(r => r.id !== b.id) : [...prev, b]
    );
  };

  const send = (queryOverride?: string, workflowOverride?: Workflow | null) => {
    const query = queryOverride ?? input;
    const wf = workflowOverride !== undefined ? workflowOverride : selectedWorkflow;

    const recordLabel = selectedRecords.length === 1
      ? selectedRecords[0].name
      : selectedRecords.length > 1
        ? selectedRecords.map(r => r.name).join(', ')
        : null;

    const userContent = !query.trim() && wf
      ? `Run ${wf.name}${recordLabel ? ` on ${recordLabel}` : ''}`
      : query;

    if (!userContent.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => {
      if (prev.length === 0) {
        onChatStarted?.();
        onSessionCreated?.({
          id: userMsg.id,
          title: userContent.length > 40 ? userContent.slice(0, 40) + '…' : userContent,
          preview: recordLabel ? `In ${recordLabel}` : 'Portfolio chat',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        });
      }
      return [...prev, userMsg];
    });
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const responseText = getMockResponse(userContent, selectedRecords[0]?.name, wf?.id);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      }]);
      setIsThinking(false);
    }, 900);
  };

  const handleStartWorkflow = (wf: Workflow) => {
    setShowWorkflowDropdown(false);
    setPendingWorkflow(wf);
  };

  const handleRecordPickedForWorkflow = (record: Borrower) => {
    setSelectedRecords([record]);
    setSelectedWorkflow(pendingWorkflow);
    setPendingWorkflow(null);
    send('', pendingWorkflow);
  };

  // ── Input box (shared between empty and messages state) ──────────────────────
  const inputBox = (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible focus-within:border-[#E05C3A] transition-colors">
      {/* Textarea row */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <Sparkles className="w-4 h-4 text-[#455a4f] flex-shrink-0 mt-0.5" />
        <textarea
          rows={2}
          autoFocus
          placeholder={
            selectedWorkflow
              ? `Ask about the ${selectedWorkflow.name} workflow, or send to start…`
              : selectedRecords.length === 1
              ? `Quick question about ${selectedRecords[0].name}…`
              : selectedRecords.length > 1
              ? `Quick question across ${selectedRecords.length} records…`
              : 'Ask anything about your portfolio…'
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent resize-none leading-relaxed"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() && !selectedWorkflow}
          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 mt-0.5"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L14 8M14 8L8 2M14 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Suggested chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => send(s)}
            className="px-2.5 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bottom bar: record selector only */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center gap-2">

        {/* Record selector */}
        <div className="relative" ref={recordDropdownRef}>
          <button
            onClick={() => { setShowRecordDropdown(o => !o); setShowWorkflowDropdown(false); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
              selectedRecords.length > 0
                ? 'bg-[#f0f4f2] text-[#455a4f] border-[#c8d8d2]'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="max-w-[130px] truncate">
              {selectedRecords.length === 0
                ? 'Work in a record'
                : selectedRecords.length === 1
                  ? selectedRecords[0].name
                  : `${selectedRecords.length} records`}
            </span>
            {selectedRecords.length > 0 ? (
              <X
                className="w-3 h-3 flex-shrink-0 ml-0.5 hover:text-red-500 transition-colors"
                onClick={e => { e.stopPropagation(); setSelectedRecords([]); }}
              />
            ) : (
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            )}
          </button>

          {showRecordDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Select records</span>
                {selectedRecords.length > 0 && (
                  <button
                    onClick={() => { setSelectedRecords([]); }}
                    className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-52 overflow-y-auto">
                {mockBorrowers.map(b => {
                  const checked = selectedRecords.some(r => r.id === b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleRecord(b)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        checked ? 'bg-[#f0f4f2]' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        checked ? 'bg-[#455a4f] border-[#455a4f]' : 'border-gray-300'
                      }`}>
                        {checked && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">{b.name}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{b.noteNumber}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // ── Record picker (shown after clicking a workflow card) ─────────────────────
  if (pendingWorkflow) {
    return (
      <div className="flex flex-col h-full px-6 py-6 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* Back + heading */}
          <button
            onClick={() => setPendingWorkflow(null)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-1">
              Run {pendingWorkflow.name}
            </h2>
            <p className="text-sm text-gray-500">Select the record you want to run this workflow on.</p>
          </div>

          <div className="space-y-2">
            {mockBorrowers.map(b => (
              <button
                key={b.id}
                onClick={() => handleRecordPickedForWorkflow(b)}
                className="w-full flex items-center justify-between gap-4 px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-[#455a4f] hover:bg-[#f8faf9] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f0f4f2] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#455a4f]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{b.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{b.noteNumber}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#455a4f] transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────────
  if (!hasMessages) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 pb-6 pt-2 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-1">
            What do you need help with?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Ask questions across your portfolio, select a record to go deeper, or run a workflow.
          </p>

          {inputBox}

          {/* Workflow cards */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pick a workflow</span>
            </div>
            <div className="space-y-2">
              {workflows.map(wf => (
                <button
                  key={wf.id}
                  onClick={() => handleStartWorkflow(wf)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-[#455a4f] hover:bg-[#f8faf9] transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#f0f4f2] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#455a4f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{wf.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{wf.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#455a4f] transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Messages state ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Active context pills */}
          {(selectedRecords.length > 0 || selectedWorkflow) && (
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-100">
              {selectedRecords.map(r => (
                <div key={r.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f4f2] border border-[#c8d8d2] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#455a4f]" />
                  <span className="text-[11px] text-[#455a4f] font-medium">{r.name}</span>
                  <button
                    onClick={() => setSelectedRecords(prev => prev.filter(x => x.id !== r.id))}
                    className="text-[#455a4f]/50 hover:text-[#455a4f] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedWorkflow && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f4f2] border border-[#c8d8d2] rounded-full">
                  <Zap className="w-3 h-3 text-[#455a4f]" />
                  <span className="text-[11px] text-[#455a4f] font-medium">{selectedWorkflow.name}</span>
                  <button
                    onClick={() => setSelectedWorkflow(null)}
                    className="text-[#455a4f]/50 hover:text-[#455a4f] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2.5 px-1 py-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Searching the knowledge base
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Pinned input */}
      <div className="px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          {inputBox}
        </div>
      </div>
    </div>
  );
}
