'use client';

/**
 * Extra Payment Card Component for Snowball Calculator
 * Displays input for monthly extra payment with life energy equivalent
 */

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { formatNumber } from '@/lib/utils/formatters';

interface ExtraPaymentCardProps {
  /** Monthly extra payment amount in ISK */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** User's actual hourly wage for life energy calculation (optional) */
  actualHourlyWage?: number;
  /** Validation error message (optional) */
  error?: string;
}

export function ExtraPaymentCard({
  value,
  onChange,
  actualHourlyWage = 0,
  error,
}: ExtraPaymentCardProps) {
  // Calculate life energy equivalent
  const lifeEnergyHours = actualHourlyWage > 0 ? value / actualHourlyWage : 0;

  // Format life energy display
  const formatLifeEnergy = (hours: number): string => {
    if (hours === 0) return '0 klst';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} mín`;
    }
    if (hours < 24) {
      return `${formatNumber(hours)} klst`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    if (remainingHours === 0) {
      return `${days} ${days === 1 ? 'dagur' : 'dagar'}`;
    }
    return `${days} ${days === 1 ? 'dagur' : 'dagar'} og ${remainingHours} klst`;
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Aukagreiðsla</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upphæð sem þú vilt borga umfram lágmarksgreiðslu á mánuði
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Extra Payment Input */}
          <CurrencyInput
            label="Mánaðarleg aukagreiðsla"
            value={value}
            onChange={onChange}
            helpText="Þessi upphæð bætist við venjulega greiðslu þína og lækkar höfuðstól hraðar"
            error={error}
          />

          {/* Life Energy Display */}
          {actualHourlyWage > 0 && value > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-medium text-purple-900">
                    Lífsorka mánaðarlega
                  </div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {formatLifeEnergy(lifeEnergyHours)}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Vinnutími sem þarf til að vinna þessa aukagreiðslu
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Missing Wage Warning */}
          {actualHourlyWage === 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
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
                <div className="text-sm text-yellow-800">
                  <strong>Athugið:</strong> Reiknaðu raunverulegt tímakaup þitt til að sjá
                  lífsorkusamanburð.
                </div>
              </div>
            </div>
          )}

          {/* Explanation Box */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Hvað er aukagreiðsla?
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Bætist við venjulega greiðslu þína</li>
              <li>Lækkar höfuðstól lánsins hraðar</li>
              <li>Skapar vaxtasparnað næsta mánuð</li>
              <li>Þennan sparnað er hægt að snjóbolta (fjárfesta eða borga á lánið)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
