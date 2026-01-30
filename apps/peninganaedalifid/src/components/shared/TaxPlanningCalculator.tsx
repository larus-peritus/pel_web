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
  calculateRetirementTax,
  compareTaxStrategies,
  calculateOptimalIncomeForCredit,
  ICELAND_TAX_BRACKETS,
  ICELAND_TAX_CONSTANTS,
  type IncomeSource,
} from '@/lib/calculations/taxPlanning';

/**
 * TaxPlanningCalculator Props
 */
export interface TaxPlanningCalculatorProps {
  /** Monthly pension income */
  pensionIncome?: number;
  /** Monthly séreign withdrawal */
  sereignWithdrawal?: number;
  /** Monthly capital gains/investment income */
  capitalGainsIncome?: number;
  /** TR pension (if eligible) */
  trPension?: number;
  /** Callbacks */
  onPensionChange?: (value: number) => void;
  onSereignChange?: (value: number) => void;
  onCapitalGainsChange?: (value: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * TaxPlanningCalculator Component
 *
 * Helps users understand after-tax retirement income in Iceland.
 * Shows tax brackets, effective rates, and optimization strategies.
 */
export const TaxPlanningCalculator: React.FC<TaxPlanningCalculatorProps> = ({
  pensionIncome = 0,
  sereignWithdrawal = 0,
  capitalGainsIncome = 0,
  trPension = 0,
  onPensionChange,
  onSereignChange,
  onCapitalGainsChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [localPension, setLocalPension] = useState(pensionIncome);
  const [localSereign, setLocalSereign] = useState(sereignWithdrawal);
  const [localCapitalGains, setLocalCapitalGains] = useState(capitalGainsIncome);
  const [localTR, setLocalTR] = useState(trPension);

  // Build income sources
  const incomeSources: IncomeSource[] = useMemo(() => {
    const sources: IncomeSource[] = [];
    if (localPension > 0) {
      sources.push({ type: 'pension', monthlyAmount: localPension, label: 'Lífeyrissjóður' });
    }
    if (localSereign > 0) {
      sources.push({ type: 'sereign', monthlyAmount: localSereign, label: 'Séreign' });
    }
    if (localCapitalGains > 0) {
      sources.push({ type: 'capital_gains', monthlyAmount: localCapitalGains, label: 'Fjármagnstekjur' });
    }
    if (localTR > 0) {
      sources.push({ type: 'pension', monthlyAmount: localTR, label: 'TR lífeyrir' });
    }
    return sources;
  }, [localPension, localSereign, localCapitalGains, localTR]);

  // Calculate tax
  const taxResult = useMemo(() => {
    return calculateRetirementTax(incomeSources);
  }, [incomeSources]);

  // Get optimal income for credit
  const optimalIncome = useMemo(() => {
    return calculateOptimalIncomeForCredit();
  }, []);

  // Compare strategies
  const totalMonthlyExpenses = localPension + localSereign + localCapitalGains + localTR;
  const strategies = useMemo(() => {
    if (totalMonthlyExpenses <= 0) return [];
    return compareTaxStrategies(
      localPension,
      localSereign,
      localCapitalGains,
      totalMonthlyExpenses
    );
  }, [localPension, localSereign, localCapitalGains, totalMonthlyExpenses]);

  // Handle changes
  const handlePensionChange = (value: number) => {
    setLocalPension(value);
    onPensionChange?.(value);
  };

  const handleSereignChange = (value: number) => {
    setLocalSereign(value);
    onSereignChange?.(value);
  };

  const handleCapitalGainsChange = (value: number) => {
    setLocalCapitalGains(value);
    onCapitalGainsChange?.(value);
  };

  return (
    <Card
      variant="elevated"
      className={cn('border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Skattaáætlun
              </h3>
              <Badge variant="info" size="sm">Ísland 2024</Badge>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              Reiknaðu tekjur eftir skatt og hámarka nettótekjur
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-slate-600">Virkt skatthlutfall</p>
                <p className="text-lg font-bold text-slate-800">
                  {formatNumber(taxResult.effectiveTaxRate * 100, 1)}%
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
          {/* Tax System Overview */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="font-semibold text-sm">Íslenskt skattkerfið í stuttu máli:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li><strong>Tekjuskattur:</strong> 31.45% - 46.45% (þrepaskiptur)</li>
                <li><strong>Fjármagnstekjuskattur:</strong> 22% fast hlutfall</li>
                <li><strong>Persónuafsláttur:</strong> ~{formatCurrency(ICELAND_TAX_CONSTANTS.PERSONAL_TAX_CREDIT_MONTHLY)}/mán</li>
              </ul>
            </div>
          </Alert>

          {/* Income Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CurrencyInput
              label="Lífeyrissjóður (kr/mán)"
              value={localPension}
              onChange={handlePensionChange}
              helpText="Tekjuskattað"
            />
            <CurrencyInput
              label="Séreign úttekt (kr/mán)"
              value={localSereign}
              onChange={handleSereignChange}
              helpText="Tekjuskattað"
            />
            <CurrencyInput
              label="Fjármagnstekjur (kr/mán)"
              value={localCapitalGains}
              onChange={handleCapitalGainsChange}
              helpText="22% skattur"
            />
            <CurrencyInput
              label="TR lífeyrir (kr/mán)"
              value={localTR}
              onChange={setLocalTR}
              helpText="Tekjuskattað"
            />
          </div>

          {/* Tax Brackets Visualization */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Skattþrep</h4>
            <div className="space-y-3">
              {[
                ICELAND_TAX_BRACKETS.BRACKET_1,
                ICELAND_TAX_BRACKETS.BRACKET_2,
                ICELAND_TAX_BRACKETS.BRACKET_3,
              ].map((bracket, idx) => {
                const isInBracket = taxResult.taxByBracket.some(
                  (b) => b.bracket === bracket.label
                );
                const bracketData = taxResult.taxByBracket.find(
                  (b) => b.bracket === bracket.label
                );

                return (
                  <div
                    key={bracket.label}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      isInBracket
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 bg-slate-50 opacity-60'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{bracket.label}</p>
                        <p className="text-sm text-slate-700">
                          {idx === 0
                            ? `0 - ${formatCurrency(ICELAND_TAX_BRACKETS.BRACKET_2.thresholdMonthly)} kr/mán`
                            : idx === 1
                            ? `${formatCurrency(ICELAND_TAX_BRACKETS.BRACKET_2.thresholdMonthly)} - ${formatCurrency(ICELAND_TAX_BRACKETS.BRACKET_3.thresholdMonthly)} kr/mán`
                            : `Yfir ${formatCurrency(ICELAND_TAX_BRACKETS.BRACKET_3.thresholdMonthly)} kr/mán`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">{formatNumber(bracket.rate * 100, 2)}%</p>
                        {bracketData && (
                          <p className="text-sm text-blue-600">
                            Skattur: {formatCurrency(bracketData.tax / 12)}/mán
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax Calculation Result */}
          <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-lg p-4 border border-slate-300">
            <h4 className="font-semibold text-slate-900 mb-3">Skattaútreikningur</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-800">Heildartekjur (brúttó):</span>
                <span className="font-medium text-slate-900">{formatCurrency(taxResult.grossIncome / 12)}/mán</span>
              </div>
              <div className="flex justify-between text-green-800">
                <span>Persónuafsláttur:</span>
                <span>-{formatCurrency(taxResult.personalTaxCredit / 12)}/mán</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Tekjuskattur:</span>
                <span>-{formatCurrency(taxResult.incomeTax / 12)}/mán</span>
              </div>
              {taxResult.capitalGainsTax > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Fjármagnstekjuskattur (22%):</span>
                  <span>-{formatCurrency(taxResult.capitalGainsTax / 12)}/mán</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-300">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-slate-900">Nettótekjur:</span>
                  <span className="text-green-700">{formatCurrency(taxResult.netIncome / 12)}/mán</span>
                </div>
                <div className="flex justify-between text-slate-700 text-xs mt-1">
                  <span>Virkt skatthlutfall:</span>
                  <span>{formatNumber(taxResult.effectiveTaxRate * 100, 1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Tax Credit Optimization */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Persónuafsláttur</h4>
            <p className="text-sm text-green-800">
              Með persónuafslætti (persónuafsláttur) getur þú fengið allt að{' '}
              <strong>{formatCurrency(ICELAND_TAX_CONSTANTS.PERSONAL_TAX_CREDIT_MONTHLY)}/mán</strong> endurgreitt.
            </p>
            <div className="mt-3 p-3 bg-white rounded border border-green-300">
              <p className="text-sm text-green-900">
                <strong>Hagstæðasta tekjustigið:</strong> ~{formatCurrency(optimalIncome.optimalMonthlyIncome)}/mán
              </p>
              <p className="text-xs text-green-800 mt-1">{optimalIncome.reason}</p>
            </div>
          </div>

          {/* Strategy Comparison */}
          {strategies.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Samanburður á úttektaraðferðum</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 text-slate-900">Aðferð</th>
                      <th className="text-right py-2 px-3 text-slate-900">Skattur/ár</th>
                      <th className="text-right py-2 px-3 text-slate-900">Nettó/mán</th>
                      <th className="text-right py-2 px-3 text-slate-900">Virkt %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strategies.map((strategy) => (
                      <tr
                        key={strategy.strategy}
                        className={cn(
                          'border-b border-slate-100',
                          strategy.annualTaxSavings === 0 && 'bg-green-50'
                        )}
                      >
                        <td className="py-2 px-3">
                          <p className="font-medium text-slate-900">{strategy.strategy}</p>
                          <p className="text-xs text-slate-700">{strategy.description}</p>
                        </td>
                        <td className="text-right py-2 px-3 text-slate-900">
                          {formatCurrency(strategy.taxResult.totalTax)}
                        </td>
                        <td className="text-right py-2 px-3 font-medium text-slate-900">
                          {formatCurrency(strategy.taxResult.netIncome / 12)}
                        </td>
                        <td className="text-right py-2 px-3 text-slate-900">
                          {formatNumber(strategy.taxResult.effectiveTaxRate * 100, 1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-700 mt-2">
                Græna röðin sýnir bestu aðferðina miðað við inntak þitt.
              </p>
            </div>
          )}

          {/* Key Insights */}
          <Alert variant="success">
            <div className="space-y-2">
              <p className="font-semibold">Lykilatriði um skatta á Íslandi:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>
                  <strong>Fjármagnstekjuskattur (22%)</strong> er oft lægri en tekjuskattur -
                  hagstætt að draga úr lífeyrissjóðstekjum
                </li>
                <li>
                  <strong>Persónuafsláttur</strong> getur núllað skatt við lágar tekjur
                </li>
                <li>
                  <strong>Séreign</strong> er skattað sem tekjur, en hefur ekki áhrif á TR
                </li>
                <li>
                  Háar lífeyristekjur = hærra skattþrep + enginn TR lífeyrir
                </li>
              </ul>
            </div>
          </Alert>

          {/* Disclaimer */}
          <div className="text-xs text-slate-700 p-3 bg-slate-50 rounded-lg">
            <strong>Fyrirvari:</strong> Þessi reiknivél gefur almenna leiðsögn og notar
            einfaldan útreikning. Raunveruleg skattálagning fer eftir mörgum þáttum.
            Ráðfærðu þig við skattaráðgjafa fyrir nákvæmari ráðleggingar.
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TaxPlanningCalculator;
