/**
 * CoastFIREStatus Component
 *
 * Visual status indicator for Coast FIRE progress.
 * Shows whether user is coasting, will coast in future, or Coast FIRE is impossible.
 *
 * Features:
 * - Color-coded status (green/blue/amber)
 * - Icon and label
 * - Status message in Icelandic
 * - Accessible design
 *
 * Epic 3, Task 3.4
 */

'use client';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { CoastFIREStatus as StatusType } from '@/types/coastFire';

export interface CoastFIREStatusProps {
  status: StatusType;
  coastFireAge?: number | null;
  className?: string;
}

/**
 * Status configuration with Icelandic labels and colors
 */
const STATUS_CONFIG: Record<
  StatusType,
  {
    label: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    message: string;
  }
> = {
  coasting: {
    label: 'Þú ert á ró!',
    icon: '🎉',
    color: 'success',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-300',
    textColor: 'text-success-900',
    message: 'Þú hefur nú þegar náð Sjálfvirku FIRE! Fjárfestingar þínar munu vaxa í FI-töluna þína án frekari innborgunar.',
  },
  future: {
    label: 'Sjálfvirkt FIRE framundan',
    icon: '🎯',
    color: 'info',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-300',
    textColor: 'text-primary-900',
    message: 'Þú munt ná Sjálfvirku FIRE á næstu árum ef fjárfestingar halda áfram að vaxa.',
  },
  impossible: {
    label: 'Sjálfvirkt FIRE ómögulegt',
    icon: '⚠️',
    color: 'warning',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-300',
    textColor: 'text-warning-900',
    message: 'Með núverandi forsendum munu fjárfestingar þínar ekki ná FI-tölunni fyrir starfslok. Skoðaðu tillögur að breytingum hér að neðan.',
  },
};

export function CoastFIREStatus({ status, coastFireAge, className }: CoastFIREStatusProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-3xl" role="img" aria-label={config.label}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-lg font-bold', config.textColor)}>
              {config.label}
            </h3>
            {status === 'future' && coastFireAge && (
              <Badge variant={config.color as any} size="sm">
                Aldur {Math.round(coastFireAge)}
              </Badge>
            )}
          </div>
          <p className={cn('mt-1 text-sm', config.textColor)}>
            {config.message}
          </p>
        </div>
      </div>
    </div>
  );
}
