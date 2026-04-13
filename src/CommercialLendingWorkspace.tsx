import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { BorrowerPortfolioList } from './commercial-lending/BorrowerPortfolioList';
import { BorrowerDealView } from './commercial-lending/BorrowerDealView';
import { WorkflowDetailView } from './commercial-lending/WorkflowDetailView';
import { CommercialLendingSettings } from './commercial-lending/CommercialLendingSettings';

interface CommercialLendingWorkspaceProps {
  onBack: () => void;
}

export type CLView = 'portfolio' | 'deal-view' | 'workflow-detail' | 'settings';

export interface Facility {
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

export interface SelectedBorrower {
  id: string;
  name: string;
  cipCode: string;
  relationshipId?: string;
  noteNumber: string;
  riskRating: number;
  riskRatingLabel: string;
  loanOfficer?: string;
  underwriter?: string;
  facilities?: Facility[];
}

type RecordTab = { type: 'record'; borrower: SelectedBorrower };
type AggregateTab = { type: 'aggregate'; id: string; label: string; records: SelectedBorrower[] };
type TabItem = RecordTab | AggregateTab;

const MAX_VISIBLE_TABS = 4;

function AggregateChat({ records, onClose }: { records: SelectedBorrower[]; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
    {
      id: 'intro',
      role: 'assistant',
      content: `I'm ready to answer questions across all ${records.length} selected records. You can ask portfolio-level questions like "flag any records with upcoming maturities" or "summarize risk ratings across this selection."`,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const lower = text.toLowerCase();
    let response = '';

    if (lower.includes('maturity') || lower.includes('maturities')) {
      const upcoming = records.filter(r => {
        const fac = r.facilities?.[0];
        if (!fac) return false;
        const d = new Date(fac.maturityDate);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + 90);
        return d <= cutoff && d >= new Date();
      });
      response = upcoming.length > 0
        ? `${upcoming.length} of the ${records.length} selected records have maturities in the next 90 days:\n\n${upcoming.map(r => `• ${r.name}`).join('\n')}`
        : `None of the ${records.length} selected records have maturities in the next 90 days.`;
    } else if (lower.includes('risk') && (lower.includes('4') || lower.includes('5') || lower.includes('high'))) {
      const high = records.filter(r => r.riskRating >= 4);
      response = high.length > 0
        ? `${high.length} records with risk rating 4 or 5:\n\n${high.map(r => `• ${r.name} — Risk ${r.riskRating} (${r.riskRatingLabel})`).join('\n')}`
        : `No records in this selection have a risk rating of 4 or 5.`;
    } else if (lower.includes('exposure') || lower.includes('total')) {
      const total = records.reduce((sum, r) => {
        const bal = r.facilities?.reduce((s, f) => s + f.balance, 0) ?? 0;
        return sum + bal;
      }, 0);
      const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total);
      response = `Total credit exposure across ${records.length} selected records: **${fmt}**\n\nAverage per record: **${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total / records.length)}**`;
    } else if (lower.includes('renewal') || lower.includes('status')) {
      const byStatus: Record<string, string[]> = {};
      records.forEach(r => {
        const status = r.facilities?.[0]?.status ?? 'Unknown';
        if (!byStatus[status]) byStatus[status] = [];
        byStatus[status].push(r.name);
      });
      response = `Status breakdown across ${records.length} records:\n\n${Object.entries(byStatus).map(([s, names]) => `• **${s}** — ${names.length} record${names.length !== 1 ? 's' : ''}`).join('\n')}`;
    } else {
      response = `Analyzing across ${records.length} records. In a production deployment Titan's banking SLM would query all selected records in parallel and synthesize a response here. Try asking about maturities, risk ratings, total exposure, or status.`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: response }]);
    }, 600);
  };

  const suggested = [
    'Which have maturities in the next 90 days?',
    'Flag records with risk rating 4 or 5',
    'What is the total exposure?',
    'Summarize status breakdown',
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#455a4f]" />
            <h2 className="text-sm font-semibold text-gray-900">Chatting across {records.length} records</h2>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {records.slice(0, 5).map(r => (
              <span key={r.id} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.name}</span>
            ))}
            {records.length > 5 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{records.length - 5} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#ff6b5a] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-xl rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-[#455a4f] text-white'
                : 'bg-gray-50 border border-gray-200 text-gray-900'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested + Input */}
      <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suggested.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent"
            placeholder={`Ask about these ${records.length} records...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommercialLendingWorkspace({ onBack }: CommercialLendingWorkspaceProps) {
  const [currentView, setCurrentView] = useState<CLView>('portfolio');
  const [selectedBorrower, setSelectedBorrower] = useState<SelectedBorrower | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedWorkflowName, setSelectedWorkflowName] = useState<string>('');

  // Tab state
  const [openTabs, setOpenTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('portfolio');
  const [showOverflow, setShowOverflow] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  // Close overflow dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setShowOverflow(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBorrowerSelect = (borrower: SelectedBorrower) => {
    // If already open, just activate
    const existing = openTabs.find(t => t.type === 'record' && t.borrower.id === borrower.id);
    if (!existing) {
      setOpenTabs(prev => [...prev, { type: 'record', borrower }]);
    }
    setActiveTabId(borrower.id);
    setSelectedBorrower(borrower);
    setCurrentView('deal-view');
  };

  const handleOpenInTabs = (borrowers: SelectedBorrower[]) => {
    const newTabs: TabItem[] = borrowers
      .filter(b => !openTabs.find(t => t.type === 'record' && t.borrower.id === b.id))
      .map(b => ({ type: 'record' as const, borrower: b }));
    setOpenTabs(prev => [...prev, ...newTabs]);
    // Activate the first one
    const first = borrowers[0];
    setActiveTabId(first.id);
    setSelectedBorrower(first);
    setCurrentView('deal-view');
  };

  const handleChatWithRecords = (borrowers: SelectedBorrower[]) => {
    const id = `aggregate-${Date.now()}`;
    const tab: AggregateTab = {
      type: 'aggregate',
      id,
      label: `${borrowers.length} Records`,
      records: borrowers,
    };
    setOpenTabs(prev => [...prev, tab]);
    setActiveTabId(id);
    setCurrentView('deal-view'); // reuse deal-view slot; content driven by activeTabId
  };

  const handleTabClick = (tab: TabItem) => {
    const id = tab.type === 'record' ? tab.borrower.id : tab.id;
    setActiveTabId(id);
    setShowOverflow(false);
    if (tab.type === 'record') {
      setSelectedBorrower(tab.borrower);
      setCurrentView('deal-view');
    } else {
      setCurrentView('deal-view');
    }
  };

  const handleTabClose = (tab: TabItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = tab.type === 'record' ? tab.borrower.id : tab.id;
    const newTabs = openTabs.filter(t => (t.type === 'record' ? t.borrower.id : t.id) !== id);
    setOpenTabs(newTabs);

    if (activeTabId === id) {
      if (newTabs.length > 0) {
        const last = newTabs[newTabs.length - 1];
        const lastId = last.type === 'record' ? last.borrower.id : last.id;
        setActiveTabId(lastId);
        if (last.type === 'record') {
          setSelectedBorrower(last.borrower);
          setCurrentView('deal-view');
        }
      } else {
        setActiveTabId('portfolio');
        setSelectedBorrower(null);
        setCurrentView('portfolio');
      }
    }
  };

  const handleBackToPortfolio = () => {
    setActiveTabId('portfolio');
    setSelectedBorrower(null);
    setCurrentView('portfolio');
  };

  const handleWorkflowOpen = (workflowId: string, workflowName: string) => {
    setSelectedWorkflowId(workflowId);
    setSelectedWorkflowName(workflowName);
    setCurrentView('workflow-detail');
  };

  const handleBackFromWorkflow = () => {
    setSelectedWorkflowId(null);
    setSelectedWorkflowName('');
    setCurrentView('portfolio');
  };

  const handleStartWorkflow = (workflowId: string) => {
    console.log('Starting workflow:', workflowId);
  };

  const handleSettingsOpen = () => setCurrentView('settings');
  const handleBackFromSettings = () => setCurrentView('portfolio');

  // Tab bar visibility: show when any tabs are open and not in overlay views
  const showTabBar = openTabs.length > 0 && currentView !== 'settings' && currentView !== 'workflow-detail';
  const visibleTabs = openTabs.slice(0, MAX_VISIBLE_TABS);
  const overflowTabs = openTabs.slice(MAX_VISIBLE_TABS);

  // Determine what content to render when currentView === 'deal-view'
  const activeTab = openTabs.find(t => (t.type === 'record' ? t.borrower.id : t.id) === activeTabId);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3] overflow-hidden">
      {/* Tab Bar */}
      {showTabBar && (
        <div className="bg-white border-b border-gray-200 flex items-center px-2 h-9 flex-shrink-0 gap-0.5">
          {/* Records (home) tab */}
          <button
            onClick={() => { setActiveTabId('portfolio'); setCurrentView('portfolio'); }}
            className={`h-full px-3 text-xs font-medium rounded-t transition-colors flex items-center gap-1.5 ${
              activeTabId === 'portfolio'
                ? 'bg-gray-100 text-gray-900 border-b-2 border-[#455a4f]'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Records
          </button>

          <div className="w-px h-4 bg-gray-200 mx-0.5" />

          {/* Visible record/aggregate tabs */}
          {visibleTabs.map(tab => {
            const id = tab.type === 'record' ? tab.borrower.id : tab.id;
            const label = tab.type === 'record' ? tab.borrower.name : tab.label;
            const isActive = activeTabId === id;
            return (
              <button
                key={id}
                onClick={() => handleTabClick(tab)}
                className={`h-full px-3 text-xs rounded-t transition-colors flex items-center gap-1.5 max-w-[160px] group ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border-b-2 border-[#455a4f]'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.type === 'aggregate' && <MessageSquare className="w-3 h-3 flex-shrink-0" />}
                <span className="truncate">{label}</span>
                <span
                  onClick={e => handleTabClose(tab, e)}
                  className="ml-0.5 p-0.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              </button>
            );
          })}

          {/* Overflow dropdown */}
          {overflowTabs.length > 0 && (
            <div className="relative" ref={overflowRef}>
              <button
                onClick={() => setShowOverflow(v => !v)}
                className={`h-8 px-2.5 text-xs rounded transition-colors flex items-center gap-1 ${
                  showOverflow ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                +{overflowTabs.length} more
                <ChevronDown className="w-3 h-3" />
              </button>
              {showOverflow && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  {overflowTabs.map(tab => {
                    const id = tab.type === 'record' ? tab.borrower.id : tab.id;
                    const label = tab.type === 'record' ? tab.borrower.name : tab.label;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer group"
                        onClick={() => handleTabClick(tab)}
                      >
                        <span className="text-xs text-gray-700 truncate">{label}</span>
                        <span
                          onClick={e => handleTabClose(tab, e)}
                          className="p-0.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {(currentView === 'portfolio' || activeTabId === 'portfolio') && currentView !== 'deal-view' && currentView !== 'workflow-detail' && currentView !== 'settings' && (
          <BorrowerPortfolioList
            onBorrowerSelect={handleBorrowerSelect}
            onBack={onBack}
            onWorkflowOpen={handleWorkflowOpen}
            onSettingsOpen={handleSettingsOpen}
            onOpenInTabs={handleOpenInTabs}
            onChatWithRecords={handleChatWithRecords}
          />
        )}

        {currentView === 'deal-view' && activeTab?.type === 'record' && (
          <BorrowerDealView
            borrower={activeTab.borrower}
            onBack={handleBackToPortfolio}
          />
        )}

        {currentView === 'deal-view' && activeTab?.type === 'aggregate' && (
          <AggregateChat
            records={activeTab.records}
            onClose={handleBackToPortfolio}
          />
        )}

        {currentView === 'workflow-detail' && selectedWorkflowId && (
          <WorkflowDetailView
            workflowId={selectedWorkflowId}
            workflowName={selectedWorkflowName}
            onStartWorkflow={handleStartWorkflow}
          />
        )}

        {currentView === 'settings' && (
          <CommercialLendingSettings
            onBack={handleBackFromSettings}
          />
        )}
      </div>
    </div>
  );
}
