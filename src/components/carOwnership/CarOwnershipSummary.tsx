'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/lib/utils/formatters';
import type { CarOwnershipResults, CarOwnershipScenario } from '@/types/car-ownership';

/**
 * Props for CarOwnershipSummary component
 */
export interface CarOwnershipSummaryProps {
  scenario: CarOwnershipScenario;
  actualHourlyWage?: number;
  className?: string;
}

/**
 * CarOwnershipSummary - Display component for car ownership results
 *
 * Shows comprehensive breakdown of car ownership costs:
 * - Total monthly and yearly costs (highlighted)
 * - Direct vs indirect cost breakdown
 * - Life energy cost (hours, days, work weeks)
 * - Future value projections (5, 10, 20 years)
 * - Cost breakdown by category
 * - Loan information (if applicable)
 *
 * Features:
 * - Impactful messaging for life energy cost
 * - Color-coded sections (primary, warning, success)
 * - Warning if actualHourlyWage is 0
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * <CarOwnershipSummary
 *   scenario={carScenario}
 *   actualHourlyWage={5000}
 * />
 * ```
 */
export function CarOwnershipSummary({
  scenario,
  actualHourlyWage = 0,
  className = '',
}: CarOwnershipSummaryProps) {
  const results = scenario.results;
  const hasWage = actualHourlyWage > 0;

  // Calculate life energy in different units for impactful messaging
  const hoursPerMonth = results.lifeEnergyHoursPerMonth;
  const hoursPerYear = results.lifeEnergyHoursPerYear;
  const daysPerYear = hoursPerYear / 24;
  const workWeeksPerYear = hoursPerYear / 40; // Assuming 40-hour work week

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Total Cost Highlight */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Mánaðarlegur kostnaður</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(results.totalMonthlyCost)} kr
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Árlegur kostnaður</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(results.totalYearlyCost)} kr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Direct vs Indirect Costs */}
        <Card>
          <CardHeader>
            <h4 className="font-semibold">Kostnaðarsamsetning</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Beinn kostnaður (eldsneyti, bílastæðagjöld, veggjöld)</span>
                <span className="font-medium">{formatCurrency(results.directMonthlyCost)} kr/mán</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Óbeinn kostnaður (afskriftir, tryggingar, viðhald)</span>
                <span className="font-medium">{formatCurrency(results.indirectMonthlyCost)} kr/mán</span>
              </div>
              {results.loanPaymentMonthly > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lánagreiðslur</span>
                  <span className="font-medium">{formatCurrency(results.loanPaymentMonthly)} kr/mán</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown Details */}
        <Card>
          <CardHeader>
            <h4 className="font-semibold">Sundurliðun kostnaðar</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.costBreakdown.map((item) => (
                <div key={item.category} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-xs text-gray-400">({item.percentage.toFixed(1)}%)</span>
                  </div>
                  <span className="font-medium text-sm">
                    {formatCurrency(item.monthlyCost)} kr/mán
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Life Energy Cost */}
        {!hasWage && (
          <Alert variant="warning">
            <p className="text-sm">
              Settu inn raunverulegt tímakaup í aðal reiknivélinni til að sjá lífsorku kostnað.
            </p>
          </Alert>
        )}

        {hasWage && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <h4 className="font-semibold text-yellow-800">Lífsorka kostnaður</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-yellow-700">
                    {hoursPerMonth.toFixed(1)} klst á mánuði
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Bíllinn kostar þig {hoursPerMonth.toFixed(1)} klst af lífsorku á mánuði
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-yellow-200">
                  <div>
                    <p className="text-sm text-gray-600">Á ári</p>
                    <p className="text-lg font-semibold text-yellow-700">
                      {hoursPerYear.toFixed(0)} klst
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dagar á ári</p>
                    <p className="text-lg font-semibold text-yellow-700">
                      {daysPerYear.toFixed(1)} dagar
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vinnuvikur á ári</p>
                    <p className="text-lg font-semibold text-yellow-700">
                      {workWeeksPerYear.toFixed(1)} vikur
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Future Value Impact */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <h4 className="font-semibold text-green-800">Fjárhagsleg áhrif (FI)</h4>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ef þú fjárfestir kostnaðinn í staðinn (7% árleg ávöxtun):
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Eftir 5 ár</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(results.futureValue5Years)} kr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Eftir 10 ár</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(results.futureValue10Years)} kr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Eftir 20 ár</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(results.futureValue20Years)} kr
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Þetta sýnir hversu mikið þú gætir átt ef þú fjárfestir mánaðarlegan bílakostnað í staðinn.
            </p>
          </CardContent>
        </Card>

        {/* Loan Information (if applicable) */}
        {scenario.inputs.hasFinancing && results.totalInterestPaid && results.totalLoanCost && (
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Upplýsingar um lán</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mánaðarleg greiðsla</span>
                  <span className="font-medium">{formatCurrency(results.loanPaymentMonthly)} kr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heildarvextir</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(results.totalInterestPaid)} kr
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heildargreiðslur</span>
                  <span className="font-medium">{formatCurrency(results.totalLoanCost)} kr</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
