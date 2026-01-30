'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { MonthsOfFreedomDisplay } from './MonthsOfFreedomDisplay';
import { LifeEnergyDisplay } from './LifeEnergyDisplay';
import { RiskRatingDisplay } from './RiskRatingDisplay';

/**
 * Emergency Fund Results Display
 *
 * Shows calculated metrics:
 * - Months of freedom (primary metric)
 * - Life energy hours (if AWH available)
 * - Risk rating and recommendation
 */
export function EmergencyFundResults() {
  const { emergencyFundResults, results } = useCalculator();

  if (!emergencyFundResults) {
    return null;
  }

  const hasActualWage = results?.actualHourlyWage && results.actualHourlyWage > 0;

  return (
    <div className="space-y-6">
      {/* Months of Freedom - Primary Metric */}
      <MonthsOfFreedomDisplay />

      {/* Risk Rating */}
      <RiskRatingDisplay />

      {/* Life Energy (if AWH calculated) */}
      {hasActualWage && emergencyFundResults.lifeEnergyHours ? (
        <LifeEnergyDisplay />
      ) : (
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900 mb-1">
                  Viltu sjá lífsorku vernd?
                </h4>
                <p className="text-sm text-neutral-700 mb-3">
                  Til að sjá hversu margar klukkustundir af lífsorku neyðarsjóðurinn þinn verndar þarftu að reikna út raunverulegt tímakaup þitt fyrst.
                </p>
                <a
                  href="/reiknitaeki"
                  className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  Reikna út raunverulegt tímakaup →
                </a>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Insight about improvements */}
      {emergencyFundResults.monthsOfFreedom < 3 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-xl">💡</div>
            <div className="flex-1 text-sm text-neutral-700">
              <strong>Ábending:</strong> Byrjaðu með að miða að 3 mánuðum. Jafnvel lítið framlag mánaðarlega getur skipt sköpum í neyðartilvikum.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
