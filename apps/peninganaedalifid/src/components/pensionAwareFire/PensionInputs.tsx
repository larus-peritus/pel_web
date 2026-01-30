/**
 * PensionInputs Component for Pension-Aware FIRE Calculator
 *
 * Three collapsible sections for pension-specific inputs:
 * A. Lífeyrissjóður (Occupational Pension)
 * B. Séreign (Private Pension)
 * C. TR Ellilífeyrir (State Pension)
 *
 * Features:
 * - Live projections for séreign balance at 60
 * - Auto-calculated TR estimate based on lífeyrissjóður
 * - "Nota dæmigerð gildi" button for quick-fill
 * - Collapsible sections with clean UI
 * - Blue/indigo color scheme
 * - All labels in Icelandic
 */

'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { cn, formatCurrency } from '@/lib/utils';
import { useCalculator } from '@/context/CalculatorContext';
import { calculateProjectedSereign, calculateTREstimate } from '@/lib/calculations/pensionAwareFire';
import {
  ICELANDIC_PENSION_SYSTEM,
  TYPICAL_PENSION_SCENARIOS,
  EMPLOYEE_CONTRIBUTION_OPTIONS,
  EMPLOYER_MATCH_OPTIONS,
} from '@/lib/constants/pensionAwareFire';
import { calculateEmployerMatch } from '@/lib/calculations/pensionAwareFire';

export interface PensionInputsProps {
  /** Optional className for styling */
  className?: string;
}

export function PensionInputs({ className }: PensionInputsProps) {
  const { pensionAwareFire, updatePensionAwareFireState } = useCalculator();

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['lifeyrissjodur', 'sereign', 'tr']) // All expanded by default
  );

  /**
   * Toggle section expansion
   */
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  /**
   * Quick-fill with typical values (average scenario)
   */
  const fillTypicalValues = () => {
    const scenario = TYPICAL_PENSION_SCENARIOS.average;

    updatePensionAwareFireState({
      lifeyrissjodur: {
        expectedMonthlyAmount: scenario.lifeyrissjodur.expectedMonthlyAmount,
        startAge: scenario.lifeyrissjodur.startAge,
      },
      sereign: {
        currentBalance: scenario.sereign.currentBalance,
        monthlyContribution: scenario.sereign.monthlyContribution,
        employeeContributionPercent: scenario.sereign.employeeContributionPercent,
        employerMatchPercent: scenario.sereign.employerMatchPercent,
      },
      tr: {
        expectFullTR: scenario.tr.expectFullTR,
        manualOverrideAmount: scenario.tr.manualOverrideAmount,
      },
    });
  };

  // Return loading state if no state
  if (!pensionAwareFire) {
    return (
      <Card className={className}>
        <CardContent>
          <p className="text-neutral-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate live projections
  const sereignProjection = calculateProjectedSereign(pensionAwareFire);
  const trEstimate = calculateTREstimate(pensionAwareFire);

  // Generate lífeyrissjóður start age options
  const lifeyrissjodurAgeOptions = [];
  for (
    let age: number = ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_EARLY_AGE;
    age <= ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_LATE_AGE;
    age++
  ) {
    lifeyrissjodurAgeOptions.push({
      value: String(age),
      label: age === ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE ? `${age} ára (venjulegt)` : `${age} ára`,
    });
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Quick-Fill Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">
          Lífeyrisupplýsingar
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={fillTypicalValues}
          className="flex items-center gap-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Nota dæmigerð gildi
        </Button>
      </div>

      {/* A. Lífeyrissjóður Section */}
      <Card variant="outlined" className="border-blue-200">
        <CardHeader
          className="cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => toggleSection('lifeyrissjodur')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="Occupational pension">
                💼
              </span>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Lífeyrissjóður (skyldusparnaður)
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Mánaðarlegar greiðslur frá lífeyrissjóði (t.d. Gildi, LSR)
                </p>
              </div>
            </div>
            <svg
              className={cn(
                'h-5 w-5 text-blue-600 transition-transform',
                expandedSections.has('lifeyrissjodur') ? 'rotate-180' : ''
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

        {expandedSections.has('lifeyrissjodur') && (
          <CardContent className="space-y-4">
            <CurrencyInput
              label="Væntanlegar mánaðarlegar greiðslur"
              value={pensionAwareFire.lifeyrissjodur.expectedMonthlyAmount}
              onChange={(value) =>
                updatePensionAwareFireState({
                  lifeyrissjodur: {
                    ...pensionAwareFire.lifeyrissjodur,
                    expectedMonthlyAmount: value,
                  },
                })
              }
              suffix="kr/mán"
              helpText="Áætlaðar mánaðarlegar greiðslur frá lífeyrissjóði þegar þú byrjar að taka út"
            />

            <Select
              label="Upphaf greiðslna"
              value={String(pensionAwareFire.lifeyrissjodur.startAge)}
              onChange={(value) =>
                updatePensionAwareFireState({
                  lifeyrissjodur: {
                    ...pensionAwareFire.lifeyrissjodur,
                    startAge: parseInt(value, 10),
                  },
                })
              }
              options={lifeyrissjodurAgeOptions}
            />

            <Alert variant="info">
              <p className="text-sm">
                <strong>Ekki viss?</strong> Flestir fá um 300.000-400.000 kr/mán frá lífeyrissjóði
                við 67 ára aldur. Hægt er að byrja fyrr (62+) með lægri greiðslum.
              </p>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* B. Séreign Section */}
      <Card variant="outlined" className="border-indigo-200">
        <CardHeader
          className="cursor-pointer hover:bg-indigo-50 transition-colors"
          onClick={() => toggleSection('sereign')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="Private pension">
                🏦
              </span>
              <div>
                <h3 className="text-lg font-semibold text-indigo-900">
                  Séreignarsparnaður (frjáls)
                </h3>
                <p className="text-sm text-indigo-700 mt-1">
                  Frjáls lífeyrirsparnaður með 2-4% mótframlagi vinnuveitanda
                </p>
              </div>
            </div>
            <svg
              className={cn(
                'h-5 w-5 text-indigo-600 transition-transform',
                expandedSections.has('sereign') ? 'rotate-180' : ''
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

        {expandedSections.has('sereign') && (
          <CardContent className="space-y-4">
            <CurrencyInput
              label="Núverandi staða"
              value={pensionAwareFire.sereign.currentBalance}
              onChange={(value) =>
                updatePensionAwareFireState({
                  sereign: {
                    ...pensionAwareFire.sereign,
                    currentBalance: value,
                  },
                })
              }
              suffix="kr"
              helpText="Núverandi staða í séreignarsparnaði"
            />

            <CurrencyInput
              label="Mánaðarlegt framlag (þitt)"
              value={pensionAwareFire.sereign.monthlyContribution}
              onChange={(value) =>
                updatePensionAwareFireState({
                  sereign: {
                    ...pensionAwareFire.sereign,
                    monthlyContribution: value,
                  },
                })
              }
              suffix="kr/mán"
              helpText="Þitt mánaðarlegt framlag í séreign"
            />

            <div>
              <Slider
                label="Þitt framlagshlutfall (af launum)"
                value={pensionAwareFire.sereign.employeeContributionPercent * 100}
                onChange={(value) =>
                  updatePensionAwareFireState({
                    sereign: {
                      ...pensionAwareFire.sereign,
                      employeeContributionPercent: value / 100,
                    },
                  })
                }
                min={1}
                max={15}
                step={0.5}
                showValue={true}
                formatValue={(value) => `${value.toFixed(1)}%`}
              />
              <p className="text-xs text-neutral-600 mt-1">
                Hversu hátt hlutfall af launum þú leggur til (algengast 4%)
              </p>
            </div>

            <div>
              <Slider
                label="Mótframlag vinnuveitanda (af launum)"
                value={pensionAwareFire.sereign.employerMatchPercent * 100}
                onChange={(value) =>
                  updatePensionAwareFireState({
                    sereign: {
                      ...pensionAwareFire.sereign,
                      employerMatchPercent: value / 100,
                    },
                  })
                }
                min={0}
                max={15}
                step={0.5}
                showValue={true}
                formatValue={(value) => `${value.toFixed(1)}%`}
              />
              <p className="text-xs text-neutral-600 mt-1">
                Hversu hátt hlutfall af launum vinnuveitandi leggur til (algengast 2%)
              </p>
            </div>

            {/* Show calculated employer match amount */}
            {pensionAwareFire.sereign.monthlyContribution > 0 && (
              <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Reiknað mótframlag:</strong>{' '}
                  {formatCurrency(
                    calculateEmployerMatch(
                      pensionAwareFire.sereign.monthlyContribution,
                      pensionAwareFire.sereign.employeeContributionPercent,
                      pensionAwareFire.sereign.employerMatchPercent
                    )
                  )}{' '}
                  /mán
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Samtals framlag: {formatCurrency(
                    pensionAwareFire.sereign.monthlyContribution +
                    calculateEmployerMatch(
                      pensionAwareFire.sereign.monthlyContribution,
                      pensionAwareFire.sereign.employeeContributionPercent,
                      pensionAwareFire.sereign.employerMatchPercent
                    )
                  )}{' '}
                  /mán
                </p>
              </div>
            )}

            {/* Projected Balance Display */}
            <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border border-indigo-200">
              <p className="text-sm font-medium text-indigo-900 mb-2">
                Áætluð staða við 60 ára aldur:
              </p>
              <p className="text-2xl font-bold text-indigo-700">
                {formatCurrency(sereignProjection.balanceAt60)}
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Miðað við {(pensionAwareFire.investmentReturn * 100).toFixed(1)}% ávöxtun og
                núverandi framlög
              </p>
            </div>

            <Alert variant="info">
              <p className="text-sm">
                <strong>Ekki viss?</strong> Séreign er aðgengileg frá 60 ára aldri og getur hjálpað
                til við að brúa bilið milli upphafs starfsloka og lífeyris frá lífeyrissjóði.
              </p>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* C. TR Ellilífeyrir Section */}
      <Card variant="outlined" className="border-purple-200">
        <CardHeader
          className="cursor-pointer hover:bg-purple-50 transition-colors"
          onClick={() => toggleSection('tr')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="State pension">
                🏛️
              </span>
              <div>
                <h3 className="text-lg font-semibold text-purple-900">
                  TR Ellilífeyrir (ríkislífeyrir)
                </h3>
                <p className="text-sm text-purple-700 mt-1">
                  Lífeyrir frá ríkinu frá 67 ára aldri (tekjutengdur)
                </p>
              </div>
            </div>
            <svg
              className={cn(
                'h-5 w-5 text-purple-600 transition-transform',
                expandedSections.has('tr') ? 'rotate-180' : ''
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

        {expandedSections.has('tr') && (
          <CardContent className="space-y-4">
            {/* Auto-calculated TR estimate display */}
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-purple-900 mb-1">
                    Áætlaður TR lífeyrir:
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency(trEstimate.estimatedMonthly)}
                    <span className="text-base font-normal text-purple-600 ml-2">
                      kr/mán
                    </span>
                  </p>
                </div>

                {trEstimate.isFullTR && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Fullur TR
                  </span>
                )}

                {trEstimate.isZeroTR && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                    Enginn TR
                  </span>
                )}
              </div>

              {/* Show reduction details if applicable */}
              {trEstimate.reductionPercent > 0 && !trEstimate.isZeroTR && (
                <div className="text-sm text-purple-700 space-y-1">
                  <p>
                    <strong>Skerðing:</strong> {trEstimate.reductionPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-600">
                    Tekjur yfir frítekjumarkinu ({formatCurrency(ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION)}/mán)
                    lækka TR um 45%
                  </p>
                </div>
              )}

              {trEstimate.isFullTR && (
                <p className="text-xs text-purple-600">
                  Lífeyrir frá lífeyrissjóði er undir frítekjumarkinu, þannig að þú færð fullan TR
                </p>
              )}
            </div>

            <Alert variant="info">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Tekjutengdur lífeyrir:</strong> TR er lækkaður um 45% af tekjum yfir
                  {' '}{formatCurrency(ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION)}/mán frá lífeyrissjóði.
                  Séreign telst ekki til tekna!
                </p>
                <p className="text-sm">
                  Hámarks TR er {formatCurrency(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE)}/mán
                  fyrir einstakling (2024).
                </p>
                <a
                  href="https://www.tr.is/ellilifeyrir/reiknivel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 underline"
                >
                  Opinber TR reiknivél
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </Alert>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
