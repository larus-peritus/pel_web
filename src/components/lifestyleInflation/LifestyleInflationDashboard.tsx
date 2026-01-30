'use client';

import React, { useState } from 'react';
import type { Period, InflationAnalysis } from '@/types/calculator';
import { generatePeriodId, comparePeriods } from '@/lib/utils/periodHelpers';
import { analyzeInflation } from '@/lib/calculations/lifestyleInflation';
import { PeriodForm } from './PeriodForm';
import { PeriodList } from './PeriodList';
import { InflationScoreCard } from './InflationScoreCard';
import { CategoryChangesTable } from './CategoryChangesTable';
import { FIImpactCard } from './FIImpactCard';
import { AlertsList } from './AlertsList';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface LifestyleInflationDashboardProps {
  periods: Period[];
  actualHourlyWage?: number;
  onAddPeriod: (period: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePeriod: (id: string, updates: Partial<Period>) => void;
  onDeletePeriod: (id: string) => void;
}

/**
 * Main dashboard for Lifestyle Inflation Detector
 * Manages period input and displays analysis results
 */
export function LifestyleInflationDashboard({
  periods,
  actualHourlyWage,
  onAddPeriod,
  onUpdatePeriod,
  onDeletePeriod,
}: LifestyleInflationDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  // Sort periods to get the two most recent for comparison
  const sortedPeriods = [...periods].sort(comparePeriods);
  const currentPeriod = sortedPeriods[0] || null;
  const comparisonPeriod = sortedPeriods[1] || null;

  // Analyze inflation if we have at least 2 periods
  const analysis: InflationAnalysis | null =
    currentPeriod && comparisonPeriod
      ? analyzeInflation(currentPeriod, comparisonPeriod, actualHourlyWage)
      : null;

  const handleSave = (data: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPeriod) {
      // Update existing period
      onUpdatePeriod(editingPeriod.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Add new period
      onAddPeriod(data);
    }

    setShowForm(false);
    setEditingPeriod(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPeriod(null);
  };

  const handleEdit = (period: Period) => {
    setEditingPeriod(period);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Warning if no actual hourly wage */}
      {(!actualHourlyWage || actualHourlyWage === 0) && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <span className="text-yellow-600">ℹ️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Raunverulegt tímakaup vantar
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Til að sjá lífsorku-áhrif þarftu að fylla fyrst út Raunverulega
                  Tímakaups reiknivélina. Þú getur samt skráð tímabil núna.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Management Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Tímabil ({periods.length})
          </h3>
          {!showForm && (
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              + Bæta við tímabili
            </Button>
          )}
        </div>

        {/* Show form or list */}
        {showForm ? (
          <PeriodForm
            period={editingPeriod || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <PeriodList
            periods={periods}
            onEdit={handleEdit}
            onDelete={onDeletePeriod}
          />
        )}
      </div>

      {/* Analysis Results Section */}
      {analysis ? (
        <div className="space-y-8">
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Greining: {currentPeriod.name} á móti {comparisonPeriod.name}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Score and Category Changes */}
              <div className="space-y-6">
                {/* Inflation Score */}
                <InflationScoreCard
                  score={analysis.lifestyleCreep}
                  scoreLevel={analysis.inflationScore}
                />

                {/* Category Changes */}
                <CategoryChangesTable
                  changes={analysis.categoryChanges}
                  actualHourlyWage={actualHourlyWage}
                />
              </div>

              {/* Right: FI Impact and Alerts */}
              <div className="space-y-6">
                {/* FI Impact */}
                <FIImpactCard impact={analysis.fiImpact} />

                {/* Alerts and Suggestions */}
                <AlertsList alerts={analysis.alerts} />
              </div>
            </div>
          </div>
        </div>
      ) : periods.length >= 2 ? (
        // We have 2+ periods but no analysis (shouldn't happen)
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-lg font-semibold text-yellow-800 mb-2">
              Greining mistókst
            </p>
            <p className="text-sm text-gray-600">
              Ekki tókst að greina gögnin. Vinsamlegast athugaðu tímabilin þín.
            </p>
          </CardContent>
        </Card>
      ) : (
        // Empty state: Need at least 2 periods
        <Card className="border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Bættu við tveimur tímabilum til að byrja
            </p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Lífsstílsverðbólgugreining krefst samanburðar á milli tímabila.
              Bættu við að minnsta kosti tveimur tímabilum (t.d. "Janúar 2024" og "Janúar 2025")
              til að sjá hvernig útgjöldin þín hafa breyst.
            </p>

            {periods.length === 1 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Þú hefur skráð 1 tímabil. Bættu við einu til viðbótar!
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                >
                  + Bæta við öðru tímabili
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
