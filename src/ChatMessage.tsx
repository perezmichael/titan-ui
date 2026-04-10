import { ThumbsUp, ThumbsDown, Heart, ChevronDown, ChevronUp, Info, CheckCircle2, XCircle, FileText, ExternalLink, Cloud, Upload, Database, Copy } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

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
  attachment?: {
    fileName: string;
    fileSize?: string;
  };
  sources?: CategorizedSources;
  internetSearchAssisted?: boolean;
  onCitationClick?: (citation: { title: string; pageNumber?: number; highlightedText?: string; context?: string; description?: string; }) => void;
}

const PHASE_NAMES: Record<string, string> = {
  'Analysis': 'Planning',
  'Search': 'Knowledge Retrieval',
  'Validation': 'Validation',
  'Synthesis': 'Synthesis',
  'Quality Check': 'Quality Review',
};

function groupIntoPhases(steps: ChainStep[]) {
  const phases: { name: string; steps: ChainStep[]; totalMs: number }[] = [];
  for (const step of steps) {
    const phaseName = PHASE_NAMES[step.category ?? ''] ?? (step.category ?? 'Processing');
    const last = phases[phases.length - 1];
    if (last && last.name === phaseName) {
      last.steps.push(step);
      last.totalMs += step.timeMs ?? 0;
    } else {
      phases.push({ name: phaseName, steps: [step], totalMs: step.timeMs ?? 0 });
    }
  }
  return phases;
}

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export function ChatMessage({ type, content, timestamp, hasReactions, wasHelpful, references, confidence, chainOfThought, confidenceThresholdPassed, attachment, sources, internetSearchAssisted, onCitationClick }: ChatMessageProps) {
  const [expandedRef, setExpandedRef] = useState<number | null>(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [viewingSource, setViewingSource] = useState<Source | null>(null);
  const refId = useMemo(() => `AL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, []);

  // Audit log section state
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const [s2Expanded, setS2Expanded] = useState<number[]>([]);
  const [s3Expanded, setS3Expanded] = useState<number[]>([]);
  const toggleS2 = (i: number) => setS2Expanded(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleS3 = (i: number) => setS3Expanded(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const phases = useMemo(() => chainOfThought ? groupIntoPhases(chainOfThought) : [], [chainOfThought]);
  const totalMs = useMemo(() => phases.reduce((a, p) => a + p.totalMs, 0), [phases]);

  const getConfidenceBadgeColor = (conf?: 'High' | 'Medium' | 'Low') => {
    switch (conf) {
      case 'High':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 transition-colors ml-1">
                      <Info className="w-3.5 h-3.5" />
                      <span>More about this response</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl bg-white overflow-y-auto p-0">
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">Audit Log</h2>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">Reference #{refId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">

                      {/* ── Section 1: Trust (always open) ── */}
                      <div className="px-6 py-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-4">Trust</p>

                        {/* Assurance Level */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Assurance Level</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {confidenceThresholdPassed
                                ? 'Titan has sufficient confidence to provide a direct answer based on available evidence.'
                                : 'Titan has limited confidence — evidence is insufficient or conflicting. Verify before acting.'}
                            </p>
                          </div>
                          {confidenceThresholdPassed
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded border border-green-200 bg-green-50 text-[10px] font-bold text-green-700 uppercase tracking-wider flex-shrink-0">Sufficient</span>
                            : <span className="inline-flex items-center px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700 uppercase tracking-wider flex-shrink-0">Limited</span>
                          }
                        </div>

                        {/* Sources */}
                        {references && references.length > 0 && (
                          <div className="mb-5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-2">Sources</p>
                            <div className="space-y-1.5">
                              {references.map((ref, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 w-3 flex-shrink-0">{ref.number}</span>
                                  <span className="text-xs text-gray-700 leading-snug">{ref.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Model */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-gray-400">Synthesized by</span>
                          <span className="text-[11px] font-medium text-gray-600">Titan Banking Model</span>
                        </div>
                      </div>

                      {/* ── Section 2: Methodology (Janet — compliance) ── */}
                      {phases.length > 0 && (
                        <div className="px-6 py-5">
                          <button
                            onClick={() => setMethodologyOpen(o => !o)}
                            className="w-full flex items-start justify-between gap-4 group"
                          >
                            <div className="text-left">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-1">Methodology</p>
                              <p className="text-sm font-semibold text-gray-900">How Titan answered</p>
                            </div>
                            <div className="flex items-center gap-2 pt-4 flex-shrink-0">
                              <span className="text-[11px] text-gray-400">{phases.length} phases · {fmtMs(totalMs)}</span>
                              {methodologyOpen
                                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </button>

                          {methodologyOpen && (
                            <div className="mt-5 relative">
                              {/* Vertical timeline line */}
                              <div className="absolute left-[6px] top-3 bottom-3 w-px bg-gray-200" />

                              <div className="space-y-1">
                                {phases.map((phase, pi) => {
                                  const isLast = pi === phases.length - 1;
                                  const open = s2Expanded.includes(pi);
                                  return (
                                    <div key={pi} className={`relative pl-6 ${!isLast ? 'pb-1' : ''}`}>
                                      {/* Timeline dot */}
                                      <div className={`absolute left-0 top-[7px] w-3 h-3 rounded-full border-2 bg-white transition-colors ${open ? 'border-gray-600' : 'border-gray-300'}`} />

                                      <button
                                        onClick={() => toggleS2(pi)}
                                        className="w-full flex items-center justify-between py-1 text-left group/phase"
                                      >
                                        <span className={`text-sm transition-colors ${open ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                          {phase.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {phase.totalMs > 0 && <span className="text-[11px] text-gray-400">{fmtMs(phase.totalMs)}</span>}
                                          {open
                                            ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                                            : <ChevronDown className="w-3.5 h-3.5 text-gray-300 group-hover/phase:text-gray-400" />}
                                        </div>
                                      </button>

                                      {open && (
                                        <div className="pb-3 pt-1 space-y-2">
                                          {phase.steps.map((step, si) => (
                                            <p key={si} className="text-xs text-gray-600 leading-relaxed">{step.step}</p>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── Section 3: Full Audit Trace (Matheus — engineering) ── */}
                      {phases.length > 0 && (
                        <div className="px-6 py-5">
                          <button
                            onClick={() => setTraceOpen(o => !o)}
                            className="w-full flex items-start justify-between gap-4 group"
                          >
                            <div className="text-left">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-1">Full Audit Trace</p>
                              <p className="text-sm font-semibold text-gray-900">Engineering &amp; compliance detail</p>
                            </div>
                            <div className="flex items-center gap-2 pt-4 flex-shrink-0">
                              <span className="text-[11px] text-gray-400">{chainOfThought?.length} steps</span>
                              {traceOpen
                                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </button>

                          {traceOpen && (
                            <div className="mt-5 space-y-3">
                              {phases.map((phase, pi) => {
                                const open = s3Expanded.includes(pi);
                                return (
                                  <div key={pi} className="border border-gray-100 rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => toggleS3(pi)}
                                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 text-left"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-gray-400 w-5">P{pi}</span>
                                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{phase.name}</span>
                                        <span className="text-[10px] text-gray-400">{phase.steps.length} {phase.steps.length === 1 ? 'step' : 'steps'}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {phase.totalMs > 0 && <span className="text-[10px] text-gray-400 font-mono">{fmtMs(phase.totalMs)}</span>}
                                        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                                      </div>
                                    </button>

                                    {open && (
                                      <div className="border-t border-gray-100 divide-y divide-gray-50">
                                        {phase.steps.map((step, si) => (
                                          <div key={si} className="px-3 py-2.5 flex items-start justify-between gap-4">
                                            <p className="text-[11px] text-gray-600 leading-relaxed font-mono">{step.step}</p>
                                            {step.timeMs !== undefined && step.timeMs > 0 && (
                                              <span className="text-[10px] text-gray-400 flex-shrink-0 font-mono mt-0.5">{step.timeMs}ms</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="px-6 py-4">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          Always verify critical information with official sources. Titan provides responses based on available data and may not have access to the most current information.
                        </p>
                      </div>

                    </div>
                  </SheetContent>
                </Sheet>
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