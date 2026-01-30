'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import type { CarOwnershipScenario } from '@/types/car-ownership';

/**
 * Props for CarOwnershipComparison component
 */
export interface CarOwnershipComparisonProps {
  scenarios: CarOwnershipScenario[];
  actualHourlyWage?: number;
  className?: string;
}

/**
 * CarOwnershipComparison - Side-by-side comparison of car ownership scenarios
 *
 * Features:
 * - Compare up to 4 scenarios
 * - Desktop: Comparison table
 * - Mobile: Stacked cards
 * - Color coding (green for cheapest, red for most expensive)
 * - Savings calculation
 * - Empty state for < 2 scenarios
 * - All text in Icelandic
 *
 * Columns:
 * - Name
 * - Monthly cost
 * - Yearly cost
 * - Life energy (hours/month)
 * - Future value (10 years)
 * - Difference from cheapest
 *
 * @example
 * ```tsx
 * <CarOwnershipComparison
 *   scenarios={carScenarios}
 *   actualHourlyWage={5000}
 * />
 * ```
 */
export function CarOwnershipComparison({
  scenarios,
  actualHourlyWage = 0,
  className = '',
}: CarOwnershipComparisonProps) {
  const hasWage = actualHourlyWage > 0;

  // Need at least 2 scenarios to compare
  if (scenarios.length < 2) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="info">
            <p>Búðu til að minnsta kosti 2 bíla til að bera saman.</p>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Find cheapest and most expensive scenarios
  const sortedByMonthlyCost = [...scenarios].sort(
    (a, b) => a.results.totalMonthlyCost - b.results.totalMonthlyCost
  );
  const cheapestScenario = sortedByMonthlyCost[0];
  const mostExpensiveScenario = sortedByMonthlyCost[sortedByMonthlyCost.length - 1];

  const monthlySavings =
    mostExpensiveScenario.results.totalMonthlyCost -
    cheapestScenario.results.totalMonthlyCost;
  const yearlySavings = monthlySavings * 12;

  const lifeEnergySavings = hasWage
    ? mostExpensiveScenario.results.lifeEnergyHoursPerMonth -
      cheapestScenario.results.lifeEnergyHoursPerMonth
    : 0;

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Savings Summary */}
        {monthlySavings > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-green-800">
                  Sparnaður með ódýrasta kostinum
                </p>
                <p className="text-sm text-gray-700">
                  Með því að velja <span className="font-semibold">{cheapestScenario.name}</span> í
                  stað <span className="font-semibold">{mostExpensiveScenario.name}</span> sparar þú:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">Á mánuði</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(monthlySavings)} kr
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Á ári</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(yearlySavings)} kr
                    </p>
                  </div>
                  {hasWage && lifeEnergySavings > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Lífsorka á mánuði</p>
                      <p className="text-2xl font-bold text-green-600">
                        {lifeEnergySavings.toFixed(1)} klst
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table View */}
        <Card className="hidden md:block">
          <CardHeader>
            <h4 className="font-semibold">Samanburður</h4>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                      Bíll
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Mán. kostnaður
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Ár. kostnaður
                    </th>
                    {hasWage && (
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Lífsorka/mán
                      </th>
                    )}
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      FV (10 ár)
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Munur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByMonthlyCost.map((scenario) => {
                    const isCheapest = scenario.id === cheapestScenario.id;
                    const isMostExpensive = scenario.id === mostExpensiveScenario.id;
                    const difference =
                      scenario.results.totalMonthlyCost -
                      cheapestScenario.results.totalMonthlyCost;

                    return (
                      <tr
                        key={scenario.id}
                        className={cn(
                          'border-b border-gray-100',
                          isCheapest && 'bg-green-50',
                          isMostExpensive && 'bg-red-50'
                        )}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{scenario.name}</span>
                            {isCheapest && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Ódýrastur
                              </span>
                            )}
                            {isMostExpensive && scenarios.length > 2 && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Dýrastur
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {formatCurrency(scenario.results.totalMonthlyCost)} kr
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {formatCurrency(scenario.results.totalYearlyCost)} kr
                        </td>
                        {hasWage && (
                          <td className="py-3 px-2 text-right">
                            {scenario.results.lifeEnergyHoursPerMonth.toFixed(1)} klst
                          </td>
                        )}
                        <td className="py-3 px-2 text-right text-green-600">
                          {formatCurrency(scenario.results.futureValue10Years)} kr
                        </td>
                        <td className="py-3 px-2 text-right">
                          {difference === 0 ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <span className="text-red-600">
                              +{formatCurrency(difference)} kr/mán
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden space-y-4">
          {sortedByMonthlyCost.map((scenario) => {
            const isCheapest = scenario.id === cheapestScenario.id;
            const isMostExpensive = scenario.id === mostExpensiveScenario.id;
            const difference =
              scenario.results.totalMonthlyCost -
              cheapestScenario.results.totalMonthlyCost;

            return (
              <Card
                key={scenario.id}
                className={cn(
                  isCheapest && 'border-green-300 bg-green-50',
                  isMostExpensive && 'border-red-300 bg-red-50'
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{scenario.name}</h4>
                    {isCheapest && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Ódýrastur
                      </span>
                    )}
                    {isMostExpensive && scenarios.length > 2 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Dýrastur
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mánaðarkostnaður</span>
                      <span className="font-semibold">
                        {formatCurrency(scenario.results.totalMonthlyCost)} kr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ár kostnaður</span>
                      <span className="font-semibold">
                        {formatCurrency(scenario.results.totalYearlyCost)} kr
                      </span>
                    </div>
                    {hasWage && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lífsorka/mán</span>
                        <span className="font-semibold">
                          {scenario.results.lifeEnergyHoursPerMonth.toFixed(1)} klst
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">FV (10 ár)</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(scenario.results.futureValue10Years)} kr
                      </span>
                    </div>
                    {difference > 0 && (
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Dýrara en ódýrasti</span>
                        <span className="font-semibold text-red-600">
                          +{formatCurrency(difference)} kr/mán
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
