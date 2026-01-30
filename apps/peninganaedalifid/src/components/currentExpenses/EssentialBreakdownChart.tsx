/**
 * EssentialBreakdownChart - Donut chart showing essential vs non-essential expenses
 *
 * Features:
 * - Simple two-segment donut chart
 * - Green for essential, amber for non-essential
 * - Interactive hover with amounts and percentages
 */

import React from 'react';
import type { EssentialBreakdown } from '@/types/currentExpenses';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

export interface EssentialBreakdownChartProps {
  essentialBreakdown: EssentialBreakdown;
}

// Chart colors
const ESSENTIAL_COLOR = '#10b981'; // green-500
const NON_ESSENTIAL_COLOR = '#f59e0b'; // amber-500

/**
 * Custom tooltip for the chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      label: string;
      amount: number;
      percentage: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
      <p className="font-medium text-neutral-900 mb-1">
        {data.label}
      </p>
      <p className="text-sm text-neutral-600">
        {formatCurrency(data.amount)}
      </p>
      <p className="text-sm font-semibold text-primary-600">
        {formatNumber(data.percentage, 1)}%
      </p>
    </div>
  );
}

/**
 * EssentialBreakdownChart - Donut chart for essential vs non-essential
 */
export function EssentialBreakdownChart({
  essentialBreakdown,
}: EssentialBreakdownChartProps) {
  const { essentialMonthly, nonEssentialMonthly, essentialPercentage, nonEssentialPercentage } = essentialBreakdown;

  const total = essentialMonthly + nonEssentialMonthly;

  if (total === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Nauðsyn vs Valkvæð
          </h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-neutral-500">
            Engin útgjöld skráð
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'essential',
      label: 'Nauðsynleg',
      amount: essentialMonthly,
      percentage: essentialPercentage,
      value: essentialMonthly,
    },
    {
      name: 'non-essential',
      label: 'Valkvæð',
      amount: nonEssentialMonthly,
      percentage: nonEssentialPercentage,
      value: nonEssentialMonthly,
    },
  ].filter(item => item.value > 0);

  const colors = chartData.map(item =>
    item.name === 'essential' ? ESSENTIAL_COLOR : NON_ESSENTIAL_COLOR
  );

  // Prepare legend data with colors
  const legendData = chartData.map((item, index) => ({
    ...item,
    color: colors[index],
  }));

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Nauðsyn vs Valkvæð
        </h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom legend outside chart */}
        <div className="flex flex-col gap-2 mt-2">
          {legendData.map((item, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral-700">
                {item.label}
              </span>
              <span className="text-neutral-500 ml-auto">
                {formatNumber(item.percentage, 1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
