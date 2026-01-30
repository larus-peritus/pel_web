'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * TimelineAxis Props
 */
export interface TimelineAxisProps {
  /**
   * Orientation of the timeline
   * - horizontal: Desktop view (default)
   * - vertical: Mobile view
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Start age for the timeline
   */
  startAge: number;

  /**
   * End age for the timeline
   */
  endAge: number;

  /**
   * Current age marker position
   */
  currentAge: number;

  /**
   * Show grid lines (subtle background guides)
   */
  showGrid?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * TimelineAxis - SVG-based timeline axis with age/year labels
 *
 * Features:
 * - Horizontal (desktop) / Vertical (mobile) orientation
 * - Age labels at regular intervals
 * - Current position marker ("Núna")
 * - Optional subtle grid lines
 * - Crisp SVG rendering
 *
 * @example
 * ```tsx
 * <TimelineAxis
 *   orientation="horizontal"
 *   startAge={25}
 *   endAge={67}
 *   currentAge={32}
 *   showGrid={true}
 * />
 * ```
 */
export function TimelineAxis({
  orientation = 'horizontal',
  startAge,
  endAge,
  currentAge,
  showGrid = true,
  className,
}: TimelineAxisProps) {
  // Calculate scale parameters
  const totalYears = endAge - startAge;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - (currentAge - startAge);
  const endYear = currentYear + (endAge - currentAge);

  // Calculate position of current age on the timeline (0-100%)
  const currentPosition = ((currentAge - startAge) / totalYears) * 100;

  // Generate tick marks at 5-year intervals
  const ticks: Array<{ age: number; year: number; position: number }> = [];
  const tickInterval = 5;

  for (let age = Math.ceil(startAge / tickInterval) * tickInterval; age <= endAge; age += tickInterval) {
    if (age >= startAge && age <= endAge) {
      const position = ((age - startAge) / totalYears) * 100;
      const year = startYear + (age - startAge);
      ticks.push({ age, year, position });
    }
  }

  // Dimensions
  const isHorizontal = orientation === 'horizontal';
  const svgWidth = isHorizontal ? 800 : 120;
  const svgHeight = isHorizontal ? 80 : 600;
  const axisStart = isHorizontal ? 40 : 40;
  const axisEnd = isHorizontal ? svgWidth - 40 : svgHeight - 40;
  const axisLength = axisEnd - axisStart;

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Tímalína frá ${startAge} til ${endAge} ára aldurs`}
      >
        {/* Grid lines (if enabled) */}
        {showGrid && (
          <g className="grid-lines" opacity="0.2">
            {ticks.map((tick) => {
              const pos = axisStart + (tick.position / 100) * axisLength;
              return (
                <line
                  key={`grid-${tick.age}`}
                  x1={isHorizontal ? pos : 0}
                  y1={isHorizontal ? 0 : pos}
                  x2={isHorizontal ? pos : svgWidth}
                  y2={isHorizontal ? svgHeight : pos}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  className="text-neutral-300"
                />
              );
            })}
          </g>
        )}

        {/* Main axis line */}
        <line
          x1={isHorizontal ? axisStart : svgWidth / 2}
          y1={isHorizontal ? svgHeight / 2 : axisStart}
          x2={isHorizontal ? axisEnd : svgWidth / 2}
          y2={isHorizontal ? svgHeight / 2 : axisEnd}
          stroke="currentColor"
          strokeWidth="2"
          className="text-neutral-700"
        />

        {/* Tick marks and labels */}
        {ticks.map((tick) => {
          const pos = axisStart + (tick.position / 100) * axisLength;

          return (
            <g key={`tick-${tick.age}`}>
              {/* Tick mark */}
              <line
                x1={isHorizontal ? pos : svgWidth / 2 - 5}
                y1={isHorizontal ? svgHeight / 2 - 5 : pos}
                x2={isHorizontal ? pos : svgWidth / 2 + 5}
                y2={isHorizontal ? svgHeight / 2 + 5 : pos}
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-700"
              />

              {/* Age label */}
              <text
                x={isHorizontal ? pos : svgWidth / 2 + 15}
                y={isHorizontal ? svgHeight / 2 + 20 : pos + 4}
                textAnchor="middle"
                className="text-[10px] font-medium fill-neutral-700"
              >
                {tick.age}
              </text>

              {/* Year label (smaller, below age) */}
              <text
                x={isHorizontal ? pos : svgWidth / 2 + 15}
                y={isHorizontal ? svgHeight / 2 + 32 : pos + 14}
                textAnchor="middle"
                className="text-[8px] fill-neutral-500"
              >
                {tick.year}
              </text>
            </g>
          );
        })}

        {/* Current position marker ("Núna") */}
        {currentAge >= startAge && currentAge <= endAge && (
          <g className="current-marker">
            {(() => {
              const pos = axisStart + (currentPosition / 100) * axisLength;

              return (
                <>
                  {/* Marker line */}
                  <line
                    x1={isHorizontal ? pos : svgWidth / 2 - 10}
                    y1={isHorizontal ? svgHeight / 2 - 10 : pos}
                    x2={isHorizontal ? pos : svgWidth / 2 + 10}
                    y2={isHorizontal ? svgHeight / 2 + 10 : pos}
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-blue-600"
                  />

                  {/* Marker circle */}
                  <circle
                    cx={isHorizontal ? pos : svgWidth / 2}
                    cy={isHorizontal ? svgHeight / 2 : pos}
                    r="4"
                    fill="currentColor"
                    className="text-blue-600"
                  />

                  {/* "Núna" label */}
                  <text
                    x={isHorizontal ? pos : svgWidth / 2 - 20}
                    y={isHorizontal ? svgHeight / 2 - 15 : pos - 8}
                    textAnchor="middle"
                    className="text-[11px] font-semibold fill-blue-600"
                  >
                    Núna
                  </text>
                </>
              );
            })()}
          </g>
        )}

        {/* Axis labels */}
        <text
          x={isHorizontal ? axisStart - 20 : svgWidth / 2}
          y={isHorizontal ? svgHeight / 2 - 20 : axisStart - 15}
          textAnchor="middle"
          className="text-[10px] font-medium fill-neutral-600"
        >
          {startAge} ára
        </text>
        <text
          x={isHorizontal ? axisEnd + 20 : svgWidth / 2}
          y={isHorizontal ? svgHeight / 2 - 20 : axisEnd + 15}
          textAnchor="middle"
          className="text-[10px] font-medium fill-neutral-600"
        >
          {endAge} ára
        </text>
      </svg>
    </div>
  );
}
