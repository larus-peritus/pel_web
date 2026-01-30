'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import type { MealCostComparisonResults } from '@/types/calculator';

/**
 * Props for MealCostComparison component
 */
export interface MealCostComparisonProps {
  comparison: MealCostComparisonResults;
  actualHourlyWage: number;
  className?: string;
}

/**
 * MealCostComparison Component
 *
 * NEW MODEL: Shows the NET EXTRA cost of convenience food
 *
 * Key insight: When you eat out, you SAVE on home cooking costs.
 * Net extra cost = Cost of eating out - Saved home cooking cost
 *
 * Example: 2 restaurant dinners at 16,000 kr total
 *          But you save 2 home dinners at 7,000 kr
 *          Net extra cost = 9,000 kr
 */
export function MealCostComparison({
  comparison,
  actualHourlyWage,
  className,
}: MealCostComparisonProps) {
  const {
    eatingOutSummary,
    savedHomeCookingMonthly,
    netExtraCostMonthly,
    netExtraCostYearly,
    futureValue10Years,
    futureValue20Years,
    futureValue30Years,
    recommendation,
  } = comparison;

  const hasNetExtraCost = netExtraCostMonthly > 0;

  return (
    <Card variant="elevated" className={className}>
      <CardHeader className="bg-gradient-to-r from-warning-50 to-primary-50">
        <h2 className="text-xl font-bold text-neutral-800">Aukakostnaður þægindamatar</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Hversu mikið kostar að kaupa máltíðir í stað þess að elda heima?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main NET Extra Cost Display */}
        <div className="bg-primary-50 rounded-lg p-6 border-2 border-primary-300">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-600 mb-2">
              Nettó aukakostnaður þægindamatar
            </p>
            <p className="text-4xl font-bold text-primary-700">
              {formatCurrency(netExtraCostMonthly)}/mán
            </p>
            <p className="text-lg text-neutral-600 mt-1">
              ({formatCurrency(netExtraCostYearly)}/ári)
            </p>
            {actualHourlyWage > 0 && (
              <p className="text-sm text-warning-700 mt-2">
                = {formatLifeEnergy(netExtraCostMonthly / actualHourlyWage)} af lífsorku
              </p>
            )}
          </div>
        </div>

        {/* Breakdown: How we calculated this */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800">Útreikningur</h3>

          {/* Eating out cost */}
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-800">Þægindamatur keyptur</p>
              <p className="text-xs text-neutral-500">Veitingastaðir, kaffi, skyndibiti</p>
            </div>
            <p className="text-xl font-bold text-neutral-800">
              {formatCurrency(eatingOutSummary.monthlyCost)}
            </p>
          </div>

          {/* Saved home cooking cost */}
          <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg border border-success-200">
            <div>
              <p className="font-medium text-success-800">Sparað á heimaeldun</p>
              <p className="text-xs text-success-600">Máltíðir sem þú þarft ekki elda heima</p>
            </div>
            <p className="text-xl font-bold text-success-700">
              − {formatCurrency(savedHomeCookingMonthly)}
            </p>
          </div>

          {/* Equals net extra cost */}
          <div className="flex justify-between items-center p-3 bg-primary-100 rounded-lg border-2 border-primary-300">
            <div>
              <p className="font-medium text-primary-800">= Nettó aukakostnaður</p>
              <p className="text-xs text-primary-600">Þetta er raunverulegur aukakostnaður</p>
            </div>
            <p className="text-xl font-bold text-primary-700">
              {formatCurrency(netExtraCostMonthly)}
            </p>
          </div>
        </div>

        {/* Future Value Projections */}
        {hasNetExtraCost && actualHourlyWage > 0 && (
          <div className="space-y-4">
            <div className="border-t border-neutral-200 pt-4">
              <h3 className="text-lg font-semibold text-neutral-700 mb-3">
                Ef þú fjárfestir þennan mismun
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Ef þú sparar {formatCurrency(netExtraCostMonthly)} á mánuði og fjárfestir
                með 7% árlegri ávöxtun:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 10 years */}
                <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    Eftir 10 ár
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {formatCurrency(futureValue10Years)}
                  </p>
                </div>

                {/* 20 years */}
                <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    Eftir 20 ár
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {formatCurrency(futureValue20Years)}
                  </p>
                </div>

                {/* 30 years */}
                <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    Eftir 30 ár
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {formatCurrency(futureValue30Years)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        <Alert
          variant={hasNetExtraCost ? 'info' : 'success'}
        >
          <p className="text-sm font-medium">{recommendation}</p>
        </Alert>
      </CardContent>
    </Card>
  );
}
