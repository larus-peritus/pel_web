/**
 * ExpenseBreakdownChart - Pie chart showing expense composition
 *
 * Features:
 * - Pie/donut chart with Recharts
 * - Base expenses, wish list items, splurge
 * - Color-coded categories (gold/amber theme)
 * - Percentage display
 * - Legend with amounts
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export function ExpenseBreakdownChart() {
  const { fatFireResults } = useCalculator();

  if (!fatFireResults) return null;

  const { expenseBreakdown } = fatFireResults;

  if (expenseBreakdown.length === 0) return null;

  // Prepare data for chart
  const chartData = expenseBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: item.color,
  }));

  // Custom label renderer for percentages inside pie
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0];
      return (
        <div className="rounded-lg border border-amber-300 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-amber-600">
            {formatCurrency(data.value)}/mán
          </p>
          <p className="text-xs text-gray-600">
            {data.payload.percentage.toFixed(1)}% af heildarútgjöldum
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="mt-4 space-y-2">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-900">
                {entry.value}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-amber-600">
                {formatCurrency(entry.payload.value)}
              </p>
              <p className="text-xs text-gray-600">
                {entry.payload.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card variant="elevated" className="border-amber-200">
      <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <h3 className="text-lg font-semibold text-amber-900">
          Útgjaldaskipting
        </h3>
        <p className="mt-1 text-sm text-amber-700">
          Hvernig mánaðarleg útgjöld þín skiptast
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
