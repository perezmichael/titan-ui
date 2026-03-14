import { useState } from 'react';
import { ArrowLeft, Upload, FileText, Trash2, Save, X } from 'lucide-react';

interface WorkflowEditorProps {
  workflow: {
    id: string;
    name: string;
    description: string;
    markdownContent: string;
    documents?: Array<{
      id: string;
      name: string;
      dateAdded: string;
    }>;
  };
  onBack: () => void;
  onSave: (workflow: any) => void;
}

export function WorkflowEditor({ workflow, onBack, onSave }: WorkflowEditorProps) {
  const [workflowName, setWorkflowName] = useState(workflow.name);
  const [workflowDescription, setWorkflowDescription] = useState(workflow.description);
  const [markdownContent, setMarkdownContent] = useState(workflow.markdownContent);
  const [documents, setDocuments] = useState(workflow.documents || [
    { id: '1', name: 'Credit Agreement Template.docx', dateAdded: '2024-02-15' },
    { id: '2', name: 'QA Checklist.pdf', dateAdded: '2024-01-20' },
  ]);

  const handleSave = () => {
    onSave({
      ...workflow,
      name: workflowName,
      description: workflowDescription,
      markdownContent,
      documents
    });
    onBack();
  };

  const handleDocumentUpload = () => {
    // Mock document upload
    const newDoc = {
      id: (documents.length + 1).toString(),
      name: 'New Document.pdf',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Workflows
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Workflow Name
            </label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Markdown Editor */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">Workflow Instructions (Markdown)</h3>
          </div>
          <div className="p-6">
            <textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="# Workflow Title&#10;&#10;## Overview&#10;Description of the workflow...&#10;&#10;## Steps&#10;&#10;### Step 1: ...&#10;Instructions for step 1..."
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#455a4f] focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Reference Documents Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Reference Documents</h3>
            <button
              onClick={handleDocumentUpload}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#455a4f] text-white text-xs rounded-lg hover:bg-[#3a4a42] transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-6">
            Upload document templates, checklists, and other reference materials for this workflow.
          </p>

          {documents.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">Added {doc.dateAdded}</p>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg py-12 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mx-auto mb-3 shadow-sm">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No documents yet</p>
              <p className="text-xs text-gray-500">Click "Upload Document" to add reference materials</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}