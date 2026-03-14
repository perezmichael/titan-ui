import { ArrowLeft, ChevronRight, FileText, Download, Pencil } from 'lucide-react';

interface ProspectiveDealDetailViewProps {
  onBack: () => void;
}

const documents = [
  { title: 'Loan Application', source: 'Customer Portal', link: '/docs/loan-application.pdf' },
  { title: 'Financial Statements 2024', source: 'Customer Portal', link: '/docs/financials-2024.pdf' },
  { title: 'Tax Returns (3 years)', source: 'Customer Portal', link: '/docs/tax-returns.pdf' },
  { title: 'Property Appraisal', source: 'Third Party Appraiser', link: '/docs/property-appraisal.pdf' },
  { title: 'Business Plan', source: 'Customer Portal', link: '/docs/business-plan.pdf' },
  { title: 'Personal Financial Statement', source: 'Customer Portal', link: '/docs/pfs.pdf' },
  { title: 'Credit Bureau Report', source: 'Credit Bureau', link: '/docs/credit-report.pdf' },
  { title: 'Environmental Assessment', source: 'Environmental Consultant', link: '/docs/environmental.pdf' }
];

export function ProspectiveDealDetailView({ onBack }: ProspectiveDealDetailViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f5f3]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Commercial Lending
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-xl text-gray-900">Lakeside Retail Partners</h1>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
              Prospective Deal
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4 px-6">
            
            {/* Available Actions - Prominently at Top */}
            <div className="mb-6">
              <h2 className="text-lg mb-3 text-gray-900">What would you like to do?</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white border border-gray-300 p-3 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all text-left group">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Draft Credit Memo</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Generate credit memo for approval
                  </p>
                </button>
                <button className="bg-white border border-gray-300 p-3 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all text-left group">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Chat with Deal</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Ask questions about deal
                  </p>
                </button>
              </div>
            </div>

            {/* Deal Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base text-gray-900">Deal Overview</h2>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Requested Amount</div>
                  <div className="text-xl text-gray-900">$2.50M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Purpose</div>
                  <div className="text-xl text-gray-900">CRE</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Expected Close</div>
                  <div className="text-xl text-gray-900">Mar 15, 2025</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Stage</div>
                  <div className="text-xl text-gray-900">Underwriting</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Proposed Rate</div>
                  <div className="text-xl text-gray-900">7.25%</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 grid grid-cols-5 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Business Type</div>
                  <div className="text-sm text-gray-900">Retail - Shopping Center</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Loan Officer</div>
                  <div className="text-sm text-gray-900">Sarah Johnson</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Property Location</div>
                  <div className="text-sm text-gray-900">Austin, TX</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">LTV Ratio</div>
                  <div className="text-sm text-gray-900">75%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">DSCR</div>
                  <div className="text-sm text-gray-900">1.35x</div>
                </div>
              </div>
            </div>

            {/* Underwriting Checklist */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base text-gray-900 mb-3">Underwriting Checklist</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-900">Financial statements reviewed</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-900">Credit bureau report obtained</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-900">Property appraisal completed</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded">
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-200"></div>
                  <span className="text-sm text-gray-900">Environmental assessment pending</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-300"></div>
                  <span className="text-sm text-gray-500">Credit committee approval</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-300"></div>
                  <span className="text-sm text-gray-500">Loan documentation</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base text-gray-900 mb-3">Documents</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs text-gray-600">Title</th>
                      <th className="text-left py-2 px-3 text-xs text-gray-600">Source</th>
                      <th className="text-left py-2 px-3 text-xs text-gray-600">Link</th>
                      <th className="text-center py-2 px-3 text-xs text-gray-600">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2.5 px-3 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {doc.title}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-gray-600">{doc.source}</td>
                        <td className="py-2.5 px-3 text-sm">
                          <a href={doc.link} className="text-blue-600 hover:text-blue-800 hover:underline">
                            {doc.link}
                          </a>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
