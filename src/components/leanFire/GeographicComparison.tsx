/**
 * GeographicComparison - Compare living costs between Reykjavík and Landsbyggð
 *
 * Features:
 * - Category-by-category expense comparison
 * - FI number difference
 * - Visual bar chart comparison
 * - Pros/cons for each location
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { EXPENSE_CATEGORY_LABELS } from '@/types/leanFire';
import type { ExpenseCategory } from '@/types/leanFire';

export function GeographicComparison() {
  const { leanFireResults } = useCalculator();

  if (!leanFireResults?.locationComparison) {
    return null;
  }

  const { reykjavik, landsbyggd, differences, fiNumberDifference, netSavings } =
    leanFireResults.locationComparison;

  const categories = Object.keys(differences) as ExpenseCategory[];

  // Calculate max value for chart scaling
  const maxValue = Math.max(
    reykjavik.totalMonthly,
    landsbyggd.totalMonthly
  );

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Landfræðilegur samanburður
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Berðu saman lífskostnað á Íslandi
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {reykjavik.totalMonthly.toLocaleString()} kr
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">
              Reykjavík - Mánaðarlega
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {landsbyggd.totalMonthly.toLocaleString()} kr
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">
              Landsbyggð - Mánaðarlega
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {netSavings.toLocaleString()} kr
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">
              Mánaðarlegur munur
            </div>
          </div>
        </div>

        {/* FI Number Difference */}
        <Alert variant="info">
          <div className="text-sm">
            <p className="font-semibold">
              FI-tölu munur: {fiNumberDifference.toLocaleString()} kr
            </p>
            <p className="mt-1">
              Með því að búa á landsbyggðinni þarftu{' '}
              <strong>{fiNumberDifference.toLocaleString()} kr minna</strong> til að ná
              fjárhagslegu frelsi.
            </p>
          </div>
        </Alert>

        {/* Category Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Útgjöld eftir flokkum
          </h3>

          <div className="space-y-3">
            {categories.map((category) => {
              const rvkValue = reykjavik.expenses[category];
              const lbValue = landsbyggd.expenses[category];
              const diff = differences[category];
              const rvkPercent = (rvkValue / maxValue) * 100;
              const lbPercent = (lbValue / maxValue) * 100;

              return (
                <div key={category} className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">
                      {EXPENSE_CATEGORY_LABELS[category]}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        diff > 0 ? 'text-red-600' : diff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff.toLocaleString()} kr
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="space-y-2">
                    {/* Reykjavík bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-xs text-gray-600">Reykjavík</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${rvkPercent}%` }}
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center px-2">
                          <span className="text-xs font-medium text-white">
                            {rvkValue.toLocaleString()} kr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Landsbyggð bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-xs text-gray-600">Landsbyggð</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${lbPercent}%` }}
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center px-2">
                          <span className="text-xs font-medium text-white">
                            {lbValue.toLocaleString()} kr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reykjavík */}
          <div className="bg-white rounded-lg p-5">
            <h4 className="text-lg font-semibold text-blue-700 mb-3">
              Reykjavík
            </h4>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-green-700 mb-2">
                  Kostir:
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {reykjavik.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm font-medium text-red-700 mb-2">
                  Gallar:
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {reykjavik.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Landsbyggð */}
          <div className="bg-white rounded-lg p-5">
            <h4 className="text-lg font-semibold text-green-700 mb-3">
              Landsbyggð
            </h4>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-green-700 mb-2">
                  Kostir:
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {landsbyggd.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm font-medium text-red-700 mb-2">
                  Gallar:
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {landsbyggd.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
