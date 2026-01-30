'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import type { PensionAdjustedResult } from '@/types/fiNumber';

/**
 * PensionAdjustedResults Component Props
 */
export interface PensionAdjustedResultsProps {
  /** Full FI number without pension consideration */
  fullFINumber: number;
  /** Pension-adjusted calculation results */
  pensionAdjusted: PensionAdjustedResult;
  /** Multiplier used for calculation */
  multiplier: number;
  /** Withdrawal rate (for display) */
  withdrawalRate: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PensionAdjustedResults Component
 *
 * Displays FI number calculation when pension income is included.
 * Shows three key sections:
 * 1. Full FI Number (without pension consideration)
 * 2. Pension-Adjusted FI (reduced by pension income stream)
 * 3. Bridge Amount (savings needed until pension starts, if retiring early)
 *
 * Features:
 * - Three-section display with clear visual hierarchy
 * - Total needed prominently highlighted
 * - Clear explanations for each section
 * - Visual distinction with colors/borders
 * - Responsive design
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * <PensionAdjustedResults
 *   fullFINumber={180000000}
 *   pensionAdjusted={{
 *     pensionMonthlyIncome: 200000,
 *     pensionAnnualIncome: 2400000,
 *     reducedAnnualExpenses: 3600000,
 *     pensionAdjustedFI: 108000000,
 *     targetRetirementAge: 55,
 *     pensionStartAge: 67,
 *     bridgeYears: 12,
 *     bridgeAmount: 72000000,
 *     totalNeeded: 180000000,
 *   }}
 *   multiplier={30}
 *   withdrawalRate={3.33}
 * />
 * ```
 */
export const PensionAdjustedResults: React.FC<PensionAdjustedResultsProps> = ({
  fullFINumber,
  pensionAdjusted,
  multiplier,
  withdrawalRate,
  className,
}) => {
  const {
    pensionMonthlyIncome,
    pensionAnnualIncome,
    reducedAnnualExpenses,
    pensionAdjustedFI,
    targetRetirementAge,
    pensionStartAge,
    bridgeYears,
    bridgeAmount,
    totalNeeded,
  } = pensionAdjusted;

  // Check if early retirement (bridge needed)
  const needsBridge = bridgeYears > 0 && bridgeAmount > 0;

  // Calculate savings from pension
  const savingsFromPension = fullFINumber - pensionAdjustedFI;
  const savingsPercentage = fullFINumber > 0 ? (savingsFromPension / fullFINumber) * 100 : 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Hero Total Needed Display */}
      <div className="bg-gradient-to-br from-success-50 via-success-100 to-primary-50 rounded-2xl p-8 md:p-12 text-center shadow-lg border-2 border-success-200">
        <p className="text-sm md:text-base font-semibold text-success-700 uppercase tracking-wide mb-3">
          Heildarþörf með lífeyri
        </p>
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-success-900 mb-2 transition-all duration-300">
          {formatCurrency(totalNeeded)}
        </p>
        <p className="text-sm md:text-base text-neutral-600 mt-3">
          {needsBridge
            ? `Brúarsparnaður (${bridgeYears} ár) + lífeyrisaðlagaður sparnaður`
            : 'Lífeyrisaðlagaður sparnaður'}
        </p>
        {savingsFromPension > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/60 rounded-full px-4 py-2">
            <Badge variant="success" size="sm">
              Sparnaður
            </Badge>
            <span className="text-sm font-semibold text-success-800">
              {formatCurrency(savingsFromPension)} ({formatNumber(savingsPercentage, 1)}%) lægra en án lífeyris
            </span>
          </div>
        )}
      </div>

      {/* Breakdown Card */}
      <Card variant="elevated">
        <CardHeader className="bg-neutral-50">
          <h3 className="text-lg md:text-xl font-bold text-neutral-800">
            Sundurliðun með lífeyri
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Hvernig lífeyrissjóður lækkar FI-töluna þína
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 1: Full FI Number */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">
                  1. Full FI-tala (án lífeyris)
                </h4>
                <p className="text-xs text-neutral-600">
                  Sparnaður sem þarf ef enginn lífeyrir væri til staðar
                </p>
              </div>
              <Badge variant="neutral" size="sm">
                Viðmiðun
              </Badge>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-neutral-900">
              {formatCurrency(fullFINumber)}
            </p>
          </div>

          {/* Section 2: Pension-Adjusted FI */}
          <div className="bg-success-50 border-2 border-success-300 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-semibold text-success-900 mb-1">
                  2. Lífeyrisaðlöguð FI-tala
                </h4>
                <p className="text-xs text-success-700">
                  Sparnaður sem þarf þegar lífeyrir greiðir hluta útgjalda
                </p>
              </div>
              <Badge variant="success" size="sm">
                Eftir 67 ára
              </Badge>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-success-900 mb-4">
              {formatCurrency(pensionAdjustedFI)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-success-700 font-medium">Lífeyrisgreiðsla</p>
                <p className="text-success-900 font-semibold">
                  {formatCurrency(pensionMonthlyIncome)}/mán
                </p>
                <p className="text-xs text-success-700">
                  {formatCurrency(pensionAnnualIncome)}/ár
                </p>
              </div>
              <div>
                <p className="text-success-700 font-medium">Útgjöld eftir lífeyri</p>
                <p className="text-success-900 font-semibold">
                  {formatCurrency(reducedAnnualExpenses)}/ár
                </p>
                <p className="text-xs text-success-700">
                  {formatNumber(multiplier, 0)}x margfaldari
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Bridge Amount (if early retirement) */}
          {needsBridge && (
            <div className="bg-warning-50 border-2 border-warning-300 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-semibold text-warning-900 mb-1">
                    3. Brúarsparnaður
                  </h4>
                  <p className="text-xs text-warning-700">
                    Auka sparnaður fyrir snemmbúna starfslok ({targetRetirementAge} - {pensionStartAge} ára)
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  {bridgeYears} ár
                </Badge>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-warning-900 mb-4">
                {formatCurrency(bridgeAmount)}
              </p>
              <div className="bg-white/60 rounded p-3 text-sm text-warning-800">
                <p>
                  Þú þarft þennan auka sparnað til að standa straum af útgjöldum frá {targetRetirementAge} ára aldri
                  þar til lífeyrissjóðurinn byrjar að greiða við {pensionStartAge} ára aldur.
                </p>
              </div>
            </div>
          )}

          {/* Total Calculation Formula */}
          <div className="mt-6 pt-5 border-t-2 border-neutral-300 bg-gradient-to-br from-neutral-50 to-white rounded-lg p-5">
            <p className="text-sm text-neutral-600 mb-3 text-center font-medium">
              Heildarútreikningur:
            </p>
            <div className="space-y-2 text-center font-mono text-sm md:text-base">
              {needsBridge ? (
                <>
                  <p className="text-neutral-700">
                    Brúarsparnaður: <span className="font-bold text-warning-700">{formatCurrency(bridgeAmount)}</span>
                  </p>
                  <p className="text-neutral-700">
                    + Lífeyrisaðlagað: <span className="font-bold text-success-700">{formatCurrency(pensionAdjustedFI)}</span>
                  </p>
                  <p className="text-xl font-bold text-success-900 pt-2 border-t border-neutral-300">
                    = {formatCurrency(totalNeeded)}
                  </p>
                </>
              ) : (
                <p className="text-neutral-800">
                  Lífeyrisaðlöguð FI-tala = <span className="font-bold text-success-700">{formatCurrency(pensionAdjustedFI)}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
