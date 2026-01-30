'use client';

/**
 * Debt Payoff vs Invest Analyzer Page
 * Main orchestrator component for debt analysis feature
 */

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { DebtInput, InvestmentAssumptions, DebtPayoffResults, PaymentMethod } from '@/types/debtPayoff';
import { compareDebtVsInvestment, calculatePaymentBreakdown } from '@/lib/calculations/debtPayoff';
import {
  DEFAULT_INVESTMENT_ASSUMPTIONS,
  ICELANDIC_LOAN_PRESETS,
} from '@/lib/constants/debtPayoff';
import { HEADINGS, DISCLAIMER, RECOMMENDATION_LABELS, formatMonthsText, formatLifeEnergyText } from '@/lib/content/debtPayoff';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { AmortizationSchedule } from './AmortizationSchedule';

interface DebtPayoffPageProps {
  actualHourlyWage?: number;
}

export function DebtPayoffPage({ actualHourlyWage = 0 }: DebtPayoffPageProps) {
  // State for debt input
  const [debt, setDebt] = useState<DebtInput>({
    id: 'current',
    loanType: 'oVerdtryggd',
    currentBalance: 2_000_000,
    nominalInterestRate: 0.09,
    minimumPayment: 40_000,
    extraPayment: 10_000,
    loanTermMonths: undefined,
    remainingPayments: undefined,
    paymentMethod: 'annuity',
    inflationRate: undefined,
  });

  // Calculate payment breakdown
  const paymentBreakdown = useMemo(() => {
    return calculatePaymentBreakdown(debt);
  }, [debt]);

  // State for investment assumptions
  const [investment, setInvestment] = useState<InvestmentAssumptions>(DEFAULT_INVESTMENT_ASSUMPTIONS);

  // Calculate results
  const results = useMemo<DebtPayoffResults | null>(() => {
    if (!actualHourlyWage || actualHourlyWage === 0) {
      return null;
    }

    try {
      return compareDebtVsInvestment(debt, investment, actualHourlyWage);
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, [debt, investment, actualHourlyWage]);

  // Apply preset
  const handlePresetClick = useCallback((presetId: string) => {
    const preset = ICELANDIC_LOAN_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setDebt((prev) => ({
        ...prev,
        loanType: preset.loanType,
        nominalInterestRate: preset.typicalRate,
        inflationRate: preset.typicalInflation,
        // Reset payment method based on loan type
        paymentMethod: preset.loanType === 'verdtryggd' ? undefined : 'annuity',
      }));
    }
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{HEADINGS.mainTitle}</h1>
        <p className="text-gray-600">
          Berðu saman fjárhagslegan ávinning af því að borga aukalega á skuld á móti því að fjárfesta peningana
        </p>
      </div>

      {!actualHourlyWage || actualHourlyWage === 0 ? (
        <Alert variant="warning" className="mb-6">
          <strong>Athugið:</strong> Þú verður að reikna raunverulegt tímakaup þitt fyrst til að nota þennan
          reiknivél. Farðu á forsíðu til að reikna tímakaupið þitt.
        </Alert>
      ) : null}

      {/* Preset Selector */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">{HEADINGS.presets}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ICELANDIC_LOAN_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant="secondary"
                onClick={() => handlePresetClick(preset.id)}
                className="text-left h-auto py-3 px-4"
              >
                <div>
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {formatPercentage(preset.typicalRate * 100)} vextir
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Debt Input Form */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">{HEADINGS.debtInput}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loan Type Selector */}
            <Select
              label="Tegund láns"
              value={debt.loanType}
              onChange={(val) => setDebt({
                ...debt,
                loanType: val as 'verdtryggd' | 'oVerdtryggd' | 'other',
                // Reset payment method when switching loan types
                paymentMethod: val === 'verdtryggd' ? undefined : (debt.paymentMethod || 'annuity'),
                inflationRate: val === 'verdtryggd' ? (debt.inflationRate ?? 0.05) : undefined,
              })}
              options={[
                { value: 'oVerdtryggd', label: 'Óverðtryggt' },
                { value: 'verdtryggd', label: 'Verðtryggt' },
                { value: 'other', label: 'Annað' },
              ]}
            />

            <CurrencyInput
              label="Núverandi staða"
              value={debt.currentBalance}
              onChange={(val) => setDebt({ ...debt, currentBalance: val })}
              helpText="Heildarupphæð skuldar"
            />

            <NumberInput
              label="Vextir (árleg %)"
              value={Math.round(debt.nominalInterestRate * 10000) / 100}
              onChange={(val) => setDebt({ ...debt, nominalInterestRate: val / 100 })}
              min={0}
              max={50}
              step={0.1}
            />

            {/* Inflation rate for indexed loans */}
            {debt.loanType === 'verdtryggd' && (
              <NumberInput
                label="Áætluð verðbólga (árleg %)"
                value={Math.round((debt.inflationRate ?? 0.05) * 10000) / 100}
                onChange={(val) => setDebt({ ...debt, inflationRate: val / 100 })}
                min={0}
                max={20}
                step={0.1}
                helpText="Verðbólga hækkar höfuðstól verðtryggðra lána"
              />
            )}

            {/* Payment method for non-indexed loans */}
            {debt.loanType === 'oVerdtryggd' && (
              <Select
                label="Greiðslumáti"
                value={debt.paymentMethod || 'annuity'}
                onChange={(val) => setDebt({ ...debt, paymentMethod: val as PaymentMethod })}
                options={[
                  { value: 'annuity', label: 'Jafnar afborganir (sama upphæð)' },
                  { value: 'linear', label: 'Jafnar höfuðstólsgreiðslur (lækkandi)' },
                ]}
              />
            )}

            <NumberInput
              label="Lánstími (mánuðir)"
              value={debt.loanTermMonths ?? 0}
              onChange={(val) => setDebt({ ...debt, loanTermMonths: val > 0 ? val : undefined })}
              min={0}
              max={600}
              step={1}
              helpText="Valfrjálst - heildarlengd láns í mánuðum"
            />

            <NumberInput
              label="Eftirstandandi greiðslur"
              value={debt.remainingPayments ?? 0}
              onChange={(val) => setDebt({ ...debt, remainingPayments: val > 0 ? val : undefined })}
              min={0}
              max={600}
              step={1}
              helpText="Valfrjálst - fjöldi greiðslna sem eftir eru"
            />

            <div className="md:col-span-2">
              <CurrencyInput
                label="Aukagreiðsla (mánaðarlega)"
                value={debt.extraPayment}
                onChange={(val) => setDebt({ ...debt, extraPayment: val })}
                helpText="Upphæð sem þú vilt borga umfram reiknuðu greiðsluna"
              />
            </div>
          </div>

          {/* Calculated Payment Breakdown */}
          {paymentBreakdown.monthlyPayment > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Sundurliðun greiðslu</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Mánaðarleg greiðsla</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(paymentBreakdown.monthlyPayment)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-700">Afborgun á höfuðstól</div>
                  <div className="text-xl font-bold text-green-900">
                    {formatCurrency(paymentBreakdown.principalPayment)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Lækkar skuldina þína
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-red-700">Vextir mánaðarlega</div>
                  <div className="text-xl font-bold text-red-900">
                    {formatCurrency(paymentBreakdown.interestPayment)}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    Fer til bankans
                  </div>
                </div>
                {debt.loanType === 'verdtryggd' && paymentBreakdown.inflationAdjustment !== undefined && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-sm text-yellow-700">Verðbótaþáttur (mánaðarlega)</div>
                    <div className="text-xl font-bold text-yellow-900">
                      {formatCurrency(paymentBreakdown.inflationAdjustment)}
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      Hækkar höfuðstól lánsins
                    </div>
                  </div>
                )}
              </div>
              {actualHourlyWage > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">Lífsorka fyrir greiðslu</div>
                  <div className="text-xl font-bold text-blue-900">
                    {(paymentBreakdown.monthlyPayment / actualHourlyWage).toFixed(1)} klst
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Vinnutímar sem þarf til að borga mánaðarlega greiðslu
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Input */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">{HEADINGS.investmentInput}</h2>
        </CardHeader>
        <CardContent>
          <NumberInput
            label="Vænt ávöxtun (árleg %)"
            value={Math.round(investment.expectedAnnualReturn * 10000) / 100}
            onChange={(val) =>
              setInvestment({ ...investment, expectedAnnualReturn: val / 100 })
            }
            min={0}
            max={20}
            step={0.1}
            helpText="Sögulegt meðaltal hlutabréfa: ~7-8% langtíma"
          />
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">{HEADINGS.recommendation}</h2>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {results.comparison.recommendation === 'debt'
                    ? RECOMMENDATION_LABELS.debt
                    : RECOMMENDATION_LABELS.invest}
                </h3>

                <div className="space-y-2 mb-4">
                  <div>
                    <strong>Fjárhagslegur ávinningur:</strong>
                    <div className="ml-4">
                      <div>• {formatCurrency(results.comparison.financialAdvantage)} yfir lánstímann</div>
                      <div>
                        • {formatLifeEnergyText(results.comparison.lifeEnergyAdvantage)} að spara
                      </div>
                      <div>• {formatPercentage(results.comparison.percentageAdvantage / 100)} betri niðurstaða</div>
                    </div>
                  </div>
                </div>

                <div>
                  <strong>Rökstuðningur:</strong>
                  <ul className="ml-6 mt-2 list-disc">
                    {results.comparison.reasoning.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Alert variant="info">
                <p>{DISCLAIMER}</p>
              </Alert>
            </CardContent>
          </Card>

          {/* Comparison Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">{HEADINGS.debtScenario}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Skuldlaus eftir</div>
                    <div className="text-lg font-semibold">
                      {formatMonthsText(results.debtScenario.debtFreeMonth)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Heildarvextir</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(results.debtScenario.totalInterestPaid)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lífsorkutími</div>
                    <div className="text-lg font-semibold">
                      {formatLifeEnergyText(results.debtScenario.lifeEnergyHours)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">{HEADINGS.investmentScenario}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Lokastaða fjárfestingar</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(results.investmentScenario.finalInvestmentBalance)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Heildarframlög</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(results.investmentScenario.totalContributions)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Heildarhagnaður</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(results.investmentScenario.totalGains)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Amortization Schedule */}
          <AmortizationSchedule
            schedule={results.debtScenario.amortizationSchedule}
            totalPayment={results.debtScenario.amortizationSchedule.reduce((sum, row) => sum + row.payment, 0)}
            totalInterest={results.debtScenario.totalInterestPaid}
            totalPrincipal={results.debtScenario.totalPrincipalPaid}
            totalLifeEnergyHours={results.debtScenario.amortizationSchedule.reduce((sum, row) => sum + row.lifeEnergyHours, 0)}
          />
        </>
      )}

      {/* Snowball Calculator Cross-Reference */}
      <Card className="mt-6 border-indigo-200 bg-indigo-50">
        <CardHeader>
          <h2 className="text-xl font-semibold text-indigo-900">
            Snjóboltaáhrif vaxtasparnaðar
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Vissir þú að þegar þú borgar aukalega á lánið lækkar höfuðstóllinn og þar með vextirnir
            næsta mánuð? Þennan vaxtasparnað getur þú nýtt á tvo vegu:
          </p>
          <ul className="list-disc ml-6 mb-4 text-gray-700 space-y-1">
            <li>Bætt við aukagreiðslu á lánið (snjóboltaáhrif)</li>
            <li>Fjárfest sparnaðinn og byggt upp auð</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Snjóboltareiknivélin sýnir þér samanburð á þessum leiðum og hversu mikla lífsorku
            þú getur sparað með hverri aðferð.
          </p>
          <Link
            href={`/snjoboltareiknivel?data=${encodeURIComponent(JSON.stringify({
              currentBalance: debt.currentBalance,
              nominalInterestRate: debt.nominalInterestRate,
              loanType: debt.loanType,
              paymentMethod: debt.paymentMethod,
              inflationRate: debt.inflationRate,
              extraPayment: debt.extraPayment,
              loanTermMonths: debt.loanTermMonths,
              remainingPayments: debt.remainingPayments,
            }))}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Opna Snjóboltareiknivél
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
