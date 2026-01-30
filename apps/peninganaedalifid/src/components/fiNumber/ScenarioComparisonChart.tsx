'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { TIER_LABELS, TIER_COLORS } from '@/lib/constants/expenseBaseline';
import type { ScenarioComparisonResult } from '@/types/fiNumber';
import type { ExpenseTier } from '@/types/expenseBaseline';

/**
 * Props for ScenarioComparisonChart component
 */
export interface ScenarioComparisonChartProps {
  scenarios: ScenarioComparisonResult;
  selectedTier: ExpenseTier;
  multiplier: number;
}

/**
 * Chart data point interface
 */
interface ChartDataPoint {
  tier: ExpenseTier;
  tierLabel: string;
  fiNumber: number;
  annualExpenses: number;
  color: string;
  isSelected: boolean;
}

/**
 * ScenarioComparisonChart Component
 *
 * Visual horizontal bar chart comparing FI numbers across all three expense tiers.
 *
 * Features:
 * - Horizontal bar chart (easier to read long ISK numbers)
 * - Three bars color-coded by tier (amber/green/purple)
 * - Interactive tooltips showing details
 * - Selected tier highlighted with border
 * - Responsive sizing
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * <ScenarioComparisonChart
 *   scenarios={scenarios}
 *   selectedTier="comfortable"
 *   multiplier={30}
 * />
 * ```
 */
export function ScenarioComparisonChart({
  scenarios,
  selectedTier,
  multiplier,
}: ScenarioComparisonChartProps) {
  // Prepare chart data
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

    return tiers.map((tier) => {
      const scenario = scenarios[tier];
      const tierColor = TIER_COLORS[tier];
      const tierLabel = TIER_LABELS[tier];

      // Extract hex color from Tailwind class (simplified)
      const colorMap: Record<string, string> = {
        'bg-amber-500': '#f59e0b',
        'bg-green-500': '#10b981',
        'bg-purple-500': '#8b5cf6',
      };

      return {
        tier,
        tierLabel,
        fiNumber: scenario.fiNumber,
        annualExpenses: scenario.annualExpenses,
        color: colorMap[tierColor.accent] || '#6b7280',
        isSelected: tier === selectedTier,
      };
    });
  }, [scenarios, selectedTier]);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: ChartDataPoint }>;
  }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-white border-2 border-neutral-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-bold text-neutral-900">{data.tierLabel}</p>
          {data.isSelected && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
              Valið
            </span>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-600">Árleg útgjöld:</span>
            <span className="font-semibold text-neutral-800">
              {formatCurrency(data.annualExpenses)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-600">Margfaldari:</span>
            <span className="font-semibold text-neutral-800">
              {formatNumber(multiplier, 0)}x
            </span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t border-neutral-200">
            <span className="text-neutral-700 font-medium">FI-tala:</span>
            <span className="font-bold text-primary-700">
              {formatCurrency(data.fiNumber)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Format Y-axis labels (tier names)
  const formatYAxisLabel = (value: string) => {
    return value;
  };

  // Format X-axis labels (FI numbers in millions)
  const formatXAxisLabel = (value: number) => {
    // Convert to millions and format
    const millions = value / 1_000_000;
    if (millions >= 100) {
      return `${Math.round(millions)}M kr`;
    } else if (millions >= 10) {
      return `${Math.round(millions * 10) / 10}M kr`;
    } else {
      return `${Math.round(millions * 100) / 100}M kr`;
    }
  };

  // Custom bar label (show FI number on bar)
  const renderBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    // Position label inside bar if bar is wide enough, otherwise outside
    const labelX = width > 150 ? x + width - 8 : x + width + 8;
    const anchor = width > 150 ? 'end' : 'start';

    return (
      <text
        x={labelX}
        y={y + height / 2}
        fill={width > 150 ? '#ffffff' : '#374151'}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={14}
        fontWeight="600"
      >
        {formatCurrency(value)}
      </text>
    );
  };

  return (
    <Card variant="elevated">
      <CardHeader className="bg-neutral-50">
        <h3 className="text-lg md:text-xl font-bold text-neutral-800">
          Myndræn samanburður
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          FI-tölur á milli útgjaldaþrepa
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 150, bottom: 10, left: 10 }}
          >
            <XAxis
              type="number"
              tickFormatter={formatXAxisLabel}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type="category"
              dataKey="tierLabel"
              tickFormatter={formatYAxisLabel}
              stroke="#9ca3af"
              style={{ fontSize: '14px', fontWeight: '500' }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar
              dataKey="fiNumber"
              radius={[0, 8, 8, 0]}
              isAnimationActive={true}
              animationDuration={500}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.isSelected ? entry.color : 'none'}
                  strokeWidth={entry.isSelected ? 3 : 0}
                  opacity={entry.isSelected ? 1 : 0.85}
                />
              ))}
              <LabelList dataKey="fiNumber" content={renderBarLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          {chartData.map((item) => (
            <div key={item.tier} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral-700 font-medium">
                {item.tierLabel}
                {item.isSelected && (
                  <span className="ml-1 text-xs text-neutral-700">(valið)</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 text-center">
            Grafið sýnir hversu miklu meiri eða minni FI-tala þarf fyrir mismunandi lífsstíl.
            Hærra útgjaldaþrep krefst hærri FI-tölu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
