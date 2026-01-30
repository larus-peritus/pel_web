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
  estimateOccupationalPension,
  calculateEarlyWithdrawalReduction,
  calculateTRPension,
} from '@/lib/calculations/bridgeAmount';
import { ICELAND_PENSION_AGES, OCCUPATIONAL_PENSION } from '@/lib/constants/fiNumber';

/**
 * OccupationalPensionEstimator Props
 */
export interface OccupationalPensionEstimatorProps {
  /** Current age */
  currentAge: number;
  /** Years already contributed to pension fund */
  yearsContributed: number;
  /** Average monthly salary during working years */
  averageMonthlySalary: number;
  /** Planned retirement age (for early withdrawal calculations) */
  plannedRetirementAge?: number;
  /** Callbacks */
  onYearsContributedChange: (years: number) => void;
  onAverageSalaryChange: (salary: number) => void;
  onPensionEstimateChange?: (estimatedMonthlyPension: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * OccupationalPensionEstimator Component
 *
 * Helps users estimate their occupational pension (lífeyrissjóður) based on:
 * - Years of contributions
 * - Average salary
 * - Early withdrawal impact (if taking before 67)
 *
 * Based on Iceland law: 40 years of contributions = 56% replacement rate
 */
export const OccupationalPensionEstimator: React.FC<OccupationalPensionEstimatorProps> = ({
  currentAge,
  yearsContributed,
  averageMonthlySalary,
  plannedRetirementAge = 67,
  onYearsContributedChange,
  onAverageSalaryChange,
  onPensionEstimateChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showEarlyWithdrawal, setShowEarlyWithdrawal] = useState(false);
  const [earlyWithdrawalAge, setEarlyWithdrawalAge] = useState(60);

  // Calculate pension estimates
  const estimates = useMemo(() => {
    // Full pension at 67 with current years
    const pensionAt67 = estimateOccupationalPension(yearsContributed, averageMonthlySalary);

    // Pension if working until 67
    const yearsToRetirement = Math.max(0, 67 - currentAge);
    const totalYearsAt67 = Math.min(40, yearsContributed + yearsToRetirement);
    const pensionIfWorkTo67 = estimateOccupationalPension(totalYearsAt67, averageMonthlySalary);

    // Replacement rate
    const currentReplacementRate = averageMonthlySalary > 0
      ? (pensionAt67 / averageMonthlySalary) * 100
      : 0;
    const maxReplacementRate = averageMonthlySalary > 0
      ? (pensionIfWorkTo67 / averageMonthlySalary) * 100
      : 0;

    // Early withdrawal scenarios
    const earlyWithdrawal60 = calculateEarlyWithdrawalReduction(pensionIfWorkTo67, 60);
    const earlyWithdrawal62 = calculateEarlyWithdrawalReduction(pensionIfWorkTo67, 62);
    const earlyWithdrawal65 = calculateEarlyWithdrawalReduction(pensionIfWorkTo67, 65);
    const customEarlyWithdrawal = calculateEarlyWithdrawalReduction(pensionIfWorkTo67, earlyWithdrawalAge);

    // TR pension with occupational pension
    const trWithPension = calculateTRPension(pensionIfWorkTo67, true);
    const totalMonthlyAt67 = pensionIfWorkTo67 + trWithPension;

    // Notify parent of estimate change
    if (onPensionEstimateChange) {
      onPensionEstimateChange(pensionIfWorkTo67);
    }

    return {
      pensionAt67,
      pensionIfWorkTo67,
      currentReplacementRate,
      maxReplacementRate,
      totalYearsAt67,
      yearsToRetirement,
      earlyWithdrawal60,
      earlyWithdrawal62,
      earlyWithdrawal65,
      customEarlyWithdrawal,
      trWithPension,
      totalMonthlyAt67,
    };
  }, [yearsContributed, averageMonthlySalary, currentAge, earlyWithdrawalAge, onPensionEstimateChange]);

  return (
    <Card
      variant="elevated"
      className={cn('border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-amber-900">
                Lífeyrissjóður Áætlun
              </h3>
              <Badge variant="warning" size="sm">Ísland</Badge>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Áætlaðu lífeyrissjóðsgreiðslur byggt á iðgjaldaárum og launum
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-amber-600">Áætlaður lífeyrir</p>
                <p className="text-lg font-bold text-amber-800">
                  {formatCurrency(estimates.pensionIfWorkTo67)}/mán
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
          {/* Educational Alert */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Íslenski lífeyrissjóðakerfið:</strong> Vinnuveitandi og launþegi
                greiða samtals {formatNumber(OCCUPATIONAL_PENSION.TOTAL_CONTRIBUTION_RATE * 100, 1)}% af launum í lífeyrissjóð.
              </p>
              <p className="text-sm">
                Eftir {OCCUPATIONAL_PENSION.FULL_BENEFIT_YEARS} ár af iðgjöldum færð þú{' '}
                {formatNumber(OCCUPATIONAL_PENSION.TARGET_REPLACEMENT_RATE * 100, 0)}% af meðallaunum
                sem mánaðarlegan lífeyri.
              </p>
            </div>
          </Alert>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Iðgjaldaár (núverandi)"
              value={yearsContributed}
              onChange={onYearsContributedChange}
              min={0}
              max={50}
              helpText="Hversu mörg ár hefur þú greitt í lífeyrissjóð?"
            />
            <CurrencyInput
              label="Meðallaun (kr/mán)"
              value={averageMonthlySalary}
              onChange={onAverageSalaryChange}
              helpText="Meðallaun yfir starfsævina"
            />
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3">Núverandi staða</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-neutral-600">Núverandi aldur</p>
                <p className="font-semibold">{currentAge} ára</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Iðgjaldaár</p>
                <p className="font-semibold">{yearsContributed} ár</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Ár til 67</p>
                <p className="font-semibold">{estimates.yearsToRetirement} ár</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Samtals við 67</p>
                <p className="font-semibold">{estimates.totalYearsAt67} ár</p>
              </div>
            </div>
          </div>

          {/* Pension Estimates */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4 border border-amber-300">
            <h4 className="font-semibold text-amber-900 mb-3">Áætlaður lífeyrir við 67 ára</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/70 rounded-lg p-4">
                <p className="text-sm text-neutral-600">Ef þú hættir núna</p>
                <p className="text-2xl font-bold text-amber-700">
                  {formatCurrency(estimates.pensionAt67)}/mán
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  ({formatNumber(estimates.currentReplacementRate, 0)}% af launum)
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-green-400">
                <p className="text-sm text-green-700 font-medium">Ef þú vinnur til 67 ára</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(estimates.pensionIfWorkTo67)}/mán
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ({formatNumber(estimates.maxReplacementRate, 0)}% af launum)
                </p>
              </div>
            </div>

            {/* With TR */}
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-amber-800 font-medium">Með TR lífeyri (við 67)</p>
                  <p className="text-xs text-amber-600">
                    Lífeyrissjóður + TR = Heildarlífeyrir
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(estimates.totalMonthlyAt67)}/mán
                  </p>
                  <p className="text-xs text-neutral-500">
                    ({formatCurrency(estimates.pensionIfWorkTo67)} + {formatCurrency(estimates.trWithPension)})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Early Withdrawal Section */}
          <div className="border border-amber-200 rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-full px-4 py-3 bg-amber-50 flex items-center justify-between hover:bg-amber-100 transition-colors"
              onClick={() => setShowEarlyWithdrawal(!showEarlyWithdrawal)}
            >
              <span className="font-semibold text-amber-900">
                Snemmbær úttekt (60-66 ára)
              </span>
              <svg
                className={cn('h-5 w-5 transition-transform duration-200', showEarlyWithdrawal && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showEarlyWithdrawal && (
              <div className="p-4 space-y-4">
                <Alert variant="warning">
                  <p className="text-sm">
                    <strong>Varúð:</strong> Að byrja lífeyristökur fyrir 67 ára aldur
                    lækkar mánaðargreiðslur <em>varanlega</em> um ~6.5% á ári.
                  </p>
                </Alert>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200">
                        <th className="text-left py-2 px-3">Úttökualdur</th>
                        <th className="text-right py-2 px-3">Mánaðarlegur lífeyrir</th>
                        <th className="text-right py-2 px-3">Skerðing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-amber-100">
                        <td className="py-2 px-3">60 ára</td>
                        <td className="text-right py-2 px-3 font-medium text-orange-700">
                          {formatCurrency(estimates.earlyWithdrawal60.reducedMonthlyPension)}
                        </td>
                        <td className="text-right py-2 px-3 text-red-600">
                          -{estimates.earlyWithdrawal60.reductionPercentage}%
                        </td>
                      </tr>
                      <tr className="border-b border-amber-100">
                        <td className="py-2 px-3">62 ára</td>
                        <td className="text-right py-2 px-3 font-medium text-orange-700">
                          {formatCurrency(estimates.earlyWithdrawal62.reducedMonthlyPension)}
                        </td>
                        <td className="text-right py-2 px-3 text-red-600">
                          -{estimates.earlyWithdrawal62.reductionPercentage}%
                        </td>
                      </tr>
                      <tr className="border-b border-amber-100">
                        <td className="py-2 px-3">65 ára</td>
                        <td className="text-right py-2 px-3 font-medium text-yellow-700">
                          {formatCurrency(estimates.earlyWithdrawal65.reducedMonthlyPension)}
                        </td>
                        <td className="text-right py-2 px-3 text-orange-600">
                          -{estimates.earlyWithdrawal65.reductionPercentage}%
                        </td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-2 px-3 font-semibold">67 ára (fullt)</td>
                        <td className="text-right py-2 px-3 font-bold text-green-700">
                          {formatCurrency(estimates.pensionIfWorkTo67)}
                        </td>
                        <td className="text-right py-2 px-3 text-green-600">0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Custom Age Calculator */}
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-end gap-4">
                    <NumberInput
                      label="Sérsniðinn úttökualdur"
                      value={earlyWithdrawalAge}
                      onChange={setEarlyWithdrawalAge}
                      min={60}
                      max={67}
                      className="flex-1"
                    />
                    <div className="pb-1">
                      <p className="text-xs text-neutral-600">Áætlaður lífeyrir</p>
                      <p className="text-xl font-bold text-amber-700">
                        {formatCurrency(estimates.customEarlyWithdrawal.reducedMonthlyPension)}/mán
                      </p>
                      <p className="text-xs text-red-600">
                        (-{estimates.customEarlyWithdrawal.reductionPercentage}% skerðing)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Strategy Tips */}
          <Alert variant="success">
            <div className="space-y-2">
              <p className="font-semibold">Ráðleggingar:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Notaðu séreign til að brúa 60-67 í stað snemmbærrar lífeyristöku</li>
                <li>Séreign úttektir skerða ekki TR réttindi - lífeyrissjóður gerir það</li>
                <li>Ef þú getur beðið til 67, færðu fullan lífeyri ævilangt</li>
                <li>Mismunandi sjóðir hafa mismunandi skerðingarreglur - athugaðu hjá þínum sjóði</li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default OccupationalPensionEstimator;
