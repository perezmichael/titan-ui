import { ThumbsUp, ThumbsDown, Heart, Info, FileText, ExternalLink, Cloud, Upload, Database, Copy, ChevronDown, ChevronUp, ChevronRight, Download, CheckCircle2, XCircle, AlertTriangle, Clock, Layers, BarChart2, X, Shield, Search, BookOpen, Sparkles, Flag } from 'lucide-react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

// ── Audit data types ──────────────────────────────────────────────────────────

interface AuditSource {
  rank: number;
  name: string;
  weight: number; // 0–100 Shapley %
  importance?: 'critical' | 'significant';
  keyFactors: string[];
  retrieval?: { semanticScore: number; keyword: string; entity?: string };
  saliency?: number;
  snippet?: string;
  score?: number;
}

interface AuditClaim {
  text: string;
  grounded: boolean;
  confidenceScore: number; // 0–100
  supportedBy: Array<{ sourceRef: number; name: string; role: 'primary' | 'corroborating' }>;
}

interface AuditWaveStep {
  label: string;
  type: 'planning' | 'search' | 'analysis' | 'synthesis' | 'quality';
  docCount?: number;
  timeMs?: number;
  detail?: string;
}

interface AuditWave {
  label: string;
  parallel: boolean;
  steps: AuditWaveStep[];
  timeMs?: number;
}

interface AuditDeepFeature {
  rank: number;
  name: string;
  coefficient: number;
  attribution: number;
  saliency: number;
  counterfactual: number;
}

interface AuditDeep {
  signalAgreement: number;
  featureImportance: AuditDeepFeature[];
  overallConfidence: number;
  flaggedItems: Array<{ label: string; score: number; description: string }>;
  confidenceFactors: Array<{ label: string; passed: boolean }>;
}

export interface ResponseAuditData {
  sources: AuditSource[];
  claims: AuditClaim[];
  reasoning?: Array<{ icon: 'shield' | 'search' | 'book' | 'sparkles'; label: string; items?: string[] }>;
  executionWaves: AuditWave[];
  executionSummary?: string;
  model: string;
  slmContributed: boolean;
  deep?: AuditDeep;
}

// ── Existing prop types ───────────────────────────────────────────────────────

interface Reference {
  number: number;
  title: string;
  description: string;
  pageNumber?: number;
  highlightedText?: string;
  context?: string;
}

interface Source {
  id: string;
  documentName: string;
  pageNumber?: number;
  highlightedText: string;
  context: string;
  category?: 'connector' | 'upload' | 'internet';
  url?: string;
  connector?: string;
}

interface CategorizedSources {
  connectors?: Source[];
  uploads?: Source[];
  internet?: Source[];
}

export interface ChainStep {
  step: string;
  confidencePassed: boolean;
  category?: 'Search' | 'Analysis' | 'Validation' | 'Synthesis' | 'Quality Check';
  confidenceScore?: number;
  timeMs?: number;
}

export type AuditPanelRequest =
  | { kind: 'v2'; auditData: ResponseAuditData; confidenceThresholdPassed?: boolean; chainOfThought?: ChainStep[]; timestamp: string }
  | { kind: 'legacy'; confidenceThresholdPassed?: boolean; chainOfThought?: ChainStep[]; internetSearchAssisted?: boolean };

interface ChatMessageProps {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasReactions?: boolean;
  wasHelpful?: boolean;
  references?: Reference[];
  confidence?: 'High' | 'Medium' | 'Low';
  chainOfThought?: ChainStep[];
  confidenceThresholdPassed?: boolean;
  attachment?: { fileName: string; fileSize?: string };
  sources?: CategorizedSources;
  internetSearchAssisted?: boolean;
  onCitationClick?: (citation: { title: string; pageNumber?: number; highlightedText?: string; context?: string; description?: string }) => void;
  responseAuditData?: ResponseAuditData;
  onOpenAuditPanel?: (req: AuditPanelRequest) => void;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ label, open, onToggle, count }: { label: string; open: boolean; onToggle: () => void; count?: string }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 text-left group"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
        {count && <span className="text-[10px] text-gray-400">{count}</span>}
      </div>
      {open
        ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
        : <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />}
    </button>
  );
}

function ImportanceBadge({ importance }: { importance?: 'critical' | 'significant' }) {
  if (!importance) return null;
  return importance === 'critical'
    ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase tracking-wide">Critical</span>
    : <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">Significant</span>;
}

function WeightBar({ sources }: { sources: AuditSource[] }) {
  const colors = ['bg-[#3d6b47]', 'bg-[#5a8a65]', 'bg-[#7aaa85]', 'bg-[#9abba0]'];
  return (
    <div className="flex rounded overflow-hidden h-1.5 mb-4">
      {sources.map((s, i) => (
        <div key={i} className={`${colors[i % colors.length]} h-full`} style={{ width: `${s.weight}%` }} />
      ))}
    </div>
  );
}

function SourcesSection({ sources }: { sources: AuditSource[] }) {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const toggle = (i: number) => setExpandedIndexes(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <div className="space-y-2">
      <WeightBar sources={sources} />
      {sources.map((source, i) => {
        const isExpanded = expandedIndexes.includes(i);
        const reliance = source.weight >= 50 ? 'Used most' : source.weight >= 25 ? 'Used heavily' : 'Used partially';
        return (
          <div key={i} className="border border-gray-100 rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full px-3 pt-3 pb-2.5 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">{i + 1}</span>
                  <span className="text-xs text-gray-900 font-medium truncate">{source.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-[10px] text-gray-400">{reliance}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                </div>
              </div>
              {/* Weight bar */}
              <div className="h-1 bg-gray-100 rounded-full mt-2">
                <div className="h-full bg-[#455a4f] rounded-full" style={{ width: `${source.weight}%` }} />
              </div>
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 border-t border-gray-100 pt-2 space-y-1.5">
                {source.snippet && (
                  <p className="text-[11px] text-gray-600 italic leading-relaxed">"{source.snippet}"</p>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {source.keyFactors.map((f, j) => (
                    <span key={j} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ClaimsSection({ claims }: { claims: AuditClaim[] }) {
  const grounded = claims.filter(c => c.grounded);
  const ungrounded = claims.filter(c => !c.grounded);

  return (
    <div className="space-y-2">
      {claims.map((claim, i) => (
        <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-100 last:border-0">
          {claim.grounded
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-800 leading-snug">{claim.text}</p>
            {claim.supportedBy.length > 0 && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                From: {claim.supportedBy.map(s => s.name).join(', ')}
              </p>
            )}
          </div>
          <span className={`text-[10px] font-medium flex-shrink-0 ${claim.grounded ? 'text-green-600' : 'text-amber-600'}`}>
            {claim.grounded ? 'Verified' : 'Unverified'}
          </span>
        </div>
      ))}
      {ungrounded.length > 0 && (
        <div className="mt-2 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
          <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800">
            {ungrounded.length} {ungrounded.length === 1 ? 'fact' : 'facts'} could not be matched to a source document. Verify independently.
          </p>
        </div>
      )}
    </div>
  );
}

function ExecutionSection({ waves }: { waves: AuditWave[] }) {
  const [expandedWaves, setExpandedWaves] = useState<number[]>([]);
  const toggle = (i: number) => setExpandedWaves(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const stepTypeColor = (type: AuditWaveStep['type']) => {
    switch (type) {
      case 'planning': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'search': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'analysis': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'synthesis': return 'bg-green-50 text-green-700 border-green-100';
      case 'quality': return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-2">
      {waves.map((wave, wi) => {
        const isExpanded = expandedWaves.includes(wi);
        const totalMs = wave.timeMs ?? wave.steps.reduce((acc, s) => acc + (s.timeMs ?? 0), 0);
        return (
          <div key={wi} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => toggle(wi)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#455a4f] text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                  P{wi}
                </div>
                <span className="text-[11px] text-gray-900">{wave.label}</span>
                {wave.parallel && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded font-medium">
                    Parallel
                  </span>
                )}
                <span className="text-[10px] text-gray-400">{wave.steps.length} {wave.steps.length === 1 ? 'step' : 'steps'}</span>
              </div>
              <div className="flex items-center gap-2">
                {totalMs > 0 && (
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{totalMs >= 1000 ? `${(totalMs / 1000).toFixed(1)}s` : `${totalMs}ms`}
                  </span>
                )}
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {wave.steps.map((step, si) => (
                  <div key={si} className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wide font-medium ${stepTypeColor(step.type)}`}>
                        {step.type}
                      </span>
                      <span className="text-[11px] text-gray-800">{step.label}</span>
                      {step.docCount !== undefined && step.docCount > 0 && (
                        <span className="text-[10px] text-gray-400">· {step.docCount} {step.docCount === 1 ? 'doc' : 'docs'}</span>
                      )}
                    </div>
                    {step.detail && (
                      <p className="text-[10px] text-gray-500 leading-relaxed ml-0 pl-0">{step.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TechnicalSection({ deep }: { deep: AuditDeep }) {
  const maxCoeff = Math.max(...deep.featureImportance.map(f => f.coefficient));

  return (
    <div className="space-y-5">
      {/* Feature Importance */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] text-gray-400 uppercase tracking-widest">Feature Importance</span>
          <span className="text-[9px] px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded">approximation</span>
        </div>

        {/* Signal Agreement gauge (simplified) */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-[#3d6b47]">{deep.signalAgreement.toFixed(2)}</div>
            <div className="text-[9px] text-gray-500">Signal Agreement</div>
            <div className="text-[9px] text-green-600 font-medium">{deep.signalAgreement >= 0.8 ? 'high' : deep.signalAgreement >= 0.6 ? 'medium' : 'low'}</div>
          </div>
          <div className="flex-1 space-y-1.5">
            {deep.featureImportance.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-4 text-right">#{f.rank}</span>
                <span className="text-[10px] text-gray-700 w-28 truncate">{f.name}</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                  <div className="h-full bg-[#3d6b47] rounded-full" style={{ width: `${(f.coefficient / maxCoeff) * 100}%` }} />
                </div>
                <span className="text-[10px] text-green-600 font-medium w-10 text-right">+{f.coefficient.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signal Breakdown */}
        <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">Signal Breakdown</div>
        <div className="space-y-3">
          {deep.featureImportance.map((f, i) => (
            <div key={i}>
              <div className="text-[11px] font-medium text-gray-700 mb-1">{f.name}</div>
              {[
                { label: 'Attribution', value: f.attribution, color: 'bg-gray-600' },
                { label: 'Saliency', value: f.saliency, color: 'bg-blue-500' },
                { label: 'Counterfactual', value: f.counterfactual, color: 'bg-amber-400' },
              ].map((row, j) => (
                <div key={j} className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] text-gray-400 w-20">{row.label}</span>
                  <div className="flex-1 h-1 bg-gray-100 rounded-full">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.value * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-500 w-8 text-right">{row.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Confidence Analysis */}
      <div>
        <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-3">Confidence Analysis</div>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-[#3d6b47]">{deep.overallConfidence}%</div>
          <div className="text-[10px] text-gray-500">
            Overall confidence ({deep.overallConfidence >= 80 ? 'high' : deep.overallConfidence >= 60 ? 'medium' : 'low'})
          </div>
        </div>

        {deep.flaggedItems.length > 0 && (
          <div className="mb-3">
            <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">Flagged for Review</div>
            <div className="space-y-2">
              {deep.flaggedItems.map((item, i) => (
                <div key={i} className="p-2.5 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span className="text-[11px] font-medium text-amber-800">{item.label}</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full mb-1.5">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="text-[10px] text-amber-700 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">Confidence Factors</div>
        <div className="space-y-1">
          {deep.confidenceFactors.map((cf, i) => (
            <div key={i} className="flex items-center gap-2">
              {cf.passed
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
              <span className="text-[11px] text-gray-700">{cf.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reasoning Steps Section ─────────────────────────────────────────────────

function ReasoningIcon({ icon }: { icon: 'shield' | 'search' | 'book' | 'sparkles' }) {
  const cls = 'w-3.5 h-3.5 text-gray-400';
  if (icon === 'shield')   return <Shield   className={cls} />;
  if (icon === 'search')   return <Search   className={cls} />;
  if (icon === 'book')     return <BookOpen className={cls} />;
  return <Sparkles className={cls} />;
}

function ChainOfThoughtSection({ steps }: { steps: NonNullable<ResponseAuditData['reasoning']> }) {
  return (
    <div>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          {/* Timeline column */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
            <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
              <ReasoningIcon icon={step.icon} />
            </div>
            {i < steps.length - 1 && (
              <div className="w-px bg-gray-200 flex-1 my-1" style={{ minHeight: 12 }} />
            )}
          </div>
          {/* Content */}
          <div className="pb-3 min-w-0">
            <div className="text-xs font-medium text-gray-700 leading-5">{step.label}</div>
            {step.items && (
              <div className="mt-0.5 space-y-0.5">
                {step.items.map((item, j) => (
                  <div key={j} className="text-[11px] text-gray-400">{item}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── What If Section ──────────────────────────────────────────────────────────

function WhatIfSection({ sources, claims, featureImportance }: {
  sources: AuditSource[];
  claims: AuditClaim[];
  featureImportance?: AuditDeep['featureImportance'];
}) {
  const scenarios = sources.map(source => {
    const affected = claims.filter(c => c.supportedBy.some(s => s.sourceRef === source.rank));
    const fi = featureImportance?.find(f => f.rank === source.rank);
    const impact = fi?.counterfactual ?? 0;
    return { source, affected, impact };
  }).sort((a, b) => b.impact - a.impact);

  const impactLabel = (v: number) =>
    v >= 0.8 ? { text: 'Critical', cls: 'bg-red-50 text-red-600 border-red-200' }
    : v >= 0.5 ? { text: 'Significant', cls: 'bg-amber-50 text-amber-600 border-amber-200' }
    : { text: 'Low', cls: 'bg-gray-100 text-gray-500 border-gray-200' };

  return (
    <div className="space-y-2.5">
      {scenarios.map(({ source, affected, impact }, i) => {
        const badge = impactLabel(impact);
        return (
          <div key={i} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-[11px] font-medium text-gray-700 leading-snug">
                  Remove <span className="text-gray-900">"{source.name}"</span>
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wide flex-shrink-0 ${badge.cls}`}>
                  {badge.text}
                </span>
              </div>
              {affected.length > 0 ? (
                <div className="space-y-1.5">
                  {affected.map((claim, j) => {
                    const role = claim.supportedBy.find(s => s.sourceRef === source.rank)?.role;
                    return (
                      <div key={j} className="flex items-start gap-2">
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-[11px] text-gray-700 leading-snug">{claim.text}</span>
                          {role === 'primary' && (
                            <span className="ml-1.5 text-[9px] text-red-500 font-medium uppercase tracking-wide">loses primary support</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-[11px] text-gray-400 italic">No claims directly dependent on this source.</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── New Audit Log Panel ───────────────────────────────────────────────────────

export function AuditLogPanel({
  auditData,
  confidenceThresholdPassed,
  chainOfThought,
  timestamp,
  onClose,
}: {
  auditData: ResponseAuditData;
  confidenceThresholdPassed?: boolean;
  chainOfThought?: ChainStep[];
  timestamp: string;
  onClose?: () => void;
}) {
  const [reasoningOpen, setReasoningOpen] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [claimsOpen, setClaimsOpen] = useState(true);
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [executionOpen, setExecutionOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

  const refIdRef = useRef<string>(`AL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  const refId = refIdRef.current;

  // Store audit data in localStorage so the report tab can read it
  useEffect(() => {
    try {
      localStorage.setItem(`audit_${refId}`, JSON.stringify(auditData));
    } catch {
      // ignore storage errors
    }
  }, [refId, auditData]);

  const reportUrl = useMemo(() => {
    const params = new URLSearchParams({
      ref: refId,
      title: auditData.sources[0]?.name ?? 'AI Response',
      ts: timestamp,
    });
    return `/report?${params.toString()}`;
  }, [refId, auditData, timestamp]);

  const handleViewFullReport = () => {
    window.open(reportUrl, '_blank', 'noopener,noreferrer');
  };
  const groundedCount = auditData.claims.filter(c => c.grounded).length;
  const criticalCount = auditData.sources.filter(s => s.importance === 'critical').length;
  const ungroundedCount = auditData.claims.filter(c => !c.grounded).length;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">Audit Log</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">Ref #{refId}</div>
          </div>
          <button
            onClick={handleViewFullReport}
            className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded px-2.5 py-1 transition-colors self-center"
          >
            <ExternalLink className="w-3 h-3" />
            Full Report
          </button>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        {/* ── Verdict ── */}
        <div className="px-5 pt-5 pb-5 border-b border-gray-100">
          {/* Plain-English confidence statement */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              confidenceThresholdPassed !== false ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {confidenceThresholdPassed !== false
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <AlertTriangle className="w-4 h-4 text-amber-600" />
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-snug">
                {confidenceThresholdPassed !== false
                  ? 'Titan is confident in this answer'
                  : 'Titan has limited confidence in this answer'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {confidenceThresholdPassed !== false
                  ? `Reviewed ${auditData.sources.length} ${auditData.sources.length === 1 ? 'document' : 'documents'}, verified ${auditData.claims.filter(c => c.grounded).length} of ${auditData.claims.length} facts, and found consistent support.`
                  : 'Some facts could not be fully verified. Review carefully before acting on this response.'}
              </p>
            </div>
          </div>

          {/* Summary row */}
          {(() => {
            const totalMs = auditData.executionWaves.reduce((a, w) => a + (w.timeMs ?? 0), 0);
            const timeStr = totalMs >= 1000 ? `${(totalMs / 1000).toFixed(1)}s` : `${totalMs}ms`;
            return (
              <div className="flex items-center gap-3 text-[11px] text-gray-400 border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1"><span className="font-medium text-gray-600">{auditData.sources.length}</span> documents reviewed</span>
                <span>·</span>
                <span className="flex items-center gap-1"><span className="font-medium text-gray-600">{auditData.claims.length}</span> facts checked</span>
                <span>·</span>
                <span>{timeStr}</span>
              </div>
            );
          })()}

          {ungroundedCount > 0 && (
            <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {ungroundedCount} {ungroundedCount === 1 ? 'fact' : 'facts'} could not be verified against a source document.
              </p>
            </div>
          )}
        </div>

        {/* ── How Titan Answered ── */}
        {auditData.reasoning && (
          <div className="px-5 border-b border-gray-100">
            <SectionHeader
              label="How Titan answered"
              open={reasoningOpen}
              onToggle={() => setReasoningOpen(o => !o)}
              count={`${auditData.reasoning.length} steps`}
            />
            {reasoningOpen && (
              <div className="pb-4">
                <ChainOfThoughtSection steps={auditData.reasoning} />
              </div>
            )}
          </div>
        )}

        {/* ── Documents Reviewed ── */}
        <div className="px-5 border-b border-gray-100">
          <SectionHeader
            label="Documents reviewed"
            open={sourcesOpen}
            onToggle={() => setSourcesOpen(o => !o)}
            count={`${auditData.sources.length} documents`}
          />
          {sourcesOpen && (
            <div className="pb-4">
              <SourcesSection sources={auditData.sources} />
            </div>
          )}
        </div>

        {/* ── Key Facts Checked ── */}
        <div className="px-5 border-b border-gray-100">
          <SectionHeader
            label="Key facts checked"
            open={claimsOpen}
            onToggle={() => setClaimsOpen(o => !o)}
            count={`${auditData.claims.filter(c => c.grounded).length} of ${auditData.claims.length} verified`}
          />
          {claimsOpen && (
            <div className="pb-4">
              <ClaimsSection claims={auditData.claims} />
            </div>
          )}
        </div>

        {/* ── What Would Change ── */}
        <div className="px-5 border-b border-gray-100">
          <SectionHeader
            label="If a document was missing"
            open={whatIfOpen}
            onToggle={() => setWhatIfOpen(o => !o)}
            count={`${auditData.sources.length} scenarios`}
          />
          {whatIfOpen && (
            <div className="pb-4">
              <WhatIfSection
                sources={auditData.sources}
                claims={auditData.claims}
                featureImportance={auditData.deep?.featureImportance}
              />
            </div>
          )}
        </div>

        {/* ── AI Orchestration ── */}
        <div className="px-5 border-b border-gray-100">
          <SectionHeader
            label="AI Orchestration"
            open={executionOpen}
            onToggle={() => setExecutionOpen(o => !o)}
            count={`${auditData.executionWaves.length} phases · ${(() => { const ms = auditData.executionWaves.reduce((a, w) => a + (w.timeMs ?? 0), 0); return ms >= 1000 ? `${(ms/1000).toFixed(1)}s` : `${ms}ms`; })()}`}
          />
          {executionOpen && (
            <div className="pb-4">
              {auditData.executionSummary && (
                <p className="text-[11px] text-gray-500 font-mono leading-relaxed mb-4 border-l-2 border-gray-200 pl-3">
                  {auditData.executionSummary}
                </p>
              )}
              <ExecutionSection waves={auditData.executionWaves} />
            </div>
          )}
        </div>

        {/* ── Technical Details ── */}
        {auditData.deep && (
          <div className="px-5 border-b border-gray-100">
            <SectionHeader
              label="Technical Details"
              open={techOpen}
              onToggle={() => setTechOpen(o => !o)}
              count="model risk"
            />
            {techOpen && (
              <div className="pb-4">
                <TechnicalSection deep={auditData.deep} />
              </div>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-gray-500">Synthesized by</span>
            <span className="text-[10px] font-mono text-gray-700 bg-white border border-gray-200 px-1.5 py-0.5 rounded">{auditData.model}</span>
            {auditData.slmContributed && (
              <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Titan Banking Model
              </span>
            )}
          </div>
          <div className="text-[10px] text-gray-400">Generated {timestamp}</div>
          <p className="text-[9px] text-gray-400 mt-2 leading-relaxed">
            Always verify critical information with official sources. Titan provides responses based on available data and may not have access to the most current information.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Legacy Audit Log (fallback) ───────────────────────────────────────────────

export function LegacyAuditLog({
  confidenceThresholdPassed,
  chainOfThought,
  internetSearchAssisted,
}: {
  confidenceThresholdPassed?: boolean;
  chainOfThought?: ChainStep[];
  internetSearchAssisted?: boolean;
}) {
  return (
    <div className="px-6 pb-6">
      {chainOfThought && chainOfThought.length > 0 && (
        <div>
          {internetSearchAssisted && (
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Cloud className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-sm text-slate-900 font-medium">Internet Search Assisted</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                This response used information gathered from the public internet. Online sources are not independently verified and may contain errors or outdated information.
              </p>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-900">Assurance Level</span>
              {confidenceThresholdPassed
                ? <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-50 border border-green-200 text-[10px] text-green-700 uppercase tracking-wide">Sufficient</span>
                : <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-[10px] text-yellow-700 uppercase tracking-wide">Limited</span>
              }
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {confidenceThresholdPassed
                ? 'A sufficient Assurance Level means Titan has enough confidence to provide a direct answer based on reasoning and evidence.'
                : 'A limited Assurance Level means Titan cannot provide a direct answer because it lacks confidence, typically when evidence is missing or multiple conflicting answers exist.'}
            </p>
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div>
            <h4 className="text-sm text-gray-900 mb-3">Reasoning Steps</h4>
            <div className="space-y-3">
              {chainOfThought.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5a7a5e] text-white flex items-center justify-center text-[10px]">
                    {index + 1}
                  </div>
                  <div className="flex-1 border-l-2 border-[#5a7a5e] bg-white p-3">
                    {step.category && (
                      <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide">{step.category}</div>
                    )}
                    <p className="text-xs text-gray-900">{step.step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-[10px] text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Note:</strong> Always verify critical information with official sources.
        </p>
      </div>
    </div>
  );
}

// ── Main ChatMessage component ────────────────────────────────────────────────

export function ChatMessage({
  type, content, timestamp, hasReactions, wasHelpful, references,
  confidence, chainOfThought, confidenceThresholdPassed, attachment,
  sources, internetSearchAssisted, onCitationClick, responseAuditData,
  onOpenAuditPanel
}: ChatMessageProps) {
  const [expandedRef, setExpandedRef] = useState<number | null>(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [viewingSource, setViewingSource] = useState<Source | null>(null);

  const getConfidenceBadgeColor = (conf?: 'High' | 'Medium' | 'Low') => {
    switch (conf) {
      case 'High': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      {type === 'assistant' ? (
        <svg viewBox="0 0 106 106" fill="none" className="w-7 h-7 flex-shrink-0">
          <path d="M47.2423 71.4809L34.4963 58.7302C32.6352 56.86 33.2539 57.4793 31.7433 55.9716C14.6419 38.8588 11.7307 37.4185 11.7307 30.5882C11.7317 23.3304 17.5941 17.6895 24.6098 17.6892C31.1319 17.6892 33.976 21.7116 38.9795 26.7223L47.2461 18.4502C41.5612 12.7615 36.1899 6.00011 24.6098 6.00011C10.9317 6.00042 0.000739855 17.1042 0 30.5692C0 42.1253 6.79117 47.5434 12.4798 53.2358L12.5026 53.2167C27.7218 68.5006 21.6839 62.4498 38.9757 79.753L47.2423 71.4809ZM87.5299 53.2167C93.2148 47.5281 99.9717 42.1488 99.9717 30.5844C99.9742 8.56382 73.2786 -2.08453 57.9958 13.1992L26.2715 44.9446L34.5039 53.2129L66.2625 21.4714C74.3184 13.4114 88.2586 19.0372 88.26 30.5844C88.26 37.1225 84.2823 39.9222 79.2632 44.9446L87.5299 53.2167ZM75.3885 105.981C97.2753 105.981 108.216 79.4607 92.7735 64.0078L61.0226 32.2358L52.7598 40.5079L65.4982 53.2205C66.4132 54.1401 67.1959 54.9156 68.255 55.9754L68.2512 55.9792C79.9164 67.656 76.2804 64.0138 84.5183 72.2571C89.4984 77.2912 89.4986 85.4795 84.5107 90.5174C79.6319 95.4017 71.1332 95.3981 66.2625 90.5174L61.0188 85.2665L52.7522 93.5386C58.4563 99.2388 63.8207 105.981 75.3885 105.981ZM24.6098 106C37.5954 106 40.3064 100.475 73.7572 67.0024L65.4868 58.7378C31.2883 92.9512 31.712 94.292 24.6098 94.292C13.1508 94.2916 7.44711 80.3578 15.4876 72.2419L20.7275 66.9947L12.4798 58.7416L7.22096 64.0078C-8.26441 79.5034 2.88298 106 24.6098 106Z" fill="#FF6E3C" />
        </svg>
      ) : (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs bg-[#455a4f] text-white">
          TB
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {type === 'assistant' ? (
          <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
            {/* Message text */}
            <div className="text-xs text-gray-900 whitespace-pre-line">
              {content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </div>

            {/* Attachment */}
            {attachment && (
              <div className="mt-2">
                <div className="inline-flex items-center gap-2 bg-[#f9f9f8] border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
                  <div className="w-8 h-8 bg-[#5a7a5e] rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 truncate">{attachment.fileName}</div>
                    {attachment.fileSize && <div className="text-[10px] text-gray-500">{attachment.fileSize}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* References */}
            {references && references.length > 0 && (
              <div className="mt-2 space-y-1">
                {references.slice(0, 1).map((ref) => (
                  <div key={ref.number} className="border border-gray-200 rounded bg-[#f9f9f8]">
                    <button
                      onClick={() => onCitationClick?.({ title: ref.title, pageNumber: ref.pageNumber, highlightedText: ref.highlightedText, context: ref.context, description: ref.description })}
                      className="w-full px-3 py-2 flex items-start gap-2 text-left hover:bg-gray-50"
                    >
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">
                        {ref.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-gray-900">{ref.title}</div>
                        {ref.description && <div className="text-[10px] text-gray-500 mt-0.5">{ref.description}</div>}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Message Footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              {/* Left: actions */}
              <div className="flex items-center gap-0.5">
                <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded transition-colors" title="Copy response">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button className="text-gray-400 hover:text-green-600 p-1.5 hover:bg-gray-100 rounded transition-colors" title="Helpful">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded transition-colors" title="Not helpful">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button className="text-gray-400 hover:text-amber-500 p-1.5 hover:bg-gray-100 rounded transition-colors" title="Flag this response">
                  <Flag className="w-3.5 h-3.5" />
                </button>

                {/* Divider */}
                <div className="w-px h-3.5 bg-gray-200 mx-1.5" />

                {/* Audit Log trigger */}
                {responseAuditData ? (
                  <button
                    onClick={() => onOpenAuditPanel?.({ kind: 'v2', auditData: responseAuditData, confidenceThresholdPassed, chainOfThought, timestamp })}
                    className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-800 transition-colors px-1 py-1 hover:bg-gray-100 rounded"
                  >
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>View audit log</span>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenAuditPanel?.({ kind: 'legacy', confidenceThresholdPassed, chainOfThought, internetSearchAssisted })}
                    className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-800 transition-colors px-1 py-1 hover:bg-gray-100 rounded"
                  >
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>View audit log</span>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                  </button>
                )}
              </div>

              {/* Right: meta */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                {internetSearchAssisted && (
                  <><span>Internet assisted</span><span>·</span></>
                )}
                {sources && (sources.connectors?.length > 0 || sources.uploads?.length > 0 || sources.internet?.length > 0) && (() => {
                  const total = (sources.connectors?.length || 0) + (sources.uploads?.length || 0) + (sources.internet?.length || 0);
                  return (
                    <><button onClick={() => setSourcesExpanded(!sourcesExpanded)} className="hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full text-[10px] transition-colors">
                      {total} {total === 1 ? 'Source' : 'Sources'} ∨
                    </button><span>·</span></>
                  );
                })()}
                {references && references.length > 0 && (
                  <><span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px]">{references.length} {references.length === 1 ? 'Source' : 'Sources'}</span><span>·</span></>
                )}
                <span>{timestamp}</span>
              </div>
            </div>

            {/* Sources Dropdown */}
            {sources && (sources.connectors?.length > 0 || sources.uploads?.length > 0 || sources.internet?.length > 0) && sourcesExpanded && (() => {
              let sourceCounter = 0;
              return (
                <div className="mt-2 border border-gray-200 rounded bg-white">
                  {sources.connectors && sources.connectors.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <Database className="w-3 h-3 text-gray-500" />
                          <span className="text-[10px] font-medium text-gray-700 uppercase tracking-wide">Connectors</span>
                        </div>
                      </div>
                      {sources.connectors.map((source) => {
                        sourceCounter++;
                        const n = sourceCounter;
                        return (
                          <div key={source.id} className="px-3 py-2 flex items-start gap-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">{n}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-gray-900">{source.connector}: {source.documentName}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              </div>
                              <div className="text-[10px] text-gray-500 italic mt-0.5">{source.highlightedText.substring(0, 80)}...</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {sources.uploads && sources.uploads.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <Upload className="w-3 h-3 text-gray-500" />
                          <span className="text-[10px] font-medium text-gray-700 uppercase tracking-wide">Your Uploads</span>
                        </div>
                      </div>
                      {sources.uploads.map((source) => {
                        sourceCounter++;
                        const n = sourceCounter;
                        return (
                          <div key={source.id} className="px-3 py-2 flex items-start gap-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">{n}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-gray-900">{source.documentName}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              </div>
                              <div className="text-[10px] text-gray-500 italic mt-0.5">{source.highlightedText.substring(0, 80)}...</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {sources.internet && sources.internet.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <Cloud className="w-3 h-3 text-gray-500" />
                          <span className="text-[10px] font-medium text-gray-700 uppercase tracking-wide">Internet Sources</span>
                        </div>
                      </div>
                      {sources.internet.map((source) => {
                        sourceCounter++;
                        const n = sourceCounter;
                        return (
                          <div key={source.id} className="px-3 py-2 flex items-start gap-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">{n}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-gray-900">{source.documentName}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              </div>
                              <div className="text-[10px] text-gray-500 italic mt-0.5">{source.highlightedText.substring(0, 80)}...</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-900 mb-1.5">{content}</div>
            {attachment && (
              <div className="mb-2">
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
                  <div className="w-8 h-8 bg-[#5a7a5e] rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 truncate">{attachment.fileName}</div>
                    {attachment.fileSize && <div className="text-[10px] text-gray-500">{attachment.fileSize}</div>}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <span>{timestamp}</span>
              {hasReactions && (
                <><span>•</span>
                  <button className="hover:text-gray-700">Was this helpful?</button>
                  <button className="hover:bg-gray-100 p-0.5 rounded"><ThumbsUp className="w-3 h-3" /></button>
                  <button className="hover:bg-gray-100 p-0.5 rounded"><ThumbsDown className="w-3 h-3" /></button>
                </>
              )}
              {wasHelpful && (
                <><span>•</span><Heart className="w-3 h-3 fill-red-500 text-red-500" /><span>Inaccurate information</span></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
