/**
 * CategoryBreakdownChart - Donut chart showing category distribution
 *
 * Features:
 * - Donut chart with category percentages
 * - Category legend with colors
 * - Interactive hover (show amount and %)
 * - Responsive sizing
 */

import React from 'react';
import type { CategoryBreakdown } from '@/types/currentExpenses';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';
import { CATEGORY_COLORS } from '@/lib/constants/currentExpenses';

export interface CategoryBreakdownChartProps {
  categoryBreakdown: CategoryBreakdown[];
}

// Chart colors - vibrant palette for better visibility
const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#64748b', // slate
];

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
      categoryIcon: string;
      total: number;
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
        {data.categoryIcon} {data.categoryName}
      </p>
      <p className="text-sm text-neutral-600">
        {formatCurrency(data.total)}
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
  // Filter out categories with 0 total
  const chartData = categoryBreakdown
    .filter(cat => cat.total > 0)
    .map(cat => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      categoryIcon: cat.categoryIcon,
      total: cat.total,
      percentage: cat.percentage,
      value: cat.total, // For the pie chart
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
            Engin útgjöld skráð
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare legend data with colors
  const legendData = chartData.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
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
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
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
                {item.categoryIcon} {item.categoryName}
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
