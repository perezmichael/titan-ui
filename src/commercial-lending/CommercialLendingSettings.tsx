import { useState } from 'react';
import { X, Users, FileText, Database, GitBranch, Plus, Trash2, Settings, Upload, FolderOpen, Check, Pencil, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { WorkflowEditor } from './WorkflowEditor';

interface CommercialLendingSettingsProps {
  onBack: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  markdownContent: string;
}

interface KnowledgeDocument {
  id: string;
  name: string;
  dateAdded: string;
  source: 'Manual' | 'Connector';
}

interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  format?: string;
  extractionInstructions?: string;
  subFields?: SchemaField[];
}

interface SchemaVersion {
  version: string;
  date: string;
  changedBy: string;
  changes: string;
  status: 'Current' | 'Previous';
}

export function CommercialLendingSettings({ onBack }: CommercialLendingSettingsProps) {
  const [activeSection, setActiveSection] = useState<'setup' | 'permissions' | 'schema' | 'knowledge' | 'actions'>('setup');
  
  // Agent Setup state
  const [agentName, setAgentName] = useState('Commercial Lending Agent');
  const [agentPrompt, setAgentPrompt] = useState(`You are a Commercial Lending Agent at Axiom Bank. Your purpose is to assist with commercial loan portfolio management, deal analysis, and credit decision support.

Key Responsibilities:
- Analyze borrower financial data and credit profiles
- Review loan documentation and extract key information
- Provide insights on risk ratings and creditworthiness
- Support deal structuring and underwriting processes
- Monitor covenant compliance and portfolio performance

Guidelines:
- Always maintain accuracy when extracting data from documents
- Follow all regulatory and compliance requirements
- Provide clear, actionable recommendations
- Flag any potential risks or concerns immediately
- Use the note number format ########-### for all loan references`);

  // User permissions state
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Sarah Chen', email: 'sarah.chen@bank.com', role: 'Admin' },
    { id: '2', name: 'Michael Torres', email: 'michael.torres@bank.com', role: 'User' },
    { id: '3', name: 'Jennifer Wu', email: 'jennifer.wu@bank.com', role: 'User' },
    { id: '4', name: 'David Park', email: 'david.park@bank.com', role: 'User' },
  ]);

  // Knowledge base state
  const [knowledgeDocuments, setKnowledgeDocuments] = useState<KnowledgeDocument[]>([
    { id: '1', name: 'Commercial Lending Policy 2024.pdf', dateAdded: '2024-01-15', source: 'Manual' },
    { id: '2', name: 'Credit Risk Guidelines.pdf', dateAdded: '2024-02-20', source: 'Manual' },
    { id: '3', name: 'Underwriting Standards.docx', dateAdded: '2024-03-10', source: 'Connector' },
  ]);

  // Workflows state
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'deal-qa',
      name: 'Deal QA',
      description: 'Comprehensive quality assurance review for loan documentation',
      markdownContent: `# Deal QA Workflow

## Overview
This workflow guides you through a comprehensive quality assurance review of loan documentation and data extraction.

## Steps

### Step 1: Document Verification
- Verify all required documents are present
- Check document dates and signatures
- Confirm document completeness

### Step 2: Data Extraction Review
- Review extracted borrower information
- Verify facility details and terms
- Check financial data accuracy

### Step 3: Compliance Check
- Verify regulatory compliance
- Review covenant structure
- Check collateral documentation

### Step 4: Risk Assessment
- Review risk rating
- Assess credit quality
- Verify underwriting standards

### Step 5: Final Approval
- Summary of findings
- Recommendation
- Sign-off requirements`
    },
    {
      id: 'annual-review',
      name: 'Annual Review',
      description: 'Systematic credit review for ongoing creditworthiness assessment',
      markdownContent: `# Annual Review Workflow

## Overview
This workflow provides a systematic approach to annual credit reviews, assessing ongoing creditworthiness, covenant compliance, and risk rating.

## Steps

### Step 1: Financial Analysis
- Review current financial statements
- Analyze financial trends
- Calculate key ratios

### Step 2: Covenant Compliance
- Review all covenant requirements
- Check compliance status
- Document any exceptions

### Step 3: Collateral Review
- Verify collateral values
- Review appraisals
- Assess collateral coverage

### Step 4: Risk Rating Assessment
- Evaluate current risk factors
- Review industry conditions
- Determine risk rating

### Step 5: Recommendation
- Provide renewal recommendation
- Suggest any modifications
- Document decision rationale`
    }
  ]);

  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [editingWorkflowContent, setEditingWorkflowContent] = useState<string>('');
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [newWorkflowContent, setNewWorkflowContent] = useState('');

  // Schema state
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { id: '1', name: 'Name', type: 'string', extractionInstructions: 'Extract the full legal business name from the Credit Agreement cover page or borrower information section. This is typically found in the preamble or first few pages.' },
    { id: '2', name: 'CIP Code', type: 'string', extractionInstructions: 'Locate the Customer Identification Program (CIP) code in the borrower profile documents or internal bank system screenshots. Usually appears as a unique alphanumeric identifier.' },
    { id: '3', name: 'Relationship ID', type: 'string', extractionInstructions: 'Find the relationship ID in the bank\'s internal customer management system reports or relationship summary documents. This is the primary identifier linking all accounts for this borrower.' },
    { id: '4', name: 'Note Number', type: 'string', format: '########-###', extractionInstructions: 'Extract from the promissory note header or loan documentation cover page. Format must be exactly 8 digits, dash, 3 digits (e.g., 12345678-001). This uniquely identifies each loan facility.' },
    { id: '5', name: 'Asset Class', type: 'string', extractionInstructions: 'Identify the asset classification from the credit memo or loan approval documents. Common values include: Commercial Real Estate, C&I (Commercial & Industrial), Equipment Finance, or Asset-Based Lending.' },
    { id: '6', name: 'Loan Officer', type: 'string', extractionInstructions: 'Look for the relationship manager or loan officer name in the credit approval memo signature block, or in the "Team" section of internal relationship documents.' },
    { id: '7', name: 'Underwriter', type: 'string', extractionInstructions: 'Find the credit underwriter\'s name in the underwriting approval section of the credit memo or loan approval documentation, typically in signature blocks or approval workflows.' },
    { id: '8', name: 'Risk Rating', type: 'number', extractionInstructions: 'Extract the risk rating (1-5 scale where 1 is lowest risk) from the credit memo\'s risk assessment section or the loan approval summary. Look for terms like "Risk Grade" or "Credit Rating".' },
    { id: '9', name: 'Total Credit Exposure', type: 'number', extractionInstructions: 'Calculate or extract total credit exposure from facility summary tables in the credit memo. Sum all committed facilities including revolving lines, term loans, and letters of credit. Usually shown in thousands or millions.' },
    { id: '10', name: 'Total Deposit Balance', type: 'number', extractionInstructions: 'Locate deposit balances in the relationship profitability analysis or account summary sections. Include all DDA (demand deposit accounts), savings, and money market balances. May be found in treasury management reports.' },
  ]);

  const [schemaVersions, setSchemaVersions] = useState<SchemaVersion[]>([
    {
      version: 'v2.1',
      date: '2026-03-10',
      changedBy: 'Sarah Chen',
      changes: 'Added totalDepositBalance field',
      status: 'Current'
    },
    {
      version: 'v2.0',
      date: '2026-02-15',
      changedBy: 'Michael Torres',
      changes: 'Updated noteNumber format validation to ########-###',
      status: 'Previous'
    },
    {
      version: 'v1.0',
      date: '2026-01-05',
      changedBy: 'Sarah Chen',
      changes: 'Initial schema created',
      status: 'Previous'
    }
  ]);

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'>('string');
  const [newFieldFormat, setNewFieldFormat] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldDescription, setNewFieldDescription] = useState('');

  const toggleUserRole = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: user.role === 'Admin' ? 'User' : 'Admin' }
        : user
    ));
  };

  const startEditingWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setEditingWorkflowId(workflowId);
      setEditingWorkflowContent(workflow.markdownContent);
    }
  };

  const saveWorkflow = () => {
    if (editingWorkflowId) {
      setWorkflows(workflows.map(w => 
        w.id === editingWorkflowId 
          ? { ...w, markdownContent: editingWorkflowContent }
          : w
      ));
      setEditingWorkflowId(null);
      setEditingWorkflowContent('');
    }
  };

  const addNewWorkflow = () => {
    if (newWorkflowName && newWorkflowContent) {
      const newWorkflow: Workflow = {
        id: newWorkflowName.toLowerCase().replace(/\s+/g, '-'),
        name: newWorkflowName,
        description: newWorkflowDescription,
        markdownContent: newWorkflowContent
      };
      setWorkflows([...workflows, newWorkflow]);
      setShowNewWorkflowModal(false);
      setNewWorkflowName('');
      setNewWorkflowDescription('');
      setNewWorkflowContent('');
    }
  };

  const addNewField = () => {
    if (newFieldName && newFieldType) {
      const newField: SchemaField = {
        id: (schemaFields.length + 1).toString(),
        name: newFieldName,
        type: newFieldType,
        format: newFieldFormat,
        required: newFieldRequired,
        description: newFieldDescription
      };
      setSchemaFields([...schemaFields, newField]);
      setShowAddFieldModal(false);
      setNewFieldName('');
      setNewFieldType('string');
      setNewFieldFormat('');
      setNewFieldRequired(false);
      setNewFieldDescription('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              Back
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-xl text-gray-900">Commercial Lending Agent Settings</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - only show when not editing a workflow */}
      {!(activeSection === 'actions' && editingWorkflowId) && (
        <div className="border-b border-gray-200 bg-white px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveSection('setup')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeSection === 'setup'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Agent Setup
              </div>
              {activeSection === 'setup' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveSection('permissions')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeSection === 'permissions'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Permissions
              </div>
              {activeSection === 'permissions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveSection('schema')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeSection === 'schema'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Extraction Schema
              </div>
              {activeSection === 'schema' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveSection('knowledge')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeSection === 'knowledge'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Knowledge Base
              </div>
              {activeSection === 'knowledge' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveSection('actions')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeSection === 'actions'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Actions
              </div>
              {activeSection === 'actions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Agent Setup Section */}
        {activeSection === 'setup' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">Agent Setup</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure the Commercial Lending Agent's name and prompt to define its behavior and responsibilities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Agent Name</h4>
              </div>
              
              <div className="px-4 py-3">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g., Commercial Lending Agent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Base Agent Prompt</h4>
              </div>
              
              <div className="px-4 py-3">
                <textarea
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  placeholder="Define the agent's purpose, responsibilities, and guidelines..."
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* User Permissions Section */}
        {activeSection === 'permissions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">User Access Control</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage who can access the Commercial Lending Agent and their permission levels.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserRole(user.id)}
                          className="text-sm text-[#455a4f] hover:underline"
                        >
                          Change to {user.role === 'Admin' ? 'User' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        )}

        {/* Extraction Schema Section */}
        {activeSection === 'schema' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">Record Extraction Schema</h3>
              <p className="text-sm text-gray-600 mb-4">
                Define the data structure for extracting information from uploaded documents. This schema determines what information the AI will look for and extract.
              </p>
            </div>

            {/* Schema Builder */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Schema Fields</h4>
                <button 
                  onClick={() => setShowAddFieldModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#455a4f] text-white text-xs rounded-md hover:bg-[#3a4a42] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Field
                </button>
              </div>
              
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Field Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Format</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Extraction Instructions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaFields.map((field) => (
                    <tr key={field.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{field.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {field.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                        {field.format || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-md">
                        <div className="line-clamp-2">
                          {field.extractionInstructions || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-[#455a4f] transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setSchemaFields(schemaFields.filter(f => f.id !== field.id))}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            

            {/* Schema Versioning */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Schema Version History</h4>
              </div>
              
              <div className="divide-y divide-gray-200">
                {schemaVersions.map((version, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{version.version}</span>
                          {version.status === 'Current' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{version.changes}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{version.date}</span>
                          <span>•</span>
                          <span>{version.changedBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base Section */}
        {activeSection === 'knowledge' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">Knowledge Base Documents</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add documents that the agent can reference when answering questions and processing records.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#455a4f] text-[#455a4f] text-sm rounded-lg hover:bg-gray-50 transition-colors">
                <FolderOpen className="w-4 h-4" />
                Add via Connector
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors">
                <Upload className="w-4 h-4" />
                Manual Upload
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Document Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Date Added</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {knowledgeDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {doc.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.source === 'Manual' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {doc.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.dateAdded}</td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Workflows Section */}
        {activeSection === 'actions' && !editingWorkflowId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Workflow Configuration</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create and manage workflows as markdown-formatted system instructions.
                </p>
              </div>
              <button 
                onClick={() => setShowNewWorkflowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Workflow
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => startEditingWorkflow(workflow.id)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-[#455a4f] transition-all text-left group"
                >
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-gray-400 group-hover:text-[#455a4f] transition-colors" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#455a4f] transition-colors">{workflow.name}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">{workflow.description}</p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#455a4f] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Editor View */}
        {activeSection === 'actions' && editingWorkflowId && (
          <div className="absolute inset-0 bg-white z-10">
            <WorkflowEditor
              workflow={workflows.find(w => w.id === editingWorkflowId)!}
              onBack={() => {
                setEditingWorkflowId(null);
                setEditingWorkflowContent('');
              }}
              onSave={(updatedWorkflow) => {
                setWorkflows(workflows.map(w => 
                  w.id === updatedWorkflow.id ? updatedWorkflow : w
                ));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}