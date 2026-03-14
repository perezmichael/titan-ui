import { useState } from 'react';
import { Search, Download } from 'lucide-react';

export function CrossVendorQuery() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);

  const suggestedQueries = [
    'Vendors with RTO under 24 hours',
    'Critical-rated engagements',
    'Contracts expiring this quarter',
    'Vendors providing SaaS',
    'Assessments overdue',
    'Vendors with SOC 2 reports expiring soon',
    'High-risk vendors without recent assessments',
    'Vendors handling PII data',
  ];

  const handleQueryClick = (queryText: string) => {
    setQuery(queryText);
    
    // Simulate different results based on query
    if (queryText.includes('RTO under 24 hours')) {
      setResults({
        type: 'table',
        summary: 'Found 3 vendors with Recovery Time Objective under 24 hours',
        data: [
          {
            name: 'CloudBank Solutions',
            engagementId: 'AXM-2024-001',
            rto: '4 hours',
            service: 'Core Banking Platform',
            riskRating: 'Critical',
          },
          {
            name: 'PayTech Services',
            engagementId: 'AXM-2023-087',
            rto: '2 hours',
            service: 'Payment Processing',
            riskRating: 'Critical',
          },
          {
            name: 'CyberShield Security',
            engagementId: 'AXM-2024-067',
            rto: '12 hours',
            service: 'Managed Security Services',
            riskRating: 'High',
          },
        ],
      });
    } else if (queryText.includes('Critical-rated')) {
      setResults({
        type: 'table',
        summary: 'Found 2 critical-rated vendor engagements',
        data: [
          {
            name: 'CloudBank Solutions',
            engagementId: 'AXM-2024-001',
            service: 'Core Banking Platform',
            lastAssessment: '2024-11-15',
            nextDue: '2025-05-15',
            relationshipManager: 'Sarah Chen',
          },
          {
            name: 'PayTech Services',
            engagementId: 'AXM-2023-087',
            service: 'Payment Processing',
            lastAssessment: '2024-10-20',
            nextDue: '2025-04-20',
            relationshipManager: 'Emily Johnson',
          },
        ],
      });
    } else if (queryText.includes('expiring this quarter')) {
      setResults({
        type: 'table',
        summary: 'Found 1 contract expiring in Q1 2025',
        data: [
          {
            name: 'Marketing Automation Co',
            engagementId: 'AXM-2024-023',
            service: 'Marketing Automation Platform',
            contractExpiration: '2025-03-31',
            terminationNotice: '90 days',
            relationshipManager: 'Tom Wilson',
          },
        ],
      });
    } else if (queryText.includes('SaaS')) {
      setResults({
        type: 'table',
        summary: 'Found 5 vendors providing SaaS solutions',
        data: [
          {
            name: 'CloudBank Solutions',
            engagementId: 'AXM-2024-001',
            service: 'Core Banking Platform',
            riskRating: 'Critical',
          },
          {
            name: 'SecureData Inc.',
            engagementId: 'AXM-2024-012',
            service: 'Document Management System',
            riskRating: 'High',
          },
          {
            name: 'DataAnalytics Pro',
            engagementId: 'AXM-2024-034',
            service: 'Business Intelligence & Analytics',
            riskRating: 'Moderate',
          },
          {
            name: 'Marketing Automation Co',
            engagementId: 'AXM-2024-023',
            service: 'Marketing Automation Platform',
            riskRating: 'Moderate',
          },
          {
            name: 'CloudBackup Systems',
            engagementId: 'AXM-2025-003',
            service: 'Backup & Disaster Recovery',
            riskRating: 'High',
          },
        ],
      });
    } else if (queryText.includes('overdue')) {
      setResults({
        type: 'table',
        summary: 'Found 1 overdue assessment requiring immediate attention',
        data: [
          {
            name: 'Marketing Automation Co',
            engagementId: 'AXM-2024-023',
            service: 'Marketing Automation Platform',
            lastAssessment: '2024-07-22',
            nextDue: '2025-01-22',
            daysOverdue: '18 days',
            relationshipManager: 'Tom Wilson',
          },
        ],
      });
    } else {
      setResults({
        type: 'summary',
        summary: `Results for "${queryText}"`,
        text: 'This query would return relevant vendor portfolio data. The TPRM Agent can search across all vendor records, documents, assessments, and risk data to answer your questions.',
      });
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      handleQueryClick(query);
    }
  };

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl text-gray-900 mb-1">Query Portfolio</h1>
        <p className="text-sm text-gray-500">Ask questions about your vendor portfolio using natural language</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ask a question about your vendor portfolio..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2.5 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
            >
              Search
            </button>
          </div>

          {/* Suggested Queries */}
          <div>
            <h2 className="text-sm text-gray-600 mb-3">Suggested Queries</h2>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((sq, index) => (
                <button
                  key={index}
                  onClick={() => handleQueryClick(sq)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base text-gray-900 mb-1">Results</h2>
                  <p className="text-sm text-gray-600">{results.summary}</p>
                </div>
                {results.type === 'table' && (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                )}
              </div>

              {results.type === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {Object.keys(results.data[0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.data.map((row: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {Object.entries(row).map(([key, value]: [string, any], cellIndex) => (
                            <td key={cellIndex} className="px-4 py-3">
                              {key === 'riskRating' ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getRiskColor(value)}`}>
                                  {value}
                                </span>
                              ) : key === 'daysOverdue' ? (
                                <span className="text-red-700">{value}</span>
                              ) : (
                                <span className="text-gray-900">{value}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {results.type === 'summary' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{results.text}</p>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          {!results && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm text-blue-900 mb-2">How to use Query Portfolio</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ask questions in natural language about your vendors, contracts, and assessments</li>
                <li>• Click a suggested query to see example results</li>
                <li>• Export results as CSV for further analysis</li>
                <li>• Combine multiple criteria (e.g., "High-risk SaaS vendors with assessments due this month")</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
