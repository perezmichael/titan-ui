import { useState, useRef } from 'react';
import { ArrowLeft, Send, Upload, FileText, Pencil, Info, X, Sparkles } from 'lucide-react';
import type { SelectedBorrower } from '../CommercialLendingWorkspace';
import { ChatMessage } from '../ChatMessage';
import { WorkflowPanel } from './WorkflowPanel';

interface BorrowerDealViewProps {
  borrower: SelectedBorrower;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    id: string;
    documentName: string;
    pageNumber: number;
    highlightedText: string;
    context: string;
  }[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  scope: 'borrower' | 'facility';
  facilityId?: string;
}

interface AuditEntry {
  timestamp: string;
  user?: string;
  source: string;
  value: string;
  page?: string;
  section?: string;
}

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  sourceDoc: string;
  page?: string;
  section?: string;
  verified: boolean;
  category: string;
  fieldType: 'text' | 'date' | 'dropdown' | 'number';
  dropdownOptions?: string[];
  auditTrail: AuditEntry[];
  scope: 'borrower' | 'facility';
  facilityId?: string;
}

interface KnowledgeBaseDoc {
  id: string;
  title: string;
  type: string;
}

export function BorrowerDealView({ borrower, onBack }: BorrowerDealViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I can help you analyze ${borrower.name}'s loan documentation and financial data. Ask me about credit agreements, appraisals, financial statements, or any other deal documents.`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFieldForAudit, setSelectedFieldForAudit] = useState<string | null>(null);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editSourceDoc, setEditSourceDoc] = useState<string>('');
  
  // Header edit states
  const [editedName, setEditedName] = useState(borrower.name);
  const [editedSummary, setEditedSummary] = useState('Vero Fiber Networks, LLC is a leading provider of fiber-optic communications services to the enterprise and wholesale markets. The company provides fiber-optic connectivity, network design and implementation, and network management.');
  
  const [isEditingRiskRating, setIsEditingRiskRating] = useState(false);
  const [editedRiskRating, setEditedRiskRating] = useState<number>(2);
  
  // Header fields with audit trails
  const [headerFields, setHeaderFields] = useState<Array<{
    id: string;
    label: string;
    value: string;
    auditTrail: Array<{
      timestamp: string;
      action: 'extracted' | 'edited';
      user?: string;
      sourceDoc?: string;
      page?: string;
      value: string;
    }>;
  }>>([
    { 
      id: 'borrower-name', 
      label: 'Borrower Name', 
      value: 'VFN Holdings Inc', 
      auditTrail: [
        { timestamp: '03/10/2026 9:10 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '1', value: 'VFN Holdings Inc' }
      ] 
    },
    { 
      id: 'business-description', 
      label: 'Business Description', 
      value: 'Vero Fiber Networks, LLC is a leading provider of fiber-optic communications services to the enterprise and wholesale markets. The company provides fiber-optic connectivity, network design and implementation, and network management.', 
      auditTrail: [
        { timestamp: '03/10/2026 9:12 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '2', value: 'Vero Fiber Networks, LLC is a leading provider of fiber-optic communications services to the enterprise and wholesale markets. The company provides fiber-optic connectivity, network design and implementation, and network management.' }
      ] 
    }
  ]);

  // Deal data fields with audit trails
  interface DealField {
    id: string;
    label: string;
    value: string;
    auditTrail: {
      timestamp: string;
      action: 'extracted' | 'edited';
      user?: string;
      sourceDoc?: string;
      page?: string;
      value: string;
    }[];
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const [dealFields, setDealFields] = useState<DealField[]>([
    { id: 'transaction-type', label: 'Transaction Type', value: 'Modification/Extension', auditTrail: [{ timestamp: '03/10/2026 9:15 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '1', value: 'Modification/Extension' }] },
    { id: 'naics-code', label: 'NAICS Code', value: '517110', auditTrail: [{ timestamp: '03/10/2026 9:15 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '2', value: '517110' }] },
    { id: 'sponsor-name', label: 'Sponsor Name', value: 'None', auditTrail: [{ timestamp: '03/10/2026 9:15 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '2', value: 'None' }] },
    { id: 'facility-type', label: 'Facility Type', value: 'Development Line of Credit (DLOC), Revolving Line of Credit (Revolver), Delayed Draw Term Loan (DDTL)', auditTrail: [{ timestamp: '03/10/2026 9:16 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '3', value: 'Development Line of Credit (DLOC), Revolving Line of Credit (Revolver), Delayed Draw Term Loan (DDTL)' }] },
    { id: 'loan-term', label: 'Loan Term', value: '60 months', auditTrail: [{ timestamp: '03/10/2026 9:16 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '3', value: '60 months' }] },
    { id: 'loan-maturity-date', label: 'Loan Maturity Date', value: '9/20/2026', auditTrail: [{ timestamp: '03/10/2026 9:16 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '3', value: '9/20/2026' }] },
    { id: 'amortization-structure', label: 'Amortization Structure', value: 'I/O then 25-year amortization', auditTrail: [{ timestamp: '03/10/2026 9:17 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '3', value: 'I/O then 25-year amortization' }] },
    { id: 'syndicated', label: 'Syndicated', value: 'No', auditTrail: [{ timestamp: '03/10/2026 9:17 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '4', value: 'No' }] },
    { id: 'arranger-name', label: 'Arranger Name', value: 'Hancock Whitney', auditTrail: [{ timestamp: '03/10/2026 9:17 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '4', value: 'Hancock Whitney' }] },
    { id: 'interest-rate', label: 'Interest Rate', value: 'SOFR + 3750 bps', auditTrail: [{ timestamp: '03/10/2026 9:18 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '3', value: 'SOFR + 3750 bps' }] },
    { id: 'pricing-grid-present', label: 'Pricing Grid Present', value: 'Yes', auditTrail: [{ timestamp: '03/10/2026 9:18 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '4', value: 'Yes' }] },
    { id: 'revenue-most-recent', label: 'Revenue (Most Recent)', value: formatCurrency(32021500000), auditTrail: [{ timestamp: '03/10/2026 9:19 AM', action: 'extracted', sourceDoc: 'VFN_Financials_2025.pdf', page: '5', value: formatCurrency(32021500000) }] },
    { id: 'ebitda-most-recent', label: 'EBITDA (Most Recent)', value: formatCurrency(1136500000), auditTrail: [{ timestamp: '03/10/2026 9:19 AM', action: 'extracted', sourceDoc: 'VFN_Financials_2025.pdf', page: '5', value: formatCurrency(1136500000) }] },
    { id: 'total-funded-debt', label: 'Total Funded Debt', value: formatCurrency(62500000), auditTrail: [{ timestamp: '03/10/2026 9:20 AM', action: 'extracted', sourceDoc: 'VFN_Financials_2025.pdf', page: '7', value: formatCurrency(62500000) }] },
    { id: 'tangible-net-worth', label: 'Tangible Net Worth', value: formatCurrency(1000000000), auditTrail: [{ timestamp: '03/10/2026 9:20 AM', action: 'extracted', sourceDoc: 'VFN_Financials_2025.pdf', page: '6', value: formatCurrency(1000000000) }] },
    { id: 'leverage-ratio', label: 'Leverage Ratio', value: '5.5', auditTrail: [{ timestamp: '03/10/2026 9:21 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '8', value: '5.5' }] },
    { id: 'coverage-ratio-actual', label: 'Coverage Ratio (Actual)', value: '1.43', auditTrail: [{ timestamp: '03/10/2026 9:21 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '8', value: '1.43' }] },
    { id: 'financial-statement-quality', label: 'Financial Statement Quality', value: 'CPA Audited', auditTrail: [{ timestamp: '03/10/2026 9:22 AM', action: 'extracted', sourceDoc: 'VFN_Financials_2025.pdf', page: '1', value: 'CPA Audited' }] },
    { id: 'revenue-model-type', label: 'Revenue Model Type', value: 'C&I General', auditTrail: [{ timestamp: '03/10/2026 9:22 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '2', value: 'C&I General' }] },
    { id: 'raroc', label: 'RAROC', value: '0.688%', auditTrail: [{ timestamp: '03/10/2026 9:23 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '9', value: '0.688%' }] },
    { id: 'hlt-exception', label: 'HLT Exception', value: 'No', auditTrail: [{ timestamp: '03/10/2026 9:23 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '6', value: 'No' }] },
    { id: 'primary-covenant-type', label: 'Primary Covenant Type', value: 'Minimum DSCR', auditTrail: [{ timestamp: '03/10/2026 9:24 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '5', value: 'Minimum DSCR' }] },
    { id: 'primary-covenant-threshold', label: 'Primary Covenant Threshold', value: '1.25', auditTrail: [{ timestamp: '03/10/2026 9:24 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '5', value: '1.25' }] },
    { id: 'collateral-description', label: 'Collateral Description', value: 'First lien on all assets of borrower and guarantors', auditTrail: [{ timestamp: '03/10/2026 9:25 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '6', value: 'First lien on all assets of borrower and guarantors' }] },
    { id: 'lien-position', label: 'Lien Position', value: '1st', auditTrail: [{ timestamp: '03/10/2026 9:25 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '6', value: '1st' }] },
    { id: 'guarantor-names', label: 'Guarantor Names', value: 'Vero Fiber Networks, LLC', auditTrail: [{ timestamp: '03/10/2026 9:26 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '7', value: 'Vero Fiber Networks, LLC' }] },
    { id: 'critical-exception-present', label: 'Critical Exception Present', value: 'No', auditTrail: [{ timestamp: '03/10/2026 9:26 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '6', value: 'No' }] },
    { id: 'critical-exception-summary', label: 'Critical Exception Summary', value: 'None', auditTrail: [{ timestamp: '03/10/2026 9:26 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '6', value: 'None' }] },
    { id: 'transaction-purpose', label: 'Transaction Purpose', value: 'Construction / Development', auditTrail: [{ timestamp: '03/10/2026 9:27 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '1', value: 'Construction / Development' }] },
    { id: 'primary-repayment-source', label: 'Primary Repayment Source', value: 'Operating Cash Flow', auditTrail: [{ timestamp: '03/10/2026 9:27 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '5', value: 'Operating Cash Flow' }] },
    { id: 'underwriter-recommendation', label: 'Underwriter Recommendation', value: 'Approve — Risk Rating 4 (Satisfactory)', auditTrail: [{ timestamp: '03/10/2026 9:28 AM', action: 'extracted', sourceDoc: 'VFN_Credit_Memo_2026.pdf', page: '9', value: 'Approve — Risk Rating 4 (Satisfactory)' }] },
  ]);

  const handleFieldClick = (fieldId: string) => {
    setSelectedFieldForAudit(fieldId);
    setEditingFieldId(null);
  };

  const handleEditFieldValue = (fieldId: string) => {
    // Check both header fields and deal fields
    const headerField = headerFields.find(f => f.id === fieldId);
    const dealField = dealFields.find(f => f.id === fieldId);
    const field = headerField || dealField;
    
    if (field) {
      setEditingFieldId(fieldId);
      setEditValue(field.value);
    }
  };

  const handleSaveFieldEdit = (fieldId: string) => {
    if (editValue.trim() === '') return;

    const timestamp = new Date().toLocaleString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const auditEntry = {
      timestamp,
      action: 'edited' as const,
      user: 'Matthew Clemens',
      value: editValue
    };

    // Update header fields if it's a header field
    setHeaderFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          value: editValue,
          auditTrail: [...field.auditTrail, auditEntry]
        };
      }
      return field;
    }));

    // Update deal fields if it's a deal field
    setDealFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          value: editValue,
          auditTrail: [...field.auditTrail, auditEntry]
        };
      }
      return field;
    }));

    setEditingFieldId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
    setEditValue('');
  };

  const facilities = borrower.facilities || [];
  
  // Account/Facility selection - default to first loan facility
  const loanFacilities = facilities.filter(f => f.loanType?.toLowerCase().includes('loan'));
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(loanFacilities[0]?.id || facilities[0]?.id || '');
  const currentFacility = facilities.find(f => f.id === selectedFacilityId) || loanFacilities[0] || facilities[0];

  // Calculate relationship totals
  const totalLoans = facilities.reduce((sum, fac) => {
    if (fac.loanType?.toLowerCase().includes('loan')) {
      return sum + fac.balance;
    }
    return sum;
  }, 0);

  const totalDeposits = facilities.reduce((sum, fac) => {
    if (fac.loanType?.toLowerCase().includes('deposit')) {
      return sum + fac.balance;
    }
    return sum;
  }, 0);

  const totalExposure = totalLoans - totalDeposits;

  const handleStartWorkflow = (workflowId: string, stepNumber?: number) => {
    // Generate workflow initiation message
    const workflowMessages: Record<string, string> = {
      'deal-qa': `I'll guide you through the Deal QA workflow for ${borrower.name}. This comprehensive quality assurance review will verify all loan documentation and data extraction across 7 steps.\n\n**Step 1: Verify Borrower & Deal Structure**\n\nLet's start by confirming the basic deal information:\n\n1. Borrower legal name: **${headerFields.find(f => f.id === 'borrower-name')?.value}**\n2. Transaction type: **${dealFields.find(f => f.id === 'transaction-type')?.value}**\n3. Deal structure includes:\n   ${facilities.map(f => `- ${f.loanType}: ${formatCurrency(f.commitment)}`).join('\n   ')}\n\nI've verified the borrower name appears consistent across the available documents. Would you like me to proceed with detailed verification of the facility structure and guarantors?`,
      
      'annual-review': `I'll guide you through the Annual Review workflow for ${borrower.name}. This systematic credit review will assess ongoing creditworthiness, covenant compliance, and risk rating across 8 comprehensive steps.\n\n**Step 1: Collect & Verify Current Financials**\n\nLet's begin by verifying the financial statements on file:\n\n1. Most recent financials: **Financial Statements Q4 2024.pdf** (uploaded 01/15/2025)\n2. Financial statement quality: **${dealFields.find(f => f.id === 'financial-statement-quality')?.value}**\n3. Key metrics extracted:\n   - Revenue (TTM): **${dealFields.find(f => f.id === 'revenue-most-recent')?.value}**\n   - EBITDA (TTM): **${dealFields.find(f => f.id === 'ebitda-most-recent')?.value}**\n\nThe financial statements appear current and meet the required quality standard. Shall I proceed with the detailed financial analysis and trend comparison?`
    };

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: workflowMessages[workflowId] || 'Starting workflow...',
      timestamp: new Date(),
    };

    setMessages([...messages, assistantMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Based on the Credit Agreement for ${borrower.name}, the DSCR covenant requires a minimum of 1.25x. The current DSCR as of 12/31/2024 is 1.89x, which exceeds the required threshold. This is calculated using Net Cash Flow Before Debt Service of $7,850,000 divided by Total Debt Service of $4,150,000.`,
      timestamp: new Date(),
      sources: [
        {
          id: '1',
          documentName: 'Annual Review 2024.pdf',
          pageNumber: 8,
          highlightedText: 'The Debt Service Coverage Ratio (DSCR) as of December 31, 2024, stands at 1.89x, calculated based on Net Cash Flow Before Debt Service of $7,850,000 divided by Total Debt Service of $4,150,000. This ratio exceeds the minimum covenant requirement of 1.25x as specified in Section 6.11 of the Credit Agreement.',
          context: 'Section 4.2 - Financial Performance Analysis. The borrower has demonstrated strong operational performance throughout 2024, with consistent cash flow generation supporting debt service obligations. Key performance metrics include...'
        }
      ]
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInputValue('');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleEditField = (fieldId: string) => {
    const field = extractedFields.find(f => f.id === fieldId);
    if (field) {
      setEditingFieldId(fieldId);
      setEditValue(field.value);
      setEditSourceDoc(field.sourceDoc);
    }
  };

  const handleEditHeader = () => {
    setIsEditingHeader(!isEditingHeader);
    if (!isEditingHeader) {
      setEditedName(borrower.name);
    }
  };

  const handleSaveHeader = () => {
    setIsEditingHeader(false);
    console.log('Saved:', { editedName, editedSummary });
  };

  const handleCancelHeader = () => {
    setIsEditingHeader(false);
    setEditedName(borrower.name);
    setEditedSummary('Vero Fiber Networks, LLC is a leading provider of fiber-optic communications services to the enterprise and wholesale markets. The company provides fiber-optic connectivity, network design and implementation, and network management.');
  };

  const documents: Document[] = [
    { id: '1', name: 'Credit Agreement.pdf', type: 'Credit Agreement', uploadDate: '12/15/2024', size: '2.4 MB', scope: 'facility', facilityId: 'AXM-2024-001' },
    { id: '2', name: 'Loan Approval Form.pdf', type: 'Loan Approval', uploadDate: '12/10/2024', size: '856 KB', scope: 'facility', facilityId: 'AXM-2024-001' },
    { id: '3', name: 'Appraisal Report.pdf', type: 'Appraisal', uploadDate: '11/20/2024', size: '5.2 MB', scope: 'borrower' },
    { id: '4', name: 'Financial Statements Q4 2024.pdf', type: 'Financial', uploadDate: '01/15/2025', size: '1.1 MB', scope: 'borrower' },
    { id: '5', name: 'Annual Review 2024.pdf', type: 'Annual Review', uploadDate: '12/31/2024', size: '3.8 MB', scope: 'borrower' },
    { id: '6', name: 'Insurance Certificate.pdf', type: 'Insurance', uploadDate: '01/01/2025', size: '324 KB', scope: 'borrower' },
    { id: '7', name: 'Environmental Report.pdf', type: 'Environmental', uploadDate: '11/15/2024', size: '1.8 MB', scope: 'borrower' }
  ];

  const extractedFields: ExtractedField[] = [
    // Facility-level fields for 20240001-001 (Senior Loan) - VFN Holdings Inc facility id: '1'
    { id: '1', label: 'Loan Amount', value: '$10,000,000', sourceDoc: 'Credit Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '12/15/2024 2:30 PM', source: 'Credit Agreement', value: '$10,000,000', page: '3' }], scope: 'facility', facilityId: '1' },
    { id: '2', label: 'Interest Rate', value: 'Term SOFR + 3.50%', sourceDoc: 'Credit Agreement', page: '5', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '12/15/2024 2:31 PM', source: 'Credit Agreement', value: 'Term SOFR + 3.50%', page: '5' }], scope: 'facility', facilityId: '1' },
    { id: '3', label: 'Maturity Date', value: '12/15/2027', sourceDoc: 'Credit Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '12/15/2024 2:30 PM', source: 'Credit Agreement', value: '12/15/2027', page: '3' }], scope: 'facility', facilityId: '1' },
    { id: '4', label: 'Payment Frequency', value: 'Monthly', sourceDoc: 'Credit Agreement', page: '6', verified: true, category: 'Loan Terms', fieldType: 'dropdown', dropdownOptions: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'], auditTrail: [{ timestamp: '12/15/2024 2:32 PM', source: 'Credit Agreement', value: 'Monthly', page: '6' }], scope: 'facility', facilityId: '1' },
    
    { id: '5', label: 'DSCR Covenant', value: 'Min 1.25x', sourceDoc: 'Credit Agreement', page: '18', section: 'Section 6.12', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '12/15/2024 2:35 PM', source: 'Credit Agreement', value: 'Min 1.25x', page: '18', section: 'Section 6.12' }], scope: 'facility', facilityId: '1' },
    { id: '6', label: 'LTV Covenant', value: 'Max 65%', sourceDoc: 'Credit Agreement', page: '19', section: 'Section 6.13', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '12/15/2024 2:36 PM', source: 'Credit Agreement', value: 'Max 65%', page: '19', section: 'Section 6.13' }], scope: 'facility', facilityId: '1' },
    { id: '7', label: 'Debt Yield Covenant', value: 'Min 12%', sourceDoc: 'Credit Agreement', page: '19', section: 'Section 6.14', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '12/15/2024 2:37 PM', source: 'Credit Agreement', value: 'Min 12%', page: '19', section: 'Section 6.14' }], scope: 'facility', facilityId: '1' },
    
    // Facility-level fields for 20240002-001 (LOC) - Generic facility id: 'AXM-2024-002'
    { id: '101', label: 'Loan Amount', value: '$2,000,000', sourceDoc: 'LOC Agreement', page: '2', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '06/10/2024 10:15 AM', source: 'LOC Agreement', value: '$2,000,000', page: '2' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    { id: '102', label: 'Interest Rate', value: 'Prime + 1.50%', sourceDoc: 'LOC Agreement', page: '4', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '06/10/2024 10:16 AM', source: 'LOC Agreement', value: 'Prime + 1.50%', page: '4' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    { id: '103', label: 'Maturity Date', value: '06/10/2025', sourceDoc: 'LOC Agreement', page: '2', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '06/10/2024 10:15 AM', source: 'LOC Agreement', value: '06/10/2025', page: '2' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    { id: '104', label: 'Payment Frequency', value: 'Interest Only - Monthly', sourceDoc: 'LOC Agreement', page: '5', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '06/10/2024 10:17 AM', source: 'LOC Agreement', value: 'Interest Only - Monthly', page: '5' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    
    { id: '105', label: 'Minimum EBITDA', value: '$5,000,000', sourceDoc: 'LOC Agreement', page: '12', section: 'Section 5.8', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '06/10/2024 10:20 AM', source: 'LOC Agreement', value: '$5,000,000', page: '12', section: 'Section 5.8' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    { id: '106', label: 'Current Ratio', value: 'Min 1.5:1', sourceDoc: 'LOC Agreement', page: '13', section: 'Section 5.9', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '06/10/2024 10:21 AM', source: 'LOC Agreement', value: 'Min 1.5:1', page: '13', section: 'Section 5.9' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    { id: '107', label: 'Net Worth Covenant', value: 'Min $15,000,000', sourceDoc: 'LOC Agreement', page: '13', section: 'Section 5.10', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '06/10/2024 10:22 AM', source: 'LOC Agreement', value: 'Min $15,000,000', page: '13', section: 'Section 5.10' }], scope: 'facility', facilityId: 'AXM-2024-002' },
    
    // Facility-level fields for 20230045-002 (Equipment Loan) - Generic facility id: 'AXM-2023-045'
    { id: '201', label: 'Loan Amount', value: '$1,500,000', sourceDoc: 'Equipment Loan Agreement', page: '1', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '03/20/2023 2:45 PM', source: 'Equipment Loan Agreement', value: '$1,500,000', page: '1' }], scope: 'facility', facilityId: 'AXM-2023-045' },
    { id: '202', label: 'Interest Rate', value: '6.75% Fixed', sourceDoc: 'Equipment Loan Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '03/20/2023 2:46 PM', source: 'Equipment Loan Agreement', value: '6.75% Fixed', page: '3' }], scope: 'facility', facilityId: 'AXM-2023-045' },
    { id: '203', label: 'Maturity Date', value: '03/20/2028', sourceDoc: 'Equipment Loan Agreement', page: '1', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '03/20/2023 2:45 PM', source: 'Equipment Loan Agreement', value: '03/20/2028', page: '1' }], scope: 'facility', facilityId: 'AXM-2023-045' },
    { id: '204', label: 'Payment Frequency', value: 'Monthly', sourceDoc: 'Equipment Loan Agreement', page: '4', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '03/20/2023 2:47 PM', source: 'Equipment Loan Agreement', value: 'Monthly', page: '4' }], scope: 'facility', facilityId: 'AXM-2023-045' },
    
    { id: '205', label: 'Equipment Value Maintenance', value: 'Min 120% of Outstanding Balance', sourceDoc: 'Equipment Loan Agreement', page: '8', section: 'Section 4.2', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '03/20/2023 2:50 PM', source: 'Equipment Loan Agreement', value: 'Min 120% of Outstanding Balance', page: '8', section: 'Section 4.2' }], scope: 'facility', facilityId: 'AXM-2023-045' },
    { id: '206', label: 'Insurance Requirement', value: 'Full Replacement Value', sourceDoc: 'Equipment Loan Agreement', page: '9', section: 'Section 4.5', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '03/20/2023 2:51 PM', source: 'Equipment Loan Agreement', value: 'Full Replacement Value', page: '9', section: 'Section 4.5' }], scope: 'facility', facilityId: 'AXM-2023-045' },
    
    // Facility-level fields for GH3 Cler SNU - 20230045-001 (Senior Loan) - facility id: '2'
    { id: '301', label: 'Loan Amount', value: '$5,000,000', sourceDoc: 'CRE Credit Agreement', page: '2', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '08/25/2023 11:30 AM', source: 'CRE Credit Agreement', value: '$5,000,000', page: '2' }], scope: 'facility', facilityId: '2' },
    { id: '302', label: 'Interest Rate', value: '5.68% Fixed', sourceDoc: 'CRE Credit Agreement', page: '4', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '08/25/2023 11:31 AM', source: 'CRE Credit Agreement', value: '5.68% Fixed', page: '4' }], scope: 'facility', facilityId: '2' },
    { id: '303', label: 'Maturity Date', value: '08/30/2026', sourceDoc: 'CRE Credit Agreement', page: '2', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '08/25/2023 11:30 AM', source: 'CRE Credit Agreement', value: '08/30/2026', page: '2' }], scope: 'facility', facilityId: '2' },
    { id: '304', label: 'Payment Frequency', value: 'Monthly', sourceDoc: 'CRE Credit Agreement', page: '5', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '08/25/2023 11:32 AM', source: 'CRE Credit Agreement', value: 'Monthly', page: '5' }], scope: 'facility', facilityId: '2' },
    
    { id: '305', label: 'DSCR Covenant', value: 'Min 1.20x', sourceDoc: 'CRE Credit Agreement', page: '15', section: 'Section 5.8', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '08/25/2023 11:35 AM', source: 'CRE Credit Agreement', value: 'Min 1.20x', page: '15', section: 'Section 5.8' }], scope: 'facility', facilityId: '2' },
    { id: '306', label: 'LTV Covenant', value: 'Max 70%', sourceDoc: 'CRE Credit Agreement', page: '15', section: 'Section 5.9', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '08/25/2023 11:36 AM', source: 'CRE Credit Agreement', value: 'Max 70%', page: '15', section: 'Section 5.9' }], scope: 'facility', facilityId: '2' },
    { id: '307', label: 'Occupancy Requirement', value: 'Min 85%', sourceDoc: 'CRE Credit Agreement', page: '16', section: 'Section 5.11', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '08/25/2023 11:37 AM', source: 'CRE Credit Agreement', value: 'Min 85%', page: '16', section: 'Section 5.11' }], scope: 'facility', facilityId: '2' },
    
    // Facility-level fields for GH3 Cler SNU - 20240112-001 (RLOC) - facility id: '3'
    { id: '401', label: 'Loan Amount', value: '$500,000', sourceDoc: 'RLOC Agreement', page: '1', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '02/10/2024 9:20 AM', source: 'RLOC Agreement', value: '$500,000', page: '1' }], scope: 'facility', facilityId: '3' },
    { id: '402', label: 'Interest Rate', value: 'Prime + 1.00%', sourceDoc: 'RLOC Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '02/10/2024 9:21 AM', source: 'RLOC Agreement', value: 'Prime + 1.00%', page: '3' }], scope: 'facility', facilityId: '3' },
    { id: '403', label: 'Maturity Date', value: '02/15/2027', sourceDoc: 'RLOC Agreement', page: '1', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '02/10/2024 9:20 AM', source: 'RLOC Agreement', value: '02/15/2027', page: '1' }], scope: 'facility', facilityId: '3' },
    { id: '404', label: 'Payment Frequency', value: 'Interest Only - Monthly', sourceDoc: 'RLOC Agreement', page: '4', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '02/10/2024 9:22 AM', source: 'RLOC Agreement', value: 'Interest Only - Monthly', page: '4' }], scope: 'facility', facilityId: '3' },
    
    { id: '405', label: 'Annual Revenue Minimum', value: '$3,000,000', sourceDoc: 'RLOC Agreement', page: '8', section: 'Section 4.2', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '02/10/2024 9:25 AM', source: 'RLOC Agreement', value: '$3,000,000', page: '8', section: 'Section 4.2' }], scope: 'facility', facilityId: '3' },
    { id: '406', label: 'Debt Service Coverage', value: 'Min 1.15x', sourceDoc: 'RLOC Agreement', page: '9', section: 'Section 4.3', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '02/10/2024 9:26 AM', source: 'RLOC Agreement', value: 'Min 1.15x', page: '9', section: 'Section 4.3' }], scope: 'facility', facilityId: '3' },
    
    // Facility-level fields for Fibernet - 20240078-001 (Senior Loan) - facility id: '4'
    { id: '501', label: 'Loan Amount', value: '$12,000,000', sourceDoc: 'Telecom Credit Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:15 PM', source: 'Telecom Credit Agreement', value: '$12,000,000', page: '3' }], scope: 'facility', facilityId: '4' },
    { id: '502', label: 'Interest Rate', value: 'Term SOFR + 4.25%', sourceDoc: 'Telecom Credit Agreement', page: '6', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:16 PM', source: 'Telecom Credit Agreement', value: 'Term SOFR + 4.25%', page: '6' }], scope: 'facility', facilityId: '4' },
    { id: '503', label: 'Maturity Date', value: '06/01/2028', sourceDoc: 'Telecom Credit Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '05/28/2024 2:15 PM', source: 'Telecom Credit Agreement', value: '06/01/2028', page: '3' }], scope: 'facility', facilityId: '4' },
    { id: '504', label: 'Payment Frequency', value: 'Monthly', sourceDoc: 'Telecom Credit Agreement', page: '7', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:17 PM', source: 'Telecom Credit Agreement', value: 'Monthly', page: '7' }], scope: 'facility', facilityId: '4' },
    
    { id: '505', label: 'Leverage Ratio', value: 'Max 4.0x', sourceDoc: 'Telecom Credit Agreement', page: '22', section: 'Section 6.10', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:20 PM', source: 'Telecom Credit Agreement', value: 'Max 4.0x', page: '22', section: 'Section 6.10' }], scope: 'facility', facilityId: '4' },
    { id: '506', label: 'Fixed Charge Coverage', value: 'Min 1.25x', sourceDoc: 'Telecom Credit Agreement', page: '23', section: 'Section 6.11', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:21 PM', source: 'Telecom Credit Agreement', value: 'Min 1.25x', page: '23', section: 'Section 6.11' }], scope: 'facility', facilityId: '4' },
    { id: '507', label: 'Minimum Liquidity', value: '$2,000,000', sourceDoc: 'Telecom Credit Agreement', page: '23', section: 'Section 6.12', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:22 PM', source: 'Telecom Credit Agreement', value: '$2,000,000', page: '23', section: 'Section 6.12' }], scope: 'facility', facilityId: '4' },
    
    // Facility-level fields for Fibernet - 20240079-001 (DDTL) - facility id: '5'
    { id: '601', label: 'Loan Amount', value: '$3,000,000', sourceDoc: 'DDTL Agreement', page: '2', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:45 PM', source: 'DDTL Agreement', value: '$3,000,000', page: '2' }], scope: 'facility', facilityId: '5' },
    { id: '602', label: 'Interest Rate', value: 'Term SOFR + 4.75%', sourceDoc: 'DDTL Agreement', page: '4', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:46 PM', source: 'DDTL Agreement', value: 'Term SOFR + 4.75%', page: '4' }], scope: 'facility', facilityId: '5' },
    { id: '603', label: 'Maturity Date', value: '06/01/2028', sourceDoc: 'DDTL Agreement', page: '2', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '05/28/2024 2:45 PM', source: 'DDTL Agreement', value: '06/01/2028', page: '2' }], scope: 'facility', facilityId: '5' },
    { id: '604', label: 'Payment Frequency', value: 'Quarterly', sourceDoc: 'DDTL Agreement', page: '5', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:47 PM', source: 'DDTL Agreement', value: 'Quarterly', page: '5' }], scope: 'facility', facilityId: '5' },
    
    { id: '605', label: 'CapEx Coverage Requirement', value: 'Min 1.1x of Annual CapEx', sourceDoc: 'DDTL Agreement', page: '12', section: 'Section 4.8', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:50 PM', source: 'DDTL Agreement', value: 'Min 1.1x of Annual CapEx', page: '12', section: 'Section 4.8' }], scope: 'facility', facilityId: '5' },
    { id: '606', label: 'Network Expansion Plan', value: 'Annual Report Required', sourceDoc: 'DDTL Agreement', page: '13', section: 'Section 4.9', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '05/28/2024 2:51 PM', source: 'DDTL Agreement', value: 'Annual Report Required', page: '13', section: 'Section 4.9' }], scope: 'facility', facilityId: '5' },
    
    // Facility-level fields for Fibernet - 20240215-001 (CapEx Loan) - facility id: 'fiber-capex'
    { id: '701', label: 'Loan Amount', value: '$3,000,000', sourceDoc: 'CapEx Loan Agreement', page: '1', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '11/15/2024 10:30 AM', source: 'CapEx Loan Agreement', value: '$3,000,000', page: '1' }], scope: 'facility', facilityId: 'fiber-capex' },
    { id: '702', label: 'Interest Rate', value: 'Term SOFR + 3.85%', sourceDoc: 'CapEx Loan Agreement', page: '3', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '11/15/2024 10:31 AM', source: 'CapEx Loan Agreement', value: 'Term SOFR + 3.85%', page: '3' }], scope: 'facility', facilityId: 'fiber-capex' },
    { id: '703', label: 'Maturity Date', value: '12/31/2029', sourceDoc: 'CapEx Loan Agreement', page: '1', verified: true, category: 'Loan Terms', fieldType: 'date', auditTrail: [{ timestamp: '11/15/2024 10:30 AM', source: 'CapEx Loan Agreement', value: '12/31/2029', page: '1' }], scope: 'facility', facilityId: 'fiber-capex' },
    { id: '704', label: 'Payment Frequency', value: 'Monthly', sourceDoc: 'CapEx Loan Agreement', page: '4', verified: true, category: 'Loan Terms', fieldType: 'text', auditTrail: [{ timestamp: '11/15/2024 10:32 AM', source: 'CapEx Loan Agreement', value: 'Monthly', page: '4' }], scope: 'facility', facilityId: 'fiber-capex' },
    
    { id: '705', label: 'Equipment Collateral Value', value: 'Min 130% of Outstanding Balance', sourceDoc: 'CapEx Loan Agreement', page: '9', section: 'Section 3.5', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '11/15/2024 10:35 AM', source: 'CapEx Loan Agreement', value: 'Min 130% of Outstanding Balance', page: '9', section: 'Section 3.5' }], scope: 'facility', facilityId: 'fiber-capex' },
    { id: '706', label: 'Quarterly Utilization Report', value: 'Required within 30 days of quarter end', sourceDoc: 'CapEx Loan Agreement', page: '10', section: 'Section 3.7', verified: true, category: 'Covenants', fieldType: 'text', auditTrail: [{ timestamp: '11/15/2024 10:36 AM', source: 'CapEx Loan Agreement', value: 'Required within 30 days of quarter end', page: '10', section: 'Section 3.7' }], scope: 'facility', facilityId: 'fiber-capex' },
    
    // Borrower-level fields
    { id: '8', label: 'Property Type', value: 'Data Center', sourceDoc: 'Appraisal Report', page: '1', verified: true, category: 'Collateral', fieldType: 'text', auditTrail: [{ timestamp: '11/20/2024 10:15 AM', source: 'Appraisal Report', value: 'Data Center', page: '1' }], scope: 'borrower' },
    { id: '9', label: 'Property Address', value: '123 Data Center Blvd, Atlanta, GA', sourceDoc: 'Appraisal Report', page: '1', verified: true, category: 'Collateral', fieldType: 'text', auditTrail: [{ timestamp: '11/20/2024 10:16 AM', source: 'Appraisal Report', value: '123 Data Center Blvd, Atlanta, GA', page: '1' }], scope: 'borrower' },
    { id: '10', label: 'Square Footage', value: '145,000 SF', sourceDoc: 'Appraisal Report', page: '2', verified: true, category: 'Collateral', fieldType: 'text', auditTrail: [{ timestamp: '11/20/2024 10:17 AM', source: 'Appraisal Report', value: '145,000 SF', page: '2' }], scope: 'borrower' },
    { id: '11', label: 'Appraisal Value', value: '$17,500,000', sourceDoc: 'Appraisal Report', page: '15', verified: true, category: 'Collateral', fieldType: 'text', auditTrail: [{ timestamp: '11/20/2024 10:18 AM', source: 'Appraisal Report', value: '$17,500,000', page: '15' }], scope: 'borrower' },
    { id: '12', label: 'Appraisal Date', value: '11/15/2024', sourceDoc: 'Appraisal Report', page: '1', verified: true, category: 'Collateral', fieldType: 'date', auditTrail: [{ timestamp: '11/20/2024 10:15 AM', source: 'Appraisal Report', value: '11/15/2024', page: '1' }], scope: 'borrower' },
    
    { id: '13', label: 'Revenue (TTM)', value: '$18,450,000', sourceDoc: 'Financial Statements Q4 2024', page: '2', verified: true, category: 'Financials', fieldType: 'text', auditTrail: [{ timestamp: '01/15/2025 3:45 PM', source: 'Financial Statements Q4 2024', value: '$18,450,000', page: '2' }], scope: 'borrower' },
    { id: '14', label: 'EBITDA (TTM)', value: '$8,200,000', sourceDoc: 'Financial Statements Q4 2024', page: '3', verified: true, category: 'Financials', fieldType: 'text', auditTrail: [{ timestamp: '01/15/2025 3:46 PM', source: 'Financial Statements Q4 2024', value: '$8,200,000', page: '3' }], scope: 'borrower' },
    { id: '15', label: 'Net Cash Flow', value: '$7,850,000', sourceDoc: 'Financial Statements Q4 2024', page: '4', verified: true, category: 'Financials', fieldType: 'text', auditTrail: [{ timestamp: '01/15/2025 3:47 PM', source: 'Financial Statements Q4 2024', value: '$7,850,000', page: '4' }], scope: 'borrower' },
    { id: '16', label: 'DSCR (Pre-Distribution)', value: '1.89x', sourceDoc: 'Annual Review 2024', page: '8', verified: true, category: 'Financials', fieldType: 'text', auditTrail: [{ timestamp: '12/31/2024 11:20 AM', source: 'Annual Review 2024', value: '1.89x', page: '8' }], scope: 'borrower' },
  ];

  // Define category order
  const categoryOrder = ['Loan Terms', 'Covenants', 'Collateral', 'Financials'];

  // Filter fields based on selected facility - show facility-specific fields + borrower-level fields
  const filteredFields = extractedFields.filter(field => 
    field.scope === 'borrower' || field.facilityId === selectedFacilityId
  );

  const groupedFields = filteredFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  // Sort categories by defined order
  const sortCategories = (entries: [string, ExtractedField[]][]) => {
    return entries.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a[0]);
      const indexB = categoryOrder.indexOf(b[0]);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  };

  // Show all documents (borrower-level and all facility-level)
  const filteredDocuments = documents;

  const knowledgeBaseDocs: KnowledgeBaseDoc[] = [
    { id: '1', title: 'Axiom Commercial Lending Policy', type: 'Policy' },
    { id: '2', title: 'Data Center Asset Class Guidelines', type: 'Guideline' },
    { id: '3', title: 'CRE Underwriting Standards', type: 'Standard' }
  ];

  const getRiskRatingBadgeClass = (rating: number) => {
    switch (rating) {
      case 1: return 'bg-green-50 text-green-900 border-green-200';
      case 2: return 'bg-green-50 text-green-700 border-green-200';
      case 3: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 4: return 'bg-orange-50 text-orange-700 border-orange-200';
      case 5: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'text-green-700 bg-green-50 border-green-200';
      case 2: return 'text-green-700 bg-green-50 border-green-200';
      case 3: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 4: return 'text-orange-700 bg-orange-50 border-orange-200';
      case 5: return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Back Button - Full Width */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Deal Intelligence Chat */}
        <div className="w-[500px] flex flex-col bg-white border-r border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#455a4f]" />
              <h2 className="text-base text-gray-900">Chat with {borrower.name}'s documents and data</h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.role}
                content={message.content}
                timestamp={message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                sources={message.sources}
                hasReactions={message.role === 'assistant'}
              />
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this borrower's documents..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => setInputValue('What is the current DSCR?')}
                className="text-xs px-2 py-1 text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Current DSCR
              </button>
              <button
                onClick={() => setInputValue('List all guarantors')}
                className="text-xs px-2 py-1 text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                List guarantors
              </button>
              <button
                onClick={() => setInputValue('What is the appraised value?')}
                className="text-xs px-2 py-1 text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Appraised value
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Borrower Dossier */}
        <div className="flex-1 flex flex-col bg-[#f5f5f3] relative">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
            <div className="mb-6">
              {/* Borrower Name with Edit/Audit Icons */}
              <div className="group flex items-start gap-2 mb-2">
                {editingFieldId === 'borrower-name' ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveFieldEdit('borrower-name');
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className="flex-1 px-2 py-1 text-xl border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveFieldEdit('borrower-name')}
                      className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl text-gray-900 flex-1">{headerFields.find(f => f.id === 'borrower-name')?.value}</h1>
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFieldValue('borrower-name');
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                        title="Edit borrower name"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldClick('borrower-name');
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                        title="View audit trail"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Business Description with Edit/Audit Icons */}
              <div className="group mb-4">
                {editingFieldId === 'business-description' ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      rows={3}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveFieldEdit('business-description')}
                        className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">
                      {headerFields.find(f => f.id === 'business-description')?.value}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFieldValue('business-description');
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                        title="Edit business description"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldClick('business-description');
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                        title="View audit trail"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                
                
                
                
              </div>
            </div>

            {/* Loan Summary */}
            <div className="mb-6">
              
              
            </div>

            {/* Deal Details */}
            <div className="bg-white border border-gray-200 mb-6">
              <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-900">Deal Details</h2>
              </div>
              <div className="px-4 py-4 space-y-3">
                {dealFields.map((field, index) => (
                  <div 
                    key={field.id}
                    className={`grid grid-cols-[200px_1fr] gap-4 text-sm ${index > 0 ? 'border-t border-gray-100 pt-3' : ''}`}
                  >
                    <div className="text-xs font-medium text-gray-600">{field.label}</div>
                    <div className="flex items-center justify-between group">
                      {editingFieldId === field.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveFieldEdit(field.id);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveFieldEdit(field.id)}
                            className="px-2 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-gray-900 flex-1">{field.value}</div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditFieldValue(field.id);
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                              title="Edit field"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFieldClick(field.id);
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                              title="View audit trail"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white border border-gray-200 mb-4">
              <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h2 className="text-sm font-medium text-gray-900">Documents ({filteredDocuments.length})</h2>
                <button
                  onClick={handleFileSelect}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    // Handle file selection
                    console.log('Files selected:', e.target.files);
                  }}
                />
              </div>

              <div
                className={`px-4 py-3 ${isDragging ? 'bg-blue-50' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {isDragging && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 bg-gray-50 mb-4">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drop files to upload</p>
                  </div>
                )}

                <div className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-4 h-4 text-gray-300" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{doc.name}</div>
                          <div className="text-xs text-gray-500">
                            {doc.uploadDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Relevant Knowledge Base Documents */}
            <div className="bg-white border border-gray-200">
              <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h2 className="text-sm font-medium text-gray-900">Relevant Knowledge Base Documents</h2>
                <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  + Add More
                </button>
              </div>

              <div className="px-4 py-3">
                <div className="space-y-2">
                  {knowledgeBaseDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <FileText className="w-4 h-4 text-gray-300" />
                      <div className="text-sm text-gray-900">{doc.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Side Panel - Fixed Overlay */}
          {selectedFieldForAudit && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setSelectedFieldForAudit(null)}
              />
              
              {/* Side Panel */}
              <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl z-50 flex flex-col">
                {(() => {
                  // Check both header fields and deal fields
                  const headerField = headerFields.find(f => f.id === selectedFieldForAudit);
                  const dealField = dealFields.find(f => f.id === selectedFieldForAudit);
                  const field = headerField || dealField;
                  if (!field) return null;
                  
                  return (
                    <>
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{field.label}</div>
                            <div className="text-sm font-medium text-gray-900">{field.value}</div>
                          </div>
                          <button
                            onClick={() => setSelectedFieldForAudit(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Audit Trail Content */}
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Audit Trail</h3>
                          <div className="space-y-4">
                            {[...field.auditTrail].reverse().map((entry, idx) => {
                              const isSystemUpdate = entry.action === 'extracted';
                              const actor = isSystemUpdate ? 'Titan system' : (entry.user || 'User');
                              const action = isSystemUpdate ? 'extracted value' : 'manually overrode to';
                              
                              return (
                                <div key={idx} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-transparent last:pb-0">
                                  {/* Timeline dot */}
                                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-900 border-2 border-white" />
                                  
                                  <div className="space-y-2">
                                    {/* Conversational description */}
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                      <span className="font-medium">{actor}</span> {action}{' '}
                                      <span className="font-semibold text-gray-900">{entry.value}</span>{' '}
                                      on <span className="font-medium">{entry.timestamp}</span>
                                    </div>

                                    {/* Source Document */}
                                    {entry.sourceDoc && (
                                      <div className="flex items-start gap-2 mt-2">
                                        <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                          <div className="text-xs text-gray-600">Source: {entry.sourceDoc}</div>
                                          {entry.page && (
                                            <div className="text-xs text-gray-400 mt-0.5">Page {entry.page}</div>
                                          )}
                                          {entry.section && (
                                            <div className="text-xs text-gray-400">Section: {entry.section}</div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
