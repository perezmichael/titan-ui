import { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronRight, Download } from 'lucide-react';
import type { SelectedVendor } from '../TPRMWorkbench';

interface VendorDocumentsTabProps {
  vendor: SelectedVendor;
}

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  documentDate: string;
  status: 'Analyzed' | 'Pending Review' | 'Needs Upload';
  size?: string;
}

interface DocumentCategory {
  name: string;
  documents: Document[];
  collapsed: boolean;
}

export function VendorDocumentsTab({ vendor }: VendorDocumentsTabProps) {
  const [categories, setCategories] = useState<DocumentCategory[]>([
    {
      name: 'Contracts',
      collapsed: false,
      documents: [
        {
          id: '1',
          name: 'Master Service Agreement - 2023.pdf',
          uploadDate: '2023-03-15',
          documentDate: '2023-03-01',
          status: 'Analyzed',
          size: '2.4 MB',
        },
        {
          id: '2',
          name: 'Service Level Agreement.pdf',
          uploadDate: '2023-03-15',
          documentDate: '2023-03-01',
          status: 'Analyzed',
          size: '856 KB',
        },
        {
          id: '3',
          name: 'Amendment 2024-01.pdf',
          uploadDate: '2024-01-10',
          documentDate: '2024-01-05',
          status: 'Analyzed',
          size: '423 KB',
        },
      ],
    },
    {
      name: 'SOC 2 Reports',
      collapsed: false,
      documents: [
        {
          id: '4',
          name: 'SOC2-Type-II-2024.pdf',
          uploadDate: '2024-11-05',
          documentDate: '2024-10-31',
          status: 'Analyzed',
          size: '5.2 MB',
        },
        {
          id: '5',
          name: 'SOC2-Type-II-2023.pdf',
          uploadDate: '2023-11-12',
          documentDate: '2023-10-31',
          status: 'Analyzed',
          size: '4.8 MB',
        },
      ],
    },
    {
      name: 'Policies & Procedures',
      collapsed: false,
      documents: [
        {
          id: '6',
          name: 'Information Security Policy v3.2.pdf',
          uploadDate: '2024-06-20',
          documentDate: '2024-06-01',
          status: 'Analyzed',
          size: '1.2 MB',
        },
        {
          id: '7',
          name: 'Incident Response Plan.pdf',
          uploadDate: '2024-06-20',
          documentDate: '2024-06-01',
          status: 'Analyzed',
          size: '987 KB',
        },
        {
          id: '8',
          name: 'Business Continuity Plan.pdf',
          uploadDate: '2024-06-20',
          documentDate: '2024-05-15',
          status: 'Analyzed',
          size: '1.5 MB',
        },
        {
          id: '9',
          name: 'Third Party Risk Management Policy.pdf',
          uploadDate: '2024-06-20',
          documentDate: '2024-06-01',
          status: 'Analyzed',
          size: '756 KB',
        },
      ],
    },
    {
      name: 'Insurance',
      collapsed: false,
      documents: [
        {
          id: '10',
          name: 'Cyber Liability Insurance Certificate.pdf',
          uploadDate: '2024-01-20',
          documentDate: '2024-01-15',
          status: 'Pending Review',
          size: '245 KB',
        },
        {
          id: '11',
          name: 'General Liability Certificate.pdf',
          uploadDate: '2024-01-20',
          documentDate: '2024-01-15',
          status: 'Analyzed',
          size: '198 KB',
        },
      ],
    },
    {
      name: 'Pen Test Reports',
      collapsed: false,
      documents: [
        {
          id: 'missing-1',
          name: 'Penetration Test Report - 2024',
          uploadDate: '',
          documentDate: '',
          status: 'Needs Upload',
        },
      ],
    },
    {
      name: 'Other',
      collapsed: true,
      documents: [
        {
          id: '12',
          name: 'Vendor Questionnaire Response.xlsx',
          uploadDate: '2023-02-28',
          documentDate: '2023-02-28',
          status: 'Analyzed',
          size: '124 KB',
        },
      ],
    },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const toggleCategory = (index: number) => {
    setCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, collapsed: !cat.collapsed } : cat
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Analyzed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending Review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Needs Upload':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Analyzed':
        return 'text-green-700 bg-green-50';
      case 'Pending Review':
        return 'text-yellow-700 bg-yellow-50';
      case 'Needs Upload':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-5xl space-y-6">
        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive
              ? 'border-[#455a4f] bg-green-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-900 mb-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PDF, DOCX, XLSX files up to 50MB
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors">
                Browse Files
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Sync from SharePoint
              </button>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        {categories.map((category, index) => (
          <div key={category.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(index)}
              className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {category.collapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-sm text-gray-900">{category.name}</span>
                <span className="text-xs text-gray-500">
                  ({category.documents.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {category.documents.some(d => d.status === 'Needs Upload') && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                    Action Required
                  </span>
                )}
                {category.documents.some(d => d.status === 'Pending Review') && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                    Review Needed
                  </span>
                )}
              </div>
            </button>

            {/* Category Documents */}
            {!category.collapsed && (
              <div className="divide-y divide-gray-200">
                {category.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 truncate">{doc.name}</div>
                      {doc.uploadDate && (
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500">
                            Uploaded: {doc.uploadDate}
                          </span>
                          <span className="text-xs text-gray-500">
                            Document Date: {doc.documentDate}
                          </span>
                          {doc.size && (
                            <span className="text-xs text-gray-500">{doc.size}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span>{doc.status}</span>
                      </div>
                      {doc.status !== 'Needs Upload' && (
                        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      {doc.status === 'Needs Upload' && (
                        <button className="px-3 py-1.5 bg-[#455a4f] text-white text-xs rounded hover:bg-[#3a4a42] transition-colors">
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
