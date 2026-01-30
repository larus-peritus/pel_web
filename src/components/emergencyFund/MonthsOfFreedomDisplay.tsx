'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';

/**
 * Months of Freedom Display
 *
 * Primary metric showing how many months the emergency fund covers.
 * - Color coded by risk level
 * - Shows weeks if < 1 month
 * - Plain language interpretation
 */
export function MonthsOfFreedomDisplay() {
  const { emergencyFundResults } = useCalculator();

  if (!emergencyFundResults) return null;

  const { monthsOfFreedom, weeksOfFreedom, riskRating } = emergencyFundResults;

  // Determine if we should show weeks instead
  const showWeeks = monthsOfFreedom < 1 && weeksOfFreedom !== null;

  // Format the number
  const displayValue = showWeeks
    ? weeksOfFreedom.toFixed(1)
    : monthsOfFreedom.toFixed(1);
  const displayUnit = showWeeks ? 'vikur' : monthsOfFreedom === 1 ? 'mánuður' : 'mánuðir';

  // Plain language interpretation
  const getInterpretation = () => {
    if (monthsOfFreedom === 0) {
      return 'Þú hefur enga fjárhagslega vörn í augnablikinu';
    }
    if (showWeeks && weeksOfFreedom) {
      return `Þú getur lifað af í um ${weeksOfFreedom.toFixed(1)} vikur`;
    }
    if (monthsOfFreedom < 1) {
      return 'Þú hefur minna en einn mánuð af vernd';
    }
    if (monthsOfFreedom === 1) {
      return 'Þú getur lifað af í um einn mánuð';
    }
    const rounded = Math.floor(monthsOfFreedom);
    return `Þú getur lifað af í um ${rounded} ${rounded === 1 ? 'mánuð' : 'mánuði'}`;
  };

  return (
    <Card className={`p-6 ${riskRating.color.bg} border-2 ${riskRating.color.border}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">
            Mánuðir af frelsi
          </h3>
          <div className="text-3xl">🛡️</div>
        </div>

        {/* Primary Value */}
        <div>
          <div className={`text-5xl md:text-6xl font-bold ${riskRating.color.text} leading-none`}>
            {displayValue}
          </div>
          <div className={`text-xl md:text-2xl font-medium ${riskRating.color.text} mt-1`}>
            {displayUnit}
          </div>
        </div>

        {/* Plain Language */}
        <p className="text-neutral-700 text-sm md:text-base">
          {getInterpretation()}
        </p>

        {/* Context for very low amounts */}
        {monthsOfFreedom < 0.25 && monthsOfFreedom > 0 && (
          <div className="pt-3 border-t border-red-200">
            <p className="text-xs text-neutral-600 italic">
              Það er mjög mikilvægt að byrja að byggja upp neyðarsjóð sem fyrst.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
