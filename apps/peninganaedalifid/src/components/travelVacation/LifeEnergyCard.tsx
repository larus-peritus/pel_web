/**
 * Life energy card component
 * Displays life energy cost in hours/days/weeks
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import type { LifeEnergyCost } from '@/types/travelVacation';

export interface LifeEnergyCardProps {
  lifeEnergyCost: LifeEnergyCost;
}

/**
 * LifeEnergyCard - Shows life energy cost of trip
 */
export function LifeEnergyCard({ lifeEnergyCost }: LifeEnergyCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Lífsorku kostnaður
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main hours */}
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary-600">
              {lifeEnergyCost.totalHours.toFixed(1)}
            </div>
            <div className="text-sm text-neutral-600 mt-2">
              klukkustundir vinnu
            </div>
          </div>

          {/* Formatted string */}
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <div className="text-sm text-neutral-600 mb-1">
              Það samsvarar:
            </div>
            <div className="text-lg font-semibold text-primary-900">
              {lifeEnergyCost.formattedString}
            </div>
          </div>

          {/* Cost per trip day */}
          <div className="flex justify-between items-center py-3 border-t border-neutral-200">
            <span className="text-sm font-medium text-neutral-700">
              Kostnaður á ferðadag:
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              {lifeEnergyCost.hoursPerTripDay.toFixed(1)} klst/dag
            </span>
          </div>

          {/* Help text */}
          <div className="pt-2 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              Til að vinna sér inn kostnað þessarar ferðar þarft þú að vinna í{' '}
              <span className="font-semibold text-neutral-900">
                {lifeEnergyCost.formattedString}
              </span>
              .
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
