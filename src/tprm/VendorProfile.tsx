import { useState, useRef } from 'react';
import { ArrowLeft, Send, Upload, FileText, CheckCircle, AlertCircle, Sparkles, X, Check, Pencil, Info, Clock, FolderOpen, ChevronDown } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';

interface VendorProfileProps {
  vendor: SelectedVendor;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  scope: 'vendor' | 'engagement';
  engagementId?: string;
  vendorId?: string;
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
  overwrittenBy?: string;
  overwrittenAt?: string;
  auditTrail: AuditEntry[];
  scope: 'vendor' | 'engagement';
  engagementId?: string;
}

interface KnowledgeBaseDoc {
  id: string;
  title: string;
  type: string;
}

export function VendorProfile({ vendor, onBack }: VendorProfileProps) {
  const [mobilePanelTab, setMobilePanelTab] = useState<'chat' | 'profile'>('profile');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'I can help you analyze this vendor\'s documentation. Ask me about contracts, SOC 2 reports, compliance documents, or any other files uploaded for CloudBank Solutions.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFieldForAudit, setSelectedFieldForAudit] = useState<string | null>(null);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editSourceDoc, setEditSourceDoc] = useState<string>('');
  
  // Multi-engagement support
  const [selectedEngagementId, setSelectedEngagementId] = useState(vendor.engagementId);
  
  // New engagement modal states
  const [showNewEngagementModal, setShowNewEngagementModal] = useState(false);
  const [newEngagementStep, setNewEngagementStep] = useState<'method' | 'upload'>('method');
  const [uploadedNewDocs, setUploadedNewDocs] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [isProcessingEngagement, setIsProcessingEngagement] = useState(false);
  const newEngFileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock engagements data
  const engagements = vendor.engagements || [
    { 
      id: '1', 
      engagementId: 'AXM-2024-001', 
      serviceDescription: 'Core Banking Platform',
      businessUnit: 'Retail Banking',
      serviceOwner: 'Sarah Chen',
      riskRating: 'High',
      irr: 'Critical' as 'Critical' | 'High' | 'Moderate' | 'Low',
      status: 'Active' as const
    },
    { 
      id: '2', 
      engagementId: 'AXM-2023-045', 
      serviceDescription: 'Payment Processing Services',
      businessUnit: 'Treasury',
      serviceOwner: 'Michael Torres',
      riskRating: 'Moderate',
      irr: 'High' as 'Critical' | 'High' | 'Moderate' | 'Low',
      status: 'Active' as const
    },
    { 
      id: '3', 
      engagementId: 'AXM-2022-112', 
      serviceDescription: 'Mobile Banking API',
      businessUnit: 'Digital',
      serviceOwner: 'Jessica Park',
      riskRating: 'Moderate',
      irr: 'Moderate' as 'Critical' | 'High' | 'Moderate' | 'Low',
      status: 'Renewal' as const
    },
  ];
  
  const currentEngagement = engagements.find(e => e.engagementId === selectedEngagementId) || engagements[0];
  
  // Header edit states
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editedName, setEditedName] = useState(vendor.name);
  const [editedSummary, setEditedSummary] = useState('CloudBank Solutions is a financial technology company that provides core banking infrastructure and payment processing services to regional banks and credit unions. For Axiom, they deliver a cloud-based core banking platform that powers our retail deposit accounts, payment processing, and transaction management systems. Their platform processes approximately 2.3M monthly transactions for our retail banking operations.');
  
  // Engagement field edit states
  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingBusinessUnit, setIsEditingBusinessUnit] = useState(false);
  const [isEditingServiceOwner, setIsEditingServiceOwner] = useState(false);
  const [isEditingIRR, setIsEditingIRR] = useState(false);
  const [editedService, setEditedService] = useState('');
  const [editedBusinessUnit, setEditedBusinessUnit] = useState('');
  const [editedServiceOwner, setEditedServiceOwner] = useState('');
  const [editedIRR, setEditedIRR] = useState<'Critical' | 'High' | 'Moderate' | 'Low'>('Moderate');

  const documents: Document[] = [
    // CloudBank Solutions - vendor level
    { id: 'irq-1', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '12/10/2023', size: '1.2 MB', scope: 'vendor', vendorId: '1' },
    { id: '1', name: 'Master Services Agreement.pdf', type: 'Contract', uploadDate: '1/15/2025', size: '2.4 MB', scope: 'engagement', engagementId: 'AXM-2024-001', vendorId: '1' },
    { id: '2', name: 'Data Processing Addendum.pdf', type: 'Contract', uploadDate: '1/15/2025', size: '890 KB', scope: 'engagement', engagementId: 'AXM-2024-001', vendorId: '1' },
    { id: '3', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '1/10/2025', size: '5.2 MB', scope: 'vendor', vendorId: '1' },
    { id: '4', name: 'Information Security Policy.pdf', type: 'Policy', uploadDate: '1/08/2025', size: '1.1 MB', scope: 'vendor', vendorId: '1' },
    { id: '5', name: 'Incident Response Plan.pdf', type: 'Policy', uploadDate: '1/08/2025', size: '780 KB', scope: 'vendor', vendorId: '1' },
    { id: '6', name: 'BitSight Report Q4 2024.pdf', type: 'Security Assessment', uploadDate: '1/05/2025', size: '450 KB', scope: 'vendor', vendorId: '1' },
    { id: '7', name: 'Certificate of Insurance.pdf', type: 'Insurance', uploadDate: '12/20/2024', size: '320 KB', scope: 'vendor', vendorId: '1' },
    { id: '8', name: 'Payment Services SOW.pdf', type: 'Contract', uploadDate: '3/10/2023', size: '1.8 MB', scope: 'engagement', engagementId: 'AXM-2023-045', vendorId: '1' },
    { id: '9', name: 'Mobile API Agreement.pdf', type: 'Contract', uploadDate: '8/15/2022', size: '2.1 MB', scope: 'engagement', engagementId: 'AXM-2022-112', vendorId: '1' },
    
    // SecureData Inc. (AXM-2024-012)
    { id: 'irq-2', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '12/15/2023', size: '980 KB', scope: 'vendor', vendorId: '2' },
    { id: 'doc-2-1', name: 'Document Management Services Agreement.pdf', type: 'Contract', uploadDate: '1/08/2024', size: '1.9 MB', scope: 'engagement', engagementId: 'AXM-2024-012', vendorId: '2' },
    { id: 'doc-2-2', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '1/10/2025', size: '4.8 MB', scope: 'vendor', vendorId: '2' },
    { id: 'doc-2-3', name: 'Data Privacy Policy.pdf', type: 'Policy', uploadDate: '12/20/2024', size: '890 KB', scope: 'vendor', vendorId: '2' },
    { id: 'doc-2-4', name: 'Business Continuity Plan.pdf', type: 'Policy', uploadDate: '11/15/2024', size: '1.2 MB', scope: 'vendor', vendorId: '2' },
    { id: 'doc-2-5', name: 'Professional Liability Insurance.pdf', type: 'Insurance', uploadDate: '1/01/2024', size: '425 KB', scope: 'vendor', vendorId: '2' },
    
    // PayTech Services (AXM-2023-087)
    { id: 'irq-3', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '7/20/2023', size: '1.1 MB', scope: 'vendor', vendorId: '3' },
    { id: 'doc-3-1', name: 'Payment Processing Agreement.pdf', type: 'Contract', uploadDate: '8/12/2023', size: '2.2 MB', scope: 'engagement', engagementId: 'AXM-2023-087', vendorId: '3' },
    { id: 'doc-3-2', name: 'PCI DSS Attestation of Compliance.pdf', type: 'Compliance', uploadDate: '12/10/2024', size: '2.8 MB', scope: 'vendor', vendorId: '3' },
    { id: 'doc-3-3', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '11/15/2024', size: '5.1 MB', scope: 'vendor', vendorId: '3' },
    { id: 'doc-3-4', name: 'Payment Security Standards.pdf', type: 'Policy', uploadDate: '10/05/2024', size: '950 KB', scope: 'vendor', vendorId: '3' },
    { id: 'doc-3-5', name: 'Cyber Liability Insurance.pdf', type: 'Insurance', uploadDate: '8/01/2023', size: '380 KB', scope: 'vendor', vendorId: '3' },
    { id: 'doc-3-6', name: 'Penetration Test Results 2024.pdf', type: 'Security Assessment', uploadDate: '9/20/2024', size: '1.8 MB', scope: 'vendor', vendorId: '3' },
    
    // DataAnalytics Pro (AXM-2024-034)
    { id: 'irq-4', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '2/20/2024', size: '920 KB', scope: 'vendor', vendorId: '4' },
    { id: 'doc-4-1', name: 'BI Analytics Platform Agreement.pdf', type: 'Contract', uploadDate: '3/15/2024', size: '1.7 MB', scope: 'engagement', engagementId: 'AXM-2024-034', vendorId: '4' },
    { id: 'doc-4-2', name: 'Data Processing Agreement.pdf', type: 'Contract', uploadDate: '3/15/2024', size: '780 KB', scope: 'engagement', engagementId: 'AXM-2024-034', vendorId: '4' },
    { id: 'doc-4-3', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '1/25/2025', size: '4.5 MB', scope: 'vendor', vendorId: '4' },
    { id: 'doc-4-4', name: 'Information Security Policy.pdf', type: 'Policy', uploadDate: '12/01/2024', size: '1.1 MB', scope: 'vendor', vendorId: '4' },
    { id: 'doc-4-5', name: 'Certificate of Insurance.pdf', type: 'Insurance', uploadDate: '3/01/2024', size: '340 KB', scope: 'vendor', vendorId: '4' },
    
    // OfficeSupply Direct (AXM-2024-045)
    { id: 'irq-5', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '3/10/2024', size: '850 KB', scope: 'vendor', vendorId: '5' },
    { id: 'doc-5-1', name: 'Office Supplies Master Agreement.pdf', type: 'Contract', uploadDate: '4/01/2024', size: '1.3 MB', scope: 'engagement', engagementId: 'AXM-2024-045', vendorId: '5' },
    { id: 'doc-5-2', name: 'Product Liability Insurance.pdf', type: 'Insurance', uploadDate: '4/01/2024', size: '295 KB', scope: 'vendor', vendorId: '5' },
    { id: 'doc-5-3', name: 'Vendor Code of Conduct.pdf', type: 'Policy', uploadDate: '3/20/2024', size: '520 KB', scope: 'vendor', vendorId: '5' },
    
    // CyberShield Security (AXM-2024-067)
    { id: 'irq-6', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '5/10/2024', size: '1.4 MB', scope: 'vendor', vendorId: '6' },
    { id: 'doc-6-1', name: 'Managed Security Services Agreement.pdf', type: 'Contract', uploadDate: '6/01/2024', size: '2.5 MB', scope: 'engagement', engagementId: 'AXM-2024-067', vendorId: '6' },
    { id: 'doc-6-2', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '12/15/2024', size: '5.8 MB', scope: 'vendor', vendorId: '6' },
    { id: 'doc-6-3', name: 'ISO 27001 Certificate.pdf', type: 'Compliance', uploadDate: '11/10/2024', size: '1.2 MB', scope: 'vendor', vendorId: '6' },
    { id: 'doc-6-4', name: 'Incident Response Procedures.pdf', type: 'Policy', uploadDate: '10/05/2024', size: '940 KB', scope: 'vendor', vendorId: '6' },
    { id: 'doc-6-5', name: 'Security Operations Policy.pdf', type: 'Policy', uploadDate: '9/15/2024', size: '1.1 MB', scope: 'vendor', vendorId: '6' },
    { id: 'doc-6-6', name: 'Cyber Insurance Policy.pdf', type: 'Insurance', uploadDate: '6/01/2024', size: '445 KB', scope: 'vendor', vendorId: '6' },
    { id: 'doc-6-7', name: 'Vulnerability Scan Report Q4 2024.pdf', type: 'Security Assessment', uploadDate: '1/05/2025', size: '680 KB', scope: 'vendor', vendorId: '6' },
    
    // CloudBackup Systems (AXM-2025-003)
    { id: 'irq-7', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '12/20/2024', size: '1.0 MB', scope: 'vendor', vendorId: '7' },
    { id: 'doc-7-1', name: 'Backup and DR Services Agreement.pdf', type: 'Contract', uploadDate: '1/15/2025', size: '2.0 MB', scope: 'engagement', engagementId: 'AXM-2025-003', vendorId: '7' },
    { id: 'doc-7-2', name: 'Service Level Agreement.pdf', type: 'Contract', uploadDate: '1/15/2025', size: '890 KB', scope: 'engagement', engagementId: 'AXM-2025-003', vendorId: '7' },
    { id: 'doc-7-3', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '1/08/2025', size: '4.9 MB', scope: 'vendor', vendorId: '7' },
    { id: 'doc-7-4', name: 'Data Recovery Plan.pdf', type: 'Policy', uploadDate: '12/15/2024', size: '1.3 MB', scope: 'vendor', vendorId: '7' },
    { id: 'doc-7-5', name: 'Business Interruption Insurance.pdf', type: 'Insurance', uploadDate: '1/01/2025', size: '375 KB', scope: 'vendor', vendorId: '7' },
    
    // Marketing Automation Co (AXM-2024-023)
    { id: 'irq-8', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '1/20/2024', size: '890 KB', scope: 'vendor', vendorId: '8' },
    { id: 'doc-8-1', name: 'Marketing Platform License Agreement.pdf', type: 'Contract', uploadDate: '2/10/2024', size: '1.6 MB', scope: 'engagement', engagementId: 'AXM-2024-023', vendorId: '8' },
    { id: 'doc-8-2', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '12/20/2024', size: '4.3 MB', scope: 'vendor', vendorId: '8' },
    { id: 'doc-8-3', name: 'Privacy Shield Certification.pdf', type: 'Compliance', uploadDate: '11/30/2024', size: '720 KB', scope: 'vendor', vendorId: '8' },
    { id: 'doc-8-4', name: 'Data Retention Policy.pdf', type: 'Policy', uploadDate: '10/15/2024', size: '650 KB', scope: 'vendor', vendorId: '8' },
    { id: 'doc-8-5', name: 'E&O Insurance Certificate.pdf', type: 'Insurance', uploadDate: '2/01/2024', size: '310 KB', scope: 'vendor', vendorId: '8' },
    
    // TechSupport Global (AXM-2024-019)
    { id: 'irq-9', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '12/28/2023', size: '950 KB', scope: 'vendor', vendorId: '9' },
    { id: 'doc-9-1', name: 'IT Help Desk Services Agreement.pdf', type: 'Contract', uploadDate: '1/20/2024', size: '1.8 MB', scope: 'engagement', engagementId: 'AXM-2024-019', vendorId: '9' },
    { id: 'doc-9-2', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '11/25/2024', size: '4.6 MB', scope: 'vendor', vendorId: '9' },
    { id: 'doc-9-3', name: 'ITIL Service Management Policy.pdf', type: 'Policy', uploadDate: '10/10/2024', size: '1.0 MB', scope: 'vendor', vendorId: '9' },
    { id: 'doc-9-4', name: 'Remote Access Security Policy.pdf', type: 'Policy', uploadDate: '9/05/2024', size: '820 KB', scope: 'vendor', vendorId: '9' },
    { id: 'doc-9-5', name: 'General Liability Insurance.pdf', type: 'Insurance', uploadDate: '1/01/2024', size: '365 KB', scope: 'vendor', vendorId: '9' },
    
    // Compliance Solutions Ltd (AXM-2024-008)
    { id: 'irq-10', name: 'IRQ - Initial Risk Questionnaire.pdf', type: 'Assessment', uploadDate: '12/05/2023', size: '1.3 MB', scope: 'vendor', vendorId: '10' },
    { id: 'doc-10-1', name: 'Compliance Software License Agreement.pdf', type: 'Contract', uploadDate: '1/08/2024', size: '2.1 MB', scope: 'engagement', engagementId: 'AXM-2024-008', vendorId: '10' },
    { id: 'doc-10-2', name: 'SOC 2 Type II Report 2024.pdf', type: 'SOC 2', uploadDate: '12/10/2024', size: '5.3 MB', scope: 'vendor', vendorId: '10' },
    { id: 'doc-10-3', name: 'ISO 27001 Certificate.pdf', type: 'Compliance', uploadDate: '11/05/2024', size: '980 KB', scope: 'vendor', vendorId: '10' },
    { id: 'doc-10-4', name: 'Regulatory Compliance Policy.pdf', type: 'Policy', uploadDate: '10/20/2024', size: '1.4 MB', scope: 'vendor', vendorId: '10' },
    { id: 'doc-10-5', name: 'Audit Procedures Manual.pdf', type: 'Policy', uploadDate: '9/15/2024', size: '1.1 MB', scope: 'vendor', vendorId: '10' },
    { id: 'doc-10-6', name: 'Professional Indemnity Insurance.pdf', type: 'Insurance', uploadDate: '1/01/2024', size: '395 KB', scope: 'vendor', vendorId: '10' },
  ];

  const extractedFields: ExtractedField[] = [
    // Contract fields (engagement-specific)
    { 
      id: 'c1', 
      label: 'Contract Execution Date', 
      value: 'January 15, 2024', 
      sourceDoc: 'Master Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-001',
      auditTrail: [
        { timestamp: '2/10/25 9:45 AM', source: 'Master Services Agreement.pdf', value: 'January 15, 2024' }
      ]
    },
    { 
      id: 'c2', 
      label: 'Term Length', 
      value: '36 months', 
      sourceDoc: 'Master Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-001',
      auditTrail: [
        { timestamp: '2/10/25 9:45 AM', source: 'Master Services Agreement.pdf', value: '36 months' }
      ]
    },
    { 
      id: 'c3', 
      label: 'Renewal Date', 
      value: 'January 15, 2027', 
      sourceDoc: 'Master Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-001',
      overwrittenBy: 'Tom Barr',
      overwrittenAt: '2/10/25 @ 10:15 AM',
      auditTrail: [
        { timestamp: '2/10/25 9:45 AM', source: 'Master Services Agreement.pdf', value: 'January 15, 2026' },
        { timestamp: '2/10/25 10:15 AM', user: 'Tom Barr', source: 'Master Services Agreement.pdf', value: 'January 15, 2027' }
      ]
    },
    { 
      id: 'c4', 
      label: 'Termination Notice Period', 
      value: '90 days prior to renewal', 
      sourceDoc: 'Master Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-001',
      auditTrail: [
        { timestamp: '2/10/25 9:45 AM', source: 'Master Services Agreement.pdf', value: '90 days prior to renewal' }
      ]
    },
    
    // SOC 2 fields (vendor-level)
    { 
      id: 's5', 
      label: 'Subservice Organizations', 
      value: 'AWS (Infrastructure), Cloudflare (CDN)', 
      sourceDoc: 'SOC 2 Type II Report 2024.pdf', 
      verified: false, 
      category: 'SOC 2',
      fieldType: 'text',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:46 AM', source: 'SOC 2 Type II Report 2024.pdf', value: 'AWS (Infrastructure), Cloudflare (CDN)' }
      ]
    },
    
    // Security & Compliance (vendor-level)
    { 
      id: 'sc1', 
      label: 'BitSight Score', 
      value: '740 / 900', 
      sourceDoc: 'BitSight Report Q4 2024.pdf', 
      verified: true, 
      category: 'Security',
      fieldType: 'text',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:47 AM', source: 'BitSight Report Q4 2024.pdf', value: '740 / 900' }
      ]
    },
    { 
      id: 'sc2', 
      label: 'RTO', 
      value: '4 hours', 
      sourceDoc: 'Incident Response Plan.pdf', 
      verified: false, 
      category: 'Security',
      fieldType: 'text',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:47 AM', source: 'Incident Response Plan.pdf', value: '4 hours' }
      ]
    },
    { 
      id: 'sc3', 
      label: 'RPO', 
      value: '1 hour', 
      sourceDoc: 'Incident Response Plan.pdf', 
      verified: false, 
      category: 'Security',
      fieldType: 'text',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:47 AM', source: 'Incident Response Plan.pdf', value: '1 hour' }
      ]
    },
    
    // Insurance (vendor-level)
    { 
      id: 'i1', 
      label: 'General Liability Coverage', 
      value: '$2,000,000', 
      sourceDoc: 'Certificate of Insurance.pdf', 
      verified: true, 
      category: 'Insurance',
      fieldType: 'text',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:48 AM', source: 'Certificate of Insurance.pdf', value: '$2,000,000' }
      ]
    },
    { 
      id: 'i2', 
      label: 'Cyber Liability Coverage', 
      value: '$10,000,000', 
      sourceDoc: 'Certificate of Insurance.pdf', 
      verified: true, 
      category: 'Insurance',
      fieldType: 'text',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:48 AM', source: 'Certificate of Insurance.pdf', value: '$10,000,000' }
      ]
    },
    { 
      id: 'i3', 
      label: 'Insurance Expiry', 
      value: 'December 31, 2025', 
      sourceDoc: 'Certificate of Insurance.pdf', 
      verified: true, 
      category: 'Insurance',
      fieldType: 'date',
      scope: 'vendor',
      auditTrail: [
        { timestamp: '2/10/25 9:48 AM', source: 'Certificate of Insurance.pdf', value: 'December 31, 2025' }
      ]
    },
    
    // Data & Privacy (engagement-specific)
    { 
      id: 'd1', 
      label: 'Data Types Handled', 
      value: 'PII, Financial Data, Transaction Records', 
      sourceDoc: 'Data Processing Addendum.pdf', 
      verified: false, 
      category: 'Data & Privacy',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-001',
      auditTrail: [
        { timestamp: '2/10/25 9:49 AM', source: 'Data Processing Addendum.pdf', value: 'PII, Financial Data, Transaction Records' }
      ]
    },
    { 
      id: 'd2', 
      label: '4th Party Providers', 
      value: 'AWS, Cloudflare, Stripe (payment processing)', 
      sourceDoc: 'SOC 2 Type II Report 2024.pdf', 
      verified: false, 
      category: 'Data & Privacy',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-001',
      auditTrail: [
        { timestamp: '2/10/25 9:46 AM', source: 'SOC 2 Type II Report 2024.pdf', value: 'AWS, Cloudflare, Stripe (payment processing)' }
      ]
    },

    // Contract fields for AXM-2023-045 (Payment Processing)
    { 
      id: 'c5', 
      label: 'Contract Execution Date', 
      value: 'March 10, 2023', 
      sourceDoc: 'Payment Services SOW.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2023-045',
      auditTrail: [
        { timestamp: '3/12/23 2:30 PM', source: 'Payment Services SOW.pdf', value: 'March 10, 2023' }
      ]
    },
    { 
      id: 'c6', 
      label: 'Term Length', 
      value: '24 months', 
      sourceDoc: 'Payment Services SOW.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2023-045',
      auditTrail: [
        { timestamp: '3/12/23 2:30 PM', source: 'Payment Services SOW.pdf', value: '24 months' }
      ]
    },
    { 
      id: 'c7', 
      label: 'Renewal Date', 
      value: 'March 10, 2025', 
      sourceDoc: 'Payment Services SOW.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2023-045',
      auditTrail: [
        { timestamp: '3/12/23 2:30 PM', source: 'Payment Services SOW.pdf', value: 'March 10, 2025' }
      ]
    },
    { 
      id: 'c8', 
      label: 'Termination Notice Period', 
      value: '60 days prior to renewal', 
      sourceDoc: 'Payment Services SOW.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2023-045',
      auditTrail: [
        { timestamp: '3/12/23 2:30 PM', source: 'Payment Services SOW.pdf', value: '60 days prior to renewal' }
      ]
    },

    // Data & Privacy for AXM-2023-045
    { 
      id: 'd3', 
      label: 'Data Types Handled', 
      value: 'Payment Data, Transaction Logs, Account Numbers', 
      sourceDoc: 'Payment Services SOW.pdf', 
      verified: true, 
      category: 'Data & Privacy',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2023-045',
      auditTrail: [
        { timestamp: '3/12/23 2:32 PM', source: 'Payment Services SOW.pdf', value: 'Payment Data, Transaction Logs, Account Numbers' }
      ]
    },
    { 
      id: 'd4', 
      label: '4th Party Providers', 
      value: 'AWS, Visa Direct, Mastercard Send', 
      sourceDoc: 'Payment Services SOW.pdf', 
      verified: true, 
      category: 'Data & Privacy',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2023-045',
      auditTrail: [
        { timestamp: '3/12/23 2:32 PM', source: 'Payment Services SOW.pdf', value: 'AWS, Visa Direct, Mastercard Send' }
      ]
    },

    // Contract fields for AXM-2022-112 (Mobile Banking API)
    { 
      id: 'c9', 
      label: 'Contract Execution Date', 
      value: 'August 15, 2022', 
      sourceDoc: 'Mobile API Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2022-112',
      auditTrail: [
        { timestamp: '8/17/22 11:20 AM', source: 'Mobile API Agreement.pdf', value: 'August 15, 2022' }
      ]
    },
    { 
      id: 'c10', 
      label: 'Term Length', 
      value: '36 months', 
      sourceDoc: 'Mobile API Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2022-112',
      auditTrail: [
        { timestamp: '8/17/22 11:20 AM', source: 'Mobile API Agreement.pdf', value: '36 months' }
      ]
    },
    { 
      id: 'c11', 
      label: 'Renewal Date', 
      value: 'August 15, 2025', 
      sourceDoc: 'Mobile API Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2022-112',
      auditTrail: [
        { timestamp: '8/17/22 11:20 AM', source: 'Mobile API Agreement.pdf', value: 'August 15, 2025' }
      ]
    },
    { 
      id: 'c12', 
      label: 'Termination Notice Period', 
      value: '90 days prior to renewal', 
      sourceDoc: 'Mobile API Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2022-112',
      auditTrail: [
        { timestamp: '8/17/22 11:20 AM', source: 'Mobile API Agreement.pdf', value: '90 days prior to renewal' }
      ]
    },

    // Data & Privacy for AXM-2022-112
    { 
      id: 'd5', 
      label: 'Data Types Handled', 
      value: 'User Credentials, Account Balances, Mobile Session Data', 
      sourceDoc: 'Mobile API Agreement.pdf', 
      verified: true, 
      category: 'Data & Privacy',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2022-112',
      auditTrail: [
        { timestamp: '8/17/22 11:22 AM', source: 'Mobile API Agreement.pdf', value: 'User Credentials, Account Balances, Mobile Session Data' }
      ]
    },
    { 
      id: 'd6', 
      label: '4th Party Providers', 
      value: 'AWS, Firebase (Push Notifications), Plaid (Account Aggregation)', 
      sourceDoc: 'Mobile API Agreement.pdf', 
      verified: true, 
      category: 'Data & Privacy',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2022-112',
      auditTrail: [
        { timestamp: '8/17/22 11:22 AM', source: 'Mobile API Agreement.pdf', value: 'AWS, Firebase (Push Notifications), Plaid (Account Aggregation)' }
      ]
    },

    // Contract fields for AXM-2024-012 (SecureData Inc. - single engagement vendor)
    { 
      id: 'c13', 
      label: 'Contract Execution Date', 
      value: 'January 5, 2024', 
      sourceDoc: 'Document Management Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-012',
      auditTrail: [
        { timestamp: '1/8/24 3:15 PM', source: 'Document Management Services Agreement.pdf', value: 'January 5, 2024' }
      ]
    },
    { 
      id: 'c14', 
      label: 'Term Length', 
      value: '24 months', 
      sourceDoc: 'Document Management Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-012',
      auditTrail: [
        { timestamp: '1/8/24 3:15 PM', source: 'Document Management Services Agreement.pdf', value: '24 months' }
      ]
    },
    { 
      id: 'c15', 
      label: 'Renewal Date', 
      value: 'January 5, 2026', 
      sourceDoc: 'Document Management Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-012',
      auditTrail: [
        { timestamp: '1/8/24 3:15 PM', source: 'Document Management Services Agreement.pdf', value: 'January 5, 2026' }
      ]
    },
    { 
      id: 'c16', 
      label: 'Termination Notice Period', 
      value: '60 days prior to renewal', 
      sourceDoc: 'Document Management Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-012',
      auditTrail: [
        { timestamp: '1/8/24 3:15 PM', source: 'Document Management Services Agreement.pdf', value: '60 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2023-087 (PayTech Services)
    { 
      id: 'c17', 
      label: 'Contract Execution Date', 
      value: 'August 12, 2023', 
      sourceDoc: 'Payment Processing Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2023-087',
      auditTrail: [
        { timestamp: '8/15/23 2:30 PM', source: 'Payment Processing Agreement.pdf', value: 'August 12, 2023' }
      ]
    },
    { 
      id: 'c18', 
      label: 'Term Length', 
      value: '36 months', 
      sourceDoc: 'Payment Processing Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2023-087',
      auditTrail: [
        { timestamp: '8/15/23 2:30 PM', source: 'Payment Processing Agreement.pdf', value: '36 months' }
      ]
    },
    { 
      id: 'c19', 
      label: 'Renewal Date', 
      value: 'August 12, 2026', 
      sourceDoc: 'Payment Processing Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2023-087',
      auditTrail: [
        { timestamp: '8/15/23 2:30 PM', source: 'Payment Processing Agreement.pdf', value: 'August 12, 2026' }
      ]
    },
    { 
      id: 'c20', 
      label: 'Termination Notice Period', 
      value: '90 days prior to renewal', 
      sourceDoc: 'Payment Processing Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2023-087',
      auditTrail: [
        { timestamp: '8/15/23 2:30 PM', source: 'Payment Processing Agreement.pdf', value: '90 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2024-034 (DataAnalytics Pro)
    { 
      id: 'c21', 
      label: 'Contract Execution Date', 
      value: 'March 15, 2024', 
      sourceDoc: 'BI Analytics Platform Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-034',
      auditTrail: [
        { timestamp: '3/18/24 9:45 AM', source: 'BI Analytics Platform Agreement.pdf', value: 'March 15, 2024' }
      ]
    },
    { 
      id: 'c22', 
      label: 'Term Length', 
      value: '12 months', 
      sourceDoc: 'BI Analytics Platform Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-034',
      auditTrail: [
        { timestamp: '3/18/24 9:45 AM', source: 'BI Analytics Platform Agreement.pdf', value: '12 months' }
      ]
    },
    { 
      id: 'c23', 
      label: 'Renewal Date', 
      value: 'March 15, 2025', 
      sourceDoc: 'BI Analytics Platform Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-034',
      auditTrail: [
        { timestamp: '3/18/24 9:45 AM', source: 'BI Analytics Platform Agreement.pdf', value: 'March 15, 2025' }
      ]
    },
    { 
      id: 'c24', 
      label: 'Termination Notice Period', 
      value: '30 days prior to renewal', 
      sourceDoc: 'BI Analytics Platform Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-034',
      auditTrail: [
        { timestamp: '3/18/24 9:45 AM', source: 'BI Analytics Platform Agreement.pdf', value: '30 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2024-045 (OfficeSupply Direct)
    { 
      id: 'c25', 
      label: 'Contract Execution Date', 
      value: 'April 1, 2024', 
      sourceDoc: 'Office Supplies Master Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-045',
      auditTrail: [
        { timestamp: '4/3/24 1:20 PM', source: 'Office Supplies Master Agreement.pdf', value: 'April 1, 2024' }
      ]
    },
    { 
      id: 'c26', 
      label: 'Term Length', 
      value: '24 months', 
      sourceDoc: 'Office Supplies Master Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-045',
      auditTrail: [
        { timestamp: '4/3/24 1:20 PM', source: 'Office Supplies Master Agreement.pdf', value: '24 months' }
      ]
    },
    { 
      id: 'c27', 
      label: 'Renewal Date', 
      value: 'April 1, 2026', 
      sourceDoc: 'Office Supplies Master Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-045',
      auditTrail: [
        { timestamp: '4/3/24 1:20 PM', source: 'Office Supplies Master Agreement.pdf', value: 'April 1, 2026' }
      ]
    },
    { 
      id: 'c28', 
      label: 'Termination Notice Period', 
      value: '60 days prior to renewal', 
      sourceDoc: 'Office Supplies Master Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-045',
      auditTrail: [
        { timestamp: '4/3/24 1:20 PM', source: 'Office Supplies Master Agreement.pdf', value: '60 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2024-067 (CyberShield Security)
    { 
      id: 'c29', 
      label: 'Contract Execution Date', 
      value: 'June 1, 2024', 
      sourceDoc: 'Managed Security Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-067',
      auditTrail: [
        { timestamp: '6/4/24 11:10 AM', source: 'Managed Security Services Agreement.pdf', value: 'June 1, 2024' }
      ]
    },
    { 
      id: 'c30', 
      label: 'Term Length', 
      value: '36 months', 
      sourceDoc: 'Managed Security Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-067',
      auditTrail: [
        { timestamp: '6/4/24 11:10 AM', source: 'Managed Security Services Agreement.pdf', value: '36 months' }
      ]
    },
    { 
      id: 'c31', 
      label: 'Renewal Date', 
      value: 'June 1, 2027', 
      sourceDoc: 'Managed Security Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-067',
      auditTrail: [
        { timestamp: '6/4/24 11:10 AM', source: 'Managed Security Services Agreement.pdf', value: 'June 1, 2027' }
      ]
    },
    { 
      id: 'c32', 
      label: 'Termination Notice Period', 
      value: '90 days prior to renewal', 
      sourceDoc: 'Managed Security Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-067',
      auditTrail: [
        { timestamp: '6/4/24 11:10 AM', source: 'Managed Security Services Agreement.pdf', value: '90 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2025-003 (CloudBackup Systems)
    { 
      id: 'c33', 
      label: 'Contract Execution Date', 
      value: 'January 15, 2025', 
      sourceDoc: 'Backup and DR Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2025-003',
      auditTrail: [
        { timestamp: '1/18/25 4:55 PM', source: 'Backup and DR Services Agreement.pdf', value: 'January 15, 2025' }
      ]
    },
    { 
      id: 'c34', 
      label: 'Term Length', 
      value: '24 months', 
      sourceDoc: 'Backup and DR Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2025-003',
      auditTrail: [
        { timestamp: '1/18/25 4:55 PM', source: 'Backup and DR Services Agreement.pdf', value: '24 months' }
      ]
    },
    { 
      id: 'c35', 
      label: 'Renewal Date', 
      value: 'January 15, 2027', 
      sourceDoc: 'Backup and DR Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2025-003',
      auditTrail: [
        { timestamp: '1/18/25 4:55 PM', source: 'Backup and DR Services Agreement.pdf', value: 'January 15, 2027' }
      ]
    },
    { 
      id: 'c36', 
      label: 'Termination Notice Period', 
      value: '60 days prior to renewal', 
      sourceDoc: 'Backup and DR Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2025-003',
      auditTrail: [
        { timestamp: '1/18/25 4:55 PM', source: 'Backup and DR Services Agreement.pdf', value: '60 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2024-023 (Marketing Automation Co)
    { 
      id: 'c37', 
      label: 'Contract Execution Date', 
      value: 'February 10, 2024', 
      sourceDoc: 'Marketing Platform License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-023',
      auditTrail: [
        { timestamp: '2/13/24 10:25 AM', source: 'Marketing Platform License Agreement.pdf', value: 'February 10, 2024' }
      ]
    },
    { 
      id: 'c38', 
      label: 'Term Length', 
      value: '12 months', 
      sourceDoc: 'Marketing Platform License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-023',
      auditTrail: [
        { timestamp: '2/13/24 10:25 AM', source: 'Marketing Platform License Agreement.pdf', value: '12 months' }
      ]
    },
    { 
      id: 'c39', 
      label: 'Renewal Date', 
      value: 'February 10, 2025', 
      sourceDoc: 'Marketing Platform License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-023',
      auditTrail: [
        { timestamp: '2/13/24 10:25 AM', source: 'Marketing Platform License Agreement.pdf', value: 'February 10, 2025' }
      ]
    },
    { 
      id: 'c40', 
      label: 'Termination Notice Period', 
      value: '30 days prior to renewal', 
      sourceDoc: 'Marketing Platform License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-023',
      auditTrail: [
        { timestamp: '2/13/24 10:25 AM', source: 'Marketing Platform License Agreement.pdf', value: '30 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2024-019 (TechSupport Global)
    { 
      id: 'c41', 
      label: 'Contract Execution Date', 
      value: 'January 20, 2024', 
      sourceDoc: 'IT Help Desk Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-019',
      auditTrail: [
        { timestamp: '1/23/24 3:40 PM', source: 'IT Help Desk Services Agreement.pdf', value: 'January 20, 2024' }
      ]
    },
    { 
      id: 'c42', 
      label: 'Term Length', 
      value: '24 months', 
      sourceDoc: 'IT Help Desk Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-019',
      auditTrail: [
        { timestamp: '1/23/24 3:40 PM', source: 'IT Help Desk Services Agreement.pdf', value: '24 months' }
      ]
    },
    { 
      id: 'c43', 
      label: 'Renewal Date', 
      value: 'January 20, 2026', 
      sourceDoc: 'IT Help Desk Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-019',
      auditTrail: [
        { timestamp: '1/23/24 3:40 PM', source: 'IT Help Desk Services Agreement.pdf', value: 'January 20, 2026' }
      ]
    },
    { 
      id: 'c44', 
      label: 'Termination Notice Period', 
      value: '60 days prior to renewal', 
      sourceDoc: 'IT Help Desk Services Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-019',
      auditTrail: [
        { timestamp: '1/23/24 3:40 PM', source: 'IT Help Desk Services Agreement.pdf', value: '60 days prior to renewal' }
      ]
    },

    // Contract fields for AXM-2024-008 (Compliance Solutions Ltd)
    { 
      id: 'c45', 
      label: 'Contract Execution Date', 
      value: 'January 8, 2024', 
      sourceDoc: 'Compliance Software License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-008',
      auditTrail: [
        { timestamp: '1/11/24 9:15 AM', source: 'Compliance Software License Agreement.pdf', value: 'January 8, 2024' }
      ]
    },
    { 
      id: 'c46', 
      label: 'Term Length', 
      value: '36 months', 
      sourceDoc: 'Compliance Software License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-008',
      auditTrail: [
        { timestamp: '1/11/24 9:15 AM', source: 'Compliance Software License Agreement.pdf', value: '36 months' }
      ]
    },
    { 
      id: 'c47', 
      label: 'Renewal Date', 
      value: 'January 8, 2027', 
      sourceDoc: 'Compliance Software License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'date',
      scope: 'engagement',
      engagementId: 'AXM-2024-008',
      auditTrail: [
        { timestamp: '1/11/24 9:15 AM', source: 'Compliance Software License Agreement.pdf', value: 'January 8, 2027' }
      ]
    },
    { 
      id: 'c48', 
      label: 'Termination Notice Period', 
      value: '90 days prior to renewal', 
      sourceDoc: 'Compliance Software License Agreement.pdf', 
      verified: true, 
      category: 'Contract',
      fieldType: 'text',
      scope: 'engagement',
      engagementId: 'AXM-2024-008',
      auditTrail: [
        { timestamp: '1/11/24 9:15 AM', source: 'Compliance Software License Agreement.pdf', value: '90 days prior to renewal' }
      ]
    },
  ];

  // Filter data by selected engagement
  const filteredDocuments = documents.filter(doc => {
    // First, check if document belongs to this vendor
    if (doc.vendorId !== vendor.id) {
      return false;
    }
    
    // For CloudBank Solutions (vendor.id === '1'), also filter by engagement
    if (vendor.id === '1') {
      return doc.scope === 'vendor' || doc.engagementId === selectedEngagementId;
    }
    
    // For other vendors, show all their documents
    return true;
  });
  
  const filteredFields = extractedFields.filter(field => 
    field.scope === 'vendor' || field.engagementId === selectedEngagementId
  );

  const knowledgeBaseDocs: KnowledgeBaseDoc[] = [
    { id: 'kb1', title: 'Third Party Risk Management Policy', type: 'Policy' },
    { id: 'kb2', title: 'Vendor Due Diligence Standards', type: 'Standard' },
    { id: 'kb3', title: 'Data Processing Requirements', type: 'Standard' },
  ];

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'Critical':
        return 'text-red-700 bg-red-50';
      case 'High':
        return 'text-orange-700 bg-orange-50';
      case 'Moderate':
        return 'text-yellow-700 bg-yellow-50';
      case 'Low':
        return 'text-green-700 bg-green-50';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('soc 2') && lowerQuery.includes('payment')) {
      return 'Yes, the SOC 2 Type II report covers the Core Banking Platform, which includes payment processing services. The Service Description section explicitly mentions "payment processing and transaction management" as part of the covered system. The report is unqualified with no material findings.';
    } else if (lowerQuery.includes('material findings')) {
      return 'The SOC 2 Type II Report shows 0 material findings. The auditor issued an unqualified opinion, meaning all relevant trust service criteria were met without exceptions. This is the best possible outcome for a SOC 2 audit.';
    } else if (lowerQuery.includes('termination')) {
      return 'According to the Master Services Agreement, either party may terminate with cause. For termination without cause, only the customer (your organization) has this right. The agreement requires 90 days written notice prior to the renewal date for non-renewal. There is also a 30-day cure period for material breaches before termination can take effect.';
    } else if (lowerQuery.includes('insurance') || lowerQuery.includes('coverage')) {
      return 'CloudBank Solutions maintains the following insurance coverage:\n\n• General Liability: $2,000,000\n• Professional Liability (E&O): $5,000,000\n• Cyber Liability: $10,000,000\n\nAll policies expire on December 31, 2025. The cyber liability policy includes third-party coverage, which is important given their role in payment processing.';
    } else if (lowerQuery.includes('4th party') || lowerQuery.includes('subservice')) {
      return 'Based on the SOC 2 report and DPA, CloudBank Solutions uses the following 4th party providers:\n\n• AWS - Infrastructure hosting and data storage\n• Cloudflare - CDN and DDoS protection\n• Stripe - Payment processing services\n\nAll subservice organizations are included in the scope of the SOC 2 audit and maintain their own compliance certifications.';
    } else {
      return 'I can help you find information across all documents for CloudBank Solutions. Try asking about specific contract terms, compliance requirements, security findings, or operational details.';
    }
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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleVerifyField = (fieldId: string) => {
    // Handle verification logic
    console.log('Verify field:', fieldId);
  };



  const handleEditField = (fieldId: string) => {
    const field = extractedFields.find(f => f.id === fieldId);
    if (field) {
      setEditingFieldId(fieldId);
      setEditValue(field.value);
      setEditSourceDoc(field.sourceDoc);
    }
  };

  const handleEditSummary = () => {
    setIsEditingHeader(!isEditingHeader);
    if (!isEditingHeader) {
      // Reset to current values when entering edit mode
      setEditedName(vendor.name);
    }
  };

  const handleSaveHeader = () => {
    // In a real implementation, this would save to backend
    setIsEditingHeader(false);
    console.log('Saved:', { editedName, editedSummary });
  };

  const handleCancelHeader = () => {
    setIsEditingHeader(false);
    setEditedName(vendor.name);
    setEditedSummary('CloudBank Solutions is a financial technology company that provides core banking infrastructure and payment processing services to regional banks and credit unions. For Axiom, they deliver a cloud-based core banking platform that powers our retail deposit accounts, payment processing, and transaction management systems. Their platform processes approximately 2.3M monthly transactions for our retail banking operations.');
  };

  // For multi-engagement vendors, separate engagement and vendor fields
  const hasMultipleEngagements = engagements.length > 1;
  const engagementCategories = ['Contract', 'Data & Privacy'];
  const vendorCategories = ['SOC 2', 'Security', 'Insurance'];

  // Define category order - Contract should be first
  const categoryOrder = ['Contract', 'Data & Privacy', 'SOC 2', 'Security', 'Insurance'];

  const engagementFields = filteredFields.filter(field => 
    engagementCategories.includes(field.category)
  );
  
  const vendorFields = filteredFields.filter(field => 
    vendorCategories.includes(field.category)
  );

  const groupedEngagementFields = engagementFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  const groupedVendorFields = vendorFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  // For single engagement vendors, use the original grouped fields
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


  const getEngagementStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-700 bg-green-50';
      case 'Renewal':
        return 'text-yellow-700 bg-yellow-50';
      case 'Terminated':
        return 'text-gray-700 bg-gray-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getIRRColor = (irr: 'Critical' | 'High' | 'Moderate' | 'Low') => {
    switch (irr) {
      case 'Critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Moderate':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Back Button - Full Width */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors pl-8 sm:pl-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </button>
        {/* Mobile tab switcher */}
        <div className="flex md:hidden bg-gray-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setMobilePanelTab('profile')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${mobilePanelTab === 'profile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setMobilePanelTab('chat')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${mobilePanelTab === 'chat' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Chat */}
        <div className={`flex flex-col bg-white border-r border-gray-200 md:w-[500px] w-full ${mobilePanelTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-medium text-gray-900">Vendor Intelligence</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Ask questions about {vendor.name}'s documents and data</p>
          </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded px-3 py-2.5 text-sm ${
                  message.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {message.content}
              </div>
            </div>
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
              placeholder="Ask about this vendor's documents..."
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
              onClick={() => setInputValue('Does this SOC 2 cover the payment processing service?')}
              className="text-xs px-2 py-1 text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              SOC 2 service coverage
            </button>
            <button
              onClick={() => setInputValue('What are the termination notice requirements?')}
              className="text-xs px-2 py-1 text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Termination notice
            </button>
            <button
              onClick={() => setInputValue('List all 4th party providers')}
              className="text-xs px-2 py-1 text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              4th parties
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Vendor Dossier */}
      <div className={`flex-1 overflow-y-auto bg-[#f5f5f3] w-full ${mobilePanelTab === 'profile' ? 'block' : 'hidden md:block'}`}>
        <div className="px-4 sm:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            {!isEditingHeader ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-xl text-gray-900 mb-1">{editedName}</h1>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {editedSummary}
                    </p>
                  </div>
                  <button 
                    onClick={handleEditSummary}
                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {/* Relationship Manager */}
                <div className="mb-4">
                  <span className="text-xs text-gray-500">Relationship Manager: </span>
                  <span className="text-sm text-gray-900">{vendor.relationshipManager || 'Unassigned'}</span>
                </div>

              {/* Processing Indicator */}
              {isProcessingEngagement && (
                <div className="mb-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-900 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">AI Processing Engagement Documents</h4>
                      <p className="text-xs text-gray-600">
                        Extracting engagement details, risk ratings, and key terms from your uploaded documents...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Engagement Selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Select Engagement</label>
                <select
                  value={selectedEngagementId}
                  onChange={(e) => {
                    if (e.target.value === '__create_new__') {
                      setShowNewEngagementModal(true);
                      setNewEngagementStep('method');
                      setUploadedNewDocs([]);
                    } else {
                      setSelectedEngagementId(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 text-sm bg-white border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  {engagements.map((eng) => (
                    <option key={eng.id} value={eng.engagementId}>
                      {eng.engagementId} - {eng.serviceDescription} ({eng.irr})
                    </option>
                  ))}
                  <option value="__create_new__" className="font-medium">Add new Engagement for {vendor.name}</option>
                </select>
              </div>

              {/* Selected Engagement Details */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-4 gap-4 text-sm mb-4">
                {/* Service */}
                <div className="group relative">
                  <div className="text-xs text-gray-600 mb-1">Service</div>
                  {isEditingService ? (
                    <input
                      type="text"
                      value={editedService}
                      onChange={(e) => setEditedService(e.target.value)}
                      onBlur={() => setIsEditingService(false)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditingService(false);
                        }
                      }}
                      autoFocus
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 font-medium flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setEditedService(currentEngagement.serviceDescription);
                        setIsEditingService(true);
                      }}
                    >
                      {currentEngagement.serviceDescription}
                      <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
                
                {/* IRR */}
                <div className="group relative">
                  <div className="text-xs text-gray-600 mb-1">IRR</div>
                  {isEditingIRR ? (
                    <select
                      value={editedIRR}
                      onChange={(e) => {
                        setEditedIRR(e.target.value as 'Critical' | 'High' | 'Moderate' | 'Low');
                        setIsEditingIRR(false);
                      }}
                      onBlur={() => setIsEditingIRR(false)}
                      autoFocus
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                  ) : (
                    <div 
                      className="cursor-pointer inline-flex"
                      onClick={() => {
                        setEditedIRR(currentEngagement.irr);
                        setIsEditingIRR(true);
                      }}
                    >
                      <span className={`px-2 py-1 rounded text-xs font-medium border inline-flex items-center gap-2 ${getIRRColor(currentEngagement.irr)}`}>
                        {currentEngagement.irr}
                        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Business Unit */}
                <div className="group relative">
                  <div className="text-xs text-gray-600 mb-1">Business Unit</div>
                  {isEditingBusinessUnit ? (
                    <input
                      type="text"
                      value={editedBusinessUnit}
                      onChange={(e) => setEditedBusinessUnit(e.target.value)}
                      onBlur={() => setIsEditingBusinessUnit(false)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditingBusinessUnit(false);
                        }
                      }}
                      autoFocus
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 font-medium flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setEditedBusinessUnit(currentEngagement.businessUnit);
                        setIsEditingBusinessUnit(true);
                      }}
                    >
                      {currentEngagement.businessUnit}
                      <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
                
                {/* Service Owner - Only show when there are multiple engagements */}
                {engagements.length > 1 && currentEngagement.serviceOwner && (
                  <div className="group relative">
                    <div className="text-xs text-gray-600 mb-1">Service Owner</div>
                    {isEditingServiceOwner ? (
                      <input
                        type="text"
                        value={editedServiceOwner}
                        onChange={(e) => setEditedServiceOwner(e.target.value)}
                        onBlur={() => setIsEditingServiceOwner(false)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingServiceOwner(false);
                          }
                        }}
                        autoFocus
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    ) : (
                      <div 
                        className="text-gray-900 font-medium flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setEditedServiceOwner(currentEngagement.serviceOwner || '');
                          setIsEditingServiceOwner(true);
                        }}
                      >
                        {currentEngagement.serviceOwner}
                        <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              </>
            ) : (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {/* Vendor Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Vendor Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                {/* Vendor Summary */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-gray-600">Vendor Summary</label>
                    <button
                      onClick={() => {
                        // Simulate AI generation
                        setEditedSummary('CloudBank Solutions is a financial technology company that provides core banking infrastructure and payment processing services to regional banks and credit unions. For Axiom, they deliver a cloud-based core banking platform that powers our retail deposit accounts, payment processing, and transaction management systems. Their platform processes approximately 2.3M monthly transactions for our retail banking operations.');
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-white transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Generate AI Summary
                    </button>
                  </div>
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 justify-end pt-2">
                  <button
                    onClick={handleCancelHeader}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHeader}
                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Extracted Data Sections */}
          {hasMultipleEngagements ? (
            /* Combined Extracted Data Section for multi-engagement vendors */
            <div className="bg-white border border-gray-200 mb-4">
              <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-900">Extracted Data</h2>
              </div>

              <div>
                {sortCategories(Object.entries(groupedFields)).map(([category, fields]) => (
                    <div key={category} className="border-b border-gray-200 last:border-b-0">
                      {/* Category Header */}
                      <div className="px-4 py-2.5 bg-[#fafaf9]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{category}</span>
                          <span className="text-xs text-gray-400">({fields.length})</span>
                        </div>
                      </div>

                      {/* Category Fields */}
                      <div>
                    {fields.map((field, idx) => (
                      <div 
                        key={field.id} 
                        className={`group hover:bg-gray-50/50 transition-colors ${idx !== fields.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        {editingFieldId === field.id ? (
                          // Edit Mode
                          <div className="px-4 py-3 space-y-3">
                            <div className="grid grid-cols-[180px_1fr] gap-4">
                              <div className="text-xs font-medium text-gray-600">{field.label}</div>
                              <div className="space-y-2">
                                {/* Data type-aware input */}
                                {field.fieldType === 'date' ? (
                                  <input
                                    type="date"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                    autoFocus
                                  />
                                ) : field.fieldType === 'dropdown' && field.dropdownOptions ? (
                                  <select
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                    autoFocus
                                  >
                                    {field.dropdownOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                ) : field.fieldType === 'number' ? (
                                  <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                    autoFocus
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        setEditingFieldId(null);
                                        setEditValue('');
                                        setEditSourceDoc('');
                                      } else if (e.key === 'Escape') {
                                        setEditingFieldId(null);
                                        setEditValue('');
                                        setEditSourceDoc('');
                                      }
                                    }}
                                  />
                                )}
                                
                                {/* Source Document Selector */}
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Source Document</label>
                                  <select
                                    value={editSourceDoc}
                                    onChange={(e) => {
                                      if (e.target.value === '__upload_new__') {
                                        handleFileSelect();
                                      } else {
                                        setEditSourceDoc(e.target.value);
                                      }
                                    }}
                                    className="text-xs px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                  >
                                    {documents.map(doc => (
                                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                                    ))}
                                    <option value="__upload_new__" className="border-t border-gray-200">Upload New...</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingFieldId(null);
                                  setEditValue('');
                                  setEditSourceDoc('');
                                }}
                                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  setEditingFieldId(null);
                                  setEditValue('');
                                  setEditSourceDoc('');
                                  // In a real implementation, save the values here
                                }}
                                className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                          ) : (
                          // View Mode
                          <div 
                            className="px-4 py-3 grid grid-cols-[180px_1fr] gap-4 items-center"
                          >
                            <div className="text-xs font-medium text-gray-600">{field.label}</div>
                            <div className="flex items-center gap-1.5">
                              <div 
                                className="text-sm text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                                onClick={() => handleEditField(field.id)}
                              >
                                {field.value}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditField(field.id);
                                }}
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                                title="Edit value"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFieldForAudit(field.id);
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          ) : (
            /* Single Extracted Data Section for single-engagement vendors */
            <div className="bg-white border border-gray-200 mb-4">
              <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-900">Extracted Data</h2>
              </div>

              <div>
                {sortCategories(Object.entries(groupedFields)).map(([category, fields]) => (
                  <div key={category} className="border-b border-gray-200 last:border-b-0">
                    {/* Category Header */}
                    <div className="px-4 py-2.5 bg-[#fafaf9]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{category}</span>
                        <span className="text-xs text-gray-400">({fields.length})</span>
                      </div>
                    </div>

                    {/* Category Fields */}
                    <div>
                      {fields.map((field, idx) => (
                        <div 
                          key={field.id} 
                          className={`group hover:bg-gray-50/50 transition-colors ${idx !== fields.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                          {editingFieldId === field.id ? (
                            // Edit Mode
                            <div className="px-4 py-3 space-y-3">
                              <div className="grid grid-cols-[180px_1fr] gap-4">
                                <div className="text-xs font-medium text-gray-600">{field.label}</div>
                                <div className="space-y-2">
                                  {/* Data type-aware input */}
                                  {field.fieldType === 'date' ? (
                                    <input
                                      type="date"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                      autoFocus
                                    />
                                  ) : field.fieldType === 'dropdown' && field.dropdownOptions ? (
                                    <select
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                      autoFocus
                                    >
                                      {field.dropdownOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                      ))}
                                    </select>
                                  ) : field.fieldType === 'number' ? (
                                    <input
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                      autoFocus
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          setEditingFieldId(null);
                                          setEditValue('');
                                          setEditSourceDoc('');
                                        } else if (e.key === 'Escape') {
                                          setEditingFieldId(null);
                                          setEditValue('');
                                          setEditSourceDoc('');
                                        }
                                      }}
                                    />
                                  )}
                                  
                                  {/* Source Document Selector */}
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Source Document</label>
                                    <select
                                      value={editSourceDoc}
                                      onChange={(e) => {
                                        if (e.target.value === '__upload_new__') {
                                          handleFileSelect();
                                        } else {
                                          setEditSourceDoc(e.target.value);
                                        }
                                      }}
                                      className="text-xs px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
                                    >
                                      {documents.map(doc => (
                                        <option key={doc.id} value={doc.name}>{doc.name}</option>
                                      ))}
                                      <option value="__upload_new__" className="border-t border-gray-200">Upload New...</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingFieldId(null);
                                    setEditValue('');
                                    setEditSourceDoc('');
                                  }}
                                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingFieldId(null);
                                    setEditValue('');
                                    setEditSourceDoc('');
                                    // In a real implementation, save the values here
                                  }}
                                  className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div 
                              className="px-4 py-3 grid grid-cols-[180px_1fr] gap-4 items-center"
                            >
                              <div className="text-xs font-medium text-gray-600">{field.label}</div>
                              <div className="flex items-center gap-1.5">
                                <div 
                                  className="text-sm text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                                  onClick={() => handleEditField(field.id)}
                                >
                                  {field.value}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditField(field.id);
                                  }}
                                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                                  title="Edit value"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFieldForAudit(field.id);
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
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Trail Side Panel */}
          {selectedFieldForAudit && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setSelectedFieldForAudit(null)}
              />
              
              {/* Side Panel */}
              <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col">
                {(() => {
                  const field = extractedFields.find(f => f.id === selectedFieldForAudit);
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
                              const isSystemUpdate = !entry.user || entry.user.toLowerCase().includes('system');
                              const actor = isSystemUpdate ? 'Titan system' : entry.user;
                              const action = isSystemUpdate ? 'updated value to' : 'manually overrode to';
                              
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
                                    <div className="flex items-start gap-2 mt-2">
                                      <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <div className="text-xs text-gray-600">Source: {entry.source}</div>
                                        {entry.page && (
                                          <div className="text-xs text-gray-400 mt-0.5">Page {entry.page}</div>
                                        )}
                                        {entry.section && (
                                          <div className="text-xs text-gray-400">Section: {entry.section}</div>
                                        )}
                                      </div>
                                    </div>
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
      </div>

      {/* New Engagement Modal */}
      {showNewEngagementModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => {
              if (newEngagementStep !== 'processing') {
                setShowNewEngagementModal(false);
              }
            }}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Add New Engagement</h2>
                    <p className="text-sm text-gray-500 mt-1">Create a new engagement for {vendor.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowNewEngagementModal(false);
                      setNewEngagementStep('method');
                      setUploadedNewDocs([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Step 1: Choose Method */}
                {newEngagementStep === 'method' && (
                  <div className="space-y-4">
                    {/* Connect Data Source Option - Coming Soon */}
                    <div className="relative border-2 border-gray-200 rounded-lg p-6 bg-gray-50 opacity-60 cursor-not-allowed">
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-gray-400 text-white text-xs font-medium rounded">Coming Soon</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-700 mb-2">Connect Data Source</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Connect your folder and automatically pull in relevant documents for this engagement.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Check className="w-4 h-4" />
                            <span>Automatic document discovery</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Check className="w-4 h-4" />
                            <span>Real-time sync</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Manual Upload Option - Active */}
                    <button
                      onClick={() => setNewEngagementStep('upload')}
                      className="w-full border-2 border-gray-900 rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Manual Upload</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Upload multiple documents from your computer. AI will extract all relevant information.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Check className="w-4 h-4" />
                            <span>Upload multiple files at once</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                            <Check className="w-4 h-4" />
                            <span>AI-powered data extraction</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Step 2: Upload Documents */}
                {newEngagementStep === 'upload' && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <button
                        onClick={() => setNewEngagementStep('method')}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                        <span>Back to method selection</span>
                      </button>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Upload Engagement Documents</h3>
                      <p className="text-xs text-gray-600">Add all relevant documents for this engagement. AI will analyze and extract information automatically.</p>
                    </div>

                    <div
                      onClick={() => newEngFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-base text-gray-900 mb-1 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 50MB each</p>
                      <p className="text-xs text-gray-400 mt-2">Contracts, SOWs, DPAs, Insurance Certificates, etc.</p>
                      <input
                        ref={newEngFileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files);
                            const newDocs = files.map(f => ({
                              name: f.name,
                              type: f.name.endsWith('.pdf') ? 'PDF' : 'Document',
                              size: `${(f.size / 1024 / 1024).toFixed(1)} MB`
                            }));
                            setUploadedNewDocs([...uploadedNewDocs, ...newDocs]);
                          }
                        }}
                      />
                    </div>

                    {uploadedNewDocs.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-900">Uploaded Documents ({uploadedNewDocs.length})</h3>
                          <button
                            onClick={() => setUploadedNewDocs([])}
                            className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="space-y-2">
                          {uploadedNewDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                  <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => setUploadedNewDocs(uploadedNewDocs.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <button
                            onClick={() => {
                              // Start processing
                              setIsProcessingEngagement(true);
                              setShowNewEngagementModal(false);
                              setUploadedNewDocs([]);
                              setNewEngagementStep('method');
                              
                              // Simulate AI processing completion after 3 seconds
                              setTimeout(() => {
                                setIsProcessingEngagement(false);
                                // In real implementation, this would populate the engagement data
                              }, 3000);
                            }}
                            disabled={uploadedNewDocs.length === 0}
                            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              Submit & Process with AI
                            </span>
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-3">
                            AI will extract engagement details, risk ratings, and key terms from your documents
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* No Footer needed for this simpler flow */}
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}
