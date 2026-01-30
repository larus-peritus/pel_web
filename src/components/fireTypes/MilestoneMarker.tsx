'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { FIRETypeId } from '@/types/fireTypes';
import { FIRE_TYPE_DEFINITIONS, getFIRETypeColors } from '@/lib/constants/fireTypes';

/**
 * MilestoneMarker Props
 */
export interface MilestoneMarkerProps {
  /**
   * FIRE type identifier for icon and color
   */
  fireTypeId: FIRETypeId;

  /**
   * Age at which this milestone is reached
   */
  age: number;

  /**
   * Calendar year when milestone is reached
   */
  year: number;

  /**
   * Position on timeline (0-100%)
   */
  position: number;

  /**
   * Whether milestone has been achieved
   */
  isAchieved?: boolean;

  /**
   * Callback when marker is clicked
   */
  onClick?: () => void;

  /**
   * Callback when marker is hovered
   */
  onHover?: (hovered: boolean) => void;

  /**
   * Whether this marker is currently focused/active
   */
  isActive?: boolean;

  /**
   * Orientation (matches parent timeline)
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * MilestoneMarker - Interactive milestone marker on timeline
 *
 * Features:
 * - FIRE type icon (emoji)
 * - Position on timeline based on years/age
 * - Age + year label
 * - Interactive hover state
 * - Click to show tooltip
 * - Color-coded per FIRE type
 * - "Achieved" visual state (checkmark, glow)
 * - ARIA accessible
 *
 * @example
 * ```tsx
 * <MilestoneMarker
 *   fireTypeId="regularfire"
 *   age={52}
 *   year={2046}
 *   position={65}
 *   isAchieved={false}
 *   onClick={() => console.log('Clicked!')}
 * />
 * ```
 */
export function MilestoneMarker({
  fireTypeId,
  age,
  year,
  position,
  isAchieved = false,
  onClick,
  onHover,
  isActive = false,
  orientation = 'horizontal',
  className,
}: MilestoneMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const definition = FIRE_TYPE_DEFINITIONS.find((d) => d.id === fireTypeId);
  const colors = getFIRETypeColors(fireTypeId);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'absolute transition-all duration-200',
        isHorizontal ? '-translate-x-1/2' : '-translate-y-1/2',
        className
      )}
      style={{
        [isHorizontal ? 'left' : 'top']: `${position}%`,
        [isHorizontal ? 'top' : 'left']: isHorizontal ? '50%' : '50%',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Marker container */}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex flex-col items-center gap-1 cursor-pointer group',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'rounded-lg p-2 transition-all duration-200',
          isActive && 'ring-2 ring-blue-500 ring-offset-2'
        )}
        aria-label={`${definition?.nameIs} við ${age} ára aldur (${year})`}
        aria-pressed={isActive}
      >
        {/* Icon circle */}
        <div
          className={cn(
            'relative flex items-center justify-center',
            'w-12 h-12 rounded-full border-2 transition-all duration-200',
            isAchieved ? colors.accent : 'bg-white',
            isAchieved ? 'border-transparent' : colors.border,
            'group-hover:scale-110 group-hover:shadow-lg',
            isAchieved && 'shadow-lg',
            isActive && 'scale-110 shadow-xl'
          )}
        >
          {/* Achieved glow effect */}
          {isAchieved && (
            <div
              className={cn(
                'absolute inset-0 rounded-full opacity-50 blur-md',
                colors.accent
              )}
            />
          )}

          {/* FIRE type icon */}
          <span className="text-2xl relative z-10" role="img" aria-hidden="true">
            {definition?.icon}
          </span>

          {/* Checkmark for achieved milestones */}
          {isAchieved && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Age label */}
        <div
          className={cn(
            'flex flex-col items-center text-xs font-medium transition-opacity duration-200',
            isHovered || isActive ? 'opacity-100' : 'opacity-70',
            isAchieved ? colors.text : 'text-neutral-700'
          )}
        >
          <span className="font-semibold">{age} ára</span>
          <span className="text-[10px] opacity-80">{year}</span>
        </div>

        {/* Hover indicator line */}
        {(isHovered || isActive) && (
          <div
            className={cn(
              'absolute w-0.5 bg-gradient-to-b opacity-30 transition-all duration-200',
              isHorizontal ? 'h-8 -bottom-8' : 'w-8 -right-8',
              isAchieved ? colors.accent : 'from-neutral-400 to-transparent'
            )}
          />
        )}
      </button>
    </div>
  );
}
