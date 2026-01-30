'use client';

/**
 * RaiseSummary Component
 * Feature ID: 2.3.2
 *
 * Displays raise calculation results in plain language with key metrics.
 *
 * References:
 * - Section 9: UI/UX Requirements - Results Display
 * - US-1, US-2, US-3
 */

import type { RaiseScenario } from '@/types/raise';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

interface RaiseSummaryProps {
  scenario: RaiseScenario;
  isExpanded?: boolean;
}

export function RaiseSummary({ scenario, isExpanded = true }: RaiseSummaryProps) {
  const { results } = scenario;

  // Format ISK currency
  const formatISK = (amount: number) => {
    return Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      + ' kr';
  };

  // Format percentage
  const formatPercent = (value: number) => {
    return value.toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      {/* Headline Summary */}
      <div className="text-xl font-bold text-primary pb-2">
        {results.summary.headline}
      </div>

      {isExpanded && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="bg-gray-50 p-5">
              <div className="text-sm text-gray-600 mb-1">Eftir skatta/mánuð</div>
              <div className="text-2xl font-bold">
                {results.netIncreaseMonthly >= 0 ? '+' : ''}
                {formatISK(results.netIncreaseMonthly)}
              </div>
            </Card>

            <Card className="bg-gray-50 p-5">
              <div className="text-sm text-gray-600 mb-1">Skatthlutfall á hækkun</div>
              <div className="text-2xl font-bold">
                {formatPercent(results.effectiveTaxRateOnIncrease)}
              </div>
            </Card>

            {results.fiImpact && (
              <>
                <Card className="bg-gray-50 p-5">
                  <div className="text-sm text-gray-600 mb-1">FI hraðun</div>
                  <div className="text-2xl font-bold">
                    {results.fiImpact.accelerationMonths > 0 ? '+' : ''}
                    {results.fiImpact.accelerationMonths} mánuðir
                  </div>
                </Card>

                <Card className="bg-gray-50 p-5">
                  <div className="text-sm text-gray-600 mb-1">Aukin sparing/ár</div>
                  <div className="text-2xl font-bold">
                    {formatISK(results.fiImpact.savingsDifferenceAnnual)}
                  </div>
                </Card>
              </>
            )}

            {/* Raunverulegt tímakaup - Before and After */}
            <Card className="bg-gray-50 p-5 md:col-span-2">
              <div className="text-sm text-gray-600 mb-2">Raunverulegt tímakaup</div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">Núverandi</div>
                  <div className="text-xl font-semibold">
                    {formatISK(results.lifeEnergy.currentTrueHourlyWage)}/klst
                  </div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">Eftir hækkun</div>
                  <div className="text-xl font-semibold">
                    {formatISK(results.lifeEnergy.proposedTrueHourlyWage)}/klst
                  </div>
                </div>
                <div className={`text-center flex-1 p-2 rounded-lg ${
                  results.lifeEnergy.hourlyWageChange >= 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <div className="text-xs mb-1">Breyting</div>
                  <div className="text-lg font-bold">
                    {results.lifeEnergy.hourlyWageChange >= 0 ? '+' : ''}
                    {formatISK(results.lifeEnergy.hourlyWageChange)}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-50 p-5">
              <div className="text-sm text-gray-600 mb-1">Lífsorkuávinningur</div>
              <div className="text-2xl font-bold">
                {Math.round(results.lifeEnergy.annualLifeEnergyGain)} klst/ári
              </div>
            </Card>
          </div>

          {/* Plain Language Summary */}
          <Card className="bg-blue-50 border-blue-200 p-5">
            <h4 className="font-semibold mb-3">Í einföldu máli:</h4>
            <div className="space-y-2 text-sm">
              <p>{results.summary.headline}</p>
              {results.summary.fiImpact && <p>{results.summary.fiImpact}</p>}
              <p>{results.summary.hourlyWageChange}</p>
              <p>{results.summary.lifeEnergyImpact}</p>
            </div>
          </Card>

          {/* Warnings */}
          {results.warnings.length > 0 && (
            <Alert variant="warning">
              <div className="font-semibold mb-2">Athugaðu:</div>
              <ul className="list-disc list-inside space-y-1">
                {results.warnings.map((warning, i) => (
                  <li key={i} className="text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Tax Breakdown (Collapsible) */}
          <details className="group">
            <summary className="cursor-pointer font-semibold text-sm hover:text-primary">
              Skattyfirlit ▼
            </summary>
            <div className="mt-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-2">Núverandi</div>
                  <div>
                    Brúttó laun: {formatISK(results.currentTax.grossAnnual / 12)}/mán
                  </div>
                  <div>
                    Staðgreiðsla: {formatISK(results.currentTax.nationalTax / 12)}/mán
                  </div>
                  <div>
                    Persónuafsláttur: -{formatISK(results.currentTax.personalCredit / 12)}/mán
                  </div>
                  <div className="font-semibold mt-2 text-green-700">
                    Nettó: {formatISK(results.currentTax.netMonthly)}/mán
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Ný laun</div>
                  <div>
                    Brúttó laun: {formatISK(results.proposedTax.grossAnnual / 12)}/mán
                  </div>
                  <div>
                    Staðgreiðsla: {formatISK(results.proposedTax.nationalTax / 12)}/mán
                  </div>
                  <div>
                    Persónuafsláttur: -{formatISK(results.proposedTax.personalCredit / 12)}/mán
                  </div>
                  <div className="font-semibold mt-2 text-green-700">
                    Nettó: {formatISK(results.proposedTax.netMonthly)}/mán
                  </div>
                </div>
              </div>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
