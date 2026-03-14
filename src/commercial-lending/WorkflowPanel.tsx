import { useState } from 'react';
import { Play, CheckCircle2, Circle, ChevronRight, ChevronDown, FileText, Clock, Plus } from 'lucide-react';

interface WorkflowStep {
  number: number;
  title: string;
  objective: string;
  status: 'pending' | 'in-progress' | 'completed';
}

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

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  runs: WorkflowRun[];
}

interface WorkflowPanelProps {
  borrowerName: string;
  onStartWorkflow: (workflowId: string, stepNumber?: number) => void;
  onWorkflowOpen?: (workflowId: string, workflowName: string) => void;
}

export function WorkflowPanel({ borrowerName, onStartWorkflow, onWorkflowOpen }: WorkflowPanelProps) {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [showNewRunModal, setShowNewRunModal] = useState<string | null>(null);

  // Mock recent workflow runs
  const mockRuns: WorkflowRun[] = [
    {
      id: 'run-1',
      recordName: 'VFN Holdings Inc',
      noteNumber: '20240001-001',
      startedDate: '2026-03-10',
      completedDate: '2026-03-10',
      status: 'completed',
      completedSteps: 7,
      totalSteps: 7
    },
    {
      id: 'run-2',
      recordName: 'Fibernet Solutions LLC',
      noteNumber: '20240078-001',
      startedDate: '2026-03-08',
      completedDate: '2026-03-08',
      status: 'completed',
      completedSteps: 7,
      totalSteps: 7
    },
    {
      id: 'run-3',
      recordName: 'GH3 Cler SNU',
      noteNumber: '20230045-001',
      startedDate: '2026-03-05',
      status: 'in-progress',
      completedSteps: 4,
      totalSteps: 7
    }
  ];

  // Available records for new workflow runs
  const availableRecords = [
    { id: '1', name: 'VFN Holdings Inc', noteNumber: '20240001-001' },
    { id: '2', name: 'GH3 Cler SNU', noteNumber: '20230045-001' },
    { id: '3', name: 'Fibernet Solutions LLC', noteNumber: '20240078-001' },
    { id: '4', name: 'Retail Plaza Holdings', noteNumber: '20230122-001' },
    { id: '5', name: 'Healthcare Properties Inc', noteNumber: '20240055-001' }
  ];

  // Define available workflows
  const workflows: Workflow[] = [
    {
      id: 'deal-qa',
      name: 'Deal QA',
      description: 'Comprehensive quality assurance review of loan documentation and data extraction',
      runs: mockRuns,
      steps: [
        {
          number: 1,
          title: 'Verify Borrower & Deal Structure',
          objective: 'Confirm basic deal information and structure are accurate and complete',
          status: 'pending'
        },
        {
          number: 2,
          title: 'Review Financial Data Extraction',
          objective: 'Verify all financial metrics and ratios are accurately extracted',
          status: 'pending'
        },
        {
          number: 3,
          title: 'Validate Loan Terms & Pricing',
          objective: 'Ensure all loan terms, pricing, and structural elements are correctly captured',
          status: 'pending'
        },
        {
          number: 4,
          title: 'Confirm Collateral & Lien Position',
          objective: 'Verify collateral documentation and valuation are complete and accurate',
          status: 'pending'
        },
        {
          number: 5,
          title: 'Review Covenants & Compliance',
          objective: 'Ensure all financial and operational covenants are properly documented',
          status: 'pending'
        },
        {
          number: 6,
          title: 'Identify Exceptions & Critical Issues',
          objective: 'Surface any exceptions, inconsistencies, or critical issues',
          status: 'pending'
        },
        {
          number: 7,
          title: 'Generate QA Summary Report',
          objective: 'Produce a final quality assurance summary',
          status: 'pending'
        }
      ]
    },
    {
      id: 'annual-review',
      name: 'Annual Review',
      description: 'Systematic credit review to assess ongoing creditworthiness and update risk rating',
      runs: [],
      steps: [
        {
          number: 1,
          title: 'Collect & Verify Current Financials',
          objective: 'Obtain and verify the most recent financial statements',
          status: 'pending'
        },
        {
          number: 2,
          title: 'Analyze Financial Performance & Trends',
          objective: 'Assess financial performance trends and identify concerns',
          status: 'pending'
        },
        {
          number: 3,
          title: 'Test Covenant Compliance',
          objective: 'Verify compliance with all financial and operational covenants',
          status: 'pending'
        },
        {
          number: 4,
          title: 'Update Collateral Valuation',
          objective: 'Assess current collateral coverage and adequacy',
          status: 'pending'
        },
        {
          number: 5,
          title: 'Review Industry & Market Conditions',
          objective: 'Assess external factors impacting credit risk',
          status: 'pending'
        },
        {
          number: 6,
          title: 'Assess Management & Operational Performance',
          objective: 'Evaluate management quality and operational execution',
          status: 'pending'
        },
        {
          number: 7,
          title: 'Update Risk Rating & Recommendation',
          objective: 'Determine updated risk rating and renewal recommendation',
          status: 'pending'
        },
        {
          number: 8,
          title: 'Prepare Annual Review Credit Memo',
          objective: 'Document all findings in comprehensive credit memorandum',
          status: 'pending'
        }
      ]
    }
  ];

  const toggleWorkflow = (workflowId: string) => {
    setExpandedWorkflow(expandedWorkflow === workflowId ? null : workflowId);
    if (onWorkflowOpen) {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        onWorkflowOpen(workflowId, workflow.name);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const getRunStatusBadge = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
    }
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Circle className="w-4 h-4 text-blue-600 fill-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Workflow Header */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-medium text-gray-900">{workflow.name}</h3>
                  <span className="text-xs text-gray-500">{workflow.runs.length} run{workflow.runs.length !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => toggleWorkflow(workflow.id)}
                className="px-4 py-2 bg-[#455a4f] text-white text-sm rounded-md hover:bg-[#3a4a42] transition-colors flex items-center gap-2"
              >
                Open
                {expandedWorkflow === workflow.id ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Content - Recent Runs */}
          {expandedWorkflow === workflow.id && (
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Recent Runs</h4>
                  <button
                    onClick={() => setShowNewRunModal(workflow.id)}
                    className="px-3 py-1.5 bg-[#455a4f] text-white text-xs rounded-md hover:bg-[#3a4a42] transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Run
                  </button>
                </div>

                {/* Workflow Runs List */}
                {workflow.runs.length > 0 ? (
                  <div className="space-y-2">
                    {workflow.runs.map((run) => (
                      <div 
                        key={run.id}
                        className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-medium text-gray-900">{run.recordName}</h5>
                            {getRunStatusBadge(run.status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>{run.noteNumber}</span>
                            <span>•</span>
                            <span>Started {formatDate(run.startedDate)}</span>
                            {run.completedDate && (
                              <>
                                <span>•</span>
                                <span>Completed {formatDate(run.completedDate)}</span>
                              </>
                            )}
                          </div>
                          {run.status === 'in-progress' && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                                <span>Progress: {run.completedSteps} of {run.totalSteps} steps</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-[#455a4f] h-1 rounded-full transition-all"
                                  style={{ width: `${(run.completedSteps / run.totalSteps) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No workflow runs yet. Click "New Run" to get started.
                  </div>
                )}

                {/* New Run Modal */}
                {showNewRunModal === workflow.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNewRunModal(null)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Start New {workflow.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Select a record to run this workflow</p>
                      </div>
                      <div className="p-6 max-h-96 overflow-y-auto">
                        <div className="space-y-2">
                          {availableRecords.map((record) => (
                            <button
                              key={record.id}
                              onClick={() => {
                                onStartWorkflow(workflow.id);
                                setShowNewRunModal(null);
                              }}
                              className="w-full text-left p-3 bg-gray-50 rounded border border-gray-200 hover:border-[#455a4f] hover:bg-gray-100 transition-colors"
                            >
                              <div className="text-sm font-medium text-gray-900">{record.name}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{record.noteNumber}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() => setShowNewRunModal(null)}
                          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}