'use client';

import React, { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { MULTIPLIER_WARNING_THRESHOLD } from '@/lib/constants/fiNumber';

/**
 * IcelandicContextAlert Component Props
 */
export interface IcelandicContextAlertProps {
  /** Current multiplier value */
  multiplier: number;
  /** Callback when user wants to see educational content */
  onLearnMore?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the alert can be dismissed (default: true) */
  dismissible?: boolean;
}

/**
 * IcelandicContextAlert Component
 *
 * Displays a warning alert when the user selects a multiplier that may be too
 * aggressive for the Icelandic context (below 28x).
 *
 * Features:
 * - Conditional rendering (only shows when multiplier < 28)
 * - Warning about Icelandic inflation and currency risk
 * - Recommendation for 30x-33x multiplier range
 * - Link to educational content
 * - Dismissible (user can close it)
 * - All text in Icelandic
 *
 * Context:
 * Iceland has higher inflation (3-4% vs US 2-3%) and currency risk with ISK.
 * The standard US 4% rule (25x multiplier) may be too aggressive. We recommend
 * 30x-33x (3.0-3.33% withdrawal rate) for Icelandic context.
 *
 * @example
 * ```tsx
 * <IcelandicContextAlert
 *   multiplier={25}
 *   onLearnMore={() => scrollToEducationalPanel()}
 * />
 * ```
 */
export const IcelandicContextAlert: React.FC<IcelandicContextAlertProps> = ({
  multiplier,
  onLearnMore,
  className,
  dismissible = true,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't render if multiplier is above threshold
  if (multiplier >= MULTIPLIER_WARNING_THRESHOLD) {
    return null;
  }

  // Don't render if user has dismissed
  if (isDismissed && dismissible) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Alert
      variant="warning"
      title="Varúð: Lágt úttektarhlutfall fyrir íslenskt samhengi"
      className={className}
      onDismiss={dismissible ? handleDismiss : undefined}
    >
      <div className="flex flex-col gap-3">

        {/* Content */}
        <div className="text-sm text-warning-700 space-y-2">
          <p>
            Þú hefur valið <strong>{multiplier}x margfaldara</strong> sem gefur{' '}
            <strong>{((1 / multiplier) * 100).toFixed(2).replace('.', ',')}% úttektarhlutfall</strong>.
            Þetta gæti verið of árásargjarnt fyrir Ísland.
          </p>

          <div className="bg-warning-100 rounded-md p-3 space-y-2">
            <p className="font-medium text-warning-900">
              Hvers vegna er þetta áhættusamt á Íslandi?
            </p>
            <ul className="list-disc pl-5 space-y-1 text-warning-800">
              <li>
                <strong>Hærri verðbólga:</strong> Ísland hefur söguleg hærri verðbólgu
                (3-4%) en Bandaríkin (2-3%)
              </li>
              <li>
                <strong>Gjaldeyrisáhætta:</strong> ISK er lítill gjaldmiðill sem getur
                sveiflast mikið
              </li>
              <li>
                <strong>Minni markaður:</strong> Takmarkað úrval fjárfestinga á Íslandi
                og gjaldeyrisáhætta erlendis
              </li>
            </ul>
          </div>

          <div className="bg-success-50 border border-success-200 rounded-md p-3">
            <p className="font-medium text-success-900 mb-1">
              Okkar ráðlegging fyrir Ísland:
            </p>
            <p className="text-success-800">
              Notaðu <strong>30x til 33x margfaldara</strong> (3,0-3,33% úttekt).
              Þetta gefur þér öryggi gegn verðbólgu og óvissu í framtíðinni,
              og tryggir að fjármunirnir þínir endist alla ævi.
            </p>
          </div>
        </div>

        {/* Actions */}
        {onLearnMore && (
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onLearnMore}
              className="text-warning-800 hover:bg-warning-100"
            >
              Læra meira um FI í íslensku samhengi
            </Button>
          </div>
        )}
      </div>
    </Alert>
  );
};
