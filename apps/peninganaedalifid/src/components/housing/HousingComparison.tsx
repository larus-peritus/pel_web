'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';
import type { HousingScenario } from '@/types/calculator';
import { HOUSING_TYPE_LABELS } from '@/types/calculator';
import { identifyBestAndWorst, calculateSavings } from '@/lib/calculations/housing';

/**
 * Props for HousingComparison component
 */
export interface HousingComparisonProps {
  scenarios: HousingScenario[];
  className?: string;
}

/**
 * HousingComparison - Side-by-side comparison of housing scenarios
 *
 * Features:
 * - Compare up to 4 scenarios
 * - Highlight cheapest (green) and most expensive (red)
 * - Show monthly cost, yearly cost, life energy
 * - Show savings relative to most expensive
 * - Show future value difference
 * - Responsive table layout
 *
 * @example
 * ```tsx
 * <HousingComparison scenarios={housingScenarios} />
 * ```
 */
export function HousingComparison({ scenarios, className }: HousingComparisonProps) {
  // Identify best and worst scenarios
  const { cheapestIndex, mostExpensiveIndex } = useMemo(
    () => identifyBestAndWorst(scenarios),
    [scenarios]
  );

  // Calculate savings for each scenario relative to most expensive
  const savingsData = useMemo(() => {
    if (mostExpensiveIndex === -1) return [];

    const mostExpensive = scenarios[mostExpensiveIndex];
    return scenarios.map((scenario) => {
      if (scenario.id === mostExpensive.id) {
        return {
          monthlySavings: 0,
          yearlySavings: 0,
          lifeEnergySavingsMonthly: 0,
          futureValue10YearsDifference: 0,
        };
      }
      return calculateSavings(mostExpensive, scenario);
    });
  }, [scenarios, mostExpensiveIndex]);

  if (scenarios.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-neutral-500">
          Engar atburðarásir til að bera saman
        </CardContent>
      </Card>
    );
  }

  if (scenarios.length === 1) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-neutral-500">
          Bættu við fleiri atburðarásum til að bera saman
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Samanburður á húsnæðisatburðarásum</h3>
        <p className="text-sm text-neutral-600 mt-1">
          {scenarios.length} atburðarásir | Grænn = Ódýrast | Rauður = Dýrast
        </p>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-2 font-medium text-neutral-700">Mælikvarði</th>
                {scenarios.map((scenario, index) => (
                  <th
                    key={scenario.id}
                    className={`text-right py-3 px-2 font-medium ${
                      index === cheapestIndex
                        ? 'text-green-700 bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'text-red-700 bg-red-50'
                        : 'text-neutral-700'
                    }`}
                  >
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {/* Housing Type */}
              <tr>
                <td className="py-3 px-2 text-neutral-600">Tegund</td>
                {scenarios.map((scenario, index) => (
                  <td
                    key={scenario.id}
                    className={`py-3 px-2 text-right ${
                      index === cheapestIndex
                        ? 'bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'bg-red-50'
                        : ''
                    }`}
                  >
                    <span className="text-xs">
                      {HOUSING_TYPE_LABELS[scenario.inputs.housingType]}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Monthly Cost */}
              <tr className="bg-neutral-50">
                <td className="py-3 px-2 font-medium text-neutral-900">Mánaðarkostnaður</td>
                {scenarios.map((scenario, index) => (
                  <td
                    key={scenario.id}
                    className={`py-3 px-2 text-right font-medium ${
                      index === cheapestIndex
                        ? 'text-green-700 bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'text-red-700 bg-red-50'
                        : 'text-neutral-900'
                    }`}
                  >
                    {formatCurrency(scenario.results.totalMonthlyCost)}
                  </td>
                ))}
              </tr>

              {/* Yearly Cost */}
              <tr>
                <td className="py-3 px-2 text-neutral-600">Árskostnaður</td>
                {scenarios.map((scenario, index) => (
                  <td
                    key={scenario.id}
                    className={`py-3 px-2 text-right ${
                      index === cheapestIndex
                        ? 'bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'bg-red-50'
                        : ''
                    }`}
                  >
                    {formatCurrency(scenario.results.totalYearlyCost)}
                  </td>
                ))}
              </tr>

              {/* Monthly Life Energy */}
              <tr className="bg-neutral-50">
                <td className="py-3 px-2 text-neutral-600">Lífsorka (klst/mán)</td>
                {scenarios.map((scenario, index) => (
                  <td
                    key={scenario.id}
                    className={`py-3 px-2 text-right ${
                      index === cheapestIndex
                        ? 'bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'bg-red-50'
                        : ''
                    }`}
                  >
                    {formatNumber(scenario.results.lifeEnergyMonthlyHours, 1)} klst
                  </td>
                ))}
              </tr>

              {/* Yearly Life Energy (Work Weeks) */}
              <tr>
                <td className="py-3 px-2 text-neutral-600">Lífsorka (vikur/ár)</td>
                {scenarios.map((scenario, index) => (
                  <td
                    key={scenario.id}
                    className={`py-3 px-2 text-right ${
                      index === cheapestIndex
                        ? 'bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'bg-red-50'
                        : ''
                    }`}
                  >
                    {formatNumber(scenario.results.lifeEnergyYearlyWorkWeeks, 1)} vikur
                  </td>
                ))}
              </tr>

              {/* Savings vs Most Expensive */}
              {mostExpensiveIndex !== -1 && (
                <>
                  <tr className="bg-blue-50">
                    <td className="py-3 px-2 font-medium text-blue-900" colSpan={scenarios.length + 1}>
                      Sparnaður miðað við dýrustu lausnina
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-neutral-600">Sparnaður á mánuði</td>
                    {savingsData.map((savings, index) => (
                      <td
                        key={scenarios[index].id}
                        className={`py-3 px-2 text-right ${
                          index === cheapestIndex
                            ? 'bg-green-50 font-medium text-green-700'
                            : index === mostExpensiveIndex
                            ? 'bg-red-50 text-neutral-400'
                            : 'text-green-600'
                        }`}
                      >
                        {savings.monthlySavings > 0 ? '+' : ''}
                        {formatCurrency(savings.monthlySavings)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-neutral-600">Sparnaður á ári</td>
                    {savingsData.map((savings, index) => (
                      <td
                        key={scenarios[index].id}
                        className={`py-3 px-2 text-right ${
                          index === cheapestIndex
                            ? 'bg-green-50 font-medium text-green-700'
                            : index === mostExpensiveIndex
                            ? 'bg-red-50 text-neutral-400'
                            : 'text-green-600'
                        }`}
                      >
                        {savings.yearlySavings > 0 ? '+' : ''}
                        {formatCurrency(savings.yearlySavings)}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* Future Value (10 years) */}
              <tr className="bg-amber-50">
                <td className="py-3 px-2 font-medium text-amber-900" colSpan={scenarios.length + 1}>
                  Framtíðarverðmæti (10 ár, 7% ávöxtun)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2 text-neutral-600">Ef fjárfest í staðinn</td>
                {scenarios.map((scenario, index) => (
                  <td
                    key={scenario.id}
                    className={`py-3 px-2 text-right ${
                      index === cheapestIndex
                        ? 'bg-green-50'
                        : index === mostExpensiveIndex
                        ? 'bg-red-50'
                        : ''
                    }`}
                  >
                    {formatCurrency(scenario.results.futureValue10Years)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-2 text-neutral-600">Mismunur miðað við dýrasta</td>
                {savingsData.map((savings, index) => (
                  <td
                    key={scenarios[index].id}
                    className={`py-3 px-2 text-right ${
                      index === cheapestIndex
                        ? 'bg-green-50 font-medium text-green-700'
                        : index === mostExpensiveIndex
                        ? 'bg-red-50 text-neutral-400'
                        : 'text-green-600'
                    }`}
                  >
                    {savings.futureValue10YearsDifference > 0 ? '+' : ''}
                    {formatCurrency(savings.futureValue10YearsDifference)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Insight */}
        {cheapestIndex !== -1 && mostExpensiveIndex !== -1 && cheapestIndex !== mostExpensiveIndex && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-900 mb-2">Innsýn</h4>
            <p className="text-sm text-primary-800">
              <strong>{scenarios[cheapestIndex].name}</strong> er ódýrasta lausnin með{' '}
              <strong>{formatCurrency(savingsData[cheapestIndex].monthlySavings)}</strong> sparnaði
              á mánuði miðað við <strong>{scenarios[mostExpensiveIndex].name}</strong>. Yfir 10 ár,
              ef þú fjárfestir mismuninn, gætir þú átt{' '}
              <strong>{formatCurrency(savingsData[cheapestIndex].futureValue10YearsDifference)}</strong>{' '}
              meira.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
