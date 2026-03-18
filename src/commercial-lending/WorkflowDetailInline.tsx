import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ChevronRight, Send, X, ArrowLeft, FileText,
  CheckCircle2, Circle, Clock, AlertTriangle, ThumbsUp, ThumbsDown,
  Download, Flag,
} from 'lucide-react';

interface WorkflowRun {
  id: string;
  recordName: string;
  noteNumber: string;
  startedDate: string;
  completedDate?: string;
  status: 'in-progress' | 'completed';
  completedSteps: number;
  totalSteps: number;
  flagNotes?: Record<number, string>;
}

interface WorkflowDetailInlineProps {
  workflowId: string;
  workflowName: string;
  onBack: () => void;
}

interface StepDef {
  title: string;
  finding: string;
  extractedValue: string;
  policyRequirement: string;
  source: string;
  sourceDoc: string;
  statusType: 'pass' | 'warn';
  pdfPageLabel: string;
  pdfLines: { text: string; highlight?: boolean; bold?: boolean }[];
}

const DEAL_QA_STEPS: StepDef[] = [
  {
    title: 'Verify Borrower & Deal Structure',
    finding: 'Borrower confirmed as VFN Holdings Inc (CIP: DCBLOX, Relationship ID: 42-789456). Deal structure is a Modification/Extension with a $10M term loan. Transaction type matches credit memo page 1. Entity documentation is current.',
    extractedValue: 'VFN Holdings Inc — Term Loan $10.0M, Modification/Extension',
    policyRequirement: 'Entity docs current; structure type must match credit memo',
    source: 'Credit Memo, p. 1',
    sourceDoc: 'Commercial_Credit_Memo_VFN.pdf',
    statusType: 'pass',
    pdfPageLabel: 'Commercial Credit Memo · Page 1',
    pdfLines: [
      { text: 'COMMERCIAL CREDIT MEMORANDUM', bold: true },
      { text: 'Prepared by: Sarah Chen, LO  ·  Underwriter: Michael Park' },
      { text: '' },
      { text: 'BORROWER INFORMATION', bold: true },
      { text: 'Borrower Name: VFN Holdings Inc', highlight: true },
      { text: 'CIP Code: DCBLOX  ·  Relationship ID: 42-789456' },
      { text: '' },
      { text: 'TRANSACTION', bold: true },
      { text: 'Transaction Type: Modification / Extension', highlight: true },
      { text: 'Facility Amount: $10,000,000 Term Loan' },
      { text: 'Maturity: September 20, 2026' },
      { text: '' },
      { text: 'PURPOSE', bold: true },
      { text: 'Proceeds to refinance existing facility and fund capital' },
      { text: 'expenditures related to data center expansion in Phoenix, AZ.' },
    ],
  },
  {
    title: 'Review Financial Data Extraction',
    finding: 'Revenue extracted at $32.0M (TTM). EBITDA at $1.14B. All financial metrics verified against pages 4–6 of VFN_Financials_2025.pdf. Leverage ratio: 5.5x. No discrepancies found.',
    extractedValue: 'Revenue $32.0M TTM  ·  EBITDA $1.14B  ·  Leverage 5.5x',
    policyRequirement: 'All figures must match signed financial statements',
    source: 'VFN_Financials_2025.pdf, pp. 4–6',
    sourceDoc: 'VFN_Financials_2025.pdf',
    statusType: 'pass',
    pdfPageLabel: 'Financial Statements · Page 4',
    pdfLines: [
      { text: 'CONSOLIDATED INCOME STATEMENT (TTM)', bold: true },
      { text: 'Period ending December 31, 2025' },
      { text: '' },
      { text: 'REVENUE', bold: true },
      { text: 'Total Net Revenue                         $32,041,000', highlight: true },
      { text: '' },
      { text: 'OPERATING EXPENSES' },
      { text: 'Cost of Revenue                           $18,200,000' },
      { text: 'SG&A                                       $6,100,000' },
      { text: 'Depreciation & Amortization               $3,400,000' },
      { text: '' },
      { text: 'EBITDA                                 $1,141,000,000', highlight: true },
      { text: 'EBITDA Margin                                   3.56%' },
      { text: '' },
      { text: 'Leverage (Total Debt / EBITDA)                   5.5x', highlight: true },
    ],
  },
  {
    title: 'Validate Loan Terms & Pricing',
    finding: 'Loan term: 60 months, maturing 9/20/2026. Interest rate: SOFR + 3,750 bps. Pricing grid present and verified on page 4. Amortization structure: I/O then 25-year.',
    extractedValue: 'SOFR + 3,750 bps  ·  60-month term  ·  I/O then 25-yr amort.',
    policyRequirement: 'Pricing grid must be present; rate must match approved term sheet',
    source: 'Term Sheet, p. 4',
    sourceDoc: 'VFN_Term_Sheet_2026.pdf',
    statusType: 'pass',
    pdfPageLabel: 'Term Sheet · Page 4',
    pdfLines: [
      { text: 'LOAN TERMS & PRICING', bold: true },
      { text: '' },
      { text: 'Facility Type                              Term Loan' },
      { text: 'Commitment Amount                      $10,000,000' },
      { text: 'Loan Term                  60 months (5 years)', highlight: true },
      { text: 'Maturity Date                      September 20, 2026' },
      { text: '' },
      { text: 'PRICING', bold: true },
      { text: 'Interest Rate                  Term SOFR + 3,750 bps', highlight: true },
      { text: 'Rate Floor                                   0.50%' },
      { text: '' },
      { text: 'AMORTIZATION', bold: true },
      { text: 'Structure            Interest Only → 25-yr amort.', highlight: true },
      { text: 'I/O Period                                24 months' },
      { text: '' },
      { text: 'PRICING GRID', bold: true },
      { text: 'Leverage < 4.0x                    SOFR + 3.00%' },
      { text: 'Leverage 4.0–5.5x                  SOFR + 3.75%  ◀ Current' },
      { text: 'Leverage > 5.5x                    SOFR + 4.25%' },
    ],
  },
  {
    title: 'Confirm Collateral & Lien Position',
    finding: 'First lien on all assets of borrower and guarantors. Appraised value: $17.5M (dated 11/15/2024). LTV: 68% — within policy maximum of 75%. Environmental Phase I: no concerns.',
    extractedValue: 'First lien  ·  Appraised $17.5M  ·  LTV 68%',
    policyRequirement: 'First lien required  ·  LTV ≤ 75%  ·  Appraisal < 18 months old',
    source: 'Appraisal Report, dated 11/15/2024',
    sourceDoc: 'VFN_Appraisal_Nov2024.pdf',
    statusType: 'pass',
    pdfPageLabel: 'Appraisal Report · Summary Page',
    pdfLines: [
      { text: 'COLLATERAL APPRAISAL SUMMARY', bold: true },
      { text: 'Prepared by: Mitchell & Co. Appraisers  ·  Dated: November 15, 2024' },
      { text: '' },
      { text: 'SUBJECT PROPERTY' },
      { text: 'Address: 4500 E McDowell Rd, Phoenix, AZ 85008' },
      { text: 'Property Type: Data Center Facility' },
      { text: '' },
      { text: 'VALUATION', bold: true },
      { text: 'Appraised Value (As-Is)                  $17,500,000', highlight: true },
      { text: 'Value Approach              Income & Cost Approach' },
      { text: '' },
      { text: 'LTV ANALYSIS', bold: true },
      { text: 'Loan Amount                              $10,000,000' },
      { text: 'Appraised Value                          $17,500,000' },
      { text: 'LTV Ratio                                      68.0%', highlight: true },
      { text: 'Policy Maximum                                 75.0%  ✓' },
      { text: '' },
      { text: 'Lien Position                      First (1st) Lien', highlight: true },
      { text: 'Phase I Environmental:  No recognized environmental conditions' },
    ],
  },
  {
    title: 'Review Covenants & Compliance',
    finding: 'Primary covenant: Minimum DSCR of 1.25x. Current DSCR: 1.43x — in compliance. Leverage covenant: Max 5.5x — current 5.5x, at threshold. No covenant violations found.',
    extractedValue: 'DSCR 1.43x (min 1.25x)  ·  Leverage 5.5x (max 5.5x, at threshold)',
    policyRequirement: 'Min DSCR 1.25x  ·  Max leverage 5.5x  ·  All covenants current',
    source: 'Financial Statements Q4 2025, p. 8',
    sourceDoc: 'VFN_Financials_2025.pdf',
    statusType: 'warn',
    pdfPageLabel: 'Financial Statements · Page 8',
    pdfLines: [
      { text: 'COVENANT COMPLIANCE SUMMARY', bold: true },
      { text: 'Q4 2025 — Annual Test Period' },
      { text: '' },
      { text: 'FINANCIAL COVENANTS', bold: true },
      { text: '' },
      { text: 'Debt Service Coverage Ratio (DSCR)' },
      { text: 'Required:  ≥ 1.25x' },
      { text: 'Actual:    1.43x                          ✓ In Compliance', highlight: true },
      { text: '' },
      { text: 'Leverage Ratio (Total Debt / EBITDA)' },
      { text: 'Required:  ≤ 5.50x' },
      { text: 'Actual:    5.50x                          ⚠ At Threshold', highlight: true },
      { text: '' },
      { text: 'Fixed Charge Coverage Ratio (FCCR)' },
      { text: 'Required:  ≥ 1.10x' },
      { text: 'Actual:    1.28x                          ✓ In Compliance' },
      { text: '' },
      { text: 'REPORTING COVENANTS                        ✓ Current' },
      { text: 'INSURANCE REQUIREMENTS                     ✓ Current' },
    ],
  },
  {
    title: 'Identify Exceptions & Critical Issues',
    finding: 'No critical exceptions found. One minor exception: appraisal approaches 18-month staleness in May 2026. Recommend scheduling updated appraisal within 60 days.',
    extractedValue: '0 critical exceptions  ·  1 minor exception (appraisal staleness)',
    policyRequirement: 'Appraisals must be ≤ 18 months old (Policy §4.2.1)',
    source: 'Appraisal dated 11/15/2024  ·  Policy Manual §4.2.1',
    sourceDoc: 'Policy_Manual.pdf',
    statusType: 'warn',
    pdfPageLabel: 'Policy Manual · §4.2.1',
    pdfLines: [
      { text: '§4.2.1  COLLATERAL APPRAISAL REQUIREMENTS', bold: true },
      { text: '' },
      { text: 'All commercial real estate appraisals must be completed by an' },
      { text: 'approved, licensed MAI appraiser. Appraisals shall remain valid' },
      { text: 'for a period not to exceed 18 months from the date of completion.' },
      { text: '' },
      { text: 'APPRAISAL REFRESH REQUIREMENT', bold: true },
      { text: 'Any appraisal approaching or exceeding 18 months must be' },
      { text: 'refreshed prior to the next annual review or covenant test.', highlight: true },
      { text: '' },
      { text: 'EXCEPTION ANALYSIS FOR VFN HOLDINGS', bold: true },
      { text: '' },
      { text: 'Appraisal Date:                        November 15, 2024' },
      { text: '18-Month Threshold:                         May 15, 2026', highlight: true },
      { text: 'Days Until Expiry:                               58 days' },
      { text: '' },
      { text: 'STATUS: Minor Exception — Refresh Required Within 60 Days', highlight: true },
    ],
  },
  {
    title: 'Generate QA Summary Report',
    finding: 'All 7 QA steps completed. Deal is ready for credit committee review. No material discrepancies found. One minor exception noted. Report generated and attached.',
    extractedValue: '7/7 steps reviewed  ·  0 critical  ·  1 minor exception',
    policyRequirement: 'All steps completed before credit committee submission',
    source: 'Aggregated findings — all documents',
    sourceDoc: 'Deal_QA_Summary.pdf',
    statusType: 'pass',
    pdfPageLabel: 'QA Summary · Final Report',
    pdfLines: [
      { text: 'DEAL QA SUMMARY REPORT', bold: true },
      { text: 'VFN Holdings Inc — Term Loan $10.0M' },
      { text: 'Generated: March 18, 2026' },
      { text: '' },
      { text: 'QA RESULTS OVERVIEW', bold: true },
      { text: 'Total Steps Reviewed                             7 of 7', highlight: true },
      { text: 'Steps Confirmed                                       6' },
      { text: 'Steps Flagged                                         1' },
      { text: 'Critical Exceptions                                   0' },
      { text: 'Minor Exceptions                                      1' },
      { text: '' },
      { text: 'EXCEPTION LOG', bold: true },
      { text: '[Minor] Appraisal approaching 18-month threshold (May 2026)' },
      { text: 'Action: Order updated appraisal within 60 days.' },
      { text: '' },
      { text: 'RECOMMENDATION', bold: true },
      { text: 'Approved for credit committee submission.', highlight: true },
      { text: 'No material issues found. Address appraisal refresh prior' },
      { text: 'to next annual review.' },
    ],
  },
];

const availableRecords = [
  { id: '1', name: 'VFN Holdings Inc', noteNumber: '20240001-001' },
  { id: '2', name: 'GH3 Cler SNU', noteNumber: '20230045-001' },
  { id: '3', name: 'Fibernet Solutions LLC', noteNumber: '20240078-001' },
  { id: '4', name: 'Retail Plaza Holdings', noteNumber: '20230122-001' },
  { id: '5', name: 'Healthcare Properties Inc', noteNumber: '20240055-001' },
];

export function WorkflowDetailInline({ workflowId, workflowName, onBack }: WorkflowDetailInlineProps) {
  const [runs, setRuns] = useState<WorkflowRun[]>([
    { id: 'run-1', recordName: 'VFN Holdings Inc', noteNumber: '20240001-001', startedDate: '2026-03-10', completedDate: '2026-03-10', status: 'completed', completedSteps: 7, totalSteps: 7 },
    { id: 'run-2', recordName: 'Fibernet Solutions LLC', noteNumber: '20240078-001', startedDate: '2026-03-08', completedDate: '2026-03-08', status: 'completed', completedSteps: 7, totalSteps: 7 },
    { id: 'run-3', recordName: 'GH3 Cler SNU', noteNumber: '20230045-001', startedDate: '2026-03-05', status: 'in-progress', completedSteps: 4, totalSteps: 7 },
  ]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [showNewRunModal, setShowNewRunModal] = useState(false);

  // Guided audit state
  const [guidedRunId, setGuidedRunId] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);           // furthest step reached (0-indexed)
  const [viewingStep, setViewingStep] = useState(0);          // step shown in right panel (can jump back)
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'confirmed' | 'flagged')[]>([]);
  const [flagNotes, setFlagNotes] = useState<Record<number, string>>({});
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagInputValue, setFlagInputValue] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [askValue, setAskValue] = useState('');
  const [showAskInput, setShowAskInput] = useState(false);
  const [askResponses, setAskResponses] = useState<Record<number, string>>({});

  const isGuided = selectedRunId === guidedRunId && guidedRunId !== null;
  const allStepsComplete = isGuided && guidedStep >= DEAL_QA_STEPS.length;
  const currentViewStep = DEAL_QA_STEPS[viewingStep] ?? DEAL_QA_STEPS[DEAL_QA_STEPS.length - 1];
  const isViewingCurrentStep = viewingStep === guidedStep;
  const isViewingFuture = viewingStep > guidedStep;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  // ─── Run selection ────────────────────────────────────────────────────────────
  const handleRunSelection = (runId: string) => {
    if (runId === guidedRunId) {
      setSelectedRunId(runId);
      return;
    }
    setSelectedRunId(runId);
    setGuidedRunId(null);
  };

  // ─── Start new run ────────────────────────────────────────────────────────────
  const handleStartNewRun = (record: { id: string; name: string; noteNumber: string }) => {
    setShowNewRunModal(false);
    const newRunId = `run-${Date.now()}`;
    const newRun: WorkflowRun = {
      id: newRunId, recordName: record.name, noteNumber: record.noteNumber,
      startedDate: new Date().toISOString().split('T')[0],
      status: 'in-progress', completedSteps: 0, totalSteps: DEAL_QA_STEPS.length,
    };
    setRuns(prev => [newRun, ...prev]);
    setSelectedRunId(newRunId);
    setGuidedRunId(newRunId);
    setGuidedStep(0);
    setViewingStep(0);
    setStepStatuses(DEAL_QA_STEPS.map(() => 'pending'));
    setFlagNotes({});
    setShowFlagInput(false);
    setFlagInputValue('');
    setFeedbackGiven(null);
    setAskResponses({});
    setShowAskInput(false);
  };

  // ─── Confirm step ─────────────────────────────────────────────────────────────
  const handleConfirmStep = () => {
    const step = guidedStep;
    const next = step + 1;
    setStepStatuses(prev => { const u = [...prev]; u[step] = 'confirmed'; return u; });
    setShowFlagInput(false);
    setShowAskInput(false);
    setRuns(prev => prev.map(r => r.id === guidedRunId ? {
      ...r, completedSteps: next,
      status: next >= DEAL_QA_STEPS.length ? 'completed' : 'in-progress',
      completedDate: next >= DEAL_QA_STEPS.length ? new Date().toISOString().split('T')[0] : undefined,
    } : r));
    setGuidedStep(next);
    setViewingStep(next < DEAL_QA_STEPS.length ? next : next);
  };

  // ─── Flag step ────────────────────────────────────────────────────────────────
  const handleSubmitFlag = () => {
    const step = guidedStep;
    const next = step + 1;
    const note = flagInputValue.trim();
    setStepStatuses(prev => { const u = [...prev]; u[step] = 'flagged'; return u; });
    if (note) setFlagNotes(prev => ({ ...prev, [step]: note }));
    setShowFlagInput(false);
    setFlagInputValue('');
    setShowAskInput(false);
    setRuns(prev => prev.map(r => r.id === guidedRunId ? {
      ...r, completedSteps: next,
      status: next >= DEAL_QA_STEPS.length ? 'completed' : 'in-progress',
      completedDate: next >= DEAL_QA_STEPS.length ? new Date().toISOString().split('T')[0] : undefined,
    } : r));
    setGuidedStep(next);
    setViewingStep(next < DEAL_QA_STEPS.length ? next : next);
  };

  // ─── Ask follow-up ────────────────────────────────────────────────────────────
  const handleSendAsk = () => {
    if (!askValue.trim()) return;
    setAskResponses(prev => ({
      ...prev,
      [viewingStep]: 'Based on the documents on file, I can confirm this finding is consistent with data extracted from ' + currentViewStep.sourceDoc + '. Would you like me to highlight the specific passage?',
    }));
    setAskValue('');
    setShowAskInput(false);
  };

  // ─── Step rail icon ───────────────────────────────────────────────────────────
  const StepIcon = ({ index }: { index: number }) => {
    const status = stepStatuses[index];
    const isCurrent = index === guidedStep && !allStepsComplete;
    if (status === 'confirmed') return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    if (status === 'flagged') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    if (isCurrent) return <div className="w-4 h-4 rounded-full bg-[#455a4f] flex-shrink-0" />;
    return <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />;
  };

  // ─── Completed run detail ─────────────────────────────────────────────────────
  const completedResults: Record<string, { summary: string; rec: string }> = {
    'run-1': {
      summary: 'All 7 QA steps passed. No critical exceptions. The $10M term loan for VFN Holdings is well-structured with appropriate collateral coverage (68% LTV), strong DSCR (1.43x), and complete documentation. Risk rating 2 is consistent with credit profile.',
      rec: 'Approved for credit committee. One minor note: schedule updated appraisal before May 2026.',
    },
    'run-2': {
      summary: 'All 7 QA steps passed. Fibernet Solutions LLC\'s $12M senior loan has excellent credit fundamentals. Consistent profitability with strong liquidity ratios (2.1x current ratio). Risk rating 2.',
      rec: 'Approve for booking. Straightforward C&I facility with complete documentation.',
    },
  };

  // ─── Non-guided run detail view ───────────────────────────────────────────────
  const renderRunDetail = () => {
    if (!selectedRunId) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Select a run to review results,<br />or start a new one</p>
          </div>
        </div>
      );
    }
    const run = runs.find(r => r.id === selectedRunId);
    const result = completedResults[selectedRunId];
    if (!run || !result) return null;
    return (
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-gray-900">QA Complete — {run.recordName}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Summary</p>
            <p className="text-sm text-gray-800 leading-relaxed">{result.summary}</p>
          </div>
          <div className="bg-[#f0f8f4] border border-[#c8ddd4] rounded-xl p-5 mb-5">
            <p className="text-xs font-medium text-[#455a4f] uppercase tracking-wide mb-2">Recommendation</p>
            <p className="text-sm text-gray-800 leading-relaxed">{result.rec}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors">
            <Download className="w-4 h-4" />
            Download QA Summary PDF
          </button>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  // Run list mode (not in guided audit)
  if (!isGuided) {
    return (
      <div className="flex h-[calc(100vh-220px)]">
        {/* Runs sidebar */}
        <div className="w-72 flex flex-col bg-white rounded-l-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Workflows
            </button>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{workflowName}</h3>
              <button onClick={() => setShowNewRunModal(true)} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#455a4f] text-white rounded-md hover:bg-[#3a4a42] transition-colors">
                <Plus className="w-3 h-3" />
                New run
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => handleRunSelection(run.id)}
                className={`w-full px-4 py-3.5 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${selectedRunId === run.id ? 'bg-gray-50 border-l-2 border-l-[#455a4f]' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-sm text-gray-900 truncate">{run.recordName}</div>
                    {run.status === 'completed' ? (
                      <div className="text-xs text-gray-500 mt-0.5">Completed {formatDate(run.completedDate!)}</div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600">Step {run.completedSteps} of {run.totalSteps}</span>
                      </div>
                    )}
                  </div>
                  {run.status === 'completed'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 bg-[#f5f5f3] rounded-r-lg border border-l-0 border-gray-200 overflow-hidden">
          {renderRunDetail()}
        </div>

        {/* New run modal */}
        {showNewRunModal && <NewRunModal workflowName={workflowName} onStart={handleStartNewRun} onClose={() => setShowNewRunModal(false)} />}
      </div>
    );
  }

  // ─── Audit mode (3-panel split pane) ─────────────────────────────────────────
  const guidedRun = runs.find(r => r.id === guidedRunId);

  return (
    <div className="flex h-[calc(100vh-220px)]">

      {/* Step Rail */}
      <div className="w-[210px] flex flex-col bg-white border border-gray-200 rounded-l-lg overflow-hidden flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-200">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="text-xs font-medium text-gray-900 truncate">{guidedRun?.recordName}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{workflowName}</div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Progress</span>
            <span className="text-[10px] text-gray-500">
              {Math.min(guidedStep, DEAL_QA_STEPS.length)}/{DEAL_QA_STEPS.length}
            </span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#455a4f] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(guidedStep, DEAL_QA_STEPS.length) / DEAL_QA_STEPS.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto py-2">
          {DEAL_QA_STEPS.map((step, i) => {
            const status = stepStatuses[i];
            const isReachable = i <= guidedStep;
            const isViewing = i === viewingStep;
            return (
              <button
                key={i}
                onClick={() => isReachable && setViewingStep(i)}
                disabled={!isReachable}
                className={`w-full px-4 py-2.5 text-left flex items-start gap-2.5 transition-colors ${
                  isViewing ? 'bg-[#f0f4f2]' : isReachable ? 'hover:bg-gray-50' : 'opacity-35'
                }`}
              >
                <div className="mt-0.5">
                  <StepIcon index={i} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[11px] leading-tight ${isViewing ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    <span className="text-gray-400 mr-1">{i + 1}.</span>
                    {step.title}
                  </div>
                  {status === 'flagged' && flagNotes[i] && (
                    <div className="mt-1 text-[10px] text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 truncate">
                      ⚠ {flagNotes[i]}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { setGuidedRunId(null); setSelectedRunId(null); }} className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 transition-colors">
            View all runs
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewingStep}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex-1 flex flex-col bg-gray-100 border-t border-b border-gray-200 overflow-hidden"
        >
          {/* PDF toolbar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-200 border-b border-gray-300 flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600 flex-1 truncate">{currentViewStep.sourceDoc}</span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{currentViewStep.pdfPageLabel}</span>
          </div>

          {/* PDF page */}
          <div className="flex-1 overflow-y-auto p-6 flex justify-center">
            <div className="bg-white shadow-md w-full max-w-xl rounded-sm p-8 min-h-full">
              {/* Page top rule */}
              <div className="border-t-4 border-gray-800 mb-6" />
              <div className="font-mono text-[11px] leading-relaxed space-y-0.5">
                {currentViewStep.pdfLines.map((line, i) => (
                  <div
                    key={i}
                    className={`
                      ${line.bold ? 'font-bold text-gray-900' : 'text-gray-700'}
                      ${line.highlight ? 'bg-yellow-200 -mx-1 px-1 rounded' : ''}
                      ${line.text === '' ? 'h-3' : ''}
                    `}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-6 pt-3 text-[10px] text-gray-400 flex justify-between">
                <span>CONFIDENTIAL — FOR INTERNAL USE ONLY</span>
                <span>{currentViewStep.pdfPageLabel}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Finding Card / Auditor Panel */}
      <div className="w-[360px] flex flex-col bg-white border border-l-0 border-gray-200 rounded-r-lg overflow-hidden flex-shrink-0">

        {allStepsComplete ? (
          // ── Success state ──────────────────────────────────────────────────────
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-5"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <h3 className="text-base font-medium text-gray-900 mb-1">QA Complete</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              All 7 steps reviewed for {guidedRun?.recordName}.<br />
              0 critical issues · 1 minor exception noted.
            </p>
            <div className="w-full space-y-2 mb-6">
              {[
                { label: 'Steps Confirmed', value: `${stepStatuses.filter(s => s === 'confirmed').length}` },
                { label: 'Steps Flagged', value: `${stepStatuses.filter(s => s === 'flagged').length}` },
                { label: 'Critical Exceptions', value: '0' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs py-2 border-b border-gray-100">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors mb-4">
              <Download className="w-4 h-4" />
              Download QA Summary PDF
            </button>
            <div className="text-xs text-gray-400 mb-2">Was this extraction accurate?</div>
            <div className="flex gap-2">
              <button
                onClick={() => setFeedbackGiven('up')}
                className={`p-2 rounded-lg border transition-colors ${feedbackGiven === 'up' ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFeedbackGiven('down')}
                className={`p-2 rounded-lg border transition-colors ${feedbackGiven === 'down' ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
            {feedbackGiven && (
              <p className="text-xs text-gray-400 mt-2">Thanks for the feedback.</p>
            )}
          </motion.div>

        ) : (
          // ── Finding Card ───────────────────────────────────────────────────────
          <>
            {/* Card header */}
            <div className="px-5 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  currentViewStep.statusType === 'warn'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentViewStep.statusType === 'warn' ? '⚠ Review' : '✓ Pass'}
                </span>
                <span className="text-[10px] text-gray-400">Step {viewingStep + 1} of {DEAL_QA_STEPS.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 leading-tight">{currentViewStep.title}</h3>
            </div>

            {/* Finding card body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewingStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-y-auto px-5 py-4"
              >
                {/* Read-only view for previously completed steps */}
                {!isViewingCurrentStep && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                    <span>Viewing completed step — </span>
                    <button onClick={() => setViewingStep(guidedStep)} className="text-[#455a4f] hover:underline">
                      Return to current step →
                    </button>
                  </div>
                )}

                {/* Structured findings */}
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3.5">
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">AI Finding</div>
                    <div className="text-xs text-gray-800 leading-relaxed">{currentViewStep.finding}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="text-[10px] text-gray-400 mb-0.5">Extracted Value</div>
                      <div className="text-xs font-medium text-gray-900">{currentViewStep.extractedValue}</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="text-[10px] text-gray-400 mb-0.5">Policy Requirement</div>
                      <div className="text-xs font-medium text-gray-900">{currentViewStep.policyRequirement}</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-gray-400 mb-0.5">Source</div>
                        <div className="text-xs font-medium text-gray-900">{currentViewStep.source}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flag note if previously flagged */}
                {stepStatuses[viewingStep] === 'flagged' && flagNotes[viewingStep] && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="text-[10px] font-medium text-amber-700 mb-1">Flagged Note</div>
                    <div className="text-xs text-amber-800">{flagNotes[viewingStep]}</div>
                  </div>
                )}

                {/* Ask follow-up response */}
                {askResponses[viewingStep] && (
                  <div className="bg-[#f8faf9] border border-[#c8d8d2] rounded-lg p-3 mb-4">
                    <div className="text-[10px] font-medium text-[#455a4f] mb-1">Agent Response</div>
                    <div className="text-xs text-gray-700 leading-relaxed">{askResponses[viewingStep]}</div>
                  </div>
                )}

                {/* Flag input */}
                <AnimatePresence>
                  {showFlagInput && isViewingCurrentStep && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
                        <div className="text-[10px] font-medium text-amber-700 mb-2">Add a flag note (optional)</div>
                        <textarea
                          autoFocus
                          value={flagInputValue}
                          onChange={e => setFlagInputValue(e.target.value)}
                          placeholder="Describe the issue..."
                          className="w-full text-xs border border-amber-200 rounded-md p-2 bg-white resize-none focus:outline-none focus:ring-1 focus:ring-amber-300"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={handleSubmitFlag} className="flex-1 py-1.5 text-xs bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                            Submit Flag
                          </button>
                          <button onClick={() => { setShowFlagInput(false); setFlagInputValue(''); }} className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ask input */}
                <AnimatePresence>
                  {showAskInput && isViewingCurrentStep && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="text-[10px] font-medium text-gray-600 mb-2">Ask a follow-up question</div>
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            type="text"
                            value={askValue}
                            onChange={e => setAskValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendAsk()}
                            placeholder="Ask about this finding..."
                            className="flex-1 text-xs border border-gray-200 rounded-md px-2.5 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#455a4f]"
                          />
                          <button onClick={handleSendAsk} className="p-2 bg-[#455a4f] text-white rounded-md hover:bg-[#3a4a42] transition-colors">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Action buttons — only for current guided step */}
            {isViewingCurrentStep && !allStepsComplete && (
              <div className="px-5 py-4 border-t border-gray-200 flex-shrink-0">
                {!showFlagInput && !showAskInput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleConfirmStep}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#455a4f] text-white text-xs rounded-lg hover:bg-[#3a4a42] transition-colors font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                    <button
                      onClick={() => { setShowFlagInput(true); setShowAskInput(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 border border-amber-300 text-amber-700 text-xs rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Flag
                    </button>
                    <button
                      onClick={() => { setShowAskInput(true); setShowFlagInput(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Ask
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* New run modal */}
      {showNewRunModal && <NewRunModal workflowName={workflowName} onStart={handleStartNewRun} onClose={() => setShowNewRunModal(false)} />}
    </div>
  );
}

// ─── New Run Modal ─────────────────────────────────────────────────────────────
function NewRunModal({
  workflowName,
  onStart,
  onClose,
}: {
  workflowName: string;
  onStart: (record: { id: string; name: string; noteNumber: string }) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">Start New {workflowName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Select a record to begin the guided audit</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4 max-h-72 overflow-y-auto">
            <div className="space-y-2">
              {availableRecords.map(record => (
                <button
                  key={record.id}
                  onClick={() => onStart(record)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 hover:border-[#455a4f] transition-all"
                >
                  <div className="text-sm text-gray-900">{record.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{record.noteNumber}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button onClick={onClose} className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
