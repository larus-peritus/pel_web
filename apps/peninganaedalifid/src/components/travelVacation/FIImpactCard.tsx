/**
 * FI Impact card component
 * Shows how trip affects FI timeline
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import type { FIImpact } from '@/types/travelVacation';

export interface FIImpactCardProps {
  fiImpact: FIImpact;
}

/**
 * FIImpactCard - Shows impact on FI timeline
 */
export function FIImpactCard({ fiImpact }: FIImpactCardProps) {
  const workDays = Math.round(fiImpact.delayDays / 5);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Áhrif á fjárhagslegt frelsi
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main delay */}
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary-600">
              {fiImpact.delayMonths}
            </div>
            <div className="text-sm text-neutral-600 mt-2">
              {fiImpact.delayMonths === 1 ? 'mánuður' : 'mánuðir'} töf á FI
              dagsetningu
            </div>
          </div>

          {/* Work days */}
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm font-medium text-neutral-700">
              Í vinnudögum:
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              {workDays} vinnudagar
            </span>
          </div>

          {/* Positive insight */}
          <div className="pt-4 border-t border-neutral-200 bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <span className="font-semibold">Innsýn:</span> Ef þú sleppur
              þessari ferð, nærðu fjárhagslegu frelsi {fiImpact.formattedDelay}{' '}
              fyrr.
            </p>
          </div>

          {/* Context */}
          <div className="pt-2 text-sm text-neutral-600">
            <p>
              Athugið: {fiImpact.tripsPerMonthDelay.toFixed(1)} slíkar ferðir á
              ári tefja FI um 1 mánuð.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
