'use client';

/**
 * Life Energy Comparison Component
 * Compares the life energy impact of debt payoff vs investment
 */

import type { DebtPayoffResults } from '@/types/debtPayoff';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface LifeEnergyComparisonProps {
  results: DebtPayoffResults;
  extraPayment: number;
  actualHourlyWage: number;
  remainingMonths: number;
}

export function LifeEnergyComparison({
  results,
  extraPayment,
  actualHourlyWage,
  remainingMonths,
}: LifeEnergyComparisonProps) {
  // Calculate life energy metrics
  const extraPaymentLifeEnergy = extraPayment / actualHourlyWage;
  const totalExtraLifeEnergy = extraPaymentLifeEnergy * remainingMonths;

  // Debt scenario metrics
  const totalInterestPaid = results.debtScenario.totalInterestPaid;
  const interestLifeEnergy = totalInterestPaid / actualHourlyWage;

  // Investment scenario metrics
  const investmentGains = results.investmentScenario.totalGains;
  const investmentLifeEnergy = investmentGains / actualHourlyWage;

  // Calculate the difference (what you save/gain)
  const debtSavings = results.comparison.recommendation === 'debt'
    ? results.comparison.financialAdvantage
    : 0;
  const investmentAdvantage = results.comparison.recommendation === 'invest'
    ? results.comparison.financialAdvantage
    : 0;

  const debtSavingsLifeEnergy = debtSavings / actualHourlyWage;
  const investmentAdvantageLifeEnergy = investmentAdvantage / actualHourlyWage;

  return (
    <div className="space-y-6">
      {/* Main comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debt Payoff Scenario */}
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-red-50">
            <h3 className="text-lg font-semibold text-red-900">
              Leið A: Aukagreiðsla á skuld
            </h3>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Aukagreiðsla á mánuði</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(extraPayment)}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  = {extraPaymentLifeEnergy.toFixed(1)} klst af lífsorkuíðju
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-red-700">Heildarvextir sem greiddir verða</div>
                <div className="text-lg font-bold text-red-900">
                  {formatCurrency(totalInterestPaid)}
                </div>
                <div className="text-sm text-red-600 font-medium">
                  = {interestLifeEnergy.toFixed(1)} klst af lífsorku til bankans
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700">Þú ert skuldlaus eftir</div>
                <div className="text-lg font-bold text-green-900">
                  {results.debtScenario.debtFreeMonth} mánuði
                </div>
                <div className="text-xs text-green-600 mt-2">
                  Skuldleysi þýðir að engin lífsorka fer lengur í vaxtagreiðslur
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Ávinningur:</div>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• Hver aukagreiðsla lækkar höfuðstólinn</li>
                  <li>• Lægri höfuðstóll = lægri vextir næsta mánuð</li>
                  <li>• Þetta skapar keðjuverkun sem sparar lífsorku</li>
                  <li>• Engin áhætta - tryggð &quot;ávöxtun&quot;</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Scenario */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <h3 className="text-lg font-semibold text-green-900">
              Leið B: Fjárfesta aukagreiðsluna
            </h3>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Fjárfesting á mánuði</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(extraPayment)}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  = {extraPaymentLifeEnergy.toFixed(1)} klst af lífsorkuíðju
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700">Heildarávöxtun (vaxtavextir)</div>
                <div className="text-lg font-bold text-green-900">
                  {formatCurrency(investmentGains)}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  = {investmentLifeEnergy.toFixed(1)} klst af lífsorku unnið
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-700">Lokastaða fjárfestingar</div>
                <div className="text-lg font-bold text-purple-900">
                  {formatCurrency(results.investmentScenario.finalInvestmentBalance)}
                </div>
                <div className="text-xs text-purple-600 mt-2">
                  Þetta er auður sem vinnur fyrir þig - &quot;peningar sem vinna&quot;
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800">Ávinningur:</div>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Vaxtavextir (compound interest) vinna fyrir þig</li>
                  <li>• Sparnaður skapar auð, ekki bara minnkar skuldir</li>
                  <li>• Fjárhagslegur sveigjanleiki og öryggi</li>
                  <li>• Áhætta: Ávöxtun er ekki tryggð</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Philosophy Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Mikilvægur munur: Skuldaminnkun vs Auðsköpun
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white/70 rounded-lg">
              <h5 className="font-medium text-red-800 mb-2">Skuldaminnkun</h5>
              <p className="text-sm text-gray-700">
                Þegar þú borgar aukalega á skuld ertu að <strong>minnka tap</strong>.
                Vextir eru lífsorka sem fer til bankans. Með aukagreiðslu minnkar þú
                höfuðstólinn og þar með framtíðarvexti. Þetta er eins og að loka
                götu sem lekur peninga.
              </p>
            </div>
            <div className="p-4 bg-white/70 rounded-lg">
              <h5 className="font-medium text-green-800 mb-2">Auðsköpun</h5>
              <p className="text-sm text-gray-700">
                Þegar þú fjárfestir ertu að <strong>skapa auð</strong>.
                Fjárfesting vinnur fyrir þig 24/7. Vaxtavextir gera það að verkum að
                ávöxtun þín fær ávöxtun. Þetta er eins og að eiga litla verksmiðju
                sem framleiðir peninga.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white/50 rounded-lg">
            <p className="text-sm text-gray-600 italic">
              &quot;Auður er ekki bara fjarvera skulda. Auður er eignir sem skapa tekjur.
              Skuldleysi gefur þér frelsi frá vaxtagreiðslum, en fjárfestingar gefa þér
              frelsi til að hætta að vinna.&quot;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Recommendation */}
      <Card className={`border-2 ${
        results.comparison.recommendation === 'debt'
          ? 'border-red-300 bg-red-50'
          : 'border-green-300 bg-green-50'
      }`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-2">
              {results.comparison.recommendation === 'debt'
                ? 'Niðurstaða: Borgaðu aukalega á skuldina'
                : 'Niðurstaða: Fjárfestu aukagreiðsluna'}
            </h4>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {results.comparison.recommendation === 'debt'
                ? `${debtSavingsLifeEnergy.toFixed(1)} klst`
                : `${investmentAdvantageLifeEnergy.toFixed(1)} klst`}
            </div>
            <p className="text-gray-600">
              {results.comparison.recommendation === 'debt'
                ? 'af lífsorku sparast með því að borga aukalega á lánið'
                : 'af lífsorku græðist með því að fjárfesta'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Jafngildir {formatCurrency(results.comparison.financialAdvantage)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
