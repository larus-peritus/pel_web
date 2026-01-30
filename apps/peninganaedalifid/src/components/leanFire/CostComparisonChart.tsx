/**
 * CostComparisonChart - Visual comparison between lifestyle tiers
 *
 * Features:
 * - Bar chart comparing barebones, comfortable, deluxe
 * - FI number comparison
 * - Years to FI comparison (if data available)
 * - Uses Recharts library
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function CostComparisonChart() {
  const { leanFireResults, expenseBaselineResults, leanFire } = useCalculator();

  if (!leanFireResults || !expenseBaselineResults) return null;

  const fiMultiplier = leanFire?.fiMultiplier || 30;

  // Prepare data for chart
  const barebonesMonthly = expenseBaselineResults.totals.barebones;
  const comfortableMonthly = expenseBaselineResults.totals.comfortable;
  const deluxeMonthly = expenseBaselineResults.totals.deluxe;

  const barebonesFI = barebonesMonthly * 12 * fiMultiplier;
  const comfortableFI = comfortableMonthly * 12 * fiMultiplier;
  const deluxeFI = deluxeMonthly * 12 * fiMultiplier;

  const chartData = [
    {
      name: 'Lágmark\n(Barebones)',
      'Mánaðarleg útgjöld': barebonesMonthly,
      'FI-tala': barebonesFI / 1000000, // Convert to millions for readability
      fill: '#10b981',
    },
    {
      name: 'Þægilegur\n(Comfortable)',
      'Mánaðarleg útgjöld': comfortableMonthly,
      'FI-tala': comfortableFI / 1000000,
      fill: '#3b82f6',
    },
    {
      name: 'Lúxus\n(Deluxe)',
      'Mánaðarleg útgjöld': deluxeMonthly,
      'FI-tala': deluxeFI / 1000000,
      fill: '#a855f7',
    },
  ];

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} kr`;
  };

  const formatMillions = (value: number) => {
    return `${value.toFixed(1)}M kr`;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Samanburður á lífsstílsflokkum
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Sjáðu muninn á útgjöldum og FI-tölu milli lífsstílsflokkanna
          </p>
        </div>

        {/* Monthly Expenses Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mánaðarleg útgjöld
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={0}
                textAnchor="middle"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={((value: number) => formatCurrency(value)) as never}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="Mánaðarleg útgjöld" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* FI Number Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            FI-tala ({fiMultiplier}x margfaldari)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={0}
                textAnchor="middle"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Milljónir kr', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={((value: number) => formatMillions(value)) as never}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="FI-tala" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Lífsstíll
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Mánaðarlega
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Árlega
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  FI-tala
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Munur frá lágmarki
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Lágmark (Barebones)
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {barebonesMonthly.toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {(barebonesMonthly * 12).toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-green-700">
                  {barebonesFI.toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">
                  -
                </td>
              </tr>

              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Þægilegur (Comfortable)
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {comfortableMonthly.toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {(comfortableMonthly * 12).toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-blue-700">
                  {comfortableFI.toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right text-orange-600">
                  +{(comfortableFI - barebonesFI).toLocaleString()} kr
                </td>
              </tr>

              <tr className="bg-purple-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Lúxus (Deluxe)
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {deluxeMonthly.toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {(deluxeMonthly * 12).toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-purple-700">
                  {deluxeFI.toLocaleString()} kr
                </td>
                <td className="px-4 py-3 text-sm text-right text-red-600">
                  +{(deluxeFI - barebonesFI).toLocaleString()} kr
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Innsýn:
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              • Þægilegur lífsstíll kostar{' '}
              <strong>
                {((comfortableFI / barebonesFI - 1) * 100).toFixed(0)}% meira
              </strong>{' '}
              en lágmark
            </li>
            <li>
              • Lúxus lífsstíll kostar{' '}
              <strong>
                {((deluxeFI / barebonesFI - 1) * 100).toFixed(0)}% meira
              </strong>{' '}
              en lágmark
            </li>
            <li>
              • Með því að velja LeanFIRE sparar þú{' '}
              <strong>{(comfortableFI - barebonesFI).toLocaleString()} kr</strong> á
              FI-tölu samanborið við þægilegan lífsstíl
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
