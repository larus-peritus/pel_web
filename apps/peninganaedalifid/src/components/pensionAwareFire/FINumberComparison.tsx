/**
 * FINumberComparison - Shows traditional vs pension-adjusted FI numbers
 *
 * Purpose: Dramatically visualize the savings benefit of pension-aware planning
 *
 * Features:
 * - Two-column comparison (Traditional FI → Pension-Adjusted FI)
 * - Large numbers for visual impact
 * - Savings highlight (amount, percentage, years earlier)
 * - Arrow connector between columns
 * - Green success styling for pension-adjusted approach
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';

export interface FINumberComparisonProps {
  /** Traditional FI number (25-30x expenses, no pension consideration) (ISK) */
  traditionalFI?: number;

  /** Pension-adjusted FI number (what you actually need) (ISK) */
  pensionAdjustedFI?: number;

  /** Amount saved by using pension-aware approach (ISK) */
  savings?: number;

  /** Percentage reduction in required savings (0-100) */
  savingsPercent?: number;

  /** Years earlier you can retire with pension-aware planning (optional) */
  yearsEarlier?: number | null;
}

export function FINumberComparison({
  traditionalFI: propTraditionalFI,
  pensionAdjustedFI: propPensionAdjustedFI,
  savings: propSavings,
  savingsPercent: propSavingsPercent,
  yearsEarlier: propYearsEarlier,
}: FINumberComparisonProps = {}) {
  const { pensionAwareFireResults } = useCalculator();

  // Get values from props or context
  const traditionalFI = propTraditionalFI ?? pensionAwareFireResults?.traditionalFINumber ?? 0;
  const pensionAdjustedFI = propPensionAdjustedFI ?? pensionAwareFireResults?.pensionAdjustedFINumber ?? 0;
  const savings = propSavings ?? pensionAwareFireResults?.savingsDifference ?? 0;
  const savingsPercent = propSavingsPercent ?? pensionAwareFireResults?.savingsPercentageReduction ?? 0;
  const yearsEarlier = propYearsEarlier !== undefined ? propYearsEarlier : (pensionAwareFireResults?.yearsEarlierRetirement ?? null);

  // Return null if no results available
  if (!pensionAwareFireResults && propTraditionalFI === undefined) {
    return null;
  }

  // Edge case: both are equal (rare, happens when retiring at 67+ with no early pensions)
  const hasSignificantDifference = savings > 100_000; // More than 100k ISK difference

  return (
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-900">
            FI-tölu samanburður
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Hefðbundin FIRE vs. Lífeyristengd FIRE
          </p>
        </div>

        {/* Two-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Traditional FI Column */}
          <div className="relative">
            <div className="bg-neutral-100 rounded-lg p-5 border border-neutral-200">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-neutral-600">
                  Hefðbundin FI
                </div>
                <div className="text-2xl md:text-3xl font-bold text-neutral-800">
                  {formatCurrency(traditionalFI)}
                </div>
                <div className="text-xs text-neutral-500">
                  (30x árleg útgjöld)
                </div>
              </div>
            </div>
          </div>

          {/* Pension-Adjusted FI Column */}
          <div className="relative">
            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-500">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-green-700">
                  Lífeyristengd FI
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-700">
                  {formatCurrency(pensionAdjustedFI)}
                </div>
                <div className="text-xs text-green-600">
                  (raunveruleg þörf)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Highlight Box */}
        {hasSignificantDifference ? (
          <div className="bg-green-50 rounded-lg p-5 border border-green-200">
            <div className="space-y-3">
              {/* Savings Amount */}
              <div className="text-center">
                <div className="text-sm font-medium text-green-700 mb-1">
                  Þú sparar:
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-700">
                  {formatCurrency(savings)}
                </div>
                <div className="text-sm font-semibold text-green-600 mt-1">
                  ({formatPercentage(savingsPercent, 0)} minni!)
                </div>
              </div>

              {/* Years Earlier (if available) */}
              {yearsEarlier !== null && yearsEarlier !== undefined && yearsEarlier > 0 && (
                <div className="border-t border-green-200 pt-3">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-green-700">
                      Eða getur hætt {yearsEarlier.toFixed(1)} árum fyrr!
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="border-t border-green-200 pt-3">
                <p className="text-sm text-center text-green-700">
                  Með því að taka tillit til lífeyris þarftu <strong>mun minna</strong> í sparnaði til að hætta að vinna.
                  Íslenski lífeyrissjóðurinn og TR greiða fyrir stórum hluta útgjaldanna þinna eftir að þú nærð tilteknum aldri.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Edge case: minimal difference (retiring at 67+)
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-center text-blue-700">
              Þar sem þú ætlar að hætta nálægt 67 ára aldri (eða síðar) ertu þegar með aðgang að flestum lífeyrisgjöfum.
              Því er munurinn á hefðbundinni FI-tölu og lífeyristengdri FI-tölu mjög lítill.
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-center text-neutral-500 pt-2">
          <p>
            <strong className="text-neutral-600">Hefðbundin FI:</strong> Gerir ráð fyrir engum lífeyristekjum (of hár fyrir Ísland)
            <br />
            <strong className="text-neutral-600">Lífeyristengd FI:</strong> Tekur tillit til séreigns (60+), lífeyrissjóðs (62-67+) og TR (67+)
          </p>
        </div>
      </div>
    </Card>
  );
}
