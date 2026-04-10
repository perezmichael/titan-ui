import { FileText, Printer } from 'lucide-react';
import { bsaAuditData } from './auditMockData';
import type { AuditData } from './ChatMessage';

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 break-inside-avoid">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.14em] mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AuditReportContent({ data, refId }: { data: AuditData; refId: string }) {
  const totalMs = data.phases.reduce((a, p) => a + p.durationMs, 0);

  const levelLabel = data.assuranceLevel === 'sufficient' ? 'Sufficient' : data.assuranceLevel === 'partial' ? 'Partial' : 'Limited';
  const levelCls =
    data.assuranceLevel === 'sufficient'
      ? 'bg-green-50 text-green-800 border-green-200'
      : data.assuranceLevel === 'partial'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-red-50 text-red-800 border-red-200';

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Report Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-[#ff6b5a] rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <rect x="3" y="3" width="8" height="8" fill="white" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Titan Banking</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Audit Log — Full Report</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">Reference #{refId}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 transition-colors print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Section 1: Trust */}
      <ReportSection title="Trust">
        <div className="space-y-6">
          {/* Assurance */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assurance Level</p>
            <div className="flex items-center gap-3">
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${levelCls}`}>
                {levelLabel}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">{data.assuranceDesc}</p>
            </div>
          </div>

          {/* Sources */}
          {data.sources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sources Reviewed</p>
              <div className="space-y-2">
                {data.sources.map((s) => (
                  <div key={s.num} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{s.num}</span>
                    <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Model Attribution</p>
            <span className="font-mono text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded px-3 py-1.5 inline-block">
              {data.model}
            </span>
          </div>
        </div>
      </ReportSection>

      {/* Section 2: Titan's Reasoning */}
      <ReportSection title="Titan's Reasoning">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Execution Plan</p>
            <pre className="text-sm font-mono text-gray-600 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 whitespace-pre-wrap break-words">
              {data.executionPlan}
            </pre>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Phases</p>
            <div className="space-y-4">
              {data.phases.map((phase, pi) => (
                <div key={pi} className="flex gap-4 break-inside-avoid">
                  <div className="w-8 h-8 rounded-md bg-[#166534] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    P{pi + 1}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-bold text-[#166534] uppercase tracking-wider mb-1">{phase.name}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Section 3: AI Orchestration */}
      <ReportSection title={`AI Orchestration — ${data.phases.length} phases · ${data.phases.reduce((a, p) => a + p.steps.length, 0)} steps · ${fmtMs(totalMs)}`}>
        <div className="space-y-8">
          {data.phases.map((phase, pi) => (
            <div key={pi} className="break-inside-avoid">
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-md bg-[#166534] text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                  P{pi + 1}
                </div>
                <span className="text-sm font-bold text-gray-900 flex-1">{phase.name}</span>
                {phase.parallel && (
                  <span className="text-[10px] font-semibold text-[#166534] bg-green-100 border border-green-300 rounded-full px-2.5 py-0.5">
                    Parallel · {phase.steps.length} steps
                  </span>
                )}
                <span className="text-sm text-gray-400 font-mono">{fmtMs(phase.durationMs)}</span>
              </div>

              {/* Steps */}
              <div className={`space-y-3 ${phase.parallel ? 'pl-3 border-l-2 border-indigo-100' : ''}`}>
                {phase.steps.map((step) => (
                  <div key={step.num} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden break-inside-avoid">
                    <div className="px-4 pt-3 pb-3">
                      {/* Row 1 */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                        <span className="text-sm font-bold text-gray-900">Step {step.num}</span>
                        <span className="font-mono text-xs text-gray-600 bg-gray-200 rounded px-1.5 py-0.5">{step.tool}</span>
                        <span className="text-xs text-gray-400 font-mono ml-auto">{fmtMs(step.durationMs)}</span>
                      </div>
                      {/* Meta */}
                      {(step.docCount !== undefined || step.model) && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          {step.docCount !== undefined && <span>{step.docCount} {step.docCount === 1 ? 'doc' : 'docs'}</span>}
                          {step.chunkCount !== undefined && <><span className="text-gray-300">·</span><span>{step.chunkCount} chunks</span></>}
                          {step.model && <><span className="text-gray-300">·</span><span className="font-mono">{step.model}</span></>}
                        </div>
                      )}
                      {step.dependsOn && step.dependsOn.length > 0 && (
                        <p className="text-xs text-gray-400 mb-2">← After steps {step.dependsOn.join(', ')}</p>
                      )}
                      <p className="text-sm font-mono text-gray-600 leading-relaxed">{step.description}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-0.5 bg-gray-200">
                      <div className="h-full bg-gradient-to-r from-[#3d6b47] to-green-400 w-full" />
                    </div>

                    {/* Output */}
                    {step.output && (
                      <div className="border-t border-gray-200 bg-white px-4 py-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Output</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{step.output}</p>

                        {/* Source relevance */}
                        {step.sources && step.sources.length > 0 && (
                          <div className="mt-3 divide-y divide-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Source Relevance</p>
                            {step.sources.map((src, si) => (
                              <div key={si} className="flex items-center justify-between py-1.5 gap-2">
                                <span className="text-sm font-medium text-gray-700">{src.name}</span>
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${src.relevance >= 50 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {src.relevance}%
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Raw output */}
                        {step.rawOutput && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Raw Output</p>
                            <pre className="text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto">
                              {step.rawOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-xs text-gray-400 leading-relaxed print:mt-6">
        <p>This audit log was generated by Titan Banking AI. Always verify critical findings with official regulatory sources before taking compliance action.</p>
        <p className="mt-1 font-mono">Reference #{refId} · {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export function AuditReport() {
  const params = new URLSearchParams(window.location.search);
  const refId = params.get('ref') ?? 'UNKNOWN';

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; }
          section { break-inside: avoid; }
          .break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
      <AuditReportContent data={bsaAuditData} refId={refId} />
    </div>
  );
}
