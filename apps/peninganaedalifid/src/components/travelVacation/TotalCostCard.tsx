/**
 * Total cost card component
 * Displays total trip cost with breakdown
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import type { TotalCostBreakdown } from '@/types/travelVacation';

export interface TotalCostCardProps {
  totalCost: TotalCostBreakdown;
}

/**
 * TotalCostCard - Shows total cost with breakdown
 */
export function TotalCostCard({ totalCost }: TotalCostCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const breakdownItems = [
    { label: 'Flug / Samgöngur', value: totalCost.breakdown.transportation },
    { label: 'Gisting', value: totalCost.breakdown.accommodation },
    { label: 'Matur', value: totalCost.breakdown.food },
    { label: 'Afþreying', value: totalCost.breakdown.activities },
    {
      label: 'Staðbundnar samgöngur',
      value: totalCost.breakdown.localTransport,
    },
    { label: 'Annað', value: totalCost.breakdown.other },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Heildarkostnaður ferðar
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main total */}
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary-600">
              {formatCurrency(totalCost.total)}
            </div>
            <div className="text-sm text-neutral-600 mt-2">
              Heildarkostnaður
            </div>
          </div>

          {/* Cost per day */}
          <div className="flex justify-between items-center py-3 border-t border-neutral-200">
            <span className="text-sm font-medium text-neutral-700">
              Kostnaður á dag:
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              {formatCurrency(totalCost.costPerDay)}
            </span>
          </div>

          {/* Breakdown toggle */}
          {breakdownItems.length > 0 && (
            <>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2 py-2"
              >
                {showBreakdown ? 'Fela sundurliðun' : 'Sýna sundurliðun'}
                <svg
                  className={`w-4 h-4 transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Breakdown list */}
              {showBreakdown && (
                <div className="space-y-2 pt-2">
                  {breakdownItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-neutral-600">{item.label}:</span>
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
