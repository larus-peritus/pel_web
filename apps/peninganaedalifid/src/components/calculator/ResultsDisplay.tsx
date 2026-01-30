'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

/**
 * Main results display component
 * Shows actual hourly wage prominently with comparison to nominal wage
 */
export function ResultsDisplay() {
  const { results, isHydrated } = useCalculator();

  // Loading state
  if (!isHydrated) {
    return (
      <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-white">
        <CardContent className="py-8">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mx-auto mb-4" />
            <div className="h-12 bg-neutral-200 rounded w-32 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // No results state (no income entered)
  if (!results) {
    return (
      <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-white">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-lg text-neutral-600">
              Sláðu inn tekjur til að sjá raunverulegt tímakaup þitt
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { nominalHourlyWage, actualHourlyWage, percentageReduction } = results;

  // Determine badge variant based on reduction
  const badgeVariant = percentageReduction > 30
    ? 'danger'
    : percentageReduction >= 15
      ? 'warning'
      : 'success';

  return (
    <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-white">
      <CardHeader>
        <h2 className="text-lg font-semibold text-neutral-700 text-center">
          Raunverulegt tímakaup þitt
        </h2>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {/* Main wage display */}
        <div className="space-y-1">
          <p className="text-5xl md:text-6xl font-bold text-primary-700 transition-all duration-300">
            {formatCurrency(actualHourlyWage)}
          </p>
          <p className="text-sm text-neutral-500">á klukkustund</p>
        </div>

        {/* Comparison row */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="text-center">
            <p className="text-sm text-neutral-500">Upphaflegt tímakaup</p>
            <p className="text-xl font-semibold text-neutral-700">
              {formatCurrency(nominalHourlyWage)}
            </p>
          </div>

          <Badge variant={badgeVariant} size="md">
            -{percentageReduction.toFixed(1)}%
          </Badge>
        </div>

        {/* Insight message */}
        {percentageReduction > 0 && (
          <p className="text-sm text-neutral-600 pt-2">
            Vinnukostnaður og aukatími draga úr launum um{' '}
            <span className="font-semibold text-danger-600">
              {formatCurrency(nominalHourlyWage - actualHourlyWage)}
            </span>
            {' '}á klukkustund
          </p>
        )}
      </CardContent>
    </Card>
  );
}
