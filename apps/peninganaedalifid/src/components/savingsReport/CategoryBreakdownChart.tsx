/**
 * CategoryBreakdownChart - Pie/donut chart showing balance distribution
 *
 * Features:
 * - Donut chart with category percentages
 * - Category colors from constants
 * - Legend with category names and percentages
 * - Interactive hover (show amount and %)
 * - Responsive sizing
 * - Handles zero values gracefully
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { SAVINGS_CHART_COLORS } from '@/lib/constants/savingsReport';
import type { CategoryBreakdown } from '@/types/savingsReport';

export interface CategoryBreakdownChartProps {
  categoryBreakdown: CategoryBreakdown[];
}

/**
 * Custom tooltip for the chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      categoryName: string;
      icon: string;
      balance: number;
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
        {data.icon} {data.categoryName}
      </p>
      <p className="text-sm text-neutral-600">
        {formatCurrency(data.balance)}
      </p>
      <p className="text-sm font-semibold text-primary-600">
        {formatNumber(data.percentage, 1)}%
      </p>
    </div>
  );
}

/**
 * CategoryBreakdownChart - Donut chart visualization
 */
export function CategoryBreakdownChart({
  categoryBreakdown,
}: CategoryBreakdownChartProps) {
  // Filter out categories with 0 balance
  const chartData = categoryBreakdown
    .filter(cat => cat.balance > 0)
    .map(cat => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      icon: cat.icon,
      balance: cat.balance,
      percentage: cat.percentageOfTotal,
      value: cat.balance, // For the pie chart
    }));

  if (chartData.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Skipting eftir flokkum
          </h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-neutral-500">
            Enginn sparnaður skráður
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare legend data with colors
  const legendData = chartData.map((item, index) => ({
    ...item,
    color: SAVINGS_CHART_COLORS[index % SAVINGS_CHART_COLORS.length],
  }));

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Skipting eftir flokkum
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
                  fill={SAVINGS_CHART_COLORS[index % SAVINGS_CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom legend outside chart with max height */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 max-h-32 overflow-y-auto">
          {legendData.map((item, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral-700 truncate flex-1">
                {item.icon} {item.categoryName}
              </span>
              <span className="text-neutral-500 flex-shrink-0">
                {formatNumber(item.percentage, 1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
