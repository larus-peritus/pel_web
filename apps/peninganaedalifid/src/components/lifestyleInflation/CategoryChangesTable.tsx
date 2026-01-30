'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import type { CategoryChange } from '@/types/calculator';
import { formatCurrency } from '@/lib/utils/formatters';

interface CategoryChangesTableProps {
  changes: CategoryChange[];
  actualHourlyWage?: number;
}

/**
 * Table showing spending changes by category
 * Sorted by absolute impact (largest changes first)
 */
export function CategoryChangesTable({ changes, actualHourlyWage }: CategoryChangesTableProps) {
  // Sort by absolute change (largest first)
  const sortedChanges = [...changes].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  // Get color based on severity
  const getSeverityColor = (severity: CategoryChange['severity']) => {
    switch (severity) {
      case 'decrease':
        return 'text-green-600 bg-green-50';
      case 'stable':
        return 'text-gray-600 bg-gray-50';
      case 'minor':
        return 'text-blue-600 bg-blue-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'major':
        return 'text-red-600 bg-red-50';
    }
  };

  // Get severity label
  const getSeverityLabel = (severity: CategoryChange['severity']) => {
    switch (severity) {
      case 'decrease':
        return 'Lækkun';
      case 'stable':
        return 'Stöðugt';
      case 'minor':
        return 'Lítil hækkun';
      case 'moderate':
        return 'Miðlungs hækkun';
      case 'major':
        return 'Mikil hækkun';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Breytingar eftir flokkum
        </h3>

        {/* Desktop: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Flokkur
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                  Fyrra
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                  Núna
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                  Breyting (kr)
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                  Breyting (%)
                </th>
                {actualHourlyWage && actualHourlyWage > 0 && (
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                    Lífsorka (klst/ár)
                  </th>
                )}
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">
                  Alvarleiki
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedChanges.map((change) => (
                <tr key={change.category} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-900">
                    {change.label}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600">
                    {formatCurrency(change.oldAmount)}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900 font-medium">
                    {formatCurrency(change.newAmount)}
                  </td>
                  <td className={`py-3 px-2 text-right font-medium ${
                    change.change > 0 ? 'text-red-600' :
                    change.change < 0 ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {change.change >= 0 ? '+' : ''}{formatCurrency(change.change)}
                  </td>
                  <td className={`py-3 px-2 text-right font-medium ${
                    change.changePercent > 0 ? 'text-red-600' :
                    change.changePercent < 0 ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {change.changePercent >= 0 ? '+' : ''}{change.changePercent.toFixed(1)}%
                  </td>
                  {actualHourlyWage && actualHourlyWage > 0 && (
                    <td className="py-3 px-2 text-right text-gray-600">
                      {change.lifeEnergyHours.toFixed(1)}
                    </td>
                  )}
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(change.severity)}`}>
                      {getSeverityLabel(change.severity)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Cards */}
        <div className="md:hidden space-y-3">
          {sortedChanges.map((change) => (
            <div key={change.category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{change.label}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(change.severity)}`}>
                  {getSeverityLabel(change.severity)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Fyrra</p>
                  <p className="font-medium text-gray-900">{formatCurrency(change.oldAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Núna</p>
                  <p className="font-medium text-gray-900">{formatCurrency(change.newAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Breyting</p>
                  <p className={`font-medium ${
                    change.change > 0 ? 'text-red-600' :
                    change.change < 0 ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {change.change >= 0 ? '+' : ''}{formatCurrency(change.change)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Prósenta</p>
                  <p className={`font-medium ${
                    change.changePercent > 0 ? 'text-red-600' :
                    change.changePercent < 0 ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {change.changePercent >= 0 ? '+' : ''}{change.changePercent.toFixed(1)}%
                  </p>
                </div>
                {actualHourlyWage && actualHourlyWage > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Lífsorka á ári</p>
                    <p className="font-medium text-gray-900">{change.lifeEnergyHours.toFixed(1)} klst</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
