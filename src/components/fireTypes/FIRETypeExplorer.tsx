/**
 * FIRETypeExplorer - Main Page Component
 *
 * Orchestrates all FIRE Type Explorer sections into a complete calculator page.
 * Integrates with CalculatorContext for state management and localStorage persistence.
 *
 * Epic 9, Task 9.1
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { WhatIsFIRE } from './WhatIsFIRE';
import { ExpenseBaselineStatus } from './ExpenseBaselineStatus';
import { FIRETypeDetailModal } from './FIRETypeDetailModal';
import { Sparkles } from 'lucide-react';
import type { FIRETypeId, FIRECalculation } from '@/types/fireTypes';
import { DEFAULT_FIRE_ASSUMPTIONS } from '@/types/fireTypes';
import { calculateAllFIRETypes } from '@/lib/calculations/fireTypes';
import { FIRE_TYPE_DEFINITIONS } from '@/lib/constants/fireTypes';
import type { ExpenseTier } from '@/types/expenseBaseline';
import { formatCurrency } from '@/lib/utils/formatters';

interface FIRETypeExplorerProps {
  /** Optional: Show back button for integration in calculator hub */
  onBack?: () => void;
}

// Type for the calculated results
type FIREResults = {
  leanfire: FIRECalculation;
  regularfire: FIRECalculation;
  coastfire: FIRECalculation;
  baristafire: FIRECalculation;
  fatfire: FIRECalculation;
};

export function FIRETypeExplorer({ onBack }: FIRETypeExplorerProps) {
  const {
    expenseBaselineResults,
    fireTypePreferences,
    updateFIRETypePreferences,
  } = useCalculator();

  // Section refs for smooth scrolling
  const definitionsSectionRef = useRef<HTMLDivElement>(null);

  // Modal state for detailed FIRE type information
  const [detailModalType, setDetailModalType] = useState<FIRETypeId | null>(null);

  // Calculate FIRE types when inputs change
  const [calculatedResults, setCalculatedResults] = useState<FIREResults | null>(null);

  /**
   * Check if we have the minimum required data
   */
  const hasExpenseBaseline = expenseBaselineResults !== null;
  const canCalculate = hasExpenseBaseline;

  /**
   * Get current selected tier (default to comfortable)
   */
  const currentTier: ExpenseTier = 'comfortable';

  /**
   * Get current assumptions (merge defaults with any custom overrides)
   */
  const currentAssumptions = {
    ...DEFAULT_FIRE_ASSUMPTIONS,
    ...(fireTypePreferences?.customAssumptions || {}),
  };

  /**
   * Recalculate when inputs change
   */
  useEffect(() => {
    if (!canCalculate || !expenseBaselineResults) {
      setCalculatedResults(null);
      return;
    }

    try {
      // Build UserFinancialInputs from expense baseline results
      const userInputs = {
        currentAge: 30,
        targetRetirementAge: 65,
        currentNetWorth: 0,
        annualIncome: 6_000_000, // Default annual income
        annualSavings: 1_200_000, // Default annual savings
        savingsRate: 20, // Default 20%
        monthlyExpenses: {
          barebones: expenseBaselineResults.totals.barebones,
          comfortable: expenseBaselineResults.totals.comfortable,
          deluxe: expenseBaselineResults.totals.deluxe,
        },
      };

      const results = calculateAllFIRETypes(
        userInputs,
        currentAssumptions
      );
      setCalculatedResults(results);
    } catch (error) {
      console.error('Failed to calculate FIRE types:', error);
      setCalculatedResults(null);
    }
  }, [canCalculate, expenseBaselineResults, fireTypePreferences?.customAssumptions, currentTier, currentAssumptions]);

  /**
   * Handle FIRE type selection
   */
  const handleSelectType = (typeId: FIRETypeId) => {
    updateFIRETypePreferences({
      ...fireTypePreferences,
      selectedType: typeId,
    });
  };

  /**
   * Handle "Learn More" click - open detail modal
   */
  const handleLearnMore = (typeId: FIRETypeId) => {
    setDetailModalType(typeId);
  };

  // Get FIRE type display info
  const fireTypeInfo: Record<FIRETypeId, { name: string; description: string; icon: string }> = {
    leanfire: {
      name: 'Lean FIRE',
      description: 'Lágmarks útgjöld, snögg leið til frelsis',
      icon: '🎯',
    },
    regularfire: {
      name: 'Regular FIRE',
      description: 'Þægileg lífsgæði með jafnvægi',
      icon: '🔥',
    },
    coastfire: {
      name: 'Coast FIRE',
      description: 'Slepptu sparnaði, láttu vaxtavexti vinna',
      icon: '🏖️',
    },
    baristafire: {
      name: 'Barista FIRE',
      description: 'Hlutastarf með fjármagni að baki',
      icon: '☕',
    },
    fatfire: {
      name: 'Fat FIRE',
      description: 'Lúxus lífsstíll án áhyggja',
      icon: '💎',
    },
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Container size="lg">
          {/* Back Button (if integrated in calculator hub) */}
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors mb-6"
            >
              <span>←</span>
              <span>Til baka í FIRE reiknivélalista</span>
            </button>
          )}

          <div className="text-center space-y-4 py-8 md:py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-full text-sm font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>FIRE Leiðarvísir</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Finndu þína FIRE-leið
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Kannaðu fimm mismunandi leiðir til fjármálafrelsis og veldu þá sem
              hentar þínum lífsstíl, tekjum og markmiðum best.
            </p>
          </div>
        </Container>
      </Section>

      {/* What is FIRE Section */}
      <Section>
        <Container size="lg">
          <WhatIsFIRE defaultExpanded={!hasExpenseBaseline} />
        </Container>
      </Section>

      {/* Expense Baseline Status */}
      <Section className="bg-gray-50">
        <Container size="lg">
          <ExpenseBaselineStatus />
        </Container>
      </Section>

      {/* Missing Baseline Alert */}
      {!hasExpenseBaseline && (
        <Section>
          <Container size="lg">
            <Alert variant="info">
              <div>
                <h3 className="font-semibold mb-2">
                  Engin útgjaldagrunnur fannst
                </h3>
                <p className="mb-3">
                  Til að fá nákvæma FIRE útreikninga þarftu að setja upp útgjaldagrunn fyrst.
                  Það gerir þér kleift að bera saman FIRE tölur fyrir mismunandi lífsstíl.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = '/reiknivaelir?tab=fire&calc=utgjaldareiknivel'}
                >
                  Setja upp útgjaldagrunn
                </Button>
              </div>
            </Alert>
          </Container>
        </Section>
      )}

      {/* FIRE Type Definitions Section */}
      <div ref={definitionsSectionRef}>
        <Section className="bg-gradient-to-b from-white to-gray-50">
          <Container size="xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Fimm leiðir til fjármálafrelsis
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hver FIRE tegund hefur sína kosti og galla. Veldu þá sem passar þér best.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Object.keys(fireTypeInfo) as FIRETypeId[]).map((typeId) => {
                const info = fireTypeInfo[typeId];
                const calc = calculatedResults?.[typeId];
                const isSelected = fireTypePreferences?.selectedType === typeId;

                return (
                  <div
                    key={typeId}
                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow'
                    }`}
                    onClick={() => handleSelectType(typeId)}
                  >
                    <div className="text-3xl mb-3">{info.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {info.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {info.description}
                    </p>

                    {calc && (
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">FIRE tala:</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(calc.fiNumber)}
                          </span>
                        </div>
                        {calc.yearsToFI !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Ár til FIRE:</span>
                            <span className="font-semibold text-gray-900">
                              {calc.yearsToFI.toFixed(1)} ár
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearnMore(typeId);
                      }}
                      className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Sjá meira →
                    </button>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>
      </div>

      {/* Detail Modal */}
      {detailModalType && (
        <FIRETypeDetailModal
          definition={FIRE_TYPE_DEFINITIONS.find((d) => d.id === detailModalType) || null}
          onClose={() => setDetailModalType(null)}
        />
      )}
    </>
  );
}
