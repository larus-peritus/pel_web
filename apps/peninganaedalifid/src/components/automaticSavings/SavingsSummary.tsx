'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import type { SavingsResults } from '@/types/savings';

interface SavingsSummaryProps {
  results: SavingsResults;
  actualHourlyWage?: number;
  years: number;
  monthlyAmount: number;
}

/**
 * Display savings calculation results
 *
 * Shows:
 * - Future value with principal/growth breakdown
 * - Life energy metrics (if wage available)
 * - Key insight message
 * - Real value (if inflation adjustment enabled)
 */
export function SavingsSummary({
  results,
  actualHourlyWage,
  years,
  monthlyAmount,
}: SavingsSummaryProps) {
  const hasLifeEnergy = results.lifeEnergyContributed !== undefined;

  // Generate key insight message
  const keyInsight = hasLifeEnergy && results.freedomMonths
    ? `Með því að sjálfvirka ${formatCurrency(monthlyAmount)} á mánuði muntu hafa ${formatNumber(results.freedomMonths, 1)} mánuði af frelsi eftir ${years} ár`
    : `Með því að sjálfvirka ${formatCurrency(monthlyAmount)} á mánuði muntu hafa ${formatCurrency(results.futureValue)} eftir ${years} ár`;

  return (
    <div className="space-y-4">
      {/* Future Value Card */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Framtíðarverðmæti eftir {years} ár
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(results.futureValue)}
              </p>
              {results.realValue && (
                <p className="text-sm text-neutral-600 mt-1">
                  Raunverðmæti (leiðrétt fyrir verðbólgu): {formatCurrency(results.realValue)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200">
              <div>
                <p className="text-sm text-neutral-600">Heildarinnborganir</p>
                <p className="text-lg font-semibold">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Heildarvöxtur</p>
                <p className="text-lg font-semibold text-success-600">
                  {formatCurrency(results.totalGrowth)} ({formatNumber(results.growthPercentage, 1)}%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Energy Card (conditional) */}
      {hasLifeEnergy ? (
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold">Lífsorka áhrif</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Klukkustundir settar inn</p>
                <p className="text-lg font-semibold">{formatNumber(results.lifeEnergyContributed!, 0)} klst</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Klukkustundir unnar óbeint</p>
                <p className="text-lg font-semibold text-success-600">
                  {formatNumber(results.lifeEnergyEarnedPassively!, 0)} klst
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-neutral-600">Heildar lífsorku verðmæti</p>
                <p className="text-xl font-bold text-primary-600">
                  {formatNumber(results.totalLifeEnergy!, 0)} klst
                </p>
              </div>
              {results.freedomMonths && (
                <div className="col-span-2 pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600">Frelsismánuðir</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatNumber(results.freedomMonths, 1)} mánuðir
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert variant="info">
          <div>
            <p className="font-medium">Fylltu fyrst út Tímakaups reiknivélina til að sjá lífsorku áhrif</p>
            <p className="text-sm mt-1">
              Farðu á &quot;Raunverulegt Tímakaup&quot; flipann til að reikna út tímakaup þitt.
            </p>
          </div>
        </Alert>
      )}

      {/* Key Insight */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="py-4">
          <p className="text-lg font-medium text-neutral-900">
            {keyInsight}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
