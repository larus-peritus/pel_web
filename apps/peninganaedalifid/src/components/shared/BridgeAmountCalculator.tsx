'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  calculateBridgeAmounts,
  calculateOptimalSereignWithdrawal,
  type BridgeAmountInput,
  type BridgeAmountResult,
} from '@/lib/calculations/bridgeAmount';
import { ICELAND_PENSION_AGES } from '@/lib/constants/fiNumber';

/**
 * BridgeAmountCalculator Props
 */
export interface BridgeAmountCalculatorProps {
  /** Target retirement age */
  retirementAge: number;
  /** Monthly expenses */
  monthlyExpenses: number;
  /** FI multiplier */
  multiplier: number;
  /** Expected séreign balance at age 60 */
  sereignBalanceAt60: number;
  /** Expected monthly occupational pension at 67 */
  occupationalPensionMonthly: number;
  /** Callbacks */
  onRetirementAgeChange: (age: number) => void;
  onSereignBalanceChange: (balance: number) => void;
  onOccupationalPensionChange: (pension: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * Phase Card Component
 */
function PhaseCard({
  phase,
  title,
  ageRange,
  years,
  totalExpenses,
  coverage,
  gap,
  fundingSource,
  notes,
  variant,
}: {
  phase: 1 | 2 | 3;
  title: string;
  ageRange: string;
  years: number | string;
  totalExpenses: number;
  coverage: number;
  gap: number;
  fundingSource: string;
  notes?: string;
  variant: 'warning' | 'primary' | 'success';
}) {
  const variantStyles = {
    warning: 'bg-orange-50 border-orange-300',
    primary: 'bg-blue-50 border-blue-300',
    success: 'bg-green-50 border-green-300',
  };

  const textStyles = {
    warning: 'text-orange-900',
    primary: 'text-blue-900',
    success: 'text-green-900',
  };

  const badgeVariant = variant === 'warning' ? 'warning' : variant === 'primary' ? 'info' : 'success';

  return (
    <div className={cn('border-2 rounded-lg p-4', variantStyles[variant])}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>Fasi {phase}</Badge>
          <span className={cn('font-semibold', textStyles[variant])}>{ageRange}</span>
          <span className="text-sm text-neutral-600">({years} ár)</span>
        </div>
      </div>

      <p className={cn('text-sm mb-3', textStyles[variant])}>{title}</p>

      <div className="space-y-2 text-sm">
        {phase !== 3 && (
          <div className="flex justify-between">
            <span className="text-neutral-600">Heildarútgjöld:</span>
            <span className="font-medium">{formatCurrency(totalExpenses)}</span>
          </div>
        )}

        {coverage > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Dekkað:</span>
            <span className="font-medium">-{formatCurrency(coverage)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-current/20">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Þarf:</span>
            <span className={cn('text-lg font-bold', textStyles[variant])}>
              {formatCurrency(gap)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-current/20">
        <p className="text-xs text-neutral-600">
          <strong>Fjármögnun:</strong> {fundingSource}
        </p>
        {notes && <p className="text-xs text-neutral-500 mt-1 italic">{notes}</p>}
      </div>
    </div>
  );
}

/**
 * BridgeAmountCalculator Component
 *
 * Visual calculator showing the three phases of Iceland retirement planning:
 * - Phase 1: Early retirement → Age 60 (personal savings)
 * - Phase 2: Age 60 → 67 (séreign bridge)
 * - Phase 3: Age 67+ (pensions + FI gap)
 */
export const BridgeAmountCalculator: React.FC<BridgeAmountCalculatorProps> = ({
  retirementAge,
  monthlyExpenses,
  multiplier,
  sereignBalanceAt60,
  occupationalPensionMonthly,
  onRetirementAgeChange,
  onSereignBalanceChange,
  onOccupationalPensionChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Calculate bridge amounts
  const result = useMemo<BridgeAmountResult>(() => {
    const input: BridgeAmountInput = {
      retirementAge,
      monthlyExpenses,
      multiplier,
      sereignBalanceAt60,
      occupationalPensionMonthly,
      isSingle: true,
    };
    return calculateBridgeAmounts(input);
  }, [retirementAge, monthlyExpenses, multiplier, sereignBalanceAt60, occupationalPensionMonthly]);

  // Calculate optimal séreign withdrawal
  const sereignWithdrawal = useMemo(() => {
    return calculateOptimalSereignWithdrawal(sereignBalanceAt60, monthlyExpenses);
  }, [sereignBalanceAt60, monthlyExpenses]);

  const { phase1, phase2, phase3, totals } = result;

  return (
    <Card
      variant="elevated"
      className={cn('border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-indigo-900">
                Þriggja Fasa Brúarreiknivél
              </h3>
              <Badge variant="info" size="sm">Ísland</Badge>
            </div>
            <p className="text-sm text-indigo-700 mt-1">
              Reiknaðu hversu mikið þú þarft fyrir hverja áfanga starfsloka
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-indigo-600">Heildarþörf</p>
                <p className="text-lg font-bold text-indigo-800">
                  {formatCurrency(totals.totalPersonalSavingsNeeded)}
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
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Starfslokaaldur"
              value={retirementAge}
              onChange={onRetirementAgeChange}
              min={40}
              max={66}
              helpText="Hvenær ætlar þú að hætta að vinna?"
            />
            <CurrencyInput
              label="Séreign við 60 ára (kr)"
              value={sereignBalanceAt60}
              onChange={onSereignBalanceChange}
              helpText="Áætluð uppsöfnun í séreignarsjóði"
            />
            <CurrencyInput
              label="Lífeyrissjóður við 67 ára (kr/mán)"
              value={occupationalPensionMonthly}
              onChange={onOccupationalPensionChange}
              helpText="Áætlaðar mánaðargreiðslur"
            />
          </div>

          {/* Current inputs display */}
          <div className="bg-white/50 rounded-lg p-3 text-sm">
            <div className="flex flex-wrap gap-4">
              <span>
                <strong>Mánaðarleg útgjöld:</strong> {formatCurrency(monthlyExpenses)}
              </span>
              <span>
                <strong>Margfaldari:</strong> {multiplier}x
              </span>
              <span>
                <strong>Starfslok:</strong> {retirementAge} ára
              </span>
            </div>
          </div>

          {/* Three Phases */}
          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-900">Þrír Fasar Starfsloka</h4>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Phase 1 */}
              {phase1.years > 0 ? (
                <PhaseCard
                  phase={1}
                  title="Persónulegur sparnaður eingöngu"
                  ageRange={`${phase1.startAge} - ${phase1.endAge} ára`}
                  years={phase1.years}
                  totalExpenses={phase1.totalExpenses}
                  coverage={phase1.coverage}
                  gap={phase1.gap}
                  fundingSource={phase1.fundingSource}
                  notes={phase1.notes}
                  variant="warning"
                />
              ) : (
                <div className="bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg p-4 flex items-center justify-center">
                  <p className="text-sm text-gray-500 text-center">
                    Engin Fasi 1 brú þarf
                    <br />
                    <span className="text-xs">(starfslok við 60+)</span>
                  </p>
                </div>
              )}

              {/* Phase 2 */}
              <PhaseCard
                phase={2}
                title="Séreign tiltæk (hefur EKKI áhrif á TR!)"
                ageRange={`${phase2.startAge} - ${phase2.endAge} ára`}
                years={phase2.years}
                totalExpenses={phase2.totalExpenses}
                coverage={phase2.coverage}
                gap={phase2.gap}
                fundingSource={phase2.fundingSource}
                notes={phase2.notes}
                variant="primary"
              />

              {/* Phase 3 */}
              <PhaseCard
                phase={3}
                title="Lífeyrissjóður + TR lífeyrir"
                ageRange={`${phase3.startAge}+ ára`}
                years="ævilangur"
                totalExpenses={0}
                coverage={phase3.totalPensionMonthly * 12}
                gap={phase3.fiNumberForGap}
                fundingSource={phase3.fundingSource}
                notes={`TR: ${formatCurrency(phase3.trPensionMonthly)}/mán + Lífeyrissjóður: ${formatCurrency(phase3.occupationalPensionMonthly)}/mán`}
                variant="success"
              />
            </div>
          </div>

          {/* Phase 3 Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-semibold text-green-900 mb-3">Fasi 3 Sundurliðun (67+ ára)</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/60 rounded p-2">
                <p className="text-xs text-green-700">Lífeyrissjóður</p>
                <p className="font-semibold">{formatCurrency(phase3.occupationalPensionMonthly)}/mán</p>
              </div>
              <div className="bg-white/60 rounded p-2">
                <p className="text-xs text-green-700">TR lífeyrir</p>
                <p className="font-semibold">{formatCurrency(phase3.trPensionMonthly)}/mán</p>
              </div>
              <div className="bg-white/60 rounded p-2">
                <p className="text-xs text-green-700">Heildarlífeyrir</p>
                <p className="font-semibold">{formatCurrency(phase3.totalPensionMonthly)}/mán</p>
              </div>
              <div className="bg-white/60 rounded p-2">
                <p className="text-xs text-orange-700">Bil til að dekka</p>
                <p className="font-semibold text-orange-700">{formatCurrency(phase3.monthlyGap)}/mán</p>
              </div>
            </div>
          </div>

          {/* Séreign Optimization Tip */}
          {sereignBalanceAt60 > 0 && (
            <Alert variant="info">
              <div className="space-y-2">
                <p className="font-semibold text-sm">Ráðlagðar séreign úttektir (60-67 ára)</p>
                <p className="text-sm">
                  Með {formatCurrency(sereignBalanceAt60)} í séreign við 60 ára og 4% ávöxtun:
                </p>
                <ul className="text-sm ml-4 list-disc">
                  <li>
                    Mánaðarleg úttekt: <strong>{formatCurrency(sereignWithdrawal.monthlyWithdrawal)}</strong>/mán
                  </li>
                  <li>
                    {sereignWithdrawal.coversFullExpenses
                      ? 'Séreign dekkar öll útgjöld á þessu tímabili!'
                      : `Vantar ${formatCurrency(sereignWithdrawal.shortfall)}/mán til að dekka útgjöld`}
                  </li>
                </ul>
              </div>
            </Alert>
          )}

          {/* Summary */}
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-300 rounded-xl p-6">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg">Samantekt</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm text-neutral-600">Hefðbundin FI-tala (án lífeyris)</p>
                <p className="text-2xl font-bold text-neutral-400 line-through">
                  {formatCurrency(totals.traditionalFINumber)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-green-400">
                <p className="text-sm text-green-700 font-medium">
                  Raunveruleg þörf (með lífeyri)
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(totals.totalPersonalSavingsNeeded)}
                </p>
              </div>
            </div>

            {totals.savingsFromPensions > 0 && (
              <div className="text-center">
                <Badge variant="success" size="lg">
                  Sparnaður: {formatCurrency(totals.savingsFromPensions)} ({totals.savingsPercentage}%)
                </Badge>
                <p className="text-sm text-green-800 mt-2">
                  Þökk sé íslensku lífeyriskerfinu þarftu {totals.savingsPercentage}% minna í
                  persónulegum sparnaði!
                </p>
              </div>
            )}

            {/* Breakdown */}
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm text-indigo-800 font-medium mb-2">Sundurliðun:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Fasi 1 ({phase1.startAge}-{phase1.endAge}):</span>
                  <span className="font-medium">{formatCurrency(phase1.gap)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fasi 2 (60-67):</span>
                  <span className="font-medium">{formatCurrency(phase2.gap)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fasi 3 FI (67+):</span>
                  <span className="font-medium">{formatCurrency(phase3.fiNumberForGap)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold">
                  <span>Samtals:</span>
                  <span>{formatCurrency(totals.totalPersonalSavingsNeeded)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Tips */}
          <Alert variant="success">
            <div className="space-y-2">
              <p className="font-semibold">Stefnumótandi ráð:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Hámarka séreign framlög (4% + 2% mótframlag) til að stækka Fasi 2 brúna</li>
                <li>Séreign úttektir hafa EKKI áhrif á TR réttindi þín - notaðu þetta!</li>
                <li>
                  Íhugaðu að seinka lífeyrissjóðsúttektum til 67 ára til að fá hærri mánaðargreiðslur
                </li>
                <li>Ef lífeyrir dekkar útgjöld við 67, þarftu aðeins brúarfjármögnun</li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default BridgeAmountCalculator;
