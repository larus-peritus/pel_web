'use client';

/**
 * Snowball Chart Component
 * Visualizes debt balance comparison and cumulative interest savings across scenarios
 *
 * Task 5.1: Debt Balance Comparison Chart
 * Task 5.2: Cumulative Interest Savings Chart
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SnowballResults } from '@/types/snowball';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

interface SnowballChartProps {
  results: SnowballResults;
}

interface DebtChartDataPoint {
  month: number;
  baseBalance: number;
  snowballLoanBalance: number;
  snowballInvestDebt: number;
  snowballInvestmentBalance: number;
}

interface SavingsChartDataPoint {
  month: number;
  cumulativeSavings: number;
}

export function SnowballChart({ results }: SnowballChartProps) {
  // Prepare debt balance comparison chart data
  const debtChartData = useMemo<DebtChartDataPoint[]>(() => {
    return results.monthlySchedule.map((row) => ({
      month: row.month,
      baseBalance: row.baseClosingBalance,
      snowballLoanBalance: row.snowballLoanClosingBalance,
      snowballInvestDebt: row.snowballInvestClosingBalance,
      snowballInvestmentBalance: row.snowballInvestmentBalance,
    }));
  }, [results.monthlySchedule]);

  // Prepare cumulative interest savings chart data
  const savingsChartData = useMemo<SavingsChartDataPoint[]>(() => {
    return results.monthlySchedule.map((row) => ({
      month: row.month,
      cumulativeSavings: row.cumulativeInterestSavings,
    }));
  }, [results.monthlySchedule]);

  // Custom tooltip for debt balance chart
  const DebtTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
    label?: number;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-2">Mánuður {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  // Custom tooltip for savings chart
  const SavingsTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
    label?: number;
  }) => {
    if (!active || !payload || !payload[0]) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-2">Mánuður {label}</p>
        <p style={{ color: payload[0].color }} className="text-sm">
          Uppsafnaður sparnaður: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Debt Balance Comparison Chart (Task 5.1) */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-gray-700">
          Samanburður á skuldum og fjárfestingum
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Hvernig skuldirnar lækka og fjárfestingar vaxa í hverri atburðarás
        </p>
        <div className="h-80" style={{ minWidth: 300, minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={280}>
            <LineChart data={debtChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                label={{ value: 'Mánuðir', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                label={{ value: 'ISK (milljónir)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<DebtTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Base scenario - gray */}
              <Line
                type="monotone"
                dataKey="baseBalance"
                name="Grunnur (aukagreiðsla eingöngu)"
                stroke="#6b7280"
                strokeWidth={2}
                dot={false}
              />

              {/* Snowball to loan - blue */}
              <Line
                type="monotone"
                dataKey="snowballLoanBalance"
                name="Snjóbolti → Lán"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />

              {/* Snowball to investment (debt) - red */}
              <Line
                type="monotone"
                dataKey="snowballInvestDebt"
                name="Snjóbolti → Fjárfesting (skuld)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />

              {/* Investment balance - green */}
              <Line
                type="monotone"
                dataKey="snowballInvestmentBalance"
                name="Fjárfesting staða"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Interest Savings Chart (Task 5.2) */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-gray-700">
          Uppsafnaður vaxtasparnaður yfir tíma
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Hvernig snjóboltaáhrifin safnast upp með aukagreiðslum
        </p>
        <div className="h-64" style={{ minWidth: 300, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
            <LineChart data={savingsChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                label={{ value: 'Mánuðir', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                label={{ value: 'ISK (milljónir)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<SavingsTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Cumulative savings - purple/indigo */}
              <Line
                type="monotone"
                dataKey="cumulativeSavings"
                name="Uppsafnaður vaxtasparnaður"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insight text */}
        {savingsChartData.length > 0 && (
          <p className="text-sm text-purple-600 mt-3">
            Uppsafnaður sparnaður að lokum: {formatCurrency(savingsChartData[savingsChartData.length - 1].cumulativeSavings)}
          </p>
        )}
      </div>
    </div>
  );
}
