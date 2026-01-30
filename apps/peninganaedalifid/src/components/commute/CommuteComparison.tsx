'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/lib/utils';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import type { CommuteScenario } from '@/types/calculator';
import { COMMUTE_METHOD_LABELS } from '@/types/calculator';

/**
 * Props for CommuteComparison component
 */
export interface CommuteComparisonProps {
  scenarios: CommuteScenario[];
  actualHourlyWage: number;
  className?: string;
}

/**
 * Comparison data for a single scenario
 */
interface ScenarioComparison {
  scenario: CommuteScenario;
  monthlyCost: number;
  timePerMonth: number;
  lifeEnergyPerMonth: number;
  futureValue10Years: number;
  differenceFromCheapest: number;
  isCheapest: boolean;
  isExpensive: boolean;
}

/**
 * Icons for commute methods
 */
const METHOD_ICONS: Record<string, string> = {
  car: '🚗',
  transit: '🚌',
  bike: '🚴',
  walk: '🚶',
  remote: '🏠',
};

/**
 * CommuteComparison Component
 *
 * Displays side-by-side comparison of 2-4 commute scenarios with:
 * - Method icons and names
 * - Monthly costs
 * - Time spent per month
 * - Life energy cost
 * - 10-year future value
 * - Difference from cheapest option
 * - Color-coded highlighting (green=best, red=worst)
 * - Responsive design (table on desktop, cards on mobile)
 *
 * All text in Icelandic per app requirements.
 */
export function CommuteComparison({
  scenarios,
  actualHourlyWage,
  className,
}: CommuteComparisonProps) {
  const hasActualWage = actualHourlyWage > 0;

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    if (scenarios.length < 2) return [];

    const data: ScenarioComparison[] = scenarios.map((scenario) => ({
      scenario,
      monthlyCost: scenario.results.totalMonthlyCost,
      timePerMonth: scenario.results.timePerMonthHours,
      lifeEnergyPerMonth: scenario.results.totalLifeEnergyHoursPerMonth,
      futureValue10Years: scenario.results.futureValue10Years,
      differenceFromCheapest: 0,
      isCheapest: false,
      isExpensive: false,
    }));

    // Find cheapest and most expensive
    const minCost = Math.min(...data.map((d) => d.monthlyCost));
    const maxCost = Math.max(...data.map((d) => d.monthlyCost));

    // Update flags and differences
    data.forEach((d) => {
      d.differenceFromCheapest = d.monthlyCost - minCost;
      d.isCheapest = d.monthlyCost === minCost;
      d.isExpensive = d.monthlyCost === maxCost && maxCost !== minCost;
    });

    return data;
  }, [scenarios]);

  // Empty state - need at least 2 scenarios
  if (scenarios.length < 2) {
    return (
      <Card variant="outlined" className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-lg text-neutral-600 mb-2">Engar sviðsmyndir til að bera saman</p>
          <p className="text-sm text-neutral-500">
            Búðu til að minnsta kosti 2 sviðsmyndir til að sjá samanburð
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find cheapest and most expensive scenarios for savings message
  const cheapestScenario = comparisonData.find((d) => d.isCheapest);
  const expensiveScenario = comparisonData.find((d) => d.isExpensive);

  return (
    <Card variant="elevated" className={className}>
      <CardHeader className="bg-gradient-to-r from-primary-50 to-neutral-50">
        <h2 className="text-xl font-bold text-neutral-800">Samanburður vinnuferða</h2>
        <p className="text-sm text-neutral-600">
          Berðu saman kostnaður, tíma og lífsorku milli mismunandi valmöguleika
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Warning if no actual wage */}
        {!hasActualWage && (
          <Alert variant="warning">
            <p className="text-sm">
              Fylltu fyrst út Raunverulegt Tímakaup reiknivélina til að sjá lífsorku kostnað
            </p>
          </Alert>
        )}

        {/* Savings message */}
        {cheapestScenario && expensiveScenario && expensiveScenario !== cheapestScenario && (
          <Alert variant="success">
            <p className="text-sm font-medium">
              Með því að skipta úr <strong>{expensiveScenario.scenario.name}</strong> yfir í{' '}
              <strong>{cheapestScenario.scenario.name}</strong> sparar þú{' '}
              <strong>{formatCurrency(expensiveScenario.differenceFromCheapest)}</strong> og{' '}
              <strong>
                {formatLifeEnergy(
                  expensiveScenario.lifeEnergyPerMonth - cheapestScenario.lifeEnergyPerMonth
                )}
              </strong>{' '}
              á mánuði.
            </p>
          </Alert>
        )}

        {/* Desktop table view (hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-200">
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Heiti</th>
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Ferðamáti</th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                  Kostnaður/mán
                </th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">Tími/mán</th>
                {hasActualWage && (
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                    Lífsorka/mán
                  </th>
                )}
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">FV (10 ár)</th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">Munur</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((data) => {
                const rowClass = data.isCheapest
                  ? 'bg-success-50 border-success-200'
                  : data.isExpensive
                    ? 'bg-error-50 border-error-200'
                    : 'bg-white';

                return (
                  <tr key={data.scenario.id} className={`border-b border-neutral-200 ${rowClass}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-800">{data.scenario.name}</span>
                        {data.isCheapest && (
                          <span className="text-xs bg-success-200 text-success-800 px-2 py-1 rounded">
                            Besta
                          </span>
                        )}
                        {data.isExpensive && (
                          <span className="text-xs bg-error-200 text-error-800 px-2 py-1 rounded">
                            Dýrasta
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {METHOD_ICONS[data.scenario.inputs.commuteMethod]}
                        </span>
                        <span className="text-sm text-neutral-600">
                          {COMMUTE_METHOD_LABELS[data.scenario.inputs.commuteMethod]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-neutral-800">
                      {formatCurrency(data.monthlyCost)}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-700">
                      {data.timePerMonth.toFixed(1)} klst
                    </td>
                    {hasActualWage && (
                      <td className="py-3 px-4 text-right text-neutral-700">
                        {formatLifeEnergy(data.lifeEnergyPerMonth)}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right text-neutral-700">
                      {formatCurrency(data.futureValue10Years)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {data.differenceFromCheapest === 0 ? (
                        <span className="text-success-700 font-medium">—</span>
                      ) : (
                        <span className="text-error-700 font-medium">
                          +{formatCurrency(data.differenceFromCheapest)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card view (visible on mobile only) */}
        <div className="lg:hidden space-y-4">
          {comparisonData.map((data) => {
            const cardClass = data.isCheapest
              ? 'border-success-300 bg-success-50'
              : data.isExpensive
                ? 'border-error-300 bg-error-50'
                : 'border-neutral-200';

            return (
              <div
                key={data.scenario.id}
                className={`border-2 rounded-lg p-4 ${cardClass} space-y-3`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-800">{data.scenario.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl">
                        {METHOD_ICONS[data.scenario.inputs.commuteMethod]}
                      </span>
                      <span className="text-sm text-neutral-600">
                        {COMMUTE_METHOD_LABELS[data.scenario.inputs.commuteMethod]}
                      </span>
                    </div>
                  </div>
                  {data.isCheapest && (
                    <span className="text-xs bg-success-200 text-success-800 px-2 py-1 rounded">
                      Besta
                    </span>
                  )}
                  {data.isExpensive && (
                    <span className="text-xs bg-error-200 text-error-800 px-2 py-1 rounded">
                      Dýrasta
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-600">Kostnaður/mán</p>
                    <p className="text-lg font-bold text-neutral-800">
                      {formatCurrency(data.monthlyCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Tími/mán</p>
                    <p className="text-lg font-bold text-neutral-800">
                      {data.timePerMonth.toFixed(1)} klst
                    </p>
                  </div>
                  {hasActualWage && (
                    <>
                      <div>
                        <p className="text-xs text-neutral-600">Lífsorka/mán</p>
                        <p className="text-sm font-medium text-neutral-800">
                          {formatLifeEnergy(data.lifeEnergyPerMonth)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">FV (10 ár)</p>
                        <p className="text-sm font-medium text-neutral-800">
                          {formatCurrency(data.futureValue10Years)}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Difference */}
                {data.differenceFromCheapest > 0 && (
                  <div className="pt-2 border-t border-neutral-300">
                    <p className="text-xs text-neutral-600">Munur frá ódýrasta valkosti</p>
                    <p className="text-sm font-bold text-error-700">
                      +{formatCurrency(data.differenceFromCheapest)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
