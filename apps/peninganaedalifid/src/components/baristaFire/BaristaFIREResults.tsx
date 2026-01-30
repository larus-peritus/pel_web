/**
 * BaristaFIREResults - Display calculation results
 *
 * Shows:
 * - FI number and gap
 * - Scenario comparison table
 * - Key metrics for each scenario
 * - Action suggestions
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import type { BaristaFireResults } from '@/types/baristaFire';
import { formatCurrency, formatNumber } from '@/lib/utils';

export interface BaristaFIREResultsProps {
  results: BaristaFireResults;
}

export function BaristaFIREResults({ results }: BaristaFIREResultsProps) {
  const {
    fiNumber,
    fiMultiplier,
    currentSavings,
    gap,
    isCoastFIRE,
    annualExpenses,
    scenarioResults,
  } = results;

  // Find fastest scenario that actually reaches FI (not depleting)
  const validScenarios = scenarioResults.filter(
    s => !s.willDeplete && Number.isFinite(s.yearsToFI) && s.yearsToFI <= 50
  );

  const fastestScenario = validScenarios.length > 0
    ? validScenarios.reduce((fastest, current) => {
        const fastestMonths = fastest.yearsToFI * 12 + fastest.monthsToFI;
        const currentMonths = current.yearsToFI * 12 + current.monthsToFI;
        return currentMonths < fastestMonths ? current : fastest;
      }, validScenarios[0])
    : null;

  return (
    <div className="space-y-6">
      {/* FI Number and Gap Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-neutral-900">
            FI Staða
          </h2>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FI Number */}
            <div>
              <p className="text-sm text-neutral-600">FI Tala</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(fiNumber)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {fiMultiplier}x árleg útgjöld ({formatCurrency(annualExpenses)})
              </p>
            </div>

            {/* Current Savings */}
            <div>
              <p className="text-sm text-neutral-600">Núverandi sparnaður</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(currentSavings)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {formatNumber((currentSavings / fiNumber) * 100, 1)}% af FI
              </p>
            </div>

            {/* Gap */}
            <div>
              <p className="text-sm text-neutral-600">Bilið</p>
              <p
                className={`text-2xl font-bold ${
                  isCoastFIRE ? 'text-success-600' : 'text-warning-600'
                }`}
              >
                {formatCurrency(gap)}
              </p>
              {isCoastFIRE ? (
                <p className="text-xs text-success-600 mt-1 font-semibold">
                  Coast FIRE náð!
                </p>
              ) : (
                <p className="text-xs text-neutral-600 mt-1">
                  {formatNumber((gap / fiNumber) * 100, 1)}% eftir
                </p>
              )}
            </div>
          </div>

          {/* Coast FIRE Alert */}
          {isCoastFIRE && (
            <div className="mt-6">
              <Alert variant="success">
                <p className="font-semibold mb-1">
                  Til hamingju! Þú hefur náð Coast FIRE.
                </p>
                <p className="text-sm">
                  Núverandi sparnaður þinn mun vaxa að fullu FI án frekari framlaga.
                  Kaffiþjóna FIRE tekjur gera þér kleift að lifa núna á meðan fjárfestingar þínar vaxa.
                </p>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scenario Comparison Table */}
      {scenarioResults.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-neutral-900">
              Samanburður Sviðsmynda
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Hversu lengi tekur að ná full FI með hverri sviðsmynd
            </p>
          </CardHeader>

          <CardContent>
            {/* Fastest Scenario Highlight */}
            {fastestScenario ? (
              <div className="mb-6 rounded-lg bg-success-50 border border-success-200 p-4">
                <p className="text-sm font-semibold text-success-900 mb-1">
                  Hraðasta sviðsmyndin
                </p>
                <p className="text-2xl font-bold text-success-700">
                  {fastestScenario.scenarioName}
                </p>
                <p className="text-sm text-success-600 mt-1">
                  {fastestScenario.yearsToFI} ár
                  {fastestScenario.monthsToFI > 0 &&
                    `, ${fastestScenario.monthsToFI} mánuði`}{' '}
                  til full FI
                </p>
              </div>
            ) : (
              <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Engin sviðsmynd nær FI innan 50 ára
                </p>
                <p className="text-sm text-amber-700">
                  Skoðaðu sjóðstreymi hér að neðan til að skilja hvernig vextir og laun vinna saman.
                </p>
              </div>
            )}

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="pb-3 text-left text-sm font-semibold text-neutral-900">
                      Sviðsmynd
                    </th>
                    <th className="pb-3 text-right text-sm font-semibold text-neutral-900">
                      Nettó tekjur
                    </th>
                    <th className="pb-3 text-right text-sm font-semibold text-neutral-900">
                      Sparnaður
                    </th>
                    <th className="pb-3 text-right text-sm font-semibold text-neutral-900">
                      Sparnaðarhlutfall
                    </th>
                    <th className="pb-3 text-right text-sm font-semibold text-neutral-900">
                      Tími til FI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioResults.map((scenario) => {
                    const isFastest = scenario.scenarioId === fastestScenario?.scenarioId;
                    const reachesFI = Number.isFinite(scenario.yearsToFI) && scenario.yearsToFI <= 50;

                    // Determine row styling based on scenario outcome
                    let rowClass = 'border-b border-neutral-100';
                    if (scenario.willDeplete) {
                      rowClass += ' bg-danger-50';
                    } else if (isFastest && reachesFI) {
                      rowClass += ' bg-success-50';
                    }

                    return (
                      <tr key={scenario.scenarioId} className={rowClass}>
                        <td className="py-3 text-sm font-medium text-neutral-900">
                          {scenario.scenarioName}
                          {isFastest && reachesFI && (
                            <span className="ml-2 text-xs font-semibold text-success-600">
                              Hraðast
                            </span>
                          )}
                          {scenario.willDeplete && (
                            <span className="ml-2 text-xs font-semibold text-danger-600">
                              Tæmist!
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right text-sm text-neutral-700">
                          {formatCurrency(scenario.netMonthlyIncome)}/mán
                        </td>
                        <td
                          className={`py-3 text-right text-sm font-semibold ${
                            scenario.monthlySavings >= 0
                              ? 'text-success-600'
                              : 'text-danger-600'
                          }`}
                        >
                          {formatCurrency(scenario.monthlySavings)}/mán
                        </td>
                        <td className="py-3 text-right text-sm text-neutral-700">
                          {scenario.netAnnualIncome > 0
                            ? `${formatNumber(scenario.savingsRate * 100, 1)}%`
                            : '—'}
                        </td>
                        <td className="py-3 text-right text-sm font-semibold">
                          {scenario.willDeplete ? (
                            <span className="text-danger-600">
                              Tæmist: {scenario.yearsToDepletion !== null
                                ? `${Math.floor(scenario.yearsToDepletion)} ár`
                                : '—'}
                            </span>
                          ) : reachesFI ? (
                            <span className="text-primary-600">
                              {scenario.yearsToFI} ár
                              {scenario.monthsToFI > 0 && `, ${scenario.monthsToFI} mán`}
                            </span>
                          ) : (
                            <span className="text-amber-600">&gt;50 ár</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Monthly Cash Flow Breakdown */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Mánaðarlegt sjóðstreymi
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Hvernig vextir og laun vinna saman (miðað við núverandi sparnað)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarioResults.map((scenario) => {
                  const interestCoversShortfall = scenario.monthlySavings < 0 &&
                    scenario.monthlyInterestAtStart >= Math.abs(scenario.monthlySavings);

                  return (
                    <div
                      key={scenario.scenarioId}
                      className={`rounded-lg border p-4 ${
                        scenario.willDeplete
                          ? 'border-danger-200 bg-danger-50'
                          : scenario.netMonthlyChange > 0
                            ? 'border-success-200 bg-success-50'
                            : 'border-neutral-200'
                      }`}
                    >
                      <p className="font-semibold text-neutral-900 text-sm mb-3">
                        {scenario.scenarioName}
                      </p>

                      <div className="space-y-2 text-sm">
                        {/* Interest income - clarify it's at starting balance */}
                        <div className="flex justify-between">
                          <span className="text-neutral-600">
                            Vextir <span className="text-xs">(í dag)</span>:
                          </span>
                          <span className="font-medium text-success-600">
                            +{formatCurrency(scenario.monthlyInterestAtStart)}
                          </span>
                        </div>

                        {/* Work income vs expenses */}
                        <div className="flex justify-between">
                          <span className="text-neutral-600">
                            {scenario.monthlySavings >= 0 ? 'Afgangur:' : 'Skortur:'}
                          </span>
                          <span className={`font-medium ${
                            scenario.monthlySavings >= 0 ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {scenario.monthlySavings >= 0 ? '+' : ''}
                            {formatCurrency(scenario.monthlySavings)}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-neutral-200 pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-neutral-700">
                              Nettó <span className="text-xs font-normal">(í dag)</span>:
                            </span>
                            <span className={
                              scenario.netMonthlyChange > 0
                                ? 'text-success-700'
                                : scenario.netMonthlyChange < 0
                                  ? 'text-danger-700'
                                  : 'text-neutral-700'
                            }>
                              {scenario.netMonthlyChange >= 0 ? '+' : ''}
                              {formatCurrency(scenario.netMonthlyChange)}/mán
                            </span>
                          </div>
                        </div>

                        {/* Status explanation - more detailed for depleting scenarios */}
                        <div className="text-xs mt-2 pt-2 border-t border-neutral-100">
                          {scenario.willDeplete ? (
                            <div className="text-danger-600 space-y-1">
                              <p>
                                <strong>Athugið:</strong> Eftir því sem sparnaður minnkar, minnka vextirnir líka.
                              </p>
                              <p>
                                Við {formatCurrency(currentSavings / 2)} verða vextir aðeins {formatCurrency(scenario.monthlyInterestAtStart / 2)}/mán.
                              </p>
                              {scenario.yearsToDepletion !== null && (
                                <p className="font-semibold">
                                  Tæmist eftir ~{Math.floor(scenario.yearsToDepletion)} ár
                                  {scenario.ageAtDepletion && ` (við ${Math.round(scenario.ageAtDepletion)} ára aldur)`}
                                </p>
                              )}
                            </div>
                          ) : interestCoversShortfall ? (
                            <p className="text-success-600">
                              Vextir ná yfir skortinn og sparnaður heldur áfram að vaxa!
                            </p>
                          ) : scenario.netMonthlyChange > 0 ? (
                            <p className="text-success-600">
                              Sparnaður vex — vextir aukast eftir því sem hann stækkar.
                            </p>
                          ) : (
                            <p className="text-amber-600">
                              Sparnaður stendur í stað eða vex hægt
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Life Energy Summary (if available) */}
            {scenarioResults.some((s) => s.lifeEnergy) && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Lífsorka Samanburður
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scenarioResults
                    .filter((s) => s.lifeEnergy)
                    .map((scenario) => (
                      <div
                        key={scenario.scenarioId}
                        className="rounded-lg border border-neutral-200 p-4"
                      >
                        <p className="font-semibold text-neutral-900 text-sm mb-2">
                          {scenario.scenarioName}
                        </p>
                        <p className="text-xs text-neutral-600">
                          Vinnustundir á viku
                        </p>
                        <p className="text-lg font-bold text-primary-600">
                          {formatNumber(scenario.lifeEnergy!.hoursPerWeek, 1)} klst
                        </p>
                        <p className="text-xs text-neutral-600 mt-2">
                          {formatNumber(
                            scenario.lifeEnergy!.percentageOfFullTime,
                            0
                          )}
                          % af fullu starfi
                        </p>
                        <p className="text-xs text-neutral-600 mt-1">
                          Heildarstundir: {formatNumber(scenario.lifeEnergy!.totalHoursOverGap, 0)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Scenarios Alert */}
      {scenarioResults.length === 0 && (
        <Alert variant="info">
          <p className="font-semibold mb-1">
            Engar sviðsmyndir enn
          </p>
          <p className="text-sm">
            Búðu til að minnsta kosti eina sviðsmynd til að sjá niðurstöður.
          </p>
        </Alert>
      )}
    </div>
  );
}
