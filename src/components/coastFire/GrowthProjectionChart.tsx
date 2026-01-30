/**
 * GrowthProjectionChart Component
 *
 * Visualizes Coast FIRE investment growth trajectory from current age to retirement.
 * Shows compound growth projection, FI number target, Coast FIRE milestone, and coasting period.
 *
 * Features:
 * - Line chart showing investment balance growth over time (age-based)
 * - Horizontal reference line for FI number target
 * - Milestone markers for current age, Coast FIRE age, and retirement age
 * - Shaded area highlighting the "coasting period" (Coast age to retirement)
 * - Interactive tooltips with Icelandic formatting
 * - Responsive design with proper sizing
 * - Accessible with ARIA labels
 *
 * Epic 4: Visualization - Growth Projection Chart
 * Tasks 4.1, 4.2, 4.3, 4.4 (combined implementation)
 */

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  Legend,
} from 'recharts';
import type { CoastFIREResult } from '@/types/coastFire';
import { formatCurrency } from '@/lib/utils/formatters';
import { calculateFutureValue } from '@/lib/calculations/coastFire';

export interface GrowthProjectionChartProps {
  result: CoastFIREResult;
  currentAge: number;
  targetRetirementAge: number;
  currentInvestments: number;
  fiNumber: number;
  expectedReturn: number;
}

interface ChartDataPoint {
  age: number;
  balance: number;
  fiNumber: number; // Constant FI number for reference line
}

export function GrowthProjectionChart({
  result,
  currentAge,
  targetRetirementAge,
  currentInvestments,
  fiNumber,
  expectedReturn,
}: GrowthProjectionChartProps) {
  /**
   * Generate chart data points from current age to retirement age
   */
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const data: ChartDataPoint[] = [];
    const totalYears = targetRetirementAge - currentAge;

    // Generate data point for each year
    for (let yearOffset = 0; yearOffset <= totalYears; yearOffset++) {
      const age = currentAge + yearOffset;
      const balance = calculateFutureValue(currentInvestments, expectedReturn, yearOffset);

      data.push({
        age,
        balance,
        fiNumber, // Constant line for FI target
      });
    }

    return data;
  }, [currentAge, targetRetirementAge, currentInvestments, expectedReturn, fiNumber]);

  /**
   * Calculate min/max for Y-axis to ensure all data is visible with padding
   */
  const yAxisDomain = useMemo<[number, number]>(() => {
    const maxBalance = result.projectedBalance;
    const maxValue = Math.max(maxBalance, fiNumber);
    const minValue = Math.min(currentInvestments, fiNumber);

    // Add 10% padding above and below
    const padding = (maxValue - minValue) * 0.1;
    return [Math.max(0, minValue - padding), maxValue + padding];
  }, [result.projectedBalance, fiNumber, currentInvestments]);

  /**
   * Custom tooltip with Icelandic formatting
   */
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string; dataKey: string }>;
    label?: number;
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const age = label;
    const balanceEntry = payload.find((p) => p.dataKey === 'balance');
    const balance = balanceEntry?.value ?? 0;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-2">
          Aldur: {age} ára
        </p>
        <p className="text-sm text-green-600">
          Fjárfestingar: {formatCurrency(balance)}
        </p>
        <p className="text-sm text-blue-600">
          FI-markmið: {formatCurrency(fiNumber)}
        </p>
        {balance >= fiNumber && (
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            ✓ Yfir FI-markmiði
          </p>
        )}
      </div>
    );
  };

  /**
   * Format Y-axis values (ISK in millions)
   */
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}þ`;
    }
    return value.toFixed(0);
  };

  /**
   * Determine if we should show coasting period shading
   * Only show if status is 'coasting' or 'future'
   */
  const showCoastingPeriod =
    result.status !== 'impossible' &&
    result.coastFireAge !== null &&
    result.coastFireAge < targetRetirementAge;

  const coastingPeriodStart = result.coastFireAge ?? currentAge;
  const coastingPeriodEnd = targetRetirementAge;

  return (
    <div className="space-y-4">
      {/* Chart Title and Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Vöxtur fjárfestinga yfir tíma
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Hvernig núverandi fjárfestingar þínar munu vaxa til starfsloka með vaxtavexti
        </p>
      </div>

      {/* Chart Container */}
      <div
        className="h-80 w-full"
        style={{ minWidth: 300, minHeight: 320 }}
        role="img"
        aria-label={`Graf sem sýnir vöxt fjárfestinga frá ${currentAge} ára til ${targetRetirementAge} ára, með FI-markmið ${formatCurrency(fiNumber)}`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* X-Axis (Age) */}
            <XAxis
              dataKey="age"
              tick={{ fontSize: 12 }}
              label={{
                value: 'Aldur (ár)',
                position: 'insideBottom',
                offset: -10,
                style: { fontSize: 13, fontWeight: 500 },
              }}
              domain={[currentAge, targetRetirementAge]}
            />

            {/* Y-Axis (Balance ISK) */}
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              domain={yAxisDomain}
              label={{
                value: 'Fjárfestingar (ISK)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 13, fontWeight: 500 },
              }}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Legend */}
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
            />

            {/* Coasting Period Shading (amber area between Coast age and retirement) */}
            {showCoastingPeriod && (
              <ReferenceArea
                x1={coastingPeriodStart}
                x2={coastingPeriodEnd}
                fill="#fbbf24"
                fillOpacity={0.1}
                label={{
                  value: 'Ró tímabil',
                  position: 'insideTop',
                  fill: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
            )}

            {/* FI Number Target Line (horizontal blue dashed) */}
            <ReferenceLine
              y={fiNumber}
              stroke="#3b82f6"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: 'FI-markmið',
                position: 'right',
                fill: '#3b82f6',
                fontSize: 12,
                fontWeight: 500,
              }}
            />

            {/* Coast FIRE Age Milestone (amber vertical line) */}
            {result.status !== 'impossible' && result.coastFireAge !== null && (
              <ReferenceLine
                x={result.coastFireAge}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `Ró aldur: ${Math.round(result.coastFireAge)}`,
                  position: 'top',
                  fill: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}

            {/* Current Age Milestone Dot (green) */}
            <ReferenceDot
              x={currentAge}
              y={currentInvestments}
              r={6}
              fill="#22c55e"
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: 'Nú',
                position: 'top',
                fill: '#16a34a',
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            {/* Target Retirement Age Milestone Dot (purple) */}
            <ReferenceDot
              x={targetRetirementAge}
              y={result.projectedBalance}
              r={6}
              fill="#8b5cf6"
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: 'Starfslok',
                position: 'top',
                fill: '#7c3aed',
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            {/* Growth Projection Line (green solid) */}
            <Line
              type="monotone"
              dataKey="balance"
              name="Áætluð fjárfesting"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
        <div className="flex items-start gap-2">
          <div className="mt-1 h-0.5 w-4 bg-green-500"></div>
          <div>
            <span className="font-medium text-gray-700">Áætluð fjárfesting:</span> Hvernig núverandi
            fjárfestingar þínar munu vaxa með {expectedReturn}% árlegri ávöxtun
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="mt-1 h-0.5 w-4 border-t-2 border-dashed border-blue-500"></div>
          <div>
            <span className="font-medium text-gray-700">FI-markmið:</span> Þín fjárhagslega sjálfstæði
            tala ({formatCurrency(fiNumber)})
          </div>
        </div>
        {showCoastingPeriod && (
          <>
            <div className="flex items-start gap-2">
              <div className="mt-1 h-3 w-4 bg-amber-200 opacity-50"></div>
              <div>
                <span className="font-medium text-gray-700">Ró tímabil:</span> Tímabilið þegar þú getur
                "róað" án þess að spara meira
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 h-2 w-0.5 bg-amber-500"></div>
              <div>
                <span className="font-medium text-gray-700">Ró aldur:</span> Aldurinn þegar þú nærð
                Coast FIRE áfanga
              </div>
            </div>
          </>
        )}
      </div>

      {/* Status-based insight message */}
      {result.status === 'coasting' && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
          <p className="text-sm text-green-800">
            <span className="font-semibold">🎉 Þú ert þegar að róa!</span> Núverandi fjárfestingar
            þínar munu vaxa í FI-töluna þína fyrir starfslok án frekari innborgunar.
          </p>
        </div>
      )}

      {result.status === 'future' && result.yearsToCoast !== null && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🎯 Rólegt framundan:</span> Ef þú sparar enn í{' '}
            {result.yearsToCoast < 1
              ? `${Math.round(result.yearsToCoast * 12)} mánuði`
              : `${result.yearsToCoast.toFixed(1)} ár`}
            , munu fjárfestingar þínar síðan vaxa í FI-töluna fyrir starfslok.
          </p>
        </div>
      )}

      {result.status === 'impossible' && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">⚠️ Markmiðið erfitt:</span> Með núverandi forsendum er
            erfitt að ná Coast FIRE fyrir starfslok. Íhugaðu að lækka FI-töluna, fresta starfslokum,
            eða auka sparnað.
          </p>
        </div>
      )}
    </div>
  );
}
