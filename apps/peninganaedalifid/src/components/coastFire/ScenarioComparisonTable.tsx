/**
 * ScenarioComparisonTable Component
 *
 * Display side-by-side comparison of three return rate scenarios:
 * - Conservative (4% real return)
 * - Moderate (6% real return)
 * - Optimistic (8% real return)
 *
 * Features:
 * - Three columns showing all scenarios
 * - Key metrics: Coast Age, Years to Coast, Gap, Projected Balance, Excess over FI
 * - Color coding per scenario
 * - Highlight selected scenario
 * - Mobile-responsive (stacked cards on small screens)
 * - Icelandic labels and formatting
 *
 * Epic 5, Task 5.1
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import type { ScenarioResult, ScenarioType } from '@/types/coastFire';
import { cn } from '@/lib/utils';

export interface ScenarioComparisonTableProps {
  scenarios: ScenarioResult[];
  selectedScenario: ScenarioType;
  fiNumber: number;
  className?: string;
}

/**
 * Get color classes for scenario type
 */
const getScenarioColors = (type: ScenarioType, isSelected: boolean) => {
  const colors = {
    conservative: {
      bg: isSelected ? 'bg-red-50' : 'bg-red-25',
      border: isSelected ? 'border-red-400' : 'border-red-200',
      text: 'text-red-900',
      accent: 'text-red-700',
      dot: 'bg-red-500',
    },
    moderate: {
      bg: isSelected ? 'bg-blue-50' : 'bg-blue-25',
      border: isSelected ? 'border-blue-400' : 'border-blue-200',
      text: 'text-blue-900',
      accent: 'text-blue-700',
      dot: 'bg-blue-500',
    },
    optimistic: {
      bg: isSelected ? 'bg-green-50' : 'bg-green-25',
      border: isSelected ? 'border-green-400' : 'border-green-200',
      text: 'text-green-900',
      accent: 'text-green-700',
      dot: 'bg-green-500',
    },
  };

  return colors[type];
};

/**
 * Format years with Icelandic text
 */
const formatYears = (years: number | null): string => {
  if (years === null) return '—';
  if (years === 0) return 'Núna!';

  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);

  if (wholeYears === 0) {
    return `${months} mán.`;
  } else if (months === 0) {
    return `${wholeYears} ár`;
  } else {
    return `${wholeYears}á ${months}m`;
  }
};

/**
 * Format age
 */
const formatAge = (age: number | null): string => {
  if (age === null) return '—';
  return `${Math.round(age)} ára`;
};

/**
 * Get status emoji
 */
const getStatusEmoji = (status: string): string => {
  switch (status) {
    case 'coasting':
      return '✓';
    case 'future':
      return '→';
    case 'impossible':
      return '✗';
    default:
      return '';
  }
};

export function ScenarioComparisonTable({
  scenarios,
  selectedScenario,
  className,
}: ScenarioComparisonTableProps) {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Aðstæðugreining
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Samanburður þriggja ávöxtunarsviðsmynda
        </p>
      </CardHeader>

      <CardContent>
        {/* Desktop: Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-200">
                <th className="pb-3 pr-4 text-left text-sm font-semibold text-neutral-700">
                  Mælikvarði
                </th>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  return (
                    <th
                      key={scenario.type}
                      className={cn(
                        'pb-3 px-4 text-center text-sm font-semibold',
                        colors.text
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn('h-3 w-3 rounded-full', colors.dot)} />
                        <span>{scenario.name}</span>
                      </div>
                      <div className={cn('text-xs font-normal mt-1', colors.accent)}>
                        {scenario.returnRate}% ávöxtun
                      </div>
                      {scenario.type === selectedScenario && (
                        <div className="text-xs font-medium text-neutral-700 mt-1">
                          (núverandi val)
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Coast FIRE Age */}
              <tr className="border-b border-neutral-100">
                <td className="py-3 pr-4 text-sm text-neutral-700">
                  Sjálfvirkt FIRE aldur
                </td>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  return (
                    <td
                      key={scenario.type}
                      className={cn(
                        'py-3 px-4 text-center font-semibold',
                        colors.text
                      )}
                    >
                      {formatAge(scenario.coastFireAge)}
                    </td>
                  );
                })}
              </tr>

              {/* Years to Coast */}
              <tr className="border-b border-neutral-100">
                <td className="py-3 pr-4 text-sm text-neutral-700">
                  Tími til Sjálfvirkt FIRE
                </td>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  return (
                    <td
                      key={scenario.type}
                      className={cn(
                        'py-3 px-4 text-center font-semibold',
                        colors.text
                      )}
                    >
                      {formatYears(scenario.yearsToCoast)}
                    </td>
                  );
                })}
              </tr>

              {/* Status */}
              <tr className="border-b border-neutral-100">
                <td className="py-3 pr-4 text-sm text-neutral-700">
                  Staða
                </td>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  const statusText = {
                    coasting: 'Í Sjálfvirkt FIRE',
                    future: 'Framtíð',
                    impossible: 'Ómögulegt',
                  }[scenario.status];

                  return (
                    <td
                      key={scenario.type}
                      className={cn(
                        'py-3 px-4 text-center text-sm',
                        colors.text
                      )}
                    >
                      <span className="inline-flex items-center gap-1">
                        <span>{getStatusEmoji(scenario.status)}</span>
                        <span>{statusText}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Gap to Coast */}
              <tr className="border-b border-neutral-100">
                <td className="py-3 pr-4 text-sm text-neutral-700">
                  Bil til Sjálfvirkt FIRE
                </td>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  return (
                    <td
                      key={scenario.type}
                      className={cn(
                        'py-3 px-4 text-center text-sm',
                        colors.accent
                      )}
                    >
                      {scenario.gapToCoast !== null && scenario.gapToCoast > 0
                        ? formatCurrency(scenario.gapToCoast)
                        : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Projected Balance */}
              <tr className="border-b border-neutral-100">
                <td className="py-3 pr-4 text-sm text-neutral-700">
                  Áætluð staða við starfslok
                </td>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  return (
                    <td
                      key={scenario.type}
                      className={cn(
                        'py-3 px-4 text-center text-sm',
                        colors.accent
                      )}
                    >
                      {formatCurrency(scenario.projectedBalance)}
                    </td>
                  );
                })}
              </tr>

              {/* Excess over FI */}
              <tr>
                <td className="py-3 pr-4 text-sm text-neutral-700">
                  Umfram FI-tölu
                </td>
                {scenarios.map((scenario) => {
                  const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
                  const isPositive = scenario.excessOverFI >= 0;
                  return (
                    <td
                      key={scenario.type}
                      className={cn(
                        'py-3 px-4 text-center text-sm font-semibold',
                        isPositive ? colors.accent : 'text-red-600'
                      )}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(scenario.excessOverFI)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="md:hidden space-y-4">
          {scenarios.map((scenario) => {
            const colors = getScenarioColors(scenario.type, scenario.type === selectedScenario);
            const isPositive = scenario.excessOverFI >= 0;
            const statusText = {
              coasting: 'Í Sjálfvirkt FIRE',
              future: 'Framtíð',
              impossible: 'Ómögulegt',
            }[scenario.status];

            return (
              <div
                key={scenario.type}
                className={cn(
                  'rounded-lg border-2 p-4',
                  colors.bg,
                  colors.border
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-4 w-4 rounded-full', colors.dot)} />
                    <h3 className={cn('font-semibold', colors.text)}>
                      {scenario.name}
                    </h3>
                  </div>
                  <span className={cn('text-xs font-medium', colors.accent)}>
                    {scenario.returnRate}% ávöxtun
                  </span>
                </div>

                {scenario.type === selectedScenario && (
                  <div className="mb-3 text-xs font-medium text-neutral-600">
                    ★ Núverandi val
                  </div>
                )}

                {/* Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-700">Staða:</span>
                    <span className={cn('font-medium', colors.text)}>
                      {getStatusEmoji(scenario.status)} {statusText}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-700">Sjálfvirkt FIRE aldur:</span>
                    <span className={cn('font-semibold', colors.text)}>
                      {formatAge(scenario.coastFireAge)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-700">Tími til Sjálfvirkt FIRE:</span>
                    <span className={cn('font-semibold', colors.text)}>
                      {formatYears(scenario.yearsToCoast)}
                    </span>
                  </div>

                  {scenario.gapToCoast !== null && scenario.gapToCoast > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-700">Bil:</span>
                      <span className={cn('font-medium', colors.accent)}>
                        {formatCurrency(scenario.gapToCoast)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-700">Áætluð staða:</span>
                    <span className={cn('font-medium', colors.accent)}>
                      {formatCurrency(scenario.projectedBalance)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-700">Umfram FI:</span>
                    <span className={cn('font-semibold', isPositive ? colors.accent : 'text-red-600')}>
                      {isPositive ? '+' : ''}
                      {formatCurrency(scenario.excessOverFI)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info note */}
        <div className="mt-6 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">
          <p>
            <strong>Athugasemd:</strong> Þessar sviðsmyndir sýna hvernig mismunandi
            ávöxtunarkröfur hafa áhrif á Sjálfvirkt FIRE markmið þitt. Íhaldssöm ávöxtun
            (4%) er líklegri fyrir skuldabréfamiðað safn, en bjartsýn ávöxtun
            (8%) krefst hlutabréfamiðaðs safns með meiri áhættu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
