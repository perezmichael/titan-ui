import { ArrowLeft, ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';
import { useState } from 'react';

interface DealDetailViewProps {
  onBack: () => void;
}

const subNotes = [
  {
    noteNumber: '54001621-20',
    balance: '$674,905.61',
    dueDate: '1/15/2026',
    paymentAmount: '$4,218.42'
  },
  {
    noteNumber: '54001621-140',
    balance: '$311,290.33',
    dueDate: '1/15/2026',
    paymentAmount: '$1,945.57'
  },
  {
    noteNumber: '54001621-190',
    balance: '$459,213.96',
    dueDate: '1/30/2026',
    paymentAmount: '$1,088.55'
  },
  {
    noteNumber: '54001621-200',
    balance: '$507,679.97',
    dueDate: '2/6/2026',
    paymentAmount: '$1,052.67'
  },
  {
    noteNumber: '54001621-240',
    balance: '$2,584,938.71',
    dueDate: '1/30/2026',
    paymentAmount: '$4,242.72'
  }
];

const documents = [
  { title: '2023 Annual Review', source: 'Internal Review System', link: '/docs/annual-review-2023.pdf' },
  { title: 'Credit Agreement', source: 'Legal Department', link: '/docs/credit-agreement.pdf' },
  { title: 'Loan Approval Form', source: 'Loan Origination System', link: '/docs/loan-approval.pdf' },
  { title: 'Moody\'s Spreads', source: 'Risk Analytics', link: '/docs/moodys-spreads.xlsx' },
  { title: 'Financial Statements Q4 2023', source: 'Accounting System', link: '/docs/financials-q4-2023.pdf' },
  { title: 'Collateral Valuation Report', source: 'Third Party Appraiser', link: '/docs/collateral-valuation.pdf' },
  { title: 'Insurance Certificate', source: 'Customer Portal', link: '/docs/insurance-cert.pdf' },
  { title: 'Borrowing Base Certificate', source: 'Customer Portal', link: '/docs/borrowing-base.pdf' },
  { title: 'Compliance Checklist', source: 'Compliance Department', link: '/docs/compliance-checklist.pdf' },
  { title: 'Board Resolution', source: 'Legal Department', link: '/docs/board-resolution.pdf' }
];

export function DealDetailView({ onBack }: DealDetailViewProps) {
  const [isSubNotesExpanded, setIsSubNotesExpanded] = useState(false);

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
              Back to Relationships
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-xl text-gray-900">VFN Holdings Inc.</h1>
            <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Active Customer
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4 px-6">
            
            {/* Available Actions - Prominently at Top */}
            <div className="mb-6">
              <h2 className="text-lg mb-3 text-gray-900">What would you like to do?</h2>
              <div className="grid grid-cols-3 gap-3">
                <button className="bg-white border border-gray-300 p-3 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all text-left group">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Annual Review</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Complete annual review
                  </p>
                </button>
                <button className="bg-white border border-gray-300 p-3 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all text-left group">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Loan Modification</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Modify loan terms
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

            {/* Key Metrics & Relationship Details - Combined */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base text-gray-900 mb-3">Key Metrics & Relationship Details</h2>
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Credit Exposure</div>
                  <div className="text-xl text-gray-900">$6.49M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Loans</div>
                  <div className="text-xl text-gray-900">$4.54M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Deposits</div>
                  <div className="text-xl text-gray-900">$1.95M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Earliest Maturity</div>
                  <div className="text-xl text-gray-900">Jan 15, 2026</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Current Risk Rating</div>
                  <div className="text-xl text-gray-900">3</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 grid grid-cols-5 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Household Name</div>
                  <div className="text-sm text-gray-900">VFN Holdings Inc.</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">CIP Code</div>
                  <div className="text-sm text-gray-900">VFNHOL</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Relationship Manager</div>
                  <div className="text-sm text-gray-900">Matt Beck</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Number of Facilities</div>
                  <div className="text-sm text-gray-900">5 notes</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Last Annual Review</div>
                  <div className="text-sm text-gray-900">December 15, 2023</div>
                </div>
              </div>
            </div>

            {/* Sub-Notes Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setIsSubNotesExpanded(!isSubNotesExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-base text-gray-900">Sub-Notes Summary</h2>
                  <span className="text-xs text-gray-500">5 notes</span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </button>
              
              {isSubNotesExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-3 mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    Note: Annual reviews are completed at the relationship level, not per sub-note
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs text-gray-600">Note #</th>
                          <th className="text-right py-2 px-3 text-xs text-gray-600">Balance</th>
                          <th className="text-right py-2 px-3 text-xs text-gray-600">Due Date</th>
                          <th className="text-right py-2 px-3 text-xs text-gray-600">Payment Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subNotes.map((note) => (
                          <tr key={note.noteNumber} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm text-gray-900">{note.noteNumber}</td>
                            <td className="py-2 px-3 text-sm text-gray-900 text-right">{note.balance}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 text-right">{note.dueDate}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 text-right">{note.paymentAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
