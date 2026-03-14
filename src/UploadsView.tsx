import { useState } from 'react';
import { FileText, Download, Trash2, Upload as UploadIcon, MessageSquare, X, Search, ChevronDown, FileSpreadsheet, File } from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  uploadedDate: string;
  type: string;
  chatId: string;
  chatTitle: string;
}

interface UploadsViewProps {
  onDocumentSelect: (document: {
    id: string;
    name: string;
    source: string;
    type: string;
    lastUpdated: string;
    size: string;
  }) => void;
  onChatNavigate?: (chatId: string) => void;
}

export function UploadsView({ onDocumentSelect, onChatNavigate }: UploadsViewProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
    { id: '1', name: '2026 BSA AML Procedure - Draft.docx', size: '156 KB', uploadedDate: 'Nov 10, 2025', type: 'Word', chatId: '3', chatTitle: 'BSA/AML Compliance Review' },
    { id: '2', name: 'Q1 2026 Training Schedule and Details.pdf', size: '248 KB', uploadedDate: 'Nov 8, 2025', type: 'PDF', chatId: '2', chatTitle: 'Training Planning Discussion' },
    { id: '3', name: 'Compliance Review Notes.docx', size: '89 KB', uploadedDate: 'Nov 5, 2025', type: 'Word', chatId: '1', chatTitle: 'Monthly Compliance Check' },
    { id: '4', name: 'Risk Assessment Framework Q4.xlsx', size: '324 KB', uploadedDate: 'Oct 28, 2025', type: 'Excel', chatId: '5', chatTitle: 'Q4 Risk Analysis' },
    { id: '5', name: 'Customer Onboarding Guidelines.pdf', size: '412 KB', uploadedDate: 'Oct 22, 2025', type: 'PDF', chatId: '7', chatTitle: 'Onboarding Process Review' },
    { id: '6', name: 'AML Transaction Monitoring Report.xlsx', size: '892 KB', uploadedDate: 'Oct 18, 2025', type: 'Excel', chatId: '8', chatTitle: 'Transaction Monitoring Analysis' },
    { id: '7', name: 'OFAC Sanctions List Update.pdf', size: '1.2 MB', uploadedDate: 'Oct 15, 2025', type: 'PDF', chatId: '9', chatTitle: 'Sanctions Screening Updates' },
    { id: '8', name: 'Know Your Customer Policy 2026.docx', size: '178 KB', uploadedDate: 'Oct 12, 2025', type: 'Word', chatId: '11', chatTitle: 'KYC Policy Revision' },
    { id: '9', name: 'Suspicious Activity Report Template.xlsx', size: '95 KB', uploadedDate: 'Oct 8, 2025', type: 'Excel', chatId: '12', chatTitle: 'SAR Filing Process' },
    { id: '10', name: 'Third Party Risk Management Framework.pdf', size: '567 KB', uploadedDate: 'Oct 5, 2025', type: 'PDF', chatId: '14', chatTitle: 'TPRM Framework Discussion' },
    { id: '11', name: 'Regulatory Exam Prep Checklist.docx', size: '134 KB', uploadedDate: 'Oct 1, 2025', type: 'Word', chatId: '15', chatTitle: 'Exam Preparation Planning' },
    { id: '12', name: 'Anti-Money Laundering Training Deck.pdf', size: '2.3 MB', uploadedDate: 'Sep 28, 2025', type: 'PDF', chatId: '16', chatTitle: 'AML Training Materials' },
    { id: '13', name: 'Customer Due Diligence Procedures.docx', size: '203 KB', uploadedDate: 'Sep 24, 2025', type: 'Word', chatId: '18', chatTitle: 'CDD Process Update' },
    { id: '14', name: 'Enhanced Due Diligence Guidelines.pdf', size: '445 KB', uploadedDate: 'Sep 20, 2025', type: 'PDF', chatId: '19', chatTitle: 'EDD Requirements Discussion' },
    { id: '15', name: 'Wire Transfer Compliance Report.xlsx', size: '678 KB', uploadedDate: 'Sep 15, 2025', type: 'Excel', chatId: '21', chatTitle: 'Wire Transfer Review' },
    { id: '16', name: 'Bank Secrecy Act Overview 2026.pdf', size: '891 KB', uploadedDate: 'Sep 12, 2025', type: 'PDF', chatId: '22', chatTitle: 'BSA Regulatory Update' },
    { id: '17', name: 'Compliance Audit Findings Q3.docx', size: '267 KB', uploadedDate: 'Sep 8, 2025', type: 'Word', chatId: '23', chatTitle: 'Q3 Audit Review' },
    { id: '18', name: 'Financial Crimes Prevention Strategy.pdf', size: '734 KB', uploadedDate: 'Sep 5, 2025', type: 'PDF', chatId: '25', chatTitle: 'Financial Crimes Strategy' },
    { id: '19', name: 'Beneficial Ownership Requirements.docx', size: '156 KB', uploadedDate: 'Sep 1, 2025', type: 'Word', chatId: '26', chatTitle: 'BO Rule Implementation' },
    { id: '20', name: 'Transaction Monitoring Tuning Guide.xlsx', size: '423 KB', uploadedDate: 'Aug 28, 2025', type: 'Excel', chatId: '27', chatTitle: 'TM System Tuning' },
    { id: '21', name: 'Cybersecurity and Fraud Prevention.pdf', size: '1.1 MB', uploadedDate: 'Aug 24, 2025', type: 'PDF', chatId: '29', chatTitle: 'Cybersecurity Review' },
    { id: '22', name: 'Compliance Risk Assessment Matrix.xlsx', size: '289 KB', uploadedDate: 'Aug 20, 2025', type: 'Excel', chatId: '30', chatTitle: 'Risk Matrix Development' },
    { id: '23', name: 'Regulatory Change Management Log.docx', size: '198 KB', uploadedDate: 'Aug 15, 2025', type: 'Word', chatId: '31', chatTitle: 'Regulatory Changes Tracking' },
    { id: '24', name: 'Vendor Due Diligence Questionnaire.pdf', size: '345 KB', uploadedDate: 'Aug 12, 2025', type: 'PDF', chatId: '33', chatTitle: 'Vendor Assessment Process' },
    { id: '25', name: 'Internal Controls Testing Results.xlsx', size: '512 KB', uploadedDate: 'Aug 8, 2025', type: 'Excel', chatId: '34', chatTitle: 'Controls Testing Q2' }
  ]);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'last7days' | 'last30days' | 'last90days'>('all');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleView = (doc: UploadedDocument) => {
    alert(`Viewing: ${doc.name}`);
  };

  const handleChatNavigate = (chatId: string) => {
    if (onChatNavigate) {
      onChatNavigate(chatId);
    }
  };

  // Checkbox handlers
  const handleSelectAll = () => {
    if (selectedDocs.size === filteredDocuments.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(filteredDocuments.map(doc => doc.id)));
    }
  };

  const handleSelectDoc = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const handleBulkDownload = () => {
    const selectedDocsList = uploadedDocuments.filter(doc => selectedDocs.has(doc.id));
    alert(`Downloading ${selectedDocsList.length} document(s):\n${selectedDocsList.map(d => d.name).join('\n')}`);
  };

  const handleBulkDelete = () => {
    setBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    setUploadedDocuments(prev => prev.filter(doc => !selectedDocs.has(doc.id)));
    setSelectedDocs(new Set());
    setBulkDeleteConfirm(false);
  };

  const handleDownloadSingle = (doc: UploadedDocument) => {
    alert(`Downloading: ${doc.name}`);
  };

  // Filter documents based on search and date
  const filteredDocuments = uploadedDocuments.filter(doc => {
    // Search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.chatTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const uploadDate = new Date(doc.uploadedDate);
      const today = new Date('Jan 12, 2026'); // Current date from context
      const daysDiff = Math.floor((today.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'last7days') {
        matchesDate = daysDiff <= 7;
      } else if (dateFilter === 'last30days') {
        matchesDate = daysDiff <= 30;
      } else if (dateFilter === 'last90days') {
        matchesDate = daysDiff <= 90;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full pt-8 px-8">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Your Uploads</h1>
          <p className="text-sm text-gray-600">
            Manage the private documents you've uploaded to Titan. Your documents remain available for future searches and can be deleted anytime.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-6xl mx-auto w-full px-8 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 pb-8">
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UploadIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h2>
              <p className="text-sm text-gray-600 max-w-md">
                Documents you upload through chat conversations will appear here. You can view and manage them at any time.
              </p>
            </div>
          ) : (
            <div>
              {/* Bulk Actions Bar */}
              {selectedDocs.size > 0 && (
                <div className="mb-4 flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedDocs.size} {selectedDocs.size === 1 ? 'document' : 'documents'} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkDownload}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-10 px-3 py-2">
                        <input
                          type="checkbox"
                          checked={filteredDocuments.length > 0 && selectedDocs.size === filteredDocuments.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        Document Name
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        Size
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        Uploaded
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        Source Chat
                      </th>
                      <th className="px-3 py-2 text-right text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="w-10 px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={selectedDocs.has(doc.id)}
                            onChange={() => handleSelectDoc(doc.id)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            {doc.type === 'Word' && <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                            {doc.type === 'Excel' && <FileSpreadsheet className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />}
                            {doc.type === 'PDF' && <File className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />}
                            <span className="text-[13px] text-gray-900 truncate max-w-md">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-[13px] text-gray-600">{doc.type}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-[13px] text-gray-600">{doc.size}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-[13px] text-gray-600">{doc.uploadedDate}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => handleChatNavigate(doc.chatId)}
                            className="flex items-center gap-1.5 text-[13px] text-gray-700 hover:text-gray-900 hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span className="truncate max-w-[180px]">{doc.chatTitle}</span>
                          </button>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleDownloadSingle(doc)}
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              title="Download document"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete from memory"
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
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Document</h3>
                </div>
                <button
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this document from your memory? It will no longer be referenced in queries.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete {selectedDocs.size} Documents</h3>
                </div>
                <button
                  onClick={() => setBulkDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete {selectedDocs.size} {selectedDocs.size === 1 ? 'document' : 'documents'} from your memory? They will no longer be referenced in queries.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setBulkDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete {selectedDocs.size} {selectedDocs.size === 1 ? 'Document' : 'Documents'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}