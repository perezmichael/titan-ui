import { Menu, Bot, Plug, MessageSquare, Upload, ChevronLeft, ChevronRight, Play, FileText, Layers, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TitanLogo } from './TitanLogo';
import { useIsMobile } from './ui/use-mobile';

type SidebarVariant = 'A' | 'B' | 'C' | 'D';

const MATRIX_CHARS = 'ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ012345789';

function MatrixRow({ seed }: { seed: number }) {
  const chars = Array.from({ length: 18 }, (_, i) =>
    MATRIX_CHARS[(seed * 7 + i * 13) % MATRIX_CHARS.length]
  ).join(' ');
  return (
    <div className="text-[8px] font-mono text-[#00ff41]/20 tracking-widest whitespace-nowrap overflow-hidden select-none">
      {chars}
    </div>
  );
}

type ConvType = 'chat' | 'workflow' | 'records' | 'document';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  type?: ConvType;
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
  agentSessions?: Array<{ id: string; title: string; preview: string; timestamp: string }>;
}

export function Sidebar({ activeConversationId, onConversationSelect, activeView, onViewChange, collapsed, onToggleCollapse, uploadCompleted, uploadProgress, uploadStarted, agentContext, agentSessions }: SidebarProps) {
  const isMobile = useIsMobile();
  const [variant, setVariant] = useState<SidebarVariant>('A');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  const agentName = agentContext === 'commercial-lending' ? 'Commercial Lending' : 'TPRM';

  const agentStrip = agentContext ? (
    <>
      {/* Option A — green gradient */}
      {variant === 'A' && (
        <div className="bg-gradient-to-r from-[#3a5c45] to-[#4d7a5e] px-3 py-2.5">
          <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest mb-0.5">Agent Workspace</p>
          <p className="text-xs font-semibold text-white">{agentName}</p>
        </div>
      )}

      {/* Option B — light tint bg, agent name pinned above list */}
      {variant === 'B' && (
        <div className="bg-[#f0f4f2] border-b border-[#c8d8d2] px-3 py-2.5">
          <p className="text-[10px] font-medium text-[#455a4f]/60 uppercase tracking-widest mb-0.5">Agent Workspace</p>
          <p className="text-xs font-semibold text-[#455a4f]">{agentName}</p>
        </div>
      )}

      {/* Option C — muted/neutral strip, less green */}
      {variant === 'C' && (
        <div className="bg-gradient-to-r from-[#4a5568] to-[#5a6478] px-3 py-2.5">
          <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest mb-0.5">Agent Workspace</p>
          <p className="text-xs font-semibold text-white">{agentName}</p>
        </div>
      )}

      {/* Option D — Matrix / Terminal */}
      {variant === 'D' && (
        <div className="bg-black px-3 py-2 overflow-hidden relative">
          <MatrixRow seed={1} />
          <div className="relative z-10 py-1">
            <p className="text-[10px] font-mono text-[#00ff41]/70 tracking-widest mb-0.5">&gt; AGENT WORKSPACE</p>
            <p className="text-xs font-mono font-bold text-[#00ff41]" style={{ textShadow: '0 0 8px #00ff41' }}>
              {agentName}{cursorVisible ? '█' : ' '}
            </p>
          </div>
          <MatrixRow seed={42} />
        </div>
      )}
    </>
  ) : null;
  const conversationGroups: ConversationGroup[] = [
    {
      title: 'TODAY',
      conversations: [
        { id: 'upload-processing', title: 'Regulatory Filing Analysis', preview: 'Processed 6 regulatory filing documents', timestamp: '10:24 AM', type: 'document' },
        { id: '4',                 title: 'Current Fed Interest Rate',  preview: 'What is the current federal funds rate and when was it last changed?', timestamp: '9:42 AM', type: 'chat' },
        { id: '1',                 title: 'BSA AML Procedure Review',   preview: 'Reviewing 2026 BSA AML Procedure — Final.docx for compliance gaps', timestamp: '8:53 AM', type: 'chat' },
      ]
    },
    {
      title: 'THIS WEEK',
      conversations: [
        { id: '2', title: 'Training Announcement Email', preview: 'Drafted all-staff email for March compliance training rollout', timestamp: '2d ago', type: 'chat' },
        { id: '3', title: 'Loan Policy Q&A',             preview: 'Summarized key changes in the updated lending policy manual', timestamp: '3d ago', type: 'chat' },
      ]
    },
  ];

  const commercialLendingConversations: ConversationGroup[] = [
    {
      title: 'TODAY',
      conversations: [
        { id: 'cl-1', title: 'Deal QA — VFN Holdings',   preview: 'In progress · Analyzing financial statements', timestamp: '2:30 PM',  type: 'workflow' },
        { id: 'cl-2', title: 'Portfolio Q&A',             preview: 'Which loans have maturities in the next 90 days?', timestamp: '11:15 AM', type: 'chat' },
        { id: 'cl-3', title: 'VFN Holdings · Fibernet',  preview: 'Comparing DSCR and covenant status across 2 records', timestamp: '9:20 AM',  type: 'records' },
      ]
    },
    {
      title: 'THIS WEEK',
      conversations: [
        { id: 'cl-4', title: 'Annual Review — GH3 Cler', preview: 'Completed · No exceptions found', timestamp: '2d ago', type: 'workflow' },
        { id: 'cl-5', title: 'New Record — Q4 Financials', preview: 'VFN Holdings Inc · AI extracted 14 data points', timestamp: '2d ago', type: 'document' },
      ]
    },
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

      {/* Divider */}
      {!collapsed && <div className="border-t border-gray-200" />}

      {/* Conversations */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {agentStrip}

          {/* Live sessions from this visit */}
          {agentContext && agentSessions && agentSessions.length > 0 && (
            <div className="mb-1">
              <div className="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">Just now</div>
              {agentSessions.map(session => (
                <div key={session.id} className="w-full px-3 py-2 text-left hover:bg-gray-200/50 flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#455a4f] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div className="text-xs text-gray-900 truncate">{session.title}</div>
                      <div className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">{session.timestamp}</div>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{session.preview}</div>
                  </div>
                </div>
              ))}
              <div className="mx-3 my-1 border-t border-gray-200" />
            </div>
          )}

          {/* Conversation groups (Today + This Week only) */}
          {activeConversations.map((group) => {
            if (group.conversations.length === 0) return null;
            const typeDot: Record<ConvType, string> = {
              chat:     'bg-gray-400',
              workflow: 'bg-[#455a4f]',
              records:  'bg-blue-400',
              document: 'bg-amber-400',
            };
            return (
              <div key={group.title} className="mb-3">
                <div className="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">
                  {group.title}
                </div>
                {group.conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onConversationSelect(conv.id);
                      if (!agentContext) onViewChange('chat');
                    }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2 ${
                      conv.id === activeConversationId ? 'bg-gray-200/70' : 'hover:bg-gray-200/50'
                    }`}
                  >
                    {/* Type dot */}
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeDot[conv.type ?? 'chat']}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <div className="text-xs text-gray-900 truncate">{conv.title}</div>
                        <div className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                          {conv.id === 'upload-processing' && uploadStarted && uploadProgress < 100 ? '' : conv.timestamp}
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {conv.id === 'upload-processing' && uploadStarted ? (
                          uploadProgress >= 100 ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <span className="w-1 h-1 rounded-full bg-green-500" />
                              Upload complete
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              Step {Math.max(1, Math.min(Math.ceil(uploadProgress * 7 / 100), 7))} of 7
                            </span>
                          )
                        ) : (
                          <span className="line-clamp-2">{conv.preview}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Variant switcher — visible only when in agent context */}
      {!collapsed && agentContext && (
        <div className="px-3 py-2 border-t border-gray-200 flex items-center gap-1.5">
          <span className="text-[9px] text-gray-400 uppercase tracking-wide mr-1">Style</span>
          {(['A', 'B', 'C', 'D'] as SidebarVariant[]).map(v => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`w-5 h-5 text-[9px] font-bold rounded transition-colors ${
                variant === v
                  ? v === 'D' ? 'bg-black text-[#00ff41]' : 'bg-[#455a4f] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {v}
            </button>
          ))}
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