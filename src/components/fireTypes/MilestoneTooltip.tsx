'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { FIRETypeId } from '@/types/fireTypes';
import { FIRE_TYPE_DEFINITIONS, getFIRETypeColors } from '@/lib/constants/fireTypes';

/**
 * MilestoneTooltip Props
 */
export interface MilestoneTooltipProps {
  /**
   * FIRE type identifier
   */
  fireTypeId: FIRETypeId;

  /**
   * Age when milestone is reached
   */
  age: number;

  /**
   * Calendar year when milestone is reached
   */
  year: number;

  /**
   * Nest egg amount at this milestone (ISK)
   */
  nestEggAmount: number;

  /**
   * Years remaining to reach this milestone (null if already achieved)
   */
  yearsRemaining: number | null;

  /**
   * Whether this milestone has been achieved
   */
  isAchieved: boolean;

  /**
   * Brief description of what this milestone means
   */
  description?: string;

  /**
   * Position of the marker this tooltip is for (for smart positioning)
   * Value between 0-100 (percentage along timeline)
   */
  markerPosition: number;

  /**
   * Whether the tooltip is visible
   */
  isVisible: boolean;

  /**
   * Callback when tooltip is dismissed
   */
  onDismiss: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * MilestoneTooltip - Detailed information tooltip for timeline milestones
 *
 * Features:
 * - FIRE type name
 * - Age and calendar year
 * - Nest egg amount at that point
 * - Years remaining (if not achieved)
 * - Brief description
 * - Smart positioning (avoids edges)
 * - Dismissable (click outside or ESC)
 * - Accessible (ARIA)
 *
 * @example
 * ```tsx
 * <MilestoneTooltip
 *   fireTypeId="regularfire"
 *   age={52}
 *   year={2046}
 *   nestEggAmount={156_000_000}
 *   yearsRemaining={20}
 *   isAchieved={false}
 *   description="Full fjármálafrelsi með þægilegum lífsstíl"
 *   markerPosition={65}
 *   isVisible={true}
 *   onDismiss={() => setShowTooltip(false)}
 * />
 * ```
 */
export function MilestoneTooltip({
  fireTypeId,
  age,
  year,
  nestEggAmount,
  yearsRemaining,
  isAchieved,
  description,
  markerPosition,
  isVisible,
  onDismiss,
  className,
}: MilestoneTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  const definition = FIRE_TYPE_DEFINITIONS.find((d) => d.id === fireTypeId);
  const colors = getFIRETypeColors(fireTypeId);

  // Smart positioning based on marker position
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      // If marker is in left 30%, show tooltip on right
      if (markerPosition < 30) {
        setPosition('right');
      }
      // If marker is in right 30%, show tooltip on left
      else if (markerPosition > 70) {
        setPosition('left');
      }
      // Otherwise show on top
      else {
        setPosition('top');
      }
    }
  }, [isVisible, markerPosition]);

  // Handle click outside to dismiss
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onDismiss();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)} ma. kr`;
    } else if (amount >= 1_000_000) {
      return `${Math.round(amount / 1_000_000)} m. kr`;
    } else {
      return `${Math.round(amount / 1_000)} þ. kr`;
    }
  };

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      className={cn(
        'absolute z-50 w-72 p-4 bg-white rounded-lg shadow-xl border-2',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        colors.border,
        positionClasses[position],
        className
      )}
    >
      {/* Arrow */}
      <div
        className={cn(
          'absolute w-0 h-0 border-8',
          arrowClasses[position],
          `border-t-${colors.border.split('-')[1]}-${colors.border.split('-')[2]}`
        )}
        style={{
          borderTopColor: position === 'top' ? 'white' : undefined,
          borderBottomColor: position === 'bottom' ? 'white' : undefined,
          borderLeftColor: position === 'left' ? 'white' : undefined,
          borderRightColor: position === 'right' ? 'white' : undefined,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden="true">
            {definition?.icon}
          </span>
          <div>
            <h3 className={cn('text-base font-semibold', colors.text)}>
              {definition?.nameIs}
            </h3>
            <p className="text-sm text-neutral-600">
              {age} ára aldur • {year}
            </p>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          className="text-neutral-700 hover:text-neutral-600 transition-colors p-1"
          aria-label="Loka"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Nest egg amount */}
      <div className="mb-3">
        <p className="text-xs text-neutral-700 mb-1">Uppsöfnuð eign</p>
        <p className="text-2xl font-bold text-neutral-900">
          {formatCurrency(nestEggAmount)}
        </p>
      </div>

      {/* Years remaining */}
      {!isAchieved && yearsRemaining !== null && (
        <div className="mb-3">
          <p className="text-xs text-neutral-700 mb-1">Tími eftir</p>
          <p className="text-lg font-semibold text-neutral-700">
            {yearsRemaining < 1
              ? `${Math.round(yearsRemaining * 12)} mánuðir`
              : yearsRemaining === 1
              ? '1 ár'
              : `${Math.round(yearsRemaining)} ár`}
          </p>
        </div>
      )}

      {/* Achieved badge */}
      {isAchieved && (
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-medium text-green-700">Náð!</span>
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="pt-3 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
