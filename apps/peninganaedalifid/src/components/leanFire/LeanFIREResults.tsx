/**
 * LeanFIREResults - Main results display for LeanFIRE calculator
 *
 * Features:
 * - Minimum FI number display
 * - New FI number after reductions
 * - Total reductions summary
 * - Timeline display (if savings data available)
 * - Life energy conversion (if AWH available)
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

export function LeanFIREResults() {
  const { leanFireResults, leanFire, results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? null;

  if (!leanFireResults) return null;

  const {
    barebonesMonthly,
    barebonesAnnual,
    minimumFINumber,
    fiMultiplier,
    totalReductions,
    newMonthlyExpenses,
    newFINumber,
    totalMonthsSaved,
    yearsToFI,
    monthsToFI,
    lifeEnergy,
  } = leanFireResults;

  // Don't show reductions when using custom expenses (no category breakdown available)
  const isUsingCustomExpenses = leanFire?.expenseSource === 'custom';
  const hasReductions = totalReductions > 0 && !isUsingCustomExpenses;
  const hasTimeline = yearsToFI !== undefined && monthsToFI !== undefined;
  const hasLifeEnergy = lifeEnergy !== undefined;

  const fiReduction = minimumFINumber - newFINumber;

  return (
    <div className="space-y-6">
      {/* Main FI Number Display */}
      <Card className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border-green-300">
        <div className="text-center space-y-6">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Lágmarks FI-tala þín
            </div>
            <div className="text-5xl font-bold text-green-700">
              {minimumFINumber.toLocaleString()} kr
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Byggt á {barebonesMonthly.toLocaleString()} kr/mán ({fiMultiplier}x margfaldari)
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600">Mánaðarlega</div>
              <div className="text-2xl font-bold text-gray-900">
                {barebonesMonthly.toLocaleString()} kr
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600">Árlega</div>
              <div className="text-2xl font-bold text-gray-900">
                {barebonesAnnual.toLocaleString()} kr
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600">FI Margfaldari</div>
              <div className="text-2xl font-bold text-gray-900">
                {fiMultiplier}x
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reductions Impact */}
      {hasReductions && (
        <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Ný FI-tala eftir minnkanir
              </div>
              <div className="text-4xl font-bold text-purple-700">
                {newFINumber.toLocaleString()} kr
              </div>
              <div className="text-sm text-green-600 font-semibold mt-2">
                -{fiReduction.toLocaleString()} kr sparað!
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600">Mánaðarlegur sparnaður</div>
                <div className="text-2xl font-bold text-purple-700">
                  {totalReductions.toLocaleString()} kr
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600">Ný mánaðarlegar útgjöld</div>
                <div className="text-2xl font-bold text-purple-700">
                  {newMonthlyExpenses.toLocaleString()} kr
                </div>
              </div>
            </div>

            {totalMonthsSaved > 0 && (
              <Alert variant="success">
                <p className="text-sm font-semibold">
                  Þú sparar um {totalMonthsSaved.toFixed(1)} mánuði á leiðinni til FI!
                </p>
              </Alert>
            )}
          </div>
        </Card>
      )}

      {/* Timeline Display */}
      {hasTimeline && (
        <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300">
          <div className="text-center space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Tími til FI
              </div>
              <div className="text-5xl font-bold text-blue-700">
                {yearsToFI} ár {monthsToFI} mán
              </div>
            </div>

            <Alert variant="info">
              <p className="text-sm">
                Byggt á núverandi sparnaði og sparnaðarhlutfalli þínu
              </p>
            </Alert>
          </div>
        </Card>
      )}

      {/* Life Energy Display */}
      {hasLifeEnergy && actualHourlyWage && (
        <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Lífsorkukostnaður
              </h3>
              <p className="text-sm text-gray-600">
                Hversu mörg vinnuár þarf til að ná FI?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Lágmark (LeanFIRE)</div>
                <div className="text-3xl font-bold text-green-700">
                  {lifeEnergy.minimumFIInYears.toFixed(1)}
                </div>
                <div className="text-xs text-gray-700 mt-1">vinnuár</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Þægilegur</div>
                <div className="text-3xl font-bold text-blue-700">
                  {lifeEnergy.comfortableFIInYears.toFixed(1)}
                </div>
                <div className="text-xs text-gray-700 mt-1">vinnuár</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Lúxus</div>
                <div className="text-3xl font-bold text-purple-700">
                  {lifeEnergy.deluxeFIInYears.toFixed(1)}
                </div>
                <div className="text-xs text-gray-700 mt-1">vinnuár</div>
              </div>
            </div>

            <Alert variant="info">
              <p className="text-sm">
                LeanFIRE getur sparað þér{' '}
                <strong>
                  {(lifeEnergy.comfortableFIInYears - lifeEnergy.minimumFIInYears).toFixed(1)}{' '}
                  ár
                </strong>{' '}
                af vinnu samanborið við þægilegan lífsstíl!
              </p>
            </Alert>

            <div className="bg-white rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-2">
                Heildar vinnutímar fyrir LeanFIRE:
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {lifeEnergy.minimumFIInHours.toLocaleString()} klst
              </div>
              <div className="text-xs text-gray-700 mt-1">
                við {actualHourlyWage.toLocaleString()} kr/klst raunverulegt tímakaup
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Key Insights */}
      <Alert variant="success">
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Lykilatriði:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              LeanFIRE-talan þín er{' '}
              <strong>{minimumFINumber.toLocaleString()} kr</strong>
            </li>
            {hasReductions && (
              <li>
                Með því að draga úr útgjöldum sparar þú{' '}
                <strong>{fiReduction.toLocaleString()} kr</strong> á FI-tölu þinni
              </li>
            )}
            {hasLifeEnergy && (
              <li>
                Þetta samsvarar{' '}
                <strong>{lifeEnergy.minimumFIInYears.toFixed(1)} árum</strong> af
                líforku þinni
              </li>
            )}
            <li>
              Minni útgjöld = fljótari leið til frelsis og einfaldara líf
            </li>
          </ul>
        </div>
      </Alert>
    </div>
  );
}
