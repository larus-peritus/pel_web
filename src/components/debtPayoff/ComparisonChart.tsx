'use client';

/**
 * Comparison Chart Component
 * Shows debt payoff vs investment scenarios over time
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
  ReferenceLine,
} from 'recharts';
import type { DebtPayoffResults } from '@/types/debtPayoff';
import { formatCurrency } from '@/lib/utils/formatters';

interface ComparisonChartProps {
  results: DebtPayoffResults;
  actualHourlyWage: number;
}

interface ChartDataPoint {
  month: number;
  debtBalance: number;
  investmentBalance: number;
  debtLifeEnergy: number;
  investmentLifeEnergy: number;
}

export function ComparisonChart({ results, actualHourlyWage }: ComparisonChartProps) {
  // Prepare chart data
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const maxMonths = Math.max(
      results.debtScenario.amortizationSchedule.length,
      results.investmentScenario.monthlyProjections.length
    );

    const data: ChartDataPoint[] = [];

    for (let i = 0; i < maxMonths; i++) {
      const debtRow = results.debtScenario.amortizationSchedule[i];
      const investRow = results.investmentScenario.monthlyProjections[i];

      data.push({
        month: i + 1,
        debtBalance: debtRow?.closingBalance ?? 0,
        investmentBalance: investRow?.investmentBalance ??
          results.investmentScenario.finalInvestmentBalance,
        debtLifeEnergy: debtRow?.cumulativeInterest
          ? debtRow.cumulativeInterest / actualHourlyWage
          : 0,
        investmentLifeEnergy: investRow?.investmentGains
          ? investRow.investmentGains / actualHourlyWage
          : 0,
      });
    }

    return data;
  }, [results, actualHourlyWage]);

  // Find crossover point (where investment gains exceed interest paid)
  const crossoverMonth = useMemo(() => {
    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i].investmentLifeEnergy > chartData[i].debtLifeEnergy) {
        return chartData[i].month;
      }
    }
    return null;
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
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
            {entry.name}: {entry.name.includes('Lífsorka')
              ? `${entry.value.toFixed(1)} klst`
              : formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Financial Balance Chart */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-gray-700">
          Þróun skuldar vs fjárfestingar
        </h4>
        <div className="h-64" style={{ minWidth: 300, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                label={{ value: 'Mánuðir', position: 'bottom', offset: -5 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="debtBalance"
                name="Eftirstöðvar skuldar"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="investmentBalance"
                name="Fjárfesting"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Life Energy Chart */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-gray-700">
          Lífsorka: Sparnaður vs Ávöxtun
        </h4>
        <div className="h-64" style={{ minWidth: 300, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                label={{ value: 'Mánuðir', position: 'bottom', offset: -5 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(0)} klst`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {crossoverMonth && (
                <ReferenceLine
                  x={crossoverMonth}
                  stroke="#6366f1"
                  strokeDasharray="5 5"
                  label={{
                    value: `Fjárfesting betri (mán. ${crossoverMonth})`,
                    position: 'top',
                    fill: '#6366f1',
                    fontSize: 11,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="debtLifeEnergy"
                name="Lífsorka í vöxtum (tap)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="investmentLifeEnergy"
                name="Lífsorka frá ávöxtun (hagnaður)"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {crossoverMonth && (
          <p className="text-sm text-indigo-600 mt-2">
            Fjárfesting verður betri en aukagreiðsla á skuld eftir {crossoverMonth} mánuði
          </p>
        )}
        {!crossoverMonth && chartData.length > 0 && (
          <p className="text-sm text-red-600 mt-2">
            Aukagreiðsla á skuld er alltaf betri yfir lánstímann
          </p>
        )}
      </div>
    </div>
  );
}
