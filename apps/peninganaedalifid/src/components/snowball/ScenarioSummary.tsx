'use client';

/**
 * Scenario Summary Comparison Cards
 * Displays three scenarios side-by-side:
 * 1. Grunnur (Base case - extra payment only)
 * 2. Snjóbolti → Lán (Snowball to loan)
 * 3. Snjóbolti → Fjárfesting (Snowball to investment)
 */

import type { SnowballResults } from '@/types/snowball';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface ScenarioSummaryProps {
  results: SnowballResults;
}

/**
 * Individual stat display component
 */
function Stat({
  label,
  value,
  suffix = '',
  format = 'text',
  highlight = false,
  color,
}: {
  label: string;
  value: number;
  suffix?: string;
  format?: 'currency' | 'text';
  highlight?: boolean;
  color?: 'green' | 'purple' | 'blue';
}) {
  const formattedValue = format === 'currency' ? formatCurrency(value) : value.toFixed(0);

  const colorClasses = {
    green: 'text-success-700',
    purple: 'text-purple-700',
    blue: 'text-primary-700',
  };

  return (
    <div className={highlight ? 'bg-neutral-50 p-3 rounded-lg' : ''}>
      <div className="text-sm text-neutral-600 mb-1">{label}</div>
      <div
        className={`text-xl font-semibold ${color ? colorClasses[color] : 'text-neutral-900'}`}
      >
        {formattedValue}
        {suffix}
      </div>
    </div>
  );
}

export function ScenarioSummary({ results }: ScenarioSummaryProps) {
  const scenarios = [
    {
      title: 'Grunnur',
      subtitle: 'Aukagreiðsla eingöngu',
      data: results.baseCase,
      borderColor: 'border-neutral-300',
      bgColor: 'bg-neutral-50',
    },
    {
      title: 'Snjóbolti → Lán',
      subtitle: 'Vaxtasparnaður á lán',
      data: results.snowballToLoan,
      borderColor: 'border-primary-300',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Snjóbolti → Fjárfesting',
      subtitle: 'Vaxtasparnaður fjárfestur',
      data: results.snowballToInvestment,
      borderColor: 'border-success-300',
      bgColor: 'bg-success-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {scenarios.map((scenario) => (
        <Card
          key={scenario.title}
          className={`border-2 ${scenario.borderColor}`}
        >
          <CardHeader className={scenario.bgColor}>
            <h3 className="text-lg font-bold text-neutral-900">{scenario.title}</h3>
            <p className="text-sm text-neutral-600">{scenario.subtitle}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Stat
                label="Mánuðir til skuldleysi"
                value={scenario.data.monthsToPayoff}
                suffix=" mán"
              />
              <Stat
                label="Heildarvextir greiddir"
                value={scenario.data.totalInterestPaid}
                format="currency"
              />
              <Stat
                label="Heildargreiðslur"
                value={scenario.data.totalPayments}
                format="currency"
              />
              {scenario.data.finalInvestmentBalance > 0 && (
                <Stat
                  label="Fjárfestingarvirði"
                  value={scenario.data.finalInvestmentBalance}
                  format="currency"
                  color="green"
                />
              )}
              <Stat
                label="Heildarauður skapaður"
                value={scenario.data.totalWealthCreated}
                format="currency"
                highlight
              />
              {scenario.data.lifeEnergyHours.netBenefit > 0 && (
                <Stat
                  label="Lífsorka (sparnaður)"
                  value={scenario.data.lifeEnergyHours.netBenefit}
                  suffix=" klst"
                  color="purple"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
