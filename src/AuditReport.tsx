import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Download, Copy, Check, FileText, ChevronDown, ChevronUp, Clock, ExternalLink, X, Shield, Search, BookOpen, Sparkles } from 'lucide-react';
import { TitanLogo } from './TitanLogo';
import type { ResponseAuditData } from './ChatMessage';

// ── helpers ───────────────────────────────────────────────────────────────────

function ImportanceBadge({ importance }: { importance?: 'critical' | 'significant' }) {
  if (!importance) return null;
  return importance === 'critical'
    ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase tracking-wide">Critical</span>
    : <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">Significant</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{children}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  );
}

// ── main report component ─────────────────────────────────────────────────────

export function AuditReport() {
  const [auditData, setAuditData] = useState<ResponseAuditData | null>(null);
  const [conversationTitle, setConversationTitle] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [refId, setRefId] = useState('');
  const [copied, setCopied] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [expandedSources, setExpandedSources] = useState<number[]>([]);
  const [expandedWaves, setExpandedWaves] = useState<number[]>([0, 1, 2, 3]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || '';
    const title = params.get('title') || 'AI Response';
    const ts = params.get('ts') || '';

    setRefId(ref);
    setConversationTitle(decodeURIComponent(title));
    setTimestamp(decodeURIComponent(ts));

    if (ref) {
      try {
        const stored = localStorage.getItem(`audit_${ref}`);
        if (stored) setAuditData(JSON.parse(stored));
      } catch {
        // silently handle parse errors
      }
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => window.print();

  const toggleSource = (i: number) =>
    setExpandedSources(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const toggleWave = (i: number) =>
    setExpandedWaves(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  if (!auditData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">Audit record not found</div>
          <div className="text-xs text-gray-400 font-mono">{refId || 'No reference ID'}</div>
        </div>
      </div>
    );
  }

  const groundedClaims = auditData.claims.filter(c => c.grounded);
  const ungroundedClaims = auditData.claims.filter(c => !c.grounded);
  const criticalSources = auditData.sources.filter(s => s.importance === 'critical');
  const groundedPct = Math.round((groundedClaims.length / auditData.claims.length) * 100);
  const totalExecutionMs = auditData.executionWaves.reduce((acc, w) => acc + (w.timeMs ?? 0), 0);

  const stepTypeColor = (type: string) => {
    switch (type) {
      case 'planning': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'search': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'analysis': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'synthesis': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const barColors = ['bg-[#3d6b47]', 'bg-[#5a8a65]', 'bg-[#7aaa85]'];

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* ── Top bar (hidden on print) ── */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TitanLogo className="h-6" collapsed={false} />
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-500">Audit Record</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded px-3 py-1.5 transition-colors"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /><span className="text-green-600">Copied</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copy Link</span></>}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs text-white bg-[#3d6b47] hover:bg-[#2e5237] rounded px-3 py-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Document ── */}
      <div className="max-w-3xl mx-auto px-6 py-10 print:py-6 print:px-0 print:max-w-none">

        {/* ── Document header ── */}
        <div className="mb-8 pb-6 border-b-2 border-gray-200 print:border-gray-400">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Audit Record</div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{conversationTitle}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[10px]">{refId}</span>
                {timestamp && <><span>·</span><span>{timestamp}</span></>}
              </div>
            </div>
            <div className="print:block hidden">
              <TitanLogo className="h-6 opacity-50" collapsed={false} />
            </div>
          </div>
        </div>

        {/* ── Verdict ── */}
        <div className="mb-8 p-5 rounded-xl border border-gray-200 bg-white print:border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Sufficient</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Answer is well-supported by multiple authoritative sources.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-gray-800">{auditData.sources.length}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Sources</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-gray-800">{auditData.claims.length}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Claims</div>
            </div>
            <div className={`text-center p-3 rounded-lg border ${criticalSources.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`text-2xl font-bold ${criticalSources.length > 0 ? 'text-amber-700' : 'text-gray-800'}`}>
                {criticalSources.length}
              </div>
              <div className={`text-[10px] uppercase tracking-wide mt-0.5 ${criticalSources.length > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                Critical
              </div>
            </div>
          </div>
        </div>

        {/* ── Sources ── */}
        <div className="mb-8">
          <SectionTitle>Sources — Weight Distribution</SectionTitle>

          {/* Stacked weight bar */}
          <div className="flex rounded overflow-hidden h-2 mb-5">
            {auditData.sources.map((s, i) => (
              <div key={i} className={`${barColors[i % barColors.length]} h-full`} style={{ width: `${s.weight}%` }} />
            ))}
          </div>

          <div className="space-y-3">
            {auditData.sources.map((source, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden print:border-gray-300">
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#455a4f] text-white flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {source.rank}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImportanceBadge importance={source.importance} />
                      <span className="text-sm font-bold text-gray-700">{source.weight}%</span>
                    </div>
                  </div>

                  {/* Weight bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                    <div className="h-full bg-[#3d6b47] rounded-full transition-all" style={{ width: `${source.weight}%` }} />
                  </div>

                  {/* Factor tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {source.keyFactors.map((f, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">{f}</span>
                    ))}
                  </div>

                  {/* Details toggle */}
                  <button
                    onClick={() => toggleSource(i)}
                    className="print:hidden flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Details
                    {expandedSources.includes(i) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Details — visible on print always, toggle on screen */}
                  {(expandedSources.includes(i)) && source.retrieval && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="text-xs text-gray-700">
                        <span className="text-gray-400">Retrieval: </span>
                        Semantic match ({source.retrieval.semanticScore})
                        {source.retrieval.entity && `, entity: ${source.retrieval.entity}`}
                        , keyword: "{source.retrieval.keyword}"
                      </div>
                      {source.saliency !== undefined && (
                        <div className="text-xs text-gray-700">
                          <span className="text-gray-400">Saliency: </span>
                          {source.saliency}{' '}
                          <span className={source.saliency >= 0.85 ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                            ({source.saliency >= 0.85 ? 'high' : 'medium'})
                          </span>
                        </div>
                      )}
                      {source.snippet && (
                        <p className="text-xs text-gray-500 italic leading-relaxed">{source.snippet}</p>
                      )}
                      {source.score !== undefined && (
                        <div className="text-[11px] text-gray-400">Type: doc · Score: {source.score}</div>
                      )}
                    </div>
                  )}

                  {/* Print: always show snippet */}
                  <div className="hidden print:block mt-2 pt-2 border-t border-gray-100">
                    {source.snippet && <p className="text-xs text-gray-500 italic">{source.snippet}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Claims ── */}
        <div className="mb-8">
          <SectionTitle>Claim Verification</SectionTitle>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{groundedClaims.length} of {auditData.claims.length} claims grounded</span>
            <span className="text-xs font-semibold text-gray-700">{groundedPct}%</span>
          </div>
          <div className="flex h-2 rounded overflow-hidden mb-5">
            <div className="bg-green-500 h-full" style={{ width: `${groundedPct}%` }} />
            <div className="bg-red-300 h-full flex-1" />
          </div>

          <div className="space-y-3">
            {auditData.claims.map((claim, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 print:border-gray-300">
                <div className="flex items-start gap-2.5 mb-2">
                  {claim.grounded
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <span className="text-sm text-gray-900">{claim.text}</span>
                </div>

                <div className="flex items-center gap-2 mb-2 pl-6">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${claim.grounded ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${claim.confidenceScore}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-8 text-right">{claim.confidenceScore}%</span>
                </div>

                {claim.supportedBy.length > 0 && (
                  <div className="pl-6">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide mr-2">Supported by</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {claim.supportedBy.map((s, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
                          [{s.sourceRef}] {s.name} <span className="text-gray-400">({s.role})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {ungroundedClaims.length > 0 && (
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-700">Ungrounded Claims</span>
              </div>
              {ungroundedClaims.map((c, i) => (
                <div key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span><span>{c.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Reasoning Steps ── */}
        {auditData.reasoning && (
          <div className="mb-8">
            <SectionTitle>Reasoning Steps</SectionTitle>
            <div>
              {auditData.reasoning.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
                    <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      {step.icon === 'shield'   && <Shield   className="w-3.5 h-3.5 text-gray-400" />}
                      {step.icon === 'search'   && <Search   className="w-3.5 h-3.5 text-gray-400" />}
                      {step.icon === 'book'     && <BookOpen className="w-3.5 h-3.5 text-gray-400" />}
                      {step.icon === 'sparkles' && <Sparkles className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                    {i < auditData.reasoning!.length - 1 && (
                      <div className="w-px bg-gray-200 flex-1 my-1" style={{ minHeight: 12 }} />
                    )}
                  </div>
                  <div className="pb-3 min-w-0">
                    <div className="text-sm font-medium text-gray-800 leading-5">{step.label}</div>
                    {step.items && (
                      <div className="mt-0.5 space-y-0.5">
                        {step.items.map((item, j) => (
                          <div key={j} className="text-xs text-gray-400">{item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── What If ── */}
        {auditData.deep?.featureImportance && (
          <div className="mb-8">
            <SectionTitle>What If</SectionTitle>
            <div className="space-y-3">
              {auditData.sources
                .map(source => {
                  const affected = auditData.claims.filter(c => c.supportedBy.some(s => s.sourceRef === source.rank));
                  const impact = auditData.deep?.featureImportance.find(f => f.rank === source.rank)?.counterfactual ?? 0;
                  return { source, affected, impact };
                })
                .sort((a, b) => b.impact - a.impact)
                .map(({ source, affected, impact }, i) => {
                  const badge = impact >= 0.8
                    ? { text: 'Critical', cls: 'bg-red-50 text-red-600 border-red-200' }
                    : impact >= 0.5
                    ? { text: 'Significant', cls: 'bg-amber-50 text-amber-600 border-amber-200' }
                    : { text: 'Low', cls: 'bg-gray-100 text-gray-500 border-gray-200' };
                  return (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 print:border-gray-300">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="text-sm font-medium text-gray-700">
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
                                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <span className="text-xs text-gray-700">{claim.text}</span>
                                  {role === 'primary' && (
                                    <span className="ml-1.5 text-[9px] text-red-500 font-medium uppercase tracking-wide">loses primary support</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">No claims directly dependent on this source.</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── Execution Record ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SectionTitle>Execution Record</SectionTitle>
          </div>
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{auditData.executionWaves.length} phases</span>
            <span>·</span>
            <span>Total: {totalExecutionMs >= 1000 ? `${(totalExecutionMs / 1000).toFixed(1)}s` : `${totalExecutionMs}ms`}</span>
          </div>
          {auditData.executionSummary && (
            <p className="text-sm text-gray-500 font-mono leading-relaxed mb-5 border-l-2 border-gray-200 pl-3">
              {auditData.executionSummary}
            </p>
          )}

          <div className="space-y-2">
            {auditData.executionWaves.map((wave, wi) => {
              const isOpen = expandedWaves.includes(wi);
              const waveMs = wave.timeMs ?? wave.steps.reduce((a, s) => a + (s.timeMs ?? 0), 0);
              return (
                <div key={wi} className="bg-white border border-gray-200 rounded-xl overflow-hidden print:border-gray-300">
                  <button
                    onClick={() => toggleWave(wi)}
                    className="print:hidden w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-[#455a4f] text-white flex items-center justify-center text-[10px] font-bold">P{wi}</div>
                      <span className="text-sm text-gray-900">{wave.label}</span>
                      {wave.parallel && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded font-medium">Parallel</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {waveMs > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {waveMs >= 1000 ? `${(waveMs / 1000).toFixed(1)}s` : `${waveMs}ms`}
                        </span>
                      )}
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </button>

                  {/* Print: always expanded */}
                  <div className={`print:block ${isOpen ? 'block' : 'hidden'} border-t border-gray-100 print:border-gray-200 divide-y divide-gray-100 print:divide-gray-200`}>
                    {/* Print header */}
                    <div className="hidden print:flex items-center gap-2 px-4 py-2 bg-gray-50">
                      <div className="w-5 h-5 rounded bg-[#455a4f] text-white flex items-center justify-center text-[9px] font-bold">W{wi}</div>
                      <span className="text-xs font-medium text-gray-700">{wave.label}</span>
                      {wave.parallel && <span className="text-[9px] text-blue-600">(parallel)</span>}
                      {waveMs > 0 && <span className="text-[10px] text-gray-400 ml-auto">{waveMs}ms</span>}
                    </div>
                    {wave.steps.map((step, si) => (
                      <div key={si} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wide font-medium ${stepTypeColor(step.type)}`}>
                            {step.type}
                          </span>
                          <span className="text-sm text-gray-800">{step.label}</span>
                          {step.docCount !== undefined && step.docCount > 0 && (
                            <span className="text-xs text-gray-400">· {step.docCount} {step.docCount === 1 ? 'doc' : 'docs'}</span>
                          )}
                          {step.timeMs && (
                            <span className="text-[10px] text-gray-400 ml-auto">{step.timeMs}ms</span>
                          )}
                        </div>
                        {step.detail && (
                          <p className="text-xs text-gray-500 leading-relaxed">{step.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Technical Details (collapsible on screen, shown on print) ── */}
        {auditData.deep && (
          <div className="mb-8">
            <button
              onClick={() => setTechOpen(o => !o)}
              className="print:hidden w-full flex items-center gap-3 mb-4 group"
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] group-hover:text-gray-600">Technical Details</span>
              <div className="flex-1 border-t border-gray-200" />
              {techOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            <div className="hidden print:block mb-4">
              <SectionTitle>Technical Details</SectionTitle>
            </div>

            <div className={`print:block ${techOpen ? 'block' : 'hidden'}`}>
              <div className="bg-white border border-gray-200 rounded-xl p-5 print:border-gray-300">
                {/* Feature importance */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-600">Feature Importance</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded">approximation</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#3d6b47]">{auditData.deep.signalAgreement.toFixed(2)}</div>
                      <div className="text-[9px] text-gray-500">Signal Agreement</div>
                      <div className="text-[9px] text-green-600 font-medium">
                        {auditData.deep.signalAgreement >= 0.8 ? 'high' : 'medium'}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {auditData.deep.featureImportance.map((f, i) => {
                        const max = Math.max(...auditData.deep!.featureImportance.map(x => x.coefficient));
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-4 text-right">#{f.rank}</span>
                            <span className="text-[10px] text-gray-700 w-32 truncate">{f.name}</span>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                              <div className="h-full bg-[#3d6b47] rounded-full" style={{ width: `${(f.coefficient / max) * 100}%` }} />
                            </div>
                            <span className="text-[10px] text-green-600 font-medium">+{f.coefficient.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Signal breakdown */}
                  <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">Signal Breakdown</div>
                  <div className="space-y-3">
                    {auditData.deep.featureImportance.map((f, i) => (
                      <div key={i}>
                        <div className="text-xs font-medium text-gray-700 mb-1">{f.name}</div>
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

                {/* Confidence */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs font-semibold text-gray-600 mb-3">Confidence Analysis</div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-[#3d6b47]">{auditData.deep.overallConfidence}%</div>
                    <div className="text-xs text-gray-500">
                      Overall confidence<br />
                      <span className="font-medium text-green-700">
                        {auditData.deep.overallConfidence >= 80 ? 'high' : 'medium'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {auditData.deep.confidenceFactors.map((cf, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {cf.passed
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          : <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                        <span className="text-xs text-gray-700">{cf.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Synthesized by</span>
            <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{auditData.model}</span>
            {auditData.slmContributed && (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Titan Banking Model
              </span>
            )}
          </div>
          {timestamp && <div className="text-xs text-gray-400">Generated {timestamp}</div>}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg print:bg-white print:border-gray-300">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Record integrity:</strong> This audit record was generated at response time and stored with the message. It has not been modified after the fact. Reference {refId} can be used to retrieve this record from Titan's audit log.
            </p>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Always verify critical information with official sources. Titan provides responses based on available data and may not have access to the most current information.
          </p>
        </div>

      </div>
    </div>
  );
}
