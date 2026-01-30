/**
 * Expense Baseline Calculator - Main Page Component
 *
 * Orchestrates wizard/edit modes based on user's baseline status.
 * Automatically switches between wizard mode for first-time users and
 * quick edit mode for returning users.
 *
 * EPIC 8, Task 8.1
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card, Alert } from '@/components/ui';
import { WizardModeContainer } from './WizardModeContainer';
import { QuickEditModeContainer } from './QuickEditModeContainer';
import { ResultsSummarySection } from './ResultsSummarySection';
import type { TierValues, ExpenseCategory } from '@/types/expenseBaseline';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/lib/constants/expenseBaseline';

type ViewMode = 'wizard' | 'quickEdit';

/**
 * Main component for expense baseline calculator page.
 *
 * Features:
 * - Auto-detects appropriate mode (wizard if no baseline, edit if exists)
 * - Mode toggle button ("Byrja aftur" to switch to wizard)
 * - Educational intro section (collapsible)
 * - Renders WizardModeContainer or QuickEditModeContainer based on mode
 * - Shows ResultsSummarySection below when baseline exists
 *
 * Requirements: FR-5.1, FR-5.5
 */
export function ExpenseBaselineCalculator() {
  const {
    expenseBaseline,
    expenseBaselineResults,
    updateExpenseBaseline,
    results,
  } = useCalculator();

  // Determine initial mode: wizard if no baseline or not completed wizard
  const [mode, setMode] = useState<ViewMode>(() => {
    return expenseBaseline?.wizardCompleted ? 'quickEdit' : 'wizard';
  });

  const [showEducation, setShowEducation] = useState(true);

  const actualHourlyWage = results?.actualHourlyWage || null;

  // Handle wizard completion
  const handleWizardComplete = useCallback(
    (categoryValues: Record<string, TierValues>) => {
      // Convert wizard values to ExpenseCategory array
      const categories: ExpenseCategory[] = DEFAULT_EXPENSE_CATEGORIES.map(
        (config, index) => ({
          id: config.id,
          name: config.nameIs,
          icon: config.icon,
          values: categoryValues[config.id] || config.defaults,
          isCustom: false,
          isHidden: false,
          order: index,
        })
      );

      // Update context with new baseline
      updateExpenseBaseline({
        categories,
        lastUpdated: new Date(),
        wizardCompleted: true,
        version: 1,
      });

      // Switch to quick edit mode
      setMode('quickEdit');
    },
    [updateExpenseBaseline]
  );

  // Handle wizard cancellation
  const handleWizardCancel = useCallback(() => {
    // If there's an existing baseline, go back to quick edit
    if (expenseBaseline?.wizardCompleted) {
      setMode('quickEdit');
    }
    // Otherwise, stay in wizard (first-time user can't cancel to nowhere)
  }, [expenseBaseline?.wizardCompleted]);

  // Handle "Start Fresh" button
  const handleStartWizard = useCallback(() => {
    setMode('wizard');
  }, []);

  const hasBaseline = expenseBaseline?.wizardCompleted === true;

  return (
    <div className="w-full space-y-8">
      {/* Educational Intro Section */}
      {showEducation && (
        <Card className="border-primary-200 bg-primary-50">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  📊 Hvað er útgjaldagrunnur?
                </h3>
                <p className="text-sm text-neutral-700 mb-3">
                  Útgjaldagrunnurinn skilgreinir mánaðarleg útgjöld þín á{' '}
                  <strong>þremur stigum</strong>: Lágmarks (nauðsynleg),
                  Þægilegt (æskileg), og Lúxus (draumaútgáfan). Þetta er
                  grunnur að öllum FIRE (Financial Independence, Retire Early)
                  útreikningum þínum.
                </p>
                <details className="text-sm text-neutral-700">
                  <summary className="cursor-pointer font-medium hover:text-neutral-900">
                    Lesa meira um þrjú stig...
                  </summary>
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary-300">
                    <p>
                      <strong className="text-amber-700">🟡 Lágmarks:</strong>{' '}
                      Lágmarkskostnaður til að lifa - nauðsynlegt húsnæði,
                      matur, samgöngur. Hvað þarftu í raun til að lifa af?
                    </p>
                    <p>
                      <strong className="text-green-700">🟢 Þægilegt:</strong>{' '}
                      Þægileg lífsgæði með smá svigrúmi - reglulegar
                      veitingar, ferðalög, áhugamál. Hversu miklu þarftu til
                      að vera ánægð(ur)?
                    </p>
                    <p>
                      <strong className="text-purple-700">🟣 Lúxus:</strong>{' '}
                      Draumaútgáfan - engir fjárhagslegir takmarkanir. Hversu
                      mikið myndir þú vilja ef peningar skiptu ekki máli?
                    </p>
                  </div>
                </details>
              </div>
              <button
                type="button"
                onClick={() => setShowEducation(false)}
                className="ml-4 text-neutral-500 hover:text-neutral-700"
                aria-label="Loka upplýsingum"
              >
                ✕
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* AWH Warning (if not available) */}
      {!actualHourlyWage && hasBaseline && (
        <Alert variant="info">
          <p className="text-sm">
            💡 <strong>Ábending:</strong> Reiknaðu raunverulegt tímakaup þitt
            til að sjá lífsorku-útreikninga (hversu margar vinnustundir kostar
            hver flokkur).
          </p>
        </Alert>
      )}

      {/* Mode-specific content */}
      {mode === 'wizard' ? (
        <WizardModeContainer
          onComplete={handleWizardComplete}
          onCancel={handleWizardCancel}
        />
      ) : (
        <QuickEditModeContainer onStartWizard={handleStartWizard} />
      )}

      {/* Results Summary (shown when baseline exists) */}
      {hasBaseline && mode === 'quickEdit' && expenseBaselineResults && (
        <div className="mt-12">
          <ResultsSummarySection
            baseline={expenseBaseline}
            results={expenseBaselineResults}
            actualHourlyWage={actualHourlyWage}
          />
        </div>
      )}
    </div>
  );
}
