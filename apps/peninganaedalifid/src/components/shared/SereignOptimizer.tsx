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
import { projectSereignBalance, calculateOptimalSereignWithdrawal } from '@/lib/calculations/bridgeAmount';
import { SEREIGN_PENSION, ICELAND_PENSION_AGES } from '@/lib/constants/fiNumber';

/**
 * SereignOptimizer Props
 */
export interface SereignOptimizerProps {
  /** Current age */
  currentAge: number;
  /** Current monthly salary */
  currentMonthlySalary: number;
  /** Current séreign balance */
  currentSereignBalance: number;
  /** Monthly expenses in retirement */
  monthlyExpenses: number;
  /** Callbacks */
  onCurrentAgeChange?: (age: number) => void;
  onSalaryChange?: (salary: number) => void;
  onBalanceChange?: (balance: number) => void;
  onProjectedBalanceChange?: (balance: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * SereignOptimizer Component
 *
 * Helps users optimize their séreign (private pension, Pillar III) strategy:
 * - Calculate optimal contribution rate
 * - Project balance at age 60
 * - Show employer matching benefit
 * - Plan withdrawal schedule for 60-67 bridge
 *
 * Key insight: Séreign withdrawals do NOT count against TR means-testing!
 */
export const SereignOptimizer: React.FC<SereignOptimizerProps> = ({
  currentAge,
  currentMonthlySalary,
  currentSereignBalance,
  monthlyExpenses,
  onCurrentAgeChange,
  onSalaryChange,
  onBalanceChange,
  onProjectedBalanceChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [contributionRate, setContributionRate] = useState(SEREIGN_PENSION.TYPICAL_CONTRIBUTION_RATE * 100);
  const [employerMatch, setEmployerMatch] = useState(SEREIGN_PENSION.TYPICAL_EMPLOYER_MATCH * 100);
  const [expectedReturn, setExpectedReturn] = useState(6);

  // Calculate projections
  const projections = useMemo(() => {
    const yearsTo60 = Math.max(0, SEREIGN_PENSION.ACCESS_AGE - currentAge);

    // Monthly contributions
    const employeeContribution = currentMonthlySalary * (contributionRate / 100);
    const employerContributionAmount = currentMonthlySalary * (employerMatch / 100);
    const totalMonthlyContribution = employeeContribution + employerContributionAmount;

    // Annual contributions
    const annualContribution = totalMonthlyContribution * 12;

    // Project balance at 60
    const projectedBalanceAt60 = projectSereignBalance(
      currentSereignBalance,
      currentAge,
      totalMonthlyContribution,
      expectedReturn / 100
    );

    // How much of balance comes from employer match
    const totalEmployerContributions = employerContributionAmount * 12 * yearsTo60;

    // Optimal withdrawal for 60-67 bridge
    const optimalWithdrawal = calculateOptimalSereignWithdrawal(
      projectedBalanceAt60,
      monthlyExpenses,
      0.04 // Conservative 4% return during withdrawal
    );

    // Compare to taxable investment (rough comparison)
    // Taxable: 22% capital gains tax
    const taxableEquivalent = projectedBalanceAt60 * (1 - 0.22 * 0.5); // Rough estimate

    // Notify parent of projected balance
    if (onProjectedBalanceChange) {
      onProjectedBalanceChange(projectedBalanceAt60);
    }

    return {
      yearsTo60,
      employeeContribution,
      employerContributionAmount,
      totalMonthlyContribution,
      annualContribution,
      projectedBalanceAt60,
      totalEmployerContributions,
      optimalWithdrawal,
      taxableEquivalent,
      freeMoneyFromEmployer: totalEmployerContributions,
    };
  }, [
    currentAge,
    currentMonthlySalary,
    currentSereignBalance,
    contributionRate,
    employerMatch,
    expectedReturn,
    monthlyExpenses,
    onProjectedBalanceChange,
  ]);

  // Calculate bridge coverage percentage
  const phase2TotalExpenses = 7 * 12 * monthlyExpenses; // 60-67 = 7 years
  const bridgeCoveragePercent = phase2TotalExpenses > 0
    ? Math.min(100, (projections.projectedBalanceAt60 / phase2TotalExpenses) * 100)
    : 0;

  return (
    <Card
      variant="elevated"
      className={cn('border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-emerald-900">
                Séreign Hagræðing
              </h3>
              <Badge variant="success" size="sm">Skattahagstætt</Badge>
            </div>
            <p className="text-sm text-emerald-700 mt-1">
              Hámarka frjálsan viðbótarlífeyri fyrir 60-67 ára brúna
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-emerald-600">Áætlað við 60 ára</p>
                <p className="text-lg font-bold text-emerald-800">
                  {formatCurrency(projections.projectedBalanceAt60)}
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
                Hvers vegna séreign er besta brúin fyrir 60-67 ára?
              </p>
              <ul className="text-sm ml-4 list-disc">
                <li><strong>Hefur EKKI áhrif á TR réttindi</strong> - úttektir skerða ekki ríkislífeyri!</li>
                <li><strong>Skattfrestun</strong> - þú greiðir ekki skatt fyrr en við úttekt</li>
                <li><strong>Mótframlag vinnuveitanda</strong> - frítt fé (venjulega 2%)</li>
                <li><strong>Aðgengilegt frá 60 ára</strong> - 7 ár fyrr en lífeyrissjóður</li>
              </ul>
            </div>
          </Alert>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CurrencyInput
              label="Núverandi séreign (kr)"
              value={currentSereignBalance}
              onChange={onBalanceChange || (() => {})}
              helpText="Uppsafnað í séreignarsjóði"
            />
            <CurrencyInput
              label="Mánaðarlaun (kr)"
              value={currentMonthlySalary}
              onChange={onSalaryChange || (() => {})}
              helpText="Brúttólaun á mánuði"
            />
            <NumberInput
              label="Þitt framlag (%)"
              value={contributionRate}
              onChange={setContributionRate}
              min={0}
              max={10}
              step={0.5}
              suffix="%"
              helpText="Venjulega 4%"
            />
            <NumberInput
              label="Mótframlag vinnuv. (%)"
              value={employerMatch}
              onChange={setEmployerMatch}
              min={0}
              max={6}
              step={0.5}
              suffix="%"
              helpText="Venjulega 2%"
            />
          </div>

          {/* Return Rate */}
          <div className="flex items-center gap-4">
            <NumberInput
              label="Vænt ávöxtun (%/ár)"
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={0}
              max={12}
              step={0.5}
              suffix="%"
              className="w-48"
            />
            <div className="text-sm text-neutral-600 pt-6">
              <span className="font-medium">{projections.yearsTo60} ár</span> til 60 ára aldurs
            </div>
          </div>

          {/* Monthly Contribution Breakdown */}
          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-900 mb-3">Mánaðarleg framlög</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Þitt framlag ({contributionRate}%):</span>
                <span className="font-medium">{formatCurrency(projections.employeeContribution)}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Mótframlag vinnuveitanda ({employerMatch}%):</span>
                <span className="font-medium">+{formatCurrency(projections.employerContributionAmount)}</span>
              </div>
              <div className="pt-2 border-t border-emerald-200">
                <div className="flex justify-between font-semibold">
                  <span>Samtals á mánuði:</span>
                  <span className="text-emerald-700">{formatCurrency(projections.totalMonthlyContribution)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-xs mt-1">
                  <span>Samtals á ári:</span>
                  <span>{formatCurrency(projections.annualContribution)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Free Money Highlight */}
          {projections.freeMoneyFromEmployer > 0 && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎁</div>
                <div>
                  <p className="font-semibold text-green-900">Frítt fé frá vinnuveitanda</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(projections.freeMoneyFromEmployer)}
                  </p>
                  <p className="text-xs text-green-600">
                    Yfir {projections.yearsTo60} ár með {employerMatch}% mótframlagi
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Projection at 60 */}
          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300 rounded-xl p-6">
            <h4 className="font-bold text-emerald-900 mb-4 text-lg">Áætluð séreign við 60 ára</h4>

            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-emerald-700">
                {formatCurrency(projections.projectedBalanceAt60)}
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                Með {expectedReturn}% ávöxtun á ári
              </p>
            </div>

            {/* Bridge Coverage */}
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm text-neutral-600 mb-2">Dekking fyrir 60-67 ára brúna:</p>
              <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    bridgeCoveragePercent >= 100 ? 'bg-green-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${Math.min(100, bridgeCoveragePercent)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-neutral-600">
                  {formatNumber(bridgeCoveragePercent, 0)}% af {formatCurrency(phase2TotalExpenses)}
                </span>
                {bridgeCoveragePercent >= 100 ? (
                  <Badge variant="success">Fullt dekkað!</Badge>
                ) : (
                  <span className="text-orange-600">
                    Vantar {formatCurrency(phase2TotalExpenses - projections.projectedBalanceAt60)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Withdrawal Plan */}
          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-900 mb-3">Úttektaráætlun (60-67 ára)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-700">Ráðlögð mánaðarúttekt</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(projections.optimalWithdrawal.monthlyWithdrawal)}/mán
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Til að endast í 7 ár (84 mán)
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-700">Þín útgjöld</p>
                <p className="text-xl font-bold text-neutral-700">
                  {formatCurrency(monthlyExpenses)}/mán
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-700">Bil</p>
                {projections.optimalWithdrawal.coversFullExpenses ? (
                  <p className="text-xl font-bold text-green-600">
                    Fullt dekkað! +{formatCurrency(projections.optimalWithdrawal.monthlyWithdrawal - monthlyExpenses)}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-orange-600">
                    Vantar {formatCurrency(projections.optimalWithdrawal.shortfall)}/mán
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Comparison with Taxable */}
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <h4 className="font-semibold text-neutral-900 mb-3">Samanburður við skattskyldan sparnað</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600">Séreign (skattfrestun)</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(projections.projectedBalanceAt60)}
                </p>
                <p className="text-xs text-green-600">+ Mótframlag + Skattfrestun</p>
              </div>
              <div>
                <p className="text-neutral-600">Skattskyldur (22% fjármagnstekjuskattur)</p>
                <p className="text-xl font-bold text-neutral-500">
                  ~{formatCurrency(projections.taxableEquivalent)}
                </p>
                <p className="text-xs text-red-600">Engin mótframlag, skattur á ávöxtun</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="font-semibold">Ráðleggingar:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Hámarka framlag til að fá fullt mótframlag vinnuveitanda (venjulega 2%)</li>
                <li>Séreign vex skattfrjálst - þú greiðir skatt við úttekt (oft á lægri skattþrepi)</li>
                <li>Notaðu séreign sem brú til að varðveita TR réttindi eftir 67 ára</li>
                <li>Athugaðu hvort vinnuveitandi þinn býður hærra mótframlag</li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default SereignOptimizer;
