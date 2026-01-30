'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { SimulationResults } from '@/types/retirementSimulator';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface TrajectoryChartProps {
  results: SimulationResults;
  retirementAge: number;
  lifeExpectancy: number;
  lifeyrissjodurEnabled: boolean;
  lifeyrissjodurAge: number;
  sereignEnabled: boolean;
  sereignAge: number;
  ellilifeyririEnabled: boolean;
  ellilifeyririAge: number;
}

/**
 * Trajectory Chart Component
 *
 * Visualizes portfolio trajectories with confidence bands:
 * - 5th-95th percentile confidence band (light fill)
 * - 25th-75th percentile confidence band (darker fill)
 * - Median trajectory (prominent line)
 * - Retirement age marker
 * - Pension start age markers
 *
 * Uses Recharts for visualization.
 */
export function TrajectoryChart({
  results,
  retirementAge,
  lifeExpectancy,
  lifeyrissjodurEnabled,
  lifeyrissjodurAge,
  sereignEnabled,
  sereignAge,
  ellilifeyririEnabled,
  ellilifeyririAge,
}: TrajectoryChartProps) {
  // Prepare chart data
  const chartData = results.trajectories.median.ages.map((age, index) => ({
    age,
    median: results.trajectories.median.portfolioBalances[index],
    p25: results.trajectories.percentile25.portfolioBalances[index],
    p75: results.trajectories.percentile75.portfolioBalances[index],
    p5: results.trajectories.percentile5.portfolioBalances[index],
    p95: results.trajectories.percentile95.portfolioBalances[index],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const data = payload[0].payload;

    return (
      <div className="bg-white border-2 border-neutral-200 rounded-lg shadow-lg p-3">
        <div className="font-semibold text-neutral-900 mb-2">
          Aldur: {data.age} ára
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-600">95. hundraðshluti:</span>
            <span className="font-semibold">{formatCurrency(data.p95)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-600">75. hundraðshluti:</span>
            <span className="font-semibold">{formatCurrency(data.p75)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-blue-600 font-semibold">Miðgildi:</span>
            <span className="font-bold text-blue-600">{formatCurrency(data.median)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-600">25. hundraðshluti:</span>
            <span className="font-semibold">{formatCurrency(data.p25)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-600">5. hundraðshluti:</span>
            <span className="font-semibold">{formatCurrency(data.p5)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Spá um eignasafn
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Miðgildi og traust bil yfir tíma
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {/* Gradient for 5-95 percentile band */}
                <linearGradient id="colorRange95" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                {/* Gradient for 25-75 percentile band */}
                <linearGradient id="colorRange75" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.15} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="age"
                label={{ value: 'Aldur', position: 'insideBottom', offset: -5 }}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                tick={{ fontSize: 12 }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* 5-95 percentile band */}
              <Area
                type="monotone"
                dataKey="p95"
                stroke="none"
                fill="url(#colorRange95)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="p5"
                stroke="none"
                fill="url(#colorRange95)"
                stackId="2"
              />

              {/* 25-75 percentile band */}
              <Area
                type="monotone"
                dataKey="p75"
                stroke="none"
                fill="url(#colorRange75)"
                stackId="3"
              />
              <Area
                type="monotone"
                dataKey="p25"
                stroke="none"
                fill="url(#colorRange75)"
                stackId="4"
              />

              {/* Median line */}
              <Line
                type="monotone"
                dataKey="median"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />

              {/* Retirement age marker */}
              <ReferenceLine
                x={retirementAge}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: 'Eftirlaun',
                  position: 'top',
                  fill: '#f59e0b',
                  fontSize: 12,
                }}
              />

              {/* Lífeyrissjóður marker */}
              {lifeyrissjodurEnabled && (
                <ReferenceLine
                  x={lifeyrissjodurAge}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{
                    value: 'Lífeyrissjóður',
                    position: 'top',
                    fill: '#10b981',
                    fontSize: 11,
                  }}
                />
              )}

              {/* Séreignarlífeyrir marker */}
              {sereignEnabled && (
                <ReferenceLine
                  x={sereignAge}
                  stroke="#22c55e"
                  strokeDasharray="5 2"
                  strokeWidth={2}
                  label={{
                    value: 'Séreignarlífeyrir',
                    position: 'insideTopLeft',
                    fill: '#22c55e',
                    fontSize: 11,
                  }}
                />
              )}

              {/* Ellilífeyrir marker */}
              {ellilifeyririEnabled && (
                <ReferenceLine
                  x={ellilifeyririAge}
                  stroke="#6366f1"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{
                    value: 'Ellilífeyrir',
                    position: 'top',
                    fill: '#6366f1',
                    fontSize: 11,
                  }}
                />
              )}

              {/* Zero line */}
              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-neutral-700">
              <strong>Blá lína:</strong> Miðgildi (50. hundraðshluti)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 opacity-30 rounded"></div>
            <span className="text-neutral-700">
              <strong>Dökkara svæði:</strong> 25-75 hundraðshluti (50% atburðarása)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 opacity-15 rounded"></div>
            <span className="text-neutral-700">
              <strong>Ljósara svæði:</strong> 5-95 hundraðshluti (90% atburðarása)
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm">
          <p className="text-neutral-700">
            <strong>Túlkun:</strong> Mestan hluta tímans (90% atburðarása) er eignasafnið
            innan ljósbláa svæðisins. Miðgildi sýnir "dæmigerða" niðurstöðu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
