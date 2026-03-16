import { useState } from 'react';
import { Plus, ChevronRight, Send, X, ArrowLeft, FileText, CheckCircle2, Circle, Clock } from 'lucide-react';

interface WorkflowRun {
  id: string;
  recordName: string;
  noteNumber: string;
  startedDate: string;
  completedDate?: string;
  status: 'in-progress' | 'completed';
  completedSteps: number;
  totalSteps: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stepNumber?: number;
  stepTitle?: string;
  isStepMessage?: boolean;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
}

interface WorkflowDetailInlineProps {
  workflowId: string;
  workflowName: string;
  onBack: () => void;
}

const DEAL_QA_STEPS = [
  {
    title: 'Verify Borrower & Deal Structure',
    finding: 'Borrower confirmed as **VFN Holdings Inc** (CIP: DCBLOX, Relationship ID: 42-789456). Deal structure is a Modification/Extension with a $10M term loan. Transaction type matches credit memo page 1. Entity documentation is current.',
  },
  {
    title: 'Review Financial Data Extraction',
    finding: 'Revenue extracted at **$32.0M** (TTM). EBITDA at **$1.14B**. All financial metrics verified against pages 4–6 of VFN_Financials_2025.pdf. Leverage ratio: 5.5x. No discrepancies found.',
  },
  {
    title: 'Validate Loan Terms & Pricing',
    finding: 'Loan term: 60 months, maturing **9/20/2026**. Interest rate: SOFR + 3,750 bps. Pricing grid present and verified on page 4. Amortization structure: I/O then 25-year.',
  },
  {
    title: 'Confirm Collateral & Lien Position',
    finding: 'First lien on all assets of borrower and guarantors. Appraised value: **$17.5M** (dated 11/15/2024). LTV: 68% — within policy maximum of 75%. Environmental Phase I: no concerns.',
  },
  {
    title: 'Review Covenants & Compliance',
    finding: 'Primary covenant: Minimum DSCR of **1.25x**. Current DSCR: **1.43x** — in compliance. Leverage covenant: Max 5.5x — current 5.5x, at threshold. No covenant violations found.',
  },
  {
    title: 'Identify Exceptions & Critical Issues',
    finding: 'No critical exceptions found. **One minor exception:** appraisal approaches 18-month staleness in May 2026. Recommend scheduling updated appraisal within 60 days.',
  },
  {
    title: 'Generate QA Summary Report',
    finding: 'All 7 QA steps completed. Deal is ready for credit committee review. No material discrepancies found. One minor exception noted (appraisal staleness). Report generated and attached.',
  },
];

export function WorkflowDetailInline({ workflowId, workflowName, onBack }: WorkflowDetailInlineProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [showNewRunModal, setShowNewRunModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Guided workflow state
  const [guidedRunId, setGuidedRunId] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState(0); // 0-indexed current step
  const [guidedStepStatus, setGuidedStepStatus] = useState<('pending' | 'confirmed' | 'flagged')[]>([]);

  const [runs, setRuns] = useState<WorkflowRun[]>([
    {
      id: 'run-1',
      recordName: 'VFN Holdings Inc',
      noteNumber: '20240001-001',
      startedDate: '2026-03-10',
      completedDate: '2026-03-10',
      status: 'completed',
      completedSteps: 7,
      totalSteps: 7,
    },
    {
      id: 'run-2',
      recordName: 'Fibernet Solutions LLC',
      noteNumber: '20240078-001',
      startedDate: '2026-03-08',
      completedDate: '2026-03-08',
      status: 'completed',
      completedSteps: 7,
      totalSteps: 7,
    },
    {
      id: 'run-3',
      recordName: 'GH3 Cler SNU',
      noteNumber: '20230045-001',
      startedDate: '2026-03-05',
      status: 'in-progress',
      completedSteps: 4,
      totalSteps: 7,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Deal QA Workflow. Select a run from the left to review results, or start a new run to begin a guided QA session.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const availableRecords = [
    { id: '1', name: 'VFN Holdings Inc', noteNumber: '20240001-001' },
    { id: '2', name: 'GH3 Cler SNU', noteNumber: '20230045-001' },
    { id: '3', name: 'Fibernet Solutions LLC', noteNumber: '20240078-001' },
    { id: '4', name: 'Retail Plaza Holdings', noteNumber: '20230122-001' },
    { id: '5', name: 'Healthcare Properties Inc', noteNumber: '20240055-001' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };

  const getCompletedResults = (runId: string) => {
    const results: Record<string, { summary: string; recommendation: string; executiveSummary: string }> = {
      'run-1': {
        summary: 'Deal QA Workflow completed for VFN Holdings Inc. All 7 quality assurance steps passed.',
        recommendation: 'Proceed to credit committee approval. The deal structure is sound, documentation is complete, and risk ratings are appropriately assigned.',
        executiveSummary: 'The $12.5M term loan facility is well-structured with appropriate collateral coverage (75% LTV), strong debt service coverage (1.45x DSCR), and complete documentation. Risk rating of 2 is consistent with the credit profile.',
      },
      'run-2': {
        summary: 'Deal QA Workflow completed for Fibernet Solutions LLC. All 7 quality assurance steps passed.',
        recommendation: 'Approve for booking. This is a straightforward C&I facility with excellent credit fundamentals and complete documentation.',
        executiveSummary: 'Fibernet Solutions LLC\'s $8.2M working capital revolver has passed all QA checkpoints. The company shows consistent profitability with strong liquidity ratios (2.1x current ratio). Risk rating of 2 reflects strong credit quality.',
      },
    };
    return results[runId] || null;
  };

  const handleRunSelection = (runId: string) => {
    // If this is the guided run, just select it without resetting messages
    if (runId === guidedRunId) {
      setSelectedRunId(runId);
      return;
    }

    setSelectedRunId(runId);
    setGuidedRunId(null);

    const run = runs.find(r => r.id === runId);
    const results = getCompletedResults(runId);

    if (run && results) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `${results.summary}\n\n**Recommended Path Forward**\n\n${results.recommendation}\n\n**Executive Summary**\n\n${results.executiveSummary}`,
          timestamp: new Date().toISOString(),
          attachment: {
            name: `Deal_QA_Report_${run.recordName.replace(/\s+/g, '_')}.pdf`,
            type: 'application/pdf',
            size: '2.4 MB',
          },
        },
      ]);
    }
  };

  const handleStartNewRun = (record: { id: string; name: string; noteNumber: string }) => {
    setShowNewRunModal(false);

    const newRunId = `run-new-${Date.now()}`;
    const newRun: WorkflowRun = {
      id: newRunId,
      recordName: record.name,
      noteNumber: record.noteNumber,
      startedDate: new Date().toISOString().split('T')[0],
      status: 'in-progress',
      completedSteps: 0,
      totalSteps: DEAL_QA_STEPS.length,
    };

    setRuns(prev => [newRun, ...prev]);
    setSelectedRunId(newRunId);
    setGuidedRunId(newRunId);
    setGuidedStep(0);
    setGuidedStepStatus(DEAL_QA_STEPS.map(() => 'pending'));

    // Seed the chat with intro + step 1
    const step = DEAL_QA_STEPS[0];
    setMessages([
      {
        id: 'intro',
        role: 'assistant',
        content: `Starting Deal QA for **${record.name}**. I'll walk you through ${DEAL_QA_STEPS.length} steps, analyzing your uploaded documents at each stage. Confirm or flag each finding to proceed.`,
        timestamp: new Date().toISOString(),
      },
      {
        id: 'step-1',
        role: 'assistant',
        content: step.finding,
        timestamp: new Date().toISOString(),
        stepNumber: 1,
        stepTitle: step.title,
        isStepMessage: true,
      },
    ]);
  };

  const handleConfirmStep = () => {
    const currentStep = guidedStep;
    const nextStep = currentStep + 1;

    // Mark current step confirmed
    setGuidedStepStatus(prev => {
      const updated = [...prev];
      updated[currentStep] = 'confirmed';
      return updated;
    });

    // Update run progress
    setRuns(prev => prev.map(r => {
      if (r.id === guidedRunId) {
        return {
          ...r,
          completedSteps: nextStep,
          status: nextStep >= DEAL_QA_STEPS.length ? 'completed' : 'in-progress',
          completedDate: nextStep >= DEAL_QA_STEPS.length ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return r;
    }));

    // Add user confirmation message
    const confirmMsg: Message = {
      id: `confirm-${currentStep}`,
      role: 'user',
      content: 'Confirmed',
      timestamp: new Date().toISOString(),
    };

    if (nextStep >= DEAL_QA_STEPS.length) {
      // All done
      const doneMsg: Message = {
        id: 'done',
        role: 'assistant',
        content: 'All 7 QA steps confirmed. Deal QA is complete — no critical exceptions found. One minor note: schedule an updated appraisal before May 2026. The QA summary report is ready for credit committee.',
        timestamp: new Date().toISOString(),
        attachment: {
          name: `Deal_QA_Report_${runs.find(r => r.id === guidedRunId)?.recordName?.replace(/\s+/g, '_') || 'Record'}.pdf`,
          type: 'application/pdf',
          size: '2.4 MB',
        },
      };
      setMessages(prev => [...prev, confirmMsg, doneMsg]);
      setGuidedStep(nextStep);
    } else {
      const step = DEAL_QA_STEPS[nextStep];
      const stepMsg: Message = {
        id: `step-${nextStep + 1}`,
        role: 'assistant',
        content: step.finding,
        timestamp: new Date().toISOString(),
        stepNumber: nextStep + 1,
        stepTitle: step.title,
        isStepMessage: true,
      };
      setMessages(prev => [...prev, confirmMsg, stepMsg]);
      setGuidedStep(nextStep);
    }
  };

  const handleFlagStep = () => {
    const currentStep = guidedStep;

    setGuidedStepStatus(prev => {
      const updated = [...prev];
      updated[currentStep] = 'flagged';
      return updated;
    });

    const flagMsg: Message = {
      id: `flag-${currentStep}`,
      role: 'user',
      content: 'Flagged for review',
      timestamp: new Date().toISOString(),
    };

    const responseMsg: Message = {
      id: `flag-resp-${currentStep}`,
      role: 'assistant',
      content: `Got it — Step ${currentStep + 1} flagged for review. You can add a note or override the value in the dossier. Moving to the next step.`,
      timestamp: new Date().toISOString(),
    };

    const nextStep = currentStep + 1;
    if (nextStep < DEAL_QA_STEPS.length) {
      const step = DEAL_QA_STEPS[nextStep];
      const stepMsg: Message = {
        id: `step-${nextStep + 1}`,
        role: 'assistant',
        content: step.finding,
        timestamp: new Date().toISOString(),
        stepNumber: nextStep + 1,
        stepTitle: step.title,
        isStepMessage: true,
      };
      setMessages(prev => [...prev, flagMsg, responseMsg, stepMsg]);
    } else {
      setMessages(prev => [...prev, flagMsg, responseMsg]);
    }
    setGuidedStep(nextStep);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString(),
    };
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Good question. Based on the documents I\'ve reviewed, I can provide more detail on this point. Would you like me to pull the relevant page reference?',
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, userMessage, assistantMessage]);
    setMessageInput('');
  };

  const isGuided = selectedRunId === guidedRunId && guidedRunId !== null;
  const activeStepIndex = isGuided ? guidedStep : null;
  const allStepsComplete = isGuided && guidedStep >= DEAL_QA_STEPS.length;

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)]">
      {/* Left Panel */}
      <div className="w-80 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Workflows
          </button>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">{workflowName}</h3>
            <button onClick={() => setShowNewRunModal(true)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Start new run">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Step progress tracker for active guided run */}
        {isGuided && (
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">Progress</div>
            <div className="space-y-1.5">
              {DEAL_QA_STEPS.map((step, i) => {
                const status = guidedStepStatus[i] || 'pending';
                const isCurrent = i === guidedStep && !allStepsComplete;
                return (
                  <div key={i} className={`flex items-center gap-2 ${isCurrent ? 'opacity-100' : status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                    {status === 'confirmed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    ) : status === 'flagged' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    ) : isCurrent ? (
                      <Circle className="w-3.5 h-3.5 text-[#455a4f] fill-[#455a4f] flex-shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-[11px] leading-tight ${isCurrent ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Runs list */}
        <div className="flex-1 overflow-y-auto">
          {runs.map((run) => (
            <button
              key={run.id}
              onClick={() => handleRunSelection(run.id)}
              className={`w-full px-4 py-3 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${selectedRunId === run.id ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm text-gray-900 truncate">{run.recordName}</div>
                  {run.status === 'completed' && run.completedDate ? (
                    <div className="text-xs text-gray-500 mt-0.5">Completed {formatDate(run.completedDate)}</div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-600">Step {run.completedSteps} of {run.totalSteps}</span>
                    </div>
                  )}
                </div>
                {run.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">
            {isGuided
              ? allStepsComplete
                ? 'QA Complete'
                : `Step ${Math.min(guidedStep + 1, DEAL_QA_STEPS.length)} of ${DEAL_QA_STEPS.length} — ${DEAL_QA_STEPS[Math.min(guidedStep, DEAL_QA_STEPS.length - 1)].title}`
              : 'Workflow Assistant'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isGuided
              ? `Running Deal QA for ${runs.find(r => r.id === guidedRunId)?.recordName}`
              : selectedRunId
                ? `Reviewing ${runs.find(r => r.id === selectedRunId)?.recordName}`
                : 'Select a run or start a new one'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${message.role === 'assistant' ? 'bg-[#ff6b5a] text-white' : 'bg-[#455a4f] text-white'}`}>
                  {message.role === 'assistant' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="3" width="8" height="8" fill="white" /></svg>
                  ) : 'TB'}
                </div>

                <div className="flex-1 min-w-0">
                  {message.role === 'assistant' ? (
                    <div className={`rounded-lg px-3 py-2.5 border ${message.isStepMessage ? 'bg-[#f8faf9] border-[#c8d8d2]' : 'bg-white border-gray-200'}`}>
                      {/* Step badge */}
                      {message.isStepMessage && message.stepNumber && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-semibold text-[#455a4f] uppercase tracking-wide">
                            Step {message.stepNumber} of {DEAL_QA_STEPS.length}
                          </span>
                          <span className="text-[10px] text-gray-500">— {message.stepTitle}</span>
                        </div>
                      )}

                      <div className="text-xs text-gray-900 whitespace-pre-line">{message.content}</div>

                      {/* Attachment */}
                      {message.attachment && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors w-full">
                            <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0 text-left">
                              <div className="text-xs font-medium text-gray-900 truncate">{message.attachment.name}</div>
                              <div className="text-[10px] text-gray-500">{message.attachment.size}</div>
                            </div>
                          </button>
                        </div>
                      )}

                      {/* Confirm / Flag actions for the current guided step */}
                      {message.isStepMessage && isGuided && message.stepNumber === guidedStep + 1 && !allStepsComplete && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={handleConfirmStep}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#455a4f] text-white text-xs rounded-md hover:bg-[#3a4a42] transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm
                          </button>
                          <button
                            onClick={handleFlagStep}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-orange-300 text-orange-700 text-xs rounded-md hover:bg-orange-50 transition-colors"
                          >
                            Flag issue
                          </button>
                          <button
                            onClick={() => setMessageInput('Can you explain more about ')}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Ask a question
                          </button>
                        </div>
                      )}

                      <div className="text-[10px] text-gray-400 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-gray-900 mb-1">{message.content}</div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder={isGuided ? 'Ask a question about this step...' : 'Ask a question about this workflow...'}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent bg-white"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#455a4f] text-white rounded-md hover:bg-[#3a4a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* New Run Modal */}
      {showNewRunModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowNewRunModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Start New {workflowName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Select a record — I'll walk you through each step</p>
                  </div>
                  <button onClick={() => setShowNewRunModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {availableRecords.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => handleStartNewRun(record)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 hover:border-[#455a4f] transition-all"
                    >
                      <div className="text-sm text-gray-900">{record.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{record.noteNumber}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setShowNewRunModal(false)} className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
