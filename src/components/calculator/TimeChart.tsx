'use client';

import { useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { vacationDaysToWorkWeeks } from '@/lib/calculations/wage';

// Colors for pie segments (matching design system)
const SEGMENT_COLORS = [
  'primary-500',   // Base work
  'warning-500',   // Commute
  'error-500',     // Getting ready
  'purple-500',    // Decompression
  'orange-500',    // Work illness
];

// Map Tailwind color names to actual hex values
const COLOR_MAP: Record<string, string> = {
  'primary-500': '#0ea5e9',
  'warning-500': '#f59e0b',
  'error-500': '#ef4444',
  'purple-500': '#a855f7',
  'orange-500': '#f97316',
};

interface Segment {
  category: string;
  label: string;
  hoursPerWeek: number;
  percentage: number;
  startPercent: number;
  endPercent: number;
  color: string;
  bgClass: string;
}

/**
 * Time breakdown chart showing weekly hour allocation
 * Uses CSS conic-gradient for donut chart visualization (no external chart library)
 */
export function TimeChart() {
  const { results, inputs } = useCalculator();

  const timeBreakdown = results?.timeBreakdown ?? [];
  const totalWeeklyHours = results?.totalWeeklyHours ?? 0;

  // Calculate cumulative angles for pie segments (must be called unconditionally)
  const segments = useMemo<Segment[]>(() => {
    if (timeBreakdown.length === 0) return [];
    let cumulativePercent = 0;
    return timeBreakdown.map((item, index) => {
      const startPercent = cumulativePercent;
      cumulativePercent += item.percentage;
      const colorName = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
      return {
        category: item.category,
        label: item.label,
        hoursPerWeek: item.hoursPerWeek,
        percentage: item.percentage,
        startPercent,
        endPercent: cumulativePercent,
        color: COLOR_MAP[colorName] || '#6b7280',
        bgClass: `bg-${colorName}`,
      };
    });
  }, [timeBreakdown]);

  // Early return AFTER all hooks
  if (!results || timeBreakdown.length === 0) {
    return null;
  }

  // Generate conic-gradient string for pie chart
  const gradientStops = segments
    .map((segment) => {
      return `${segment.color} ${segment.startPercent}% ${segment.endPercent}%`;
    })
    .join(', ');

  // Calculate annual hours (convert vacation days to work weeks, default 24 vacation days = 47.2 weeks)
  const vacationDays = inputs?.income?.vacationDays ?? 24;
  const weeksPerYear = vacationDaysToWorkWeeks(vacationDays);
  const annualHours = (totalWeeklyHours * weeksPerYear).toFixed(0);

  return (
    <Card variant="outlined">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Tímaskipting
        </h3>
        <p className="text-sm text-neutral-600">
          Vikustundir þínar í vinnutengda þætti
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(${gradientStops})`,
              }}
            />
            {/* Center hole for donut effect */}
            <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-inner">
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">
                  {totalWeeklyHours.toFixed(1)}
                </p>
                <p className="text-xs text-neutral-500">klst/viku</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {segments.map((segment) => (
              <div key={segment.category} className="flex items-center gap-3">
                <div
                  className={cn('w-4 h-4 rounded-sm flex-shrink-0', segment.bgClass)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {segment.label}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {segment.hoursPerWeek.toFixed(1)} klst ({segment.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total annotation */}
        <div className="mt-4 pt-4 border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-600">
            Heildartími í vinnutengda þætti:{' '}
            <span className="font-semibold text-neutral-900">
              {totalWeeklyHours.toFixed(1)} klukkustundir á viku
            </span>
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            ({annualHours} klukkustundir á ári)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
