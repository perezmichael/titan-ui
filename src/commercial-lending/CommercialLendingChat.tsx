import { useState, useRef, useEffect } from 'react';
import { Sparkles, FileText, Zap, ChevronDown, X, ChevronRight, Upload, ChevronLeft } from 'lucide-react';
import { borrowerDossiers } from './BorrowerPortfolioList';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Borrower {
  id: string;
  name: string;
  noteNumber: string;
  assetClass: string;
  status: 'Active' | 'Renewal' | 'Payoff';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  records?: Borrower[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockBorrowers: Borrower[] = [
  { id: '1',  name: 'VFN Holdings Inc',          noteNumber: '20240001-001', assetClass: 'Data Center',      status: 'Active'  },
  { id: '2',  name: 'GH3 Cler SNU',              noteNumber: '20230045-001', assetClass: 'CRE — Office',     status: 'Renewal' },
  { id: '3',  name: 'Fibernet Solutions LLC',    noteNumber: '20240078-001', assetClass: 'Fiber/Telecom',    status: 'Active'  },
  { id: '4',  name: 'Retail Plaza Holdings',     noteNumber: '20230122-001', assetClass: 'CRE — Retail',     status: 'Active'  },
  { id: '5',  name: 'Healthcare Properties Inc', noteNumber: '20240055-001', assetClass: 'CRE — Healthcare', status: 'Active'  },
  { id: '6',  name: 'Meridian Office Partners',  noteNumber: '20230198-001', assetClass: 'CRE — Office',     status: 'Active'  },
  { id: '7',  name: 'Mesa Data Solutions LLC',   noteNumber: '20240112-001', assetClass: 'Data Center',      status: 'Active'  },
  { id: '8',  name: 'Desert Edge Colocation',    noteNumber: '20230287-001', assetClass: 'Data Center',      status: 'Renewal' },
  { id: '9',  name: 'Sunbelt Industrial REIT',   noteNumber: '20240163-001', assetClass: 'Industrial',       status: 'Active'  },
  { id: '10', name: 'Pinnacle Life Sciences',    noteNumber: '20230341-001', assetClass: 'CRE — Healthcare', status: 'Active'  },
  { id: '11', name: 'Lakefront Mixed-Use LLC',   noteNumber: '20240204-001', assetClass: 'CRE — Mixed-Use',  status: 'Renewal' },
  { id: '12', name: 'Apex Logistics Center',     noteNumber: '20230419-001', assetClass: 'Industrial',       status: 'Active'  },
];

const workflows: Workflow[] = [
  { id: 'deal-qa',       name: 'Deal QA',       description: '7-step quality assurance review of loan documentation and data extraction', steps: 7 },
  { id: 'annual-review', name: 'Annual Review', description: '8-step credit assessment for ongoing creditworthiness and covenant compliance', steps: 8 },
];

// ─── Suggestions ──────────────────────────────────────────────────────────────

const globalSuggestions = [
  'Which loans have maturities in the next 90 days?',
  'Show borrowers with upcoming renewals',
  'How many deals are for data centers in Arizona?',
];

const recordSuggestions = [
  "What's the current DSCR?",
  'Any open covenant exceptions?',
  'When does this deal mature?',
  'Show recent documents',
];

// ─── Mock response engine ─────────────────────────────────────────────────────

interface MockResponse {
  text: string;
  records?: Borrower[];
}

function getMockResponse(query: string, recordName?: string, workflowId?: string): MockResponse {
  if (workflowId === 'deal-qa') {
    return { text: `Starting Deal QA workflow${recordName ? ` for **${recordName}**` : ''}. This 7-step review will verify loan documentation and data extraction.\n\n**Step 1: Verify Borrower & Deal Structure**\n\nLet's confirm the basic deal information. Shall I proceed?` };
  }
  if (workflowId === 'annual-review') {
    return { text: `Starting Annual Review${recordName ? ` for **${recordName}**` : ''}. This 8-step credit assessment evaluates ongoing creditworthiness and covenant compliance.\n\n**Step 1: Collect & Verify Current Financials**\n\nLet's verify the financial statements on file. Shall I proceed?` };
  }

  const q = query.toLowerCase();

  if (q.includes('maturity') || q.includes('maturities') || (q.includes('90') && q.includes('days'))) {
    return {
      text: 'Found **2 loans** with maturities in the next 90 days:',
      records: [mockBorrowers[1], mockBorrowers[3]],
    };
  }
  if (q.includes('renewal')) {
    return {
      text: 'Found **1 borrower** with an active renewal in progress:',
      records: [mockBorrowers[1]],
    };
  }
  if (q.includes('data center')) {
    const isArizona = q.includes('arizona') || q.includes('az');
    return {
      text: isArizona
        ? 'Found **3 Data Center deals** in Arizona with total credit exposure of **$28.4M**:'
        : 'Found **3 Data Center deals** in your portfolio with total credit exposure of **$28.4M**:',
      records: [mockBorrowers[0], mockBorrowers[6], mockBorrowers[7]],
    };
  }
  if (q.includes('dscr') || q.includes('debt service')) {
    return { text: `DSCR for ${recordName ? `**${recordName}**` : 'this deal'} is **1.43x** as of Q4 2025 — above the 1.25x policy minimum. Leverage at covenant threshold (5.5x).` };
  }
  if (q.includes('covenant') || q.includes('exception')) {
    return { text: 'One open exception: appraisal approaching 18-month staleness in May 2026. No covenant violations. Leverage at max threshold (5.5x) — monitor closely.' };
  }
  if (q.includes('matur')) {
    return { text: `${recordName ? `**${recordName}**` : 'This deal'} matures **December 15, 2027** — approximately 21 months remaining.` };
  }
  if (q.includes('document')) {
    return {
      text: recordName
        ? `Found 4 documents on file for **${recordName}**: Term Sheet (01/15/2024), Financial Statements Q4 2024 (01/15/2025), Appraisal Report (08/10/2024), Credit Agreement (01/15/2024).`
        : 'Your portfolio has 24 documents across 6 borrowers. Select a record to see deal-specific documents.',
    };
  }
  return {
    text: recordName
      ? `I've reviewed the documents on file for **${recordName}**. Try asking about DSCR, covenants, maturity, guarantors, or collateral.`
      : 'I can help with that. Try asking about maturities, renewals, data center deals, or asset class exposure.',
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
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
  initialRecords?: Borrower[];
}

export function CommercialLendingChat({ onChatStarted, onSessionCreated, initialRecords }: CommercialLendingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<Borrower[]>(initialRecords ?? []);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showRecordDropdown, setShowRecordDropdown] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [pendingWorkflow, setPendingWorkflow] = useState<Workflow | null>(null);
  const [openDossierRecord, setOpenDossierRecord] = useState<Borrower | null>(initialRecords?.[0] ?? null);
  const [showDossierOverflow, setShowDossierOverflow] = useState(false);
  const [dossierOverflowSearch, setDossierOverflowSearch] = useState('');
  const [showHeaderChip, setShowHeaderChip] = useState(false);
  const [headerChipSearch, setHeaderChipSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordDropdownRef = useRef<HTMLDivElement>(null);
  const dossierOverflowRef = useRef<HTMLDivElement>(null);
  const headerChipRef = useRef<HTMLDivElement>(null);

  const DOSSIER_MAX_TABS = 4;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (recordDropdownRef.current && !recordDropdownRef.current.contains(e.target as Node)) {
        setShowRecordDropdown(false);
      }
      if (dossierOverflowRef.current && !dossierOverflowRef.current.contains(e.target as Node)) {
        setShowDossierOverflow(false);
      }
      if (headerChipRef.current && !headerChipRef.current.contains(e.target as Node)) {
        setShowHeaderChip(false);
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
    const userContent = !query.trim() && wf ? `Run ${wf.name}${recordLabel ? ` on ${recordLabel}` : ''}` : query;
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
      const { text, records } = getMockResponse(userContent, selectedRecords[0]?.name, wf?.id);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date().toISOString(),
        records,
      }]);
      setIsThinking(false);
    }, 900);
  };

  const handleStartWorkflow = (wf: Workflow) => {
    setPendingWorkflow(wf);
  };

  const handleRecordPickedForWorkflow = (record: Borrower) => {
    setSelectedRecords([record]);
    setSelectedWorkflow(pendingWorkflow);
    setPendingWorkflow(null);
    send('', pendingWorkflow);
  };

  // ── Input box ─────────────────────────────────────────────────────────────────
  const inputBox = (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible focus-within:border-[#E05C3A] transition-colors">
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
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
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

      <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center gap-2">
        <div className="relative" ref={recordDropdownRef}>
          <button
            onClick={() => setShowRecordDropdown(o => !o)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
              selectedRecords.length > 0
                ? 'bg-[#f0f4f2] text-[#455a4f] border-[#c8d8d2]'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="max-w-[130px] truncate">
              {selectedRecords.length === 0 ? 'Work in a record' : selectedRecords.length === 1 ? selectedRecords[0].name : `${selectedRecords.length} records`}
            </span>
            {selectedRecords.length > 0 ? (
              <X className="w-3 h-3 flex-shrink-0 ml-0.5 hover:text-red-500 transition-colors" onClick={e => { e.stopPropagation(); setSelectedRecords([]); }} />
            ) : (
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            )}
          </button>

          {showRecordDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Select records</span>
                {selectedRecords.length > 0 && (
                  <button onClick={() => setSelectedRecords([])} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
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
                      className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${checked ? 'bg-[#f0f4f2]' : ''}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-[#455a4f] border-[#455a4f]' : 'border-gray-300'}`}>
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

  // ── Record picker (workflow flow) ─────────────────────────────────────────────
  if (pendingWorkflow) {
    return (
      <div className="flex flex-col h-full px-6 py-6 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          <button onClick={() => setPendingWorkflow(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-1">Run {pendingWorkflow.name}</h2>
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
                    <div className="text-[11px] text-gray-400 mt-0.5">{b.assetClass} · {b.noteNumber}</div>
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
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-1">What do you need help with?</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Ask questions across your portfolio, select a record to go deeper, or run a workflow.
          </p>
          {inputBox}
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
    <div className="flex h-full overflow-hidden">
      {/* Chat column */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Context header bar */}
        {(selectedRecords.length > 0 || selectedWorkflow) && (
          <div className="flex-shrink-0 border-b border-gray-100 px-6 py-2 flex items-center gap-2 bg-white">
            <span className="text-xs text-gray-500">Chatting with</span>
            {/* Records chip */}
            {selectedRecords.length > 0 && (
              <div className="relative" ref={headerChipRef}>
                <button
                  onClick={() => { setShowHeaderChip(v => !v); setHeaderChipSearch(''); }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f4f2] border border-[#c8d8d2] rounded-full text-[11px] text-[#455a4f] font-medium hover:bg-[#e4ece8] transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  {selectedRecords.length === 1 ? selectedRecords[0].name : `${selectedRecords.length} records`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showHeaderChip ? 'rotate-180' : ''}`} />
                </button>

                {showHeaderChip && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-100">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search records…"
                        value={headerChipSearch}
                        onChange={e => setHeaderChipSearch(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-400 placeholder-gray-400"
                      />
                    </div>
                    {/* Record list */}
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {selectedRecords
                        .filter(r => r.name.toLowerCase().includes(headerChipSearch.toLowerCase()))
                        .map(r => (
                          <div key={r.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#455a4f] flex-shrink-0" />
                            <span className="flex-1 text-xs text-gray-700 truncate">{r.name}</span>
                            <button
                              onClick={() => setSelectedRecords(prev => prev.filter(x => x.id !== r.id))}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      }
                      {selectedRecords.filter(r => r.name.toLowerCase().includes(headerChipSearch.toLowerCase())).length === 0 && (
                        <p className="px-3 py-2 text-xs text-gray-400">No records found</p>
                      )}
                    </div>
                    {/* Footer */}
                    <div className="px-3 py-2 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">{selectedRecords.length} record{selectedRecords.length !== 1 ? 's' : ''} in context</span>
                      <button
                        onClick={() => { setSelectedRecords([]); setShowHeaderChip(false); }}
                        className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Workflow chip */}
            {selectedWorkflow && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f4f2] border border-[#c8d8d2] rounded-full text-[11px] text-[#455a4f] font-medium">
                <Zap className="w-3 h-3" />
                {selectedWorkflow.name}
                <button onClick={() => setSelectedWorkflow(null)} className="text-[#455a4f]/50 hover:text-[#455a4f] transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <span className="text-xs text-gray-500">documents and data</span>
          </div>
        )}

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-5">


            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {renderText(msg.content)}
                    </div>
                  )}

                  {/* Inline record results card */}
                  {msg.records && msg.records.length > 0 && (
                    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">
                          {msg.records.length} record{msg.records.length > 1 ? 's' : ''} found
                        </span>
                      </div>
                      {msg.records.map((r, i) => {
                        const isOpen = openDossierRecord?.id === r.id;
                        const statusColor = r.status === 'Active' ? 'bg-green-50 text-green-700' : r.status === 'Renewal' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600';
                        return (
                          <div
                            key={r.id}
                            className={`flex items-center gap-3 px-4 py-3 ${i < msg.records!.length - 1 ? 'border-b border-gray-100' : ''} ${isOpen ? 'bg-[#f8faf9]' : ''}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{r.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{r.assetClass} · {r.noteNumber}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusColor}`}>{r.status}</span>
                              <button
                                onClick={() => setOpenDossierRecord(isOpen ? null : r)}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                                  isOpen
                                    ? 'bg-[#455a4f] text-white border-[#455a4f]'
                                    : 'text-[#455a4f] border-[#c8d8d2] bg-[#f0f4f2] hover:bg-[#e4ece8]'
                                }`}
                              >
                                {isOpen ? 'Close' : 'Open'}
                                <ChevronRight className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {/* Bridge CTA */}
                      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                        <button className="text-xs text-[#455a4f] hover:underline transition-colors">
                          Go deeper — chat with {msg.records.length > 1 ? 'these records' : 'this record'} side by side →
                        </button>
                      </div>
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

      {/* Dossier panel — slides in when a record is opened */}
      {openDossierRecord && (() => {
        const dossier = borrowerDossiers[openDossierRecord.id];
        // Build the tab list: all selectedRecords if any, otherwise just the open record
        const dossierTabs = selectedRecords.length > 0 ? selectedRecords : [openDossierRecord];
        const visibleTabs = dossierTabs.slice(0, DOSSIER_MAX_TABS);
        const overflowTabs = dossierTabs.slice(DOSSIER_MAX_TABS);
        const filteredOverflow = overflowTabs.filter(r =>
          r.name.toLowerCase().includes(dossierOverflowSearch.toLowerCase())
        );
        return (
          <div className="w-[460px] flex-shrink-0 border-l border-gray-200 flex flex-col bg-[#f5f5f3] overflow-hidden">
            {/* Panel header — tabbed when multiple records */}
            <div className="bg-white border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center pr-1">
                {/* Visible tabs */}
                <div className="flex items-end overflow-hidden">
                  {visibleTabs.map(r => {
                    const isActive = openDossierRecord.id === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setOpenDossierRecord(r)}
                        className={`flex-shrink-0 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 max-w-[100px] truncate ${
                          isActive
                            ? 'text-gray-900 border-gray-900'
                            : 'text-gray-400 border-transparent hover:text-gray-600'
                        }`}
                        title={r.name}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>

                {/* "+N more" overflow dropdown */}
                {overflowTabs.length > 0 && (
                  <div className="relative flex-shrink-0" ref={dossierOverflowRef}>
                    <button
                      onClick={() => { setShowDossierOverflow(v => !v); setDossierOverflowSearch(''); }}
                      className={`px-2.5 py-3 text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors border-b-2 ${
                        showDossierOverflow ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600'
                      }`}
                    >
                      +{overflowTabs.length} more
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {showDossierOverflow && (
                      <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {/* Search */}
                        <div className="p-2 border-b border-gray-100">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search records…"
                            value={dossierOverflowSearch}
                            onChange={e => setDossierOverflowSearch(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-400 placeholder-gray-400"
                          />
                        </div>
                        {/* Results */}
                        <div className="py-1 max-h-52 overflow-y-auto">
                          {filteredOverflow.length > 0 ? filteredOverflow.map(r => (
                            <button
                              key={r.id}
                              onClick={() => { setOpenDossierRecord(r); setShowDossierOverflow(false); setDossierOverflowSearch(''); }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                                openDossierRecord.id === r.id ? 'text-gray-900 font-medium' : 'text-gray-600'
                              }`}
                            >
                              {r.name}
                            </button>
                          )) : (
                            <p className="px-3 py-2 text-xs text-gray-400">No records found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Close button */}
                <button
                  onClick={() => setOpenDossierRecord(null)}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable dossier content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-5">

                {/* Description */}
                {dossier && (
                  <p className="text-sm text-gray-500 leading-relaxed">{dossier.description}</p>
                )}

                {/* Deal Details */}
                {dossier && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Deal Details</h3>
                    </div>
                    <div>
                      {dossier.dealDetails.map((row, i) => (
                        <div key={i} className={`flex gap-3 px-4 py-2.5 ${i < dossier.dealDetails.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <span className="w-36 flex-shrink-0 text-xs text-gray-400 leading-relaxed">{row.label}</span>
                          <span className="flex-1 text-xs text-gray-900 leading-relaxed">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {dossier && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Documents ({dossier.documents.length})</h3>
                      <button className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors">
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                    </div>
                    <div>
                      {dossier.documents.map((doc, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${i < dossier.documents.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-900 truncate">{doc.name}</p>
                            <p className="text-[10px] text-gray-400">{doc.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Knowledge Base */}
                {dossier && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Relevant KB Documents</h3>
                      <button className="text-xs text-[#455a4f] hover:underline">+ Add</button>
                    </div>
                    <div>
                      {dossier.kbDocuments.map((doc, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${i < dossier.kbDocuments.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-900">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
