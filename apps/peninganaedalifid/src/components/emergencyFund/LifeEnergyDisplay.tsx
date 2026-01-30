'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';

/**
 * Life Energy Display
 *
 * Shows emergency fund value in life energy terms:
 * - Total hours protected
 * - Work-weeks (if > 40 hours)
 * - Years (if > 1 year)
 */
export function LifeEnergyDisplay() {
  const { emergencyFundResults } = useCalculator();

  if (!emergencyFundResults || !emergencyFundResults.lifeEnergyHours) {
    return null;
  }

  const { lifeEnergyHours, lifeEnergyWorkWeeks, lifeEnergyYears } = emergencyFundResults;

  // Determine best display format
  const showYears = lifeEnergyYears && lifeEnergyYears >= 1;
  const showWorkWeeks = lifeEnergyWorkWeeks && lifeEnergyWorkWeeks >= 1;

  return (
    <Card className="p-6 bg-purple-50 border-purple-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">
            Lífsorka vernduð
          </h3>
          <div className="text-2xl">⚡</div>
        </div>

        {/* Primary display - choose most meaningful unit */}
        <div>
          {showYears ? (
            <>
              <div className="text-4xl md:text-5xl font-bold text-purple-900 leading-none">
                {lifeEnergyYears.toFixed(1)}
              </div>
              <div className="text-lg md:text-xl font-medium text-purple-800 mt-1">
                ár af lífsorku
              </div>
            </>
          ) : showWorkWeeks ? (
            <>
              <div className="text-4xl md:text-5xl font-bold text-purple-900 leading-none">
                {lifeEnergyWorkWeeks.toFixed(1)}
              </div>
              <div className="text-lg md:text-xl font-medium text-purple-800 mt-1">
                vinnuvikur
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-bold text-purple-900 leading-none">
                {lifeEnergyHours.toLocaleString('is-IS', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-lg md:text-xl font-medium text-purple-800 mt-1">
                klukkustundir
              </div>
            </>
          )}
        </div>

        {/* Alternative displays */}
        <div className="space-y-1 text-sm text-neutral-700">
          {showYears && (
            <div className="flex items-center justify-between">
              <span>Vinnuvikur:</span>
              <span className="font-medium">{lifeEnergyWorkWeeks?.toFixed(1)}</span>
            </div>
          )}
          {(showYears || showWorkWeeks) && (
            <div className="flex items-center justify-between">
              <span>Klukkustundir:</span>
              <span className="font-medium">
                {lifeEnergyHours.toLocaleString('is-IS', { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}
        </div>

        {/* Explanation */}
        <p className="text-sm text-neutral-600 pt-3 border-t border-purple-200">
          Neyðarsjóðurinn þinn verndar þessa lífsorku. Þú þarft ekki að vinna þessar klukkustundir aftur ef þú lendir í neyðartilvikum.
        </p>
      </div>
    </Card>
  );
}
