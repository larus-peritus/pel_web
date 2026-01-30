/**
 * Travel/Vacation Cost Calculator - Main Page Component
 * Integrates all components and manages state
 */

import React, { useState, useEffect } from 'react';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { TripInputSection } from './TripInputSection';
import { TotalCostCard } from './TotalCostCard';
import { LifeEnergyCard } from './LifeEnergyCard';
import { OpportunityCostCard } from './OpportunityCostCard';
import { StaycationComparisonCard } from './StaycationComparisonCard';
import { FIImpactCard } from './FIImpactCard';
import { calculateTripResult } from '@/lib/calculations/travelVacation';
import { applyPreset } from '@/lib/calculations/travelVacation';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from '@/lib/utils/travelVacationStorage';
import {
  INITIAL_STATE,
  type TravelVacationState,
  type TripCalculationResult,
  type TripPreset,
  type RequiredCalculatorData,
} from '@/types/travelVacation';
import { useDebounce } from '@/hooks/useDebounce';

export interface TravelVacationPageProps {
  /** Calculator data from context */
  calculatorData: RequiredCalculatorData;
}

/**
 * TravelVacationPage - Main page for travel cost calculator
 */
export function TravelVacationPage({
  calculatorData,
}: TravelVacationPageProps) {
  const [state, setState] = useState<TravelVacationState>(INITIAL_STATE);
  const [result, setResult] = useState<TripCalculationResult | null>(null);

  // Debounce state changes for localStorage
  const debouncedState = useDebounce(state, 500);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadFromLocalStorage();
    if (loaded) {
      setState(loaded);
    }
  }, []);

  // Save to localStorage when state changes (debounced)
  useEffect(() => {
    if (debouncedState !== INITIAL_STATE) {
      saveToLocalStorage(debouncedState);
    }
  }, [debouncedState]);

  // Calculate results when inputs change
  useEffect(() => {
    if (!calculatorData.actualHourlyWage) {
      setResult(null);
      return;
    }

    try {
      const calculated = calculateTripResult(
        state.mainTrip,
        calculatorData,
        state.settings,
      );
      setResult(calculated);
    } catch (error) {
      console.error('Calculation error:', error);
      setResult(null);
    }
  }, [state.mainTrip, state.settings, calculatorData]);

  const handleApplyPreset = (preset: TripPreset) => {
    const tripInput = applyPreset(preset);
    setState({
      ...state,
      mainTrip: tripInput,
    });
  };

  const handleClear = () => {
    setState(INITIAL_STATE);
    clearLocalStorage();
  };

  return (
    <div className="w-full">
      {/* Warning if no actual hourly wage */}
      {!calculatorData.actualHourlyWage ? (
        <Alert variant="warning" className="mb-6">
          <p className="font-semibold">Raunverulegt tímakaup vantar</p>
          <p className="text-sm mt-1">
            Þú þarft að fylla út Raunverulegt Tímakaup reiknivélina fyrst til
            að nota þetta verkfæri.
          </p>
          <a
            href="/actual-hourly-wage"
            className="text-sm font-medium underline mt-2 inline-block"
          >
            Fara í Raunverulegt Tímakaup
          </a>
        </Alert>
      ) : (
        <>
          {/* Trip input section */}
          <div className="mb-8">
            <TripInputSection
              trip={state.mainTrip}
              settings={state.settings}
              onTripChange={(trip) => setState({ ...state, mainTrip: trip })}
              onSettingsChange={(settings) =>
                setState({ ...state, settings })
              }
              onApplyPreset={handleApplyPreset}
            />
          </div>

          {/* Results section */}
          {result && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Niðurstöður
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TotalCostCard totalCost={result.totalCost} />
                  <LifeEnergyCard lifeEnergyCost={result.lifeEnergyCost} />
                  <OpportunityCostCard
                    opportunityCost={result.opportunityCost}
                  />
                  {result.staycationComparison && (
                    <StaycationComparisonCard
                      comparison={result.staycationComparison}
                    />
                  )}
                  {result.fiImpact && <FIImpactCard fiImpact={result.fiImpact} />}
                </div>
              </div>
            </>
          )}

          {/* Disclaimer/Tip */}
          <Alert variant="info" className="mb-6">
            <p className="font-semibold">Ábending</p>
            <p className="text-sm mt-1">
              Þó að þú getir sparað peninga með því að ferðast minna, þá þarftu ekki að hætta alveg.
              Íhugaðu að taka styttri ferðir, velja ódýrari áfangastaði, eða ferðast innanlands á Íslandi.
              Margar skemmtilegar ferðir er hægt að fara í án þess að fara úr landi!
            </p>
          </Alert>

          {/* Action buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-neutral-200">
            <Button variant="secondary" onClick={handleClear}>
              Hreinsa
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
