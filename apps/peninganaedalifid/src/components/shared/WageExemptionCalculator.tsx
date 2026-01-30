'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { TR_MEANS_TEST } from '@/lib/constants/fiNumber';

/**
 * WageExemptionCalculator Props
 */
export interface WageExemptionCalculatorProps {
  /** Monthly part-time wages */
  monthlyWages: number;
  /** Expected monthly occupational pension at 67 */
  occupationalPension: number;
  /** Callbacks */
  onWagesChange: (wages: number) => void;
  onOccupationalPensionChange?: (pension: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * Calculate TR pension considering wage exemption
 *
 * TR allows up to 200k ISK/month of wages without reduction (beyond age 67)
 */
function calculateTRWithWageExemption(
  monthlyWages: number,
  occupationalPension: number
): {
  trPension: number;
  wageExemptionUsed: number;
  wagesCountedAgainstTR: number;
  totalIncomeCountedAgainstTR: number;
  reductionFromOccupational: number;
  reductionFromWages: number;
  totalReduction: number;
  netTRPension: number;
} {
  const maxTR = TR_MEANS_TEST.MAX_MONTHLY_SINGLE;

  // Wages up to 200k don't count
  const wageExemptionUsed = Math.min(monthlyWages, TR_MEANS_TEST.WAGE_EXEMPTION);
  const wagesCountedAgainstTR = Math.max(0, monthlyWages - TR_MEANS_TEST.WAGE_EXEMPTION);

  // Occupational pension fully counts (above small exemption)
  const occupationalAboveExemption = Math.max(0, occupationalPension - TR_MEANS_TEST.INCOME_EXEMPTION);

  // Total income that counts against TR
  const totalIncomeCountedAgainstTR = occupationalAboveExemption + wagesCountedAgainstTR;

  // Calculate reductions separately for clarity
  const reductionFromOccupational = occupationalAboveExemption * TR_MEANS_TEST.REDUCTION_RATE;
  const reductionFromWages = wagesCountedAgainstTR * TR_MEANS_TEST.REDUCTION_RATE;
  const totalReduction = reductionFromOccupational + reductionFromWages;

  const netTRPension = Math.max(0, maxTR - totalReduction);

  return {
    trPension: maxTR,
    wageExemptionUsed,
    wagesCountedAgainstTR,
    totalIncomeCountedAgainstTR,
    reductionFromOccupational: Math.round(reductionFromOccupational),
    reductionFromWages: Math.round(reductionFromWages),
    totalReduction: Math.round(totalReduction),
    netTRPension: Math.round(netTRPension),
  };
}

/**
 * WageExemptionCalculator Component
 *
 * For Barista FIRE: Shows how part-time income interacts with TR pension.
 * Key insight: Up to 200,000 ISK/month of wages doesn't reduce TR!
 *
 * This makes part-time work at age 67+ very attractive for Barista FIRE folks.
 */
export const WageExemptionCalculator: React.FC<WageExemptionCalculatorProps> = ({
  monthlyWages,
  occupationalPension,
  onWagesChange,
  onOccupationalPensionChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Calculate TR with wage exemption
  const result = useMemo(() => {
    return calculateTRWithWageExemption(monthlyWages, occupationalPension);
  }, [monthlyWages, occupationalPension]);

  // Calculate total monthly income
  const totalMonthlyIncome = monthlyWages + occupationalPension + result.netTRPension;

  // Calculate optimal wage level (at the exemption threshold)
  const optimalWageLevel = TR_MEANS_TEST.WAGE_EXEMPTION;

  // Is user at or below optimal wage level?
  const isAtOptimalLevel = monthlyWages <= optimalWageLevel;

  return (
    <Card
      variant="elevated"
      className={cn('border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-amber-900">
                Frítekjumark Reiknivél
              </h3>
              <Badge variant="warning" size="sm">Kaffiþjóna FIRE</Badge>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Reiknaðu hvernig hlutastarf hefur áhrif á TR lífeyri
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-amber-600">Heildartekjur</p>
                <p className="text-lg font-bold text-amber-800">
                  {formatCurrency(totalMonthlyIncome)}/mán
                </p>
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={isExpanded ? 'Loka' : 'Opna'}
              aria-expanded={isExpanded}
            >
              <svg
                className={cn('h-5 w-5 transition-transform duration-200', isExpanded && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-4">
          {/* Key Benefit Alert */}
          <Alert variant="success">
            <div className="space-y-2">
              <p className="font-semibold text-sm">
                Lífeyristekjur sem ekki teljast: Haltu áfram að vinna án þess að missa TR!
              </p>
              <p className="text-sm">
                Eftir 67 ára aldur getur þú þénað allt að{' '}
                <strong>{formatCurrency(TR_MEANS_TEST.WAGE_EXEMPTION)}/mán</strong> í launum
                án þess að það skerði TR lífeyri þinn.
              </p>
            </div>
          </Alert>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Mánaðarlaun (hlutastarf)"
              value={monthlyWages}
              onChange={onWagesChange}
              helpText="Brúttólaun frá hlutastarfi"
            />
            {onOccupationalPensionChange && (
              <CurrencyInput
                label="Lífeyrissjóður (kr/mán)"
                value={occupationalPension}
                onChange={onOccupationalPensionChange}
                helpText="Mánaðargreiðslur frá lífeyrissjóði"
              />
            )}
          </div>

          {/* Wage Level Indicator */}
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Launastig</span>
              {isAtOptimalLevel ? (
                <Badge variant="success">Hagstætt!</Badge>
              ) : (
                <Badge variant="warning">Umfram lífeyristekjur sem ekki teljast</Badge>
              )}
            </div>
            <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isAtOptimalLevel ? 'bg-green-500' : 'bg-orange-500'
                )}
                style={{
                  width: `${Math.min(100, (monthlyWages / (optimalWageLevel * 1.5)) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-500">
              <span>0 kr</span>
              <span className="font-medium text-green-600">
                {formatCurrency(optimalWageLevel)} (lífeyristekjur sem ekki teljast)
              </span>
              <span>{formatCurrency(optimalWageLevel * 1.5)}</span>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3">Útreikningur</h4>
            <div className="space-y-3 text-sm">
              {/* Wages Section */}
              <div>
                <p className="font-medium text-neutral-700 mb-1">Laun</p>
                <div className="ml-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Heildarlaun:</span>
                    <span className="font-medium">{formatCurrency(monthlyWages)}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Lífeyristekjur sem ekki teljast (ekki dregið frá):</span>
                    <span>-{formatCurrency(result.wageExemptionUsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Telst á móti TR:</span>
                    <span className={result.wagesCountedAgainstTR > 0 ? 'text-orange-600' : 'text-green-600'}>
                      {formatCurrency(result.wagesCountedAgainstTR)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Occupational Pension Section */}
              <div>
                <p className="font-medium text-neutral-700 mb-1">Lífeyrissjóður</p>
                <div className="ml-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Mánaðarlegur lífeyrir:</span>
                    <span className="font-medium">{formatCurrency(occupationalPension)}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Tekjur sem ekki teljast (ekki dregið frá):</span>
                    <span>-{formatCurrency(Math.min(occupationalPension, TR_MEANS_TEST.INCOME_EXEMPTION))}</span>
                  </div>
                </div>
              </div>

              {/* TR Calculation */}
              <div className="pt-3 border-t border-amber-200">
                <p className="font-medium text-neutral-700 mb-1">TR Útreikningur</p>
                <div className="ml-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Hámarks TR:</span>
                    <span className="font-medium">{formatCurrency(result.trPension)}</span>
                  </div>
                  {result.reductionFromOccupational > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Skerðing vegna lífeyrissjóðs:</span>
                      <span>-{formatCurrency(result.reductionFromOccupational)}</span>
                    </div>
                  )}
                  {result.reductionFromWages > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Skerðing vegna launa:</span>
                      <span>-{formatCurrency(result.reductionFromWages)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-amber-100 font-semibold">
                    <span>Nettó TR lífeyrir:</span>
                    <span className="text-amber-700">{formatCurrency(result.netTRPension)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Income Summary */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300">
            <h4 className="font-semibold text-green-900 mb-3">Heildartekjur á mánuði</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Laun (hlutastarf):</span>
                <span className="font-medium">{formatCurrency(monthlyWages)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lífeyrissjóður:</span>
                <span className="font-medium">{formatCurrency(occupationalPension)}</span>
              </div>
              <div className="flex justify-between">
                <span>TR lífeyrir:</span>
                <span className="font-medium">{formatCurrency(result.netTRPension)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-300 text-lg font-bold">
                <span>Samtals:</span>
                <span className="text-green-700">{formatCurrency(totalMonthlyIncome)}</span>
              </div>
            </div>
          </div>

          {/* Optimization Tip */}
          {!isAtOptimalLevel && (
            <Alert variant="warning">
              <div className="space-y-2">
                <p className="font-semibold text-sm">Hagræðingartilmæli</p>
                <p className="text-sm">
                  Þú ert að þéna {formatCurrency(monthlyWages - optimalWageLevel)} umfram lífeyristekjur sem ekki teljast.
                  Þetta skerðir TR um {formatCurrency(result.reductionFromWages)}/mán.
                </p>
                <p className="text-sm">
                  Ef þú gætir lækkað laun í {formatCurrency(optimalWageLevel)}, myndir þú:
                </p>
                <ul className="text-sm ml-4 list-disc">
                  <li>Fá {formatCurrency(result.reductionFromWages)} hærri TR</li>
                  <li>
                    Nettóáhrif: {result.reductionFromWages > (monthlyWages - optimalWageLevel)
                      ? 'Betri heildartekjur!'
                      : 'Lægri heildartekjur'}
                  </li>
                </ul>
              </div>
            </Alert>
          )}

          {/* Barista FIRE Strategy */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="font-semibold">Kaffiþjóna FIRE stefna (67+ ára)</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>
                  Vinndu hlutastarf sem gefur ~{formatCurrency(optimalWageLevel)}/mán - fullar lífeyristekjur sem ekki teljast!
                </li>
                <li>Þetta gæti verið ~20 klst/viku við ~2.500 kr/klst</li>
                <li>Lífeyrissjóður + TR + Laun = Þægilegri eftirlaunaár</li>
                <li>Ef þú nærð Coast FIRE fyrir 67, er þetta leiðin til að „róa til áfanga"</li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default WageExemptionCalculator;
