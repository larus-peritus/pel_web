'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  STANDARD_MULTIPLIERS,
  MULTIPLIER_RANGE,
  MULTIPLIER_DESCRIPTIONS,
  MULTIPLIER_WITHDRAWAL_RATES,
  getWithdrawalRate,
  isStandardMultiplier,
  needsMultiplierWarning,
} from '@/lib/constants/fiNumber';
import type { StandardMultiplier } from '@/types/fiNumber';

/**
 * MultiplierSelector Component Props
 */
export interface MultiplierSelectorProps {
  /** Current multiplier value (25, 30, 33, or custom) */
  multiplier: number;
  /** Callback when multiplier changes */
  onMultiplierChange: (multiplier: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MultiplierButton Component
 *
 * Individual button for standard multiplier selection with badge indicator.
 */
interface MultiplierButtonProps {
  multiplier: StandardMultiplier;
  isSelected: boolean;
  onClick: () => void;
}

const MultiplierButton: React.FC<MultiplierButtonProps> = ({
  multiplier,
  isSelected,
  onClick,
}) => {
  const withdrawalRate = MULTIPLIER_WITHDRAWAL_RATES[multiplier];
  const withdrawalRatePercent = (withdrawalRate * 100).toFixed(2);

  // Badge configuration for each multiplier
  const getBadge = (m: StandardMultiplier) => {
    switch (m) {
      case 25:
        return {
          text: 'Áhættusamt',
          variant: 'warning' as const,
          show: true,
        };
      case 30:
        return {
          text: 'Mælt með',
          variant: 'success' as const,
          show: true,
        };
      case 33:
        return {
          text: 'Varfærið',
          variant: 'info' as const,
          show: true,
        };
      default:
        return { text: '', variant: 'neutral' as const, show: false };
    }
  };

  const badge = getBadge(multiplier);

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={isSelected ? 'primary' : 'secondary'}
        size="lg"
        onClick={onClick}
        className={cn(
          'flex-col h-auto py-4 px-6 gap-1',
          isSelected && 'ring-2 ring-primary-500 ring-offset-2'
        )}
        aria-pressed={isSelected}
      >
        <span className="text-2xl font-bold">{multiplier}x</span>
        <span className="text-sm font-normal opacity-80">
          {withdrawalRatePercent.replace('.', ',')}% úttekt
        </span>
      </Button>
      {badge.show && (
        <div className="flex justify-center">
          <Badge variant={badge.variant} size="sm">
            {badge.text}
          </Badge>
        </div>
      )}
    </div>
  );
};

/**
 * MultiplierSelector Component
 *
 * Allows user to select FI multiplier (25x, 30x, 33x, or custom).
 * Shows withdrawal rate for each option with badge indicators.
 * Includes custom slider for 20x-50x range.
 * Collapsible explanation section about multipliers.
 *
 * Icelandic-first design:
 * - 30x recommended (vs US standard 25x)
 * - Warning badge on 25x (risky for Iceland)
 * - All text in Icelandic
 */
export const MultiplierSelector: React.FC<MultiplierSelectorProps> = ({
  multiplier,
  onMultiplierChange,
  className,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [useCustom, setUseCustom] = useState(!isStandardMultiplier(multiplier));
  const [customValue, setCustomValue] = useState(
    isStandardMultiplier(multiplier) ? 35 : multiplier
  );

  // Handle standard multiplier selection
  const handleStandardSelect = (value: StandardMultiplier) => {
    setUseCustom(false);
    onMultiplierChange(value);
  };

  // Handle custom slider change
  const handleCustomChange = (value: number) => {
    setCustomValue(value);
    setUseCustom(true);
    onMultiplierChange(value);
  };

  // Toggle custom mode
  const handleToggleCustom = () => {
    if (!useCustom) {
      // Switching to custom
      setUseCustom(true);
      onMultiplierChange(customValue);
    } else {
      // Switching back to standard - select 30x (recommended)
      setUseCustom(false);
      onMultiplierChange(30);
    }
  };

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Veldu FI margfaldara
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          FI talan er árleg útgjöld × margfaldari
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Standard Multiplier Buttons */}
        <div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {STANDARD_MULTIPLIERS.map((m) => (
              <MultiplierButton
                key={m}
                multiplier={m}
                isSelected={!useCustom && multiplier === m}
                onClick={() => handleStandardSelect(m)}
              />
            ))}
          </div>
        </div>

        {/* Custom Multiplier Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">
              Sérsniðið gildi
            </label>
            <button
              type="button"
              onClick={handleToggleCustom}
              className={cn(
                'text-sm font-medium transition-colors',
                useCustom
                  ? 'text-primary-600 hover:text-primary-700'
                  : 'text-neutral-700 hover:text-neutral-700'
              )}
            >
              {useCustom ? 'Í notkun' : 'Nota sérsniðið'}
            </button>
          </div>

          <Slider
            value={useCustom ? multiplier : customValue}
            onChange={handleCustomChange}
            min={MULTIPLIER_RANGE.MIN}
            max={MULTIPLIER_RANGE.MAX}
            step={1}
            showValue={true}
            formatValue={(v) => `${v}x (${(getWithdrawalRate(v) * 100).toFixed(2).replace('.', ',')}%)`}
            className="mt-2"
            aria-label="Sérsniðinn margfaldari"
          />

          <div className="flex justify-between text-xs text-neutral-700">
            <span>{MULTIPLIER_RANGE.MIN}x (árásargjarn)</span>
            <span>{MULTIPLIER_RANGE.MAX}x (mjög íhaldssöm)</span>
          </div>
        </div>

        {/* Warning for low multiplier */}
        {needsMultiplierWarning(multiplier) && (
          <div className="rounded-lg bg-warning-50 border border-warning-200 p-4">
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-warning-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-warning-800">
                  Varúð fyrir Ísland
                </h4>
                <p className="text-sm text-warning-700 mt-1">
                  Vegna hærri verðbólgu á Íslandi (3-4% á móti 2-3% í Bandaríkjunum)
                  mælum við með 30x eða 33x margfaldara fyrir öruggari FI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Explanation */}
        <div className="border-t border-neutral-200 pt-4">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-left"
            aria-expanded={showExplanation}
            aria-controls="multiplier-explanation"
          >
            <span className="text-sm font-medium text-neutral-700">
              Frekari útskýringar um margfaldara
            </span>
            <svg
              className={cn(
                'w-5 h-5 text-neutral-700 transition-transform duration-200',
                showExplanation && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showExplanation && (
            <div
              id="multiplier-explanation"
              className="mt-4 space-y-4 text-sm text-neutral-600"
            >
              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">
                  Hvað er margfaldari?
                </h4>
                <p>
                  Margfaldarinn ákvarðar hversu stóra fjármuni þú þarft til að
                  ná fjárhagslegu frelsi. Formúlan er: FI tala = Árleg útgjöld × Margfaldari.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">
                  Hvað er úttektarhlutfall?
                </h4>
                <p>
                  Úttektarhlutfallið er hlutfallið af heildarfjármunum sem þú tekur
                  út árlega. Til dæmis: 4% úttekt = 25x margfaldari (1 ÷ 0,04 = 25).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">
                  Hvers vegna 30x fyrir Ísland?
                </h4>
                <p>
                  Ísland hefur átt við hærri verðbólgu að etja en t.d. Bandaríkin.
                  Lægra úttektarhlutfall (3,33% í stað 4%) veitir meiri öryggi
                  gegn verðbólguáhrifum og tryggir að fjármunirnir endast
                  alla ævi.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">
                  Þekkt rannsóknir
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Trinity Study (1998):</strong> Grunnur að 4% reglunni
                    (25x margfaldari) byggði á bandarískum gögnum 1926-1995.
                  </li>
                  <li>
                    <strong>Íslensk samhengi:</strong> Þar sem verðbólga hefur
                    verið hærri hér ráðleggjum við 3-3,33% úttekt (30x-33x margfaldari).
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
