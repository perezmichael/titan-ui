import { Search, Plus, Bot, Plug, MessageSquare, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { TitanLogo } from './TitanLogo';
import { Button } from './ui/button';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface ConversationGroup {
  title: string;
  conversations: Conversation[];
}

interface SidebarProps {
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  activeView: 'chat' | 'agents' | 'connectors' | 'uploads' | 'commercial-lending';
  onViewChange: (view: 'chat' | 'agents' | 'connectors' | 'uploads') => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  uploadCompleted?: boolean;
  uploadProgress?: number;
  uploadStarted?: boolean;
  agentContext?: 'commercial-lending' | 'tprm' | null;
}

export function Sidebar({ activeConversationId, onConversationSelect, activeView, onViewChange, collapsed, onToggleCollapse, uploadCompleted, uploadProgress, uploadStarted, agentContext }: SidebarProps) {
  const conversationGroups: ConversationGroup[] = [
    {
      title: 'TODAY',
      conversations: [
        {
          id: 'upload-processing',
          title: 'Regulatory Filing Analysis',
          preview: '6 regulatory filing documents',
          timestamp: '10:24 AM'
        },
        {
          id: '4',
          title: 'Current Fed Interest Rate',
          preview: 'What is the current federal funds rate and when was it last changed?',
          timestamp: '9:42 AM'
        },
        {
          id: '3',
          title: 'AI Assistant Core Capabilities',
          preview: 'AI there! How can I assist you today?',
          timestamp: '10:08 AM'
        },
        {
          id: '1',
          title: 'BSA AML Procedure Review',
          preview: 'Can you help me review this procedure? 2026 BSA AML Procedure - Final.docx',
          timestamp: '8:53 AM'
        }
      ]
    },
    {
      title: 'THIS WEEK',
      conversations: [
        {
          id: '2',
          title: 'Training Announcement Email',
          preview: 'Can you help me write an email about the upcoming...',
          timestamp: '2d ago'
        }
      ]
    },
    {
      title: 'LAST WEEK',
      conversations: [
        {
          id: '5',
          title: 'AI Assistant Core Capabilities Overvi...',
          preview: 'I my browse windows',
          timestamp: '2w ago'
        },
        {
          id: '6',
          title: 'Handling Sensitive Information',
          preview: 'Good! I\'ll exercise caution',
          timestamp: '2w ago'
        }
      ]
    },
    {
      title: 'LAST MONTH',
      conversations: [
        {
          id: '7',
          title: 'Handling Personal Information ...',
          preview: 'If person mentions a bank',
          timestamp: '2w ago'
        },
        {
          id: '8',
          title: 'New Chat',
          preview: 'my vin is 123-123-2234',
          timestamp: '2w ago'
        },
        {
          id: '9',
          title: 'Requesting Information or Details',
          preview: 'not you sure are single customer',
          timestamp: '3w ago'
        }
      ]
    }
  ];

  const commercialLendingConversations: ConversationGroup[] = [
    {
      title: 'TODAY',
      conversations: [
        {
          id: 'cl-1',
          title: 'VFN Holdings Inc - Deal QA',
          preview: 'Completed Deal QA workflow for note 12345678-001',
          timestamp: '2:30 PM'
        },
        {
          id: 'cl-2',
          title: 'Credit Memo Analysis',
          preview: 'Analyze the key risk factors in the VFN Holdings credit memo...',
          timestamp: '11:15 AM'
        },
        {
          id: 'cl-3',
          title: 'Annual Review - VFN Holdings',
          preview: 'Started Annual Review workflow for relationship 87654321-002',
          timestamp: '9:20 AM'
        }
      ]
    },
    {
      title: 'THIS WEEK',
      conversations: [
        {
          id: 'cl-4',
          title: 'Financial Statement Upload',
          preview: 'Processed Q4 2025 financials for VFN Holdings Inc',
          timestamp: '2d ago'
        }
      ]
    },
    {
      title: 'LAST WEEK',
      conversations: [
        {
          id: 'cl-5',
          title: 'Covenant Compliance Check',
          preview: 'Review debt service coverage ratio calculations...',
          timestamp: '5d ago'
        },
        {
          id: 'cl-6',
          title: 'Loan Modification Request',
          preview: 'Started workflow for note 23456789-003 modification',
          timestamp: '6d ago'
        }
      ]
    }
  ];

  const activeConversations = agentContext === 'commercial-lending' ? commercialLendingConversations : conversationGroups;

  return (
    <div className={`bg-[#efeeeb] flex flex-col h-screen border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-[60px]' : 'w-[240px]'}`}>
      {/* Header */}
      <div className={`border-b border-gray-200 flex flex-col items-center ${collapsed ? 'py-4 gap-4' : 'p-3 gap-2'}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2 w-full">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600" onClick={onToggleCollapse}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <TitanLogo className="h-4" collapsed={false} />
          </div>
        ) : (
          <>
            <TitanLogo className="h-4" collapsed={true} />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600" onClick={onToggleCollapse}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Main Menu */}
      <div className={`${collapsed ? 'py-4 flex flex-col items-center gap-1' : 'py-2 px-2 flex flex-col gap-0.5'}`}>
        {/* New Chat — primary action, visually distinct */}
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start rounded-lg border'} flex items-center gap-2.5 transition-colors ${
            activeView === 'chat'
              ? 'bg-[#455a4f] border-[#455a4f] text-white'
              : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => { onViewChange('chat'); onConversationSelect('new-chat'); }}
          title={collapsed ? "New Chat" : ""}
        >
          <Plus className={`w-4 h-4 flex-shrink-0 ${activeView === 'chat' ? 'text-white' : 'text-gray-600'}`} />
          {!collapsed && <span className="text-xs font-medium">New Chat</span>}
        </button>

        {/* Agents */}
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start rounded-lg'} flex items-center gap-2.5 transition-colors ${
            activeView === 'agents' || activeView === 'commercial-lending' || activeView === 'tprm'
              ? 'bg-[#455a4f] text-white'
              : 'hover:bg-gray-200/70 text-gray-700'
          }`}
          onClick={() => onViewChange('agents')}
          title={collapsed ? "Agents" : ""}
        >
          <Bot className={`w-4 h-4 flex-shrink-0 ${activeView === 'agents' || activeView === 'commercial-lending' || activeView === 'tprm' ? 'text-white' : 'text-gray-700'}`} />
          {!collapsed && <span className="text-xs font-medium">Agents</span>}
        </button>

        {/* Connectors */}
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start rounded-lg'} flex items-center gap-2.5 transition-colors ${
            activeView === 'connectors' || activeView === 'knowledge-base'
              ? 'bg-[#455a4f] text-white'
              : 'hover:bg-gray-200/70 text-gray-700'
          }`}
          onClick={() => onViewChange('connectors')}
          title={collapsed ? "Connectors" : ""}
        >
          <Plug className={`w-4 h-4 flex-shrink-0 ${activeView === 'connectors' || activeView === 'knowledge-base' ? 'text-white' : 'text-gray-700'}`} />
          {!collapsed && <span className="text-xs font-medium">Connectors</span>}
        </button>

        {/* Uploads */}
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start rounded-lg'} flex items-center gap-2.5 transition-colors ${
            activeView === 'uploads'
              ? 'bg-[#455a4f] text-white'
              : 'hover:bg-gray-200/70 text-gray-700'
          }`}
          onClick={() => onViewChange('uploads')}
          title={collapsed ? "Your Uploads" : ""}
        >
          <Upload className={`w-4 h-4 flex-shrink-0 ${activeView === 'uploads' ? 'text-white' : 'text-gray-700'}`} />
          {!collapsed && <span className="text-xs font-medium">Your Uploads</span>}
        </button>
      </div>

      {/* Divider */}
      {!collapsed && <div className="border-t border-gray-200" />}

      {/* Conversations */}
      {!collapsed && (
        <div className={`flex-1 overflow-y-auto ${agentContext ? 'bg-[#fef6ed] border-l-4 border-orange-400' : ''}`}>
          {agentContext && (
            <div className="px-3 py-3 border-b border-orange-200 bg-orange-50/50">
              <div className="text-xs font-medium text-gray-900">
                {agentContext === 'commercial-lending' ? 'Commercial Lending Agent' : 'TPRM Agent'}
              </div>
              <div className="text-[10px] text-orange-700 mt-0.5">Agent Activity History</div>
            </div>
          )}
          {(() => {
            // Get first 3 conversations across all groups
            const allConversations = activeConversations.flatMap(g => g.conversations);
            const first3Ids = allConversations.slice(0, 3).map(c => c.id);
            
            return activeConversations.map((group) => {
              const visibleConversations = group.conversations.filter(conv => first3Ids.includes(conv.id));
              if (visibleConversations.length === 0) return null;
              
              return (
                <div key={group.title} className="mb-3">
                  <div className="px-3 py-1 text-[10px] text-gray-500 uppercase tracking-wide">
                    {group.title}
                  </div>
                  {visibleConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onConversationSelect(conv.id);
                        onViewChange('chat');
                      }}
                      className={`w-full px-3 py-2 text-left relative ${ 
                        conv.id === activeConversationId 
                          ? agentContext 
                            ? 'bg-gray-300/70' 
                            : 'bg-gray-200/70' 
                          : agentContext 
                            ? 'hover:bg-gray-300/50' 
                            : 'hover:bg-gray-200/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-900 truncate">{conv.title}</div>
                          {conv.id === 'upload-processing' && uploadProgress === 100 && conv.id !== activeConversationId && (
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 whitespace-nowrap">{conv.timestamp}</div>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {conv.id === 'upload-processing' ? (
                          uploadStarted ? (
                            uploadProgress >= 100 ? (
                              <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                  Upload complete
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                <span>Step {Math.max(1, Math.min(Math.ceil(uploadProgress * 7 / 100), 7))} of 7 complete</span>
                              </div>
                            )
                          ) : (
                            <div className="line-clamp-2">{conv.preview}</div>
                          )
                        ) : (
                          <div className="line-clamp-2">{conv.preview}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* User Section */}
      {!collapsed && (
        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#455a4f] rounded-full flex items-center justify-center text-white text-xs">
              TB
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-900">Tom Barr</div>
              <div className="text-[10px] text-gray-500 truncate">tom@titanbanking.ai</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}