import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { VendorPortfolioList } from './tprm/VendorPortfolioList';
import { VendorProfile } from './tprm/VendorProfile';
import { SMEReviewForm } from './tprm/SMEReviewForm';

interface TPRMWorkbenchProps {
  onBack: () => void;
}

export type TPRMView = 'portfolio' | 'vendor-profile' | 'sme-review';

export interface Engagement {
  id: string;
  engagementId: string;
  serviceDescription: string;
  businessUnit: string;
  riskRating: 'Critical' | 'High' | 'Moderate' | 'Low';
  irr: 'Critical' | 'High' | 'Moderate' | 'Low';
  status: 'Active' | 'Renewal' | 'Terminated';
  serviceOwner?: string;
}

export interface SelectedVendor {
  id: string;
  name: string;
  engagementId: string;
  riskRating: 'Critical' | 'High' | 'Moderate' | 'Low';
  relationshipManager?: string;
  engagements?: Engagement[];
}

export function TPRMWorkbench({ onBack }: TPRMWorkbenchProps) {
  const [currentView, setCurrentView] = useState<TPRMView>('portfolio');
  const [selectedVendor, setSelectedVendor] = useState<SelectedVendor | null>(null);

  const handleVendorSelect = (vendor: SelectedVendor) => {
    setSelectedVendor(vendor);
    setCurrentView('vendor-profile');
  };

  const handleBackToPortfolio = () => {
    setSelectedVendor(null);
    setCurrentView('portfolio');
  };

  const handleStartSMEReview = (vendorId: string) => {
    setCurrentView('sme-review');
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f5f5f3]">
      {currentView === 'portfolio' && (
        <VendorPortfolioList onVendorSelect={handleVendorSelect} onBack={onBack} />
      )}
      {currentView === 'vendor-profile' && selectedVendor && (
        <VendorProfile
          vendor={selectedVendor}
          onBack={handleBackToPortfolio}
          onStartSMEReview={handleStartSMEReview}
        />
      )}
      {currentView === 'sme-review' && selectedVendor && (
        <SMEReviewForm
          vendor={selectedVendor}
          onBack={handleBackToPortfolio}
        />
      )}
    </div>
  );
}
