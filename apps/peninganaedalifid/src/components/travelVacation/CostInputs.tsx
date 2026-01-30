/**
 * Cost inputs component for Travel/Vacation Calculator
 * Provides input fields for all 6 cost categories
 */

import React from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { formatCurrency } from '@/lib/utils/formatters';
import type { TripCosts } from '@/types/travelVacation';

export interface CostInputsProps {
  costs: TripCosts;
  days: number;
  onCostsChange: (costs: TripCosts) => void;
}

/**
 * CostInputs - Input fields for all trip cost categories
 */
export function CostInputs({ costs, days, onCostsChange }: CostInputsProps) {
  const handleCostChange = (category: keyof TripCosts, value: number) => {
    onCostsChange({
      ...costs,
      [category]: value,
    });
  };

  const foodTotal = costs.foodPerDay * days;
  const total =
    costs.transportation +
    costs.accommodation +
    foodTotal +
    costs.activities +
    costs.localTransport +
    costs.other;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">
          Kostnaðarliðir
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          Sláðu inn áætlaðan kostnað fyrir hvern flokk
        </p>
      </div>

      <CurrencyInput
        label="Flug / Samgöngur"
        value={costs.transportation}
        onChange={(value) => handleCostChange('transportation', value)}
        helpText="Flugmiðar eða aðrar fargjöld til áfangastaðar"
      />

      <CurrencyInput
        label="Gisting"
        value={costs.accommodation}
        onChange={(value) => handleCostChange('accommodation', value)}
        helpText={`${days} nætur - heildarkostnaður`}
      />

      <CurrencyInput
        label="Matur á dag"
        value={costs.foodPerDay}
        onChange={(value) => handleCostChange('foodPerDay', value)}
        helpText={`Heildar matarkostnaður: ${formatCurrency(foodTotal)}`}
      />

      <CurrencyInput
        label="Afþreying / Athafnir"
        value={costs.activities}
        onChange={(value) => handleCostChange('activities', value)}
        helpText="Inngöngur, ferðir, afþreying"
      />

      <CurrencyInput
        label="Staðbundnar samgöngur"
        value={costs.localTransport}
        onChange={(value) => handleCostChange('localTransport', value)}
        helpText="Bílaleiga, leigubílar, almenningssamgöngur"
      />

      <CurrencyInput
        label="Annað"
        value={costs.other}
        onChange={(value) => handleCostChange('other', value)}
        helpText="Aðrir kostnaðir sem ekki falla undir önnur flokk"
      />

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-700">
            Heildaráætlaður kostnaður:
          </span>
          <span className="text-lg font-bold text-neutral-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
