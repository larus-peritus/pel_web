'use client';

/**
 * Tier Difference Table Component
 *
 * Shows differences between tiers in ISK and work hours.
 * Displays three comparison rows: Bare→Comf, Comf→Deluxe, Bare→Deluxe.
 *
 * Task 5.5: Create TierDifferenceTable Component
 * Epic 5: Results Summary Display
 */

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { ExpenseBaselineResults } from '@/types/expenseBaseline';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

interface TierDifferenceTableProps {
  results: ExpenseBaselineResults;
}

interface DifferenceRow {
  label: string;
  fromTier: string;
  toTier: string;
  fromColor: string;
  toColor: string;
  iskDifference: number;
  hoursDifference: number | null;
}

export function TierDifferenceTable({ results }: TierDifferenceTableProps) {
  const differences: DifferenceRow[] = [
    {
      label: 'Lágmarks → Þægilegt',
      fromTier: 'Lágmarks',
      toTier: 'Þægilegt',
      fromColor: 'text-amber-700',
      toColor: 'text-green-700',
      iskDifference: results.tierDifferences.bareToComfortable.isk,
      hoursDifference: results.tierDifferences.bareToComfortable.hours,
    },
    {
      label: 'Þægilegt → Lúxus',
      fromTier: 'Þægilegt',
      toTier: 'Lúxus',
      fromColor: 'text-green-700',
      toColor: 'text-purple-700',
      iskDifference: results.tierDifferences.comfortableToDeluxe.isk,
      hoursDifference: results.tierDifferences.comfortableToDeluxe.hours,
    },
    {
      label: 'Lágmarks → Lúxus',
      fromTier: 'Lágmarks',
      toTier: 'Lúxus',
      fromColor: 'text-amber-700',
      toColor: 'text-purple-700',
      iskDifference: results.tierDifferences.bareToDeluxe.isk,
      hoursDifference: results.tierDifferences.bareToDeluxe.hours,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Munur milli stiga
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Aukakostnaður við að uppfæra lífsstíl
        </p>
      </CardHeader>

      <CardContent>
        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Uppfærsla
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Munur (kr/mán)
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Munur (klst/mán)
                </th>
              </tr>
            </thead>
            <tbody>
              {differences.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    index === differences.length - 1 ? 'font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className={row.fromColor}>{row.fromTier}</span>
                      <span className="text-gray-400">→</span>
                      <span className={row.toColor}>{row.toTier}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-gray-900">
                    {formatCurrency(row.iskDifference)}
                  </td>
                  <td className="text-right py-3 px-2 text-gray-700">
                    {row.hoursDifference !== null
                      ? `${formatNumber(row.hoursDifference, 1)} klst`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {results.lifeEnergy === null && (
            <p className="text-xs text-gray-500 mt-3">
              * Klukkustundir ekki tiltækar - reiknaðu raunverulegt tímakaup
            </p>
          )}
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-4">
          {differences.map((row, index) => (
            <div
              key={index}
              className={`p-4 bg-gray-50 rounded-lg ${
                index === differences.length - 1 ? 'border-2 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`font-medium ${row.fromColor}`}>
                  {row.fromTier}
                </span>
                <span className="text-gray-400">→</span>
                <span className={`font-medium ${row.toColor}`}>
                  {row.toTier}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ISK munur:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(row.iskDifference)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Klukkustundir:</span>
                  <span className="font-semibold text-gray-700">
                    {row.hoursDifference !== null
                      ? `${formatNumber(row.hoursDifference, 1)} klst/mán`
                      : 'Ekki tiltækt'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {results.lifeEnergy === null && (
            <p className="text-xs text-gray-500 text-center">
              Reiknaðu raunverulegt tímakaup til að sjá vinnustundir
            </p>
          )}
        </div>

        {/* Insight */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Stærsti munur er milli{' '}
            <span className="font-semibold text-gray-900">
              {differences.reduce((max, curr) =>
                curr.iskDifference > max.iskDifference ? curr : max
              ).label}
            </span>{' '}
            ({formatCurrency(
              differences.reduce((max, curr) =>
                curr.iskDifference > max.iskDifference ? curr : max
              ).iskDifference
            )}{' '}
            á mánuði)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
