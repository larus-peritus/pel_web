'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  ICELAND_PENSION_AGES,
  TR_MEANS_TEST,
  SEREIGN_PENSION,
  RETIREMENT_AGE_RANGE,
} from '@/lib/constants/fiNumber';

/**
 * Three-Phase Planning Section Props
 */
export interface ThreePhasePlanningSectionProps {
  /** Target retirement age */
  targetRetirementAge: number;
  /** Monthly expenses */
  monthlyExpenses: number;
  /** FI multiplier used */
  multiplier: number;
  /** Expected monthly occupational pension at age 67 */
  occupationalPension: number | null;
  /** Expected séreign balance at age 60 */
  sereignBalance: number | null;
  /** Current age (optional, for calculations) */
  currentAge?: number | null;
  /** Callbacks */
  onRetirementAgeChange: (age: number) => void;
  onOccupationalPensionChange: (pension: number | null) => void;
  onSereignBalanceChange: (balance: number | null) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Calculate expected TR pension based on other income (means-testing)
 */
function calculateTRPension(otherMonthlyIncome: number): number {
  // If no other income, get full TR
  if (otherMonthlyIncome <= TR_MEANS_TEST.INCOME_EXEMPTION) {
    return TR_MEANS_TEST.MAX_MONTHLY_SINGLE;
  }

  // Calculate reduction
  const incomeAboveExemption = otherMonthlyIncome - TR_MEANS_TEST.INCOME_EXEMPTION;
  const reduction = incomeAboveExemption * TR_MEANS_TEST.REDUCTION_RATE;
  const trPension = Math.max(0, TR_MEANS_TEST.MAX_MONTHLY_SINGLE - reduction);

  return Math.round(trPension);
}

/**
 * ThreePhasePlanningSection Component
 *
 * Shows Iceland's three-phase retirement planning:
 * - Phase 1: Early retirement → Age 60 (personal savings only)
 * - Phase 2: Age 60-67 (séreign available, doesn't affect TR!)
 * - Phase 3: Age 67+ (occupational pension + TR pension)
 *
 * Key Iceland insight: Séreign withdrawals don't count against TR means-testing,
 * making it an excellent bridge for the 60-67 period.
 */
export const ThreePhasePlanningSection: React.FC<ThreePhasePlanningSectionProps> = ({
  targetRetirementAge,
  monthlyExpenses,
  multiplier,
  occupationalPension,
  sereignBalance,
  currentAge,
  onRetirementAgeChange,
  onOccupationalPensionChange,
  onSereignBalanceChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Annual expenses
  const annualExpenses = monthlyExpenses * 12;

  // Calculate phases
  const phases = useMemo(() => {
    const retireAge = targetRetirementAge || 55;
    const sereignAge = ICELAND_PENSION_AGES.SEREIGN_ACCESS_AGE;
    const pensionAge = ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE;

    // Phase 1: Retirement → Age 60
    const phase1Years = Math.max(0, sereignAge - retireAge);
    const phase1Needed = phase1Years * annualExpenses;

    // Phase 2: Age 60-67 (séreign available)
    const phase2Years = pensionAge - sereignAge; // Always 7 years
    const phase2TotalExpenses = phase2Years * annualExpenses;
    // Séreign can cover part of Phase 2
    const sereignCoverage = sereignBalance || 0;
    const phase2Gap = Math.max(0, phase2TotalExpenses - sereignCoverage);

    // Phase 3: Age 67+ (pensions available)
    const monthlyOccupational = occupationalPension || 0;
    // Calculate TR based on occupational pension (séreign doesn't count!)
    const monthlyTR = calculateTRPension(monthlyOccupational);
    const totalMonthlyPension = monthlyOccupational + monthlyTR;
    const monthlyGap = Math.max(0, monthlyExpenses - totalMonthlyPension);
    const annualGap = monthlyGap * 12;
    // FI number for post-67 (only need to cover the gap)
    const phase3FI = annualGap * multiplier;

    // Total needed in personal savings
    const totalPersonalSavingsNeeded = phase1Needed + phase2Gap + phase3FI;

    // Full FI without any pension consideration
    const fullFI = annualExpenses * multiplier;

    // Savings from pension planning
    const savingsFromPensions = fullFI - totalPersonalSavingsNeeded;

    return {
      phase1: {
        years: phase1Years,
        startAge: retireAge,
        endAge: sereignAge,
        needed: phase1Needed,
        description: 'Persónulegur sparnaður eingöngu',
      },
      phase2: {
        years: phase2Years,
        startAge: sereignAge,
        endAge: pensionAge,
        totalExpenses: phase2TotalExpenses,
        sereignCoverage,
        gap: phase2Gap,
        description: 'Séreign tiltæk (hefur ekki áhrif á TR!)',
      },
      phase3: {
        startAge: pensionAge,
        monthlyOccupational,
        monthlyTR,
        totalMonthlyPension,
        monthlyGap,
        fiNeeded: phase3FI,
        description: 'Lífeyrissjóður + TR lífeyrir',
      },
      totals: {
        fullFI,
        personalSavingsNeeded: totalPersonalSavingsNeeded,
        savingsFromPensions,
        savingsPercentage: fullFI > 0 ? (savingsFromPensions / fullFI) * 100 : 0,
      },
    };
  }, [targetRetirementAge, annualExpenses, multiplier, occupationalPension, sereignBalance, monthlyExpenses]);

  return (
    <Card variant="elevated" className={cn('border-2 border-primary-200', className)}>
      <CardHeader
        className="cursor-pointer bg-gradient-to-r from-primary-50 to-blue-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-primary-900">
                Þriggja fasa áætlun
              </h3>
              <Badge variant="primary" size="sm">Ísland</Badge>
            </div>
            <p className="text-sm text-primary-700 mt-1">
              Nýttu íslenska lífeyriskerfið til að lækka FI-tölu þína
            </p>
          </div>
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
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-6">
          {/* Educational Alert */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="font-semibold">Íslenska lífeyriskerfið hefur þrjá stoðir:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li><strong>Lífeyrisstoð I (TR):</strong> Ríkislífeyrir, tekjutengdur (hámark ~315.000 kr/mán)</li>
                <li><strong>Lífeyrisstoð II:</strong> Lífeyrissjóður (15,5% af launum), aðgengilegt frá 60-67 ára</li>
                <li><strong>Lífeyrisstoð III (Séreign):</strong> Frjáls viðbótarlífeyrir, aðgengilegt frá 60 ára</li>
              </ul>
              <p className="text-sm font-semibold text-primary-700 mt-2">
                💡 Mikilvægt: Séreign úttektir hafa EKKI áhrif á TR réttindi!
              </p>
            </div>
          </Alert>

          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Markmið starfslokaaldurs"
              value={targetRetirementAge}
              onChange={onRetirementAgeChange}
              min={RETIREMENT_AGE_RANGE.MIN}
              max={RETIREMENT_AGE_RANGE.MAX}
              helpText="Hvenær viltu hætta að vinna?"
            />
            <CurrencyInput
              label="Áætlaður lífeyrissjóður við 67 ára (kr/mán)"
              value={occupationalPension ?? 0}
              onChange={(v) => onOccupationalPensionChange(v > 0 ? v : null)}
              helpText="Áætlaðar greiðslur frá lífeyrissjóði"
            />
            <CurrencyInput
              label="Áætluð séreign við 60 ára (heildarupphæð)"
              value={sereignBalance ?? 0}
              onChange={(v) => onSereignBalanceChange(v > 0 ? v : null)}
              helpText="Uppsafnað í séreignarsjóði"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">Áætlaður TR lífeyrir</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(phases.phase3.monthlyTR)}/mán
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Byggt á {formatCurrency(phases.phase3.monthlyOccupational)}/mán lífeyrissjóði
                {phases.phase3.monthlyTR === 0 && ' (tekjur of háar fyrir TR)'}
              </p>
            </div>
          </div>

          {/* Three Phase Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-900">Tímalína</h4>

            {/* Phase 1 */}
            {phases.phase1.years > 0 && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Fasi 1</Badge>
                    <span className="font-semibold text-orange-900">
                      {phases.phase1.startAge} - {phases.phase1.endAge} ára
                    </span>
                    <span className="text-sm text-orange-700">
                      ({phases.phase1.years} ár)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-orange-800 mb-2">{phases.phase1.description}</p>
                <p className="text-xl font-bold text-orange-900">
                  Þarf: {formatCurrency(phases.phase1.needed)}
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  {formatCurrency(annualExpenses)}/ár × {phases.phase1.years} ár
                </p>
              </div>
            )}

            {/* Phase 2 */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">Fasi 2</Badge>
                  <span className="font-semibold text-blue-900">
                    {phases.phase2.startAge} - {phases.phase2.endAge} ára
                  </span>
                  <span className="text-sm text-blue-700">
                    ({phases.phase2.years} ár)
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-800 mb-2">{phases.phase2.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-xs text-blue-700">Heildarútgjöld</p>
                  <p className="font-semibold text-blue-900">
                    {formatCurrency(phases.phase2.totalExpenses)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Séreign dekkir</p>
                  <p className="font-semibold text-green-700">
                    -{formatCurrency(phases.phase2.sereignCoverage)}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-900">
                Þarf: {formatCurrency(phases.phase2.gap)}
              </p>
            </div>

            {/* Phase 3 */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Fasi 3</Badge>
                  <span className="font-semibold text-green-900">
                    {phases.phase3.startAge}+ ára
                  </span>
                  <span className="text-sm text-green-700">(ævilangur)</span>
                </div>
              </div>
              <p className="text-sm text-green-800 mb-2">{phases.phase3.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                <div className="bg-white/60 rounded p-2">
                  <p className="text-xs text-green-800">Lífeyrissjóður</p>
                  <p className="font-semibold text-green-900">{formatCurrency(phases.phase3.monthlyOccupational)}/mán</p>
                </div>
                <div className="bg-white/60 rounded p-2">
                  <p className="text-xs text-green-800">TR lífeyrir</p>
                  <p className="font-semibold text-green-900">{formatCurrency(phases.phase3.monthlyTR)}/mán</p>
                </div>
                <div className="bg-white/60 rounded p-2">
                  <p className="text-xs text-green-800">Bil til að dekka</p>
                  <p className="font-semibold text-orange-700">{formatCurrency(phases.phase3.monthlyGap)}/mán</p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-900">
                FI fyrir bil: {formatCurrency(phases.phase3.fiNeeded)}
              </p>
              <p className="text-xs text-green-700 mt-1">
                {formatCurrency(phases.phase3.monthlyGap * 12)}/ár × {multiplier} margfaldari
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-primary-100 to-green-100 border-2 border-primary-300 rounded-xl p-6">
            <h4 className="font-bold text-primary-900 mb-4 text-lg">Samantekt</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm text-neutral-600">Full FI-tala (án lífeyris)</p>
                <p className="text-2xl font-bold text-neutral-400 line-through">
                  {formatCurrency(phases.totals.fullFI)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-green-400">
                <p className="text-sm text-green-700 font-medium">
                  Raunveruleg þörf (með lífeyri)
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(phases.totals.personalSavingsNeeded)}
                </p>
              </div>
            </div>
            {phases.totals.savingsFromPensions > 0 && (
              <div className="mt-4 text-center">
                <Badge variant="success" size="lg">
                  Sparnaður: {formatCurrency(phases.totals.savingsFromPensions)} ({formatNumber(phases.totals.savingsPercentage, 0)}%)
                </Badge>
                <p className="text-sm text-green-800 mt-2">
                  Þökk sé íslensku lífeyriskerfinu þarftu {formatNumber(phases.totals.savingsPercentage, 0)}% minna í persónulegum sparnaði!
                </p>
              </div>
            )}
          </div>

          {/* Strategy Tips */}
          <Alert variant="success">
            <div className="space-y-2">
              <p className="font-semibold">Stefnumótandi ráð:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Notaðu séreign sem brú frá 60-67 - það hefur ekki áhrif á TR réttindi þín</li>
                <li>Ef þú hefur lágar tekjur eftir 67, getur TR lífeyrir dekkað stóran hluta</li>
                <li>Íhugaðu að draga úr lífeyrissjóðsgreiðslum til að hámarka TR</li>
                <li>Frjáls viðbótarlífeyrir (séreign) er skattahagstæðastur brúarsparnaður</li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};
