'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/lib/utils/formatters';
import { CHILDCARE_CATEGORY_LABELS } from '@/types/childcare';
import type { ChildcareCategory } from '@/types/childcare';

/**
 * CategoryBreakdown - Summary display component
 *
 * Displays:
 * - Total by category (sorted by cost, highest first)
 * - Monthly and yearly totals
 * - Life energy cost
 * - Visual progress bars showing relative costs
 */
export function CategoryBreakdown() {
  const { childcareSummary, results } = useCalculator();

  if (!childcareSummary || childcareSummary.byCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Yfirlit eftir flokkum</h3>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-neutral-500">
            <p>Engar færslur enn. Bættu við kostnaði hér að ofan til að sjá yfirlit.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get category colors
  const getCategoryColor = (category: ChildcareCategory): string => {
    const colors: Record<ChildcareCategory, string> = {
      daycare: 'bg-blue-500',
      afterschool: 'bg-green-500',
      activities: 'bg-purple-500',
      tutoring: 'bg-orange-500',
      university: 'bg-pink-500',
    };
    return colors[category] || 'bg-neutral-500';
  };

  // Find max yearly cost for scaling bars
  const maxYearly = Math.max(...childcareSummary.byCategory.map(cat => cat.totalYearly));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Yfirlit eftir flokkum</h3>
        <p className="text-sm text-neutral-600">Sundurliðun kostnaðar eftir tegundum</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Summary */}
        <div className="rounded-lg bg-primary-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Alls á mánuði</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(childcareSummary.totalMonthlyAverage)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Alls á ári</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(childcareSummary.totalYearly)}
              </p>
            </div>
          </div>

          {/* Life Energy */}
          {results?.actualHourlyWage && childcareSummary.lifeEnergyHoursPerMonth > 0 && (
            <div className="mt-4 border-t border-primary-200 pt-4">
              <p className="text-sm text-neutral-600">Lífsorka</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-primary-600">
                  {Math.round(childcareSummary.lifeEnergyHoursPerMonth)} klst/mán
                </p>
                <p className="text-sm text-neutral-600">
                  ({Math.round(childcareSummary.lifeEnergyHoursPerYear)} klst/ár)
                </p>
              </div>
              <p className="mt-1 text-xs text-neutral-600">
                Á {formatCurrency(results.actualHourlyWage)}/klst
              </p>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neutral-700">Sundurliðun</h4>
          {childcareSummary.byCategory.map((category) => {
            const percentage = maxYearly > 0 ? (category.totalYearly / maxYearly) * 100 : 0;

            return (
              <div key={category.category} className="space-y-2">
                {/* Category header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${getCategoryColor(category.category)}`}
                    ></div>
                    <span className="font-medium text-neutral-900">{category.label}</span>
                    <Badge variant="neutral" size="sm">
                      {category.count} {category.count === 1 ? 'liður' : 'liðir'}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {formatCurrency(category.totalYearly)}/ár
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full transition-all duration-300 ${getCategoryColor(category.category)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Monthly cost */}
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>{formatCurrency(category.totalMonthly)}/mán</span>
                  <span>{percentage.toFixed(1)}% af heildar</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        {childcareSummary.byCategory.length > 0 && (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <h4 className="text-sm font-medium text-neutral-700">Innsýn</h4>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600">
              <li>
                Stærsti kostnaðurflokkur:{' '}
                <span className="font-medium text-neutral-900">
                  {childcareSummary.byCategory[0].label}
                </span>{' '}
                ({formatCurrency(childcareSummary.byCategory[0].totalYearly)}/ár)
              </li>
              {childcareSummary.byCategory.length > 1 && (
                <li>
                  Minnsti kostnaðurflokkur:{' '}
                  <span className="font-medium text-neutral-900">
                    {childcareSummary.byCategory[childcareSummary.byCategory.length - 1].label}
                  </span>{' '}
                  (
                  {formatCurrency(
                    childcareSummary.byCategory[childcareSummary.byCategory.length - 1].totalYearly
                  )}
                  /ár)
                </li>
              )}
              {results?.actualHourlyWage && childcareSummary.lifeEnergyHoursPerYear > 0 && (
                <li>
                  Þú þarft að vinna{' '}
                  <span className="font-medium text-primary-600">
                    {Math.round(childcareSummary.lifeEnergyHoursPerYear)} klukkustundir
                  </span>{' '}
                  á ári til að standa straum af þessum kostnaði
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
