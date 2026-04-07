import { useState } from 'react';
import { ShieldCheck, Download, Filter, Search, CheckCircle2, AlertTriangle, Clock, ChevronDown } from 'lucide-react';

interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  model: string;
  assurance: 'Sufficient' | 'Limited' | 'Insufficient';
  decision: string;
  loanId: string;
  reviewedBy?: string;
}

const records: AuditRecord[] = [
  {
    id: 'A-2024-0412',
    timestamp: '2026-04-05 10:24 AM',
    user: 'Tom Barr',
    action: 'BSA/AML Procedure Review',
    model: 'titan-compliance-v2',
    assurance: 'Sufficient',
    decision: 'Approve',
    loanId: 'N/A',
    reviewedBy: 'Sandra Lee'
  },
  {
    id: 'A-2024-0411',
    timestamp: '2026-04-05 9:42 AM',
    user: 'Marcus Chen',
    action: 'Commercial Loan Underwriting',
    model: 'titan-credit-v3',
    assurance: 'Sufficient',
    decision: 'Approve',
    loanId: '12345678-001',
    reviewedBy: 'Tom Barr'
  },
  {
    id: 'A-2024-0410',
    timestamp: '2026-04-04 3:15 PM',
    user: 'Sandra Lee',
    action: 'Credit Memo Analysis',
    model: 'titan-credit-v3',
    assurance: 'Limited',
    decision: 'Pending Review',
    loanId: '23456789-003',
  },
  {
    id: 'A-2024-0409',
    timestamp: '2026-04-04 11:08 AM',
    user: 'David Park',
    action: 'Covenant Compliance Check',
    model: 'titan-compliance-v2',
    assurance: 'Sufficient',
    decision: 'Pass',
    loanId: '87654321-002',
    reviewedBy: 'Sandra Lee'
  },
  {
    id: 'A-2024-0408',
    timestamp: '2026-04-03 2:30 PM',
    user: 'Janet Wu',
    action: 'Third-Party Vendor Risk Assessment',
    model: 'titan-tprm-v1',
    assurance: 'Insufficient',
    decision: 'Escalate',
    loanId: 'N/A',
  },
  {
    id: 'A-2024-0407',
    timestamp: '2026-04-03 10:55 AM',
    user: 'Marcus Chen',
    action: 'Annual Review — VFN Holdings',
    model: 'titan-credit-v3',
    assurance: 'Sufficient',
    decision: 'Approve',
    loanId: '87654321-002',
    reviewedBy: 'Tom Barr'
  },
  {
    id: 'A-2024-0406',
    timestamp: '2026-04-02 4:00 PM',
    user: 'Tom Barr',
    action: 'Regulatory Filing Analysis',
    model: 'titan-compliance-v2',
    assurance: 'Limited',
    decision: 'Pending Review',
    loanId: 'N/A',
  },
  {
    id: 'A-2024-0405',
    timestamp: '2026-04-01 9:20 AM',
    user: 'Sandra Lee',
    action: 'Loan Modification Request',
    model: 'titan-credit-v3',
    assurance: 'Sufficient',
    decision: 'Approve',
    loanId: '23456789-003',
    reviewedBy: 'David Park'
  },
];

function AssuranceBadge({ level }: { level: AuditRecord['assurance'] }) {
  if (level === 'Sufficient') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-medium border border-green-200">
        <CheckCircle2 className="w-3 h-3" /> Sufficient
      </span>
    );
  }
  if (level === 'Limited') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
        <Clock className="w-3 h-3" /> Limited
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[11px] font-medium border border-red-200">
      <AlertTriangle className="w-3 h-3" /> Insufficient
    </span>
  );
}

export function ComplianceAuditView() {
  const [search, setSearch] = useState('');
  const [assuranceFilter, setAssuranceFilter] = useState<'All' | 'Sufficient' | 'Limited' | 'Insufficient'>('All');

  const filtered = records.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.action.toLowerCase().includes(search.toLowerCase()) ||
      r.loanId.toLowerCase().includes(search.toLowerCase());
    const matchesAssurance = assuranceFilter === 'All' || r.assurance === assuranceFilter;
    return matchesSearch && matchesAssurance;
  });

  const sufficient = records.filter(r => r.assurance === 'Sufficient').length;
  const limited = records.filter(r => r.assurance === 'Limited').length;
  const insufficient = records.filter(r => r.assurance === 'Insufficient').length;

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#455a4f]" />
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Compliance Audit Log</h1>
            <p className="text-xs text-gray-500">All AI-assisted decisions with full provenance trail</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Total decisions</span>
          <span className="text-sm font-semibold text-gray-900">{records.length}</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={() => setAssuranceFilter(assuranceFilter === 'Sufficient' ? 'All' : 'Sufficient')}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${assuranceFilter === 'Sufficient' ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          {sufficient} Sufficient
        </button>
        <button
          onClick={() => setAssuranceFilter(assuranceFilter === 'Limited' ? 'All' : 'Limited')}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${assuranceFilter === 'Limited' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-700'}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          {limited} Limited
        </button>
        <button
          onClick={() => setAssuranceFilter(assuranceFilter === 'Insufficient' ? 'All' : 'Insufficient')}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${assuranceFilter === 'Insufficient' ? 'text-red-700' : 'text-gray-500 hover:text-red-700'}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          {insufficient} Insufficient
        </button>
      </div>

      {/* Search / filter bar */}
      <div className="px-6 py-3 bg-[#f5f5f3] flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, user, action, or loan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#455a4f]"
          />
        </div>
        {assuranceFilter !== 'All' && (
          <button
            onClick={() => setAssuranceFilter('All')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-3 h-3" />
            {assuranceFilter}
            <span className="text-gray-400">×</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Record ID</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Model</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Assurance</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Decision</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Loan ID</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Human Review</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3 font-mono text-gray-600">{r.id}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.timestamp}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{r.user}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px]">{r.action}</td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-[10px]">{r.model}</td>
                  <td className="px-4 py-3"><AssuranceBadge level={r.assurance} /></td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${r.decision === 'Approve' || r.decision === 'Pass' ? 'text-green-700' : r.decision === 'Escalate' ? 'text-red-600' : 'text-amber-600'}`}>
                      {r.decision}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500">{r.loanId}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {r.reviewedBy ? (
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <CheckCircle2 className="w-3 h-3" /> {r.reviewedBy}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">No records match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 mt-3">Showing {filtered.length} of {records.length} records · Titan Audit Log v2 · All times in UTC-5</p>
      </div>
    </div>
  );
}
