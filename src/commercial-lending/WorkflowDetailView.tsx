import { useState } from 'react';
import { Plus, CheckCircle2, Clock, ChevronRight, Send } from 'lucide-react';

interface WorkflowRun {
  id: string;
  recordName: string;
  noteNumber: string;
  startedDate: string;
  completedDate?: string;
  status: 'in-progress' | 'completed';
  completedSteps: number;
  totalSteps: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface WorkflowDetailViewProps {
  workflowId: string;
  workflowName: string;
  onStartWorkflow: (workflowId: string) => void;
}

export function WorkflowDetailView({ workflowId, workflowName, onStartWorkflow }: WorkflowDetailViewProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [showNewRunModal, setShowNewRunModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Mock workflow runs
  const workflowRuns: WorkflowRun[] = [
    {
      id: 'run-1',
      recordName: 'VFN Holdings Inc',
      noteNumber: '20240001-001',
      startedDate: '2026-03-10',
      completedDate: '2026-03-10',
      status: 'completed',
      completedSteps: 7,
      totalSteps: 7
    },
    {
      id: 'run-2',
      recordName: 'Fibernet Solutions LLC',
      noteNumber: '20240078-001',
      startedDate: '2026-03-08',
      completedDate: '2026-03-08',
      status: 'completed',
      completedSteps: 7,
      totalSteps: 7
    },
    {
      id: 'run-3',
      recordName: 'GH3 Cler SNU',
      noteNumber: '20230045-001',
      startedDate: '2026-03-05',
      status: 'in-progress',
      completedSteps: 4,
      totalSteps: 7
    }
  ];

  // Mock messages for chatbot
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Deal QA Workflow. Select a workflow run from the left to get started, or click the + button to start a new workflow run.',
      timestamp: new Date().toISOString()
    }
  ]);

  // Available records for new workflow runs
  const availableRecords = [
    { id: '1', name: 'VFN Holdings Inc', noteNumber: '20240001-001' },
    { id: '2', name: 'GH3 Cler SNU', noteNumber: '20230045-001' },
    { id: '3', name: 'Fibernet Solutions LLC', noteNumber: '20240078-001' },
    { id: '4', name: 'Retail Plaza Holdings', noteNumber: '20230122-001' },
    { id: '5', name: 'Healthcare Properties Inc', noteNumber: '20240055-001' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const getRunStatusBadge = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I can help you with the Deal QA workflow. What would you like to know?',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex h-full bg-[#f5f5f3]">
      {/* Left Panel - Workflow Runs */}
      <div className="w-80 bg-[#efeeeb] border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-medium text-gray-900">{workflowName}</h2>
            <button
              onClick={() => setShowNewRunModal(true)}
              className="p-1.5 bg-[#455a4f] text-white rounded-md hover:bg-[#3a4a42] transition-colors"
              title="Start new workflow run"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600">{workflowRuns.length} workflow run{workflowRuns.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {workflowRuns.map((run) => (
            <div 
              key={run.id}
              onClick={() => setSelectedRunId(run.id)}
              className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${
                selectedRunId === run.id 
                  ? 'bg-white border-[#455a4f] shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="text-sm font-medium text-gray-900 truncate">{run.recordName}</h5>
                  {getRunStatusBadge(run.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <span>{run.noteNumber}</span>
                </div>
                <div className="text-[10px] text-gray-500">
                  Started {formatDate(run.startedDate)}
                  {run.completedDate && ` • Completed ${formatDate(run.completedDate)}`}
                </div>
                {run.status === 'in-progress' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                      <span>{run.completedSteps} of {run.totalSteps} steps</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-[#455a4f] h-1 rounded-full transition-all"
                        style={{ width: `${(run.completedSteps / run.totalSteps) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chatbot */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-base font-medium text-gray-900">Workflow Assistant</h3>
          <p className="text-sm text-gray-600 mt-0.5">Ask questions about your workflow runs</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-[#455a4f] text-white' 
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-white border border-gray-300 rounded-lg focus-within:border-[#455a4f] focus-within:ring-1 focus-within:ring-[#455a4f]">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about workflow steps, results, or start a new run..."
                  className="w-full px-4 py-3 resize-none border-0 focus:outline-none focus:ring-0 text-sm"
                  rows={3}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="px-4 py-3 bg-[#455a4f] text-white rounded-lg hover:bg-[#3a4a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Run Modal */}
      {showNewRunModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNewRunModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Start New {workflowName}</h3>
              <p className="text-sm text-gray-600 mt-1">Select a record to run this workflow</p>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {availableRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => {
                      onStartWorkflow(workflowId);
                      setShowNewRunModal(false);
                    }}
                    className="w-full text-left p-3 bg-gray-50 rounded border border-gray-200 hover:border-[#455a4f] hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{record.noteNumber}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowNewRunModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
