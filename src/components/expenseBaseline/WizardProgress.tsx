'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface WizardProgressProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
  currentCategoryName: string;
}

/**
 * WizardProgress - Visual progress indicator for wizard steps
 *
 * Shows current step number, category name, and a progress bar.
 * Includes ARIA attributes for accessibility.
 */
export function WizardProgress({
  currentStep,
  totalSteps,
  currentCategoryName,
}: WizardProgressProps) {
  // Calculate progress percentage (0-100)
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Display step number (1-indexed for user)
  const displayStep = currentStep + 1;

  return (
    <div className="w-full">
      {/* Step counter */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-700">
          Skref {displayStep} af {totalSteps}
        </p>
        <p className="text-sm text-neutral-600">{currentCategoryName}</p>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={displayStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Framvinda: Skref ${displayStep} af ${totalSteps} - ${currentCategoryName}`}
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className={cn(
            'h-full rounded-full bg-primary-500 transition-all duration-300 ease-out'
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress percentage (screen reader only) */}
      <p className="sr-only">
        {Math.round(progressPercentage)}% lokið
      </p>
    </div>
  );
}
