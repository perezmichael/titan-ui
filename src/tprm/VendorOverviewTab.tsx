import { Building, Mail, Phone, Calendar, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';

interface VendorOverviewTabProps {
  vendor: SelectedVendor;
}

export function VendorOverviewTab({ vendor }: VendorOverviewTabProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-5xl space-y-6">
          {/* Vendor Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Vendor Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Company Name</div>
                    <div className="text-sm text-gray-900">{vendor.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Primary Contact</div>
                    <div className="text-sm text-gray-900">contact@{vendor.name.toLowerCase().replace(/\s+/g, '')}.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <div className="text-sm text-gray-900">(555) 123-4567</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Engagement ID</div>
                  <div className="text-sm text-gray-900 font-mono">{vendor.engagementId}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Service Description</div>
                  <div className="text-sm text-gray-900">
                    {vendor.id === '1' && 'Core Banking Platform - SaaS'}
                    {vendor.id === '2' && 'Document Management System'}
                    {vendor.id === '3' && 'Payment Processing Services'}
                    {vendor.id !== '1' && vendor.id !== '2' && vendor.id !== '3' && 'Cloud-based business services'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Address</div>
                  <div className="text-sm text-gray-900">123 Tech Street, San Francisco, CA 94105</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Rating Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Risk Assessment</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <div className="text-xs text-gray-500 mb-2">Overall Risk Rating</div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border ${
                  vendor.riskRating === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                  vendor.riskRating === 'High' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                  vendor.riskRating === 'Moderate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {vendor.riskRating}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Data Risk</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      vendor.riskRating === 'Critical' || vendor.riskRating === 'High' ? 'bg-red-500 w-5/6' : 'bg-yellow-500 w-3/5'
                    }`}></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    {vendor.riskRating === 'Critical' || vendor.riskRating === 'High' ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Operational Risk</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      vendor.riskRating === 'Critical' ? 'bg-red-500 w-5/6' : 
                      vendor.riskRating === 'High' ? 'bg-orange-500 w-4/6' : 'bg-yellow-500 w-2/5'
                    }`}></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    {vendor.riskRating === 'Critical' ? 'High' : vendor.riskRating === 'High' ? 'Moderate' : 'Low'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Compliance Risk</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      vendor.riskRating === 'Critical' || vendor.riskRating === 'High' ? 'bg-orange-500 w-4/6' : 'bg-green-500 w-2/6'
                    }`}></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    {vendor.riskRating === 'Critical' || vendor.riskRating === 'High' ? 'Moderate' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Engagement Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base text-gray-900 mb-4">Engagement Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Relationship Manager</span>
                  <span className="text-sm text-gray-900">Sarah Chen</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Service Owner</span>
                  <span className="text-sm text-gray-900">Michael Rodriguez</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Onboarding Date</span>
                  <span className="text-sm text-gray-900">2023-03-15</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Last Assessment</span>
                  <span className="text-sm text-gray-900">2024-11-15</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Next Reassessment</span>
                  <span className="text-sm text-gray-900">2025-05-15</span>
                </div>
              </div>
            </div>

            {/* Criticality Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base text-gray-900 mb-4">Criticality Metrics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Recovery Time Objective</span>
                  <span className="text-sm font-medium text-gray-900">4 hours</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Data Classifications</span>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Confidential</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">PII</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Regulatory Scope</span>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">GLBA</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">SOX</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Annual Spend</span>
                  <span className="text-sm text-gray-900">$450,000</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Contract Expiration</span>
                  <span className="text-sm text-gray-900">2026-12-31</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">SOC 2 Type II Report Reviewed</span>
                    <span className="text-xs text-gray-500">2024-11-15</span>
                  </div>
                  <p className="text-xs text-gray-600">InfoSec SME completed review of annual SOC 2 report. No material findings identified.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">BitSight Score Updated</span>
                    <span className="text-xs text-gray-500">2024-11-10</span>
                  </div>
                  <p className="text-xs text-gray-600">BitSight rating improved from 720 to 740. Security posture continues to strengthen.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">Insurance Certificate Expiring Soon</span>
                    <span className="text-xs text-gray-500">2024-11-01</span>
                  </div>
                  <p className="text-xs text-gray-600">Cyber liability insurance certificate expires in 60 days. Renewal request sent to vendor.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">Quarterly Business Review Completed</span>
                    <span className="text-xs text-gray-500">2024-10-22</span>
                  </div>
                  <p className="text-xs text-gray-600">Q3 2024 QBR held with vendor executive team. Service levels meeting expectations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Open Issues */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Open Issues</h3>
            <div className="space-y-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-900">High - Insurance Renewal</span>
                </div>
                <p className="text-xs text-red-700 ml-6">Cyber liability policy expires in 58 days</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-yellow-900">Medium - Contract Review</span>
                </div>
                <p className="text-xs text-yellow-700 ml-6">Annual contract amendment pending legal review</p>
              </div>
            </div>
          </div>

          {/* Document Completeness */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Document Completeness</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600">SOC 2 Report</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xs text-gray-500">Current (2024)</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600">Master Service Agreement</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xs text-gray-500">Executed</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600">Insurance Certificate</span>
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-xs text-gray-500">Expires 2025-01-15</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600">BC/DR Plan</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xs text-gray-500">Reviewed 2024-11</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600">Pen Test Report</span>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-xs text-gray-500">Missing</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                Request Documents
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                Schedule QBR
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                Update Risk Rating
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
