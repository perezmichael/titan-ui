import { ArrowLeft, Plus, Trash2, Download, Save, CheckCircle, AlertCircle, X, Check } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';
import { useState } from 'react';

interface SMEReviewFormProps {
  vendor: SelectedVendor;
  onBack: () => void;
}

export function SMEReviewForm({ vendor, onBack }: SMEReviewFormProps) {
  // Get the current engagement details
  const currentEngagement = vendor.engagements?.find(e => e.engagementId === vendor.engagementId);
  
  const [findings, setFindings] = useState([
    {
      id: '1',
      title: 'TPRM Policy Approval Pending',
      description: 'Third-party risk management policy is documented and current but lacks formal board approval.',
      severity: 'Moderate',
      remediation: 'Obtain formal board approval for TPRM policy in Q1 2025.',
    },
    {
      id: '2',
      title: 'Subservice Organization Oversight',
      description: 'AWS and Cloudflare identified as subservice organizations in SOC 2 report.',
      severity: 'Low',
      remediation: 'Establish annual review process for subservice organization SOC 2 reports.',
    },
    {
      id: '3',
      title: 'Penetration Test Documentation',
      description: 'No penetration test report has been received from vendor.',
      severity: 'Low',
      remediation: 'Request annual penetration test results to validate security controls.',
    },
  ]);

  const addFinding = () => {
    const newFinding = {
      id: Date.now().toString(),
      title: '',
      description: '',
      severity: 'Low',
      remediation: '',
    };
    setFindings([...findings, newFinding]);
  };

  const removeFinding = (id: string) => {
    setFindings(findings.filter(f => f.id !== id));
  };

  const updateFinding = (id: string, field: string, value: string) => {
    setFindings(findings.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vendor
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          <h1 className="text-xl text-gray-900">InfoSec/BC SME Review</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Vendor:</span>
          <span className="text-gray-900">{vendor.name}</span>
          <div className="h-4 w-px bg-gray-300"></div>
          <span className="text-gray-600">Engagement ID:</span>
          <span className="text-gray-900 font-mono">{vendor.engagementId}</span>
          <div className="h-4 w-px bg-gray-300"></div>
          <span className="text-gray-600">Risk Rating:</span>
          <span className={`px-2 py-0.5 rounded text-xs ${
            vendor.riskRating === 'Critical' ? 'bg-red-100 text-red-800' :
            vendor.riskRating === 'High' ? 'bg-orange-100 text-orange-800' :
            vendor.riskRating === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {vendor.riskRating}
          </span>
          {currentEngagement?.serviceOwner && (
            <>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-600">Service Owner:</span>
              <span className="text-blue-700 font-medium">{currentEngagement.serviceOwner}</span>
            </>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-5xl space-y-6">
          {/* Reviewer Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Reviewer Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Reviewer Name</label>
                <input
                  type="text"
                  defaultValue="Jennifer Martinez"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Review Date</label>
                <input
                  type="date"
                  defaultValue="2025-02-09"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Review Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Annual Assessment</option>
                  <option>Initial Due Diligence</option>
                  <option>Triggered Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents Reviewed */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Documents Reviewed</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">SOC 2 Type II Report (2024)</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">Information Security Policy</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">Incident Response Plan</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">BC/DR Plan</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">Cyber Insurance Certificate</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <X className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-900">Penetration Test Report</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded ml-auto">Not Received</span>
              </label>
            </div>
          </div>

          {/* SOC 2 Assessment */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">SOC 2 Assessment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Opinion Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Unqualified (Clean)</option>
                    <option>Qualified</option>
                    <option>Adverse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Report Period</label>
                  <input
                    type="text"
                    defaultValue="Nov 1, 2023 - Oct 31, 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Auditor</label>
                  <input
                    type="text"
                    defaultValue="Deloitte & Touche LLP"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Service Description Match</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Yes</option>
                    <option>No</option>
                    <option>Partial</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Material Findings Count</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Management Responses</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>N/A - No Findings</option>
                    <option>Adequate</option>
                    <option>Needs Improvement</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Subservice Providers</label>
                <textarea
                  defaultValue="AWS - Cloud Infrastructure&#10;Cloudflare Inc. - CDN & DDoS Protection"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Policy Maturity Assessment */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Policy Maturity Assessment</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs text-gray-600">Policy Document</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-600">Owner</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-600">Approved</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-600">Current</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-600">Maturity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 px-3 text-gray-900">Information Security Policy</td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select className="px-2 py-1 border border-gray-300 rounded text-xs">
                        <option>Mature</option>
                        <option>Developing</option>
                        <option>Initial</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-gray-900">Incident Response Plan</td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select className="px-2 py-1 border border-gray-300 rounded text-xs">
                        <option>Mature</option>
                        <option>Developing</option>
                        <option>Initial</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-gray-900">BC/DR Plan</td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select className="px-2 py-1 border border-gray-300 rounded text-xs">
                        <option>Mature</option>
                        <option>Developing</option>
                        <option>Initial</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-gray-900">TPRM Policy</td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select className="px-2 py-1 border border-gray-300 rounded text-xs">
                        <option>Mature</option>
                        <option selected>Developing</option>
                        <option>Initial</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BitSight Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">BitSight Summary</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">BitSight Score</label>
                <input
                  type="number"
                  defaultValue="740"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Ransomware Susceptibility</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Data Breach History</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>None</option>
                  <option>Historical (&gt;2 years)</option>
                  <option>Recent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Risk Categories Below "A"</label>
              <textarea
                defaultValue="Patching Cadence: B (Good)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* OSINT Findings */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">OSINT Findings</h2>
            <textarea
              defaultValue="No adverse media identified in the past 12 months. No security incidents, regulatory actions, or significant legal proceedings found in public sources.&#10;&#10;Note: Vendor completed Series C funding round ($45M led by Sequoia Capital) in June 2024. No impact on service delivery or ownership structure."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document any adverse media, security incidents, regulatory issues, or other findings from open source intelligence gathering..."
            />
          </div>

          {/* RTO Alignment */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">RTO Alignment</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Vendor Stated RTO</label>
                <input
                  type="text"
                  defaultValue="4 hours"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">RM-Reported RTO</label>
                <input
                  type="text"
                  defaultValue="4 hours"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Alignment Status</label>
                <div className="flex items-center gap-2 h-10">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Findings & Observations */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base text-gray-900">Findings & Observations</h2>
              <button
                onClick={addFinding}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Finding
              </button>
            </div>
            <div className="space-y-4">
              {findings.map((finding, index) => (
                <div key={finding.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm text-gray-600">Finding #{index + 1}</span>
                    <button
                      onClick={() => removeFinding(finding.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={finding.title}
                        onChange={(e) => updateFinding(finding.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief title for the finding"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      <textarea
                        value={finding.description}
                        onChange={(e) => updateFinding(finding.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Detailed description of the issue or observation"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Severity</label>
                        <select
                          value={finding.severity}
                          onChange={(e) => updateFinding(finding.id, 'severity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Critical</option>
                          <option>High</option>
                          <option>Moderate</option>
                          <option>Low</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Recommended Remediation</label>
                      <textarea
                        value={finding.remediation}
                        onChange={(e) => updateFinding(finding.id, 'remediation', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Recommended actions to address this finding"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Considerations */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Key Considerations</h2>
            <textarea
              defaultValue="1. Vendor demonstrates strong security posture with unqualified SOC 2 opinion and advanced BitSight rating&#10;2. Policy documentation is comprehensive but TPRM policy requires board approval&#10;3. Subservice organization controls should be monitored annually&#10;4. Request penetration test documentation to complete assessment"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Key considerations for this vendor engagement..."
            />
          </div>

          {/* Assessment Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Assessment Summary</h2>
            <textarea
              defaultValue="Overall security posture is strong with no material concerns identified. SOC 2 Type II report shows unqualified opinion across Security, Availability, and Confidentiality criteria. Policy documentation is comprehensive and current. BitSight rating of 740 indicates advanced security maturity. Primary recommendation is to formalize TPRM policy approval process and establish routine review of subservice organization controls."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Overall assessment summary..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-5">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors">
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
