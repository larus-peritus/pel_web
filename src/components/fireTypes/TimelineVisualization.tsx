'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { FIRETimeline, FIRETypeId } from '@/types/fireTypes';
import { TimelineAxis } from './TimelineAxis';
import { MilestoneMarker } from './MilestoneMarker';
import { MilestoneTooltip } from './MilestoneTooltip';
import { FIRE_TYPE_DEFINITIONS, getFIRETypeColors } from '@/lib/constants/fireTypes';

/**
 * TimelineVisualization Props
 */
export interface TimelineVisualizationProps {
  /**
   * Timeline data to visualize
   */
  timelines: Partial<Record<FIRETypeId, FIRETimeline>>;

  /**
   * Current age of the user
   */
  currentAge: number;

  /**
   * Selected FIRE types to display (if not provided, shows all)
   */
  selectedTypes?: FIRETypeId[];

  /**
   * Responsive orientation
   * - 'auto': Horizontal on desktop, vertical on mobile (default)
   * - 'horizontal': Always horizontal
   * - 'vertical': Always vertical
   */
  orientation?: 'auto' | 'horizontal' | 'vertical';

  /**
   * Whether to show the legend
   */
  showLegend?: boolean;

  /**
   * Whether to show progress path visualization
   */
  showProgressPath?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * TimelineVisualization - Complete timeline visualization with all milestones
 *
 * Features:
 * - TimelineAxis as base
 * - All MilestoneMarkers positioned correctly
 * - Current position highlighted
 * - Timeline legend (color = FIRE type)
 * - Responsive (horizontal desktop, vertical mobile)
 * - Scrollable if timeline is long
 * - Progress path visualization
 * - Interactive tooltips
 *
 * @example
 * ```tsx
 * <TimelineVisualization
 *   timelines={{
 *     leanfire: leanFireTimeline,
 *     regularfire: regularFireTimeline,
 *     fatfire: fatFireTimeline,
 *   }}
 *   currentAge={32}
 *   selectedTypes={['regularfire', 'fatfire']}
 *   showLegend={true}
 *   showProgressPath={true}
 * />
 * ```
 */
export function TimelineVisualization({
  timelines,
  currentAge,
  selectedTypes,
  orientation = 'auto',
  showLegend = true,
  showProgressPath = true,
  className,
}: TimelineVisualizationProps) {
  const [activeTooltip, setActiveTooltip] = useState<{
    fireTypeId: FIRETypeId;
    milestoneIndex: number;
  } | null>(null);

  // Determine which types to show
  const typesToShow = selectedTypes || (Object.keys(timelines) as FIRETypeId[]);

  // Calculate timeline bounds (age range)
  let minAge = currentAge;
  let maxAge = currentAge + 30; // Default 30 years

  typesToShow.forEach((typeId) => {
    const timeline = timelines[typeId];
    if (!timeline) return;

    timeline.milestones.forEach((milestone) => {
      if (milestone.date) {
        const milestoneAge = currentAge + (milestone.yearsFromNow || 0);
        if (milestoneAge < minAge) minAge = Math.floor(milestoneAge);
        if (milestoneAge > maxAge) maxAge = Math.ceil(milestoneAge);
      }
    });
  });

  // Add padding to bounds
  minAge = Math.max(18, minAge - 2);
  maxAge = Math.min(90, maxAge + 5);

  // Determine actual orientation
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const actualOrientation =
    orientation === 'auto'
      ? isMobile
        ? 'vertical'
        : 'horizontal'
      : orientation;

  // Calculate milestone positions
  const totalYears = maxAge - minAge;
  const getMilestoneAge = (fireTypeId: FIRETypeId, milestoneIndex: number): number => {
    const timeline = timelines[fireTypeId];
    if (!timeline) return currentAge;

    const milestone = timeline.milestones[milestoneIndex];
    if (!milestone || milestone.yearsFromNow === null) return currentAge;

    return currentAge + milestone.yearsFromNow;
  };

  const getMilestonePosition = (age: number): number => {
    return ((age - minAge) / totalYears) * 100;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Legend */}
      {showLegend && typesToShow.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {typesToShow.map((typeId) => {
            const definition = FIRE_TYPE_DEFINITIONS.find((d) => d.id === typeId);
            const colors = getFIRETypeColors(typeId);

            return (
              <div
                key={typeId}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg shadow-sm"
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {definition?.icon}
                </span>
                <span className={cn('text-sm font-medium', colors.text)}>
                  {definition?.nameIs}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline container */}
      <div
        className={cn(
          'relative bg-neutral-50 rounded-xl p-6 border border-neutral-200',
          actualOrientation === 'horizontal'
            ? 'overflow-x-auto'
            : 'overflow-y-auto max-h-[600px]'
        )}
      >
        {/* Progress path visualization */}
        {showProgressPath && (
          <div
            className={cn(
              'absolute',
              actualOrientation === 'horizontal'
                ? 'left-0 right-0 top-1/2 -translate-y-1/2'
                : 'top-0 bottom-0 left-1/2 -translate-x-1/2'
            )}
            style={{
              [actualOrientation === 'horizontal' ? 'height' : 'width']: '2px',
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-200 via-green-200 to-green-400 opacity-30" />
          </div>
        )}

        {/* Timeline axis */}
        <TimelineAxis
          orientation={actualOrientation}
          startAge={minAge}
          endAge={maxAge}
          currentAge={currentAge}
          showGrid={true}
        />

        {/* Milestone markers */}
        <div className="relative" style={{ minHeight: actualOrientation === 'horizontal' ? '120px' : '600px' }}>
          {typesToShow.map((typeId) => {
            const timeline = timelines[typeId];
            if (!timeline) return null;

            return timeline.milestones
              .filter((milestone) => milestone.percentage === 100) // Only show final milestone
              .map((milestone, index) => {
                const milestoneAge = getMilestoneAge(typeId, timeline.milestones.indexOf(milestone));
                const position = getMilestonePosition(milestoneAge);
                const year = new Date().getFullYear() + (milestone.yearsFromNow || 0);

                const isTooltipActive =
                  activeTooltip?.fireTypeId === typeId &&
                  activeTooltip?.milestoneIndex === timeline.milestones.indexOf(milestone);

                return (
                  <React.Fragment key={`${typeId}-${index}`}>
                    <MilestoneMarker
                      fireTypeId={typeId}
                      age={Math.round(milestoneAge)}
                      year={year}
                      position={position}
                      isAchieved={milestone.isReached}
                      onClick={() => {
                        setActiveTooltip(
                          isTooltipActive
                            ? null
                            : { fireTypeId: typeId, milestoneIndex: timeline.milestones.indexOf(milestone) }
                        );
                      }}
                      isActive={isTooltipActive}
                      orientation={actualOrientation}
                    />

                    {/* Tooltip */}
                    {isTooltipActive && (
                      <div
                        className="absolute"
                        style={{
                          [actualOrientation === 'horizontal' ? 'left' : 'top']: `${position}%`,
                          [actualOrientation === 'horizontal' ? 'top' : 'left']: actualOrientation === 'horizontal' ? '50%' : '50%',
                        }}
                      >
                        <MilestoneTooltip
                          fireTypeId={typeId}
                          age={Math.round(milestoneAge)}
                          year={year}
                          nestEggAmount={milestone.amount}
                          yearsRemaining={milestone.yearsFromNow}
                          isAchieved={milestone.isReached}
                          description={milestone.label}
                          markerPosition={position}
                          isVisible={true}
                          onDismiss={() => setActiveTooltip(null)}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              });
          })}
        </div>
      </div>

      {/* Timeline summary */}
      {typesToShow.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {typesToShow.map((typeId) => {
            const timeline = timelines[typeId];
            if (!timeline) return null;

            const finalMilestone = timeline.milestones[timeline.milestones.length - 1];
            const definition = FIRE_TYPE_DEFINITIONS.find((d) => d.id === typeId);
            const colors = getFIRETypeColors(typeId);

            return (
              <div
                key={typeId}
                className={cn(
                  'p-3 rounded-lg border-2 bg-white',
                  colors.border,
                  colors.hover
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" role="img" aria-hidden="true">
                    {definition?.icon}
                  </span>
                  <span className={cn('text-sm font-semibold', colors.text)}>
                    {definition?.nameIs}
                  </span>
                </div>

                <div className="text-xs text-neutral-600">
                  {finalMilestone.isReached ? (
                    <p className="text-green-600 font-medium">Náð!</p>
                  ) : finalMilestone.yearsFromNow !== null ? (
                    <>
                      <p>
                        Tími:{' '}
                        <span className="font-medium text-neutral-900">
                          {finalMilestone.yearsFromNow < 1
                            ? `${Math.round(finalMilestone.yearsFromNow * 12)} mán`
                            : `${Math.round(finalMilestone.yearsFromNow)} ár`}
                        </span>
                      </p>
                      <p>
                        Aldur:{' '}
                        <span className="font-medium text-neutral-900">
                          {Math.round(currentAge + finalMilestone.yearsFromNow)} ára
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-amber-600 font-medium">Ekki hægt að ná</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
