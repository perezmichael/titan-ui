import { Pencil, Paperclip, X, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { ChatMessage, AuditLogPanel, LegacyAuditLog } from './ChatMessage';
import type { ResponseAuditData, AuditPanelRequest } from './ChatMessage';
import { TitanLogo } from './TitanLogo';
import { useEffect, useState, useRef } from 'react';

// ── Mock audit data for the BSA/AML message ───────────────────────────────────
const bsaAuditData: ResponseAuditData = {
  model: 'gpt-4.1-mini',
  slmContributed: true,
  sources: [
    {
      rank: 1,
      name: 'BSA/AML Compliance Policy',
      weight: 52,
      importance: 'critical',
      keyFactors: ['CTR threshold $10,000', 'AML program requirements', 'FinCEN enforcement'],
      retrieval: { semanticScore: 0.94, keyword: 'Bank Secrecy Act', entity: 'FinCEN' },
      saliency: 0.94,
      snippet: 'Financial institutions must file a Currency Transaction Report for each currency transaction over $10,000...',
      score: 0.94,
    },
    {
      rank: 2,
      name: 'AML Program Overview',
      weight: 30,
      importance: 'significant',
      keyFactors: ['SAR filing requirements', 'employee training mandate'],
      retrieval: { semanticScore: 0.87, keyword: 'anti-money laundering' },
      saliency: 0.87,
      snippet: 'Suspicious Activity Reports must be filed within 30 days of detecting potential criminal activity...',
      score: 0.87,
    },
    {
      rank: 3,
      name: 'Financial Crimes Enforcement',
      weight: 18,
      keyFactors: ['FinCEN regulations'],
      retrieval: { semanticScore: 0.82, keyword: 'FinCEN compliance' },
      saliency: 0.72,
      snippet: 'The Financial Crimes Enforcement Network administers the Bank Secrecy Act and its implementing regulations...',
      score: 0.82,
    },
  ],
  claims: [
    {
      text: 'The Bank Secrecy Act was enacted in 1970',
      grounded: true,
      confidenceScore: 99,
      supportedBy: [{ sourceRef: 1, name: 'BSA/AML Compliance Policy', role: 'primary' }],
    },
    {
      text: 'Financial institutions must file CTRs for transactions over $10,000',
      grounded: true,
      confidenceScore: 99,
      supportedBy: [
        { sourceRef: 1, name: 'BSA/AML Compliance Policy', role: 'primary' },
        { sourceRef: 2, name: 'AML Program Overview', role: 'corroborating' },
      ],
    },
    {
      text: 'SARs are required for suspicious activity reporting',
      grounded: true,
      confidenceScore: 94,
      supportedBy: [
        { sourceRef: 2, name: 'AML Program Overview', role: 'primary' },
        { sourceRef: 3, name: 'Financial Crimes Enforcement', role: 'corroborating' },
      ],
    },
    {
      text: 'AML programs must designate a compliance officer and conduct training',
      grounded: true,
      confidenceScore: 91,
      supportedBy: [{ sourceRef: 1, name: 'BSA/AML Compliance Policy', role: 'primary' }],
    },
  ],
  reasoning: [
    {
      icon: 'shield' as const,
      label: 'Validated message for PII',
      items: ['No personally identifiable information detected'],
    },
    {
      icon: 'search' as const,
      label: 'Searched compliance knowledge base',
      items: ['BSA/AML Compliance Policy', 'AML Program Overview', 'Financial Crimes Enforcement'],
    },
    {
      icon: 'book' as const,
      label: 'Cross-referenced 4 claims',
      items: ['CTR threshold $10,000', 'SAR filing requirements', 'AML program mandates', 'FinCEN enforcement authority'],
    },
    {
      icon: 'sparkles' as const,
      label: 'Synthesized response',
    },
  ],
  executionSummary: 'Parsed the query as a regulatory definition request, then searched the compliance knowledge base and retrieved 3 relevant documents. Validation ran in parallel across 2 sources to cross-reference the CTR threshold and SAR filing requirements. Finally, synthesized a comprehensive response and confirmed all 4 claims meet the assurance threshold.',
  executionWaves: [
    {
      label: 'Planning',
      parallel: false,
      timeMs: 12,
      steps: [
        {
          label: 'Parsed query and identified as regulatory definition request',
          type: 'planning',
          detail: 'Domain: BSA/AML. Complexity: moderate. Required: definition, key requirements, enforcement context.',
        },
      ],
    },
    {
      label: 'Knowledge Search',
      parallel: false,
      timeMs: 379,
      steps: [
        {
          label: 'Searched compliance knowledge base',
          type: 'search',
          docCount: 3,
          timeMs: 145,
          detail: 'Keywords: "Bank Secrecy Act", "BSA", "regulatory compliance". Found 3 relevant documents.',
        },
        {
          label: 'Retrieved and ranked source documents',
          type: 'search',
          docCount: 3,
          timeMs: 234,
          detail: 'BSA/AML Compliance Policy (0.94), AML Program Overview (0.87), Financial Crimes Enforcement (0.82).',
        },
      ],
    },
    {
      label: 'Validation',
      parallel: true,
      timeMs: 478,
      steps: [
        {
          label: 'Cross-referenced CTR threshold across sources',
          type: 'analysis',
          docCount: 2,
          timeMs: 240,
          detail: 'Confirmed $10,000 threshold consistent with 31 CFR 103.22 across 2 sources.',
        },
        {
          label: 'Validated SAR filing requirements',
          type: 'analysis',
          docCount: 2,
          timeMs: 238,
          detail: 'Confirmed SAR requirements align with FinCEN standards for suspicious activity detection.',
        },
      ],
    },
    {
      label: 'Synthesis',
      parallel: false,
      timeMs: 150,
      steps: [
        {
          label: 'Synthesized comprehensive definition',
          type: 'synthesis',
          timeMs: 112,
          detail: 'Covered: legislative purpose, CTR/SAR requirements, AML program mandates, enforcement mechanisms.',
        },
        {
          label: 'Quality check and citation selection',
          type: 'quality',
          timeMs: 38,
          detail: 'All 4 claims verified. 2 citations prepared. Response meets assurance threshold.',
        },
      ],
    },
  ],
  deep: {
    signalAgreement: 0.94,
    featureImportance: [
      { rank: 1, name: 'BSA/AML Compliance Policy', coefficient: 0.52, attribution: 0.50, saliency: 0.94, counterfactual: 1.00 },
      { rank: 2, name: 'AML Program Overview',       coefficient: 0.30, attribution: 0.30, saliency: 0.87, counterfactual: 0.65 },
      { rank: 3, name: 'Financial Crimes Enforcement', coefficient: 0.18, attribution: 0.20, saliency: 0.72, counterfactual: 0.22 },
    ],
    overallConfidence: 96,
    flaggedItems: [],
    confidenceFactors: [
      { label: 'SUFFICIENT assurance level', passed: true },
      { label: '4/4 claims grounded in citations', passed: true },
      { label: 'High signal agreement across sources (R²=0.94)', passed: true },
      { label: 'No single-source dependencies detected', passed: true },
    ],
  },
};

// ── Thinking bubble ───────────────────────────────────────────────────────────

const STEP_ICONS: Record<string, React.ReactNode> = {
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  sparkles: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>,
};

function ThinkingBubble({
  steps,
  activeStep,
}: {
  steps: Array<{ icon: 'shield' | 'search' | 'book' | 'sparkles'; label: string; items?: string[] }>;
  activeStep: number;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-4 max-w-xl">
          {/* Spinning Titan logo + label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin" style={{ animationDuration: '1.4s' }}>
              <TitanLogo className="h-5" collapsed={true} />
            </div>
            <span className="text-sm text-gray-500">Analyzing your question…</span>
          </div>
          {/* Steps */}
          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 transition-all duration-500 ${
                  i <= activeStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                  i < activeStep
                    ? 'bg-[#455a4f] text-white'
                    : i === activeStep
                    ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {STEP_ICONS[step.icon]}
                </div>
                <span className={`text-xs transition-colors duration-300 ${
                  i < activeStep ? 'text-gray-500 line-through' : i === activeStep ? 'text-gray-800 font-medium' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {i < activeStep && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3 text-[#455a4f] flex-shrink-0 ml-auto">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {i === activeStep && (
                  <div className="ml-auto flex gap-[3px] items-center">
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-gray-400 mt-1.5 ml-1">Just now</div>
      </div>
    </div>
  );
}

interface SelectedDocument {
  id: string;
  name: string;
  source: string;
  type: string;
  lastUpdated: string;
  size: string;
}

interface ActiveCitation {
  title: string;
  pageNumber?: number;
  highlightedText?: string;
  context?: string;
  description?: string;
}

interface ChatAreaProps {
  conversationId: string;
  selectedDocument?: SelectedDocument | null;
  onClearDocument?: () => void;
  onChatNavigate?: (chatId: string) => void;
  onUploadComplete?: () => void;
  onUploadProgressChange?: (progress: number) => void;
  onUploadStart?: () => void;
  uploadProgress?: number;
}

export function ChatArea({ conversationId, selectedDocument, onClearDocument, onChatNavigate, onUploadComplete, onUploadProgressChange, onUploadStart, uploadProgress = 0 }: ChatAreaProps) {
  const [hasCompletedUpload, setHasCompletedUpload] = useState<boolean>(false);
  const hasStartedUploadRef = useRef<boolean>(false);
  const [activeCitation, setActiveCitation] = useState<ActiveCitation | null>(null);
  const [internetSearchEnabled, setInternetSearchEnabled] = useState<boolean>(false);
  const [auditPanel, setAuditPanel] = useState<AuditPanelRequest | null>(null);
  const [auditPanelWidth, setAuditPanelWidth] = useState(480);
  const auditPanelRef = useRef<HTMLDivElement>(null);
  const [thinkingStep, setThinkingStep] = useState<number>(-1); // -1 = done, 0–N = thinking
  const [justRevealed, setJustRevealed] = useState(false);
  const revealedRef = useRef<Set<string>>(new Set());

  const handleAuditDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = auditPanelWidth;
    // Kill transition during drag so it tracks the mouse instantly
    if (auditPanelRef.current) auditPanelRef.current.style.transition = 'none';
    const onMove = (ev: MouseEvent) => {
      const w = Math.max(380, Math.min(800, startWidth + (startX - ev.clientX)));
      if (auditPanelRef.current) auditPanelRef.current.style.width = `${w}px`;
    };
    const onUp = (ev: MouseEvent) => {
      const w = Math.max(380, Math.min(800, startWidth + (startX - ev.clientX)));
      if (auditPanelRef.current) auditPanelRef.current.style.transition = '';
      setAuditPanelWidth(w);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleOpenAuditPanel = (req: AuditPanelRequest) => {
    setActiveCitation(null); // close PDF viewer if open
    setAuditPanel(req);
  };
  
  // Trigger upload start when user first views the upload-processing conversation
  useEffect(() => {
    if (conversationId === 'upload-processing' && !hasStartedUploadRef.current) {
      hasStartedUploadRef.current = true;
      onUploadStart?.();
    }
  }, [conversationId, onUploadStart]);

  // Thinking animation — plays once per conversation session
  useEffect(() => {
    if (conversationId === '3' && !revealedRef.current.has('3')) {
      revealedRef.current.add('3');
      const steps = bsaAuditData.reasoning ?? [];
      setThinkingStep(0);
      let current = 0;
      const iv = setInterval(() => {
        current++;
        if (current >= steps.length) {
          clearInterval(iv);
          setTimeout(() => {
            setThinkingStep(-1);
            setJustRevealed(true);
            setTimeout(() => setJustRevealed(false), 800);
          }, 700);
        } else {
          setThinkingStep(current);
        }
      }, 800);
      return () => clearInterval(iv);
    }
  }, [conversationId]);

  // Conversation 3: BSA/AML Compliance Review
  const conversation3 = {
    title: 'BSA/AML Compliance Review — VFN Holdings',
    timestamp: 'Apr 5, 10:08 AM',
    messages: [
      {
        type: 'user' as const,
        content: 'Before I approve the VFN Holdings credit memo, I need to confirm we\'re covered on BSA/AML. What are the key thresholds our compliance team monitors?',
        timestamp: 'Apr 5, 10:08 AM'
      },
      {
        type: 'assistant' as const,
        content: 'For VFN Holdings, the primary BSA/AML thresholds your compliance team tracks are:\n\n**Currency Transaction Reports (CTRs):** Any cash transaction over **$10,000** triggers a mandatory CTR filing with FinCEN. For VFN, given their commercial real estate activity, watch for structured transactions that fall just below this threshold.\n\n**Suspicious Activity Reports (SARs):** Required when a transaction involves $5,000 or more and you have reason to suspect money laundering, fraud, or structuring. SARs must be filed within 30 days of detection.\n\n**Enhanced Due Diligence:** VFN\'s multi-state operations put them in the moderate-risk tier under our risk categorization framework — meaning quarterly transaction monitoring applies.\n\nWant me to pull the full Customer Risk Profile for VFN Holdings?',
        timestamp: 'Apr 5, 10:09 AM',
        hasReactions: true,
        confidence: 'High' as const,
        confidenceThresholdPassed: true,
        chainOfThought: [
          { step: 'Parsed query as BSA/AML threshold lookup for specific relationship (VFN Holdings)', confidencePassed: true, category: 'Analysis', confidenceScore: 97, timeMs: 11 },
          { step: 'Searched compliance knowledge base: "BSA AML thresholds CTR SAR"', confidencePassed: true, category: 'Search', confidenceScore: 95, timeMs: 156 },
          { step: 'Retrieved BSA/AML Compliance Policy (0.94), AML Program Overview (0.87)', confidencePassed: true, category: 'Search', confidenceScore: 93, timeMs: 198 },
          { step: 'Identified VFN risk tier as moderate based on multi-state commercial operations', confidencePassed: true, category: 'Analysis', confidenceScore: 91, timeMs: 67 },
          { step: 'Synthesized threshold summary with relationship-specific context', confidencePassed: true, category: 'Synthesis', confidenceScore: 96, timeMs: 82 }
        ]
      },
      {
        type: 'user' as const,
        content: 'Good. And what exactly does the Bank Secrecy Act require of us as a financial institution?',
        timestamp: 'Apr 5, 10:20 AM'
      },
      {
        type: 'assistant' as const,
        content: 'The **Bank Secrecy Act (BSA)**, enacted in 1970, is the primary U.S. federal law requiring financial institutions to partner with government agencies to detect and prevent money laundering, terrorism financing, and other financial crimes.\n\nAs a financial institution, Axiom Bank has four core obligations under the BSA:\n\n1. **Currency Transaction Reports (CTRs)** — File with FinCEN for any cash transaction exceeding $10,000, including structured transactions designed to avoid the threshold.\n\n2. **Suspicious Activity Reports (SARs)** — File within 30 days when transactions of $5,000+ suggest potential criminal activity, structuring, or fraud.\n\n3. **AML Program** — Maintain a written anti-money laundering program with a designated compliance officer, employee training, independent audit, and ongoing customer monitoring.\n\n4. **Recordkeeping** — Retain transaction records and Customer Identification Program (CIP) documentation for a minimum of five years.\n\nFinCEN (Financial Crimes Enforcement Network) is the primary enforcement agency. Non-compliance can result in civil penalties and OCC enforcement actions.\n\nReferences:',
        timestamp: 'Apr 5, 10:23 AM',
        hasReactions: true,
        confidence: 'Medium' as const,
        confidenceThresholdPassed: true,
        chainOfThought: [
          { step: 'Parsed user query: "what is the bank secrecy act" - identified as a request for regulatory definition', confidencePassed: true, category: 'Analysis', confidenceScore: 98, timeMs: 12 },
          { step: 'Initiated semantic search across compliance policy knowledge base using keywords: "Bank Secrecy Act", "BSA", "regulatory compliance"', confidencePassed: true, category: 'Search', confidenceScore: 96, timeMs: 145 },
          { step: 'Retrieved 3 relevant documents: "BANK SECRECY ACT AND ANTI-MONEY LAUNDERING COMPLIANCE POLICY.docx" (relevance: 0.94), "AML Program Overview.pdf" (relevance: 0.87), "Financial Crimes Enforcement.docx" (relevance: 0.82)', confidencePassed: true, category: 'Search', confidenceScore: 94, timeMs: 234 },
          { step: 'Extracted key information from primary document: Enactment year (1970), core purpose (prevent money laundering), regulatory authority (FinCEN)', confidencePassed: true, category: 'Analysis', confidenceScore: 97, timeMs: 89 },
          { step: 'Identified Currency Transaction Report (CTR) requirements: mandatory filing for cash transactions exceeding $10,000', confidencePassed: true, category: 'Analysis', confidenceScore: 96, timeMs: 67 },
          { step: 'Identified Suspicious Activity Report (SAR) requirements: mandatory reporting of transactions indicating potential criminal activity, money laundering, or fraud', confidencePassed: true, category: 'Analysis', confidenceScore: 95, timeMs: 72 },
          { step: 'Validated AML program requirements: financial institutions must establish and maintain written policies, designate compliance officers, conduct employee training, and perform independent audits', confidencePassed: true, category: 'Validation', confidenceScore: 93, timeMs: 103 },
          { step: 'Cross-referenced information across all three documents to verify consistency and accuracy of key facts', confidencePassed: true, category: 'Validation', confidenceScore: 97, timeMs: 178 },
          { step: 'Verified historical accuracy: Confirmed 1970 as enactment year through multiple source documents', confidencePassed: true, category: 'Validation', confidenceScore: 99, timeMs: 56 },
          { step: 'Assessed scope applicability: Confirmed BSA applies to banks, credit unions, broker-dealers, money services businesses, and other financial institutions', confidencePassed: true, category: 'Validation', confidenceScore: 94, timeMs: 81 },
          { step: 'Validated regulatory context: Confirmed FinCEN (Financial Crimes Enforcement Network) as primary enforcement agency', confidencePassed: true, category: 'Validation', confidenceScore: 98, timeMs: 64 },
          { step: 'Synthesized comprehensive definition covering: legislative purpose, key reporting requirements (CTR/SAR), AML program mandates, and enforcement mechanisms', confidencePassed: true, category: 'Synthesis', confidenceScore: 96, timeMs: 112 },
          { step: 'Quality check: Ensured response includes practical examples (transaction thresholds) and avoids technical jargon where possible', confidencePassed: true, category: 'Quality Check', confidenceScore: 95, timeMs: 43 },
          { step: 'Prepared source citations: Selected 2 most relevant document excerpts to support response and enable user verification', confidencePassed: true, category: 'Quality Check', confidenceScore: 97, timeMs: 38 },
          { step: 'Final validation: Confirmed all statements are factually supported by source documents and meet answer strength requirements', confidencePassed: true, category: 'Quality Check', confidenceScore: 98, timeMs: 29 }
        ],
        references: [
          {
            number: 1,
            title: 'BANK SECRECY ACT AND ANTI-MONEY LAUNDERING COMPLIANCE POLICY.docx',
            description: 'Outlines expected the Bank Secrecy Act requirements to prevent financial institutions from being used as intermediaries for the transfer or deposit of money derived from criminal activity.'
          }
        ],
        responseAuditData: bsaAuditData,
      }
    ]
  };

  // Conversation 1: BSA AML Procedure Review
  const conversation1 = {
    title: 'BSA AML Procedure Review',
    timestamp: 'Nov 10, 8:53 AM',
    messages: [
      {
        type: 'user' as const,
        content: 'Can you help me review this procedure?',
        timestamp: 'Nov 10, 8:53 AM',
        attachment: {
          fileName: '2026 BSA AML Procedure - Draft.docx',
          fileSize: '156 KB'
        }
      },
      {
        type: 'assistant' as const,
        content: 'I\'d be happy to help you review the 2026 BSA AML Procedure - Draft. After analyzing the document, I can provide feedback on its compliance alignment with the Bank Secrecy Act requirements. I\'ve also pulled in last year\'s procedure for reference.\n\nThe draft procedure appears comprehensive and includes key BSA/AML components such as Customer Identification Program (CIP) requirements, ongoing monitoring protocols, and suspicious activity reporting procedures. The document appropriately references Currency Transaction Report (CTR) thresholds and Suspicious Activity Report (SAR) filing requirements.\n\nHowever, I noticed a few areas that could benefit from clarification or enhancement:\n\n1. **Risk Assessment Framework**: While the draft mentions risk-based approaches, it would be helpful to include more specific criteria for categorizing customers into risk tiers (low, medium, high).\n\n2. **Enhanced Due Diligence**: The section on EDD could be expanded to provide clearer guidance on when enhanced measures are required, particularly for high-risk customers or jurisdictions.\n\n3. **Training Requirements**: Consider adding more detail about the frequency and content of required BSA/AML training for staff members.\n\nTitan referenced the 2025 version of the procedure to help generate the answer above.\n\nReferences:',
        timestamp: 'Nov 10, 8:54 AM',
        hasReactions: true,
        confidence: 'Medium' as const,
        confidenceThresholdPassed: true,
        chainOfThought: [
          { step: 'Parsed user request: Document review for "2025 BSA AML Procedure Draft.docx" - identified as compliance document analysis task', confidencePassed: true, category: 'Analysis', confidenceScore: 99, timeMs: 15 },
          { step: 'Extracted text content from uploaded document: 45 pages, 12,847 words - detected structured policy sections', confidencePassed: true, category: 'Analysis', confidenceScore: 98, timeMs: 892 },
          { step: 'Initiated semantic search for reference documents using keywords: "Bank Secrecy Act", "BSA AML compliance", "AML procedures", "regulatory requirements"', confidencePassed: true, category: 'Search', confidenceScore: 97, timeMs: 167 },
          { step: 'Retrieved authoritative reference: "BANK SECRECY ACT AND ANTI-MONEY LAUNDERING COMPLIANCE POLICY.docx" (relevance: 0.96) containing current regulatory standards', confidencePassed: true, category: 'Search', confidenceScore: 96, timeMs: 245 },
          { step: 'Cross-referenced draft document sections against established BSA/AML compliance requirements: CIP protocols, CTR/SAR reporting, ongoing monitoring, record retention', confidencePassed: true, category: 'Validation', confidenceScore: 94, timeMs: 534 },
          { step: 'Identified compliance coverage: Document addresses 8 of 10 core BSA requirements - gaps detected in risk assessment specificity and EDD guidance', confidencePassed: true, category: 'Validation', confidenceScore: 91, timeMs: 423 },
          { step: 'Validated CTR threshold accuracy: Draft correctly specifies $10,000 threshold consistent with 31 CFR 103.22', confidencePassed: true, category: 'Validation', confidenceScore: 99, timeMs: 78 },
          { step: 'Validated SAR filing requirements: Draft aligns with FinCEN requirements for suspicious activity detection and reporting timelines', confidencePassed: true, category: 'Validation', confidenceScore: 98, timeMs: 156 },
          { step: 'Assessed risk-based approach implementation: Framework mentioned but lacks detailed customer risk categorization criteria', confidencePassed: false, category: 'Quality Check', confidenceScore: 67, timeMs: 203 },
          { step: 'Evaluated Enhanced Due Diligence provisions: Basic requirements present but insufficient detail on high-risk scenarios and jurisdictions', confidencePassed: false, category: 'Quality Check', confidenceScore: 72, timeMs: 187 },
          { step: 'Reviewed training requirements section: General training mandate present but lacks specificity on frequency and curriculum content', confidencePassed: false, category: 'Quality Check', confidenceScore: 69, timeMs: 134 },
          { step: 'Synthesized constructive feedback: Identified 3 priority enhancement areas while acknowledging strong foundational compliance coverage', confidencePassed: true, category: 'Synthesis', confidenceScore: 95, timeMs: 289 },
          { step: 'Prepared reference citation to authoritative BSA/AML policy document for user verification and further guidance', confidencePassed: true, category: 'Quality Check', confidenceScore: 97, timeMs: 45 }
        ],
        references: [
          {
            number: 1,
            title: '2025 BSA AML Procedure - Final',
            description: 'Last year\'s BSA AML procedure document used as reference for compliance requirements and policy framework.',
            pageNumber: 12,
            highlightedText: 'Risk Assessment Framework: All customers shall be categorized into risk tiers using the following criteria: (1) Low Risk - Established businesses with predictable transaction patterns, domestic operations only, transparent ownership structure; (2) Medium Risk - International transactions under $500,000 annually, multi-state operations, moderate transaction complexity; (3) High Risk - Politically Exposed Persons (PEPs), cash-intensive businesses, operations in high-risk jurisdictions, complex ownership structures, or transactions exceeding $1,000,000 annually.',
            context: 'Section 4.2 - Customer Risk Categorization. The Bank employs a comprehensive risk-based approach to BSA/AML compliance, ensuring that resources are appropriately allocated based on the level of risk presented by each customer relationship. This framework serves as the foundation for determining the depth and frequency of monitoring activities...'
          }
        ]
      }
    ]
  };

  // Conversation 2: Email Draft Assistance
  const conversation2 = {
    title: 'Training Announcement Email',
    timestamp: 'Nov 8, 2:15 PM',
    messages: [
      {
        type: 'user' as const,
        content: 'Can you help me write an email about the upcoming trainings being rolled out across the bank?',
        timestamp: 'Nov 8, 2:15 PM',
        attachment: {
          fileName: 'Q1 2026 Training Schedule and Details.pdf',
          fileSize: '248 KB'
        }
      },
      {
        type: 'assistant' as const,
        content: 'I\'d be happy to help you draft an email announcement for the upcoming training programs. Based on the Q1 2026 training schedule, here\'s a professional email for your team:\n\n---\n\n**Subject: Important: Q1 2026 Mandatory Training Programs - Registration Now Open**\n\nDear Team,\n\nI hope this message finds you well. I\'m writing to inform you about several mandatory training programs that will be rolled out across the bank during Q1 2026. These training sessions are designed to strengthen our operational excellence, ensure regulatory compliance, and enhance our collective expertise.\n\n**Required Training Programs:**\n\n• **BSA/AML Annual Recertification** - All employees must complete this by January 31, 2026. The online module takes approximately 90 minutes and covers updated regulatory requirements and real-world case studies.\n\n• **Cybersecurity Awareness Training** - Scheduled for February 2026. This interactive workshop addresses emerging threats, phishing prevention, and data protection protocols. In-person sessions will be held across all branches.\n\n• **Customer Service Excellence Refresh** - Rolling sessions throughout January and February 2026. This program focuses on enhanced communication strategies and conflict resolution techniques.\n\n• **Fair Lending and UDAAP Compliance** - Required for all client-facing staff by February 28, 2026. This training ensures we maintain the highest standards of fair and equitable customer treatment.\n\n**Important Dates and Registration:**\n\nRegistration is now open through our Learning Management System (LMS). Please log in to the training portal and enroll in your required courses by December 20, 2025. Each training includes both online modules and optional in-person sessions to accommodate different learning preferences and schedules.\n\nYour direct supervisor will receive confirmation once you\'ve completed each training module. Completion of these programs is mandatory and will be reflected in your Q1 performance documentation.\n\n**Need Assistance?**\n\nIf you encounter any technical issues accessing the LMS or have questions about which trainings apply to your role, please contact the Learning & Development team at training@ourbank.com or extension 5500.\n\nThank you for your continued commitment to professional development and operational excellence. These investments in our skills and knowledge directly contribute to our bank\'s success and our ability to serve our customers effectively.\n\nBest regards,\n[Your Name]\n[Your Title]\n\n---\n\nWould you like me to adjust the tone, add additional details, or modify any section of this draft?',
        timestamp: 'Nov 8, 2:16 PM',
        hasReactions: true,
        confidence: 'High' as const,
        confidenceThresholdPassed: true,
        chainOfThought: [
          { step: 'Parsed user request: Draft email announcement for bank-wide training rollout - identified as professional communication task', confidencePassed: true, category: 'Analysis', confidenceScore: 99, timeMs: 12 },
          { step: 'Extracted content from uploaded document "Q1 2026 Training Schedule and Details.pdf": 8 pages, identified 4 mandatory training programs with dates, durations, and compliance requirements', confidencePassed: true, category: 'Analysis', confidenceScore: 97, timeMs: 1240 },
          { step: 'Identified target audience: Bank employees across multiple departments and locations - requires clear, professional, authoritative tone', confidencePassed: true, category: 'Analysis', confidenceScore: 98, timeMs: 45 },
          { step: 'Extracted key training details: BSA/AML Recertification (Jan 31 deadline), Cybersecurity Awareness (Feb), Customer Service Excellence (Jan-Feb), Fair Lending/UDAAP (Feb 28 deadline)', confidencePassed: true, category: 'Analysis', confidenceScore: 96, timeMs: 234 },
          { step: 'Identified compliance requirements: Mandatory completion, LMS registration required, performance documentation linkage, supervisor notification', confidencePassed: true, category: 'Validation', confidenceScore: 97, timeMs: 178 },
          { step: 'Determined optimal email structure: Subject line with urgency indicator, greeting, purpose statement, bulleted training details, action items, support contact, professional closing', confidencePassed: true, category: 'Synthesis', confidenceScore: 95, timeMs: 156 },
          { step: 'Validated subject line effectiveness: Includes "Important" flag, specifies Q1 2026 timeframe, mentions mandatory nature, indicates actionable item (registration)', confidencePassed: true, category: 'Quality Check', confidenceScore: 94, timeMs: 67 },
          { step: 'Structured training descriptions: Each program includes clear title, deadline, duration estimate, and value proposition to encourage engagement', confidencePassed: true, category: 'Synthesis', confidenceScore: 96, timeMs: 289 },
          { step: 'Included critical action items: Registration deadline (Dec 20), LMS access instructions, supervisor confirmation process, completion requirements', confidencePassed: true, category: 'Quality Check', confidenceScore: 98, timeMs: 134 },
          { step: 'Added support contact information: Provided email and extension for training support team to reduce potential confusion and access barriers', confidencePassed: true, category: 'Quality Check', confidenceScore: 97, timeMs: 89 },
          { step: 'Validated tone appropriateness: Professional but approachable, authoritative without being demanding, emphasizes value and organizational benefit', confidencePassed: true, category: 'Quality Check', confidenceScore: 95, timeMs: 112 },
          { step: 'Ensured regulatory compliance language: References mandatory nature, performance documentation, and compliance requirements without creating undue alarm', confidencePassed: true, category: 'Validation', confidenceScore: 96, timeMs: 145 },
          { step: 'Quality check: Email length appropriate for professional communication (not too brief, not overwhelming), scannable format with clear sections and bullet points', confidencePassed: true, category: 'Quality Check', confidenceScore: 97, timeMs: 78 },
          { step: 'Added offer for customization: Included closing question inviting user to request modifications, demonstrating collaborative approach', confidencePassed: true, category: 'Quality Check', confidenceScore: 98, timeMs: 34 }
        ]
      }
    ]
  };

  // Conversation 4: Internet Search Example
  const conversation4 = {
    title: 'Current Fed Interest Rate',
    timestamp: 'Mar 10, 9:42 AM',
    messages: [
      {
        type: 'user' as const,
        content: 'What is the current federal funds rate and when was it last changed?',
        timestamp: 'Mar 10, 9:42 AM'
      },
      {
        type: 'assistant' as const,
        content: 'As of March 2026, the federal funds target rate is in the range of 4.25% to 4.50%. This rate was last adjusted on January 29, 2026, when the Federal Reserve reduced the rate by 25 basis points from the previous range of 4.50% to 4.75%.\n\nThe Federal Open Market Committee (FOMC) made this decision in response to moderating inflation trends and a stabilizing labor market. In their January statement, the FOMC noted that economic activity has been expanding at a solid pace, and while inflation has eased over the past year, it remains somewhat elevated relative to their 2% longer-run goal.\n\nThe next scheduled FOMC meeting is on March 19-20, 2026, where policymakers will review economic conditions and determine whether any further adjustments to the federal funds rate are warranted.',
        timestamp: 'Mar 10, 9:43 AM',
        hasReactions: true,
        confidence: 'High' as const,
        confidenceThresholdPassed: true,
        internetSearchAssisted: true,
        sources: {
          connectors: [
            {
              id: 'conn-1',
              documentName: 'Federal Reserve Economic Data',
              highlightedText: 'The target range for the federal funds rate is 4.25% to 4.50%, effective January 29, 2026. This represents a 25 basis point reduction from the prior range.',
              context: 'Economic data from the Federal Reserve Board showing current monetary policy targets and historical rate changes.',
              connector: 'Bloomberg Terminal',
              url: 'https://bloomberg.com/markets/rates-bonds'
            },
            {
              id: 'conn-2',
              documentName: 'FOMC Meeting Minutes - January 2026',
              highlightedText: 'The Committee decided to lower the target range for the federal funds rate by 25 basis points, citing moderating inflation pressures and stable employment conditions.',
              context: 'Official meeting minutes from the Federal Open Market Committee detailing monetary policy decisions.',
              connector: 'FactSet',
              url: 'https://factset.com/fed-data'
            }
          ],
          uploads: [
            {
              id: 'upload-1',
              documentName: 'Economic Analysis Report Q1 2026.pdf',
              pageNumber: 12,
              highlightedText: 'Our internal analysis projects the Federal Reserve will maintain rates in the current range through Q2 2026, with a potential further reduction in Q3 pending inflation data.',
              context: 'Internal economic research report analyzing Federal Reserve policy outlook and impact on commercial lending.'
            }
          ],
          internet: [
            {
              id: 'web-1',
              documentName: 'Federal Reserve Board - Official Policy Statement',
              highlightedText: 'The Federal Open Market Committee has lowered the target range for the federal funds rate to 4.25% to 4.50%. Economic activity has been expanding at a solid pace.',
              context: 'Official Federal Reserve Board press release dated January 29, 2026.',
              url: 'https://federalreserve.gov/newsevents/pressreleases'
            },
            {
              id: 'web-2',
              documentName: 'Wall Street Journal: Fed Cuts Rates Amid Cooling Inflation',
              highlightedText: 'The Federal Reserve reduced interest rates by a quarter percentage point Wednesday, the third consecutive cut as inflation continues to moderate toward the central bank\'s 2% target.',
              context: 'News article published January 29, 2026 covering the latest Federal Reserve policy decision.',
              url: 'https://wsj.com/economy/central-banking/fed-interest-rate-decision'
            }
          ]
        },
        chainOfThought: [
          { step: 'Parsed user query: \"What is the current federal funds rate and when was it last changed?\" - identified as request for current monetary policy information', confidencePassed: true, category: 'Analysis', confidenceScore: 99, timeMs: 8 },
          { step: 'Determined query requires real-time information not available in internal knowledge base - initiated internet search', confidencePassed: true, category: 'Search', confidenceScore: 98, timeMs: 23 },
          { step: 'Executed web search for: \"federal funds rate 2026 current\" across Federal Reserve official sources', confidencePassed: true, category: 'Search', confidenceScore: 97, timeMs: 842 },
          { step: 'Retrieved information from federalreserve.gov: Current target range 4.25%-4.50%, last changed January 29, 2026', confidencePassed: true, category: 'Search', confidenceScore: 96, timeMs: 234 },
          { step: 'Verified information consistency across multiple sources: Federal Reserve official website, FOMC statements, financial news outlets', confidencePassed: true, category: 'Validation', confidenceScore: 95, timeMs: 567 },
          { step: 'Extracted context from FOMC statement: Rate reduction of 25 basis points, reasoning based on inflation trends and labor market conditions', confidencePassed: true, category: 'Analysis', confidenceScore: 97, timeMs: 156 },
          { step: 'Cross-referenced next FOMC meeting date: Confirmed March 19-20, 2026 from official Federal Reserve calendar', confidencePassed: true, category: 'Validation', confidenceScore: 98, timeMs: 234 },
          { step: 'Synthesized comprehensive response including: current rate, last change date, basis points adjustment, FOMC reasoning, upcoming meeting', confidencePassed: true, category: 'Synthesis', confidenceScore: 96, timeMs: 178 },
          { step: 'Quality check: Ensured all stated facts are current as of March 2026 and sourced by authoritative sources', confidencePassed: true, category: 'Quality Check', confidenceScore: 97, timeMs: 67 }
        ]
      }
    ]
  };

  // Select the appropriate conversation
  const activeConversation = conversationId === '1' ? conversation1 : conversationId === '2' ? conversation2 : conversationId === '4' ? conversation4 : conversation3;

  // Show upload processing view
  const isUploadProcessing = conversationId === 'upload-processing';

  // Show new conversation view when a document is selected OR when it's a new chat
  const isNewConversationWithDoc = (conversationId === 'new-with-doc' && selectedDocument) || conversationId === 'new-chat';
  const showDocumentChip = selectedDocument && conversationId !== 'new-chat';

  return (
    <div className="flex-1 flex h-screen overflow-hidden bg-[#f5f5f3]">
      {/* Chat Section — always flex-1 min-w-0 so it squeezes as the panel grows */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#f5f5f3]">
        {/* Header */}
        {!isNewConversationWithDoc && (
          <div className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-sm text-gray-900">
                  {isUploadProcessing ? 'Regulatory Filing Analysis - Q4 2025' : isNewConversationWithDoc ? 'New Conversation' : activeConversation.title}
                </h1>
                <button className="text-gray-400 hover:text-gray-600">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {isUploadProcessing ? 'Jan 14, 10:24 AM' : isNewConversationWithDoc ? 'Just now' : activeConversation.timestamp}
            </div>
          </div>
        )}

        {/* Selected Document Banner - Only show for existing conversations */}
        {selectedDocument && !isNewConversationWithDoc && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
            <div className="max-w-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{selectedDocument.name}</div>
                  <div className="text-xs text-gray-600">
                    {selectedDocument.source} • {selectedDocument.size} • {selectedDocument.lastUpdated}
                  </div>
                </div>
              </div>
              {onClearDocument && (
                <button
                  onClick={onClearDocument}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Remove document"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[rgb(255,255,255)]">
          {isUploadProcessing ? (
            <div className="max-w-3xl">
              {/* User message with uploaded files */}
              <div className="mb-6">
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex flex-col items-end max-w-[85%]">
                    <div className="text-xs text-gray-900 mb-2">
                      I need help analyzing these regulatory filing documents for Q4 2025
                    </div>
                    
                    {/* File attachments */}
                    <div className="space-y-2 w-full">
                      {[
                        { name: 'Q4_2025_10K_Filing.pdf', size: '8.2 MB' },
                        { name: 'Financial_Statements_Q4.pdf', size: '6.7 MB' },
                        { name: 'Risk_Assessment_Report.pdf', size: '5.4 MB' },
                        { name: 'Compliance_Summary_Q4.pdf', size: '7.1 MB' },
                        { name: 'Audit_Committee_Report.pdf', size: '5.9 MB' },
                        { name: 'Regulatory_Correspondence.pdf', size: '6.3 MB' }
                      ].map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
                          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{file.name}</div>
                            <div className="text-[10px] text-gray-500">{file.size}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-[10px] text-gray-500 mt-2">
                      Jan 14, 10:24 AM
                    </div>
                  </div>
                </div>
              </div>

              {/* AI response with upload status */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      {uploadProgress < 100 ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-sm text-gray-900">Processing 6 files (39.6 MB)... • Step {Math.max(1, Math.min(Math.ceil(uploadProgress * 7 / 100), 7))} of 7 complete</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-3">
                            You can leave this page — I'll notify you when ready.
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-900">
                          Your files are ready. What would you like to know about them?
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-2 ml-1">
                      Jan 14, 10:24 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isNewConversationWithDoc ? (
            <div className="h-full flex flex-col items-center justify-center">
              {/* Centered content */}
              <div className="flex flex-col items-center mb-12">
                {/* Titan Logo Icon */}
                <div className="mb-6">
                  <TitanLogo className="h-16" collapsed={true} />
                </div>
                
                {/* Greeting */}
                <h2 className="text-xl text-gray-900 mb-2">
                  Hi Tom! How can I help?
                </h2>
                
                {/* Helper text */}
                <p className="text-sm text-gray-500">
                  Type your message below or drop files anywhere to begin
                </p>
              </div>

              {/* Input box positioned in center area */}
              <div className="w-full max-w-2xl px-4">
                <div className="relative">
                  <div className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm placeholder:text-gray-400 pr-20 focus-within:border-gray-400">
                    {/* Document attachment chip inside input */}
                    {selectedDocument && (
                      <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded px-2 py-1 mb-2">
                        <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-900">{selectedDocument.name}</span>
                        <span className="text-xs text-gray-500">• {selectedDocument.source}</span>
                        {onClearDocument && (
                          <button
                            onClick={onClearDocument}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            title="Remove document"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Type a message to start..."
                      className="w-full outline-none bg-transparent"
                    />
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="text-gray-400 hover:text-gray-600 p-2">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-gray-300 hover:bg-gray-400 text-white rounded flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8L14 8M14 8L8 2M14 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Internet Search Toggle - below input */}
                <div className="flex items-center gap-1.5 mt-2 px-1">
                  <Globe className={`w-3 h-3 ${internetSearchEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`text-xs ${internetSearchEnabled ? 'text-blue-500' : 'text-gray-500'}`}>
                    Internet assisted
                  </span>
                  <button
                    onClick={() => setInternetSearchEnabled(!internetSearchEnabled)}
                    className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
                      internetSearchEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                        internetSearchEnabled ? 'translate-x-[11px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl">
              {(() => {
                const msgs = activeConversation.messages;
                // When thinking is active, hide the last assistant message and show thinking state
                const isActiveThinking = thinkingStep >= 0 && conversationId === '3';
                const visibleMsgs = isActiveThinking
                  ? msgs.slice(0, msgs.length - 1)
                  : msgs;
                return (
                  <>
                    {visibleMsgs.map((message, index) => {
                      const isLastAndRevealing = !isActiveThinking && justRevealed && index === msgs.length - 1;
                      return (
                        <div
                          key={index}
                          className={isLastAndRevealing ? 'animate-fade-in' : ''}
                          style={isLastAndRevealing ? { animation: 'fadeIn 0.5s ease-out' } : {}}
                        >
                          <ChatMessage
                            {...message}
                            onCitationClick={setActiveCitation}
                            onOpenAuditPanel={handleOpenAuditPanel}
                          />
                        </div>
                      );
                    })}
                    {isActiveThinking && (
                      <ThinkingBubble
                        steps={bsaAuditData.reasoning ?? []}
                        activeStep={thinkingStep}
                      />
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Input - Only show for existing conversations */}
        {!isNewConversationWithDoc && (
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-3xl">
              <div className="relative border border-gray-300 rounded-lg">
                <textarea
                  placeholder={selectedDocument ? `Ask about ${selectedDocument.name}...` : "Type a message..."}
                  className="w-full resize-none rounded-lg py-3 px-4 text-sm placeholder:text-gray-400 pr-12 outline-none focus:border-gray-400 pb-12"
                  rows={1}
                  style={{ minHeight: '52px' }}
                />
                
                {/* Bottom controls */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    
                    {/* Internet Search Toggle */}
                    <div className="flex items-center gap-1.5 pl-1">
                      <Globe className={`w-3.5 h-3.5 ${internetSearchEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${internetSearchEnabled ? 'text-blue-500' : 'text-gray-500'}`}>
                        Internet assisted
                      </span>
                      <button
                        onClick={() => setInternetSearchEnabled(!internetSearchEnabled)}
                        className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
                          internetSearchEnabled ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                            internetSearchEnabled ? 'translate-x-[11px]' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <button className="w-8 h-8 bg-gray-400 hover:bg-gray-500 text-white rounded flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8L14 8M14 8L8 2M14 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Log Panel — always in DOM, width animates 0 → target */}
      <div
        ref={auditPanelRef}
        className="flex-shrink-0 h-screen overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: auditPanel ? auditPanelWidth : 0 }}
      >
        <div className="flex h-full w-full">
          {/* Drag handle */}
          <div
            className="w-3 flex-shrink-0 relative flex items-center justify-center cursor-col-resize group"
            onMouseDown={handleAuditDividerMouseDown}
          >
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gray-200 group-hover:bg-blue-400 transition-colors" />
            <div className="relative z-10 w-[5px] h-8 rounded-full bg-gray-300 group-hover:bg-blue-200 transition-colors" />
          </div>
          {/* Panel content */}
          <div className="flex-1 overflow-hidden bg-[#f9f9f8] border-l border-gray-200 flex flex-col">
            {auditPanel?.kind === 'v2' ? (
              <AuditLogPanel
                auditData={auditPanel.auditData}
                confidenceThresholdPassed={auditPanel.confidenceThresholdPassed}
                chainOfThought={auditPanel.chainOfThought}
                timestamp={auditPanel.timestamp}
                onClose={() => setAuditPanel(null)}
              />
            ) : auditPanel?.kind === 'legacy' ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                  <button onClick={() => setAuditPanel(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Audit Log</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">
                      Ref #{Math.random().toString(36).substring(2, 12).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <LegacyAuditLog
                    confidenceThresholdPassed={auditPanel.confidenceThresholdPassed}
                    chainOfThought={auditPanel.chainOfThought}
                    internetSearchAssisted={auditPanel.internetSearchAssisted}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* PDF Viewer Section - Only show when citation is active */}
      {activeCitation && (
        <div className="w-1/2 h-screen flex flex-col bg-[#2c2c2c] border-l border-gray-700">
          {/* PDF Viewer Header */}
          <div className="bg-[#383838] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{activeCitation.title}</div>
                {activeCitation.pageNumber && (
                  <div className="text-xs text-gray-400">Page {activeCitation.pageNumber}</div>
                )}
              </div>
            </div>
            <button 
              onClick={() => setActiveCitation(null)}
              className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700 flex-shrink-0"
              title="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* PDF Viewer Toolbar */}
          <div className="bg-[#383838] border-b border-gray-700 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-300">1 / 1</span>
              <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-300">100%</span>
              <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#2c2c2c]">
            <div className="max-w-3xl mx-auto">
              {/* PDF Page Mock */}
              <div className="bg-white shadow-2xl rounded-sm p-12">
                <div className="space-y-4">
                  {/* Document Title */}
                  <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-gray-900">BSA/AML Compliance Policy</h1>
                    <p className="text-sm text-gray-600 mt-2">Internal Policy Document • Revision 2025-02</p>
                  </div>

                  {/* Context Section */}
                  {activeCitation.context && (
                    <div className="text-sm text-gray-700 leading-relaxed mb-6">
                      <p>{activeCitation.context}</p>
                    </div>
                  )}

                  {/* Highlighted Section */}
                  {activeCitation.highlightedText && (
                    <div className="bg-yellow-200 border-l-4 border-yellow-500 p-6 my-6">
                      <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {activeCitation.highlightedText}
                      </p>
                    </div>
                  )}

                  {/* Description fallback */}
                  {!activeCitation.highlightedText && activeCitation.description && (
                    <div className="bg-gray-100 border-l-4 border-gray-400 p-6 my-6">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {activeCitation.description}
                      </p>
                    </div>
                  )}

                  {/* Additional Context Text (simulated PDF content) */}
                  <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                    <p>
                      The implementation of these risk categorization criteria ensures consistent application across all 
                      customer relationships and facilitates appropriate allocation of monitoring resources. All customer 
                      relationships must be reviewed and classified within 30 days of account opening.
                    </p>
                    <p>
                      Annual reviews of customer risk classifications are required, with more frequent reviews triggered 
                      by significant changes in transaction patterns, business operations, or geographic scope. Enhanced 
                      due diligence procedures must be applied to all customers classified as High Risk.
                    </p>
                    <p className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                      Effective Date: January 1, 2025 | Next Review: December 31, 2025 | Document ID: BSA-AML-2025-001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}