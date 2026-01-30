'use client';

/**
 * Comparison Cards Component (Mobile)
 *
 * Mobile-optimized card-based comparison of all FIRE types.
 * Features:
 * - Stacked cards (one per FIRE type)
 * - Same data as table but card layout
 * - Tap to expand for more details
 * - Visual effort indicators
 * - Touch-friendly interaction
 *
 * Task 4.2: Create ComparisonCards Component (Mobile)
 * Epic 4: Comparison Table
 * FIRE Type Explorer Feature
 */

import { useState } from 'react';
import type { FIRECalculation, FIRETypeId } from '@/types/fireTypes';
import { FIRE_TYPE_DEFINITIONS, getFIRETypeColors } from '@/lib/constants/fireTypes';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export interface ComparisonCardsProps {
  calculations: {
    leanfire: FIRECalculation;
    regularfire: FIRECalculation;
    coastfire: FIRECalculation;
    baristafire: FIRECalculation;
    fatfire: FIRECalculation;
  };
  selectedType: FIRETypeId | null;
  onSelectType: (typeId: FIRETypeId) => void;
}

/**
 * Get Icelandic effort label
 */
function getEffortLabel(effort: string): string {
  switch (effort) {
    case 'low': return 'Lítil';
    case 'moderate': return 'Hófleg';
    case 'high': return 'Mikil';
    case 'extreme': return 'Öfgafull';
    default: return 'Hófleg';
  }
}

/**
 * Effort indicator progress bar
 */
function EffortIndicator({ level }: { level: string }) {
  const effortNum = level === 'low' ? 0 : level === 'moderate' ? 1 : level === 'high' ? 2 : 3;
  const percentage = ((effortNum + 1) / 4) * 100;

  const colorClass =
    effortNum === 0 ? 'bg-green-500'
    : effortNum === 1 ? 'bg-yellow-500'
    : effortNum === 2 ? 'bg-orange-500'
    : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={effortNum + 1}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Erfiðleikastig ${effortNum + 1} af 4`}
        />
      </div>
    </div>
  );
}

/**
 * Individual FIRE type card
 */
function FIRETypeCard({
  typeId,
  calculation,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
}: {
  typeId: FIRETypeId;
  calculation: FIRECalculation;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
}) {
  const definition = FIRE_TYPE_DEFINITIONS.find(d => d.id === typeId);
  const colorScheme = getFIRETypeColors(typeId);

  if (!definition) return null;

  // Calculate savings rate if possible
  const savingsRate = calculation.yearsToFI !== null && calculation.yearsToFI > 0
    ? (calculation.amountRemaining / (calculation.yearsToFI * 12)) / calculation.monthlyExpenses * 100
    : null;

  return (
    <Card
      className={`
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary-500 shadow-md' : ''}
      `}
    >
      {/* Card header - Always visible */}
      <CardHeader
        onClick={onSelect}
        className={`
          cursor-pointer hover:bg-gray-50 transition-colors
          ${colorScheme.bg} ${colorScheme.border} border-l-4
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-hidden="true">
              {definition.icon}
            </span>
            <div>
              <h3 className={`text-lg font-semibold ${colorScheme.text}`}>
                {definition.nameIs}
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                {definition.tagline}
              </p>
            </div>
          </div>
          {isSelected && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full flex-shrink-0">
              Valið
            </span>
          )}
        </div>
      </CardHeader>

      {/* Card content - Key metrics always visible */}
      <CardContent className="space-y-4">
        {/* Primary metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Nest Egg */}
          <div>
            <div className="text-xs text-gray-600 mb-1">Nest Egg</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(calculation.fiNumber)}
            </div>
          </div>

          {/* Years to FI */}
          <div>
            <div className="text-xs text-gray-600 mb-1">Ár til FIRE</div>
            <div className="text-lg font-semibold text-gray-900">
              {calculation.yearsToFI !== null
                ? `${formatNumber(calculation.yearsToFI, 1)} ár`
                : 'Ekki mögulegt'}
            </div>
          </div>
        </div>

        {/* Effort indicator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Erfiðleiki</span>
            <span className="text-xs font-medium text-gray-700">
              {getEffortLabel(calculation.effortLevel)}
            </span>
          </div>
          <EffortIndicator level={calculation.effortLevel} />
        </div>

        {/* Expand/collapse for more details */}
        <button
          onClick={onToggleExpand}
          className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1 py-2"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Sjá minna
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Sjá meira
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Expanded details */}
        {isExpanded && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {/* Monthly expenses */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Útgjöld/mán:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(calculation.monthlyExpenses)}
              </span>
            </div>

            {/* Savings rate */}
            {savingsRate !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sparnaðarhlutfall:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(savingsRate, 1)}%
                </span>
              </div>
            )}

            {/* Current progress */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Framvinda:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(calculation.currentProgress, 1)}%
              </span>
            </div>

            {/* Amount remaining */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Eftirstöðvar:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(calculation.amountRemaining)}
              </span>
            </div>

            {/* Target age */}
            {calculation.targetAge !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Aldur við FIRE:</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(calculation.targetAge)} ára
                </span>
              </div>
            )}

            {/* Type-specific info */}
            {calculation.coastData && (
              <div className="mt-4 p-3 bg-cyan-50 rounded-lg">
                <div className="text-xs font-semibold text-cyan-900 mb-2">
                  CoastFIRE upplýsingar
                </div>
                <div className="space-y-1 text-xs text-cyan-800">
                  <div className="flex justify-between">
                    <span>Coast FI númer:</span>
                    <span className="font-medium">
                      {formatCurrency(calculation.coastData.coastFINumber)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Í coast mode:</span>
                    <span className="font-medium">
                      {calculation.coastData.isCoasting ? 'Já' : 'Nei'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {calculation.baristaData && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-xs font-semibold text-purple-900 mb-2">
                  BaristaFIRE upplýsingar
                </div>
                <div className="space-y-1 text-xs text-purple-800">
                  <div className="flex justify-between">
                    <span>Hlutavinna þörf:</span>
                    <span className="font-medium">
                      {formatCurrency(calculation.baristaData.partTimeIncomeNeeded)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sparnaður:</span>
                    <span className="font-medium">
                      {formatCurrency(calculation.baristaData.savings)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Main comparison cards container
 */
export function ComparisonCards({
  calculations,
  selectedType,
  onSelectType,
}: ComparisonCardsProps) {
  const [expandedCard, setExpandedCard] = useState<FIRETypeId | null>(null);

  const handleToggleExpand = (typeId: FIRETypeId) => {
    setExpandedCard(expandedCard === typeId ? null : typeId);
  };

  const fireOrder: FIRETypeId[] = ['leanfire', 'regularfire', 'coastfire', 'baristafire', 'fatfire'];

  return (
    <div className="space-y-4">
      {fireOrder.map((typeId) => (
        <FIRETypeCard
          key={typeId}
          typeId={typeId}
          calculation={calculations[typeId]}
          isSelected={selectedType === typeId}
          isExpanded={expandedCard === typeId}
          onSelect={() => onSelectType(typeId)}
          onToggleExpand={() => handleToggleExpand(typeId)}
        />
      ))}

      {/* Accessibility announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedType && `${FIRE_TYPE_DEFINITIONS.find(d => d.id === selectedType)?.nameIs} valið`}
      </div>
    </div>
  );
}
