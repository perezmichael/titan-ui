import { FileText, BookOpen, Plus, Settings, X, Trash2, UserPlus, ArrowLeft } from 'lucide-react';
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

export function AgentsView({ onDocumentSelect, onChatNavigate, onAgentLaunch }: AgentsViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
    }
  };

  const handleAddUser = (agentId: string) => {
    if (!newUserEmail.trim()) return;
    
    const newUser: AgentAccess = {
      userId: `user-${Date.now()}`,
      userName: newUserEmail.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      email: newUserEmail,
      role: newUserRole,
    };
    
    setAgentAccess({
      ...agentAccess,
      [agentId]: [...(agentAccess[agentId] || []), newUser],
    });
    setNewUserEmail('');
    setNewUserRole('user');
  };

  const handleRemoveUser = (agentId: string, userId: string) => {
    setAgentAccess({
      ...agentAccess,
      [agentId]: agentAccess[agentId].filter(user => user.userId !== userId),
    });
  };

  const handleUpdateUserRole = (agentId: string, userId: string, role: 'admin' | 'user') => {
    setAgentAccess({
      ...agentAccess,
      [agentId]: agentAccess[agentId].map(user => 
        user.userId === userId ? { ...user, role } : user
      ),
    });
  };

  const selectedAgentData = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;

  // Show settings view
  if (settingsOpen) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
        {/* Settings Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                setSelectedAgent(null);
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl text-gray-900">Agent Management</h1>
              <p className="text-sm text-gray-500">Configure agents and manage access</p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Agent List Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Button
                onClick={handleAddAgent}
                className="w-full bg-[#455a4f] hover:bg-[#3a4a42] text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Agent
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                    selectedAgent === agent.id
                      ? 'bg-[#455a4f] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  type="button"
                >
                  <div className="text-sm font-medium truncate">{agent.name}</div>
                  <div className={`text-xs mt-0.5 ${
                    selectedAgent === agent.id ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    {agentAccess[agent.id]?.length || 0} users
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Agent Details */}
          <div className="flex-1 overflow-y-auto bg-[#f5f5f3]">
            {selectedAgentData ? (
              <div className="p-6">
                {/* Agent Info Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-900">Agent Details</h3>
                    {agents.length > 2 && (
                      <Button
                        onClick={() => handleDeleteAgent(selectedAgent)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Agent
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="agent-name" className="text-sm text-gray-700 mb-1.5">
                        Agent Name
                      </Label>
                      <Input
                        id="agent-name"
                        value={selectedAgentData.name}
                        onChange={(e) => handleUpdateAgent(selectedAgent, 'name', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="agent-description" className="text-sm text-gray-700 mb-1.5">
                        Description
                      </Label>
                      <Textarea
                        id="agent-description"
                        value={selectedAgentData.description}
                        onChange={(e) => handleUpdateAgent(selectedAgent, 'description', e.target.value)}
                        className="bg-white min-h-[80px]"
                      />
                    </div>
                    
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <Label htmlFor="agent-enabled" className="text-sm text-gray-900 font-medium">
                          Agent Status
                        </Label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {selectedAgentData.enabled 
                            ? 'Agent is active and can be launched by users' 
                            : 'Agent is disabled and cannot be launched'}
                        </p>
                      </div>
                      <Switch
                        id="agent-enabled"
                        checked={selectedAgentData.enabled}
                        onCheckedChange={() => handleToggleAgentEnabled(selectedAgent)}
                        className="data-[state=checked]:bg-[#455a4f]"
                      />
                    </div>
                  </div>
                </div>

                {/* Access Management Section */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Access Management</h3>
                  
                  {/* Add User */}
                  <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter email address"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="bg-white"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddUser(selectedAgent);
                            }
                          }}
                        />
                      </div>
                      <Select value={newUserRole} onValueChange={(value: 'admin' | 'user') => setNewUserRole(value)}>
                        <SelectTrigger className="w-32 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleAddUser(selectedAgent)}
                        className="bg-[#455a4f] hover:bg-[#3a4a42] text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* User List */}
                  <div className="space-y-2">
                    {(agentAccess[selectedAgent] || []).map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(value: 'admin' | 'user') => handleUpdateUserRole(selectedAgent, user.userId, value)}
                          >
                            <SelectTrigger className="w-28 h-8 text-xs bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <button
                            onClick={() => handleRemoveUser(selectedAgent, user.userId)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            type="button"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {(!agentAccess[selectedAgent] || agentAccess[selectedAgent].length === 0) && (
                      <div className="text-center py-8 text-sm text-gray-500">
                        No users have access to this agent yet
                      </div>
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

  // Show main agents view
  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl text-gray-900 mb-1">Agents</h1>
            <p className="text-sm text-gray-500">Your AI-powered banking colleagues</p>
          </div>
          
          {/* Settings Icon */}
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
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl">
          {/* Dynamically render all agents */}
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors mb-4"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#455a4f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {agent.description}
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Launch Button */}
                    <button 
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        agent.enabled
                          ? 'bg-[#455a4f] text-white hover:bg-[#3a4a42] cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => agent.enabled && onAgentLaunch?.(agent.id)}
                      disabled={!agent.enabled}
                      type="button"
                    >
                      Launch Agent
                    </button>
                    
                    {/* Enable/Disable Toggle */}
                    <button
                      onClick={() => handleToggleAgentEnabled(agent.id)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                        agent.enabled
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-[#455a4f] text-[#455a4f] hover:bg-[#455a4f] hover:text-white'
                      }`}
                      type="button"
                    >
                      {agent.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
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
  );
}