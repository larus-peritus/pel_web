'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface WizardNavigationProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed?: boolean; // Whether user can proceed (e.g., validation passed)
}

/**
 * WizardNavigation - Navigation controls for wizard steps
 *
 * Provides Back, Skip, and Next buttons with appropriate states.
 * - Back button disabled on first step
 * - Next button shows "Næsta" or "Áfram í yfirlit" on last step
 * - Skip button always available
 * - Keyboard shortcuts: Enter for next
 */
export function WizardNavigation({
  onBack,
  onNext,
  onSkip,
  isFirstStep,
  isLastStep,
  canProceed = true,
}: WizardNavigationProps) {
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4" onKeyDown={handleKeyDown}>
      {/* Left side: Back button */}
      <div>
        {!isFirstStep && (
          <Button
            variant="secondary"
            onClick={onBack}
          >
            ← Til baka
          </Button>
        )}
      </div>

      {/* Right side: Skip and Next buttons */}
      <div className="flex items-center gap-3">
        {/* Skip button */}
        <Button
          variant="ghost"
          onClick={onSkip}
        >
          Sleppa
        </Button>

        {/* Next button */}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          {isLastStep ? 'Áfram í yfirlit →' : 'Næsta →'}
        </Button>
      </div>
    </div>
  );
}
