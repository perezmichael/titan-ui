import { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Settings, ArrowLeft, Sparkles, Send, FileText,
  ChevronRight, X, Upload, CheckCircle2, AlertCircle, Info, Pencil
} from 'lucide-react';
import { CommercialLendingSettings } from './commercial-lending/CommercialLendingSettings';
import { WorkflowDetailInline } from './commercial-lending/WorkflowDetailInline';

interface CommercialLendingWorkspaceProps {
  onBack: () => void;
  initialBorrowerId?: string;
}

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

export type CLView = 'portfolio' | 'deal-view' | 'workflow-detail' | 'settings';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DealField {
  label: string;
  value: string;
  category: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockBorrowers: SelectedBorrower[] = [
  {
    id: '1', name: 'VFN Holdings Inc', cipCode: 'DCBLOX', relationshipId: '42-789456',
    noteNumber: '20240001-001', riskRating: 2, riskRatingLabel: 'Strong',
    loanOfficer: 'Sarah Chen', underwriter: 'Michael Park',
    facilities: [
      { id: '1', noteNumber: '20240001-001', loanType: 'Term Loan', balance: 9800000, commitment: 10000000, interestRate: 'Term SOFR + 3.50%', maturityDate: '2027-12-15', assetClass: 'Data Center', status: 'Active' },
    ],
  },
  {
    id: '2', name: 'GH3 Cler SNU', cipCode: 'GH3CLE', relationshipId: '38-654321',
    noteNumber: '20230045-001', riskRating: 3, riskRatingLabel: 'Strong Satisfactory',
    loanOfficer: 'Michael Torres', underwriter: 'Lisa Zhang',
    facilities: [
      { id: '2', noteNumber: '20230045-001', loanType: 'Senior Loan', balance: 4750000, commitment: 5000000, interestRate: '5.68% Fixed', maturityDate: '2026-08-30', assetClass: 'CRE — Office', status: 'Renewal' },
    ],
  },
  {
    id: '3', name: 'Fibernet Solutions LLC', cipCode: 'FIBERN', relationshipId: '51-123789',
    noteNumber: '20240078-001', riskRating: 2, riskRatingLabel: 'Strong',
    loanOfficer: 'Jennifer Wu', underwriter: 'David Kim',
    facilities: [
      { id: '4', noteNumber: '20240078-001', loanType: 'Senior Loan', balance: 12000000, commitment: 12000000, interestRate: 'Term SOFR + 4.25%', maturityDate: '2028-06-01', assetClass: 'Fiber/Telecom', status: 'Active' },
    ],
  },
  {
    id: '4', name: 'Retail Plaza Holdings', cipCode: 'RETAIL', relationshipId: '29-456123',
    noteNumber: '20230122-001', riskRating: 4, riskRatingLabel: 'Satisfactory',
    loanOfficer: 'David Park', underwriter: 'Rachel Martinez',
    facilities: [
      { id: '6', noteNumber: '20230122-001', loanType: 'Term Loan', balance: 8200000, commitment: 8500000, interestRate: '6.25% Fixed', maturityDate: '2027-03-31', assetClass: 'CRE — Retail', status: 'Active' },
    ],
  },
  {
    id: '5', name: 'Healthcare Properties Inc', cipCode: 'HEALTH', relationshipId: '67-892345',
    noteNumber: '20240055-001', riskRating: 1, riskRatingLabel: 'Superior',
    loanOfficer: 'Sarah Chen', underwriter: 'James Thompson',
    facilities: [
      { id: '7', noteNumber: '20240055-001', loanType: 'Term Loan', balance: 6750000, commitment: 7000000, interestRate: 'Term SOFR + 2.75%', maturityDate: '2028-09-15', assetClass: 'CRE — Healthcare', status: 'Active' },
    ],
  },
];

const dealFieldsForBorrower: Record<string, DealField[]> = {
  '1': [
    { label: 'Transaction Type', value: 'Modification/Extension', category: 'Deal Terms' },
    { label: 'Facility Type', value: 'Term Loan', category: 'Deal Terms' },
    { label: 'Loan Term', value: '60 months', category: 'Deal Terms' },
    { label: 'Maturity Date', value: '12/15/2027', category: 'Deal Terms' },
    { label: 'Interest Rate', value: 'Term SOFR + 3.50%', category: 'Deal Terms' },
    { label: 'Amortization', value: 'I/O then 25-year', category: 'Deal Terms' },
    { label: 'Revenue (TTM)', value: '$32.0M', category: 'Financials' },
    { label: 'EBITDA (TTM)', value: '$1.14B', category: 'Financials' },
    { label: 'Leverage Ratio', value: '5.5x', category: 'Financials' },
    { label: 'DSCR', value: '1.43x', category: 'Financials' },
    { label: 'Financial Stmt Quality', value: 'CPA Audited', category: 'Financials' },
    { label: 'Primary Covenant', value: 'Min DSCR 1.25x', category: 'Covenants' },
    { label: 'Pricing Grid', value: 'Yes', category: 'Covenants' },
    { label: 'Collateral', value: 'First lien on all assets', category: 'Collateral' },
    { label: 'Lien Position', value: '1st', category: 'Collateral' },
    { label: 'Guarantor', value: 'Vero Fiber Networks, LLC', category: 'Collateral' },
    { label: 'Appraised Value', value: '$17.5M', category: 'Collateral' },
    { label: 'Underwriter Rec.', value: 'Approve — RR 4 (Satisfactory)', category: 'Summary' },
    { label: 'HLT Exception', value: 'No', category: 'Summary' },
    { label: 'Critical Exception', value: 'None', category: 'Summary' },
  ],
};

const documentsForBorrower: Record<string, Document[]> = {
  '1': [
    { id: '1', name: 'VFN_Credit_Memo_2026.pdf', type: 'Credit Memo', uploadDate: '3/10/2026', size: '4.2 MB' },
    { id: '2', name: 'VFN_Financials_2025.pdf', type: 'Financial Statements', uploadDate: '3/10/2026', size: '6.8 MB' },
    { id: '3', name: 'Appraisal_Report_2024.pdf', type: 'Appraisal', uploadDate: '3/10/2026', size: '12.1 MB' },
    { id: '4', name: 'Environmental_Phase1.pdf', type: 'Environmental', uploadDate: '3/10/2026', size: '3.4 MB' },
    { id: '5', name: 'UCC_Filing_2024.pdf', type: 'Legal', uploadDate: '3/10/2026', size: '0.8 MB' },
  ],
};

const workflowStatusForBorrower: Record<string, string> = {
  '1': 'Deal QA completed 3/10',
  '2': 'Annual Review due',
  '3': 'Documents uploaded 3/8',
  '4': 'No active workflows',
  '5': 'No active workflows',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const getRiskBadgeClass = (rating: number) => {
  if (rating === 1) return 'bg-green-50 text-green-900 border-green-200';
  if (rating === 2) return 'bg-green-50 text-green-700 border-green-200';
  if (rating === 3) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (rating === 4) return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CommercialLendingWorkspace({ onBack, initialBorrowerId }: CommercialLendingWorkspaceProps) {
  const [selectedBorrower, setSelectedBorrower] = useState<SelectedBorrower | null>(
    () => initialBorrowerId ? (mockBorrowers.find(b => b.id === initialBorrowerId) ?? null) : null
  );
  const [activeTab, setActiveTab] = useState<'fields' | 'documents' | 'workflows'>('fields');
  const [activeWorkflow, setActiveWorkflow] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Select a record on the left to start, or ask me a portfolio question — I can help with maturities, risk ratings, exposure, and more.',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadingDocs, setUploadingDocs] = useState<{ name: string; size: string }[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // When borrower changes, update chat context greeting
  useEffect(() => {
    if (selectedBorrower) {
      setChatMessages([{
        id: 'ctx',
        role: 'assistant',
        content: `Now looking at **${selectedBorrower.name}**. Ask me anything about this deal — DSCR, guarantors, covenants, document details, or kick off a workflow.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }]);
    } else {
      setChatMessages([{
        id: 'portfolio',
        role: 'assistant',
        content: 'Select a record on the left to start, or ask me a portfolio question — I can help with maturities, risk ratings, exposure, and more.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }]);
    }
    setActiveWorkflow(null);
    setActiveTab('fields');
  }, [selectedBorrower?.id]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    const lower = chatInput.toLowerCase();
    let reply = '';
    if (selectedBorrower) {
      if (lower.includes('dscr') || lower.includes('coverage')) reply = `The DSCR for ${selectedBorrower.name} is 1.43x, above the 1.25x minimum covenant threshold. This was verified against the most recent financial statements.`;
      else if (lower.includes('guarantor')) reply = `The guarantor on this facility is Vero Fiber Networks, LLC. They provide a full guarantee on all assets of the borrower per the credit agreement.`;
      else if (lower.includes('apprais')) reply = `The most recent appraisal was dated 11/15/2024 with a value of $17.5M. Note: this appraisal will reach 18 months old in May 2026 — an updated appraisal should be scheduled.`;
      else if (lower.includes('workflow') || lower.includes('deal qa')) { reply = `I can start the Deal QA workflow for ${selectedBorrower.name}. Click the Workflows tab to begin.`; setActiveTab('workflows'); }
      else reply = `Based on the documents uploaded for ${selectedBorrower.name}, I can see the deal is structured as a ${selectedBorrower.facilities?.[0]?.loanType || 'term loan'} at ${selectedBorrower.facilities?.[0]?.interestRate || 'market rate'}. What specific detail would you like to know?`;
    } else {
      if (lower.includes('matur')) reply = `GH3 Cler SNU has the nearest maturity date at 08/30/2026. Retail Plaza Holdings matures 03/31/2027. I can pull the full list sorted by maturity date.`;
      else if (lower.includes('risk')) reply = `Your portfolio has 1 borrower at RR 1 (Superior), 2 at RR 2 (Strong), 1 at RR 3 (Strong Satisfactory), and 1 at RR 4 (Satisfactory). Total exposure: ${formatCurrency(42500000)}.`;
      else reply = `Your portfolio has 5 active borrowers with total credit exposure of ${formatCurrency(42500000)}. Select a record on the left to drill into a specific deal.`;
    }
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, userMsg, assistantMsg]);
    setChatInput('');
  };

  const filteredBorrowers = mockBorrowers.filter(b =>
    !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.noteNumber.includes(searchQuery)
  );

  const dealFields = selectedBorrower ? (dealFieldsForBorrower[selectedBorrower.id] || []) : [];
  const documents = selectedBorrower ? (documentsForBorrower[selectedBorrower.id] || []) : [];
  const fieldCategories = [...new Set(dealFields.map(f => f.category))];

  const suggestedQueries = selectedBorrower
    ? ['What is the current DSCR?', 'List all guarantors', 'Any covenant issues?', 'Start Deal QA']
    : ['Which loans mature in 90 days?', 'Show RR 4 borrowers', 'Total portfolio exposure'];

  if (showSettings) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
        <CommercialLendingSettings onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  // Workflow detail takes over the main content area
  if (activeWorkflow) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
        <div className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
          <button onClick={() => setActiveWorkflow(null)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors pl-8 sm:pl-0">
            <ArrowLeft className="w-4 h-4" />
            Back to {selectedBorrower ? selectedBorrower.name : 'Portfolio'}
          </button>
          <span className="text-sm text-gray-500">{activeWorkflow.name}</span>
          <div className="w-24" />
        </div>
        <div className="flex-1 overflow-hidden px-6 py-6">
          <WorkflowDetailInline
            workflowId={activeWorkflow.id}
            workflowName={activeWorkflow.name}
            onBack={() => setActiveWorkflow(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3] overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors pl-8 sm:pl-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <span className="text-sm text-gray-900 hidden sm:block">Commercial Lending Agent</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
        <div className={`bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-200 ${sidebarOpen ? 'w-[220px]' : 'w-0 overflow-hidden'}`}>
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#455a4f]"
              />
            </div>
          </div>

          {/* Record list */}
          <div className="flex-1 overflow-y-auto py-1">
            {filteredBorrowers.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBorrower(b)}
                className={`w-full px-3 py-2.5 text-left transition-colors border-l-2 ${
                  selectedBorrower?.id === b.id
                    ? 'bg-[#f0f4f2] border-l-[#455a4f]'
                    : 'border-l-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs truncate ${selectedBorrower?.id === b.id ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    {b.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${getRiskBadgeClass(b.riskRating)}`}>
                    {b.riskRating}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                  {workflowStatusForBorrower[b.id] || b.noteNumber}
                </div>
              </button>
            ))}
          </div>

          {/* New Record */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#455a4f] border border-dashed border-[#455a4f]/40 rounded-lg hover:bg-[#f0f4f2] hover:border-[#455a4f] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Record
            </button>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {selectedBorrower ? (
            <>
              {/* Record header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      {/* Sidebar toggle on mobile */}
                      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-gray-400 hover:text-gray-600 rounded sm:hidden">
                        <Search className="w-4 h-4" />
                      </button>
                      <h1 className="text-lg text-gray-900 truncate">{selectedBorrower.name}</h1>
                      <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${getRiskBadgeClass(selectedBorrower.riskRating)}`}>
                        RR {selectedBorrower.riskRating} — {selectedBorrower.riskRatingLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>{selectedBorrower.noteNumber}</span>
                      <span className="text-gray-300">·</span>
                      <span>{selectedBorrower.facilities?.[0]?.assetClass || '—'}</span>
                      <span className="text-gray-300">·</span>
                      <span>Matures {selectedBorrower.facilities?.[0]?.maturityDate || '—'}</span>
                      <span className="text-gray-300">·</span>
                      <span>LO: {selectedBorrower.loanOfficer}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-gray-500">Exposure</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedBorrower.facilities?.reduce((s, f) => s + f.balance, 0) ?? 0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4 -mb-4">
                  {(['fields', 'documents', 'workflows'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs capitalize relative transition-colors ${
                        activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content — scrollable */}
              <div className="flex-1 overflow-y-auto bg-[#f5f5f3]">
                <div className="px-6 py-5">

                  {/* Fields tab */}
                  {activeTab === 'fields' && (
                    <div className="space-y-5">
                      {dealFields.length === 0 ? (
                        <div className="text-center py-16 text-sm text-gray-400">
                          Upload documents to extract deal fields automatically.
                        </div>
                      ) : (
                        fieldCategories.map(cat => (
                          <div key={cat} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{cat}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x-0">
                              {dealFields.filter(f => f.category === cat).map((field, i) => (
                                <div key={i} className="px-4 py-3 flex items-start justify-between group border-b border-gray-50 last:border-0">
                                  <div>
                                    <div className="text-[10px] text-gray-400 mb-0.5">{field.label}</div>
                                    <div className="text-sm text-gray-900">{field.value}</div>
                                  </div>
                                  <button className="p-1 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-0.5">
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Documents tab */}
                  {activeTab === 'documents' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                        </button>
                        <input ref={fileInputRef} type="file" multiple className="hidden" />
                      </div>
                      {documents.length === 0 ? (
                        <div className="text-center py-16 text-sm text-gray-400">No documents uploaded yet.</div>
                      ) : (
                        <div className="space-y-2">
                          {documents.map(doc => (
                            <div key={doc.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer">
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-900 truncate">{doc.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.uploadDate} · {doc.size}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Workflows tab */}
                  {activeTab === 'workflows' && (
                    <div className="space-y-3">
                      {[
                        { id: 'deal-qa', name: 'Deal QA', description: 'Comprehensive quality assurance review of loan documentation and data extraction', runs: 3, lastRun: '3/10/2026', status: 'Completed' },
                        { id: 'annual-review', name: 'Annual Review', description: 'Systematic credit review to assess ongoing creditworthiness and update risk rating', runs: 0, lastRun: null, status: null },
                      ].map(wf => (
                        <div key={wf.id} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm text-gray-900">{wf.name}</h3>
                                {wf.status && (
                                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {wf.status}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{wf.description}</p>
                              {wf.lastRun && (
                                <p className="text-[10px] text-gray-400 mt-1.5">{wf.runs} run{wf.runs !== 1 ? 's' : ''} · Last: {wf.lastRun}</p>
                              )}
                            </div>
                            <button
                              onClick={() => setActiveWorkflow({ id: wf.id, name: wf.name })}
                              className="px-3 py-1.5 text-xs bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors flex-shrink-0 flex items-center gap-1.5"
                            >
                              {wf.runs > 0 ? 'Open' : 'Start'}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <div>
                <div className="w-12 h-12 bg-[#455a4f]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-[#455a4f]" />
                </div>
                <h2 className="text-sm text-gray-900 mb-1">Select a record to get started</h2>
                <p className="text-xs text-gray-400 max-w-xs">
                  Choose a borrower from the list on the left, or ask a portfolio question below.
                </p>
              </div>
            </div>
          )}

          {/* ── Chat bar — always pinned to bottom ─────────────────────────── */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
            {/* Messages — only show last 3 to keep it compact */}
            {chatMessages.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto space-y-2">
                {chatMessages.slice(-3).map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-5 h-5 rounded-full bg-[#ff6b5a] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><rect x="3" y="3" width="8" height="8" fill="white" /></svg>
                      </div>
                    )}
                    <div className={`text-xs px-2.5 py-1.5 rounded-lg max-w-[80%] ${msg.role === 'assistant' ? 'bg-gray-50 border border-gray-200 text-gray-900' : 'bg-[#455a4f] text-white'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Suggested queries */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestedQueries.map(q => (
                <button
                  key={q}
                  onClick={() => { setChatInput(q); }}
                  className="px-2.5 py-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#455a4f] flex-shrink-0" />
              <input
                type="text"
                placeholder={selectedBorrower ? `Ask about ${selectedBorrower.name}...` : 'Ask about your portfolio...'}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              {chatInput.trim() && (
                <button
                  onClick={handleSendMessage}
                  className="p-1.5 bg-[#455a4f] text-white rounded-md hover:bg-[#3a4a42] transition-colors flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Upload / New Record Modal ───────────────────────────────────────── */}
      {showUploadModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowUploadModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Add New Record</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-[#455a4f] hover:bg-gray-50 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-700 font-medium">Upload deal documents</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 50MB each</p>
                </div>
                <div className="relative border-2 border-gray-100 rounded-xl p-5 opacity-50 cursor-not-allowed">
                  <span className="absolute top-3 right-3 text-[10px] bg-gray-400 text-white px-2 py-0.5 rounded">Coming Soon</span>
                  <p className="text-sm text-gray-700 font-medium">Connect data source</p>
                  <p className="text-xs text-gray-400 mt-1">Auto-sync from SharePoint or network drive</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
