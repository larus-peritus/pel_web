'use client';

/**
 * Amortization Schedule Component
 * Displays a detailed monthly breakdown of loan payments
 */

import { useState } from 'react';
import type { AmortizationRow } from '@/types/debtPayoff';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AmortizationScheduleProps {
  schedule: AmortizationRow[];
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  totalLifeEnergyHours: number;
}

export function AmortizationSchedule({
  schedule,
  totalPayment,
  totalInterest,
  totalPrincipal,
  totalLifeEnergyHours,
}: AmortizationScheduleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Show first 12 months or all
  const displayedSchedule = showAll ? schedule : schedule.slice(0, 12);

  if (schedule.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Greiðsluáætlun</h3>
            <p className="text-sm text-gray-600">
              Sundurliðun mánaðarlegra greiðslna ({schedule.length} mánuðir)
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Fela' : 'Sýna'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {/* Summary Row */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Heildargreiðslur</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totalPayment)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Vextir samtals</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totalInterest)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Höfuðstóll</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totalPrincipal)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Lífsorka samtals</div>
                <div className="text-lg font-bold text-blue-900">{formatNumber(totalLifeEnergyHours, 1)} klst</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 px-2 font-medium text-gray-700">Mán.</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Opnunarstaða</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Greiðsla</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Vextir</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Höfuðstóll</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Lokastaða</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Lífsorka</th>
                </tr>
              </thead>
              <tbody>
                {displayedSchedule.map((row) => (
                  <tr
                    key={row.month}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2 text-gray-900 font-medium">{row.month}</td>
                    <td className="py-2 px-2 text-right text-gray-600">
                      {formatCurrency(row.openingBalance)}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-900 font-medium">
                      {formatCurrency(row.payment)}
                    </td>
                    <td className="py-2 px-2 text-right text-red-600">
                      {formatCurrency(row.interestPayment)}
                    </td>
                    <td className="py-2 px-2 text-right text-green-600">
                      {formatCurrency(row.principalPayment)}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-600">
                      {formatCurrency(row.closingBalance)}
                    </td>
                    <td className="py-2 px-2 text-right text-blue-600">
                      {formatNumber(row.lifeEnergyHours, 1)} klst
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show more/less toggle */}
          {schedule.length > 12 && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? 'Sýna fyrstu 12 mánuði'
                  : `Sýna alla ${schedule.length} mánuði`}
              </Button>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-100 rounded"></span>
                <span>Vextir (greiðslur til banka)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 rounded"></span>
                <span>Höfuðstóll (lækkar skuldina)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-100 rounded"></span>
                <span>Lífsorka (vinnutímar fyrir greiðslu)</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
