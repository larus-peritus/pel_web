/**
 * QuickStats - Display key statistics in card format
 *
 * Shows:
 * - Total monthly expenses
 * - Total annual expenses
 * - Life energy total (if AWH available)
 * - Top category (highest spending)
 */

import React from 'react';
import type { CurrentExpenseResults } from '@/types/currentExpenses';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

export interface QuickStatsProps {
  results: CurrentExpenseResults;
  actualHourlyWage: number | null;
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  colorClass?: string;
}

function StatCard({ icon, label, value, subtitle, colorClass = 'text-primary-600' }: StatCardProps) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 mb-1">
              {label}
            </p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className="text-3xl ml-4">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * QuickStats - Four stat cards with key expense metrics
 */
export function QuickStats({
  results,
  actualHourlyWage,
}: QuickStatsProps) {
  // Find top category
  const topCategory = results.categoryBreakdown.length > 0
    ? results.categoryBreakdown[0]
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Monthly Total */}
      <StatCard
        icon="📊"
        label="Mánaðarútgjöld"
        value={formatCurrency(results.totalMonthly)}
        colorClass="text-primary-600"
      />

      {/* Annual Total */}
      <StatCard
        icon="📅"
        label="Ársútgjöld"
        value={formatCurrency(results.totalAnnual)}
        colorClass="text-blue-600"
      />

      {/* Life Energy Total (if AWH available) */}
      {results.lifeEnergy && actualHourlyWage ? (
        <StatCard
          icon="⏰"
          label="Lífsorka"
          value={`${formatNumber(results.lifeEnergy.totalMonthlyHours, 1)} klst`}
          subtitle={`${formatNumber(results.lifeEnergy.totalAnnualHours, 0)} klst/ár`}
          colorClass="text-amber-600"
        />
      ) : (
        <StatCard
          icon="⏰"
          label="Lífsorka"
          value="—"
          subtitle="Reiknaðu tímakaup"
          colorClass="text-neutral-400"
        />
      )}

      {/* Top Category */}
      {topCategory ? (
        <StatCard
          icon={topCategory.categoryIcon}
          label="Stærsti flokkur"
          value={formatCurrency(topCategory.total)}
          subtitle={`${topCategory.categoryName} (${formatNumber(topCategory.percentage, 1)}%)`}
          colorClass="text-green-600"
        />
      ) : (
        <StatCard
          icon="📦"
          label="Stærsti flokkur"
          value="—"
          subtitle="Engin gögn"
          colorClass="text-neutral-400"
        />
      )}
    </div>
  );
}
