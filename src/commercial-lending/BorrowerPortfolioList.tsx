import { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, ChevronDown, ChevronRight, Sparkles, Plus, X, Upload, FileText, Check, FolderOpen, Settings } from 'lucide-react';
import type { SelectedBorrower } from '../CommercialLendingWorkspace';
import { WorkflowPanel } from './WorkflowPanel';
import { WorkflowDetailInline } from './WorkflowDetailInline';
import { CommercialLendingChat } from './CommercialLendingChat';

interface AgentSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface BorrowerPortfolioListProps {
  onBorrowerSelect: (borrower: SelectedBorrower) => void;
  onBack: () => void;
  onWorkflowOpen?: (workflowId: string, workflowName: string) => void;
  onSettingsOpen?: () => void;
  onSessionCreated?: (session: AgentSession) => void;
}

interface BorrowerFacility {
  id: string;
  noteNumber: string;
  loanType: string;
  balance: number;
  commitment: number;
  interestRate: string;
  maturityDate: string;
  assetClass: string;
  status: 'Active' | 'Renewal' | 'Payoff';
}

interface Borrower {
  id: string;
  name: string;
  cipCode: string;
  relationshipId: string;
  noteNumber: string;
  assetClass: string;
  totalCreditExposure: number;
  commitment: number;
  totalDepositBalance: number;
  loanOfficer: string;
  underwriter: string;
  maturityDate: string;
  status: 'Active' | 'Renewal' | 'Payoff';
  facilities: BorrowerFacility[];
  dateAdded: string;
}

const mockBorrowers: Borrower[] = [
  {
    id: '1',
    name: 'VFN Holdings Inc',
    cipCode: 'DCBLOX',
    relationshipId: '42-789456',
    noteNumber: '20240001-001',
    assetClass: 'Data Center',
    totalCreditExposure: 9800000,
    commitment: 10000000,
    totalDepositBalance: 1250000,
    loanOfficer: 'Sarah Chen',
    underwriter: 'Michael Park',
    maturityDate: '2027-12-15',
    status: 'Active',
    facilities: [
      {
        id: '1',
        noteNumber: '20240001-001',
        loanType: 'Term Loan',
        balance: 9800000,
        commitment: 10000000,
        interestRate: 'Term SOFR + 3.50%',
        maturityDate: '2027-12-15',
        assetClass: 'Data Center',
        status: 'Active'
      }
    ],
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    name: 'GH3 Cler SNU',
    cipCode: 'GH3CLE',
    relationshipId: '38-654321',
    noteNumber: '20230045-001',
    assetClass: 'CRE — Office',
    totalCreditExposure: 5250000,
    commitment: 5500000,
    totalDepositBalance: 875000,
    loanOfficer: 'Michael Torres',
    underwriter: 'Lisa Zhang',
    maturityDate: '2026-08-30',
    status: 'Renewal',
    facilities: [
      {
        id: '2',
        noteNumber: '20230045-001',
        loanType: 'Senior Loan',
        balance: 4750000,
        commitment: 5000000,
        interestRate: '5.68% Fixed',
        maturityDate: '2026-08-30',
        assetClass: 'CRE — Office',
        status: 'Renewal'
      },
      {
        id: '3',
        noteNumber: '20240112-001',
        loanType: 'RLOC',
        balance: 500000,
        commitment: 500000,
        interestRate: 'Prime + 1.00%',
        maturityDate: '2027-02-15',
        assetClass: 'CRE — Office',
        status: 'Active'
      },
      {
        id: 'gh3-deposit-1',
        noteNumber: '99923847-001',
        loanType: 'Operating Deposit',
        balance: 875000,
        commitment: 0,
        interestRate: '0.50%',
        maturityDate: '2026-08-30',
        assetClass: 'Deposit',
        status: 'Active'
      }
    ],
    dateAdded: '2023-10-20'
  },
  {
    id: '3',
    name: 'Fibernet Solutions LLC',
    cipCode: 'FIBERN',
    relationshipId: '51-123789',
    noteNumber: '20240078-001',
    assetClass: 'Fiber/Telecom',
    totalCreditExposure: 12500000,
    commitment: 15000000,
    totalDepositBalance: 2100000,
    loanOfficer: 'Jennifer Wu',
    underwriter: 'David Kim',
    maturityDate: '2028-06-01',
    status: 'Active',
    facilities: [
      {
        id: '4',
        noteNumber: '20240078-001',
        loanType: 'Senior Loan',
        balance: 12000000,
        commitment: 12000000,
        interestRate: 'Term SOFR + 4.25%',
        maturityDate: '2028-06-01',
        assetClass: 'Fiber/Telecom',
        status: 'Active'
      },
      {
        id: '5',
        noteNumber: '20240079-001',
        loanType: 'DDTL',
        balance: 500000,
        commitment: 3000000,
        interestRate: 'Term SOFR + 4.75%',
        maturityDate: '2028-06-01',
        assetClass: 'Fiber/Telecom',
        status: 'Active'
      },
      {
        id: 'fiber-capex',
        noteNumber: '20240215-001',
        loanType: 'CapEx Loan',
        balance: 2500000,
        commitment: 3000000,
        interestRate: 'Term SOFR + 3.85%',
        maturityDate: '2029-12-31',
        assetClass: 'Fiber/Telecom',
        status: 'Active'
      },
      {
        id: 'fiber-deposit-1',
        noteNumber: '99967234-001',
        loanType: 'Operating Deposit',
        balance: 1600000,
        commitment: 0,
        interestRate: '0.75%',
        maturityDate: '2028-06-01',
        assetClass: 'Deposit',
        status: 'Active'
      },
      {
        id: 'fiber-deposit-2',
        noteNumber: '99967891-001',
        loanType: 'Money Market Deposit',
        balance: 500000,
        commitment: 0,
        interestRate: '1.25%',
        maturityDate: '2028-06-01',
        assetClass: 'Deposit',
        status: 'Active'
      }
    ],
    dateAdded: '2024-02-28'
  },
  {
    id: '4',
    name: 'Retail Plaza Holdings',
    cipCode: 'RETAIL',
    relationshipId: '29-456123',
    noteNumber: '20230122-001',
    assetClass: 'CRE — Retail',
    totalCreditExposure: 8200000,
    commitment: 8500000,
    totalDepositBalance: 560000,
    loanOfficer: 'David Park',
    underwriter: 'Rachel Martinez',
    maturityDate: '2027-03-31',
    status: 'Active',
    facilities: [
      {
        id: '6',
        noteNumber: '20230122-001',
        loanType: 'Term Loan',
        balance: 8200000,
        commitment: 8500000,
        interestRate: '6.25% Fixed',
        maturityDate: '2027-03-31',
        assetClass: 'CRE — Retail',
        status: 'Active'
      }
    ],
    dateAdded: '2023-11-10'
  },
  {
    id: '5',
    name: 'Healthcare Properties Inc',
    cipCode: 'HEALTH',
    relationshipId: '67-892345',
    noteNumber: '20240055-001',
    assetClass: 'CRE — Healthcare',
    totalCreditExposure: 6750000,
    commitment: 7000000,
    totalDepositBalance: 980000,
    loanOfficer: 'Sarah Chen',
    underwriter: 'James Thompson',
    maturityDate: '2028-09-15',
    status: 'Active',
    facilities: [
      {
        id: '7',
        noteNumber: '20240055-001',
        loanType: 'Term Loan',
        balance: 6750000,
        commitment: 7000000,
        interestRate: 'Term SOFR + 2.75%',
        maturityDate: '2028-09-15',
        assetClass: 'CRE — Healthcare',
        status: 'Active'
      }
    ],
    dateAdded: '2024-03-15'
  }
];

export function BorrowerPortfolioList({ onBorrowerSelect, onBack, onWorkflowOpen, onSettingsOpen, onSessionCreated }: BorrowerPortfolioListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBorrowers, setExpandedBorrowers] = useState<Set<string>>(new Set());

  // Tab state
  const [activeTab, setActiveTab] = useState<'records' | 'workflows' | 'chat'>('chat');
  const [chatStarted, setChatStarted] = useState(false);

  // Workflow detail state
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedWorkflowName, setSelectedWorkflowName] = useState<string>('');

  // New record modal states
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);

  // Records workspace
  const [selectedRecordsForChat, setSelectedRecordsForChat] = useState<Borrower[]>([]);
  const [recordsChatMessages, setRecordsChatMessages] = useState<{id: string; role: 'user'|'assistant'; content: string}[]>([]);
  const [recordsChatInput, setRecordsChatInput] = useState('');
  const [activeDossierTab, setActiveDossierTab] = useState<string | null>(null);
  const [recordsIsThinking, setRecordsIsThinking] = useState(false);
  const recordsChatEndRef = useRef<HTMLDivElement>(null);
  const [newRecordStep, setNewRecordStep] = useState<'method' | 'upload'>('method');
  const [uploadedRecordDocs, setUploadedRecordDocs] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [isProcessingRecord, setIsProcessingRecord] = useState(false);
  const newRecordFileInputRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);

  const recordChatSuggestions = [
    "What's the current DSCR?",
    'Any open covenant exceptions?',
    'When does this deal mature?',
    'Show recent documents',
    'Summarize key risk factors',
  ];

  const toggleRecordForChat = (b: Borrower) => {
    setSelectedRecordsForChat(prev => {
      const exists = prev.some(r => r.id === b.id);
      if (exists) {
        const next = prev.filter(r => r.id !== b.id);
        if (activeDossierTab === b.id && next.length > 0) setActiveDossierTab(next[0].id);
        return next;
      } else {
        if (prev.length === 0) setActiveDossierTab(b.id);
        return [...prev, b];
      }
    });
  };

  const sendRecordsChat = (queryOverride?: string) => {
    const q = (queryOverride ?? recordsChatInput).trim();
    if (!q) return;
    setRecordsChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q }]);
    setRecordsChatInput('');
    setRecordsIsThinking(true);
    setTimeout(() => {
      const names = selectedRecordsForChat.map(r => r.name).join(' and ');
      const lq = q.toLowerCase();
      let response = '';
      if (lq.includes('dscr') || lq.includes('debt service')) {
        response = `The DSCR for **${names}** is 1.42x as of the most recent review, which is above the covenant minimum of 1.25x.`;
      } else if (lq.includes('covenant') || lq.includes('exception')) {
        response = `No open covenant exceptions on file for **${names}**. Last covenant review completed 12/15/2024.`;
      } else if (lq.includes('matur')) {
        response = selectedRecordsForChat.length === 1
          ? `The primary facility for **${names}** matures on ${formatDate(selectedRecordsForChat[0].maturityDate)}.`
          : selectedRecordsForChat.map(r => `**${r.name}**: ${formatDate(r.maturityDate)}`).join('\n');
      } else if (lq.includes('document') || lq.includes('file')) {
        response = `Found 4 documents on file for **${names}**: Term Sheet (01/15/2024), Financial Statements Q4 2024, Appraisal Report (08/10/2024), Credit Agreement (01/15/2024).`;
      } else if (lq.includes('risk')) {
        response = `Key risk factors for **${names}**: (1) Sector concentration in ${selectedRecordsForChat[0].assetClass}, (2) Upcoming maturity requiring refinancing, (3) Interest rate sensitivity given floating rate structure.`;
      } else {
        response = `Based on available data for **${names}**: the relationship is ${selectedRecordsForChat[0].status} with total credit exposure of ${formatCurrency(selectedRecordsForChat[0].totalCreditExposure)} across ${selectedRecordsForChat[0].facilities.length} facilities. What would you like to explore?`;
      }
      setRecordsChatMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: response }]);
      setRecordsIsThinking(false);
    }, 900);
  };

  const handleStartWorkflow = (workflowId: string) => {
    const name = workflowId === 'deal-qa' ? 'Deal QA' : 'Annual Review';
    setSelectedWorkflowId(workflowId);
    setSelectedWorkflowName(name);
  };

  const toggleBorrowerExpansion = (borrowerId: string) => {
    const newExpanded = new Set(expandedBorrowers);
    if (newExpanded.has(borrowerId)) {
      newExpanded.delete(borrowerId);
    } else {
      newExpanded.add(borrowerId);
    }
    setExpandedBorrowers(newExpanded);
  };

  const filteredBorrowers = mockBorrowers.filter(borrower =>
    !searchQuery ||
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.noteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.cipCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll records chat
  useEffect(() => {
    recordsChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [recordsChatMessages, recordsIsThinking]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: back + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {chatStarted ? (
              // Inside active chat: back exits to workspace landing
              <>
                <button
                  onClick={() => setChatStarted(false)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 pl-8 sm:pl-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Commercial Lending</span>
                </button>
                <span className="text-gray-300 hidden sm:inline">/</span>
                <button
                  onClick={onBack}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors hidden sm:block flex-shrink-0"
                >
                  Agents
                </button>
              </>
            ) : (
              // On landing: back goes to agents list
              <>
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 pl-8 sm:pl-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Agents</span>
                </button>
                <span className="text-gray-300 hidden sm:inline">/</span>
                <h1 className="text-sm text-gray-900 truncate hidden sm:block flex-shrink-0">Commercial Lending</h1>
              </>
            )}
          </div>

          {/* Center: pill toggle — hidden once chat is started */}
          {!(activeTab === 'chat' && chatStarted) && (
            <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 flex-shrink-0">
              {(['chat', 'records', 'workflows'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 font-medium shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Right: settings */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={onSettingsOpen}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Tab — full-height, manages its own scroll */}
      {activeTab === 'chat' && (
        <div className="flex-1 overflow-hidden">
          <CommercialLendingChat onChatStarted={() => setChatStarted(true)} onSessionCreated={onSessionCreated} />
        </div>
      )}

      {/* Records split-pane workspace — visible when records selected */}
      {activeTab === 'records' && selectedRecordsForChat.length > 0 && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left chat panel */}
          <div className="w-[380px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white">
            {/* Selected record pills + Clear */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {selectedRecordsForChat.map(r => (
                  <span key={r.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#eef2f0] text-[#455a4f] text-xs rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#455a4f] flex-shrink-0" />
                    {r.name}
                    <button onClick={() => toggleRecordForChat(r)} className="ml-0.5 hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={() => { setSelectedRecordsForChat([]); setRecordsChatMessages([]); setActiveDossierTab(null); }}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
              >
                Clear
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {recordsChatMessages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    {selectedRecordsForChat.length === 1
                      ? `Ask anything about ${selectedRecordsForChat[0].name}`
                      : `Ask across ${selectedRecordsForChat.length} records`}
                  </p>
                  <div className="flex flex-col gap-2">
                    {recordChatSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendRecordsChat(s)}
                        className="text-left px-3 py-2 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recordsChatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-md bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
                        msg.role === 'user'
                          ? 'bg-white border border-gray-200 text-gray-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {recordsIsThinking && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#455a4f] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex gap-1 px-3 py-2 bg-gray-100 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={recordsChatEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-[#E05C3A] transition-colors">
                <Sparkles className="w-4 h-4 text-[#455a4f] flex-shrink-0 mb-0.5" />
                <textarea
                  rows={1}
                  placeholder="Ask about these records…"
                  value={recordsChatInput}
                  onChange={e => setRecordsChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendRecordsChat();
                    }
                  }}
                  className="flex-1 resize-none text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => sendRecordsChat()}
                  disabled={!recordsChatInput.trim()}
                  className="flex-shrink-0 w-7 h-7 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right dossier panel */}
          <div className="flex-1 overflow-y-auto bg-[#f5f5f3]">
            {/* Tabs if multiple records */}
            {selectedRecordsForChat.length > 1 && (
              <div className="bg-white border-b border-gray-200 px-6 flex gap-0">
                {selectedRecordsForChat.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveDossierTab(r.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeDossierTab === r.id
                        ? 'border-[#455a4f] text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}

            {/* Dossier content */}
            {(() => {
              const active = selectedRecordsForChat.find(r => r.id === activeDossierTab) ?? selectedRecordsForChat[0];
              if (!active) return null;
              const statusColor = active.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : active.status === 'Renewal'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800';
              return (
                <div className="p-6 max-w-3xl">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-medium text-gray-900">{active.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        CIP: {active.cipCode} &nbsp;·&nbsp; Rel ID: {active.relationshipId} &nbsp;·&nbsp; {active.assetClass}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${statusColor}`}>
                      {active.status}
                    </span>
                  </div>

                  {/* Key metrics grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Total Exposure', value: formatCurrency(active.totalCreditExposure) },
                      { label: 'Commitment', value: formatCurrency(active.commitment) },
                      { label: 'Deposit Balance', value: formatCurrency(active.totalDepositBalance) },
                    ].map(m => (
                      <div key={m.label} className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                        <p className="text-lg font-medium text-gray-900">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Team */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Team</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Loan Officer</p>
                        <p className="text-sm text-gray-900">{active.loanOfficer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Underwriter</p>
                        <p className="text-sm text-gray-900">{active.underwriter}</p>
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facilities</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Note #</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Type</th>
                            <th className="px-4 py-2 text-right text-xs text-gray-500">Balance</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Rate</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Maturity</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {active.facilities.map(f => {
                            const fStatusColor = f.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : f.status === 'Renewal'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800';
                            return (
                              <tr key={f.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <td className="px-4 py-3 text-xs text-gray-900 font-mono">{f.noteNumber}</td>
                                <td className="px-4 py-3 text-xs text-gray-700">{f.loanType}</td>
                                <td className="px-4 py-3 text-xs text-gray-900 text-right">{formatCurrency(f.balance)}</td>
                                <td className="px-4 py-3 text-xs text-gray-700">{f.interestRate}</td>
                                <td className="px-4 py-3 text-xs text-gray-700">{formatDate(f.maturityDate)}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${fStatusColor}`}>{f.status}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Records default list + Workflows tab */}
      {(activeTab === 'workflows' || (activeTab === 'records' && selectedRecordsForChat.length === 0)) && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {/* Processing Indicator */}
          {isProcessingRecord && (
            <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-[#455a4f] rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#455a4f] rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Processing Documents and Creating a New Record</h4>
                  <p className="text-xs text-gray-600">
                    You may close this page. The new record will appear when processing is complete.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Workflows Tab Content */}
          {activeTab === 'workflows' && (
            <>
              {!selectedWorkflowId ? (
                <WorkflowPanel
                  borrowerName="Portfolio"
                  onStartWorkflow={handleStartWorkflow}
                  onWorkflowOpen={(workflowId, workflowName) => {
                    setSelectedWorkflowId(workflowId);
                    setSelectedWorkflowName(workflowName);
                  }}
                />
              ) : (
                <WorkflowDetailInline
                  workflowId={selectedWorkflowId}
                  workflowName={selectedWorkflowName}
                  onBack={() => {
                    setSelectedWorkflowId(null);
                    setSelectedWorkflowName('');
                  }}
                />
              )}
            </>
          )}

          {/* Records Tab Content */}
          {activeTab === 'records' && (
            <>
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg text-gray-900">Records</h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:w-80 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowNewRecordModal(true);
                      setNewRecordStep('method');
                      setUploadedRecordDocs([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    New Record
                  </button>
                </div>
              </div>

              {/* Portfolio Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 w-8" />
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Record</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBorrowers.map((borrower) => {
                        const isChecked = selectedRecordsForChat.some(r => r.id === borrower.id);
                        return (
                          <tr key={borrower.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 w-8">
                              <button
                                onClick={() => toggleRecordForChat(borrower)}
                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-[#455a4f] border-[#455a4f]'
                                    : 'border-gray-300 hover:border-[#455a4f]'
                                }`}
                              >
                                {isChecked && (
                                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              {borrower.id === '1' ? (
                                <button
                                  onClick={() => onBorrowerSelect({
                                    id: borrower.id,
                                    name: borrower.name,
                                    cipCode: borrower.cipCode,
                                    relationshipId: borrower.relationshipId,
                                    noteNumber: borrower.noteNumber,
                                    loanOfficer: borrower.loanOfficer,
                                    underwriter: borrower.underwriter,
                                    facilities: borrower.facilities
                                  })}
                                  className="text-sm text-[#455a4f] hover:underline cursor-pointer"
                                >
                                  {borrower.name}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-900">{borrower.name}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(borrower.dateAdded)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* New Record Modal */}
      {showNewRecordModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => {
              setShowNewRecordModal(false);
              setNewRecordStep('method');
              setUploadedRecordDocs([]);
            }}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Add New Record</h2>
                    
                  </div>
                  <button
                    onClick={() => {
                      setShowNewRecordModal(false);
                      setNewRecordStep('method');
                      setUploadedRecordDocs([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Step 1: Choose Method */}
                {newRecordStep === 'method' && (
                  <div className="space-y-4">
                    {/* Connect Data Source Option - Coming Soon */}
                    <div className="relative border-2 border-gray-200 rounded-lg p-6 bg-gray-50 opacity-60 cursor-not-allowed">
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-gray-400 text-white text-xs font-medium rounded">Coming Soon</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-700 mb-2">Connect Data Source</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Connect your folder and automatically pull in all relevant deal documents.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Check className="w-4 h-4" />
                            <span>Automatic document discovery</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Check className="w-4 h-4" />
                            <span>Real-time sync</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Manual Upload Option - Active */}
                    <button
                      onClick={() => setNewRecordStep('upload')}
                      className="w-full border-2 border-[#455a4f] rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#455a4f] rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Manual Upload</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Upload documents from your computer. AI will extract all relevant information.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Check className="w-4 h-4" />
                            <span>Upload multiple files at once</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                            <Check className="w-4 h-4" />
                            <span>AI-powered borrower identification</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Step 2: Upload Documents */}
                {newRecordStep === 'upload' && (
                  <div className="space-y-4 flex flex-col h-full">
                    

                    <div
                      onClick={() => newRecordFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#455a4f] hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-base text-gray-900 mb-1 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 50MB each</p>
                      
                      <input
                        ref={newRecordFileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files);
                            const newDocs = files.map(f => ({
                              name: f.name,
                              type: f.name.endsWith('.pdf') ? 'PDF' : 'Document',
                              size: `${(f.size / 1024 / 1024).toFixed(1)} MB`
                            }));
                            setUploadedRecordDocs([...uploadedRecordDocs, ...newDocs]);
                          }
                        }}
                      />
                    </div>

                    {uploadedRecordDocs.length > 0 && (
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-900">Uploaded Documents ({uploadedRecordDocs.length})</h3>
                          <button
                            onClick={() => setUploadedRecordDocs([])}
                            className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                          {uploadedRecordDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                  <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => setUploadedRecordDocs(uploadedRecordDocs.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <button
                            onClick={() => {
                              // Start processing
                              setIsProcessingRecord(true);
                              setShowNewRecordModal(false);
                              setUploadedRecordDocs([]);
                              setNewRecordStep('method');
                              
                              // Simulate AI processing completion after 5 seconds
                              setTimeout(() => {
                                setIsProcessingRecord(false);
                                // In real implementation, this would add the record to the list
                              }, 5000);
                            }}
                            disabled={uploadedRecordDocs.length === 0}
                            className="w-full px-6 py-3 bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              Submit & Process with AI
                            </span>
                          </button>
                          
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <CommercialLendingSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}