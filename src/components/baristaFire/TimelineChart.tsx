/**
 * TimelineChart - Visualization of path to FI for each scenario
 *
 * Displays:
 * - Line chart showing savings growth over time
 * - Different colored line for each scenario
 * - Coast FIRE baseline (dashed line)
 * - FI number target line (horizontal)
 * - Tooltips with detailed information
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type {
  BaristaFireResults,
  BaristaFireScenarioResult,
  TimelineProjection,
} from '@/types/baristaFire';
import { formatCurrency, formatNumber } from '@/lib/utils';

/**
 * Format large numbers for Y-axis (compact format)
 * e.g., 3000000 -> "3M", 150000 -> "150þ"
 */
function formatYAxisValue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}þ`;
  }
  return value.toString();
}

export interface TimelineChartProps {
  results: BaristaFireResults;
}

// Color palette for scenarios
const SCENARIO_COLORS = [
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#ea580c', // orange-600
  '#9333ea', // purple-600
  '#0891b2', // cyan-600
];

// Process data for chart
interface ChartDataPoint {
  year: number;
  age: number | null; // Age at this point (if currentAge provided)
  xLabel: string; // Display label for X-axis (age or year)
  coastFIRE: number;
  fiTarget: number;
  [scenarioId: string]: number | string | null;
}

function prepareChartData(results: BaristaFireResults): ChartDataPoint[] {
  const { coastFIRETimeline, scenarioResults, fiNumber, currentSavings, currentAge } = results;

  // Determine max years to display from all timelines
  // Include both valid FI timelines AND depletion timelines
  const yearsToConsider: number[] = [];

  // Add coast FIRE years if valid
  if (Number.isFinite(coastFIRETimeline.yearsToFI)) {
    yearsToConsider.push(coastFIRETimeline.yearsToFI);
  }

  // Add scenario years (both FI and depletion)
  scenarioResults.forEach(s => {
    if (Number.isFinite(s.yearsToFI) && s.yearsToFI >= 0) {
      yearsToConsider.push(s.yearsToFI);
    }
    if (s.willDeplete && s.yearsToDepletion !== null) {
      yearsToConsider.push(s.yearsToDepletion);
    }
    // Also use actual timeline data length
    if (s.timeline && s.timeline.dataPoints.length > 0) {
      const lastPoint = s.timeline.dataPoints[s.timeline.dataPoints.length - 1];
      yearsToConsider.push(lastPoint.year + 1);
    }
  });

  // Default to 30 years if no valid data, cap at 50 years
  const maxYears = yearsToConsider.length > 0
    ? Math.min(Math.ceil(Math.max(...yearsToConsider)), 50)
    : 30;

  const dataPoints: ChartDataPoint[] = [];

  // Generate data points for each year using ACTUAL timeline data
  for (let year = 0; year <= maxYears; year++) {
    const age = currentAge !== null ? currentAge + year : null;
    const point: ChartDataPoint = {
      year,
      age,
      xLabel: age !== null ? `${age}` : `${year}`,
      coastFIRE: currentSavings,
      fiTarget: fiNumber,
    };

    // Add Coast FIRE data from actual timeline
    const coastPoint = coastFIRETimeline.dataPoints.find(
      (dp) => dp.year === year && dp.month === 0
    );
    if (coastPoint) {
      point.coastFIRE = coastPoint.savings;
    } else if (coastFIRETimeline.dataPoints.length > 0) {
      // If no exact match, use last available point or extrapolate
      const lastCoastPoint = coastFIRETimeline.dataPoints[coastFIRETimeline.dataPoints.length - 1];
      if (year > lastCoastPoint.year) {
        // Past FI - use FI number or last value
        point.coastFIRE = Math.max(lastCoastPoint.savings, fiNumber);
      }
    }

    // Add scenario data from ACTUAL timeline data points
    scenarioResults.forEach((scenario) => {
      if (scenario.timeline && scenario.timeline.dataPoints.length > 0) {
        // Find the data point for this year (month 0)
        const scenarioPoint = scenario.timeline.dataPoints.find(
          (dp) => dp.year === year && dp.month === 0
        );

        if (scenarioPoint) {
          point[scenario.scenarioId] = scenarioPoint.savings;
        } else {
          // Check if we're past the end of the timeline
          const lastPoint = scenario.timeline.dataPoints[scenario.timeline.dataPoints.length - 1];
          if (year > lastPoint.year) {
            // If scenario reached FI, use final value
            // If scenario depleted, show 0
            if (scenario.willDeplete && lastPoint.savings <= 0) {
              point[scenario.scenarioId] = 0;
            } else {
              point[scenario.scenarioId] = lastPoint.savings;
            }
          } else if (year === 0) {
            // Year 0 should always be current savings
            point[scenario.scenarioId] = currentSavings;
          }
        }
      } else {
        // Fallback: if no timeline data, use current savings at year 0
        if (year === 0) {
          point[scenario.scenarioId] = currentSavings;
        }
      }
    });

    dataPoints.push(point);
  }

  return dataPoints;
}

// Custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  // Get the data point to access age and year
  const dataPoint = payload[0]?.payload as ChartDataPoint | undefined;
  const hasAge = dataPoint?.age !== null && dataPoint?.age !== undefined;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
      <p className="font-semibold text-neutral-900 mb-2">
        {hasAge ? (
          <>{dataPoint.age} ára <span className="font-normal text-neutral-500">(ár {dataPoint.year})</span></>
        ) : (
          <>Ár {dataPoint?.year}</>
        )}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => {
          // Skip non-numeric values (like xLabel, age)
          if (typeof entry.value !== 'number' || entry.dataKey === 'year' || entry.dataKey === 'age') {
            return null;
          }

          if (entry.dataKey === 'fiTarget') {
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 border-2 border-dashed"
                  style={{ borderColor: entry.color }}
                />
                <span className="text-neutral-600">FI markmið:</span>
                <span className="font-semibold">{formatCurrency(entry.value)}</span>
              </div>
            );
          }

          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-neutral-600">{entry.name}:</span>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineChart({ results }: TimelineChartProps) {
  const chartData = prepareChartData(results);
  const { scenarioResults, fiNumber, currentAge } = results;
  const showAge = currentAge !== null;

  if (scenarioResults.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-neutral-900">
          Tímalína til FI
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Áætluð vöxtur sparnaðar fyrir hverja sviðsmynd
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={showAge ? 'age' : 'year'}
                label={{ value: showAge ? 'Aldur' : 'Ár', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
              />
              <YAxis
                stroke="#6b7280"
                tickFormatter={formatYAxisValue}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* FI Target Line */}
              <ReferenceLine
                y={fiNumber}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'FI markmið', position: 'right' }}
              />

              {/* Coast FIRE Line */}
              <Line
                type="monotone"
                dataKey="coastFIRE"
                name="Coast FIRE"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />

              {/* Scenario Lines */}
              {scenarioResults.map((scenario, index) => (
                <Line
                  key={scenario.scenarioId}
                  type="monotone"
                  dataKey={scenario.scenarioId}
                  name={scenario.scenarioName}
                  stroke={SCENARIO_COLORS[index % SCENARIO_COLORS.length]}
                  strokeWidth={3}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarioResults.map((scenario, index) => {
            const reachesFI = Number.isFinite(scenario.yearsToFI) && scenario.yearsToFI <= 50;

            // Determine status and styling
            let statusText: React.ReactNode;
            let statusColor = 'text-neutral-600';
            let borderColor = 'border-neutral-200';

            if (scenario.willDeplete) {
              // Scenario leads to depletion
              statusColor = 'text-danger-600';
              borderColor = 'border-danger-200';
              statusText = (
                <>
                  <span className="text-danger-600 font-medium">Tæmist eftir </span>
                  {scenario.yearsToDepletion !== null
                    ? `${Math.floor(scenario.yearsToDepletion)} ár, ${Math.round((scenario.yearsToDepletion % 1) * 12)} mán`
                    : 'óþekkt'}
                  {scenario.ageAtDepletion && (
                    <span className="block text-danger-500">
                      ({Math.round(scenario.ageAtDepletion)} ára aldur)
                    </span>
                  )}
                </>
              );
            } else if (reachesFI) {
              // Scenario reaches FI
              statusColor = 'text-success-600';
              borderColor = 'border-success-200';
              statusText = (
                <>
                  <span className="font-medium">{scenario.yearsToFI} ár</span>
                  {scenario.monthsToFI > 0 && `, ${scenario.monthsToFI} mán`}
                  <span className="block text-success-500">til full FI</span>
                </>
              );
            } else if (scenario.scenarioType === 'growing') {
              // Growing but takes very long
              statusColor = 'text-amber-600';
              borderColor = 'border-amber-200';
              statusText = (
                <>
                  <span className="text-amber-600">Vex hægt</span>
                  <span className="block text-amber-500">&gt;50 ár til FI</span>
                </>
              );
            } else {
              // No income entered yet
              statusText = <span className="text-amber-600">Sláðu inn tekjur</span>;
              borderColor = 'border-amber-200';
            }

            return (
              <div
                key={scenario.scenarioId}
                className={`flex items-start gap-3 rounded-lg border p-3 ${borderColor}`}
              >
                <div
                  className="mt-1 h-4 w-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm truncate">
                    {scenario.scenarioName}
                  </p>
                  <p className={`text-xs mt-1 ${statusColor}`}>
                    {statusText}
                  </p>
                  {/* Show monthly breakdown */}
                  <p className="text-xs text-neutral-500 mt-1">
                    Vextir: {formatCurrency(scenario.monthlyInterestAtStart)}/mán
                    {scenario.monthlySavings < 0 && (
                      <span className="text-danger-500">
                        {' '}− {formatCurrency(Math.abs(scenario.monthlySavings))} úttekt
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
