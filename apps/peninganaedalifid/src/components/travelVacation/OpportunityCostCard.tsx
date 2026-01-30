/**
 * Opportunity cost card component
 * Displays future value if money was invested instead
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import type { OpportunityCost } from '@/types/travelVacation';

export interface OpportunityCostCardProps {
  opportunityCost: OpportunityCost;
}

/**
 * OpportunityCostCard - Shows opportunity cost (future value)
 */
export function OpportunityCostCard({
  opportunityCost,
}: OpportunityCostCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Tækifæriskostnaður
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Help text */}
          <p className="text-sm text-neutral-600">
            Ef þú fjárfestir ferðakostnaðinn í staðinn:
          </p>

          {/* Future values */}
          <div className="space-y-3">
            {opportunityCost.futureValues.map((fv) => (
              <div
                key={fv.years}
                className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
              >
                <span className="text-sm font-medium text-neutral-700">
                  Eftir {fv.years} ár:
                </span>
                <span className="text-lg font-bold text-neutral-900">
                  {fv.formattedValue}
                </span>
              </div>
            ))}
          </div>

          {/* Cost per day */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">
                Tækifæriskostnaður á ferðadag (20 ár):
              </span>
              <span className="text-lg font-semibold text-neutral-900">
                {formatCurrency(opportunityCost.opportunityCostPerDay)}
              </span>
            </div>
          </div>

          {/* Insight */}
          <div className="pt-2 border-t border-neutral-200 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Innsýn:</span> Þetta er munurinn
              á því að eyða peningunum núna á móti því að fjárfesta þá fyrir
              fjárhagslegt frelsi.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
