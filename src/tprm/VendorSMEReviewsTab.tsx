import { Plus, CheckCircle, Clock, FileText } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';

interface VendorSMEReviewsTabProps {
  vendor: SelectedVendor;
  onStartReview: (vendorId: string) => void;
}

export function VendorSMEReviewsTab({ vendor, onStartReview }: VendorSMEReviewsTabProps) {
  const reviews = [
    {
      id: '1',
      domain: 'Information Security & Business Continuity',
      reviewer: 'Jennifer Martinez',
      status: 'Complete' as const,
      dateCompleted: '2024-11-15',
      findings: 3,
    },
    {
      id: '2',
      domain: 'Information Security & Business Continuity',
      reviewer: 'Jennifer Martinez',
      status: 'Complete' as const,
      dateCompleted: '2023-11-20',
      findings: 2,
    },
    {
      id: '3',
      domain: 'Information Security & Business Continuity',
      reviewer: 'Robert Taylor',
      status: 'In Progress' as const,
      dateCompleted: '',
      findings: 0,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Not Started':
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Not Started':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-5xl space-y-6">
        {/* Header with Action Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base text-gray-900 mb-1">SME Review History</h2>
            <p className="text-sm text-gray-600">Subject matter expert assessments and findings</p>
          </div>
          <button
            onClick={() => onStartReview(vendor.id)}
            className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start InfoSec Review
          </button>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs text-gray-600">SME Domain</th>
                <th className="px-5 py-3 text-left text-xs text-gray-600">Reviewer</th>
                <th className="px-5 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-5 py-3 text-left text-xs text-gray-600">Date Completed</th>
                <th className="px-5 py-3 text-left text-xs text-gray-600">Findings</th>
                <th className="px-5 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-900">{review.domain}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{review.reviewer}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getStatusColor(review.status)}`}>
                      {getStatusIcon(review.status)}
                      {review.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {review.dateCompleted || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {review.status === 'Complete' ? review.findings : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {review.status === 'Complete' && (
                        <button className="text-sm text-[#455a4f] hover:underline">
                          View Report
                        </button>
                      )}
                      {review.status === 'In Progress' && (
                        <button
                          onClick={() => onStartReview(vendor.id)}
                          className="text-sm text-[#455a4f] hover:underline"
                        >
                          Continue Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most Recent Review Summary */}
        {reviews[0].status === 'Complete' && (
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base text-gray-900 mb-4">Most Recent Review Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Review Date: {reviews[0].dateCompleted}</div>
                <div className="text-sm text-gray-600 mb-2">Reviewer: {reviews[0].reviewer}</div>
              </div>

              <div>
                <div className="text-sm text-gray-900 mb-2">Key Findings</div>
                <div className="space-y-2">
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded flex-shrink-0 mt-0.5">
                        Moderate
                      </span>
                      <div>
                        <div className="text-sm text-yellow-900 mb-1">TPRM Policy Approval Pending</div>
                        <p className="text-xs text-yellow-700">
                          Third-party risk management policy is documented and current but lacks formal board approval. Recommend obtaining approval in Q1 2025.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded flex-shrink-0 mt-0.5">
                        Low
                      </span>
                      <div>
                        <div className="text-sm text-blue-900 mb-1">Subservice Organization Oversight</div>
                        <p className="text-xs text-blue-700">
                          AWS and Cloudflare identified as subservice organizations. Recommend annual review of their SOC 2 reports for material changes.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded flex-shrink-0 mt-0.5">
                        Low
                      </span>
                      <div>
                        <div className="text-sm text-blue-900 mb-1">Penetration Test Documentation</div>
                        <p className="text-xs text-blue-700">
                          No penetration test report received. Request annual pen test results to validate security controls effectiveness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-900 mb-2">Assessment Summary</div>
                <p className="text-sm text-gray-700">
                  Overall security posture is strong with no material concerns identified. SOC 2 Type II report shows unqualified opinion across Security, Availability, and Confidentiality criteria. Policy documentation is comprehensive and current. BitSight rating of 740 indicates advanced security maturity. Primary recommendation is to formalize TPRM policy approval process and establish routine review of subservice organization controls.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
