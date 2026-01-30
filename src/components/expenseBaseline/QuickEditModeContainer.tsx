'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { TierTabSelector } from './TierTabSelector';
import { CategoryEditList } from './CategoryEditList';
import type { ExpenseTier } from '@/types/expenseBaseline';

export interface QuickEditModeContainerProps {
  onStartWizard: () => void; // Reset and start wizard
}

/**
 * Quick Edit Mode Container Component
 *
 * Main container for returning users who want to quickly edit their
 * expense baseline without going through the wizard flow.
 *
 * Features:
 * - Three tier tabs (Lágmarks | Þægilegt | Lúxus)
 * - Active tier state management
 * - Total display for active tier
 * - "Start fresh" button to switch to wizard mode
 * - Responsive layout
 *
 * Requirements: FR-5.5, US-1
 */
export function QuickEditModeContainer({
  onStartWizard,
}: QuickEditModeContainerProps) {
  const [activeTier, setActiveTier] = useState<ExpenseTier>('comfortable');

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Útgjaldagrunnur
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Breyta útgjöldum þínum eftir þremur stigum
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={onStartWizard}
          className="w-full sm:w-auto"
        >
          <span className="mr-1">↺</span>
          Byrja aftur
        </Button>
      </div>

      {/* Tier Tab Selector */}
      <div className="mb-6">
        <TierTabSelector
          activeTier={activeTier}
          onSelectTier={setActiveTier}
        />
      </div>

      {/* Category Edit List */}
      <CategoryEditList activeTier={activeTier} />
    </div>
  );
}
