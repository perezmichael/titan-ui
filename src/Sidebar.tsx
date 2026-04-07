import { Search, Plus, Menu, Bot, Plug, MessageSquare, Upload, ChevronLeft, ChevronRight, ShieldCheck, BarChart2 } from 'lucide-react';
import { TitanLogo } from './TitanLogo';
import { useIsMobile } from './ui/use-mobile';

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
  activeView: 'chat' | 'agents' | 'connectors' | 'uploads' | 'commercial-lending' | 'tprm' | 'knowledge-base' | 'compliance-audit' | 'model-risk';
  onViewChange: (view: 'chat' | 'agents' | 'connectors' | 'uploads' | 'compliance-audit' | 'model-risk') => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  uploadCompleted?: boolean;
  uploadProgress?: number;
  uploadStarted?: boolean;
  agentContext?: 'commercial-lending' | 'tprm' | null;
}

export function Sidebar({ activeConversationId, onConversationSelect, activeView, onViewChange, collapsed, onToggleCollapse, uploadCompleted, uploadProgress, uploadStarted, agentContext }: SidebarProps) {
  const isMobile = useIsMobile();
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
          title: 'BSA/AML Review — VFN Holdings',
          preview: 'What does the Bank Secrecy Act require of us as a financial institution?',
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
    <div className={`bg-[#efeeeb] flex flex-col h-screen border-r border-gray-200 transition-all duration-300 ${
      isMobile
        ? collapsed
          ? 'w-0 overflow-hidden border-0'
          : 'w-[240px] fixed inset-y-0 left-0 z-50 shadow-xl'
        : collapsed
          ? 'w-[60px]'
          : 'w-[240px]'
    }`}>
      {/* Header */}
      <div className={`border-b border-gray-200 flex flex-col items-center ${collapsed ? 'py-4 gap-4' : 'p-3 gap-2'}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2 w-full">
            <button className="p-1 hover:bg-gray-200 rounded" onClick={onToggleCollapse}>
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <TitanLogo className="h-4" collapsed={false} />
          </div>
        ) : (
          <>
            <TitanLogo className="h-4" collapsed={true} />
            <button className="p-1.5 hover:bg-gray-200 rounded flex justify-center" onClick={onToggleCollapse}>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Main Menu */}
      <div className={collapsed ? 'py-4 flex flex-col items-center' : 'py-2'}>
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start'} hover:bg-gray-200/50 flex items-center gap-3 ${
            activeView === 'chat' ? 'bg-gray-200/70' : ''
          }`}
          onClick={() => {
            onViewChange('chat');
            onConversationSelect('new-chat');
          }}
          title={collapsed ? "New Chat" : ""}
        >
          <MessageSquare className="w-4 h-4 text-gray-700 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium text-gray-900">New Chat</span>}
        </button>
        
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start'} hover:bg-gray-200/50 flex items-center gap-3 ${
            activeView === 'agents' || activeView === 'commercial-lending' ? 'bg-[#455a4f]' : ''
          }`}
          onClick={() => onViewChange('agents')}
          title={collapsed ? "Agents" : ""}
        >
          <Bot className={`w-4 h-4 flex-shrink-0 ${activeView === 'agents' || activeView === 'commercial-lending' ? 'text-white' : 'text-gray-700'}`} />
          {!collapsed && <span className={`text-xs font-medium ${activeView === 'agents' || activeView === 'commercial-lending' ? 'text-white' : 'text-gray-900'}`}>Agents</span>}
        </button>
        
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start'} hover:bg-gray-200/50 flex items-center gap-3 ${
            activeView === 'connectors' ? 'bg-gray-200/70' : ''
          }`}
          onClick={() => onViewChange('connectors')}
          title={collapsed ? "Connectors" : ""}
        >
          <Plug className="w-4 h-4 text-gray-700 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium text-gray-900">Connectors</span>}
        </button>
        
        <button
          className={`${collapsed ? 'w-10 h-10 rounded-lg justify-center' : 'w-full px-3 py-2 justify-start'} hover:bg-gray-200/50 flex items-center gap-3 ${
            activeView === 'uploads' ? 'bg-gray-200/70' : ''
          }`}
          onClick={() => onViewChange('uploads')}
          title={collapsed ? "Your Uploads" : ""}
        >
          <Upload className="w-4 h-4 text-gray-700 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium text-gray-900">Your Uploads</span>}
        </button>
      </div>

      {/* Oversight Section */}
      {!collapsed && (
        <div className="border-t border-gray-200">
          <div className="px-3 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Oversight</span>
          </div>
          <div className="pb-2">
            <button
              className={`w-full px-3 py-2 justify-start hover:bg-gray-200/50 flex items-center gap-3 ${
                activeView === 'compliance-audit' ? 'bg-gray-200/70' : ''
              }`}
              onClick={() => onViewChange('compliance-audit')}
            >
              <ShieldCheck className="w-4 h-4 text-gray-700 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-900">Audit Log</span>
            </button>
            <button
              className={`w-full px-3 py-2 justify-start hover:bg-gray-200/50 flex items-center gap-3 ${
                activeView === 'model-risk' ? 'bg-gray-200/70' : ''
              }`}
              onClick={() => onViewChange('model-risk')}
            >
              <BarChart2 className="w-4 h-4 text-gray-700 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-900">Model Health</span>
            </button>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="py-2 flex flex-col items-center border-t border-gray-200 gap-1">
          <button
            className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200/50 ${activeView === 'compliance-audit' ? 'bg-gray-200/70' : ''}`}
            onClick={() => onViewChange('compliance-audit')}
            title="Audit Log"
          >
            <ShieldCheck className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200/50 ${activeView === 'model-risk' ? 'bg-gray-200/70' : ''}`}
            onClick={() => onViewChange('model-risk')}
            title="Model Health"
          >
            <BarChart2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

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