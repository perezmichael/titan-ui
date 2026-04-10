import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Info, FileText, ExternalLink, Upload, Database, Copy, ChevronRight, Cloud, Heart } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

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

interface ChainStep {
  step: string;
  confidencePassed: boolean;
  category?: 'Search' | 'Analysis' | 'Validation' | 'Synthesis' | 'Quality Check';
  confidenceScore?: number;
  timeMs?: number;
}

// ── Rich audit data types ─────────────────────────────────────────────────────

export interface AuditStepSource {
  name: string;
  relevance: number; // 0–100
}

export interface AuditStep {
  num: number;
  tool: string;
  description: string;
  durationMs: number;
  docCount?: number;
  chunkCount?: number;
  model?: string;
  dependsOn?: number[];
  output?: string;
  sources?: AuditStepSource[];
  rawOutput?: string;
}

export interface AuditPhase {
  name: string;
  description: string;
  parallel: boolean;
  durationMs: number;
  steps: AuditStep[];
}

export interface AuditData {
  assuranceLevel: 'sufficient' | 'limited' | 'partial';
  assuranceDesc: string;
  sources: { num: number; name: string }[];
  model: string;
  executionPlan: string;
  phases: AuditPhase[];
}

// ─────────────────────────────────────────────────────────────────────────────

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
  auditData?: AuditData;
  onCitationClick?: (citation: { title: string; pageNumber?: number; highlightedText?: string; context?: string; description?: string; }) => void;
  onOpenAuditPanel?: (data: { auditData?: AuditData; confidenceThresholdPassed?: boolean; references?: Reference[] }) => void;
}

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

// ── Audit Log Sheet ───────────────────────────────────────────────────────────

export function AuditLogSheet({ auditData, confidenceThresholdPassed, references, refId, onClose }: {
  auditData?: AuditData;
  confidenceThresholdPassed?: boolean;
  references?: Reference[];
  refId: string;
  onClose?: () => void;
}) {
  const [s1Open, setS1Open] = useState(true);
  const [s2Open, setS2Open] = useState(false);
  const [s3Open, setS3Open] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [expandedRaw, setExpandedRaw] = useState<Set<string>>(new Set());

  const toggleStep = (key: string) => setExpandedSteps(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const toggleRaw  = (key: string) => setExpandedRaw(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const totalMs = auditData?.phases.reduce((a, p) => a + p.durationMs, 0) ?? 0;

  const level = auditData?.assuranceLevel ?? (confidenceThresholdPassed !== false ? 'sufficient' : 'limited');
  const levelLabel = level === 'sufficient' ? 'Sufficient' : level === 'partial' ? 'Partial' : 'Limited';
  const levelCls   = level === 'sufficient'
    ? 'bg-green-50 text-green-800 border-green-200'
    : level === 'partial'
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : 'bg-red-50 text-red-800 border-red-200';

  const displaySources = auditData?.sources ?? references?.map((r, i) => ({ num: i + 1, name: r.title })) ?? [];

  // Section toggle header
  const SectionBtn = ({ label, meta, open, onToggle }: { label: string; meta: string; open: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{meta}</p>
      </div>
      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0 flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">Audit Log</h2>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">Reference #{refId}</p>
          {auditData && (
            <a
              href={`/audit-report?ref=${refId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#166534] hover:underline mt-1.5"
            >
              <FileText className="w-3 h-3" />
              View full report
            </a>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 -mr-1 rounded transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">

        {/* ── Section 1: Trust ── */}
        <div>
          <SectionBtn
            label="Trust"
            meta="Assurance · Sources · Model"
            open={s1Open}
            onToggle={() => setS1Open(o => !o)}
          />
          {s1Open && (
            <div className="px-5 pb-5 space-y-4">
              {/* Assurance */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Assurance Level</p>
                <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${levelCls}`}>
                  {levelLabel}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">
                  {auditData?.assuranceDesc ?? (confidenceThresholdPassed !== false
                    ? 'A sufficient Assurance Level means Titan has enough confidence to provide a direct answer based on reasoning and evidence.'
                    : 'A limited Assurance Level means Titan cannot provide a direct answer because it lacks confidence.')}
                </p>
              </div>

              {/* Sources */}
              {displaySources.length > 0 && (
                <div>
                  <hr className="border-gray-100 mb-4" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Sources</p>
                  <div className="space-y-1.5">
                    {displaySources.map((s) => (
                      <div key={s.num} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{s.num}</span>
                        <span className="text-xs font-medium text-gray-700 leading-snug">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Model */}
              <div>
                <hr className="border-gray-100 mb-4" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Model Attribution</p>
                <span className="font-mono text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded px-2.5 py-1">
                  {auditData?.model ?? 'Titan Banking Model'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Section 2: Titan's Reasoning ── */}
        {auditData && (
          <div>
            <SectionBtn
              label="Titan's Reasoning"
              meta={`${auditData.phases.length} phases`}
              open={s2Open}
              onToggle={() => setS2Open(o => !o)}
            />
            {s2Open && (
              <div className="px-5 pb-5 space-y-4">
                {/* Execution Plan */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Execution Plan</p>
                  <pre className="text-[11.5px] font-mono text-gray-600 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 whitespace-pre-wrap break-words">
                    {auditData.executionPlan}
                  </pre>
                </div>

                <hr className="border-gray-100" />

                {/* Phase list */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">Phases</p>
                  <div className="space-y-4">
                    {auditData.phases.map((phase, pi) => (
                      <div key={pi} className="flex gap-3">
                        <div className="w-7 h-7 rounded-md bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          P{pi + 1}
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[11px] font-bold text-[#166534] uppercase tracking-wider mb-0.5">{phase.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Section 3: AI Orchestration ── */}
        {auditData && (
          <div>
            <SectionBtn
              label="AI Orchestration"
              meta={`${auditData.phases.length} phases · ${auditData.phases.reduce((a, p) => a + p.steps.length, 0)} steps · ${fmtMs(totalMs)}`}
              open={s3Open}
              onToggle={() => setS3Open(o => !o)}
            />
            {s3Open && (
              <div className="px-5 pb-5">
                {/* Total time */}
                <div className="flex items-center justify-end gap-1 text-[11.5px] font-semibold text-gray-500 mb-4">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-gray-400 fill-none stroke-2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Total: {fmtMs(totalMs)}
                </div>

                <div className="space-y-4">
                  {auditData.phases.map((phase, pi) => (
                    <div key={pi}>
                      {/* Phase header */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-[#166534] text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                          P{pi}
                        </div>
                        <span className="text-[12.5px] font-bold text-gray-900 flex-1">{phase.name}</span>
                        {phase.parallel && (
                          <span className="text-[10px] font-semibold text-[#166534] bg-green-100 border border-green-300 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-[#166534] stroke-2"><path d="M17 1l4 4-4 4M7 1l-4 4 4 4M21 5H3M21 19H3M17 15l4 4-4 4M7 15l-4 4 4 4"/></svg>
                            Parallel · {phase.steps.length} steps
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 font-mono">{fmtMs(phase.durationMs)}</span>
                      </div>

                      {/* Steps */}
                      <div className={`space-y-2 ${phase.parallel ? 'pl-2.5 border-l-2 border-indigo-100' : ''}`}>
                        {phase.steps.map((step) => {
                          const sk = `${pi}-${step.num}`;
                          const rk = `raw-${pi}-${step.num}`;
                          const stepOpen = expandedSteps.has(sk);
                          const rawOpen  = expandedRaw.has(rk);
                          return (
                            <div key={step.num} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                              <div className="px-3 pt-2.5 pb-2">
                                {/* Row 1: dot + step num + tool + duration */}
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                                  <span className="text-xs font-bold text-gray-900">Step {step.num}</span>
                                  <span className="font-mono text-[10px] text-gray-600 bg-gray-200 rounded px-1.5 py-0.5">{step.tool}</span>
                                  <span className="text-[10px] text-gray-400 font-mono ml-auto">{fmtMs(step.durationMs)}</span>
                                </div>
                                {/* Row 2: doc/chunk/model meta */}
                                {(step.docCount !== undefined || step.model) && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5">
                                    <FileText className="w-3 h-3 flex-shrink-0" />
                                    {step.docCount !== undefined && <span>{step.docCount} {step.docCount === 1 ? 'doc' : 'docs'}</span>}
                                    {step.chunkCount !== undefined && <><span className="text-gray-300">·</span><span>{step.chunkCount} chunks</span></>}
                                    {step.model && <><span className="text-gray-300">·</span><span className="font-mono">{step.model}</span></>}
                                  </div>
                                )}
                                {/* Depends on */}
                                {step.dependsOn && step.dependsOn.length > 0 && (
                                  <p className="text-[11px] text-gray-400 mb-1.5">← After steps {step.dependsOn.join(', ')}</p>
                                )}
                                {/* Description */}
                                <p className="text-[11.5px] font-mono text-gray-600 leading-relaxed mb-2">{step.description}</p>
                                {/* View details toggle */}
                                {step.output && (
                                  <button
                                    onClick={() => toggleStep(sk)}
                                    className="flex items-center gap-1 text-[11.5px] font-semibold text-[#166534] hover:underline"
                                  >
                                    <ChevronRight className={`w-3 h-3 transition-transform ${stepOpen ? 'rotate-90' : ''}`} />
                                    {stepOpen ? 'Hide details' : 'View details'}
                                  </button>
                                )}
                              </div>

                              {/* Progress bar */}
                              <div className="h-0.5 bg-gray-200">
                                <div className="h-full bg-gradient-to-r from-[#3d6b47] to-green-400 w-full" />
                              </div>

                              {/* Detail panel */}
                              {stepOpen && step.output && (
                                <div className="border-t border-gray-200 bg-white px-3 py-2.5">
                                  <p className="text-xs text-gray-700 leading-relaxed mb-2">{step.output}</p>

                                  {/* Source relevance */}
                                  {step.sources && step.sources.length > 0 && (
                                    <div className="mb-2 divide-y divide-gray-100">
                                      {step.sources.map((src, si) => (
                                        <div key={si} className="flex items-center justify-between py-1.5 gap-2">
                                          <span className="text-[11px] font-medium text-gray-700 flex-1">{src.name}</span>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${src.relevance >= 50 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {src.relevance}%
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Raw output toggle */}
                                  {step.rawOutput && (
                                    <>
                                      <button
                                        onClick={() => toggleRaw(rk)}
                                        className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:underline"
                                      >
                                        <ChevronRight className={`w-3 h-3 transition-transform ${rawOpen ? 'rotate-90' : ''}`} />
                                        {rawOpen ? 'Hide raw output' : 'View raw output'}
                                      </button>
                                      {rawOpen && (
                                        <pre className="mt-2 text-[10.5px] font-mono text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-2.5 whitespace-pre-wrap overflow-x-auto">
                                          {step.rawOutput}
                                        </pre>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            ⓘ Always verify critical information with official sources. Titan provides responses based on available data and may not have access to the most current information.
          </p>
        </div>

      </div>
    </div>
  );
}

export function ChatMessage({ type, content, timestamp, hasReactions, wasHelpful, references, confidence, chainOfThought, confidenceThresholdPassed, attachment, sources, internetSearchAssisted, auditData, onCitationClick, onOpenAuditPanel }: ChatMessageProps) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const refId = useMemo(() => `AL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, []);

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
        type === 'assistant' ? 'bg-[#ff6b5a] text-white' : 'bg-[#455a4f] text-white'
      }`}>
        {type === 'assistant' ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="3" width="8" height="8" fill="white" />
          </svg>
        ) : (
          'TB'
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {type === 'assistant' ? (
          <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
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
                      onClick={() => onCitationClick?.({
                        title: ref.title,
                        pageNumber: ref.pageNumber,
                        highlightedText: ref.highlightedText,
                        context: ref.context,
                        description: ref.description
                      })}
                      className="w-full px-3 py-2 flex items-start gap-2 text-left hover:bg-gray-50"
                    >
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">
                        {ref.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-gray-900">{ref.title}</div>
                        {ref.description && (
                          <div className="text-[10px] text-gray-500 mt-0.5">{ref.description}</div>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Message Footer - Actions and Metadata */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              {/* Left side - Actions */}
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded" title="Copy">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded" title="Thumbs up">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded" title="Thumbs down">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenAuditPanel?.({ auditData, confidenceThresholdPassed, references })}
                  className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 transition-colors ml-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Audit Log</span>
                  <ChevronRight className="w-3 h-3 opacity-40" />
                </button>
              </div>
              
              {/* Right side - Sources count, internet assisted indicator, and timestamp */}
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                {internetSearchAssisted && (
                  <>
                    <span className="text-gray-500">Internet search assisted</span>
                    <span>•</span>
                  </>
                )}
                {sources && (sources.connectors?.length > 0 || sources.uploads?.length > 0 || sources.internet?.length > 0) && (() => {
                  const totalSources = (sources.connectors?.length || 0) + (sources.uploads?.length || 0) + (sources.internet?.length || 0);
                  return (
                    <>
                      <button 
                        onClick={() => setSourcesExpanded(!sourcesExpanded)}
                        className="text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded text-[10px]"
                      >
                        {totalSources} {totalSources === 1 ? 'Source' : 'Sources'}
                      </button>
                      <span>•</span>
                    </>
                  );
                })()}
                {references && references.length > 0 && (
                  <>
                    <span>{references.length} {references.length === 1 ? 'Source' : 'Sources'}</span>
                    <span>•</span>
                  </>
                )}
                <span>{timestamp}</span>
              </div>
            </div>
            
            {/* Sources Dropdown - Appears BELOW the message bubble */}
            {sources && (sources.connectors?.length > 0 || sources.uploads?.length > 0 || sources.internet?.length > 0) && sourcesExpanded && (() => {
              let sourceCounter = 0;
              
              return (
                <div className="mt-2 border border-gray-200 rounded bg-white">
                  {/* Connectors */}
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
                        const currentNumber = sourceCounter;
                        return (
                          <div key={source.id} className="px-3 py-2 flex items-start gap-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">
                              {currentNumber}
                            </div>
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
                  
                  {/* Your Uploads */}
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
                        const currentNumber = sourceCounter;
                        return (
                          <div key={source.id} className="px-3 py-2 flex items-start gap-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">
                              {currentNumber}
                            </div>
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
                  
                  {/* Internet Sources */}
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
                        const currentNumber = sourceCounter;
                        return (
                          <div key={source.id} className="px-3 py-2 flex items-start gap-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0 mt-0.5">
                              {currentNumber}
                            </div>
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
            
            {/* Attachment for user messages */}
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
            
            {/* Timestamp and reactions */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <span>{timestamp}</span>
              {hasReactions && (
                <>
                  <span>•</span>
                  <button className="hover:text-gray-700">Was this helpful?</button>
                  <button className="hover:bg-gray-100 p-0.5 rounded">
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button className="hover:bg-gray-100 p-0.5 rounded">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </>
              )}
              {wasHelpful && (
                <>
                  <span>•</span>
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  <span>Inaccurate information</span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}