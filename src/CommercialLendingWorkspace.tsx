import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BorrowerPortfolioList } from './commercial-lending/BorrowerPortfolioList';
import { BorrowerDealView } from './commercial-lending/BorrowerDealView';
import { WorkflowDetailView } from './commercial-lending/WorkflowDetailView';
import { CommercialLendingSettings } from './commercial-lending/CommercialLendingSettings';

export interface AgentSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface CommercialLendingWorkspaceProps {
  onBack: () => void;
  onSessionCreated?: (session: AgentSession) => void;
}

export type CLView = 'portfolio' | 'deal-view' | 'workflow-detail' | 'settings';

export interface Facility {
  id: string;
  noteNumber: string;
  loanType: string;
  balance: number;
  commitment: number;
  interestRate: string;
  maturityDate: string;
  assetClass: string;
  status: 'Active' | 'Renewal' | 'Payoff';
}

export interface SelectedBorrower {
  id: string;
  name: string;
  cipCode: string;
  relationshipId?: string;
  noteNumber: string;
  loanOfficer?: string;
  underwriter?: string;
  facilities?: Facility[];
}

export function CommercialLendingWorkspace({ onBack, onSessionCreated }: CommercialLendingWorkspaceProps) {
  const [currentView, setCurrentView] = useState<CLView>('portfolio');
  const [selectedBorrower, setSelectedBorrower] = useState<SelectedBorrower | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedWorkflowName, setSelectedWorkflowName] = useState<string>('');

  const handleBorrowerSelect = (borrower: SelectedBorrower) => {
    setSelectedBorrower(borrower);
    setCurrentView('deal-view');
  };

  const handleBackToPortfolio = () => {
    setSelectedBorrower(null);
    setCurrentView('portfolio');
  };

  const handleWorkflowOpen = (workflowId: string, workflowName: string) => {
    setSelectedWorkflowId(workflowId);
    setSelectedWorkflowName(workflowName);
    setCurrentView('workflow-detail');
  };

  const handleBackFromWorkflow = () => {
    setSelectedWorkflowId(null);
    setSelectedWorkflowName('');
    setCurrentView('portfolio');
  };

  const handleStartWorkflow = (workflowId: string) => {
    console.log('Starting workflow:', workflowId);
    // TODO: Implement workflow start logic
  };

  const handleSettingsOpen = () => {
    setCurrentView('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentView('portfolio');
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {currentView === 'portfolio' && (
        <BorrowerPortfolioList
          onBorrowerSelect={handleBorrowerSelect}
          onBack={onBack}
          onWorkflowOpen={handleWorkflowOpen}
          onSettingsOpen={handleSettingsOpen}
          onSessionCreated={onSessionCreated}
        />
      )}
      {currentView === 'deal-view' && selectedBorrower && (
        <BorrowerDealView
          borrower={selectedBorrower}
          onBack={handleBackToPortfolio}
        />
      )}
      {currentView === 'workflow-detail' && selectedWorkflowId && (
        <WorkflowDetailView
          workflowId={selectedWorkflowId}
          workflowName={selectedWorkflowName}
          onStartWorkflow={handleStartWorkflow}
        />
      )}
      {currentView === 'settings' && (
        <CommercialLendingSettings
          onBack={handleBackFromSettings}
        />
      )}
    </div>
  );
}