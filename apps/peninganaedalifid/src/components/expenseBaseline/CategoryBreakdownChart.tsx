'use client';

/**
 * Category Breakdown Chart Component
 *
 * Pie/donut chart showing category distribution with tier toggle.
 * Uses recharts library for visualization.
 *
 * Task 5.3: Create CategoryBreakdownChart Component
 * Epic 5: Results Summary Display
 */

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { ExpenseBaseline, ExpenseBaselineResults, ExpenseTier } from '@/types/expenseBaseline';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';

interface CategoryBreakdownChartProps {
  baseline: ExpenseBaseline;
  results: ExpenseBaselineResults;
}

interface ChartDataPoint {
  name: string;
  value: number;
  percentage: number;
  icon: string;
}

// Vibrant colors for each category (10 distinct colors)
const COLORS = [
  '#3b82f6', // blue (húsnæði)
  '#10b981', // green (matur)
  '#f59e0b', // amber (samgöngur)
  '#ef4444', // red (heilsa)
  '#8b5cf6', // purple (tryggingar)
  '#06b6d4', // cyan (veitur)
  '#ec4899', // pink (persónuleg)
  '#f97316', // orange (afþreying)
  '#14b8a6', // teal (sparnaður)
  '#6b7280', // gray (annað)
];

export function CategoryBreakdownChart({ baseline, results }: CategoryBreakdownChartProps) {
  const [selectedTier, setSelectedTier] = useState<ExpenseTier>('comfortable');

  // Prepare chart data for selected tier
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const activeCategories = baseline.categories.filter((c) => !c.isHidden);

    return activeCategories
      .map((category) => ({
        name: category.name,
        value: category.values[selectedTier],
        percentage: results.percentageBreakdown[category.id]?.[selectedTier] || 0,
        icon: category.icon,
      }))
      .filter((item) => item.value > 0) // Filter out zero-value categories
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [baseline.categories, selectedTier, results.percentageBreakdown]);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: ChartDataPoint }>;
  }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-1">
          {data.icon} {data.name}
        </p>
        <p className="text-sm text-gray-700">
          {formatCurrency(data.value)}
        </p>
        <p className="text-xs text-gray-600">
          {formatPercentage(data.percentage, 1)} af heild
        </p>
      </div>
    );
  };

  // Custom legend
  const renderLegend = (props: any) => {
    if (!props.payload) return null;

    return (
      <div className="grid grid-cols-2 gap-2 text-xs mt-4">
        {props.payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700 truncate" title={entry.value}>
              {entry.value} ({formatPercentage(entry.payload?.percentage || 0, 0)})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Útgjöld eftir flokkum
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Hlutfallsleg skipting útgjalda
        </p>
      </CardHeader>

      <CardContent>
        {/* Tier selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTier('barebones')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              selectedTier === 'barebones'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Lágmarks
          </button>
          <button
            onClick={() => setSelectedTier('comfortable')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              selectedTier === 'comfortable'
                ? 'bg-green-500 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Þægilegt
          </button>
          <button
            onClick={() => setSelectedTier('deluxe')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              selectedTier === 'deluxe'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Lúxus
          </button>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={(props: any) => `${props.payload?.percentage?.toFixed(0) || 0}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Engin gögn til að birta fyrir þetta stig
          </div>
        )}

        {/* Total for selected tier */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Heildarútgjöld ({selectedTier === 'barebones' ? 'Lágmarks' : selectedTier === 'comfortable' ? 'Þægilegt' : 'Lúxus'})
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(results.totals[selectedTier])}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
