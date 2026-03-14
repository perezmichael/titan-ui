import { CheckCircle, AlertTriangle, Bot, Check, X } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';
import { useState } from 'react';

interface VendorAnalysisTabProps {
  vendor: SelectedVendor;
}

export function VendorAnalysisTab({ vendor }: VendorAnalysisTabProps) {
  const [contractVerified, setContractVerified] = useState(false);
  const [soc2Verified, setSoc2Verified] = useState(false);
  const [policyVerified, setPolicyVerified] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);
  const [bitsightVerified, setBitsightVerified] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-5xl space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm text-blue-900 mb-1">AI-Extracted Intelligence</div>
            <div className="text-xs text-blue-700">
              The information below was automatically extracted from uploaded documents. Please review and verify each section for accuracy.
            </div>
          </div>
        </div>

        {/* Contract Intelligence */}
        <div className={`bg-white rounded-lg border ${contractVerified ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'} p-5`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base text-gray-900">Contract Intelligence</h2>
              {!contractVerified && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300">
                  Needs Verification
                </span>
              )}
            </div>
            <button
              onClick={() => setContractVerified(!contractVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                contractVerified
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {contractVerified ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </>
              ) : (
                <>
                  Mark as Verified
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Execution Date</div>
              <div className="text-sm text-gray-900">March 1, 2023</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Term Length</div>
              <div className="text-sm text-gray-900">3 years</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Renewal Date</div>
              <div className="text-sm text-gray-900">March 1, 2026</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Termination Notice</div>
              <div className="text-sm text-gray-900">90 days</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Evergreen</div>
              <div className="text-sm text-gray-900">No</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Auto-Renewal</div>
              <div className="text-sm text-gray-900">Yes, with notice</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">Key Clauses Identified</div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                <Check className="w-3 h-3" />
                Data Encryption (AES-256)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                <Check className="w-3 h-3" />
                Incident Response (24hr notification)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                <Check className="w-3 h-3" />
                Right to Audit
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-200">
                <AlertTriangle className="w-3 h-3" />
                Limited Indemnification
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                <Check className="w-3 h-3" />
                Data Ownership & Return
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-200">
                <AlertTriangle className="w-3 h-3" />
                Subcontracting Allowed
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                <Check className="w-3 h-3" />
                SLA: 99.9% Uptime
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Flagged Provisions</div>
            <div className="space-y-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="text-sm text-yellow-900 mb-1">Limited Liability Cap</div>
                <p className="text-xs text-yellow-700">
                  Vendor liability is capped at 12 months of fees paid. Consider whether this is adequate given the critical nature of the service.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="text-sm text-yellow-900 mb-1">Subcontractor Provisions</div>
                <p className="text-xs text-yellow-700">
                  Contract allows subcontracting without prior approval. Recommend negotiating notification requirement for critical subservices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SOC 2 Summary */}
        <div className={`bg-white rounded-lg border ${soc2Verified ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'} p-5`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base text-gray-900">SOC 2 Type II Assessment</h2>
              {!soc2Verified && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300">
                  Needs Verification
                </span>
              )}
            </div>
            <button
              onClick={() => setSoc2Verified(!soc2Verified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                soc2Verified
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {soc2Verified ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </>
              ) : (
                <>
                  Mark as Verified
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Opinion Type</div>
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                Unqualified (Clean)
              </span>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Report Period</div>
              <div className="text-sm text-gray-900">Nov 1, 2023 - Oct 31, 2024</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Auditor</div>
              <div className="text-sm text-gray-900">Deloitte & Touche LLP</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Service Description Match</div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">Yes - Core Banking Platform</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Material Findings</div>
              <div className="text-sm text-gray-900">None</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Trust Service Categories</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                Security
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                Availability
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                Confidentiality
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">Subservice Organizations</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                Amazon Web Services (AWS) - Cloud Infrastructure
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                Cloudflare Inc. - CDN & DDoS Protection
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Bridge Letter</div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-900">On file, no gaps in coverage</span>
            </div>
          </div>
        </div>

        {/* Policy & Procedure Maturity */}
        <div className={`bg-white rounded-lg border ${policyVerified ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'} p-5`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base text-gray-900">Policy & Procedure Maturity</h2>
              {!policyVerified && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300">
                  Needs Verification
                </span>
              )}
            </div>
            <button
              onClick={() => setPolicyVerified(!policyVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                policyVerified
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {policyVerified ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </>
              ) : (
                <>
                  Mark as Verified
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs text-gray-600">Policy Document</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-600">Owner Documented</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-600">Approved</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-600">Current (&lt;12mo)</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-600">Maturity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-3 text-gray-900">Information Security Policy</td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      Mature
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-gray-900">Incident Response Plan</td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      Mature
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-gray-900">BC/DR Plan</td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      Mature
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-gray-900">TPRM Policy</td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <X className="w-4 h-4 text-red-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Developing
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Insurance Coverage */}
        <div className={`bg-white rounded-lg border ${insuranceVerified ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'} p-5`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base text-gray-900">Insurance Coverage</h2>
              {!insuranceVerified && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300">
                  Needs Verification
                </span>
              )}
            </div>
            <button
              onClick={() => setInsuranceVerified(!insuranceVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                insuranceVerified
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {insuranceVerified ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </>
              ) : (
                <>
                  Mark as Verified
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Cyber Liability Insurance</span>
              <span className="text-sm text-gray-900">$5,000,000</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">General Liability</span>
              <span className="text-sm text-gray-900">$2,000,000</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Errors & Omissions</span>
              <span className="text-sm text-gray-900">$3,000,000</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Policy Expiration</span>
              <span className="text-sm text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                January 15, 2025 (58 days)
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Bank Named as Additional Insured</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* BitSight & OSINT */}
        <div className={`bg-white rounded-lg border ${bitsightVerified ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'} p-5`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base text-gray-900">BitSight & OSINT Analysis</h2>
              {!bitsightVerified && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300">
                  Needs Verification
                </span>
              )}
            </div>
            <button
              onClick={() => setBitsightVerified(!bitsightVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                bitsightVerified
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {bitsightVerified ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </>
              ) : (
                <>
                  Mark as Verified
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">BitSight Security Rating</div>
              <div className="text-4xl text-green-600 mb-1">740</div>
              <div className="text-xs text-gray-600">Advanced (700-799)</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">Ransomware Susceptibility</div>
              <div className="text-2xl text-green-600 mb-1">Low</div>
              <div className="text-xs text-gray-600">Well Protected</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">Data Breach History</div>
              <div className="text-2xl text-gray-900 mb-1">None</div>
              <div className="text-xs text-gray-600">No incidents found</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Risk Categories Below "A" Rating</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-900">Patching Cadence</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">B (Good)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-900">Application Security</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">A (Excellent)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-900">Network Security</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">A (Excellent)</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">OSINT Findings (Last 12 Months)</div>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-900 mb-1">No adverse media identified</div>
                <p className="text-xs text-gray-600">
                  No security incidents, regulatory actions, or significant legal proceedings found in public sources.
                </p>
              </div>
              <div className="bg-blue-50 rounded p-3 border border-blue-200">
                <div className="text-sm text-blue-900 mb-1">M&A Activity - Series C Funding</div>
                <p className="text-xs text-blue-700">
                  Completed $45M Series C funding round led by Sequoia Capital. No change in ownership structure or service delivery.
                  <span className="block mt-1">Source: TechCrunch, June 2024</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
