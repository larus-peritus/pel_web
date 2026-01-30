'use client';

import type { TargetProgress } from '@/types/emergencyFund';
import { Card } from '@/components/ui/Card';

interface TargetMilestoneProps {
  target: TargetProgress;
}

/**
 * Individual Target Milestone Display
 *
 * Shows progress toward a specific target (3, 6, or 12 months):
 * - Progress bar (0-100%)
 * - Achievement indicator
 * - Amount remaining
 * - Purpose explanation
 */
export function TargetMilestone({ target }: TargetMilestoneProps) {
  const { months, targetAmount, progress, isAchieved, amountRemaining, purpose } = target;

  // Color scheme based on target level
  const getColorScheme = () => {
    if (months === 3) {
      return {
        bg: isAchieved ? 'bg-orange-100' : 'bg-neutral-50',
        border: isAchieved ? 'border-orange-300' : 'border-neutral-200',
        progress: 'bg-orange-500',
        text: 'text-orange-900',
      };
    }
    if (months === 6) {
      return {
        bg: isAchieved ? 'bg-green-100' : 'bg-neutral-50',
        border: isAchieved ? 'border-green-300' : 'border-neutral-200',
        progress: 'bg-green-500',
        text: 'text-green-900',
      };
    }
    // 12 months
    return {
      bg: isAchieved ? 'bg-emerald-100' : 'bg-neutral-50',
      border: isAchieved ? 'border-emerald-300' : 'border-neutral-200',
      progress: 'bg-emerald-500',
      text: 'text-emerald-900',
    };
  };

  const colors = getColorScheme();

  return (
    <Card className={`p-6 ${colors.bg} border-2 ${colors.border}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className={`text-lg font-bold ${colors.text}`}>
            {months} mánuðir
          </h4>
          {isAchieved && (
            <div className="text-2xl">✓</div>
          )}
        </div>

        {/* Target Amount */}
        <div className="text-sm text-neutral-700">
          <div className="flex items-baseline justify-between mb-1">
            <span>Markmið:</span>
            <span className="font-semibold">
              {targetAmount.toLocaleString('is-IS')} kr
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-neutral-600">Framvinda</span>
            <span className={`font-bold ${colors.text}`}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${colors.progress} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(100, progress)}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Framvinda í átt að ${months} mánuðum`}
            />
          </div>
        </div>

        {/* Amount Remaining or Achievement */}
        {isAchieved ? (
          <div className={`p-3 rounded-lg bg-white/50 border ${colors.border}`}>
            <p className="text-sm font-medium text-center text-neutral-700">
              Markmiði náð! 🎉
            </p>
          </div>
        ) : (
          <div className="text-sm text-neutral-700">
            <div className="flex items-baseline justify-between">
              <span>Vantar:</span>
              <span className="font-semibold text-neutral-900">
                {amountRemaining.toLocaleString('is-IS')} kr
              </span>
            </div>
          </div>
        )}

        {/* Purpose */}
        <div className="pt-3 border-t border-neutral-300">
          <p className="text-xs text-neutral-600">
            {purpose}
          </p>
        </div>
      </div>
    </Card>
  );
}
