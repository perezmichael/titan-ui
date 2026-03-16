import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { ConnectorsView } from './ConnectorsView';
import { UploadsView } from './UploadsView';
import { AgentsView } from './AgentsView';
import { TPRMWorkbench } from './TPRMWorkbench';
import { CommercialLendingWorkspace } from './CommercialLendingWorkspace';
import { ChevronRight, Menu } from 'lucide-react';
import { useIsMobile } from './ui/use-mobile';

interface SelectedDocument {
  id: string;
  name: string;
  source: string;
  type: string;
  lastUpdated: string;
  size: string;
}

export default function App() {
  const [activeConversationId, setActiveConversationId] = useState('new-chat');
  const [activeView, setActiveView] = useState<'chat' | 'agents' | 'connectors' | 'uploads' | 'commercial-lending' | 'knowledge-base' | 'tprm'>('chat');
  const [selectedDocument, setSelectedDocument] = useState<SelectedDocument | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [initialBorrowerId, setInitialBorrowerId] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStarted, setUploadStarted] = useState<boolean>(false);
  const hasStartedUploadRef = useRef<boolean>(false);
  const progressRef = useRef<number>(0);
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Handle upload progress - runs independently of which view is active
  useEffect(() => {
    if (uploadStarted && !hasStartedUploadRef.current) {
      console.log('🚀 Starting upload process in App');
      hasStartedUploadRef.current = true;
      progressRef.current = 0;
      
      // Update progress every 100ms for smooth animation
      const interval = setInterval(() => {
        progressRef.current = Math.min(progressRef.current + (100 / 80), 100); // 8000ms / 100ms = 80 steps
        console.log('📊 Progress:', progressRef.current, 'Step:', Math.ceil(progressRef.current * 7 / 100));
        setUploadProgress(progressRef.current);
        
        if (progressRef.current >= 100) {
          clearInterval(interval);
          setUploadCompleted(true);
          console.log('✅ Upload complete');
        }
      }, 100);
      
      return () => {
        console.log('🛑 Cleaning up interval in App');
        clearInterval(interval);
      };
    }
  }, [uploadStarted]);

  const handleDocumentSelect = (document: SelectedDocument) => {
    setSelectedDocument(document);
    setActiveView('chat');
    // Start a new conversation with this document
    setActiveConversationId('new-with-doc');
  };

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
    // Clear document when switching to a different conversation (unless it's new-chat)
    if (id !== 'new-with-doc' && id !== 'new-chat') {
      setSelectedDocument(null);
    }
    // Clear notification dot when user opens the upload-processing conversation
    if (id === 'upload-processing') {
      setUploadCompleted(false);
    }
  };

  const handleChatNavigate = (chatId: string) => {
    setActiveConversationId(chatId);
    setActiveView('chat');
    setSelectedDocument(null);
  };

  return (
    <div className="flex h-screen bg-[#f5f5f3]">
      {/* Mobile: backdrop when sidebar open */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      {/* Mobile: hamburger button when sidebar is closed */}
      {isMobile && sidebarCollapsed && (
        <button
          className="fixed top-3 left-3 z-30 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          onClick={() => setSidebarCollapsed(false)}
        >
          <Menu className="w-4 h-4 text-gray-600" />
        </button>
      )}
      <Sidebar
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        uploadCompleted={uploadCompleted}
        uploadProgress={uploadProgress}
        uploadStarted={uploadStarted}
        agentContext={activeView === 'commercial-lending' ? 'commercial-lending' : activeView === 'tprm' ? 'tprm' : null}
      />
      {activeView === 'chat' && (
        <ChatArea 
          conversationId={activeConversationId} 
          selectedDocument={selectedDocument}
          onClearDocument={() => setSelectedDocument(null)}
          onChatNavigate={handleChatNavigate}
          onUploadComplete={() => setUploadCompleted(true)}
          onUploadProgressChange={setUploadProgress}
          onUploadStart={() => setUploadStarted(true)}
          uploadProgress={uploadProgress}
        />
      )}
      {activeView === 'connectors' && (
        <ConnectorsView 
          onDocumentSelect={handleDocumentSelect}
        />
      )}
      {activeView === 'uploads' && (
        <UploadsView 
          onDocumentSelect={handleDocumentSelect}
          onChatNavigate={handleChatNavigate}
        />
      )}
      {activeView === 'agents' && (
        <AgentsView 
          onDocumentSelect={handleDocumentSelect}
          onChatNavigate={handleChatNavigate}
          onAgentLaunch={(agentId, recordId) => {
            if (agentId === 'commercial-lending') {
              setInitialBorrowerId(recordId);
              setActiveView('commercial-lending');
            } else if (agentId === 'knowledge-base') {
              setActiveView('knowledge-base');
            } else if (agentId === 'tprm') {
              setActiveView('tprm');
            }
          }}
        />
      )}
      {activeView === 'commercial-lending' && (
        <CommercialLendingWorkspace
          onBack={() => { setActiveView('agents'); setInitialBorrowerId(undefined); }}
          initialBorrowerId={initialBorrowerId}
        />
      )}
      {activeView === 'knowledge-base' && (
        <ConnectorsView 
          onDocumentSelect={handleDocumentSelect}
          initialConnector="atlas"
        />
      )}
      {activeView === 'tprm' && (
        <TPRMWorkbench 
          onBack={() => setActiveView('agents')}
        />
      )}
    </div>
  );
}