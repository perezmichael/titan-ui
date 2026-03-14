import { Database, FileText, BarChart3, Search, CheckCircle2, Calendar, File, ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, XCircle, AlertCircle } from 'lucide-react';
import { AtlasLogo } from './AtlasLogo';
import { PowerBILogo } from './PowerBILogo';
import { SharePointLogo } from './SharePointLogo';
import { HelpjuiceLogo } from './HelpjuiceLogo';
import { useState, useEffect } from 'react';

interface ConnectedSystem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'syncing' | 'failed';
  lastSync: string;
  documentCount: number;
  color: string;
  description: string;
  errorMessage?: string;
}

interface Document {
  id: string;
  name: string;
  source: string;
  type: string;
  lastUpdated: string;
  size: string;
  syncStatus: 'success' | 'failed';
  errorReason?: string;
}

interface ConnectorsViewProps {
  onDocumentSelect: (document: Document) => void;
  initialConnector?: string | null;
}

export function ConnectorsView({ onDocumentSelect, initialConnector = null }: ConnectorsViewProps) {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(initialConnector);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  
  const connectedSystems: ConnectedSystem[] = [
    {
      id: 'atlas',
      name: 'Atlas',
      icon: <HelpjuiceLogo className="w-6 h-6" />,
      status: 'connected',
      lastSync: '2 minutes ago',
      documentCount: 156,
      color: 'bg-white',
      description: 'Internal knowledge base powered by Help Juice'
    },
    {
      id: 'powerbi',
      name: 'Power BI',
      icon: <PowerBILogo className="w-6 h-6" />,
      status: 'connected',
      lastSync: '5 minutes ago',
      documentCount: 42,
      color: 'bg-yellow-500',
      description: 'Business analytics service for interactive visualizations and business intelligence'
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      icon: <SharePointLogo className="w-6 h-6" />,
      status: 'failed',
      lastSync: '3 days ago',
      documentCount: 89,
      color: 'bg-blue-600',
      description: 'Document management and collaboration platform',
      errorMessage: 'Authentication failed: OAuth token expired. Please reconnect to restore access.'
    }
  ];

  // Generate 287 documents with correct distribution
  const generateDocuments = (): Document[] => {
    const docTypes = ['Policy', 'Procedure', 'Guidelines', 'Framework', 'Report', 'Dashboard', 'Analysis', 'Regulatory'];
    const months = ['Jan', 'Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb'];
    const days = Array.from({ length: 28 }, (_, i) => i + 1);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = ['00', '15', '30', '45'];
    
    // Helper function to get weighted error reason (70% PII detected)
    const getErrorReason = () => {
      const rand = Math.random();
      if (rand < 0.7) return 'PII detected';
      if (rand < 0.8) return 'Corrupted data';
      if (rand < 0.9) return 'General sync error';
      if (rand < 0.95) return 'Access denied';
      return 'File format unsupported';
    };
    
    const documentNames = [
      'BSA AML Procedure', 'Commercial Lending Guidelines', 'Third-Party Risk Management Framework',
      'Customer Transaction Report', 'Compliance Dashboard', 'Regulatory Reporting Requirements',
      'Loan Portfolio Analysis', 'Risk Assessment Dashboard', 'Credit Risk Policy',
      'Operational Risk Framework', 'Vendor Due Diligence Checklist', 'KYC Documentation Standards',
      'Suspicious Activity Report Template', 'Wire Transfer Procedures', 'Account Opening Guidelines',
      'CIP Compliance Manual', 'OFAC Screening Protocol', 'Currency Transaction Report Guide',
      'Customer Identification Program', 'Enhanced Due Diligence Procedures', 'Anti-Money Laundering Training',
      'Financial Crimes Unit Report', 'Sanctions Compliance Policy', 'Transaction Monitoring Rules',
      'Risk Rating Methodology', 'Correspondent Banking Policy', 'Private Banking Guidelines',
      'Trade Finance Compliance', 'Beneficial Ownership Requirements', 'PEP Screening Procedures',
      'Internal Audit Report', 'Compliance Testing Results', 'Regulatory Examination Response',
      'Board Risk Committee Minutes', 'Enterprise Risk Management Framework', 'Business Continuity Plan',
      'Disaster Recovery Procedures', 'Cybersecurity Incident Response', 'Data Governance Policy',
      'Privacy Impact Assessment', 'Information Security Standards', 'Access Control Procedures',
      'Change Management Policy', 'Vendor Management Guidelines', 'Third-Party Oversight Framework',
      'Model Risk Management', 'Stress Testing Methodology', 'Capital Adequacy Report',
      'Liquidity Risk Assessment', 'Interest Rate Risk Policy', 'Market Risk Dashboard',
      'Credit Portfolio Review', 'Loan Loss Reserve Analysis', 'Asset Quality Report',
      'Non-Performing Loans Report', 'Charge-Off Policy', 'Collections Procedures',
      'Consumer Lending Standards', 'Mortgage Underwriting Guidelines', 'Auto Loan Policy',
      'Credit Card Compliance Manual', 'Fair Lending Policy', 'UDAAP Compliance Guide',
      'TILA-RESPA Requirements', 'Truth in Savings Disclosure', 'Reg E Compliance Manual',
      'Reg Z Implementation Guide', 'HMDA Reporting Requirements', 'CRA Performance Evaluation',
      'Branch Audit Report', 'ATM Security Procedures', 'Fraud Prevention Guidelines',
      'Check Kiting Detection', 'Identity Theft Prevention', 'Elder Financial Abuse Policy',
      'Employee Handbook', 'Code of Ethics', 'Conflict of Interest Policy',
      'Insider Trading Guidelines', 'Gift and Entertainment Policy', 'Whistleblower Procedures',
      'HR Compliance Manual', 'Equal Employment Opportunity', 'Anti-Harassment Policy',
      'Performance Management System', 'Compensation Philosophy', 'Benefits Administration Guide',
      'IT Security Awareness Training', 'Phishing Prevention Guide', 'Mobile Device Management',
      'Cloud Security Policy', 'Encryption Standards', 'Network Security Procedures',
      'Customer Service Standards', 'Complaint Handling Procedures', 'Service Level Agreements',
      'Product Development Framework', 'Pricing Strategy Document', 'Marketing Compliance Guide',
      'Social Media Policy', 'Brand Guidelines', 'Communications Strategy',
      'Financial Planning Analysis', 'Budget Variance Report', 'Profitability Analysis',
      'Cost Management Report', 'Revenue Forecast Dashboard', 'Strategic Planning Document'
    ];

    const docs: Document[] = [];
    
    // SharePoint: 89 documents
    for (let i = 0; i < 89; i++) {
      const baseName = documentNames[i % documentNames.length];
      const type = docTypes[i % docTypes.length];
      const month = months[i % months.length];
      const day = days[i % days.length];
      const year = i < 15 ? 2026 : 2025;
      const hour = hours[i % hours.length];
      const minute = minutes[i % minutes.length];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const sizeNum = Math.floor(Math.random() * 5000) + 100;
      const sizeUnit = sizeNum > 1000 ? 'MB' : 'KB';
      const size = sizeNum > 1000 ? `${(sizeNum / 1000).toFixed(1)} ${sizeUnit}` : `${sizeNum} ${sizeUnit}`;
      const extensions = ['.docx', '.pdf', '.xlsx', '.pptx'];
      const ext = extensions[i % extensions.length];
      
      // ~5% failure rate
      const isFailed = Math.random() < 0.05;
      
      docs.push({
        id: `sp-${i + 1}`,
        name: `${baseName}${i > 80 ? ' - Final' : i > 70 ? ` Q${(i % 4) + 1} ${year}` : i > 60 ? ` - Updated ${year}` : ''}${ext}`,
        source: 'SharePoint',
        type,
        lastUpdated: isFailed ? 'Never' : `${month} ${day}, ${year} at ${displayHour}:${minute} ${ampm} EST`,
        size,
        syncStatus: isFailed ? 'failed' : 'success',
        errorReason: isFailed ? getErrorReason() : undefined
      });
    }
    
    // Atlas: 156 documents
    for (let i = 0; i < 156; i++) {
      const baseName = documentNames[i % documentNames.length];
      const type = docTypes[i % docTypes.length];
      const month = months[i % months.length];
      const day = days[i % days.length];
      const year = i < 25 ? 2026 : 2025;
      const hour = hours[i % hours.length];
      const minute = minutes[i % minutes.length];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const sizeNum = Math.floor(Math.random() * 3000) + 50;
      const sizeUnit = sizeNum > 1000 ? 'MB' : 'KB';
      const size = sizeNum > 1000 ? `${(sizeNum / 1000).toFixed(1)} ${sizeUnit}` : `${sizeNum} ${sizeUnit}`;
      const extensions = ['.pdf', '.docx', '.xlsx', ''];
      const ext = extensions[i % extensions.length];
      
      // ~5% failure rate
      const isFailed = Math.random() < 0.05;
      
      docs.push({
        id: `atlas-${i + 1}`,
        name: `${baseName}${i > 140 ? ' - Final' : i > 120 ? ` Q${(i % 4) + 1} ${year}` : i > 100 ? ` - Updated ${year}` : ''}${ext}`,
        source: 'Atlas',
        type,
        lastUpdated: isFailed ? 'Never' : `${month} ${day}, ${year} at ${displayHour}:${minute} ${ampm} EST`,
        size,
        syncStatus: isFailed ? 'failed' : 'success',
        errorReason: isFailed ? getErrorReason() : undefined
      });
    }
    
    // Power BI: 42 documents
    const powerBIReports = [
      'Executive Dashboard', 'Board Risk Committee Report', 'Monthly Financial Performance',
      'Credit Risk Analytics Dashboard', 'Loan Portfolio Performance', 'Asset Quality Report',
      'Liquidity Management Dashboard', 'Capital Adequacy Report', 'Profitability Analysis',
      'Branch Performance Dashboard', 'Customer Analytics Report', 'Deposit Growth Analysis',
      'Fee Income Dashboard', 'Net Interest Margin Report', 'Compliance Metrics Dashboard',
      'Operational Risk Dashboard', 'Vendor Risk Analytics', 'Audit Findings Tracker',
      'Regulatory Reporting Dashboard', 'BSA/AML Monitoring Dashboard', 'Transaction Monitoring Report',
      'Customer Due Diligence Metrics', 'Suspicious Activity Report Analytics', 'OFAC Screening Dashboard',
      'Loan Origination Dashboard', 'Commercial Lending Report', 'Consumer Lending Analytics',
      'Mortgage Portfolio Dashboard', 'Delinquency Tracking Report', 'Collections Performance Dashboard',
      'Treasury Management Dashboard', 'ALM Reporting Dashboard', 'Stress Testing Results',
      'Strategic Planning Dashboard', 'Budget vs Actual Report', 'Revenue Forecast Dashboard',
      'Cost Management Analytics', 'Efficiency Ratio Dashboard', 'Market Share Analysis',
      'Customer Satisfaction Metrics', 'Digital Banking Analytics', 'Product Performance Dashboard',
      'Risk-Adjusted Returns Report', 'Economic Capital Dashboard'
    ];
    
    for (let i = 0; i < 42; i++) {
      const reportName = powerBIReports[i % powerBIReports.length];
      const month = months[i % months.length];
      const day = days[i % days.length];
      const year = i < 10 ? 2026 : 2025;
      const hour = hours[i % hours.length];
      const minute = minutes[i % minutes.length];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const sizeNum = Math.floor(Math.random() * 500) + 50;
      const size = `${sizeNum} KB`;
      
      // ~5% failure rate
      const isFailed = Math.random() < 0.05;
      
      docs.push({
        id: `pbi-${i + 1}`,
        name: `${reportName}${i > 35 ? ` - ${year}` : i > 30 ? ` Q${(i % 4) + 1} ${year}` : i > 20 ? ` - ${month} ${year}` : ''}`,
        source: 'Power BI',
        type: 'Dashboard',
        lastUpdated: isFailed ? 'Never' : `${month} ${day}, ${year} at ${displayHour}:${minute} ${ampm} EST`,
        size,
        syncStatus: isFailed ? 'failed' : 'success',
        errorReason: isFailed ? getErrorReason() : undefined
      });
    }
    
    return docs;
  };

  const documents: Document[] = generateDocuments();

  const selectedSystem = connectedSystems.find(sys => sys.id === selectedConnector);
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConnector = selectedConnector ? doc.source === selectedSystem?.name : true;
    return matchesSearch && matchesConnector;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedConnector]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 7;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-3 h-3" />
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-1 text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-2 py-1 text-xs border rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
              <button
                onClick={() => goToPage(totalPages)}
                className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // If a connector is selected, show the detail view
  if (selectedConnector && selectedSystem) {
    return (
      <div className="flex-1 bg-[#f5f5f3] overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Back button and header */}
          <button
            onClick={() => setSelectedConnector(null)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all connectors
          </button>

          {/* Connector header */}
          <div className={`bg-white border rounded-lg p-6 mb-6 ${
            selectedSystem.status === 'failed' ? 'border-red-200 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className="bg-transparent p-3 rounded-lg border border-gray-200">
                {selectedSystem.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl text-gray-900">{selectedSystem.name}</h1>
                  {selectedSystem.status === 'connected' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedSystem.description}</p>
                {selectedSystem.status === 'failed' && selectedSystem.errorMessage && (
                  <div className="mb-3 p-3 bg-white border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-600 font-medium mb-1">Connection Error</p>
                        <p className="text-xs text-red-600">{selectedSystem.errorMessage}</p>
                      </div>
                    </div>
                    
                  </div>
                )}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Total files:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedSystem.documentCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last synced:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedSystem.lastSync}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 font-medium capitalize ${
                      selectedSystem.status === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}>{selectedSystem.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files and data sources..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Documents List */}
          <div>
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Files from {selectedSystem.name}
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Sync Status
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Size
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedDocuments.map((doc) => (
                      <tr 
                        key={doc.id} 
                        onClick={() => onDocumentSelect(doc)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <File className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {doc.syncStatus === 'success' ? (
                            selectedSystem.status === 'failed' ? (
                              <div className="flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                                <span className="text-xs text-yellow-600">Sync stopped - {selectedSystem.lastSync}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                <span className="text-xs text-gray-600">{doc.lastUpdated}</span>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                              <span className="text-xs text-red-600">{doc.errorReason}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs text-gray-500">{doc.size}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </div>
          </div>

          {/* Footer Stats - removed duplicate */}
        </div>
      </div>
    );
  }

  // Default view showing all connectors
  return (
    <div className="flex-1 bg-[#f5f5f3] overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Connectors</h1>
          <p className="text-sm text-gray-600">
            View all connected data sources and files available for AI-powered conversations
          </p>
        </div>

        {/* Connected Systems Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Active Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connectedSystems.map((system) => (
              <button
                key={system.id}
                onClick={() => setSelectedConnector(system.id)}
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow text-left w-full ${
                  system.status === 'failed' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  
                  <div className="bg-transparent p-2 rounded-lg flex-shrink-0 border border-gray-200">
                    {system.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-medium text-gray-900">{system.name}</h3>
                      {system.status === 'connected' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1.5">{system.description}</p>
                    {system.status === 'failed' && system.errorMessage && (
                      <div className="mb-2">
                        
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">{system.documentCount}</span> files
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-4">Available Files</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Sync Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedDocuments.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onDocumentSelect(doc)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.source}</td>
                      <td className="px-4 py-3">
                        {doc.syncStatus === 'success' ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{doc.lastUpdated}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                            <span className="text-xs text-red-600">{doc.errorReason}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </div>
        </div>

        {/* Footer Stats - removed duplicate */}
      </div>
    </div>
  );
}