'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';
import type { HousingScenario } from '@/types/calculator';
import { HOUSING_TYPE_LABELS, LOAN_TYPE_LABELS } from '@/types/calculator';

/**
 * Props for HousingSummary component
 */
export interface HousingSummaryProps {
  scenario: HousingScenario;
  className?: string;
}

/**
 * HousingSummary - Display housing cost results
 *
 * Shows:
 * - Monthly/yearly cost breakdown
 * - Life energy cost (hours, days, work weeks)
 * - Future value projections (5, 10, 20 years)
 * - Loan details if applicable (total interest, payment breakdown)
 * - Opportunity cost if owned paid off with property value
 *
 * @example
 * ```tsx
 * <HousingSummary scenario={housingScenario} />
 * ```
 */
export function HousingSummary({ scenario, className }: HousingSummaryProps) {
  const { inputs, results } = scenario;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{scenario.name}</h3>
            <p className="text-sm text-neutral-600">
              {HOUSING_TYPE_LABELS[inputs.housingType]}
              {inputs.housingType === 'owned_with_loan' &&
                inputs.loan &&
                ` • ${LOAN_TYPE_LABELS[inputs.loan.loanType]}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Monthly Cost Breakdown */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Mánaðarlegur kostnaður</h4>
          <div className="space-y-2">
            {results.monthlyHousingPayment > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">
                  {inputs.housingType === 'rental' ? 'Leiga' : 'Lánsgreiðsla'}
                </span>
                <span className="font-medium">{formatCurrency(results.monthlyHousingPayment)}</span>
              </div>
            )}
            {results.monthlyPropertyTax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Fasteignagjöld</span>
                <span className="font-medium">{formatCurrency(results.monthlyPropertyTax)}</span>
              </div>
            )}
            {results.monthlyInsurance > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tryggingar</span>
                <span className="font-medium">{formatCurrency(results.monthlyInsurance)}</span>
              </div>
            )}
            {results.monthlyMaintenance > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Viðhald</span>
                <span className="font-medium">{formatCurrency(results.monthlyMaintenance)}</span>
              </div>
            )}
            {results.monthlyHOAFees > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Félagsgjöld</span>
                <span className="font-medium">{formatCurrency(results.monthlyHOAFees)}</span>
              </div>
            )}
            {results.monthlyHeatCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Hiti</span>
                <span className="font-medium">{formatCurrency(results.monthlyHeatCost)}</span>
              </div>
            )}
            {results.monthlyElectricityCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Rafmagn</span>
                <span className="font-medium">{formatCurrency(results.monthlyElectricityCost)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-neutral-200">
              <span className="font-semibold text-neutral-900">Samtals á mánuði</span>
              <span className="font-semibold text-primary-600">
                {formatCurrency(results.totalMonthlyCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Samtals á ári</span>
              <span className="font-medium">{formatCurrency(results.totalYearlyCost)}</span>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        {results.loanInfo && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-neutral-900 mb-3">Lánsupplýsingar</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Mánaðarleg greiðsla</span>
                <span className="font-medium">{formatCurrency(results.loanInfo.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Heildargreiðslur</span>
                <span className="font-medium">
                  {formatCurrency(results.loanInfo.totalPaymentsOverLife)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Heildarvextir</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(results.loanInfo.totalInterestPaid)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Vextir % af heildargreiðslum</span>
                <span className="font-medium">
                  {formatNumber(results.loanInfo.interestPercentage, 1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Opportunity Cost */}
        {results.monthlyOpportunityCost && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-neutral-900 mb-2">Fórnarkostnaður</h4>
            <p className="text-sm text-neutral-600 mb-2">
              Ef þú fjárfestir verðmæti eignarinnar í staðinn við 7% ávöxtun:
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Mánaðarleg ávöxtun</span>
              <span className="font-medium text-amber-700">
                {formatCurrency(results.monthlyOpportunityCost)}
              </span>
            </div>
          </div>
        )}

        {/* Life Energy Cost */}
        <div className="p-4 bg-primary-50 rounded-lg">
          <h4 className="font-medium text-neutral-900 mb-3">Lífsorka</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Klukkustundir á mánuði</span>
              <span className="font-medium">
                {formatNumber(results.lifeEnergyMonthlyHours, 1)} klst
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Klukkustundir á ári</span>
              <span className="font-medium">
                {formatNumber(results.lifeEnergyYearlyHours, 0)} klst
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Dagar á ári</span>
              <span className="font-medium">{formatNumber(results.lifeEnergyYearlyDays, 1)} dagar</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Vinnudagar á ári</span>
              <span className="font-medium">
                {formatNumber(results.lifeEnergyYearlyWorkDays, 0)} vinnudagar
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Vinnuvikur á ári</span>
              <span className="font-medium text-primary-600">
                {formatNumber(results.lifeEnergyYearlyWorkWeeks, 1)} vikur
              </span>
            </div>
          </div>
        </div>

        {/* Future Value Projections */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">
            Framtíðarverðmæti (ef fjárfest í staðinn)
          </h4>
          <p className="text-sm text-neutral-600 mb-3">
            Ef þú fjárfestir þessa upphæð í staðinn við 7% ávöxtun:
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Eftir 5 ár</span>
              <span className="font-medium">{formatCurrency(results.futureValue5Years)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Eftir 10 ár</span>
              <span className="font-medium">{formatCurrency(results.futureValue10Years)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Eftir 20 ár</span>
              <span className="font-medium text-green-600">
                {formatCurrency(results.futureValue20Years)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
