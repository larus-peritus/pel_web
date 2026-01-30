/**
 * PhaseBreakdown Component for Pension-Aware FIRE Calculator
 *
 * Displays detailed breakdown of each retirement phase with:
 * - Phase name, age range, and duration
 * - Income sources breakdown (savings, returns, pensions)
 * - Monthly expenses
 * - Surplus/deficit indicator
 * - Funding requirements at start and end
 * - Collapsible cards for cleaner view
 *
 * Color coding matches timeline:
 * - Gap phase: Red/Orange border
 * - Séreign bridge: Amber border
 * - Full pension: Green border
 */

'use client';

import React, { useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';
import type { RetirementPhase } from '@/types/pensionAwareFire';

export interface PhaseBreakdownProps {
  /** Array of retirement phases to display (optional, gets from context if not provided) */
  phases?: RetirementPhase[];
  /** Optional className for styling */
  className?: string;
}

/**
 * Get border color class for phase card based on phase type
 */
function getPhaseBorderColor(phaseId: string): string {
  switch (phaseId) {
    case 'gap':
      return 'border-red-300'; // Gap phase (self-funded)
    case 'sereign-bridge':
      return 'border-amber-300'; // Séreign bridge
    case 'full-pension':
      return 'border-green-300'; // Full pension
    default:
      return 'border-neutral-300';
  }
}

/**
 * Get background gradient for phase header
 */
function getPhaseHeaderGradient(phaseId: string): string {
  switch (phaseId) {
    case 'gap':
      return 'bg-gradient-to-r from-red-50 to-orange-50';
    case 'sereign-bridge':
      return 'bg-gradient-to-r from-amber-50 to-yellow-50';
    case 'full-pension':
      return 'bg-gradient-to-r from-green-50 to-emerald-50';
    default:
      return 'bg-neutral-50';
  }
}

/**
 * Get phase number from phase array
 */
function getPhaseNumber(phases: RetirementPhase[], currentPhase: RetirementPhase): number {
  return phases.indexOf(currentPhase) + 1;
}

/**
 * PhaseBreakdown Component
 */
export function PhaseBreakdown({ phases: propPhases, className }: PhaseBreakdownProps) {
  const { pensionAwareFireResults } = useCalculator();

  // Use props if provided, otherwise get from context
  const phases = propPhases ?? pensionAwareFireResults?.phases ?? [];

  // Track which phase cards are expanded
  const [expandedPhases, setExpandedPhases] = React.useState<Set<string>>(new Set());

  // Update expanded phases when phases data changes
  useEffect(() => {
    if (phases.length > 0) {
      setExpandedPhases(new Set(phases.map((p) => p.id)));
    }
  }, [phases.length]);

  /**
   * Toggle phase card expansion
   */
  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  /**
   * Expand all phases
   */
  const expandAll = () => {
    setExpandedPhases(new Set(phases.map((p) => p.id)));
  };

  /**
   * Collapse all phases
   */
  const collapseAll = () => {
    setExpandedPhases(new Set());
  };

  // If no phases, show empty state
  if (!phases || phases.length === 0) {
    return (
      <Card className={className}>
        <CardContent>
          <p className="text-neutral-600 text-center py-8">
            Engar eftirlaunafasar til að sýna.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with expand/collapse controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">
          Yfirlit eftir stigum
        </h2>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            type="button"
          >
            Opna öll
          </button>
          <span className="text-neutral-300">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            type="button"
          >
            Loka öllum
          </button>
        </div>
      </div>

      {/* Phase cards */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const isExpanded = expandedPhases.has(phase.id);
          const phaseNumber = getPhaseNumber(phases, phase);
          const borderColor = getPhaseBorderColor(phase.id);
          const headerGradient = getPhaseHeaderGradient(phase.id);

          return (
            <Card
              key={phase.id}
              variant="outlined"
              className={cn('border-2', borderColor)}
            >
              {/* Phase Header */}
              <CardHeader
                className={cn(
                  'cursor-pointer hover:opacity-80 transition-opacity',
                  headerGradient
                )}
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex items-center justify-between">
                  {/* Phase name and duration */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-neutral-700">
                        Stig {phaseNumber}:
                      </span>
                      <span className="text-lg font-semibold text-neutral-900">
                        {phase.nameIs}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <span>
                        ({phase.startAge}-{phase.endAge} ára)
                      </span>
                      <span className="px-2 py-0.5 bg-white rounded-md font-medium">
                        {phase.durationYears} ár
                      </span>
                    </div>
                  </div>

                  {/* Expand/collapse icon */}
                  <svg
                    className={cn(
                      'h-5 w-5 text-neutral-600 transition-transform',
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </CardHeader>

              {/* Phase Details (collapsible) */}
              {isExpanded && (
                <CardContent className="space-y-4">
                  {/* Income and Expenses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income Sources */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                        Tekjur
                      </h3>
                      <div className="space-y-2">
                        {/* Savings withdrawal */}
                        {phase.incomeSources.savingsWithdrawal > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              • Sparnaður úttekt:
                            </span>
                            <span className="font-medium text-neutral-900">
                              {formatCurrency(phase.incomeSources.savingsWithdrawal)} kr
                            </span>
                          </div>
                        )}

                        {/* Investment returns */}
                        {phase.incomeSources.investmentReturns > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              • Ávöxtun:
                            </span>
                            <span className="font-medium text-neutral-900">
                              ~{formatCurrency(phase.incomeSources.investmentReturns)} kr
                            </span>
                          </div>
                        )}

                        {/* Séreign */}
                        {phase.incomeSources.sereign > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              • Séreign:
                            </span>
                            <span className="font-medium text-neutral-900">
                              {formatCurrency(phase.incomeSources.sereign)} kr
                            </span>
                          </div>
                        )}

                        {/* Lífeyrissjóður */}
                        {phase.incomeSources.lifeyrissjodur > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              • Lífeyrissjóður:
                            </span>
                            <span className="font-medium text-neutral-900">
                              {formatCurrency(phase.incomeSources.lifeyrissjodur)} kr
                            </span>
                          </div>
                        )}

                        {/* TR */}
                        {phase.incomeSources.tr > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              • TR:
                            </span>
                            <span className="font-medium text-neutral-900">
                              {formatCurrency(phase.incomeSources.tr)} kr
                            </span>
                          </div>
                        )}

                        {/* Total income */}
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-200">
                          <span className="font-semibold text-neutral-700">
                            Samtals:
                          </span>
                          <span className="font-bold text-neutral-900">
                            ~{formatCurrency(phase.incomeSources.total)} kr/mán
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expenses */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                        Útgjöld
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">
                            • Mánaðarleg:
                          </span>
                          <span className="font-medium text-neutral-900">
                            {formatCurrency(phase.monthlyExpenses)} kr
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-200">
                          <span className="font-semibold text-neutral-700">
                            Samtals:
                          </span>
                          <span className="font-bold text-neutral-900">
                            {formatCurrency(phase.monthlyExpenses)} kr/mán
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Surplus/Deficit Indicator */}
                  {phase.hasSurplus && phase.surplusAmount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div className="text-sm">
                        <span className="font-semibold text-green-900">
                          Afgangur:{' '}
                        </span>
                        <span className="text-green-700">
                          {formatCurrency(phase.surplusAmount)} kr/mán
                        </span>
                      </div>
                    </div>
                  )}

                  {!phase.hasSurplus && phase.incomeSources.total < phase.monthlyExpenses && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div className="text-sm">
                        <span className="font-semibold text-red-900">
                          Halli:{' '}
                        </span>
                        <span className="text-red-700">
                          {formatCurrency(phase.monthlyExpenses - phase.incomeSources.total)} kr/mán
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Funding Requirements */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                      Fjármögnunarþörf
                    </h3>

                    <div className="space-y-2">
                      {/* Required at start */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          Þörf í upphafi stigs:
                        </span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(phase.requiredAtStart)} kr
                        </span>
                      </div>

                      {/* Remaining at end */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          Staða í lok stigs:
                        </span>
                        <span
                          className={cn(
                            'font-semibold',
                            phase.remainingAtEnd > 0
                              ? 'text-green-600'
                              : 'text-neutral-900'
                          )}
                        >
                          ~{formatCurrency(phase.remainingAtEnd)} kr
                          {phase.remainingAtEnd > 0 &&
                            phases.indexOf(phase) < phases.length - 1 &&
                            ' (flutt í næsta stig)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
