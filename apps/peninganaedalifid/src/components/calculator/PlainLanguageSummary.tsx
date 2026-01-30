'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { formatLifeEnergy, dollarsToLifeEnergy } from '@/lib/calculations';

/**
 * Plain language summary explaining calculator results
 * Uses conversational tone to make life energy concept tangible
 */
export function PlainLanguageSummary() {
  const { results, inputs } = useCalculator();

  if (!results) {
    return null;
  }

  const {
    actualHourlyWage,
    nominalHourlyWage,
    percentageReduction,
    totalMoneyExpenses,
    totalExtraHours,
  } = results;

  // Calculate example conversions (ISK amounts)
  const hoursFor10k = dollarsToLifeEnergy(10000, actualHourlyWage);
  const hoursFor50k = dollarsToLifeEnergy(50000, actualHourlyWage);
  const hoursFor100k = dollarsToLifeEnergy(100000, actualHourlyWage);

  // Get severity level for styling
  const getSeverityClass = () => {
    if (percentageReduction > 30) return 'border-danger-500/30 bg-danger-50';
    if (percentageReduction > 15) return 'border-warning-200 bg-warning-50';
    return 'border-success-200 bg-success-50';
  };

  return (
    <Card variant="outlined" className={getSeverityClass()}>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Hvað þýðir þetta
        </h3>

        <div className="space-y-3 text-neutral-700">
          {/* Main summary */}
          <p>
            Raunverulegt tímakaup þitt eru{' '}
            <span className="font-semibold text-primary-700">
              {formatCurrency(actualHourlyWage)}
            </span>
            , sem er{' '}
            <span className="font-semibold text-danger-600">
              {percentageReduction.toFixed(1)}% lægra
            </span>{' '}
            en upprunalegt tímakaup þitt, {formatCurrency(nominalHourlyWage)}.
          </p>

          {/* Cost explanation */}
          {totalMoneyExpenses > 0 && (
            <p>
              Þú eyðir{' '}
              <span className="font-semibold">
                {formatCurrency(Math.round(totalMoneyExpenses / 12))}
              </span>{' '}
              á mánuði í vinnutengdan kostnað.
            </p>
          )}

          {/* Time explanation */}
          {totalExtraHours > 0 && (
            <p>
              Þú eyðir{' '}
              <span className="font-semibold">
                {totalExtraHours.toFixed(1)} klukkustundum á viku
              </span>{' '}
              aukalega í vinnutengda þætti utan greidds vinnutíma.
            </p>
          )}

          {/* Life energy examples */}
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <p className="font-semibold text-neutral-900 mb-2">
              Hvað kostar í lífsorku:
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                10.000 kr kaup kostar þig{' '}
                <span className="font-semibold">{formatLifeEnergy(hoursFor10k)}</span>
              </li>
              <li>
                50.000 kr kaup kostar þig{' '}
                <span className="font-semibold">{formatLifeEnergy(hoursFor50k)}</span>
              </li>
              <li>
                100.000 kr kaup kostar þig{' '}
                <span className="font-semibold">{formatLifeEnergy(hoursFor100k)}</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
