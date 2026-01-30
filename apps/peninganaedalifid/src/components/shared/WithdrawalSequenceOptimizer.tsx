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
  generateWithdrawalSequence,
  getOptimalWithdrawalOrder,
  type WithdrawalSequenceInput,
  type AccountType,
} from '@/lib/calculations/withdrawalSequence';
import { ICELAND_PENSION_AGES } from '@/lib/constants/fiNumber';

/**
 * WithdrawalSequenceOptimizer Props
 */
export interface WithdrawalSequenceOptimizerProps {
  /** Current age */
  currentAge: number;
  /** Target retirement age */
  retirementAge: number;
  /** Monthly expenses */
  monthlyExpenses: number;
  /** Current taxable account balance */
  taxableBalance?: number;
  /** Current séreign balance */
  sereignBalance?: number;
  /** Expected monthly occupational pension at 67 */
  occupationalPension?: number;
  /** Callbacks */
  onTaxableBalanceChange?: (balance: number) => void;
  onSereignBalanceChange?: (balance: number) => void;
  onOccupationalPensionChange?: (pension: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * Account type display info
 */
const ACCOUNT_INFO: Record<AccountType, { label: string; color: string; icon: string }> = {
  taxable: {
    label: 'Skattskyldur sparnaður',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '💰',
  },
  sereign: {
    label: 'Séreign',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '🌟',
  },
  occupational: {
    label: 'Lífeyrissjóður',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: '🏛️',
  },
  tr: {
    label: 'TR lífeyrir',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '🏠',
  },
};

/**
 * WithdrawalSequenceOptimizer Component
 *
 * Helps users understand the optimal order to withdraw from different
 * account types to minimize taxes and preserve TR benefits.
 *
 * Key Iceland insight: Séreign doesn't count against TR means-testing!
 */
export const WithdrawalSequenceOptimizer: React.FC<WithdrawalSequenceOptimizerProps> = ({
  currentAge,
  retirementAge,
  monthlyExpenses,
  taxableBalance = 0,
  sereignBalance = 0,
  occupationalPension = 0,
  onTaxableBalanceChange,
  onSereignBalanceChange,
  onOccupationalPensionChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [expectedReturn, setExpectedReturn] = useState(5);
  const [inflationRate, setInflationRate] = useState(4);

  // Generate withdrawal sequence
  const result = useMemo(() => {
    const input: WithdrawalSequenceInput = {
      currentAge,
      retirementAge,
      lifeExpectancy,
      monthlyExpenses,
      accounts: {
        taxable: taxableBalance,
        sereign: sereignBalance,
        occupationalMonthly: occupationalPension,
      },
      expectedReturns: {
        taxable: expectedReturn / 100,
        sereign: expectedReturn / 100,
      },
      inflationRate: inflationRate / 100,
    };

    return generateWithdrawalSequence(input);
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    monthlyExpenses,
    taxableBalance,
    sereignBalance,
    occupationalPension,
    expectedReturn,
    inflationRate,
  ]);

  // Get withdrawal order for different phases
  const phase1Order = getOptimalWithdrawalOrder(retirementAge);
  const phase2Order = getOptimalWithdrawalOrder(62);
  const phase3Order = getOptimalWithdrawalOrder(70);

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
                Úttektaröð Hagræðing
              </h3>
              <Badge variant="info" size="sm">Skattahagræðing</Badge>
            </div>
            <p className="text-sm text-indigo-700 mt-1">
              Hámarka tekjur með réttri úttektaröð
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-indigo-600">TR hagnaður</p>
                <p className="text-lg font-bold text-indigo-800">
                  {formatCurrency(result.totalTRReceived)}
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
          {/* Key Insight Alert */}
          <Alert variant="success">
            <div className="space-y-2">
              <p className="font-semibold text-sm">
                Rétt úttektaröð getur sparað milljónir!
              </p>
              <p className="text-sm">
                Á Íslandi er röðin lykilatriði vegna TR tekjutengingar.
                <strong> Séreign telst EKKI með</strong> í tekjuprófinu -
                þannig að þú getur tekið úr séreign án þess að missa TR!
              </p>
            </div>
          </Alert>

          {/* Account Balances Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              label="Skattskyldur sparnaður"
              value={taxableBalance}
              onChange={onTaxableBalanceChange || (() => {})}
              helpText="Hlutabréf, sjóðir utan lífeyris"
            />
            <CurrencyInput
              label="Séreign"
              value={sereignBalance}
              onChange={onSereignBalanceChange || (() => {})}
              helpText="Frjáls viðbótarlífeyrir"
            />
            <CurrencyInput
              label="Lífeyrissjóður (kr/mán við 67)"
              value={occupationalPension}
              onChange={onOccupationalPensionChange || (() => {})}
              helpText="Áætlaðar greiðslur"
            />
          </div>

          {/* Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Lífslíkur (aldur)"
              value={lifeExpectancy}
              onChange={setLifeExpectancy}
              min={70}
              max={100}
              helpText="Hversu lengi áætlar þú að lifa?"
            />
            <NumberInput
              label="Vænt ávöxtun (%)"
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={0}
              max={12}
              step={0.5}
              suffix="%"
              helpText="Á fjárfestingum"
            />
            <NumberInput
              label="Verðbólga (%)"
              value={inflationRate}
              onChange={setInflationRate}
              min={0}
              max={10}
              step={0.5}
              suffix="%"
              helpText="Áætluð verðbólga"
            />
          </div>

          {/* Optimal Withdrawal Order by Phase */}
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-4">Besta úttektaröð eftir aldri</h4>

            <div className="space-y-4">
              {/* Phase 1: Before 60 */}
              <div className="border-l-4 border-orange-400 pl-4">
                <p className="font-medium text-neutral-900">
                  Fasi 1: {retirementAge} - 59 ára
                </p>
                <p className="text-sm text-neutral-600 mb-2">
                  Aðeins skattskyldur sparnaður tiltækur
                </p>
                <div className="flex flex-wrap gap-2">
                  {phase1Order.map((type, idx) => (
                    <div
                      key={type}
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium border',
                        ACCOUNT_INFO[type].color
                      )}
                    >
                      {idx + 1}. {ACCOUNT_INFO[type].icon} {ACCOUNT_INFO[type].label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase 2: 60-66 */}
              <div className="border-l-4 border-emerald-400 pl-4">
                <p className="font-medium text-neutral-900">
                  Fasi 2: 60 - 66 ára
                </p>
                <p className="text-sm text-neutral-600 mb-2">
                  Séreign tiltæk - og hefur EKKI áhrif á TR!
                </p>
                <div className="flex flex-wrap gap-2">
                  {phase2Order.map((type, idx) => (
                    <div
                      key={type}
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium border',
                        ACCOUNT_INFO[type].color
                      )}
                    >
                      {idx + 1}. {ACCOUNT_INFO[type].icon} {ACCOUNT_INFO[type].label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase 3: 67+ */}
              <div className="border-l-4 border-purple-400 pl-4">
                <p className="font-medium text-neutral-900">
                  Fasi 3: 67+ ára
                </p>
                <p className="text-sm text-neutral-600 mb-2">
                  Allir lífeyrir tiltækir - hámarka TR með réttri röð
                </p>
                <div className="flex flex-wrap gap-2">
                  {phase3Order.map((type, idx) => (
                    <div
                      key={type}
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium border',
                        ACCOUNT_INFO[type].color
                      )}
                    >
                      {idx + 1}. {ACCOUNT_INFO[type].icon} {ACCOUNT_INFO[type].label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 border border-indigo-300">
            <h4 className="font-semibold text-indigo-900 mb-3">Niðurstöður</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-neutral-600">Safn endist í</p>
                <p className="text-xl font-bold text-indigo-700">
                  {result.portfolioSurvivalYears} ár
                </p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-neutral-600">Heildarskattur</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(result.totalTaxPaid)}
                </p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-neutral-600">TR lífeyrir samtals</p>
                <p className="text-xl font-bold text-purple-700">
                  {formatCurrency(result.totalTRReceived)}
                </p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-neutral-600">Ár með TR</p>
                <p className="text-xl font-bold text-green-700">
                  {Math.max(0, lifeExpectancy - 67)} ár
                </p>
              </div>
            </div>
          </div>

          {/* Strategy Explanation */}
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-3">Hvers vegna þessi röð?</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Séreign fyrst (eftir 60 ára)</p>
                  <p className="text-neutral-700">
                    Séreign úttektir hafa EKKI áhrif á TR réttindi. Þetta er lykilatriði!
                    Með því að nota séreign áður en þú byrjar á lífeyrissjóði, heldur þú
                    hámarks TR réttindum.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Skattskyldur sparnaður næst</p>
                  <p className="text-neutral-700">
                    Fjármagnstekjuskattur er 22% á hagnað - oft lægri en tekjuskattur
                    á lífeyri. Plús, það hefur ekki áhrif á TR.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Lífeyrissjóður síðast</p>
                  <p className="text-neutral-700">
                    Lífeyrissjóðstekjur skerða TR um 45% af upphæð yfir frítekjumarki.
                    Ef þú getur dregið úr þörfinni fyrir lífeyrissjóðstekjum, heldur
                    þú meiru af TR.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Alert variant="warning">
              <div className="space-y-2">
                <p className="font-semibold">Tillögur:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}

          {/* Important Note */}
          <Alert variant="info">
            <div className="space-y-1">
              <p className="font-semibold text-sm">Athugið</p>
              <p className="text-xs">
                Þessi reiknivél gefur almenna leiðsögn. Raunverulegar aðstæður geta verið
                flóknari - ráðfærðu þig við fjármálaráðgjafa fyrir persónulega áætlun.
                Skattalög og reglur geta breyst.
              </p>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default WithdrawalSequenceOptimizer;
