import { useState } from 'react';
import { Plus, ChevronRight, Send, X, ArrowLeft, FileText } from 'lucide-react';

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

export function WorkflowDetailInline({ workflowId, workflowName, onBack }: WorkflowDetailInlineProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [showNewRunModal, setShowNewRunModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Mock workflow runs
  const workflowRuns: WorkflowRun[] = [
    {
      id: 'run-1',
      recordName: 'VFN Holdings Inc',
      noteNumber: '20240001-001',
      startedDate: '2026-03-10',
      completedDate: '2026-03-10',
      status: 'completed',
      completedSteps: 15,
      totalSteps: 15
    },
    {
      id: 'run-2',
      recordName: 'Fibernet Solutions LLC',
      noteNumber: '20240078-001',
      startedDate: '2026-03-08',
      completedDate: '2026-03-08',
      status: 'completed',
      completedSteps: 15,
      totalSteps: 15
    },
    {
      id: 'run-3',
      recordName: 'GH3 Cler SNU',
      noteNumber: '20230045-001',
      startedDate: '2026-03-05',
      completedDate: '2026-03-06',
      status: 'completed',
      completedSteps: 15,
      totalSteps: 15
    }
  ];

  // Mock messages for chatbot - will be replaced when a run is selected
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Deal QA Workflow. Select a workflow run from the left to get started, or click the + button to start a new workflow run.',
      timestamp: new Date().toISOString()
    }
  ]);

  // Available records for new workflow runs
  const availableRecords = [
    { id: '1', name: 'VFN Holdings Inc', noteNumber: '20240001-001' },
    { id: '2', name: 'GH3 Cler SNU', noteNumber: '20230045-001' },
    { id: '3', name: 'Fibernet Solutions LLC', noteNumber: '20240078-001' },
    { id: '4', name: 'Retail Plaza Holdings', noteNumber: '20230122-001' },
    { id: '5', name: 'Healthcare Properties Inc', noteNumber: '20240055-001' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${dateStr} ${timeStr}`;
  };

  const getWorkflowResults = (runId: string) => {
    const run = workflowRuns.find(r => r.id === runId);
    if (!run) return null;

    const results: { [key: string]: { summary: string; recommendation: string; executiveSummary: string } } = {
      'run-1': {
        summary: `Deal QA Workflow completed for ${run.recordName}. All 15 quality assurance steps have been successfully passed.`,
        recommendation: 'Proceed to credit committee approval. The deal structure is sound, all documentation is complete and accurate, and risk ratings are appropriately assigned. No material discrepancies were found during the QA process.',
        executiveSummary: `This commercial real estate financing for VFN Holdings Inc has undergone comprehensive Deal QA review. The $12.5M term loan facility is well-structured with appropriate collateral coverage (75% LTV), strong debt service coverage (1.45x DSCR), and complete documentation. The borrower maintains strong operating performance with stable cash flows. All covenant packages, environmental reports, and third-party valuations have been verified and are current. Risk rating of 2 is consistent with the credit profile.`
      },
      'run-2': {
        summary: `Deal QA Workflow completed for ${run.recordName}. All 15 quality assurance steps have been successfully passed.`,
        recommendation: 'Approve for booking. This is a straightforward C&I facility with excellent credit fundamentals and complete documentation. Recommend proceeding with final loan agreements and closing preparations.',
        executiveSummary: `Fibernet Solutions LLC's $8.2M working capital revolver has passed all Deal QA checkpoints. The company shows consistent profitability with strong liquidity ratios (2.1x current ratio). All financial covenants are well-cushioned, and the borrowing base calculations have been verified against current A/R and inventory reports. Personal guarantees are in place, and UCC filings are properly documented. The risk rating of 2 reflects the strong credit quality and operational stability of this telecommunications infrastructure provider.`
      },
      'run-3': {
        summary: `Deal QA Workflow completed for ${run.recordName}. All 15 quality assurance steps have been successfully passed.`,
        recommendation: 'Approve with standard monitoring. The credit is appropriately structured for this borrower profile. Ensure quarterly financial reporting compliance and annual collateral inspections are scheduled.',
        executiveSummary: `GH3 Cler SNU's $5.7M equipment financing facility has successfully completed Deal QA review. The specialty manufacturing company demonstrates adequate cash flow to service the debt (1.25x DSCR) with hard asset collateral providing strong recovery prospects. All equipment appraisals are current and support the 80% advance rate. Environmental Phase I assessment shows no concerns. Insurance certificates are properly assigned to the bank. Risk rating of 3 is appropriate given the borrower's operating history and industry exposure.`
      }
    };

    return results[runId] || null;
  };

  const handleRunSelection = (runId: string) => {
    setSelectedRunId(runId);
    
    const run = workflowRuns.find(r => r.id === runId);
    const results = getWorkflowResults(runId);
    
    if (run && results) {
      const timestamp = new Date().toISOString();
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `${results.summary}\n\n**Recommended Path Forward**\n\n${results.recommendation}\n\n**Executive Summary**\n\n${results.executiveSummary}`,
          timestamp,
          attachment: {
            name: `Deal_QA_Report_${run.recordName.replace(/\s+/g, '_')}.pdf`,
            type: 'application/pdf',
            size: '2.4 MB'
          }
        }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'I understand your question. Let me help you with that...',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setMessageInput('');
  };

  const handleStartNewRun = (recordId: string) => {
    // In a real implementation, this would start a new workflow run
    setShowNewRunModal(false);
    // Could add logic to select the new run and update the chat
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)]">
      {/* Left Panel - Workflow Runs */}
      <div className="w-80 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with Back button */}
        <div className="px-4 py-3 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Workflows
          </button>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">{workflowName}</h3>
            <button
              onClick={() => setShowNewRunModal(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Start new workflow run"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Workflow Runs List */}
        <div className="flex-1 overflow-y-auto">
          {workflowRuns.map((run) => (
            <button
              key={run.id}
              onClick={() => handleRunSelection(run.id)}
              className={`w-full px-4 py-3 border-b border-gray-200 text-left hover:bg-gray-50 transition-colors ${
                selectedRunId === run.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm text-gray-900">{run.recordName}</div>
                  {run.completedDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Completed {formatDateTime(run.completedDate)}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Workflow Assistant</h3>
          <p className="text-xs text-gray-500 mt-1">
            {selectedRunId
              ? `Helping with ${workflowRuns.find(r => r.id === selectedRunId)?.recordName}`
              : 'Select a workflow run to get started'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                    message.role === 'assistant' ? 'bg-[#ff6b5a] text-white' : 'bg-[#455a4f] text-white'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="3" width="8" height="8" fill="white" />
                    </svg>
                  ) : (
                    'TB'
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {message.role === 'assistant' ? (
                    <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
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
                      
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2">
                        <span>{new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-gray-900 mb-1.5">{message.content}</div>
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

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask a question about this workflow..."
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

      {/* New Workflow Run Modal */}
      {showNewRunModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowNewRunModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Start New Workflow Run</h3>
                  <button
                    onClick={() => setShowNewRunModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Select a record to start the {workflowName} workflow</p>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {availableRecords.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => handleStartNewRun(record.id)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 hover:border-[#455a4f] transition-all"
                    >
                      <div className="text-sm text-gray-900">{record.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowNewRunModal(false)}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
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