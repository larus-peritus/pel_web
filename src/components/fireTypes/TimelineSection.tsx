'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TimelineVisualization } from './TimelineVisualization';
import type { FIRETimeline, FIRETypeId, UserFinancialInputs } from '@/types/fireTypes';

/**
 * TimelineSection Props
 */
export interface TimelineSectionProps {
  /**
   * Timelines for all FIRE types
   */
  timelines: Partial<Record<FIRETypeId, FIRETimeline>> | null;

  /**
   * User's financial inputs (for current age)
   */
  userInputs: UserFinancialInputs | null;

  /**
   * Selected FIRE types to display
   */
  selectedTypes?: FIRETypeId[];

  /**
   * Callback when user wants to adjust inputs
   */
  onAdjustInputs?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Scenario type for completion estimates
 */
type Scenario = 'optimistic' | 'realistic' | 'pessimistic';

/**
 * TimelineSection - Section component with timeline visualization
 *
 * Features:
 * - Section header "Tímalína til FIRE"
 * - TimelineVisualization component
 * - Completion estimates (optimistic/realistic/pessimistic)
 * - Help text explaining the timeline
 * - Link to adjust inputs
 * - Empty state if no calculations
 * - Loading state
 *
 * @example
 * ```tsx
 * <TimelineSection
 *   timelines={{
 *     leanfire: leanTimeline,
 *     regularfire: regularTimeline,
 *     fatfire: fatTimeline,
 *   }}
 *   userInputs={inputs}
 *   selectedTypes={['regularfire']}
 *   onAdjustInputs={() => navigateToInputs()}
 * />
 * ```
 */
export function TimelineSection({
  timelines,
  userInputs,
  selectedTypes,
  onAdjustInputs,
  className,
}: TimelineSectionProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('realistic');

  // Empty state
  if (!timelines || !userInputs) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <h2 className="text-2xl font-bold text-neutral-900">Tímalína til FIRE</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Sjá þína leið til fjármálafrelsis á sjónrænan hátt
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-neutral-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Engin tímalína til að sýna
            </h3>
            <p className="text-sm text-neutral-600 mb-4 max-w-md">
              Sláðu inn fjárhagsupplýsingar þínar til að sjá áætlaða tímalínu til FIRE markmiðs.
            </p>
            {onAdjustInputs && (
              <button
                type="button"
                onClick={onAdjustInputs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Slá inn upplýsingar
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate completion estimates for selected types
  const getCompletionEstimates = () => {
    const estimates: Record<Scenario, { years: number; age: number } | null> = {
      optimistic: null,
      realistic: null,
      pessimistic: null,
    };

    const typesToCheck = selectedTypes || (Object.keys(timelines) as FIRETypeId[]);

    // Find earliest (optimistic), middle (realistic), and latest (pessimistic)
    const completionYears: number[] = [];

    typesToCheck.forEach((typeId) => {
      const timeline = timelines[typeId];
      if (!timeline) return;

      const finalMilestone = timeline.milestones[timeline.milestones.length - 1];
      if (finalMilestone.yearsFromNow !== null && !finalMilestone.isReached) {
        completionYears.push(finalMilestone.yearsFromNow);
      }
    });

    if (completionYears.length > 0) {
      completionYears.sort((a, b) => a - b);

      // Optimistic: earliest
      estimates.optimistic = {
        years: completionYears[0],
        age: userInputs.currentAge + completionYears[0],
      };

      // Realistic: median
      const medianIndex = Math.floor(completionYears.length / 2);
      estimates.realistic = {
        years: completionYears[medianIndex],
        age: userInputs.currentAge + completionYears[medianIndex],
      };

      // Pessimistic: latest
      estimates.pessimistic = {
        years: completionYears[completionYears.length - 1],
        age: userInputs.currentAge + completionYears[completionYears.length - 1],
      };
    }

    return estimates;
  };

  const estimates = getCompletionEstimates();

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Tímalína til FIRE</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Sjá þína leið til fjármálafrelsis á sjónrænan hátt
            </p>
          </div>

          {onAdjustInputs && (
            <button
              type="button"
              onClick={onAdjustInputs}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Breyta
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Completion estimates */}
        {Object.values(estimates).some((e) => e !== null) && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Áætlaður tími til markmiðs
            </h3>
            <div className="flex gap-2 mb-3">
              {(['optimistic', 'realistic', 'pessimistic'] as Scenario[]).map((scenario) => {
                const estimate = estimates[scenario];
                if (!estimate) return null;

                const labels = {
                  optimistic: 'Bjartsýn',
                  realistic: 'Raunhæf',
                  pessimistic: 'Varfærn',
                };

                return (
                  <button
                    key={scenario}
                    type="button"
                    onClick={() => setSelectedScenario(scenario)}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg border-2 transition-all',
                      selectedScenario === scenario
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    )}
                  >
                    <div className="text-xs font-medium mb-0.5">{labels[scenario]}</div>
                    <div className="text-sm font-bold">
                      {estimate.years < 1
                        ? `${Math.round(estimate.years * 12)} mán`
                        : `${Math.round(estimate.years)} ár`}
                    </div>
                  </button>
                );
              })}
            </div>

            {estimates[selectedScenario] && (
              <p className="text-sm text-neutral-600">
                {selectedScenario === 'optimistic' && (
                  <>
                    Með bestu mögulegu leiðinni (<strong>{selectedTypes?.[0] || 'LeanFIRE'}</strong>) gætirðu
                    náð FIRE eftir{' '}
                    <strong className="text-neutral-900">
                      {Math.round(estimates[selectedScenario]!.years)} ár
                    </strong>{' '}
                    við {Math.round(estimates[selectedScenario]!.age)} ára aldur.
                  </>
                )}
                {selectedScenario === 'realistic' && (
                  <>
                    Með raunhæfri áætlun muntu ná FIRE eftir{' '}
                    <strong className="text-neutral-900">
                      {Math.round(estimates[selectedScenario]!.years)} ár
                    </strong>{' '}
                    við {Math.round(estimates[selectedScenario]!.age)} ára aldur.
                  </>
                )}
                {selectedScenario === 'pessimistic' && (
                  <>
                    Í versta falli, með varfærnustu leiðinni (<strong>{selectedTypes?.[selectedTypes.length - 1] || 'FatFIRE'}</strong>),
                    tekur það{' '}
                    <strong className="text-neutral-900">
                      {Math.round(estimates[selectedScenario]!.years)} ár
                    </strong>{' '}
                    til að ná FIRE við {Math.round(estimates[selectedScenario]!.age)} ára aldur.
                  </>
                )}
              </p>
            )}
          </div>
        )}

        {/* Timeline visualization */}
        <TimelineVisualization
          timelines={timelines}
          currentAge={userInputs.currentAge}
          selectedTypes={selectedTypes}
          showLegend={true}
          showProgressPath={true}
        />

        {/* Help text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Hvernig á að lesa tímalínuna
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>
                  Hver tákn táknar FIRE markmið fyrir ákveðna tegund (LeanFIRE, RegularFIRE, o.s.frv.)
                </li>
                <li>
                  Smelltu á tákn til að sjá nákvæmar upplýsingar um það markmið
                </li>
                <li>
                  Blái punkturinn sýnir þína núverandi stöðu á tímalínunni
                </li>
                <li>
                  Tákn með grænu hakamerki eru markmið sem þú hefur þegar náð
                </li>
                <li>
                  Tímalínan aðlagast sjálfkrafa miðað við núverandi sparnaðarhlutfall og fjárfestingarávöxtun
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
