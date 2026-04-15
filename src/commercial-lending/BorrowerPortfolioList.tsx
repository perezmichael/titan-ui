import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Search, ArrowLeft, ChevronDown, ChevronRight, Sparkles, Plus, X, Upload, FileText, Check, FolderOpen, Settings, Play, CheckCircle2, XCircle, MessageSquare, Layers } from 'lucide-react';
import type { SelectedBorrower } from '../CommercialLendingWorkspace';
import type { AgentAction } from '../AgentsView';
import { CommercialLendingChat } from './CommercialLendingChat';

interface AgentSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface BorrowerPortfolioListProps {
  onBorrowerSelect: (borrower: SelectedBorrower) => void;
  onBack: () => void;
  onWorkflowOpen?: (workflowId: string, workflowName: string) => void;
  onSettingsOpen?: () => void;
  onSessionCreated?: (session: AgentSession) => void;
  initialAction?: AgentAction;
}

interface BorrowerFacility {
  id: string;
  noteNumber: string;
  loanType: string;
  balance: number;
  commitment: number;
  interestRate: string;
  maturityDate: string;
  assetClass: string;
  status: 'Active' | 'Renewal' | 'Payoff';
}

interface Borrower {
  id: string;
  name: string;
  cipCode: string;
  relationshipId: string;
  noteNumber: string;
  assetClass: string;
  totalCreditExposure: number;
  commitment: number;
  totalDepositBalance: number;
  loanOfficer: string;
  underwriter: string;
  maturityDate: string;
  status: 'Active' | 'Renewal' | 'Payoff';
  facilities: BorrowerFacility[];
  dateAdded: string;
}

const mockBorrowers: Borrower[] = [
  {
    id: '1',
    name: 'VFN Holdings Inc',
    cipCode: 'DCBLOX',
    relationshipId: '42-789456',
    noteNumber: '20240001-001',
    assetClass: 'Data Center',
    totalCreditExposure: 9800000,
    commitment: 10000000,
    totalDepositBalance: 1250000,
    loanOfficer: 'Sarah Chen',
    underwriter: 'Michael Park',
    maturityDate: '2027-12-15',
    status: 'Active',
    facilities: [
      {
        id: '1',
        noteNumber: '20240001-001',
        loanType: 'Term Loan',
        balance: 9800000,
        commitment: 10000000,
        interestRate: 'Term SOFR + 3.50%',
        maturityDate: '2027-12-15',
        assetClass: 'Data Center',
        status: 'Active'
      }
    ],
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    name: 'GH3 Cler SNU',
    cipCode: 'GH3CLE',
    relationshipId: '38-654321',
    noteNumber: '20230045-001',
    assetClass: 'CRE — Office',
    totalCreditExposure: 5250000,
    commitment: 5500000,
    totalDepositBalance: 875000,
    loanOfficer: 'Michael Torres',
    underwriter: 'Lisa Zhang',
    maturityDate: '2026-08-30',
    status: 'Renewal',
    facilities: [
      {
        id: '2',
        noteNumber: '20230045-001',
        loanType: 'Senior Loan',
        balance: 4750000,
        commitment: 5000000,
        interestRate: '5.68% Fixed',
        maturityDate: '2026-08-30',
        assetClass: 'CRE — Office',
        status: 'Renewal'
      },
      {
        id: '3',
        noteNumber: '20240112-001',
        loanType: 'RLOC',
        balance: 500000,
        commitment: 500000,
        interestRate: 'Prime + 1.00%',
        maturityDate: '2027-02-15',
        assetClass: 'CRE — Office',
        status: 'Active'
      },
      {
        id: 'gh3-deposit-1',
        noteNumber: '99923847-001',
        loanType: 'Operating Deposit',
        balance: 875000,
        commitment: 0,
        interestRate: '0.50%',
        maturityDate: '2026-08-30',
        assetClass: 'Deposit',
        status: 'Active'
      }
    ],
    dateAdded: '2023-10-20'
  },
  {
    id: '3',
    name: 'Fibernet Solutions LLC',
    cipCode: 'FIBERN',
    relationshipId: '51-123789',
    noteNumber: '20240078-001',
    assetClass: 'Fiber/Telecom',
    totalCreditExposure: 12500000,
    commitment: 15000000,
    totalDepositBalance: 2100000,
    loanOfficer: 'Jennifer Wu',
    underwriter: 'David Kim',
    maturityDate: '2028-06-01',
    status: 'Active',
    facilities: [
      {
        id: '4',
        noteNumber: '20240078-001',
        loanType: 'Senior Loan',
        balance: 12000000,
        commitment: 12000000,
        interestRate: 'Term SOFR + 4.25%',
        maturityDate: '2028-06-01',
        assetClass: 'Fiber/Telecom',
        status: 'Active'
      },
      {
        id: '5',
        noteNumber: '20240079-001',
        loanType: 'DDTL',
        balance: 500000,
        commitment: 3000000,
        interestRate: 'Term SOFR + 4.75%',
        maturityDate: '2028-06-01',
        assetClass: 'Fiber/Telecom',
        status: 'Active'
      },
      {
        id: 'fiber-capex',
        noteNumber: '20240215-001',
        loanType: 'CapEx Loan',
        balance: 2500000,
        commitment: 3000000,
        interestRate: 'Term SOFR + 3.85%',
        maturityDate: '2029-12-31',
        assetClass: 'Fiber/Telecom',
        status: 'Active'
      },
      {
        id: 'fiber-deposit-1',
        noteNumber: '99967234-001',
        loanType: 'Operating Deposit',
        balance: 1600000,
        commitment: 0,
        interestRate: '0.75%',
        maturityDate: '2028-06-01',
        assetClass: 'Deposit',
        status: 'Active'
      },
      {
        id: 'fiber-deposit-2',
        noteNumber: '99967891-001',
        loanType: 'Money Market Deposit',
        balance: 500000,
        commitment: 0,
        interestRate: '1.25%',
        maturityDate: '2028-06-01',
        assetClass: 'Deposit',
        status: 'Active'
      }
    ],
    dateAdded: '2024-02-28'
  },
  {
    id: '4',
    name: 'Retail Plaza Holdings',
    cipCode: 'RETAIL',
    relationshipId: '29-456123',
    noteNumber: '20230122-001',
    assetClass: 'CRE — Retail',
    totalCreditExposure: 8200000,
    commitment: 8500000,
    totalDepositBalance: 560000,
    loanOfficer: 'David Park',
    underwriter: 'Rachel Martinez',
    maturityDate: '2027-03-31',
    status: 'Active',
    facilities: [
      {
        id: '6',
        noteNumber: '20230122-001',
        loanType: 'Term Loan',
        balance: 8200000,
        commitment: 8500000,
        interestRate: '6.25% Fixed',
        maturityDate: '2027-03-31',
        assetClass: 'CRE — Retail',
        status: 'Active'
      }
    ],
    dateAdded: '2023-11-10'
  },
  {
    id: '5',
    name: 'Healthcare Properties Inc',
    cipCode: 'HEALTH',
    relationshipId: '67-892345',
    noteNumber: '20240055-001',
    assetClass: 'CRE — Healthcare',
    totalCreditExposure: 6750000,
    commitment: 7000000,
    totalDepositBalance: 980000,
    loanOfficer: 'Sarah Chen',
    underwriter: 'James Thompson',
    maturityDate: '2028-09-15',
    status: 'Active',
    facilities: [
      {
        id: '7',
        noteNumber: '20240055-001',
        loanType: 'Term Loan',
        balance: 6750000,
        commitment: 7000000,
        interestRate: 'Term SOFR + 2.75%',
        maturityDate: '2028-09-15',
        assetClass: 'CRE — Healthcare',
        status: 'Active'
      }
    ],
    dateAdded: '2024-03-15'
  }
];

interface WorkflowType {
  id: string;
  name: string;
  description: string;
}

interface WorkflowJob {
  id: string;
  workflowType: WorkflowType;
  borrowerName: string;
  status: 'in-progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
}

const workflowTypes: WorkflowType[] = [
  { id: 'deal-qa',              name: 'Deal QA',              description: 'Full document review and quality assurance check' },
  { id: 'annual-review',        name: 'Annual Review',        description: 'Comprehensive annual borrower assessment' },
  { id: 'covenant-monitoring',  name: 'Covenant Monitoring',  description: 'Track and review all covenant compliance' },
  { id: 'dscr-analysis',        name: 'DSCR Analysis',        description: 'Debt service coverage ratio calculation and trending' },
  { id: 'loan-grading',         name: 'Loan Grading',         description: 'Assign and validate internal loan grade based on current financials' },
];

const initialWorkflowJobs: WorkflowJob[] = [
  { id: 'job-1', workflowType: workflowTypes[0], borrowerName: 'VFN Holdings Inc',       status: 'in-progress', startedAt: '2026-03-23' },
  { id: 'job-2', workflowType: workflowTypes[1], borrowerName: 'GH3 Cler SNU',           status: 'completed',   startedAt: '2026-03-21', completedAt: '2026-03-21' },
  { id: 'job-3', workflowType: workflowTypes[2], borrowerName: 'Fibernet Solutions LLC', status: 'completed',   startedAt: '2026-03-20', completedAt: '2026-03-20' },
  { id: 'job-4', workflowType: workflowTypes[3], borrowerName: 'Retail Plaza Holdings',  status: 'failed',      startedAt: '2026-03-18', completedAt: '2026-03-18' },
];

type HistoryEntryType = 'chat' | 'workflow' | 'records' | 'document';

interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  title: string;
  meta: string;
  status: 'completed' | 'in-progress' | 'failed';
  timestamp: string;
  group: 'today' | 'this-week' | 'last-week';
}

const historyEntries: HistoryEntry[] = [
  // Today
  { id: 'h1', type: 'workflow',  title: 'Deal QA',              meta: 'VFN Holdings Inc',                          status: 'in-progress', timestamp: '2:30 PM',          group: 'today' },
  { id: 'h2', type: 'chat',     title: 'Portfolio Q&A',         meta: 'Asked about maturities in next 90 days',    status: 'completed',   timestamp: '11:15 AM',         group: 'today' },
  { id: 'h3', type: 'records',  title: 'Records Session',       meta: 'VFN Holdings · Fibernet Solutions',          status: 'completed',   timestamp: '9:20 AM',          group: 'today' },
  // This week
  { id: 'h4', type: 'workflow',  title: 'Annual Review',        meta: 'GH3 Cler SNU',                              status: 'completed',   timestamp: 'Tue 3:45 PM',      group: 'this-week' },
  { id: 'h5', type: 'document', title: 'New Record Created',    meta: 'Q4 2025 Financials — VFN Holdings Inc',     status: 'completed',   timestamp: 'Tue 10:00 AM',     group: 'this-week' },
  { id: 'h6', type: 'chat',     title: 'Portfolio Q&A',         meta: 'Reviewed total Data Center exposure',        status: 'completed',   timestamp: 'Mon 2:15 PM',      group: 'this-week' },
  { id: 'h7', type: 'workflow',  title: 'Covenant Monitoring',  meta: 'Fibernet Solutions LLC',                    status: 'completed',   timestamp: 'Mon 9:30 AM',      group: 'this-week' },
  // Last week
  { id: 'h8', type: 'workflow',  title: 'DSCR Analysis',        meta: 'Retail Plaza Holdings',                     status: 'failed',      timestamp: 'Mar 17, 4:10 PM',  group: 'last-week' },
  { id: 'h9', type: 'records',  title: 'Records Session',       meta: 'GH3 Cler · Fibernet · Healthcare Properties', status: 'completed', timestamp: 'Mar 17, 1:45 PM', group: 'last-week' },
  { id: 'h10', type: 'chat',    title: 'Portfolio Q&A',         meta: 'Covenant compliance overview',               status: 'completed',   timestamp: 'Mar 16, 11:00 AM', group: 'last-week' },
  { id: 'h11', type: 'document', title: 'New Record Created',   meta: 'Credit Agreement — Healthcare Properties',  status: 'completed',   timestamp: 'Mar 15, 3:00 PM',  group: 'last-week' },
];

// ─── Dossier data (exported for use in CommercialLendingChat) ─────────────────

export interface BorrowerDossier {
  description: string;
  dealDetails: Array<{ label: string; value: string }>;
  documents: Array<{ name: string; date: string }>;
  kbDocuments: string[];
}

export const borrowerDossiers: Record<string, BorrowerDossier> = {
  '1': {
    description: 'VFN Holdings Inc (Vero Fiber Networks, LLC) is a leading provider of fiber-optic communications services to the enterprise and wholesale markets. The company provides fiber-optic connectivity, network design and implementation, and network management.',
    dealDetails: [
      { label: 'Transaction Type',         value: 'Modification/Extension' },
      { label: 'NAICS Code',               value: '517110' },
      { label: 'Sponsor Name',             value: 'None' },
      { label: 'Facility Type',            value: 'Development Line of Credit (DLOC), Revolving Line of Credit (Revolver), Delayed Draw Term Loan (DDTL)' },
      { label: 'Loan Term',                value: '60 months' },
      { label: 'Loan Maturity Date',       value: '9/20/2026' },
      { label: 'Amortization Structure',   value: 'I/O then 25-year amortization' },
      { label: 'Syndicated',               value: 'No' },
      { label: 'Arranger Name',            value: 'Hancock Whitney' },
      { label: 'Interest Rate',            value: 'SOFR + 3750 bps' },
      { label: 'Pricing Grid Present',     value: 'Yes' },
      { label: 'Revenue (Most Recent)',    value: '$32,021,500,000' },
      { label: 'EBITDA (Most Recent)',     value: '$1,136,500,000' },
      { label: 'Total Funded Debt',        value: '$62,500,000' },
      { label: 'Tangible Net Worth',       value: '$1,000,000,000' },
      { label: 'Leverage Ratio',           value: '5.5' },
      { label: 'Coverage Ratio (Actual)',  value: '1.43' },
      { label: 'Financial Statement Quality', value: 'CPA Audited' },
      { label: 'Revenue Model Type',       value: 'C&I General' },
      { label: 'RAROC',                    value: '0.688%' },
      { label: 'HLT Exception',            value: 'No' },
      { label: 'Primary Covenant Type',    value: 'Minimum DSCR' },
      { label: 'Primary Covenant Threshold', value: '1.25' },
      { label: 'Collateral Description',   value: 'First lien on all assets of borrower and guarantors' },
      { label: 'Lien Position',            value: '1st' },
      { label: 'Guarantor Names',          value: 'Vero Fiber Networks, LLC' },
      { label: 'Critical Exception Present', value: 'No' },
      { label: 'Critical Exception Summary', value: 'None' },
      { label: 'Transaction Purpose',      value: 'Construction / Development' },
      { label: 'Primary Repayment Source', value: 'Operating Cash Flow' },
      { label: 'Underwriter Recommendation', value: 'Approve — Risk Rating 4 (Satisfactory)' },
    ],
    documents: [
      { name: 'Credit Agreement.pdf',              date: '12/15/2024' },
      { name: 'Loan Approval Form.pdf',            date: '12/10/2024' },
      { name: 'Appraisal Report.pdf',              date: '11/20/2024' },
      { name: 'Financial Statements Q4 2024.pdf',  date: '01/15/2025' },
      { name: 'Annual Review 2024.pdf',            date: '12/31/2024' },
      { name: 'Insurance Certificate.pdf',         date: '01/01/2025' },
      { name: 'Environmental Report.pdf',          date: '11/15/2024' },
    ],
    kbDocuments: [
      'Axiom Commercial Lending Policy',
      'Data Center Asset Class Guidelines',
      'CRE Underwriting Standards',
    ],
  },
  '2': {
    description: 'GH3 Cler SNU operates a portfolio of Class A office properties in suburban markets across the Southeast. The company focuses on long-term leases with investment-grade tenants and maintains active asset management.',
    dealDetails: [
      { label: 'Transaction Type',         value: 'Renewal' },
      { label: 'NAICS Code',               value: '531120' },
      { label: 'Property Type',            value: 'Class A Office' },
      { label: 'Facility Type',            value: 'Senior Loan, Revolving Line of Credit (RLOC)' },
      { label: 'Loan Term',                value: '36 months' },
      { label: 'Loan Maturity Date',       value: '8/30/2026' },
      { label: 'Interest Rate',            value: '5.68% Fixed' },
      { label: 'Amortization Structure',   value: 'Interest Only' },
      { label: 'Syndicated',               value: 'No' },
      { label: 'Sponsor Name',             value: 'GH3 Capital Partners' },
      { label: 'LTV (As-Is)',              value: '68%' },
      { label: 'DSCR (Underwritten)',      value: '1.38x' },
      { label: 'NOI (Most Recent)',        value: '$2,100,000' },
      { label: 'Appraised Value',          value: '$7,750,000' },
      { label: 'Occupancy Rate',           value: '91%' },
      { label: 'Primary Covenant Type',    value: 'Minimum DSCR' },
      { label: 'Primary Covenant Threshold', value: '1.20' },
      { label: 'Collateral Description',   value: 'First lien on commercial real estate and assignment of rents' },
      { label: 'Lien Position',            value: '1st' },
      { label: 'Critical Exception Present', value: 'Yes' },
      { label: 'Critical Exception Summary', value: 'Appraisal approaching 18-month staleness — renewal required by May 2026' },
      { label: 'Primary Repayment Source', value: 'Property Cash Flow' },
      { label: 'Underwriter Recommendation', value: 'Approve — Risk Rating 3 (Acceptable)' },
    ],
    documents: [
      { name: 'Loan Agreement.pdf',                date: '10/20/2023' },
      { name: 'Financial Statements Q3 2025.pdf',  date: '11/01/2025' },
      { name: 'Property Appraisal.pdf',            date: '09/15/2023' },
      { name: 'Rent Roll Q4 2025.pdf',             date: '01/10/2026' },
    ],
    kbDocuments: [
      'Axiom Commercial Lending Policy',
      'CRE Underwriting Standards',
      'Office Asset Class Guidelines',
    ],
  },
  '3': {
    description: 'Fibernet Solutions LLC builds and operates last-mile fiber networks serving residential and small business customers across rural and suburban markets in the mid-Atlantic region. The company is backed by Meridian Infrastructure Fund III.',
    dealDetails: [
      { label: 'Transaction Type',         value: 'New Origination' },
      { label: 'NAICS Code',               value: '517311' },
      { label: 'Sponsor Name',             value: 'Meridian Infrastructure Fund III' },
      { label: 'Facility Type',            value: 'Senior Loan, Delayed Draw Term Loan (DDTL), CapEx Loan' },
      { label: 'Loan Term',                value: '48 months' },
      { label: 'Loan Maturity Date',       value: '6/1/2028' },
      { label: 'Interest Rate',            value: 'SOFR + 4250 bps' },
      { label: 'Amortization Structure',   value: 'I/O then 20-year amortization' },
      { label: 'Syndicated',               value: 'Yes' },
      { label: 'Arranger Name',            value: 'First National Bank' },
      { label: 'Revenue (Most Recent)',    value: '$8,450,000' },
      { label: 'EBITDA (Most Recent)',     value: '$2,980,000' },
      { label: 'Total Funded Debt',        value: '$15,000,000' },
      { label: 'Leverage Ratio',           value: '5.0x' },
      { label: 'Coverage Ratio (Actual)',  value: '1.51x' },
      { label: 'Financial Statement Quality', value: 'CPA Reviewed' },
      { label: 'Primary Covenant Type',    value: 'Minimum DSCR' },
      { label: 'Primary Covenant Threshold', value: '1.25' },
      { label: 'Collateral Description',   value: 'First lien on all network assets and fiber infrastructure' },
      { label: 'Lien Position',            value: '1st' },
      { label: 'Guarantor Names',          value: 'Meridian Infrastructure Fund III GP, LLC' },
      { label: 'Critical Exception Present', value: 'No' },
      { label: 'Transaction Purpose',      value: 'Network Buildout / Capital Expenditure' },
      { label: 'Primary Repayment Source', value: 'Subscriber Revenue' },
      { label: 'Underwriter Recommendation', value: 'Approve — Risk Rating 3 (Acceptable)' },
    ],
    documents: [
      { name: 'Credit Agreement.pdf',        date: '02/28/2024' },
      { name: 'Financial Model.xlsx',        date: '02/15/2024' },
      { name: 'Network Build Plan.pdf',      date: '02/01/2024' },
      { name: 'Syndication Agreement.pdf',   date: '03/01/2024' },
      { name: 'Insurance Certificate.pdf',   date: '03/15/2024' },
    ],
    kbDocuments: [
      'Axiom Commercial Lending Policy',
      'Fiber & Telecom Asset Class Guidelines',
      'Syndicated Loan Underwriting Policy',
    ],
  },
  '4': {
    description: 'Retail Plaza Holdings owns and manages a portfolio of necessity-based retail centers anchored by grocery and pharmacy tenants. Properties are located in high-traffic suburban corridors with strong demographic profiles.',
    dealDetails: [
      { label: 'Transaction Type',         value: 'Refinance' },
      { label: 'NAICS Code',               value: '531120' },
      { label: 'Property Type',            value: 'Anchored Retail / Shopping Center' },
      { label: 'Facility Type',            value: 'Term Loan' },
      { label: 'Loan Term',                value: '48 months' },
      { label: 'Loan Maturity Date',       value: '3/31/2027' },
      { label: 'Interest Rate',            value: '6.25% Fixed' },
      { label: 'Amortization Structure',   value: '30-year amortization' },
      { label: 'Syndicated',               value: 'No' },
      { label: 'Sponsor Name',             value: 'Retail Plaza Management LLC' },
      { label: 'LTV (As-Is)',              value: '72%' },
      { label: 'DSCR (Underwritten)',      value: '1.29x' },
      { label: 'NOI (Most Recent)',        value: '$1,840,000' },
      { label: 'Appraised Value',          value: '$11,400,000' },
      { label: 'Occupancy Rate',           value: '96%' },
      { label: 'Primary Covenant Type',    value: 'Minimum DSCR' },
      { label: 'Primary Covenant Threshold', value: '1.20' },
      { label: 'Collateral Description',   value: 'First lien on commercial real estate and assignment of rents' },
      { label: 'Lien Position',            value: '1st' },
      { label: 'Critical Exception Present', value: 'No' },
      { label: 'Transaction Purpose',      value: 'Refinance of Existing Debt' },
      { label: 'Primary Repayment Source', value: 'Property Cash Flow' },
      { label: 'Underwriter Recommendation', value: 'Approve — Risk Rating 3 (Acceptable)' },
    ],
    documents: [
      { name: 'Term Loan Agreement.pdf',   date: '11/10/2023' },
      { name: 'Rent Roll Q4 2025.pdf',     date: '01/10/2026' },
      { name: 'Environmental Report.pdf',  date: '10/20/2023' },
      { name: 'Appraisal Report.pdf',      date: '10/15/2023' },
    ],
    kbDocuments: [
      'Axiom Commercial Lending Policy',
      'CRE Underwriting Standards',
      'Retail Asset Class Guidelines',
    ],
  },
  '5': {
    description: 'Healthcare Properties Inc acquires and leases medical office buildings and outpatient facilities to healthcare systems and physician groups under long-term net leases. The company is sponsored by HPI Capital Group with a focus on essential healthcare infrastructure.',
    dealDetails: [
      { label: 'Transaction Type',         value: 'New Origination' },
      { label: 'NAICS Code',               value: '531190' },
      { label: 'Property Type',            value: 'Medical Office / Outpatient Facility' },
      { label: 'Facility Type',            value: 'Term Loan' },
      { label: 'Loan Term',                value: '54 months' },
      { label: 'Loan Maturity Date',       value: '9/15/2028' },
      { label: 'Interest Rate',            value: 'SOFR + 2750 bps' },
      { label: 'Amortization Structure',   value: 'I/O then 25-year amortization' },
      { label: 'Syndicated',               value: 'No' },
      { label: 'Sponsor Name',             value: 'HPI Capital Group' },
      { label: 'LTV (As-Is)',              value: '65%' },
      { label: 'DSCR (Underwritten)',      value: '1.52x' },
      { label: 'NOI (Most Recent)',        value: '$1,620,000' },
      { label: 'Appraised Value',          value: '$10,800,000' },
      { label: 'Occupancy Rate',           value: '100%' },
      { label: 'Primary Covenant Type',    value: 'Minimum DSCR' },
      { label: 'Primary Covenant Threshold', value: '1.25' },
      { label: 'Collateral Description',   value: 'First lien on medical office real estate and assignment of leases' },
      { label: 'Lien Position',            value: '1st' },
      { label: 'Guarantor Names',          value: 'HPI Capital Group, LLC' },
      { label: 'Critical Exception Present', value: 'No' },
      { label: 'Transaction Purpose',      value: 'Acquisition' },
      { label: 'Primary Repayment Source', value: 'Net Lease Income' },
      { label: 'Underwriter Recommendation', value: 'Approve — Risk Rating 2 (Pass)' },
    ],
    documents: [
      { name: 'Loan Agreement.pdf',                date: '03/15/2024' },
      { name: 'Financial Statements Q4 2025.pdf',  date: '01/20/2026' },
      { name: 'Facility Appraisal.pdf',            date: '02/28/2024' },
      { name: 'Lease Abstracts.pdf',               date: '03/01/2024' },
      { name: 'Environmental Report.pdf',          date: '02/20/2024' },
    ],
    kbDocuments: [
      'Axiom Commercial Lending Policy',
      'Healthcare Real Estate Asset Class Guidelines',
      'Net Lease Underwriting Standards',
    ],
  },
};

export function BorrowerPortfolioList({ onBorrowerSelect, onBack, onWorkflowOpen, onSettingsOpen, onSessionCreated, initialAction }: BorrowerPortfolioListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBorrowers, setExpandedBorrowers] = useState<Set<string>>(new Set());

  // Tab state — derive initial tab from action
  const initialTab = initialAction === 'workflow' ? 'workflows'
    : initialAction === 'records' || initialAction === 'new-record' ? 'records'
    : 'chat';
  const [activeTab, setActiveTab] = useState<'records' | 'workflows' | 'chat' | 'history'>(initialTab);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  // Workflow jobs + run modal
  const [workflowJobs, setWorkflowJobs] = useState<WorkflowJob[]>(initialWorkflowJobs);
  const [showRunWorkflowModal, setShowRunWorkflowModal] = useState(initialAction === 'workflow');
  const [runWorkflowStep, setRunWorkflowStep] = useState<'type' | 'record'>('type');
  const [pendingWorkflowType, setPendingWorkflowType] = useState<WorkflowType | null>(null);

  // New record modal states
  const [showNewRecordModal, setShowNewRecordModal] = useState(initialAction === 'new-record');

  // Records workspace
  const [selectedRecordsForChat, setSelectedRecordsForChat] = useState<Borrower[]>([]);
  const [recordsChatOpen, setRecordsChatOpen] = useState(false);
  const [chatInitialRecords, setChatInitialRecords] = useState<Borrower[] | undefined>(undefined);
  const [recordsChatMessages, setRecordsChatMessages] = useState<{id: string; role: 'user'|'assistant'; content: string}[]>([]);
  const [recordsChatInput, setRecordsChatInput] = useState('');
  const [activeDossierTab, setActiveDossierTab] = useState<string | null>(null);
  const [recordsIsThinking, setRecordsIsThinking] = useState(false);
  const recordsChatEndRef = useRef<HTMLDivElement>(null);
  const [newRecordStep, setNewRecordStep] = useState<'method' | 'upload'>('method');
  const [uploadedRecordDocs, setUploadedRecordDocs] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [isProcessingRecord, setIsProcessingRecord] = useState(false);
  const newRecordFileInputRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);

  const recordChatSuggestions = [
    "What's the current DSCR?",
    'Any open covenant exceptions?',
    'When does this deal mature?',
    'Show recent documents',
    'Summarize key risk factors',
  ];

  const [chatStartActive, setChatStartActive] = useState(false);

  const launchChat = (records: Borrower[]) => {
    setChatInitialRecords(records);
    setChatStartActive(true);
    setChatKey(k => k + 1);
    setActiveTab('chat');
  };

  const toggleRecordForChat = (b: Borrower) => {
    setSelectedRecordsForChat(prev => {
      const exists = prev.some(r => r.id === b.id);
      if (exists) {
        const next = prev.filter(r => r.id !== b.id);
        if (activeDossierTab === b.id && next.length > 0) setActiveDossierTab(next[0].id);
        return next;
      } else {
        if (prev.length === 0) setActiveDossierTab(b.id);
        return [...prev, b];
      }
    });
  };

  const sendRecordsChat = (queryOverride?: string) => {
    const q = (queryOverride ?? recordsChatInput).trim();
    if (!q) return;
    setRecordsChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q }]);
    setRecordsChatInput('');
    setRecordsIsThinking(true);
    setTimeout(() => {
      const names = selectedRecordsForChat.map(r => r.name).join(' and ');
      const lq = q.toLowerCase();
      let response = '';
      if (lq.includes('dscr') || lq.includes('debt service')) {
        response = `The DSCR for **${names}** is 1.42x as of the most recent review, which is above the covenant minimum of 1.25x.`;
      } else if (lq.includes('covenant') || lq.includes('exception')) {
        response = `No open covenant exceptions on file for **${names}**. Last covenant review completed 12/15/2024.`;
      } else if (lq.includes('matur')) {
        response = selectedRecordsForChat.length === 1
          ? `The primary facility for **${names}** matures on ${formatDate(selectedRecordsForChat[0].maturityDate)}.`
          : selectedRecordsForChat.map(r => `**${r.name}**: ${formatDate(r.maturityDate)}`).join('\n');
      } else if (lq.includes('document') || lq.includes('file')) {
        response = `Found 4 documents on file for **${names}**: Term Sheet (01/15/2024), Financial Statements Q4 2024, Appraisal Report (08/10/2024), Credit Agreement (01/15/2024).`;
      } else if (lq.includes('risk')) {
        response = `Key risk factors for **${names}**: (1) Sector concentration in ${selectedRecordsForChat[0].assetClass}, (2) Upcoming maturity requiring refinancing, (3) Interest rate sensitivity given floating rate structure.`;
      } else {
        response = `Based on available data for **${names}**: the relationship is ${selectedRecordsForChat[0].status} with total credit exposure of ${formatCurrency(selectedRecordsForChat[0].totalCreditExposure)} across ${selectedRecordsForChat[0].facilities.length} facilities. What would you like to explore?`;
      }
      setRecordsChatMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: response }]);
      setRecordsIsThinking(false);
    }, 900);
  };

  const launchWorkflowJob = (wfType: WorkflowType, borrower: Borrower) => {
    const newJob: WorkflowJob = {
      id: `job-${Date.now()}`,
      workflowType: wfType,
      borrowerName: borrower.name,
      status: 'in-progress',
      startedAt: new Date().toISOString().slice(0, 10),
    };
    setWorkflowJobs(prev => [newJob, ...prev]);
    setShowRunWorkflowModal(false);
    setRunWorkflowStep('type');
    setPendingWorkflowType(null);
  };

  const toggleBorrowerExpansion = (borrowerId: string) => {
    const newExpanded = new Set(expandedBorrowers);
    if (newExpanded.has(borrowerId)) {
      newExpanded.delete(borrowerId);
    } else {
      newExpanded.add(borrowerId);
    }
    setExpandedBorrowers(newExpanded);
  };

  const filteredBorrowers = mockBorrowers.filter(borrower =>
    !searchQuery ||
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.noteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.cipCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll records chat
  useEffect(() => {
    recordsChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [recordsChatMessages, recordsIsThinking]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: back + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {chatStarted ? (
              // Inside active chat: back exits to workspace landing
              <>
                <button
                  onClick={() => { setChatStarted(false); setChatKey(k => k + 1); }}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 pl-8 sm:pl-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Commercial Lending</span>
                </button>
                <span className="text-gray-300 hidden sm:inline">/</span>
                <button
                  onClick={onBack}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors hidden sm:block flex-shrink-0"
                >
                  Agents
                </button>
              </>
            ) : (
              // On landing: back goes to agents list
              <>
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 pl-8 sm:pl-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Agents</span>
                </button>
                <span className="text-gray-300 hidden sm:inline">/</span>
                <h1 className="text-sm text-gray-900 truncate hidden sm:block flex-shrink-0">Commercial Lending</h1>
              </>
            )}
          </div>

          {/* Center: pill toggle — hidden once chat is started */}
          {!(activeTab === 'chat' && chatStarted) && (
            <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 flex-shrink-0">
              {(['chat', 'records', 'workflows', 'history'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 font-medium shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Right: settings */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={onSettingsOpen}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Tab — full-height, manages its own scroll */}
      {activeTab === 'chat' && (
        <div className="flex-1 overflow-hidden">
          <CommercialLendingChat key={chatKey} onChatStarted={() => setChatStarted(true)} onSessionCreated={onSessionCreated} initialRecords={chatInitialRecords} startActive={chatStartActive} />
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h2 className="text-lg text-gray-900">Activity History</h2>
            <p className="text-sm text-gray-500 mt-0.5">Every chat, workflow run, records session, and document processed in this workspace</p>
          </div>

          {(['today', 'this-week', 'last-week'] as const).map(group => {
            const entries = historyEntries.filter(e => e.group === group);
            if (entries.length === 0) return null;
            const groupLabel = group === 'today' ? 'Today' : group === 'this-week' ? 'This Week' : 'Last Week';

            const typeConfig: Record<HistoryEntryType, { icon: ReactNode; bg: string; label: string }> = {
              chat:     { icon: <MessageSquare className="w-3.5 h-3.5 text-gray-500" />,   bg: 'bg-gray-100',   label: 'Portfolio Q&A' },
              workflow: { icon: <Play className="w-3.5 h-3.5 text-[#455a4f]" />,          bg: 'bg-[#eef2f0]',  label: 'Workflow' },
              records:  { icon: <Layers className="w-3.5 h-3.5 text-blue-500" />,         bg: 'bg-blue-50',    label: 'Records Session' },
              document: { icon: <FileText className="w-3.5 h-3.5 text-amber-500" />,      bg: 'bg-amber-50',   label: 'Document' },
            };

            return (
              <div key={group} className="mb-8">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{groupLabel}</div>
                <div className="space-y-2">
                  {entries.map(entry => {
                    const cfg = typeConfig[entry.type];
                    return (
                      <div key={entry.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-default">
                        {/* Type icon */}
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          {cfg.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{entry.title}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-500 truncate">{entry.meta}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-400">{cfg.label}</span>
                          </div>
                        </div>

                        {/* Right: status + timestamp */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            entry.status === 'completed'  ? 'bg-green-50 text-green-700'
                            : entry.status === 'in-progress' ? 'bg-blue-50 text-blue-700'
                            : 'bg-red-50 text-red-600'
                          }`}>
                            {entry.status === 'in-progress' ? 'In Progress' : entry.status === 'completed' ? 'Completed' : 'Failed'}
                          </span>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">{entry.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Records split-pane workspace — visible when chat opened */}
      {activeTab === 'records' && recordsChatOpen && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left chat panel — gets majority of the space */}
          <div className="flex-1 min-w-0 flex flex-col border-r border-gray-200 bg-white">
            {/* Back + selected record pills + Clear */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setRecordsChatOpen(false)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0 mr-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Records
              </button>
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {selectedRecordsForChat.map(r => (
                  <span key={r.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#eef2f0] text-[#455a4f] text-xs rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#455a4f] flex-shrink-0" />
                    {r.name}
                    <button onClick={() => toggleRecordForChat(r)} className="ml-0.5 hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={() => { setSelectedRecordsForChat([]); setRecordsChatMessages([]); setActiveDossierTab(null); setRecordsChatOpen(false); }}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
              >
                Clear
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {recordsChatMessages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    {selectedRecordsForChat.length === 1
                      ? `Deep dive into ${selectedRecordsForChat[0].name} — reference the dossier on the right`
                      : `Analyze ${selectedRecordsForChat.length} records side by side — switch between dossiers using the tabs`}
                  </p>
                  <div className="flex flex-col gap-2">
                    {recordChatSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendRecordsChat(s)}
                        className="text-left px-3 py-2 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recordsChatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-md bg-[#455a4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
                        msg.role === 'user'
                          ? 'bg-white border border-gray-200 text-gray-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {recordsIsThinking && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#455a4f] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex gap-1 px-3 py-2 bg-gray-100 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={recordsChatEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-[#E05C3A] transition-colors">
                <Sparkles className="w-4 h-4 text-[#455a4f] flex-shrink-0 mb-0.5" />
                <textarea
                  rows={1}
                  placeholder={selectedRecordsForChat.length === 1 ? `Ask about ${selectedRecordsForChat[0].name}…` : `Ask across ${selectedRecordsForChat.length} records…`}
                  value={recordsChatInput}
                  onChange={e => setRecordsChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendRecordsChat();
                    }
                  }}
                  className="flex-1 resize-none text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => sendRecordsChat()}
                  disabled={!recordsChatInput.trim()}
                  className="flex-shrink-0 w-7 h-7 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right dossier panel — fixed width */}
          <div className="w-[460px] flex-shrink-0 flex flex-col bg-[#f5f5f3]">
            {/* Record switcher tabs */}
            {selectedRecordsForChat.length > 1 && (
              <div className="bg-white border-b border-gray-200 px-4 flex gap-0 flex-shrink-0">
                {selectedRecordsForChat.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveDossierTab(r.id)}
                    className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeDossierTab === r.id
                        ? 'border-[#455a4f] text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}

            {/* Dossier content — scrollable */}
            {(() => {
              const active = selectedRecordsForChat.find(r => r.id === activeDossierTab) ?? selectedRecordsForChat[0];
              if (!active) return null;
              const dossier = borrowerDossiers[active.id];
              return (
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">

                    {/* Company header */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{active.name}</h2>
                      {dossier && (
                        <p className="text-sm text-gray-500 leading-relaxed">{dossier.description}</p>
                      )}
                    </div>

                    {/* Deal Details card */}
                    {dossier && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Deal Details</h3>
                        </div>
                        <div>
                          {dossier.dealDetails.map((row, i) => (
                            <div key={i} className={`flex gap-4 px-5 py-3 ${i < dossier.dealDetails.length - 1 ? 'border-b border-gray-100' : ''}`}>
                              <span className="w-44 flex-shrink-0 text-sm text-gray-400">{row.label}</span>
                              <span className="flex-1 text-sm text-gray-900">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents card */}
                    {dossier && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">Documents ({dossier.documents.length})</h3>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                          </button>
                        </div>
                        <div>
                          {dossier.documents.map((doc, i) => (
                            <div key={i} className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors ${i < dossier.documents.length - 1 ? 'border-b border-gray-100' : ''}`}>
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm text-gray-900 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Relevant Knowledge Base Documents */}
                    {dossier && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">Relevant Knowledge Base Documents</h3>
                          <button className="text-xs text-[#455a4f] hover:underline transition-colors">+ Add More</button>
                        </div>
                        <div>
                          {dossier.kbDocuments.map((doc, i) => (
                            <div key={i} className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors ${i < dossier.kbDocuments.length - 1 ? 'border-b border-gray-100' : ''}`}>
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Records default list + Workflows tab */}
      {(activeTab === 'workflows' || (activeTab === 'records' && !recordsChatOpen)) && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {/* Processing Indicator */}
          {isProcessingRecord && (
            <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-[#455a4f] rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#455a4f] rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Processing Documents and Creating a New Record</h4>
                  <p className="text-xs text-gray-600">
                    You may close this page. The new record will appear when processing is complete.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Workflows Tab Content */}
          {activeTab === 'workflows' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg text-gray-900">Workflow Jobs</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Track the status of running and completed workflows</p>
                </div>
                <button
                  onClick={() => { setShowRunWorkflowModal(true); setRunWorkflowStep('type'); setPendingWorkflowType(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors flex-shrink-0"
                >
                  <Play className="w-4 h-4" />
                  Run a workflow
                </button>
              </div>

              {/* Job list */}
              {workflowJobs.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Play className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No workflow jobs yet.</p>
                  <p className="text-xs mt-1">Click "Run a workflow" to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workflowJobs.map(job => {
                    const isInProgress = job.status === 'in-progress';
                    const isCompleted = job.status === 'completed';
                    return (
                      <div key={job.id} className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center gap-4">
                        {/* Status icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          isInProgress ? 'bg-blue-50' : isCompleted ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          {isInProgress && (
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                          {job.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                        </div>

                        {/* Name + record */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{job.workflowType.name}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-sm text-gray-600 truncate">{job.borrowerName}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {isInProgress
                              ? `Started ${formatDate(job.startedAt)}`
                              : isCompleted
                                ? `Completed ${formatDate(job.completedAt!)}`
                                : `Failed ${formatDate(job.completedAt!)}`}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                          isInProgress ? 'bg-blue-50 text-blue-700' : isCompleted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {isInProgress ? 'In Progress' : isCompleted ? 'Completed' : 'Failed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Records Tab Content */}
          {activeTab === 'records' && (
            <>
              {/* Action bar — appears when records are selected */}
              {selectedRecordsForChat.length > 0 && (
                <div className="flex items-center justify-between bg-[#f0f4f2] border border-[#c8d8d2] rounded-lg px-4 py-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#455a4f]" />
                    <span className="text-sm text-[#455a4f] font-medium">
                      {selectedRecordsForChat.length === 1
                        ? `${selectedRecordsForChat[0].name} selected`
                        : `${selectedRecordsForChat.length} records selected`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setSelectedRecordsForChat([]); setActiveDossierTab(null); }}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => launchChat(selectedRecordsForChat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Chat
                    </button>
                  </div>
                </div>
              )}

              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg text-gray-900">Records</h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:w-80 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent bg-white"
                    />
                  </div>
                  <button
                    onClick={() => launchChat(filteredBorrowers)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#455a4f] text-[#455a4f] text-sm rounded-lg hover:bg-[#f0f4f2] transition-colors flex-shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    Chat with all
                  </button>
                  <button
                    onClick={() => {
                      setShowNewRecordModal(true);
                      setNewRecordStep('method');
                      setUploadedRecordDocs([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    New Record
                  </button>
                </div>
              </div>

              {/* Portfolio Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 w-8">
                          <button
                            onClick={() => {
                              const allSelected = filteredBorrowers.every(b => selectedRecordsForChat.some(r => r.id === b.id));
                              setSelectedRecordsForChat(allSelected ? [] : filteredBorrowers);
                            }}
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                              filteredBorrowers.length > 0 && filteredBorrowers.every(b => selectedRecordsForChat.some(r => r.id === b.id))
                                ? 'bg-[#455a4f] border-[#455a4f]'
                                : filteredBorrowers.some(b => selectedRecordsForChat.some(r => r.id === b.id))
                                ? 'bg-[#455a4f]/40 border-[#455a4f]'
                                : 'border-gray-300 hover:border-[#455a4f]'
                            }`}
                          >
                            {filteredBorrowers.length > 0 && filteredBorrowers.every(b => selectedRecordsForChat.some(r => r.id === b.id)) && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            {filteredBorrowers.some(b => selectedRecordsForChat.some(r => r.id === b.id)) &&
                             !filteredBorrowers.every(b => selectedRecordsForChat.some(r => r.id === b.id)) && (
                              <div className="w-2 h-0.5 bg-white rounded" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Record</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date Added</th>
                        <th className="px-4 py-3 w-20" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBorrowers.map((borrower) => {
                        const isChecked = selectedRecordsForChat.some(r => r.id === borrower.id);
                        return (
                          <tr key={borrower.id} className="group border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 w-8">
                              <button
                                onClick={() => toggleRecordForChat(borrower)}
                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-[#455a4f] border-[#455a4f]'
                                    : 'border-gray-300 hover:border-[#455a4f]'
                                }`}
                              >
                                {isChecked && (
                                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-900">{borrower.name}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(borrower.dateAdded)}</td>
                            <td className="px-4 py-3 w-20 text-right">
                              <button
                                onClick={() => launchChat([borrower])}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#455a4f] font-medium hover:underline flex items-center gap-1 ml-auto"
                              >
                                Chat
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Run a Workflow Modal */}
      {showRunWorkflowModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => { setShowRunWorkflowModal(false); setRunWorkflowStep('type'); setPendingWorkflowType(null); }} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {runWorkflowStep === 'record' && (
                    <button onClick={() => { setRunWorkflowStep('type'); setPendingWorkflowType(null); }} className="text-gray-400 hover:text-gray-600 mr-1">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-base font-medium text-gray-900">
                      {runWorkflowStep === 'type' ? 'Select a workflow' : `Select a record — ${pendingWorkflowType?.name}`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {runWorkflowStep === 'type' ? 'Choose the workflow type to run' : 'Choose which record to run this workflow on'}
                    </p>
                  </div>
                </div>
                <button onClick={() => { setShowRunWorkflowModal(false); setRunWorkflowStep('type'); setPendingWorkflowType(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Pick workflow type */}
              {runWorkflowStep === 'type' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {workflowTypes.map(wf => (
                    <button
                      key={wf.id}
                      onClick={() => { setPendingWorkflowType(wf); setRunWorkflowStep('record'); }}
                      className="w-full text-left border border-gray-200 rounded-lg px-4 py-3 hover:border-[#455a4f] hover:bg-[#f8faf9] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{wf.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{wf.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs text-gray-400">{wf.totalSteps} steps</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#455a4f]" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Pick record */}
              {runWorkflowStep === 'record' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {mockBorrowers.map(borrower => (
                    <button
                      key={borrower.id}
                      onClick={() => pendingWorkflowType && launchWorkflowJob(pendingWorkflowType, borrower)}
                      className="w-full text-left border border-gray-200 rounded-lg px-4 py-3 hover:border-[#455a4f] hover:bg-[#f8faf9] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{borrower.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{borrower.assetClass} · {borrower.noteNumber}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            borrower.status === 'Active' ? 'bg-green-100 text-green-700' : borrower.status === 'Renewal' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
                          }`}>{borrower.status}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#455a4f]" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* New Record Modal */}
      {showNewRecordModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => {
              setShowNewRecordModal(false);
              setNewRecordStep('method');
              setUploadedRecordDocs([]);
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
                    <h2 className="text-lg font-medium text-gray-900">Add New Record</h2>
                    
                  </div>
                  <button
                    onClick={() => {
                      setShowNewRecordModal(false);
                      setNewRecordStep('method');
                      setUploadedRecordDocs([]);
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
                {newRecordStep === 'method' && (
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
                            Connect your folder and automatically pull in all relevant deal documents.
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
                      onClick={() => setNewRecordStep('upload')}
                      className="w-full border-2 border-[#455a4f] rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#455a4f] rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Manual Upload</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Upload documents from your computer. AI will extract all relevant information.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Check className="w-4 h-4" />
                            <span>Upload multiple files at once</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                            <Check className="w-4 h-4" />
                            <span>AI-powered borrower identification</span>
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
                {newRecordStep === 'upload' && (
                  <div className="space-y-4 flex flex-col h-full">
                    

                    <div
                      onClick={() => newRecordFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#455a4f] hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-base text-gray-900 mb-1 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 50MB each</p>
                      
                      <input
                        ref={newRecordFileInputRef}
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
                            setUploadedRecordDocs([...uploadedRecordDocs, ...newDocs]);
                          }
                        }}
                      />
                    </div>

                    {uploadedRecordDocs.length > 0 && (
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-900">Uploaded Documents ({uploadedRecordDocs.length})</h3>
                          <button
                            onClick={() => setUploadedRecordDocs([])}
                            className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                          {uploadedRecordDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                  <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => setUploadedRecordDocs(uploadedRecordDocs.filter((_, i) => i !== idx))}
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
                              setIsProcessingRecord(true);
                              setShowNewRecordModal(false);
                              setUploadedRecordDocs([]);
                              setNewRecordStep('method');
                              
                              // Simulate AI processing completion after 5 seconds
                              setTimeout(() => {
                                setIsProcessingRecord(false);
                                // In real implementation, this would add the record to the list
                              }, 5000);
                            }}
                            disabled={uploadedRecordDocs.length === 0}
                            className="w-full px-6 py-3 bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              Submit & Process with AI
                            </span>
                          </button>
                          
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <CommercialLendingSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}