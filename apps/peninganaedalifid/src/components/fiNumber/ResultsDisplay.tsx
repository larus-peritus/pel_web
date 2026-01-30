'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/formatters';
import { PensionAdjustedResults } from './PensionAdjustedResults';
import { LifeEnergyDisplay } from './LifeEnergyDisplay';
import { AWHPrompt } from './AWHPrompt';
import type { PensionAdjustedResult, FINumberLifeEnergy } from '@/types/fiNumber';

/**
 * Props for ResultsDisplay component
 */
export interface ResultsDisplayProps {
  fiNumber: number | null;
  monthlyExpenses: number;
  annualExpenses: number;
  multiplier: number;
  withdrawalRate: number;
  isLoading?: boolean;
  /** Optional pension-adjusted results (if pension data provided) */
  pensionAdjusted?: PensionAdjustedResult | null;
  /** Optional life energy metrics (if AWH available) */
  lifeEnergy?: FINumberLifeEnergy | null;
  /** Current savings amount for progress calculation */
  currentSavings?: number;
  /** Whether to show AWH prompt if life energy is not available */
  showAWHPrompt?: boolean;
}

/**
 * ResultsDisplay Component
 *
 * Displays the calculated FI number prominently with a breakdown
 * showing monthly expenses, annual expenses, multiplier, and withdrawal rate.
 * Optionally shows life energy display (years of work) if AWH is available,
 * or prompts user to calculate AWH.
 *
 * Features:
 * - Large hero display of FI number
 * - Detailed breakdown card below
 * - Life energy display section (if AWH available)
 * - AWH prompt (if AWH not available)
 * - Icelandic number formatting
 * - Responsive design (mobile-friendly)
 * - Loading state
 * - Null state when no FI number calculated
 *
 * @example
 * ```tsx
 * <ResultsDisplay
 *   fiNumber={180000000}
 *   monthlyExpenses={500000}
 *   annualExpenses={6000000}
 *   multiplier={30}
 *   withdrawalRate={3.33}
 *   lifeEnergy={{
 *     actualHourlyWage: 5000,
 *     annualNetIncome: 9_600_000,
 *     yearsOfWork: 18.75,
 *     yearsToFI: 12.5
 *   }}
 *   currentSavings={60_000_000}
 * />
 * ```
 */
export function ResultsDisplay({
  fiNumber,
  monthlyExpenses,
  annualExpenses,
  multiplier,
  withdrawalRate,
  isLoading = false,
  pensionAdjusted = null,
  lifeEnergy = null,
  currentSavings = 0,
  showAWHPrompt = true,
}: ResultsDisplayProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 text-center">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-primary-200 rounded mx-auto mb-4"></div>
            <div className="h-16 w-64 bg-primary-200 rounded mx-auto"></div>
          </div>
        </div>

        {/* Breakdown skeleton */}
        <Card variant="elevated">
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 w-40 bg-neutral-200 rounded"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-full bg-neutral-100 rounded"></div>
              <div className="h-4 w-full bg-neutral-100 rounded"></div>
              <div className="h-4 w-full bg-neutral-100 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No results state
  if (fiNumber === null || fiNumber === 0) {
    return (
      <Card variant="elevated">
        <CardContent className="py-12 text-center">
          <div className="text-neutral-700 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-neutral-600 font-medium">Sláðu inn mánaðarleg útgjöld til að reikna út FI-tölu</p>
          <p className="text-sm text-neutral-700 mt-2">
            Veldu útgjaldatier eða sláðu inn sérsniðna upphæð
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero FI Number Display */}
      <div className="bg-gradient-to-br from-primary-50 via-primary-100 to-success-50 rounded-2xl p-8 md:p-12 text-center shadow-lg border-2 border-primary-200">
        <p className="text-sm md:text-base font-semibold text-primary-700 uppercase tracking-wide mb-3">
          Þín FI-tala
        </p>
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-2 transition-all duration-300">
          {formatCurrency(fiNumber)}
        </p>
        <p className="text-sm md:text-base text-neutral-600 mt-3">
          Þetta er heildareignin sem þú þarft til að ná fjármálafrelsi
        </p>
      </div>

      {/* Pension-Adjusted FI Number (if pension data available) */}
      {pensionAdjusted && pensionAdjusted.totalNeeded > 0 && pensionAdjusted.totalNeeded < fiNumber && (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8 text-center shadow-lg border-2 border-green-300">
          <p className="text-sm md:text-base font-semibold text-green-700 uppercase tracking-wide mb-2">
            Raunveruleg þörf (með lífeyri)
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-700 mb-2 transition-all duration-300">
            {formatCurrency(pensionAdjusted.totalNeeded)}
          </p>
          <p className="text-sm text-green-800 mt-2">
            Með tilliti til lífeyrissjóðs og TR lífeyris eftir {pensionAdjusted.pensionStartAge} ára aldur
          </p>
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-green-700">Sparnaður:</span>
              <span className="font-bold text-green-800">
                {formatCurrency(fiNumber - pensionAdjusted.totalNeeded)}
              </span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                -{formatNumber(((fiNumber - pensionAdjusted.totalNeeded) / fiNumber) * 100, 0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Card */}
      <Card variant="elevated">
        <CardHeader className="bg-neutral-50">
          <h3 className="text-lg md:text-xl font-bold text-neutral-800">Sundurliðun</h3>
          <p className="text-sm text-neutral-600 mt-1">Hvernig FI-talan var reiknuð út</p>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-5">
          {/* Monthly Expenses */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pb-4 border-b border-neutral-200">
            <div>
              <p className="font-semibold text-neutral-800">Mánaðarleg útgjöld</p>
              <p className="text-xs text-neutral-700">Áætluð útgjöld á mánuði</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-neutral-900">
              {formatCurrency(monthlyExpenses)}
            </p>
          </div>

          {/* Annual Expenses */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pb-4 border-b border-neutral-200">
            <div>
              <p className="font-semibold text-neutral-800">Árleg útgjöld</p>
              <p className="text-xs text-neutral-700">Mánaðarleg × 12</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-neutral-900">
              {formatCurrency(annualExpenses)}
            </p>
          </div>

          {/* Multiplier */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pb-4 border-b border-neutral-200">
            <div>
              <p className="font-semibold text-neutral-800">Margfaldari</p>
              <p className="text-xs text-neutral-700">Áætlaður lágmarkslíftími sparnaðar</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-primary-700">
              {formatNumber(multiplier, 0)}x
            </p>
          </div>

          {/* Withdrawal Rate */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
            <div>
              <p className="font-semibold text-neutral-800">Úttektarhlutfall</p>
              <p className="text-xs text-neutral-700">Hlutfall sem þú getur tekið út árlega</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-success-700">
              {formatPercentage(withdrawalRate, 2)}
            </p>
          </div>

          {/* Calculation Formula Display */}
          <div className="mt-6 pt-4 border-t-2 border-neutral-300 bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-neutral-600 mb-2 text-center font-medium">Formúla:</p>
            <p className="text-center text-neutral-800 font-mono text-sm md:text-base">
              {formatCurrency(annualExpenses)} × {formatNumber(multiplier, 0)} = {formatCurrency(fiNumber)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Life Energy Display Section (if AWH available) */}
      {lifeEnergy && fiNumber && (
        <LifeEnergyDisplay
          lifeEnergy={lifeEnergy}
          fiNumber={fiNumber}
          currentSavings={currentSavings}
        />
      )}

      {/* AWH Prompt (if AWH not available and prompt is enabled) */}
      {!lifeEnergy && showAWHPrompt && fiNumber && fiNumber > 0 && (
        <AWHPrompt />
      )}
    </div>
  );
}
