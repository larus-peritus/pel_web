/**
 * PhaseTimeline - Visual timeline showing retirement phases from current age to 90
 *
 * Features:
 * - Horizontal bar showing life phases from current age to 90
 * - Color-coded sections for each retirement phase
 * - Age markers at key transition points
 * - Duration labels for each phase
 * - Funding requirement display per phase
 * - Hover/click tooltips with detailed phase information
 * - Responsive design (stacks vertically on mobile)
 * - Handles edge cases (retirement at 60, 67, after 67)
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { PHASE_COLORS, ICELANDIC_PENSION_SYSTEM } from '@/lib/constants/pensionAwareFire';
import { formatCurrency } from '@/lib/utils/formatters';
import type { RetirementPhase } from '@/types/pensionAwareFire';
import { cn } from '@/lib/utils';

interface PhaseTimelineProps {
  phases?: RetirementPhase[];
  currentAge?: number;
  targetRetirementAge?: number;
}

/**
 * Get the appropriate color scheme for a phase
 */
function getPhaseColor(phase: RetirementPhase) {
  return PHASE_COLORS[phase.id];
}

/**
 * Calculate percentage width for timeline segment
 */
function calculateSegmentWidth(
  startAge: number,
  endAge: number,
  totalStartAge: number,
  totalEndAge: number
): number {
  const totalSpan = totalEndAge - totalStartAge;
  const segmentSpan = endAge - startAge;
  return (segmentSpan / totalSpan) * 100;
}

/**
 * Format phase duration in Icelandic
 */
function formatDuration(years: number): string {
  if (years === 1) return '1 ár';
  return `${Math.round(years)} ár`;
}

/**
 * Get Icelandic phase label
 */
function getPhaseLabel(phase: RetirementPhase): string {
  switch (phase.id) {
    case 'gap':
      return 'Biðtími';
    case 'sereign-bridge':
      return 'Séreign brú';
    case 'full-pension':
      return 'Fullur lífeyrir';
    default:
      return phase.nameIs;
  }
}

/**
 * Build tooltip content for a phase
 */
function buildPhaseTooltip(phase: RetirementPhase): string {
  const label = getPhaseLabel(phase);
  const duration = formatDuration(phase.durationYears);
  const ages = `${phase.startAge}-${phase.endAge} ára`;
  const funding = phase.requiredAtStart > 0
    ? `Þarf: ${formatCurrency(phase.requiredAtStart)}`
    : 'Afgangur!';

  return `${label} | ${duration} | ${ages} | ${funding}`;
}

export function PhaseTimeline({ phases: propPhases, currentAge: propCurrentAge, targetRetirementAge: propTargetAge }: Partial<PhaseTimelineProps> = {}) {
  const { pensionAwareFire, pensionAwareFireResults } = useCalculator();

  // Use props if provided, otherwise get from context
  const phases = propPhases ?? pensionAwareFireResults?.phases;
  const currentAge = propCurrentAge ?? pensionAwareFire?.currentAge ?? 35;
  const targetRetirementAge = propTargetAge ?? pensionAwareFire?.targetRetirementAge ?? 55;

  // Return null if no phases available
  if (!phases || phases.length === 0) {
    return null;
  }

  // Timeline spans from current age to 90
  const timelineStart = currentAge;
  const timelineEnd = ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY;
  const totalYears = timelineEnd - timelineStart;

  // Calculate working years segment
  const workingYears = targetRetirementAge - currentAge;
  const workingWidth = calculateSegmentWidth(
    currentAge,
    targetRetirementAge,
    timelineStart,
    timelineEnd
  );

  // Key ages for markers
  const keyAges = [
    currentAge,
    targetRetirementAge,
    ...(targetRetirementAge < 60 ? [60] : []),
    ...(targetRetirementAge < 67 ? [67] : []),
    90,
  ].filter((age, index, arr) => arr.indexOf(age) === index).sort((a, b) => a - b);

  return (
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Tímalína eftirlaunaáætlunar
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Sjónræn framsetning á þínum eftirlaunastigum frá {currentAge} til 90 ára
          </p>
        </div>

        {/* Timeline visualization - Desktop */}
        <div className="hidden md:block">
          {/* Age markers */}
          <div className="relative h-8 mb-2">
            {keyAges.map((age) => {
              const position = calculateSegmentWidth(
                timelineStart,
                age,
                timelineStart,
                timelineEnd
              );
              return (
                <div
                  key={age}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="text-xs font-semibold text-neutral-700">
                    {age}
                  </div>
                  <div className="w-px h-2 bg-neutral-400" />
                </div>
              );
            })}
          </div>

          {/* Timeline bar */}
          <div className="relative h-14 bg-neutral-200 rounded-lg overflow-hidden shadow-inner flex">
            {/* Working years */}
            <div
              className="h-full bg-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
              style={{ width: `${workingWidth}%`, minWidth: workingWidth > 0 ? '4px' : '0' }}
              title={`Vinna: ${formatDuration(workingYears)} | ${currentAge}-${targetRetirementAge} ára`}
            >
              {workingWidth > 18 && (
                <span className="text-xs font-semibold text-white truncate px-1">Vinna</span>
              )}
            </div>

            {/* Retirement phases */}
            {phases.map((phase) => {
              const phaseWidth = calculateSegmentWidth(
                phase.startAge,
                phase.endAge,
                timelineStart,
                timelineEnd
              );
              const bgColors: Record<string, string> = {
                gap: 'bg-red-500 hover:bg-red-600',
                'sereign-bridge': 'bg-amber-500 hover:bg-amber-600',
                'full-pension': 'bg-green-500 hover:bg-green-600',
              };

              return (
                <div
                  key={phase.id}
                  className={cn(
                    'h-full flex items-center justify-center cursor-pointer transition-colors',
                    bgColors[phase.id] || 'bg-neutral-400'
                  )}
                  style={{ width: `${phaseWidth}%`, minWidth: phaseWidth > 0 ? '4px' : '0' }}
                  title={buildPhaseTooltip(phase)}
                >
                  {phaseWidth > 15 && (
                    <span className="text-xs font-semibold text-white truncate px-1">
                      {getPhaseLabel(phase)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Phase details below timeline */}
          <div className="mt-4 grid grid-cols-1 gap-3">
            {phases.map((phase) => {
              const colors = getPhaseColor(phase);
              const borderColors: Record<string, string> = {
                gap: 'border-l-red-500',
                'sereign-bridge': 'border-l-amber-500',
                'full-pension': 'border-l-green-500',
              };
              return (
                <div
                  key={phase.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg bg-white border border-neutral-200 border-l-4 shadow-sm',
                    borderColors[phase.id] || 'border-l-neutral-400'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', colors.primary)} />
                    <div>
                      <div className={cn('text-sm font-semibold', colors.dark)}>
                        {getPhaseLabel(phase)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {phase.startAge}-{phase.endAge} ára ({formatDuration(phase.durationYears)})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {phase.requiredAtStart > 0 ? (
                      <>
                        <div className="text-xs text-neutral-500">Þarf við upphaf:</div>
                        <div className={cn('text-sm font-bold', colors.dark)}>
                          {formatCurrency(phase.requiredAtStart)}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-bold text-emerald-600">
                        Afgangur!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline visualization - Mobile (stacked) */}
        <div className="md:hidden space-y-3">
          {/* Working years card */}
          <div className="p-4 rounded-lg bg-white border border-neutral-200 border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div>
                  <div className="text-sm font-semibold text-blue-900">Vinna</div>
                  <div className="text-xs text-neutral-500">
                    {currentAge}-{targetRetirementAge} ára
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold text-blue-700">
                {formatDuration(workingYears)}
              </div>
            </div>
          </div>

          {/* Retirement phase cards */}
          {phases.map((phase) => {
            const colors = getPhaseColor(phase);
            const borderColors: Record<string, string> = {
              gap: 'border-l-red-500',
              'sereign-bridge': 'border-l-amber-500',
              'full-pension': 'border-l-green-500',
            };
            return (
              <div
                key={phase.id}
                className={cn(
                  'p-4 rounded-lg bg-white border border-neutral-200 border-l-4 shadow-sm',
                  borderColors[phase.id] || 'border-l-neutral-400'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn('w-3 h-3 rounded-full mt-0.5', colors.primary)} />
                    <div className="flex-1">
                      <div className={cn('text-sm font-semibold', colors.dark)}>
                        {getPhaseLabel(phase)}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {phase.startAge}-{phase.endAge} ára ({formatDuration(phase.durationYears)})
                      </div>
                      {phase.requiredAtStart > 0 ? (
                        <div className="mt-2">
                          <div className="text-xs text-neutral-500">Þarf við upphaf:</div>
                          <div className={cn('text-sm font-bold', colors.dark)}>
                            {formatCurrency(phase.requiredAtStart)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-emerald-600 mt-2">
                          Afgangur!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="border-t pt-4">
          <div className="text-xs text-neutral-600">
            <span className="font-medium">Athugasemd:</span> Tímalínan sýnir hvernig líf þitt skiptist í vinnuár og
            eftirlaunastig út frá því hvenær mismunandi lífeyrislausnir verða aðgengilegar (séreign við 60,
            lífeyrissjóður við {ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE},
            TR við {ICELANDIC_PENSION_SYSTEM.TR_START_AGE}).
          </div>
        </div>
      </div>
    </Card>
  );
}
