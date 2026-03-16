import { FileText, Plus, Settings, X, Trash2, UserPlus, ArrowLeft, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

interface SelectedDocument {
  id: string;
  name: string;
  source: string;
  type: string;
  lastUpdated: string;
  size: string;
}

interface AgentsViewProps {
  onDocumentSelect?: (document: SelectedDocument) => void;
  onChatNavigate?: (chatId: string) => void;
  onAgentLaunch?: (agentId: string) => void;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface AgentAccess {
  userId: string;
  userName: string;
  email: string;
  role: 'admin' | 'user';
}

const skills = [
  { label: 'Review a deal', agentId: 'commercial-lending' },
  { label: 'Start annual review', agentId: 'commercial-lending' },
  { label: 'Check vendor risk', agentId: 'tprm' },
  { label: 'Onboard a vendor', agentId: 'tprm' },
  { label: 'Add a record', agentId: 'commercial-lending' },
];

export function AgentsView({ onDocumentSelect, onChatNavigate, onAgentLaunch }: AgentsViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [agentChatQuery, setAgentChatQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'commercial-lending',
      name: 'Commercial Lending Agent',
      description: 'Streamline your commercial lending workflow from portfolio analysis to deal documentation',
      icon: 'FileText',
      color: '#455a4f',
      enabled: true,
    },
    {
      id: 'tprm',
      name: 'TPRM Agent',
      description: 'Automate third-party risk management assessments, vendor onboarding, and continuous monitoring',
      icon: 'FileText',
      color: '#455a4f',
      enabled: false,
    },
  ]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentAccess, setAgentAccess] = useState<Record<string, AgentAccess[]>>({
    'commercial-lending': [
      { userId: '1', userName: 'Sarah Chen', email: 'sarah.chen@bank.com', role: 'admin' },
      { userId: '2', userName: 'Michael Rodriguez', email: 'michael.r@bank.com', role: 'user' },
      { userId: '3', userName: 'Emily Johnson', email: 'emily.j@bank.com', role: 'user' },
    ],
    'tprm': [
      { userId: '1', userName: 'Sarah Chen', email: 'sarah.chen@bank.com', role: 'admin' },
    ],
  });
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');

  const detectAgentFromQuery = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('vendor') || lower.includes('tprm') || lower.includes('risk management') || lower.includes('third party')) return 'tprm';
    return 'commercial-lending';
  };

  const handleAgentQuery = (query: string, agentId?: string) => {
    const target = agentId || detectAgentFromQuery(query);
    const agent = agents.find(a => a.id === target);
    if (agent?.enabled) {
      onAgentLaunch?.(target);
    }
  };

  const handleUpdateAgent = (agentId: string, field: 'name' | 'description', value: string) => {
    setAgents(agents.map(agent =>
      agent.id === agentId ? { ...agent, [field]: value } : agent
    ));
  };

  const handleToggleAgentEnabled = (agentId: string) => {
    setAgents(agents.map(agent =>
      agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
    ));
  };

  const handleAddAgent = () => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: 'New Agent',
      description: 'Agent description',
      icon: 'FileText',
      color: '#455a4f',
      enabled: false,
    };
    setAgents([...agents, newAgent]);
    setAgentAccess({ ...agentAccess, [newAgent.id]: [] });
    setSelectedAgent(newAgent.id);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
    const newAccess = { ...agentAccess };
    delete newAccess[agentId];
    setAgentAccess(newAccess);
    if (selectedAgent === agentId) setSelectedAgent(null);
  };

  const handleAddUser = (agentId: string) => {
    if (!newUserEmail.trim()) return;
    const newUser: AgentAccess = {
      userId: `user-${Date.now()}`,
      userName: newUserEmail.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      email: newUserEmail,
      role: newUserRole,
    };
    setAgentAccess({ ...agentAccess, [agentId]: [...(agentAccess[agentId] || []), newUser] });
    setNewUserEmail('');
    setNewUserRole('user');
  };

  const handleRemoveUser = (agentId: string, userId: string) => {
    setAgentAccess({ ...agentAccess, [agentId]: agentAccess[agentId].filter(user => user.userId !== userId) });
  };

  const handleUpdateUserRole = (agentId: string, userId: string, role: 'admin' | 'user') => {
    setAgentAccess({ ...agentAccess, [agentId]: agentAccess[agentId].map(user => user.userId === userId ? { ...user, role } : user) });
  };

  const selectedAgentData = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;

  // Settings view
  if (settingsOpen) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              type="button"
              onClick={() => { setSettingsOpen(false); setSelectedAgent(null); }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl text-gray-900">Agent Management</h1>
              <p className="text-sm text-gray-500">Configure agents and manage access</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Button onClick={handleAddAgent} className="w-full bg-[#455a4f] hover:bg-[#3a4a42] text-white" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Agent
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${selectedAgent === agent.id ? 'bg-[#455a4f] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  type="button"
                >
                  <div className="text-sm font-medium truncate">{agent.name}</div>
                  <div className={`text-xs mt-0.5 ${selectedAgent === agent.id ? 'text-gray-200' : 'text-gray-500'}`}>
                    {agentAccess[agent.id]?.length || 0} users
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#f5f5f3]">
            {selectedAgentData ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-900">Agent Details</h3>
                    {agents.length > 2 && (
                      <Button onClick={() => handleDeleteAgent(selectedAgent!)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Agent
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="agent-name" className="text-sm text-gray-700 mb-1.5">Agent Name</Label>
                      <Input id="agent-name" value={selectedAgentData.name} onChange={(e) => handleUpdateAgent(selectedAgent!, 'name', e.target.value)} className="bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="agent-description" className="text-sm text-gray-700 mb-1.5">Description</Label>
                      <Textarea id="agent-description" value={selectedAgentData.description} onChange={(e) => handleUpdateAgent(selectedAgent!, 'description', e.target.value)} className="bg-white min-h-[80px]" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <Label htmlFor="agent-enabled" className="text-sm text-gray-900 font-medium">Agent Status</Label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {selectedAgentData.enabled ? 'Agent is active and can be launched by users' : 'Agent is disabled and cannot be launched'}
                        </p>
                      </div>
                      <Switch id="agent-enabled" checked={selectedAgentData.enabled} onCheckedChange={() => handleToggleAgentEnabled(selectedAgent!)} className="data-[state=checked]:bg-[#455a4f]" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Access Management</h3>
                  <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input placeholder="Enter email address" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="bg-white" onKeyDown={(e) => { if (e.key === 'Enter') handleAddUser(selectedAgent!); }} />
                      </div>
                      <Select value={newUserRole} onValueChange={(value: 'admin' | 'user') => setNewUserRole(value)}>
                        <SelectTrigger className="w-32 bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => handleAddUser(selectedAgent!)} className="bg-[#455a4f] hover:bg-[#3a4a42] text-white">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {(agentAccess[selectedAgent!] || []).map((user) => (
                      <div key={user.userId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={user.role} onValueChange={(value: 'admin' | 'user') => handleUpdateUserRole(selectedAgent!, user.userId, value)}>
                            <SelectTrigger className="w-28 h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <button onClick={() => handleRemoveUser(selectedAgent!, user.userId)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" type="button">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!agentAccess[selectedAgent!] || agentAccess[selectedAgent!].length === 0) && (
                      <div className="text-center py-8 text-sm text-gray-500">No users have access to this agent yet</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Select an agent to manage</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main agents view
  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl text-gray-900 mb-1">Agents</h1>
            <p className="text-sm text-gray-500">Your AI-powered banking colleagues</p>
          </div>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            type="button"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Unified Intent Input */}
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Input row */}
              <div className="flex items-center gap-3 px-5 py-4">
                <Sparkles className="w-4 h-4 text-[#455a4f] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What do you need help with today?"
                  value={agentChatQuery}
                  onChange={(e) => setAgentChatQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && agentChatQuery.trim()) {
                      handleAgentQuery(agentChatQuery);
                    }
                  }}
                  className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                {agentChatQuery.trim() && (
                  <button
                    onClick={() => handleAgentQuery(agentChatQuery)}
                    className="p-1.5 bg-[#455a4f] text-white rounded-md hover:bg-[#3a4a42] transition-colors flex-shrink-0"
                    type="button"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Skill chips */}
              <div className="px-5 pb-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <span className="text-[10px] text-gray-400 self-center mr-1">Quick actions:</span>
                {skills.map((skill) => {
                  const agent = agents.find(a => a.id === skill.agentId);
                  return (
                    <button
                      key={skill.label}
                      onClick={() => handleAgentQuery(skill.label, skill.agentId)}
                      disabled={!agent?.enabled}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        agent?.enabled
                          ? 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                      type="button"
                    >
                      {skill.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Agent List */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Your Agents</p>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`bg-white rounded-lg border transition-colors ${agent.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${agent.enabled ? 'bg-[#455a4f]' : 'bg-gray-300'}`}>
                      <FileText className="w-4 h-4 text-white" />
                    </div>

                    {/* Name + description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm text-gray-900 truncate">{agent.name}</h3>
                        {!agent.enabled && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded flex-shrink-0">Disabled</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{agent.description}</p>
                    </div>

                    {/* Open button */}
                    <button
                      className={`px-4 py-2 text-xs rounded-lg transition-colors flex-shrink-0 ${
                        agent.enabled
                          ? 'bg-[#455a4f] text-white hover:bg-[#3a4a42] cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => agent.enabled && onAgentLaunch?.(agent.id)}
                      disabled={!agent.enabled}
                      type="button"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}

              {agents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No agents configured yet</p>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="mt-4 px-4 py-2 bg-[#455a4f] text-white text-sm rounded-lg hover:bg-[#3a4a42] transition-colors"
                    type="button"
                  >
                    Create Your First Agent
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
