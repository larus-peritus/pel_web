'use client';

/**
 * Comparison Section Component
 *
 * Complete comparison section that orchestrates all comparison components.
 * Features:
 * - Section header
 * - Tier toggle (if expense baseline exists)
 * - Responsive: table on desktop (>768px), cards on mobile
 * - Export comparison button (optional)
 * - Link to expense baseline if missing
 *
 * Task 4.4: Create ComparisonSection Component
 * Epic 4: Comparison Table
 * FIRE Type Explorer Feature
 */

import { useState, useEffect } from 'react';
import type { FIRECalculation, FIRETypeId, UserFinancialInputs } from '@/types/fireTypes';
import type { ExpenseTier } from '@/types/expenseBaseline';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonCards } from './ComparisonCards';
import { TierToggle } from './TierToggle';
import { Alert } from '@/components/ui/Alert';

export interface ComparisonSectionProps {
  calculations: {
    leanfire: FIRECalculation;
    regularfire: FIRECalculation;
    coastfire: FIRECalculation;
    baristafire: FIRECalculation;
    fatfire: FIRECalculation;
  };
  userInputs: UserFinancialInputs;
  selectedType: FIRETypeId | null;
  onSelectType: (typeId: FIRETypeId) => void;
  onTierChange?: (tier: ExpenseTier) => void;
  hasExpenseBaseline?: boolean;
  onNavigateToBaseline?: () => void;
}

export function ComparisonSection({
  calculations,
  userInputs,
  selectedType,
  onSelectType,
  onTierChange,
  hasExpenseBaseline = true,
  onNavigateToBaseline,
}: ComparisonSectionProps) {
  const [activeTier, setActiveTier] = useState<ExpenseTier>('comfortable');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle tier change
  const handleTierChange = (tier: ExpenseTier) => {
    setActiveTier(tier);
    onTierChange?.(tier);
  };

  // Check if tiers are different
  const hasDifferentTiers =
    userInputs.monthlyExpenses.barebones !== userInputs.monthlyExpenses.comfortable ||
    userInputs.monthlyExpenses.comfortable !== userInputs.monthlyExpenses.deluxe;

  // Export comparison data as JSON
  const handleExport = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      activeTier,
      calculations: Object.entries(calculations).map(([typeId, calc]) => ({
        fireType: typeId,
        fiNumber: calc.fiNumber,
        monthlyExpenses: calc.monthlyExpenses,
        yearsToFI: calc.yearsToFI,
        targetAge: calc.targetAge,
        effortLevel: calc.effortLevel,
        feasibility: calc.feasibility,
        currentProgress: calc.currentProgress,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fire-samanburður-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            FIRE samanburður
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Bera saman allar FIRE tegundir hlið við hlið
          </p>
        </div>

        {/* Export button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          aria-label="Sækja samanburð sem JSON skrá"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Sækja samanburð
        </Button>
      </div>

      {/* Alert if no expense baseline */}
      {!hasExpenseBaseline && (
        <Alert variant="info">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Engin útgjaldaprofíll til staðar
              </h4>
              <p className="text-sm text-gray-700">
                Þú hefur ekki búið til útgjaldaprofíl ennþá. Búðu til grunnútgjöld til að fá nákvæmari samanburð.
              </p>
            </div>
            {onNavigateToBaseline && (
              <Button
                variant="primary"
                size="sm"
                onClick={onNavigateToBaseline}
              >
                Búa til profíl
              </Button>
            )}
          </div>
        </Alert>
      )}

      {/* Tier toggle (if applicable) */}
      {hasExpenseBaseline && hasDifferentTiers && (
        <Card>
          <CardContent className="py-4">
            <TierToggle
              activeTier={activeTier}
              onTierChange={handleTierChange}
              tiers={userInputs.monthlyExpenses}
            />
          </CardContent>
        </Card>
      )}

      {/* Comparison table/cards */}
      <div>
        {isMobile ? (
          // Mobile: cards
          <ComparisonCards
            calculations={calculations}
            selectedType={selectedType}
            onSelectType={onSelectType}
          />
        ) : (
          // Desktop: table
          <ComparisonTable
            calculations={calculations}
            selectedType={selectedType}
            onSelectType={onSelectType}
          />
        )}
      </div>

      {/* Insights card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Helstu atriði
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Fastest FIRE */}
          {(() => {
            const fastest = Object.entries(calculations).reduce((min, [id, calc]) => {
              if (calc.yearsToFI === null) return min;
              if (min.yearsToFI === null || calc.yearsToFI < min.yearsToFI) {
                return { id: id as FIRETypeId, yearsToFI: calc.yearsToFI };
              }
              return min;
            }, { id: 'regularfire' as FIRETypeId, yearsToFI: null as number | null });

            return fastest.yearsToFI !== null && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-green-900">
                    Fljótasta leiðin
                  </div>
                  <div className="text-sm text-green-800">
                    {calculations[fastest.id].fireTypeId.toUpperCase()} er fljótasta leiðin ({fastest.yearsToFI.toFixed(1)} ár)
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Easiest effort */}
          {(() => {
            const easiest = Object.entries(calculations).reduce((min, [id, calc]) => {
              const effortNum = calc.effortLevel === 'low' ? 0 : calc.effortLevel === 'moderate' ? 1 : calc.effortLevel === 'high' ? 2 : 3;
              const minEffortNum = min.effort === 'low' ? 0 : min.effort === 'moderate' ? 1 : min.effort === 'high' ? 2 : 3;

              if (effortNum < minEffortNum) {
                return { id: id as FIRETypeId, effort: calc.effortLevel };
              }
              return min;
            }, { id: 'regularfire' as FIRETypeId, effort: calculations.regularfire.effortLevel });

            return (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-blue-900">
                    Auðveldasta leiðin
                  </div>
                  <div className="text-sm text-blue-800">
                    {calculations[easiest.id].fireTypeId.toUpperCase()} krefst minnstu fórnar
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Highest nest egg */}
          {(() => {
            const highest = Object.entries(calculations).reduce((max, [id, calc]) => {
              if (calc.fiNumber > max.fiNumber) {
                return { id: id as FIRETypeId, fiNumber: calc.fiNumber };
              }
              return max;
            }, { id: 'regularfire' as FIRETypeId, fiNumber: calculations.regularfire.fiNumber });

            return (
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-purple-900">
                    Stærsta markmiðið
                  </div>
                  <div className="text-sm text-purple-800">
                    {calculations[highest.id].fireTypeId.toUpperCase()} þarfnast mest sparnaðar
                  </div>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
