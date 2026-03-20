import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Plus, Settings, Send, Sparkles, X,
  CheckCircle2, FileText, Search, Clock, AlertTriangle,
  ChevronDown, ChevronRight, Layers, Zap,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Borrower {
  id: string;
  name: string;
  riskRating: number;
  noteNumber: string;
  maturityDate: string;
  loanOfficer: string;
  balance: number;
  status: 'Active' | 'Renewal' | 'Payoff';
}

interface InlineRecord {
  id: string;
  name: string;
  riskRating: number;
  detail: string;
  meta: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  records?: InlineRecord[];
  source?: string;
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  type: 'chat' | 'workflow';
  workflowStatus?: 'in-progress' | 'completed';
  workflowSteps?: { current: number; total: number };
  contextRecord?: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockBorrowers: Borrower[] = [
  { id: '1', name: 'VFN Holdings Inc', riskRating: 2, noteNumber: '20240001-001', maturityDate: '2027-12-15', loanOfficer: 'Sarah Chen', balance: 9800000, status: 'Active' },
  { id: '2', name: 'GH3 Cler SNU', riskRating: 3, noteNumber: '20230045-001', maturityDate: '2026-08-30', loanOfficer: 'Michael Torres', balance: 4750000, status: 'Renewal' },
  { id: '3', name: 'Fibernet Solutions LLC', riskRating: 2, noteNumber: '20240078-001', maturityDate: '2028-06-01', loanOfficer: 'Jennifer Wu', balance: 12000000, status: 'Active' },
  { id: '4', name: 'Retail Plaza Holdings', riskRating: 4, noteNumber: '20230122-001', maturityDate: '2026-06-30', loanOfficer: 'David Park', balance: 8200000, status: 'Renewal' },
  { id: '5', name: 'Healthcare Properties Inc', riskRating: 1, noteNumber: '20240055-001', maturityDate: '2029-03-15', loanOfficer: 'Sarah Chen', balance: 15500000, status: 'Active' },
  { id: '6', name: 'Meridian Office Partners', riskRating: 3, noteNumber: '20230198-001', maturityDate: '2026-09-30', loanOfficer: 'Michael Torres', balance: 6300000, status: 'Active' },
];

const initialSessions: ChatSession[] = [
  { id: 's1', title: 'Deals expiring this quarter', preview: 'Found 3 deals maturing before June 30', timestamp: '2026-03-18', type: 'chat' },
  { id: 's2', title: 'VFN Holdings DSCR check', preview: 'DSCR is 1.43x, above 1.25x minimum', timestamp: '2026-03-17', type: 'chat', contextRecord: 'VFN Holdings Inc' },
  { id: 's3', title: 'Deal QA — VFN Holdings', preview: 'All 7 steps confirmed. PDF ready.', timestamp: '2026-03-10', type: 'workflow', workflowStatus: 'completed', workflowSteps: { current: 7, total: 7 } },
  { id: 's4', title: 'Deal QA — Fibernet Solutions', preview: 'Completed 3/8', timestamp: '2026-03-08', type: 'workflow', workflowStatus: 'completed', workflowSteps: { current: 7, total: 7 } },
  { id: 's5', title: 'Annual Review — GH3 Cler SNU', preview: 'Step 2 of 5 — paused', timestamp: '2026-03-05', type: 'workflow', workflowStatus: 'in-progress', workflowSteps: { current: 2, total: 5 } },
];

const globalSuggestions = [
  'Which deals are expiring this quarter?',
  'Show all risk rating 3+ borrowers',
  'Which deals have DSCR below 1.30x?',
  'Summarize deals up for renewal',
];

const scopedSuggestions: Record<string, string[]> = {
  default: [
    "What's the current DSCR?",
    'Any open covenant exceptions?',
    'When does this deal mature?',
    'Show recent documents',
  ],
};

const mockResponses: Record<string, Message> = {
  'expir': {
    id: 'r-expir', role: 'assistant', timestamp: new Date().toISOString(),
    content: 'Found 3 deals maturing within the next 6 months:',
    records: [
      { id: '2', name: 'GH3 Cler SNU', riskRating: 3, detail: 'Matures Aug 30, 2026 · Up for renewal', meta: 'Note 20230045-001' },
      { id: '4', name: 'Retail Plaza Holdings', riskRating: 4, detail: 'Matures Jun 30, 2026 · Renewal docs pending', meta: 'Note 20230122-001' },
      { id: '6', name: 'Meridian Office Partners', riskRating: 3, detail: 'Matures Sep 30, 2026 · Annual review due', meta: 'Note 20230198-001' },
    ],
  },
  'dscr': {
    id: 'r-dscr', role: 'assistant', timestamp: new Date().toISOString(),
    content: 'DSCR is **1.43x** as of Q4 2025 — above the policy minimum of 1.25x. Leverage is at the covenant threshold (5.5x max, currently 5.5x). No violations on file.',
    source: 'Financial Statements Q4 2025, p. 8',
  },
  'risk': {
    id: 'r-risk', role: 'assistant', timestamp: new Date().toISOString(),
    content: 'Found 2 borrowers at risk rating 3 or above:',
    records: [
      { id: '2', name: 'GH3 Cler SNU', riskRating: 3, detail: 'RR3 — Strong Satisfactory', meta: 'Note 20230045-001' },
      { id: '4', name: 'Retail Plaza Holdings', riskRating: 4, detail: 'RR4 — Satisfactory', meta: 'Note 20230122-001' },
      { id: '6', name: 'Meridian Office Partners', riskRating: 3, detail: 'RR3 — Strong Satisfactory', meta: 'Note 20230198-001' },
    ],
  },
  'renew': {
    id: 'r-renew', role: 'assistant', timestamp: new Date().toISOString(),
    content: 'Two deals are currently in renewal status:',
    records: [
      { id: '2', name: 'GH3 Cler SNU', riskRating: 3, detail: 'Renewal · $4.75M balance · Aug 2026', meta: 'Note 20230045-001' },
      { id: '4', name: 'Retail Plaza Holdings', riskRating: 4, detail: 'Renewal · $8.2M balance · Jun 2026', meta: 'Note 20230122-001' },
    ],
  },
  'covenant': {
    id: 'r-covenant', role: 'assistant', timestamp: new Date().toISOString(),
    content: 'One open exception for this deal: the appraisal is approaching 18-month staleness in May 2026. No covenant violations. Leverage is at the max threshold (5.5x) — watch closely.',
    source: 'Covenant Compliance Summary Q4 2025, p. 8',
  },
  'matur': {
    id: 'r-matur', role: 'assistant', timestamp: new Date().toISOString(),
    content: 'This deal matures on **December 15, 2027**. Remaining term is approximately 21 months. No scheduled amortization until the I/O period ends in month 24.',
    source: 'Term Sheet, p. 4',
  },
  'default-global': {
    id: 'r-default', role: 'assistant', timestamp: new Date().toISOString(),
    content: "I can help with that. Based on the current portfolio, here's what I found. Try asking something more specific like deal expirations, risk ratings, or covenant status.",
  },
  'default-scoped': {
    id: 'r-scoped', role: 'assistant', timestamp: new Date().toISOString(),
    content: "I've reviewed the documents on file for this deal. Could you be more specific? You can ask about DSCR, covenants, maturity dates, guarantors, or collateral.",
    source: 'Based on uploaded documents',
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const rrColors: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  2: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  3: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  4: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  5: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

function RRBadge({ rating }: { rating: number }) {
  const c = rrColors[rating] ?? rrColors[3];
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
      RR{rating}
    </span>
  );
}

function formatBalance(n: number) {
  return `$${(n / 1000000).toFixed(1)}M`;
}

function getMockResponse(query: string, isScoped: boolean): Message {
  const q = query.toLowerCase();
  if (q.includes('expir') || q.includes('quarter') || q.includes('matur') && !isScoped) return { ...mockResponses['expir'], id: Date.now().toString(), timestamp: new Date().toISOString() };
  if (q.includes('dscr') || q.includes('debt service') || q.includes('coverage')) return { ...mockResponses['dscr'], id: Date.now().toString(), timestamp: new Date().toISOString() };
  if (q.includes('risk') || q.includes('rr') || q.includes('rating')) return { ...mockResponses['risk'], id: Date.now().toString(), timestamp: new Date().toISOString() };
  if (q.includes('renew')) return { ...mockResponses['renew'], id: Date.now().toString(), timestamp: new Date().toISOString() };
  if (q.includes('covenant') || q.includes('exception') || q.includes('compliance')) return { ...mockResponses['covenant'], id: Date.now().toString(), timestamp: new Date().toISOString() };
  if (q.includes('matur') && isScoped) return { ...mockResponses['matur'], id: Date.now().toString(), timestamp: new Date().toISOString() };
  return { ...(isScoped ? mockResponses['default-scoped'] : mockResponses['default-global']), id: Date.now().toString(), timestamp: new Date().toISOString() };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AgentWorkspaceProps {
  onBack: () => void;
}

export function AgentWorkspace({ onBack }: AgentWorkspaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextRecord, setContextRecord] = useState<Borrower | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'records' | 'activity'>('records');
  const [recordSearch, setRecordSearch] = useState('');
  const [actionsVariant, setActionsVariant] = useState<'A' | 'B'>('A');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const isScoped = contextRecord !== null;
  const filteredBorrowers = mockBorrowers.filter(b =>
    b.name.toLowerCase().includes(recordSearch.toLowerCase())
  );
  const workflowSessions = sessions.filter(s => s.type === 'workflow');

  const handleSelectRecord = (b: Borrower) => {
    setContextRecord(b);
    setMessages([]);
    setActiveSessionId(null);
  };

  const handleClearContext = () => {
    setContextRecord(null);
    setMessages([]);
    setActiveSessionId(null);
  };

  const handleNewChat = () => {
    setContextRecord(null);
    setMessages([]);
    setActiveSessionId(null);
    setChatInput('');
  };

  const handleSessionSelect = (session: ChatSession) => {
    setActiveSessionId(session.id);
    // Seed a preview message for the session
    setMessages([
      {
        id: 'seed-user',
        role: 'user',
        content: session.title,
        timestamp: session.timestamp,
      },
      {
        id: 'seed-assistant',
        role: 'assistant',
        content: session.preview,
        timestamp: session.timestamp,
        ...(session.type === 'workflow' && session.workflowStatus === 'completed'
          ? { source: 'Deal_QA_Report.pdf' }
          : {}),
      },
    ]);
    if (session.contextRecord) {
      const b = mockBorrowers.find(b => b.name === session.contextRecord);
      if (b) setContextRecord(b);
    } else {
      setContextRecord(null);
    }
  };

  const handleSend = (queryOverride?: string) => {
    const query = queryOverride ?? chatInput;
    if (!query.trim()) return;
    setChatInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Save/create session
    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: `s-${Date.now()}`,
        title: query.length > 42 ? query.slice(0, 42) + '…' : query,
        preview: '…',
        timestamp: new Date().toISOString().split('T')[0],
        type: 'chat',
        contextRecord: contextRecord?.name,
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }

    setTimeout(() => {
      const response = getMockResponse(query, isScoped);
      setMessages(prev => [...prev, response]);
      setSessions(prev => prev.map(s =>
        s.id === activeSessionId ? { ...s, preview: response.content.slice(0, 60) } : s
      ));
      setIsThinking(false);
    }, 900);
  };

  const suggestions = isScoped ? scopedSuggestions.default : globalSuggestions;
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-[#f5f5f3]">

      {/* ── Left Rail: Chat History ──────────────────────────────────────────── */}
      <div className="w-[220px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Agents
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Commercial Lending</div>
              <div className="text-[11px] text-gray-400 mt-0.5">6 records</div>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* New chat */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New chat
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-1">
          {/* Chat sessions */}
          {sessions.filter(s => actionsVariant === 'A' ? true : s.type === 'chat').map(session => (
            <button
              key={session.id}
              onClick={() => handleSessionSelect(session)}
              className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors rounded-lg mx-1 ${activeSessionId === session.id ? 'bg-[#f0f4f2]' : ''}`}
              style={{ width: 'calc(100% - 8px)' }}
            >
              <div className="flex items-start gap-2">
                {session.type === 'workflow' ? (
                  <div className={`mt-0.5 flex-shrink-0 ${session.workflowStatus === 'in-progress' ? 'text-blue-500' : 'text-emerald-500'}`}>
                    {session.workflowStatus === 'in-progress'
                      ? <Clock className="w-3 h-3" />
                      : <CheckCircle2 className="w-3 h-3" />}
                  </div>
                ) : (
                  <div className="mt-0.5 flex-shrink-0 text-gray-300">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-gray-800 truncate leading-tight">{session.title}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5 leading-tight">{session.preview}</div>
                  {session.type === 'workflow' && session.workflowSteps && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${session.workflowStatus === 'completed' ? 'bg-emerald-400' : 'bg-blue-400'}`}
                          style={{ width: `${(session.workflowSteps.current / session.workflowSteps.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-400">{session.workflowSteps.current}/{session.workflowSteps.total}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main: Chat Area ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          {/* Context pill */}
          <div className="flex-1">
            {isScoped ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f0f4f2] border border-[#c8d8d2] rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#455a4f]" />
                <span className="text-xs text-[#455a4f] font-medium">{contextRecord.name}</span>
                <button onClick={handleClearContext} className="text-[#455a4f]/50 hover:text-[#455a4f] transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <Layers className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">All {mockBorrowers.length} deals</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>

          {/* Layout variant toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <span className="text-[10px] text-gray-400 px-1.5">Layout:</span>
            {(['A', 'B'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActionsVariant(v)}
                className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${actionsVariant === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Right panel toggle */}
          <button
            onClick={() => setRightPanelOpen(o => !o)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle records panel"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            // ── Empty state ────────────────────────────────────────────────────
            <div className="flex flex-col items-center justify-center h-full px-8 pb-16">
              <div className="w-full max-w-xl">
                <div className="mb-6 text-center">
                  {isScoped ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-[#455a4f] flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-medium text-gray-900">{contextRecord!.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {contextRecord!.noteNumber} · {formatBalance(contextRecord!.balance)} · <RRBadge rating={contextRecord!.riskRating} />
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-[#455a4f] flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-medium text-gray-900">What do you need?</h2>
                      <p className="text-sm text-gray-500 mt-1">Ask anything across your {mockBorrowers.length} deals, or select a record to go deeper.</p>
                    </>
                  )}
                </div>

                {/* Hero input */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">
                  <div className="flex items-center gap-3 px-5 py-4">
                    <Sparkles className="w-4 h-4 text-[#455a4f] flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder={isScoped ? `Ask about ${contextRecord!.name}…` : 'Ask anything about your portfolio…'}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                    {chatInput.trim() && (
                      <button
                        onClick={() => handleSend()}
                        className="p-1.5 bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="px-5 pb-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="px-3 py-1.5 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // ── Message thread ────────────────────────────────────────────────
            <div className="px-8 py-6 space-y-6 max-w-3xl mx-auto w-full">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    {msg.role === 'user' ? (
                      <div className="bg-[#455a4f] text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5">
                        {msg.content}
                      </div>
                    ) : (
                      <>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 leading-relaxed">
                          {msg.content.split('**').map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </div>

                        {/* Inline record cards */}
                        {msg.records && msg.records.length > 0 && (
                          <div className="w-full space-y-2">
                            {msg.records.map(record => (
                              <button
                                key={record.id}
                                onClick={() => {
                                  const b = mockBorrowers.find(b => b.id === record.id);
                                  if (b) handleSelectRecord(b);
                                }}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-[#455a4f] hover:bg-[#f8faf9] transition-all group flex items-center gap-3"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-medium text-gray-900">{record.name}</span>
                                    <RRBadge rating={record.riskRating} />
                                  </div>
                                  <div className="text-xs text-gray-500">{record.detail}</div>
                                  <div className="text-[11px] text-gray-400 mt-0.5">{record.meta}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#455a4f] transition-colors flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Source citation */}
                        {msg.source && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-500">
                            <FileText className="w-3 h-3 text-gray-400" />
                            {msg.source}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-5">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Pinned input (when messages exist) */}
        {hasMessages && (
          <div className="px-8 py-4 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="max-w-3xl mx-auto flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <Sparkles className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={isScoped ? `Ask about ${contextRecord!.name}…` : 'Ask a follow-up…'}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                onClick={() => handleSend()}
                disabled={!chatInput.trim()}
                className="p-1.5 bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Panel: Records ─────────────────────────────────────────────── */}
      {rightPanelOpen && (
        <div className="w-[260px] flex flex-col bg-white border-l border-gray-200 flex-shrink-0">

          {/* Tabs — Option B shows Records + Activity */}
          {actionsVariant === 'B' ? (
            <div className="flex border-b border-gray-200">
              {(['records', 'activity'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setRightPanelTab(tab)}
                  className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${rightPanelTab === tab ? 'text-[#455a4f] border-b-2 border-[#455a4f]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-700">Records</div>
            </div>
          )}

          {/* Records tab content */}
          {(actionsVariant === 'A' || rightPanelTab === 'records') && (
            <>
              <div className="px-3 py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search records…"
                    value={recordSearch}
                    onChange={e => setRecordSearch(e.target.value)}
                    className="flex-1 text-xs text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                {filteredBorrowers.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectRecord(b)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${contextRecord?.id === b.id ? 'bg-[#f0f4f2] border-l-2 border-l-[#455a4f]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">{b.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate">{b.noteNumber}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            b.status === 'Renewal' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                          }`}>{b.status}</span>
                          <span className="text-[10px] text-gray-400">{formatBalance(b.balance)}</span>
                        </div>
                      </div>
                      <RRBadge rating={b.riskRating} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add record
                </button>
              </div>
            </>
          )}

          {/* Activity tab — Option B only */}
          {actionsVariant === 'B' && rightPanelTab === 'activity' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto py-2">
                {workflowSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => handleSessionSelect(session)}
                    className="w-full px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 flex-shrink-0 ${session.workflowStatus === 'in-progress' ? 'text-blue-500' : 'text-emerald-500'}`}>
                        {session.workflowStatus === 'in-progress'
                          ? <AlertTriangle className="w-3.5 h-3.5" />
                          : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">{session.title}</div>
                        <div className="text-[11px] text-gray-500 truncate mt-0.5">{session.preview}</div>
                        {session.workflowSteps && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${session.workflowStatus === 'completed' ? 'bg-emerald-400' : 'bg-blue-400'}`}
                                style={{ width: `${(session.workflowSteps.current / session.workflowSteps.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {session.workflowSteps.current}/{session.workflowSteps.total}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors">
                  <Zap className="w-3.5 h-3.5" />
                  Run a workflow
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
