import { useState, useRef } from 'react';
import { Search, Plus, AlertCircle, ArrowLeft, ChevronDown, ChevronUp, Sparkles, X, Info, Upload, FileText, Check, FolderOpen } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';

interface VendorPortfolioListProps {
  onVendorSelect: (vendor: SelectedVendor) => void;
  onBack: () => void;
}

interface VendorEngagement {
  id: string;
  engagementId: string;
  serviceDescription: string;
  businessUnit: string;
  riskRating: 'Critical' | 'High' | 'Moderate' | 'Low';
  irr: 'Critical' | 'High' | 'Moderate' | 'Low';
  status: 'Active' | 'Renewal' | 'Terminated';
  relationshipManager: string;
  serviceOwner?: string; // Optional: assigned when different from RM
  lastAssessment: string;
  nextReassessment: string;
  annualSpend: string;
  contractEndDate?: string;
}

interface Vendor {
  id: string;
  name: string;
  engagements: VendorEngagement[];
  relationshipManager: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  queryResult?: QueryResult;
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'CloudBank Solutions',
    relationshipManager: 'Sarah Chen',
    engagements: [
      {
        id: '1',
        engagementId: 'AXM-2024-001',
        serviceDescription: 'Core Banking Platform',
        businessUnit: 'Retail Banking',
        riskRating: 'High',
        irr: 'Critical',
        status: 'Active',
        relationshipManager: 'Sarah Chen',
        serviceOwner: 'David Martinez', // Service Owner for Retail Banking service
        lastAssessment: '11/15/2024',
        nextReassessment: '5/15/2025',
        annualSpend: '$450,000',
        contractEndDate: '12/31/2026',
      },
      {
        id: '2',
        engagementId: 'AXM-2023-045',
        serviceDescription: 'Payment Processing Services',
        businessUnit: 'Treasury',
        riskRating: 'Moderate',
        irr: 'High',
        status: 'Active',
        relationshipManager: 'Sarah Chen',
        serviceOwner: 'Michael Park', // Different SO for Treasury service
        lastAssessment: '9/22/2024',
        nextReassessment: '3/22/2025',
        annualSpend: '$215,000',
        contractEndDate: '9/30/2026',
      },
      {
        id: '3',
        engagementId: 'AXM-2022-112',
        serviceDescription: 'Mobile Banking API',
        businessUnit: 'Digital',
        riskRating: 'Moderate',
        irr: 'Moderate',
        status: 'Renewal',
        relationshipManager: 'Sarah Chen',
        serviceOwner: 'Jessica Wang', // Different SO for Digital service
        lastAssessment: '8/10/2024',
        nextReassessment: '2/10/2025',
        annualSpend: '$125,000',
        contractEndDate: '8/15/2026',
      }
    ]
  },
  {
    id: '2',
    name: 'SecureData Inc.',
    relationshipManager: 'Michael Rodriguez',
    engagements: [
      {
        id: '4',
        engagementId: 'AXM-2024-012',
        serviceDescription: 'Document Management System',
        businessUnit: 'Operations',
        riskRating: 'High',
        irr: 'High',
        status: 'Active',
        relationshipManager: 'Michael Rodriguez',
        lastAssessment: '12/01/2024',
        nextReassessment: '6/01/2025',
        annualSpend: '$185,000',
        contractEndDate: '8/31/2026',
      }
    ]
  },
  {
    id: '3',
    name: 'PayTech Services',
    relationshipManager: 'Emily Johnson',
    engagements: [
      {
        id: '5',
        engagementId: 'AXM-2023-087',
        serviceDescription: 'Payment Processing',
        businessUnit: 'Treasury',
        riskRating: 'Critical',
        irr: 'Critical',
        status: 'Active',
        relationshipManager: 'Emily Johnson',
        lastAssessment: '10/20/2024',
        nextReassessment: '4/20/2025',
        annualSpend: '$625,000',
        contractEndDate: '10/31/2026',
      }
    ]
  },
  {
    id: '4',
    name: 'DataAnalytics Pro',
    relationshipManager: 'David Kim',
    engagements: [
      {
        id: '6',
        engagementId: 'AXM-2024-034',
        serviceDescription: 'Business Intelligence & Analytics',
        businessUnit: 'Corporate',
        riskRating: 'Moderate',
        irr: 'Moderate',
        status: 'Active',
        relationshipManager: 'David Kim',
        lastAssessment: '9/10/2024',
        nextReassessment: '3/10/2025',
        annualSpend: '$95,000',
        contractEndDate: '9/30/2026',
      }
    ]
  },
  {
    id: '5',
    name: 'OfficeSupply Direct',
    relationshipManager: 'Jennifer Martinez',
    engagements: [
      {
        id: '7',
        engagementId: 'AXM-2024-045',
        serviceDescription: 'Office Supplies',
        businessUnit: 'Operations',
        riskRating: 'Low',
        irr: 'Low',
        status: 'Active',
        relationshipManager: 'Jennifer Martinez',
        lastAssessment: '8/15/2024',
        nextReassessment: '8/15/2026',
        annualSpend: '$28,000',
        contractEndDate: '7/31/2026',
      }
    ]
  },
  {
    id: '6',
    name: 'CyberShield Security',
    relationshipManager: 'Robert Taylor',
    engagements: [
      {
        id: '8',
        engagementId: 'AXM-2024-067',
        serviceDescription: 'Managed Security Services',
        businessUnit: 'IT',
        riskRating: 'High',
        irr: 'High',
        status: 'Active',
        relationshipManager: 'Robert Taylor',
        lastAssessment: '11/30/2024',
        nextReassessment: '5/30/2025',
        annualSpend: '$310,000',
        contractEndDate: '11/30/2026',
      }
    ]
  },
  {
    id: '7',
    name: 'CloudBackup Systems',
    relationshipManager: 'Lisa Anderson',
    engagements: [
      {
        id: '9',
        engagementId: 'AXM-2025-003',
        serviceDescription: 'Backup & Disaster Recovery',
        businessUnit: 'IT',
        riskRating: 'High',
        irr: 'High',
        status: 'Active',
        relationshipManager: 'Lisa Anderson',
        lastAssessment: '',
        nextReassessment: '3/01/2025',
        annualSpend: '$145,000',
        contractEndDate: '1/15/2027',
      }
    ]
  },
  {
    id: '8',
    name: 'Marketing Automation Co',
    relationshipManager: 'Tom Wilson',
    engagements: [
      {
        id: '10',
        engagementId: 'AXM-2024-023',
        serviceDescription: 'Marketing Automation Platform',
        businessUnit: 'Marketing',
        riskRating: 'Moderate',
        irr: 'Moderate',
        status: 'Active',
        relationshipManager: 'Tom Wilson',
        lastAssessment: '7/22/2024',
        nextReassessment: '1/22/2025',
        annualSpend: '$72,000',
        contractEndDate: '7/22/2026',
      }
    ]
  },
  {
    id: '9',
    name: 'TechSupport Global',
    relationshipManager: 'Amanda Foster',
    engagements: [
      {
        id: '11',
        engagementId: 'AXM-2024-019',
        serviceDescription: 'IT Help Desk Services',
        businessUnit: 'IT',
        riskRating: 'Moderate',
        irr: 'Low',
        status: 'Active',
        relationshipManager: 'Amanda Foster',
        lastAssessment: '6/18/2024',
        nextReassessment: '12/18/2024',
        annualSpend: '$115,000',
        contractEndDate: '6/18/2026',
      }
    ]
  },
  {
    id: '10',
    name: 'Compliance Solutions Ltd',
    relationshipManager: 'Marcus Thompson',
    engagements: [
      {
        id: '12',
        engagementId: 'AXM-2024-008',
        serviceDescription: 'Regulatory Compliance Software',
        businessUnit: 'Compliance',
        riskRating: 'High',
        irr: 'High',
        status: 'Active',
        relationshipManager: 'Marcus Thompson',
        lastAssessment: '10/05/2024',
        nextReassessment: '4/05/2025',
        annualSpend: '$225,000',
        contractEndDate: '1/8/2027',
      }
    ]
  },
];

type SortField = 'name' | 'riskRating' | 'nextReassessment' | 'annualSpend';
type SortDirection = 'asc' | 'desc';

interface QueryResult {
  type: 'summary' | 'filtered';
  summary: string;
  vendors?: Vendor[];
  insights?: string[];
}

export function VendorPortfolioList({ onVendorSelect, onBack }: VendorPortfolioListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Query state
  const [queryInput, setQueryInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // New vendor modal states
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [newVendorStep, setNewVendorStep] = useState<'method' | 'upload'>('method');
  const [uploadedVendorDocs, setUploadedVendorDocs] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [isProcessingVendor, setIsProcessingVendor] = useState(false);
  const newVendorFileInputRef = useRef<HTMLInputElement>(null);

  const suggestedQueries = [
    'Which engagements have renewals in the next 90 days?',
    'Which vendors have RTO commitments under 4 hours?',
    'What security services vendors do we have?',
  ];

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'Critical':
        return 'text-red-700 bg-red-50';
      case 'High':
        return 'text-orange-700 bg-orange-50';
      case 'Moderate':
        return 'text-yellow-700 bg-yellow-50';
      case 'Low':
        return 'text-green-700 bg-green-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getRiskSortValue = (rating: string) => {
    switch (rating) {
      case 'Critical': return 4;
      case 'High': return 3;
      case 'Moderate': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const parseSpend = (spend: string) => {
    return parseInt(spend.replace(/[$,]/g, ''));
  };

  const isOverdue = (nextDate: string) => {
    if (!nextDate) return false;
    const [month, day, year] = nextDate.split('/').map(Number);
    return new Date(year, month - 1, day) < new Date();
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
    
    // Renewals in next 90 days
    if (lowerQuery.includes('renewal') || (lowerQuery.includes('90') && lowerQuery.includes('days'))) {
      const today = new Date();
      const next90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      const upcomingRenewals = mockVendors.filter(v => 
        v.engagements.some(e => {
          if (!e.contractEndDate) return false;
          const [month, day, year] = e.contractEndDate.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          return endDate <= next90Days && endDate >= today;
        })
      );
      const totalEngagements = upcomingRenewals.reduce((sum, v) => 
        sum + v.engagements.filter(e => {
          if (!e.contractEndDate) return false;
          const [month, day, year] = e.contractEndDate.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          return endDate <= next90Days && endDate >= today;
        }).length, 
        0
      );
      queryResult = {
        type: 'filtered',
        summary: `Found ${totalEngagements} engagement${totalEngagements !== 1 ? 's' : ''} across ${upcomingRenewals.length} vendor${upcomingRenewals.length !== 1 ? 's' : ''} with contract renewals in the next 90 days`,
        vendors: upcomingRenewals,
        insights: [
          'Start renewal negotiations 45-60 days before contract end date',
          'Review vendor performance and consider alternative options',
          'Verify pricing and terms align with current market rates'
        ]
      };
    }
    // Critical or high risk vendors
    else if (lowerQuery.includes('critical') || lowerQuery.includes('high risk')) {
      const criticalHighVendors = mockVendors.filter(v => 
        v.engagements.some(e => e.riskRating === 'Critical' || e.riskRating === 'High')
      );
      queryResult = {
        type: 'filtered',
        summary: `Found ${criticalHighVendors.length} vendors with Critical or High risk ratings`,
        vendors: criticalHighVendors,
        insights: [
          `${mockVendors.reduce((sum, v) => sum + v.engagements.filter(e => e.riskRating === 'Critical').length, 0)} Critical-rated engagements`,
          `${mockVendors.reduce((sum, v) => sum + v.engagements.filter(e => e.riskRating === 'High').length, 0)} High-rated engagements`,
          'These vendors require more frequent monitoring and assessment'
        ]
      };
    }
    // RTO commitments
    else if (lowerQuery.includes('rto')) {
      const lowRTOVendors = mockVendors.filter(v => 
        v.engagements.some(e =>
          e.serviceDescription.toLowerCase().includes('security') || 
          e.serviceDescription.toLowerCase().includes('core') ||
          e.serviceDescription.toLowerCase().includes('platform')
        )
      );
      queryResult = {
        type: 'filtered',
        summary: `Found ${lowRTOVendors.length} vendors with RTO commitments under 4 hours based on their service agreements`,
        vendors: lowRTOVendors,
        insights: [
          'These vendors have committed to rapid recovery times in their incident response plans',
          'RTO metrics are extracted from vendor service level agreements',
          'Regular testing of recovery procedures is recommended'
        ]
      };
    }
    // Overdue assessments
    else if (lowerQuery.includes('overdue')) {
      const overdueVendors = mockVendors.filter(v => 
        v.engagements.some(e => isOverdue(e.nextReassessment))
      );
      queryResult = {
        type: 'filtered',
        summary: `Found ${overdueVendors.length} vendor${overdueVendors.length !== 1 ? 's' : ''} with overdue assessments`,
        vendors: overdueVendors,
        insights: [
          'These assessments should be completed as soon as possible',
          'Contact the relationship managers to schedule reassessments',
          'Overdue assessments may indicate compliance gaps'
        ]
      };
    }
    // Total spend on critical vendors
    else if (lowerQuery.includes('spend') && lowerQuery.includes('critical')) {
      const criticalVendors = mockVendors.filter(v => 
        v.engagements.some(e => e.riskRating === 'Critical')
      );
      const totalSpend = criticalVendors.reduce((sum, v) => 
        sum + v.engagements.filter(e => e.riskRating === 'Critical').reduce((eSum, e) => eSum + parseSpend(e.annualSpend), 0), 
        0
      );
      queryResult = {
        type: 'summary',
        summary: `Your organization spends $${totalSpend.toLocaleString()} annually on Critical-rated engagements`,
        vendors: criticalVendors,
        insights: [
          `${criticalVendors.length} vendors have Critical-rated engagements`,
          'Critical vendors represent core dependencies for your organization',
          'Consider diversification strategies to reduce concentration risk'
        ]
      };
    }
    // Due this quarter
    else if (lowerQuery.includes('this quarter') || lowerQuery.includes('due soon')) {
      const today = new Date();
      const nextQuarter = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
      const dueThisQuarter = mockVendors.filter(v => 
        v.engagements.some(e => {
          if (!e.nextReassessment) return false;
          const [month, day, year] = e.nextReassessment.split('/').map(Number);
          const dueDate = new Date(year, month - 1, day);
          return dueDate <= nextQuarter && dueDate >= today;
        })
      );
      queryResult = {
        type: 'filtered',
        summary: `${dueThisQuarter.length} vendors have assessments due within the next quarter`,
        vendors: dueThisQuarter,
        insights: [
          'Coordinate with relationship managers to schedule reviews',
          'Budget approximately 2-4 weeks per assessment',
          'Ensure all required documentation is current'
        ]
      };
    }
    // Security services
    else if (lowerQuery.includes('security')) {
      const securityVendors = mockVendors.filter(v => 
        v.engagements.some(e => e.serviceDescription.toLowerCase().includes('security')) || 
        v.name.toLowerCase().includes('security')
      );
      queryResult = {
        type: 'filtered',
        summary: `Found ${securityVendors.length} vendors providing security-related services`,
        vendors: securityVendors,
        insights: [
          'Security vendors require enhanced assessments',
          'Verify SOC 2 Type II compliance for all security vendors',
          'Review incident response procedures and SLAs'
        ]
      };
    }
    else {
      queryResult = {
        type: 'summary',
        summary: 'I can help you analyze your vendor portfolio. Try asking about specific risk levels or service types.',
        insights: [
          'Example: "Which engagements have renewals in the next 90 days?"',
          'Example: "Show me vendors with overdue assessments"',
          'Example: "What\'s our total spend on critical vendors?"'
        ]
      };
    }

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: queryResult.summary,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      queryResult
    };
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 300);
  };

  const clearQuery = () => {
    setQueryInput('');
    setChatMessages([]);
  };

  // Calculate stats
  const totalVendors = mockVendors.length;
  const criticalCount = mockVendors.filter(v => 
    v.engagements.some(e => e.riskRating === 'Critical')
  ).length;
  const highCount = mockVendors.filter(v => 
    v.engagements.some(e => e.riskRating === 'High')
  ).length;
  
  const today = new Date();
  const nextQuarter = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
  const dueThisQuarter = mockVendors.filter(v => 
    v.engagements.some(e => {
      if (!e.nextReassessment) return false;
      const [month, day, year] = e.nextReassessment.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return dueDate <= nextQuarter && dueDate >= today;
    })
  ).length;
  
  const overdueCount = mockVendors.filter(v => 
    v.engagements.some(e => isOverdue(e.nextReassessment))
  ).length;

  // Filter vendors - either from query results or regular filters
  const lastMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
  const queryResult = lastMessage?.type === 'assistant' ? lastMessage.queryResult : null;
  
  let filteredVendors = queryResult?.vendors || mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.engagements.some(e => 
                           e.engagementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesRisk = filterRisk === 'all' || vendor.engagements.some(e => e.riskRating === filterRisk);
    return matchesSearch && matchesRisk;
  });

  // Sort vendors
  filteredVendors = [...filteredVendors].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortField) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'riskRating':
        // Sort by highest risk rating among all engagements
        aVal = Math.max(...a.engagements.map(e => getRiskSortValue(e.riskRating)));
        bVal = Math.max(...b.engagements.map(e => getRiskSortValue(e.riskRating)));
        break;
      case 'nextReassessment':
        // Sort by earliest reassessment date
        const aValidDates = a.engagements.map(e => e.nextReassessment).filter(Boolean);
        const bValidDates = b.engagements.map(e => e.nextReassessment).filter(Boolean);
        aVal = aValidDates.length > 0 ? Math.min(...aValidDates.map(d => new Date(d).getTime())) : 0;
        bVal = bValidDates.length > 0 ? Math.min(...bValidDates.map(d => new Date(d).getTime())) : 0;
        break;
      case 'annualSpend':
        // Sort by total annual spend
        aVal = a.engagements.reduce((sum, e) => sum + parseSpend(e.annualSpend), 0);
        bVal = b.engagements.reduce((sum, e) => sum + parseSpend(e.annualSpend), 0);
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          <h1 className="text-xl text-gray-900">Third-Party Risk Management Agent</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Processing Indicator */}
        {isProcessingVendor && (
          <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-[#455a4f] rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#455a4f] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">AI Processing Vendor Documents</h4>
                <p className="text-xs text-gray-600">
                  Extracting vendor details, identifying engagements, and analyzing risk profile from your uploaded documents...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        

        {/* Query Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 flex flex-col" style={chatMessages.length > 0 ? { height: '400px' } : {}}>
          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <Sparkles className="w-5 h-5 text-[#455a4f]" />
            <h2 className="text-base text-gray-900">Ask about your vendor portfolio</h2>
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
                placeholder="Ask a question about your vendor portfolio..."
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

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-900">
            {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].queryResult ? 'Query Results' : 'Vendor Portfolio'}
          </h2>
          <div className="flex items-center gap-3">
            {!(chatMessages.length > 0 && chatMessages[chatMessages.length - 1].queryResult) && (
              <>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent bg-white"
                  />
                </div>
                
              </>
            )}
            <button 
              onClick={() => {
                setShowNewVendorModal(true);
                setNewVendorStep('method');
                setUploadedVendorDocs([]);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Vendor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th 
                    className="px-4 py-3 text-left text-xs text-gray-600 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Vendor Name
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 font-medium">
                    Engagements
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 font-medium">
                    Relationship Manager
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 font-medium">
                    Next Renewal Date
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs text-gray-600 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('riskRating')}
                  >
                    <div className="flex items-center gap-1">
                      Highest IRR
                      <SortIcon field="riskRating" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor, index) => {
                  const highestRisk = vendor.engagements.reduce((highest, eng) => {
                    const currentVal = getRiskSortValue(eng.riskRating);
                    const highestVal = getRiskSortValue(highest);
                    return currentVal > highestVal ? eng.riskRating : highest;
                  }, 'Low' as 'Critical' | 'High' | 'Moderate' | 'Low');
                  
                  return (
                    <tr
                      key={vendor.id}
                      onClick={() => onVendorSelect({
                        id: vendor.id,
                        name: vendor.name,
                        engagementId: vendor.engagements[0].engagementId,
                        riskRating: highestRisk,
                        relationshipManager: vendor.relationshipManager,
                        engagements: vendor.engagements.map(e => ({
                          id: e.id,
                          engagementId: e.engagementId,
                          serviceDescription: e.serviceDescription,
                          businessUnit: e.businessUnit,
                          riskRating: e.riskRating,
                          irr: e.irr,
                          status: e.status,
                          serviceOwner: e.serviceOwner
                        }))
                      })}
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        index === filteredVendors.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {vendor.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {vendor.engagements.map(eng => (
                            <span key={eng.id} className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                              {eng.engagementId}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {vendor.relationshipManager}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {(() => {
                          const validDates = vendor.engagements
                            .map(e => e.contractEndDate)
                            .filter((date): date is string => !!date);
                          
                          if (validDates.length === 0) return '—';
                          
                          const nextRenewal = validDates
                            .map(dateStr => {
                              const [month, day, year] = dateStr.split('/').map(Number);
                              return new Date(year, month - 1, day);
                            })
                            .sort((a, b) => a.getTime() - b.getTime())[0];
                          
                          return nextRenewal.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getRiskColor(highestRisk)}`}>
                          {highestRisk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* No Results */}
          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No vendors found</div>
              <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredVendors.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredVendors.length} of {totalVendors} vendors
          </div>
        )}
      </div>

      {/* New Vendor Modal */}
      {showNewVendorModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => {
              setShowNewVendorModal(false);
              setNewVendorStep('method');
              setUploadedVendorDocs([]);
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
                    <h2 className="text-lg font-medium text-gray-900">Add New Vendor</h2>
                    <p className="text-sm text-gray-500 mt-1">Create a new vendor in your portfolio</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowNewVendorModal(false);
                      setNewVendorStep('method');
                      setUploadedVendorDocs([]);
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
                {newVendorStep === 'method' && (
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
                            Connect your folder and automatically pull in all relevant vendor documents.
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
                      onClick={() => setNewVendorStep('upload')}
                      className="w-full border-2 border-[#455a4f] rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#455a4f] rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Manual Upload</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Upload vendor documents from your computer. AI will extract all relevant information.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Check className="w-4 h-4" />
                            <span>Upload multiple files at once</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                            <Check className="w-4 h-4" />
                            <span>AI-powered vendor identification</span>
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
                {newVendorStep === 'upload' && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <button
                        onClick={() => setNewVendorStep('method')}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                        <span>Back to method selection</span>
                      </button>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Upload Vendor Documents</h3>
                      <p className="text-xs text-gray-600">Add all relevant documents for this vendor. AI will analyze and extract vendor information, engagements, and risk details automatically.</p>
                    </div>

                    <div
                      onClick={() => newVendorFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#455a4f] hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-base text-gray-900 mb-1 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 50MB each</p>
                      <p className="text-xs text-gray-400 mt-2">Contracts, MSAs, SOWs, DPAs, Insurance Certificates, SOC Reports, etc.</p>
                      <input
                        ref={newVendorFileInputRef}
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
                            setUploadedVendorDocs([...uploadedVendorDocs, ...newDocs]);
                          }
                        }}
                      />
                    </div>

                    {uploadedVendorDocs.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-900">Uploaded Documents ({uploadedVendorDocs.length})</h3>
                          <button
                            onClick={() => setUploadedVendorDocs([])}
                            className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="space-y-2">
                          {uploadedVendorDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                  <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => setUploadedVendorDocs(uploadedVendorDocs.filter((_, i) => i !== idx))}
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
                              setIsProcessingVendor(true);
                              setShowNewVendorModal(false);
                              setUploadedVendorDocs([]);
                              setNewVendorStep('method');
                              
                              // Simulate AI processing completion after 3 seconds
                              setTimeout(() => {
                                setIsProcessingVendor(false);
                                // In real implementation, this would add the vendor to the list
                              }, 3000);
                            }}
                            disabled={uploadedVendorDocs.length === 0}
                            className="w-full px-6 py-3 bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              Submit & Process with AI
                            </span>
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-3">
                            AI will identify vendor name, extract all engagements, risk ratings, and key contract terms
                          </p>
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
    </>
  );
}
