/**
 * TimelineProjection - Growth chart showing path to FI
 *
 * Features:
 * - Line chart showing portfolio growth projection
 * - FI target line (horizontal reference)
 * - Milestone markers at 25%, 50%, 75%, 100%
 * - Use Recharts for visualization
 * - Premium gold/amber styling
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export function TimelineProjection() {
  const { fatFireResults } = useCalculator();

  if (!fatFireResults || !fatFireResults.timeline) return null;

  const { timeline, fiNumber, milestones } = fatFireResults;
  const { chartData } = timeline;

  if (chartData.length === 0) return null;

  // Prepare data for chart
  const data = chartData.map((point) => ({
    year: point.year,
    date: point.date.getFullYear(),
    portfolio: point.portfolioValue,
    fiTarget: fiNumber,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-amber-300 bg-white p-3 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">Ár {data.year}</p>
          <p className="text-sm text-amber-600">
            <strong>Eignasafn:</strong> {formatCurrency(data.portfolio)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>FI markmið:</strong> {formatCurrency(fiNumber)}
          </p>
          <p className="mt-2 text-xs text-gray-700">
            {((data.portfolio / fiNumber) * 100).toFixed(1)}% af markmiði
          </p>
        </div>
      );
    }
    return null;
  };

  // Format large numbers for Y-axis
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <Card variant="elevated" className="border-amber-200">
      <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-amber-900">
              Vaxtarspá til FI
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Áætluð þróun eignasafns þíns
            </p>
          </div>
          <span className="text-2xl">📈</span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#FCD34D" />
              <XAxis
                dataKey="year"
                label={{
                  value: 'Ár frá núna',
                  position: 'insideBottom',
                  offset: -5,
                }}
                tick={{ fill: '#78350F' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                label={{
                  value: 'Verðmæti (kr)',
                  angle: -90,
                  position: 'insideLeft',
                }}
                tick={{ fill: '#78350F' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
              />

              {/* FI Target Line */}
              <ReferenceLine
                y={fiNumber}
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: 'FI Markmið',
                  position: 'right',
                  fill: '#F59E0B',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />

              {/* Portfolio Growth Line */}
              <Line
                type="monotone"
                dataKey="portfolio"
                name="Eignasafn"
                stroke="#D97706"
                strokeWidth={3}
                dot={{ fill: '#D97706', r: 4 }}
                activeDot={{ r: 6 }}
              />

              {/* Milestone markers */}
              {milestones.map((milestone) => {
                const milestoneYear = milestone.yearsFromNow;
                if (
                  milestoneYear === null ||
                  milestoneYear === 0 ||
                  milestone.percentage === 100
                )
                  return null;

                return (
                  <ReferenceLine
                    key={milestone.percentage}
                    y={milestone.amount}
                    stroke="#FCD34D"
                    strokeDasharray="2 2"
                    label={{
                      value: `${milestone.percentage}%`,
                      position: 'left',
                      fill: '#92400E',
                      fontSize: 10,
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <p className="text-sm text-amber-800">Upphafssparnaður</p>
            <p className="mt-1 text-xl font-bold text-amber-900">
              {formatCurrency(data[0].portfolio)}
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 text-center">
            <p className="text-sm text-yellow-800">FI Markmið</p>
            <p className="mt-1 text-xl font-bold text-yellow-900">
              {formatCurrency(fiNumber)}
            </p>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <p className="text-sm text-orange-800">Lokasparnaður</p>
            <p className="mt-1 text-xl font-bold text-orange-900">
              {formatCurrency(data[data.length - 1].portfolio)}
            </p>
          </div>
        </div>

        {/* Assumptions */}
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-800">
            <strong>Forsendur:</strong> Spá byggir á{' '}
            {(fatFireResults.multiplier * 100).toFixed(1)}% árlegri ávöxtun með
            fötugum mánaðarlegum framlögum. Raunveruleg niðurstaða getur
            verið breytileg vegna markaðssveifla.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
