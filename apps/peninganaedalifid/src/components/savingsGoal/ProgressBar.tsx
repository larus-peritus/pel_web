/**
 * Progress bar with milestone markers
 */

'use client';

import { Check } from 'lucide-react';
import type { GoalStatus } from '@/types/savingsGoal';

interface ProgressBarProps {
  percentage: number;
  status: GoalStatus;
  milestones: number[];
  achievedMilestones: number[];
}

const STATUS_COLORS: Record<GoalStatus, string> = {
  started: 'bg-red-500',
  progressing: 'bg-yellow-500',
  'almost-there': 'bg-blue-500',
  achieved: 'bg-green-500',
};

export function ProgressBar({ percentage, status, milestones, achievedMilestones }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-visible mb-6">
      {/* Progress fill */}
      <div
        className={`h-full ${STATUS_COLORS[status]} transition-all duration-500 rounded-full`}
        style={{ width: `${clampedPercentage}%` }}
      />

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
        {Math.round(percentage)}%
      </div>

      {/* Milestone markers */}
      {milestones.map((milestone) => (
        <div
          key={milestone}
          className="absolute top-0 bottom-0 flex items-center"
          style={{ left: `${milestone}%` }}
        >
          <div className="relative -ml-3">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                achievedMilestones.includes(milestone)
                  ? 'bg-green-500 border-green-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              {achievedMilestones.includes(milestone) && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
              {milestone}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
