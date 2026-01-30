import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export interface BaselinePromptProps {
  /**
   * Optional custom message override
   */
  message?: string;
  /**
   * Optional custom link URL
   */
  linkTo?: string;
  /**
   * Optional custom button text
   */
  buttonText?: string;
  /**
   * Optional callback instead of navigation
   */
  onSetup?: () => void;
}

/**
 * BaselinePrompt - Alert component prompting user to set up expense baseline
 *
 * Displays an info alert explaining the user needs to set up their expense baseline
 * before they can use certain features (FI Number calculator, Savings Rate, etc.)
 *
 * Features:
 * - Info alert variant
 * - Clear message in Icelandic
 * - Button linking to expense baseline setup page
 * - Can be embedded in other calculators
 * - Customizable message and link
 *
 * @example
 * ```tsx
 * // Default usage
 * <BaselinePrompt />
 *
 * // Custom message and link
 * <BaselinePrompt
 *   message="Þú þarft að setja upp útgjaldagrunn til að reikna FI töluna þína"
 *   linkTo="/fi-number"
 *   buttonText="Fara í uppsetningu"
 * />
 *
 * // With callback
 * <BaselinePrompt onSetup={() => router.push('/utgjaldareiknivel')} />
 * ```
 */
export function BaselinePrompt({
  message = 'Þú hefur ekki sett upp útgjaldagrunn',
  linkTo = '/utgjaldareiknivel',
  buttonText = 'Setja upp útgjaldagrunn',
  onSetup,
}: BaselinePromptProps) {
  const handleClick = () => {
    if (onSetup) {
      onSetup();
    }
  };

  return (
    <Alert variant="info">
      <div className="space-y-3">
        <p className="font-medium">{message}</p>
        <p className="text-sm">
          Útgjaldagrunnurinn er grunnurinn að FIRE áætluninni þinni. Þú skilgreinir mánaðarleg útgjöld
          þín á þremur stigum - Lágmarks, Þægilegt og Lúxus - og þessi tala verður notuð í öðrum reiknivélum.
        </p>
        {onSetup ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleClick}
          >
            {buttonText}
          </Button>
        ) : (
          <a href={linkTo}>
            <Button
              variant="primary"
              size="sm"
            >
              {buttonText}
            </Button>
          </a>
        )}
      </div>
    </Alert>
  );
}
