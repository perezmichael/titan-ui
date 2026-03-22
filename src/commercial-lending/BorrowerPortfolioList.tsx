import { useState, useRef } from 'react';
import { Search, ArrowLeft, ChevronDown, ChevronRight, Sparkles, Plus, X, Upload, FileText, Check, FolderOpen, Settings } from 'lucide-react';
import type { SelectedBorrower } from '../CommercialLendingWorkspace';
import { WorkflowPanel } from './WorkflowPanel';
import { WorkflowDetailInline } from './WorkflowDetailInline';
import { CommercialLendingChat } from './CommercialLendingChat';

interface BorrowerPortfolioListProps {
  onBorrowerSelect: (borrower: SelectedBorrower) => void;
  onBack: () => void;
  onWorkflowOpen?: (workflowId: string, workflowName: string) => void;
  onSettingsOpen?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  queryResult?: QueryResult;
}

interface QueryResult {
  type: 'summary' | 'filtered';
  summary: string;
  borrowers?: Borrower[];
  insights?: string[];
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
  riskRating: number;
  riskRatingLabel: string;
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
    riskRating: 2,
    riskRatingLabel: 'Strong',
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
    riskRating: 3,
    riskRatingLabel: 'Strong Satisfactory',
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
    riskRating: 2,
    riskRatingLabel: 'Strong',
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
    riskRating: 4,
    riskRatingLabel: 'Satisfactory',
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
    riskRating: 1,
    riskRatingLabel: 'Superior',
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

export function BorrowerPortfolioList({ onBorrowerSelect, onBack, onWorkflowOpen, onSettingsOpen }: BorrowerPortfolioListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBorrowers, setExpandedBorrowers] = useState<Set<string>>(new Set());
  
  // Query state
  const [queryInput, setQueryInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'records' | 'workflows' | 'chat'>('records');

  // Workflow detail state
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedWorkflowName, setSelectedWorkflowName] = useState<string>('');

  // New record modal states
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [newRecordStep, setNewRecordStep] = useState<'method' | 'upload'>('method');
  const [uploadedRecordDocs, setUploadedRecordDocs] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [isProcessingRecord, setIsProcessingRecord] = useState(false);
  const newRecordFileInputRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);

  const suggestedQueries = [
    'Which loans have maturities in the next 90 days?',
    'Show me all borrowers with risk rating 4 or 5',
    'What is the total exposure for Data Center asset class?',
  ];

  const clearQuery = () => {
    setChatMessages([]);
    setQueryInput('');
  };

  const handleStartWorkflow = (workflowId: string, stepNumber?: number) => {
    // Generate portfolio-level workflow initiation message
    const workflowMessages: Record<string, string> = {
      'deal-qa': `I'll guide you through the Deal QA workflow. This comprehensive quality assurance review will verify loan documentation and data extraction across 7 steps.\n\nTo begin, please select a specific borrower from your portfolio list, and I'll walk you through a systematic QA review of their deal file.`,
      
      'annual-review': `I'll guide you through the Annual Review workflow. This systematic credit review assesses ongoing creditworthiness, covenant compliance, and risk rating across 8 comprehensive steps.\n\nYour portfolio includes ${mockBorrowers.length} borrowers with total credit exposure of ${formatCurrency(mockBorrowers.reduce((sum, b) => sum + b.totalCreditExposure, 0))}.\n\nWould you like me to identify which borrowers are due for annual review, or would you like to select a specific borrower to begin the review process?`
    };

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: `Start ${workflowId === 'deal-qa' ? 'Deal QA' : workflowId === 'annual-review' ? 'Annual Review' : ''} workflow`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: workflowMessages[workflowId] || 'Starting workflow...',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleQuery = (query: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setQueryInput('');
    
    const lowerQuery = query.toLowerCase();
    let queryResult: QueryResult;
    
    // Maturities in next 90 days
    if (lowerQuery.includes('maturity') || lowerQuery.includes('maturities') || (lowerQuery.includes('90') && lowerQuery.includes('days'))) {
      const today = new Date();
      const next90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      const upcomingMaturities = mockBorrowers.filter(b => {
        const maturityDate = new Date(b.maturityDate);
        return maturityDate <= next90Days && maturityDate >= today;
      });
      queryResult = {
        type: 'filtered',
        summary: `Found ${upcomingMaturities.length} loan${upcomingMaturities.length !== 1 ? 's' : ''} with maturities in the next 90 days`,
        borrowers: upcomingMaturities,
        insights: upcomingMaturities.length > 0 ? [
          `Total exposure maturing: ${formatCurrency(upcomingMaturities.reduce((sum, b) => sum + b.totalCreditExposure, 0))}`,
          `Earliest maturity: ${formatDate(upcomingMaturities[0].maturityDate)}`
        ] : []
      };
    }
    // Risk rating filter
    else if (lowerQuery.includes('risk rating 4') || lowerQuery.includes('risk rating 5') || (lowerQuery.includes('4 or 5'))) {
      const highRiskBorrowers = mockBorrowers.filter(b => b.riskRating >= 4);
      queryResult = {
        type: 'filtered',
        summary: `Found ${highRiskBorrowers.length} borrower${highRiskBorrowers.length !== 1 ? 's' : ''} with risk rating 4 or 5`,
        borrowers: highRiskBorrowers,
        insights: highRiskBorrowers.length > 0 ? [
          `Total exposure: ${formatCurrency(highRiskBorrowers.reduce((sum, b) => sum + b.totalCreditExposure, 0))}`,
          `Average risk rating: ${(highRiskBorrowers.reduce((sum, b) => sum + b.riskRating, 0) / highRiskBorrowers.length).toFixed(1)}`
        ] : []
      };
    }
    // Asset class query
    else if (lowerQuery.includes('data center')) {
      const dataCenterBorrowers = mockBorrowers.filter(b => b.assetClass.toLowerCase().includes('data center'));
      queryResult = {
        type: 'filtered',
        summary: `Found ${dataCenterBorrowers.length} Data Center loan${dataCenterBorrowers.length !== 1 ? 's' : ''}`,
        borrowers: dataCenterBorrowers,
        insights: dataCenterBorrowers.length > 0 ? [
          `Total exposure: ${formatCurrency(dataCenterBorrowers.reduce((sum, b) => sum + b.totalCreditExposure, 0))}`,
          `Average risk rating: ${(dataCenterBorrowers.reduce((sum, b) => sum + b.riskRating, 0) / dataCenterBorrowers.length).toFixed(1)}`
        ] : []
      };
    }
    // Default response
    else {
      const totalExposure = mockBorrowers.reduce((sum, b) => sum + b.totalCreditExposure, 0);
      const avgRiskRating = mockBorrowers.reduce((sum, b) => sum + b.riskRating, 0) / mockBorrowers.length;
      queryResult = {
        type: 'summary',
        summary: `Your portfolio includes ${mockBorrowers.length} borrowers with total credit exposure of ${formatCurrency(totalExposure)}. The average risk rating is ${avgRiskRating.toFixed(1)}.`,
        insights: [
          `Highest risk: ${mockBorrowers.filter(b => b.riskRating >= 4).length} borrowers`,
          `Total commitments: ${formatCurrency(mockBorrowers.reduce((sum, b) => sum + b.commitment, 0))}`
        ]
      };
    }
    
    // Add assistant response
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: queryResult.summary,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      queryResult
    };
    
    setChatMessages(prev => [...prev, assistantMessage]);
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

  // Filter borrowers - either from query results or regular filters
  const lastMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
  const queryResult = lastMessage?.type === 'assistant' ? lastMessage.queryResult : null;
  
  const filteredBorrowers = queryResult?.borrowers || mockBorrowers.filter(borrower => 
    !searchQuery || 
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.noteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.cipCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskRatingBadgeClass = (rating: number) => {
    switch (rating) {
      case 1: return 'bg-green-50 text-green-900 border-green-200';
      case 2: return 'bg-green-50 text-green-700 border-green-200';
      case 3: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 4: return 'bg-orange-50 text-orange-700 border-orange-200';
      case 5: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 pl-8 sm:pl-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Agents</span>
            </button>
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-base sm:text-xl text-gray-900 truncate">Commercial Lending Agent</h1>
          </div>
          <button
            onClick={onSettingsOpen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Tab — full-height, manages its own scroll */}
      {activeTab === 'chat' && (
        <div className="flex-1 overflow-hidden">
          <CommercialLendingChat />
        </div>
      )}

      {/* Main Content — Records & Workflows tabs */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-6 py-6 ${activeTab === 'chat' ? 'hidden' : ''}`}>
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

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'records'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Records
            {activeTab === 'records' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'workflows'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Workflows
            {activeTab === 'workflows' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Chat
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
        </div>

        {/* Query Section */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-lg border border-gray-200 mb-6 flex flex-col" style={chatMessages.length > 0 ? { height: '400px' } : {}}>
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
              <Sparkles className="w-5 h-5 text-[#455a4f]" />
              <h2 className="text-base text-gray-900">Ask about your documents and data</h2>
              {chatMessages.length > 0 && (
                <button
                  onClick={clearQuery}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Chat Messages Area */}
            {chatMessages.length > 0 && (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                        message.type === 'assistant' ? 'bg-[#ff6b5a] text-white' : 'bg-[#455a4f] text-white'
                      }`}>
                        {message.type === 'assistant' ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="3" y="3" width="8" height="8" fill="white" />
                          </svg>
                        ) : (
                          'TB'
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {message.type === 'assistant' ? (
                          <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                            <div className="text-xs text-gray-900">{message.content}</div>
                            
                            {/* Insights */}
                            {message.queryResult?.insights && message.queryResult.insights.length > 0 && (
                              <ul className="space-y-1 mt-2">
                                {message.queryResult.insights.map((insight, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-[#455a4f] mt-0.5">•</span>
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Timestamp */}
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2">
                              <span>{message.timestamp}</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs text-gray-900 mb-1.5">{message.content}</div>
                            <div className="text-[10px] text-gray-500">{message.timestamp}</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-6 py-4">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && queryInput.trim()) {
                      handleQuery(queryInput);
                    }
                  }}
                  className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={() => queryInput.trim() && handleQuery(queryInput)}
                    disabled={!queryInput.trim()}
                    className="px-3 py-1.5 bg-[#455a4f] text-white text-sm rounded-md hover:bg-[#3a4a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ask
                  </button>
                </div>
              </div>

              {/* Suggested Queries */}
              {chatMessages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuery(query)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              )}
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
              <h2 className="text-lg text-gray-900">
                {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].queryResult ? 'Query Results' : 'Records'}
              </h2>
              {!(chatMessages.length > 0 && chatMessages[chatMessages.length - 1].queryResult) ? (
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
              ) : null}
            </div>

            {/* Portfolio Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Record</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBorrowers.map((borrower) => (
                      <tr key={borrower.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {borrower.id === '1' ? (
                            <button
                              onClick={() => onBorrowerSelect({
                                id: borrower.id,
                                name: borrower.name,
                                cipCode: borrower.cipCode,
                                relationshipId: borrower.relationshipId,
                                noteNumber: borrower.noteNumber,
                                riskRating: borrower.riskRating,
                                riskRatingLabel: borrower.riskRatingLabel,
                                loanOfficer: borrower.loanOfficer,
                                underwriter: borrower.underwriter,
                                facilities: borrower.facilities
                              })}
                              className="text-sm text-[#455a4f] hover:underline cursor-pointer"
                            >
                              {borrower.name}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {borrower.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(borrower.dateAdded)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

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