'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  TR_MEANS_TEST,
  ICELAND_PENSION_AGES,
  SEREIGN_PENSION,
} from '@/lib/constants/fiNumber';

/**
 * TRMeansTestCalculator Props
 */
export interface TRMeansTestCalculatorProps {
  /** Expected monthly occupational pension (lífeyrissjóður) */
  occupationalPension: number;
  /** Callback when occupational pension changes */
  onOccupationalPensionChange: (pension: number) => void;
  /** Additional monthly income that counts against TR (optional) */
  additionalIncome?: number;
  /** Callback when additional income changes */
  onAdditionalIncomeChange?: (income: number) => void;
  /** Whether the user is single (affects TR max amount) */
  isSingle?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show expanded educational content */
  showEducation?: boolean;
  /** Variant styling */
  variant?: 'default' | 'compact';
}

/**
 * Calculate ESTIMATED TR pension based on other income (means-testing)
 *
 * DISCLAIMER: This is a simplified estimate based on published TR rules.
 * For accurate calculations, use TR's official calculator:
 * https://island.is/s/tryggingastofnun/reiknivel
 *
 * The actual TR system is more complex with:
 * - Different exemptions for wages vs pension income vs capital gains
 * - Heimilisuppbót with separate reduction rate (11.9%)
 * - Annual adjustments based on fjárlög
 * - Residence requirements (40 years for full benefits)
 *
 * Séreign treatment: While often cited as not counting, consult TR directly
 * as rules may vary based on withdrawal type and circumstances.
 */
function calculateTRPension(
  otherMonthlyIncome: number,
  isSingle: boolean = true
): { trPension: number; reductionAmount: number; incomeAboveExemption: number } {
  const maxTR = isSingle ? TR_MEANS_TEST.ELLILIFEYRIR_FULL : TR_MEANS_TEST.MAX_MONTHLY_COUPLE;

  // If no other income or below exemption, get full TR
  if (otherMonthlyIncome <= TR_MEANS_TEST.INCOME_EXEMPTION) {
    return {
      trPension: maxTR,
      reductionAmount: 0,
      incomeAboveExemption: 0,
    };
  }

  // Calculate reduction (simplified - actual system has different rules per income type)
  const incomeAboveExemption = otherMonthlyIncome - TR_MEANS_TEST.INCOME_EXEMPTION;
  const reductionAmount = incomeAboveExemption * TR_MEANS_TEST.REDUCTION_RATE;
  const trPension = Math.max(0, maxTR - reductionAmount);

  return {
    trPension: Math.round(trPension),
    reductionAmount: Math.round(reductionAmount),
    incomeAboveExemption: Math.round(incomeAboveExemption),
  };
}

/**
 * TRMeansTestCalculator Component
 *
 * Calculates expected TR (Tryggingastofnun) pension based on other income.
 * TR is Iceland's state pension, which is means-tested based on other income.
 *
 * Key insight: Séreign (private pension) withdrawals do NOT count against
 * TR means-testing, making it an excellent income source after age 60.
 */
export const TRMeansTestCalculator: React.FC<TRMeansTestCalculatorProps> = ({
  occupationalPension,
  onOccupationalPensionChange,
  additionalIncome = 0,
  onAdditionalIncomeChange,
  isSingle = true,
  className,
  showEducation = true,
  variant = 'default',
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === 'default');

  // Calculate TR pension
  const trResult = useMemo(() => {
    const totalCountableIncome = occupationalPension + additionalIncome;
    return calculateTRPension(totalCountableIncome, isSingle);
  }, [occupationalPension, additionalIncome, isSingle]);

  // Calculate total monthly pension income
  const totalMonthlyPension = occupationalPension + trResult.trPension;

  // Get max TR for display
  const maxTR = isSingle ? TR_MEANS_TEST.MAX_MONTHLY_SINGLE : TR_MEANS_TEST.MAX_MONTHLY_COUPLE;

  // Calculate percentage of max TR received
  const trPercentage = maxTR > 0 ? (trResult.trPension / maxTR) * 100 : 0;

  return (
    <Card
      variant="elevated"
      className={cn(
        'border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
        className
      )}
    >
      <CardHeader
        className={cn(
          'cursor-pointer',
          variant === 'compact' && 'py-3'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-blue-900">
                TR Lífeyrir Reiknivél
              </h3>
              <Badge variant="info" size="sm">Ísland</Badge>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Reiknaðu ríkislífeyri (Tryggingastofnun) miðað við aðrar tekjur
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick result summary when collapsed */}
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-blue-600">Áætlaður TR</p>
                <p className="text-lg font-bold text-blue-800">
                  {formatCurrency(trResult.trPension)}/mán
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
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-4">
          {/* Disclaimer Alert */}
          <Alert variant="warning">
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                ⚠️ Þetta er áætlun - ekki opinber úreikningur
              </p>
              <p className="text-xs">
                Raunverulegar TR greiðslur ráðast af mörgum þáttum sem þessi reiknivél
                tekur ekki tillit til (búsetutími, tekjutegundir, heimilisuppbót o.fl.).
              </p>
              <a
                href={TR_MEANS_TEST.OFFICIAL_CALCULATOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 underline"
              >
                Nota opinbera TR reiknivél →
              </a>
            </div>
          </Alert>

          {/* Educational Alert */}
          {showEducation && (
            <Alert variant="info">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>TR (Tryggingastofnun)</strong> er ríkislífeyrir sem er
                  tekjutengdur. Hærri lífeyristekjur = lægri TR greiðslur.
                </p>
                <p className="text-xs text-neutral-600">
                  <strong>Frítekjumörk:</strong> Laun: 200.000 kr/mán | Lífeyrissjóður: 36.500 kr/mán | Fjármagnstekjur: 0 kr
                </p>
                <p className="text-xs text-neutral-600">
                  <strong>Skerðingarhlutfall:</strong> 45% af tekjum umfram frítekjumörk
                </p>
              </div>
            </Alert>
          )}

          {/* Input Section */}
          <div className="space-y-4">
            <CurrencyInput
              label="Lífeyrissjóður (kr/mán við 67 ára)"
              value={occupationalPension}
              onChange={onOccupationalPensionChange}
              helpText="Mánaðarlegar greiðslur frá lífeyrissjóði (t.d. Lífeyrissjóður starfsmanna, Gildi, ofl.)"
            />

            {onAdditionalIncomeChange && (
              <CurrencyInput
                label="Aðrar tekjur sem teljast (kr/mán)"
                value={additionalIncome}
                onChange={onAdditionalIncomeChange}
                helpText="Launatekjur, leigutekjur, eða aðrar skattskyldar tekjur (EKKI séreign)"
              />
            )}
          </div>

          {/* Calculation Breakdown */}
          <div className="bg-white rounded-lg p-4 space-y-3 border border-blue-200">
            <h4 className="font-semibold text-neutral-900">Útreikningur</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Hámarks TR (einhleypur):</span>
                <span className="font-medium">{formatCurrency(maxTR)}/mán</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Tekjur sem teljast:</span>
                <span className="font-medium">
                  {formatCurrency(occupationalPension + additionalIncome)}/mán
                </span>
              </div>

              {trResult.incomeAboveExemption > 0 && (
                <>
                  <div className="flex justify-between text-neutral-500">
                    <span>Lífeyristekjur sem ekki teljast (ekki dregnar frá):</span>
                    <span>{formatCurrency(TR_MEANS_TEST.INCOME_EXEMPTION)}/mán</span>
                  </div>

                  <div className="flex justify-between text-neutral-500">
                    <span>Tekjur umfram lífeyristekjur sem ekki teljast:</span>
                    <span>{formatCurrency(trResult.incomeAboveExemption)}/mán</span>
                  </div>

                  <div className="flex justify-between text-orange-600">
                    <span>Skerðing ({formatNumber(TR_MEANS_TEST.REDUCTION_RATE * 100, 0)}% af umframtekjum):</span>
                    <span>-{formatCurrency(trResult.reductionAmount)}/mán</span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">Áætlaður TR lífeyrir:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {formatCurrency(trResult.trPension)}/mán
                  </span>
                </div>
                <div className="text-xs text-neutral-500 text-right mt-1">
                  ({formatNumber(trPercentage, 0)}% af hámarki)
                </div>
              </div>
            </div>
          </div>

          {/* Total Pension Summary */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-800 font-medium">
                  Heildarlífeyrir við {ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE} ára
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Lífeyrissjóður + TR lífeyrir
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(totalMonthlyPension)}/mán
                </p>
                <p className="text-xs text-green-600">
                  ({formatCurrency(totalMonthlyPension * 12)}/ár)
                </p>
              </div>
            </div>
          </div>

          {/* Séreign Tip */}
          <Alert variant="info">
            <div className="space-y-1">
              <p className="font-semibold text-sm">
                Séreign sem brú fyrir 60-67 ára?
              </p>
              <p className="text-xs">
                Séreign (séreignarsparnaður) er oft nefnd sem góð brú milli {SEREIGN_PENSION.ACCESS_AGE} og {ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE} ára.
                Hafðu samband við TR til að fá nákvæmar upplýsingar um hvernig séreign úttektir
                hafa áhrif á TR réttindi í þínu tilfelli.
              </p>
            </div>
          </Alert>

          {/* TR Reduction Warning */}
          {trResult.trPension === 0 && (
            <Alert variant="warning">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  Engar TR greiðslur
                </p>
                <p className="text-xs">
                  Tekjur þínar eru of háar til að fá TR lífeyri.
                  Tekjumörk: ~{formatCurrency(TR_MEANS_TEST.ZERO_BENEFIT_INCOME)}/mán.
                </p>
              </div>
            </Alert>
          )}

          {/* Official Links */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-200">
            <a
              href={TR_MEANS_TEST.OFFICIAL_CALCULATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Opinber TR reiknivél
            </a>
            <a
              href={TR_MEANS_TEST.OFFICIAL_INFO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upplýsingar um ellilífeyri
            </a>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TRMeansTestCalculator;
