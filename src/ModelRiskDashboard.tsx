import { BarChart2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status: 'good' | 'warn' | 'alert';
}

function MetricCard({ label, value, subtext, trend, trendValue, status }: MetricCardProps) {
  const statusColor = status === 'good' ? 'border-green-200' : status === 'warn' ? 'border-amber-300' : 'border-red-300';
  const statusDot = status === 'good' ? 'bg-green-500' : status === 'warn' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className={`bg-white rounded-lg border ${statusColor} p-4`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        <div className={`w-2 h-2 rounded-full ${statusDot} mt-0.5`} />
      </div>
      <div className="text-2xl font-semibold text-gray-900 mb-1">{value}</div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-500">{subtext}</span>
        {trend && trendValue && (
          <span className={`flex items-center gap-0.5 text-[11px] font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

// Sparkline bar chart (pure CSS/SVG)
function BarSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color}`}
          style={{ height: `${(v / max) * 100}%`, opacity: i === values.length - 1 ? 1 : 0.45 + (i / values.length) * 0.55 }}
        />
      ))}
    </div>
  );
}

interface ModelRowProps {
  name: string;
  version: string;
  accuracy: number;
  drift: 'Low' | 'Moderate' | 'High';
  decisionsToday: number;
  lastRetrained: string;
  srStatus: 'Approved' | 'Pending' | 'Review Required';
  weeklyAccuracy: number[];
}

function DriftBadge({ level }: { level: ModelRowProps['drift'] }) {
  if (level === 'Low') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-medium border border-green-200"><CheckCircle2 className="w-3 h-3" /> Low</span>;
  if (level === 'Moderate') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200"><Clock className="w-3 h-3" /> Moderate</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-medium border border-red-200"><AlertTriangle className="w-3 h-3" /> High</span>;
}

function SRBadge({ status }: { status: ModelRowProps['srStatus'] }) {
  if (status === 'Approved') return <span className="text-[10px] font-medium text-green-700">Approved</span>;
  if (status === 'Pending') return <span className="text-[10px] font-medium text-amber-600">Pending</span>;
  return <span className="text-[10px] font-medium text-red-600">Review Required</span>;
}

const models: ModelRowProps[] = [
  {
    name: 'Credit Risk',
    version: 'titan-credit-v3',
    accuracy: 94.2,
    drift: 'Low',
    decisionsToday: 14,
    lastRetrained: '2026-03-01',
    srStatus: 'Approved',
    weeklyAccuracy: [93, 94, 93.5, 94.8, 94.2, 93.9, 94.2],
  },
  {
    name: 'Compliance Review',
    version: 'titan-compliance-v2',
    accuracy: 91.7,
    drift: 'Moderate',
    decisionsToday: 9,
    lastRetrained: '2026-01-15',
    srStatus: 'Pending',
    weeklyAccuracy: [93, 92.5, 92, 91.8, 91.5, 91.7, 91.7],
  },
  {
    name: 'Third-Party Risk',
    version: 'titan-tprm-v1',
    accuracy: 88.3,
    drift: 'High',
    decisionsToday: 3,
    lastRetrained: '2025-11-10',
    srStatus: 'Review Required',
    weeklyAccuracy: [92, 91, 90, 89.5, 89, 88.5, 88.3],
  },
];

export function ModelRiskDashboard() {
  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-5 h-5 text-[#455a4f]" />
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Model Health Dashboard</h1>
            <p className="text-xs text-gray-500">SR 11-7 model risk monitoring · Updated April 5, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <Info className="w-3.5 h-3.5" />
          <span>Data refreshes every 15 minutes</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-5 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Overall Model Accuracy"
            value="91.4%"
            subtext="7-day average"
            trend="down"
            trendValue="−0.8% vs last week"
            status="warn"
          />
          <MetricCard
            label="Decisions Today"
            value="26"
            subtext="Across 3 models"
            trend="up"
            trendValue="+4 vs yesterday"
            status="good"
          />
          <MetricCard
            label="Models Requiring Attention"
            value="1"
            subtext="High drift detected"
            status="alert"
          />
          <MetricCard
            label="Human Override Rate"
            value="8.3%"
            subtext="30-day rolling"
            trend="neutral"
            trendValue="±0.2%"
            status="good"
          />
        </div>

        {/* Model table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-900">Production Models</h2>
            <span className="text-[10px] text-gray-400">{models.length} models · SR 11-7 compliant framework</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Model</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Accuracy</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">7-Day Trend</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Data Drift</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Decisions Today</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Last Retrained</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">SR 11-7 Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.version} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">{m.version}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-sm ${m.accuracy >= 93 ? 'text-green-700' : m.accuracy >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                      {m.accuracy}%
                    </span>
                  </td>
                  <td className="px-4 py-3 w-24">
                    <BarSparkline
                      values={m.weeklyAccuracy}
                      color={m.accuracy >= 93 ? 'bg-green-400' : m.accuracy >= 90 ? 'bg-amber-400' : 'bg-red-400'}
                    />
                  </td>
                  <td className="px-4 py-3"><DriftBadge level={m.drift} /></td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{m.decisionsToday}</td>
                  <td className="px-4 py-3 text-gray-500">{m.lastRetrained}</td>
                  <td className="px-4 py-3"><SRBadge status={m.srStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alert panel */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-red-800 mb-1">Action Required — titan-tprm-v1</div>
              <p className="text-xs text-red-700">
                Data drift has exceeded the SR 11-7 threshold for <strong>titan-tprm-v1</strong>. This model was last retrained on November 10, 2025 and accuracy has declined 3.7 points over the past 7 days. Model Risk Management review is required before further use.
              </p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 text-[11px] font-medium bg-red-600 text-white rounded hover:bg-red-700">Initiate Review</button>
                <button className="px-3 py-1 text-[11px] font-medium bg-white text-red-700 border border-red-300 rounded hover:bg-red-50">View Full Report</button>
              </div>
            </div>
          </div>
        </div>

        {/* Assurance distribution */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Assurance Level Distribution (30 days)</h3>
            <div className="space-y-2">
              {[
                { label: 'Sufficient', pct: 72, color: 'bg-green-500' },
                { label: 'Limited', pct: 19, color: 'bg-amber-400' },
                { label: 'Insufficient', pct: 9, color: 'bg-red-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-600 w-20">{item.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 w-8 text-right">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Human Override Reasons (30 days)</h3>
            <div className="space-y-2">
              {[
                { label: 'New customer relationship', count: 8 },
                { label: 'Exception to policy', count: 5 },
                { label: 'Additional context available', count: 4 },
                { label: 'Regulatory nuance', count: 3 },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">{item.label}</span>
                  <span className="text-[11px] font-semibold text-gray-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
