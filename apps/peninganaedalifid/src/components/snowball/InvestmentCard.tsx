'use client';

/**
 * Investment Assumptions Card Component for Snowball Calculator
 * Provides input for expected annual investment return with guidance and warnings
 */

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import {
  DEFAULT_INVESTMENT_RETURN,
  INVESTMENT_RETURN_RANGE,
  isInvestmentReturnUnrealistic,
} from '@/lib/constants/snowball';

interface InvestmentCardProps {
  /** Expected annual investment return as decimal (e.g., 0.07 for 7%) */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Whether to include post-payoff investing in calculations */
  includePostPayoffInvesting: boolean;
  /** Callback when post-payoff investing toggle changes */
  onPostPayoffInvestingChange: (value: boolean) => void;
  /** Validation error message (optional) */
  error?: string;
}

export function InvestmentCard({
  value,
  onChange,
  includePostPayoffInvesting,
  onPostPayoffInvestingChange,
  error,
}: InvestmentCardProps) {
  // Check if return is unrealistically high
  const isUnrealistic = isInvestmentReturnUnrealistic(value);

  // Convert to percentage for display
  const percentageValue = value * 100;

  // Handle change - convert percentage back to decimal
  const handleChange = (percentageVal: number) => {
    onChange(percentageVal / 100);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Fjárfestingarforsendur</h2>
        <p className="text-sm text-gray-600 mt-1">
          Áætluð ávöxtun ef þú fjárfestir vaxtasparnaðinn í stað þess að borga á lánið
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Investment Return Input */}
          <NumberInput
            label="Vænt árleg ávöxtun (%)"
            value={percentageValue}
            onChange={handleChange}
            min={INVESTMENT_RETURN_RANGE.min * 100}
            max={INVESTMENT_RETURN_RANGE.max * 100}
            step={0.5}
            helpText="Sögulegt meðaltal hlutabréfamarkaða er um 7-8% á ári til lengri tíma"
            error={error}
          />

          {/* Post-Payoff Investing Toggle */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="postPayoffInvesting"
                checked={includePostPayoffInvesting}
                onChange={(e) => onPostPayoffInvestingChange(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="postPayoffInvesting"
                  className="text-sm font-semibold text-purple-900 cursor-pointer"
                >
                  Fjárfesta eftir að lán er greitt upp
                </label>
                <p className="text-xs text-purple-700 mt-1">
                  Þegar lánið er greitt upp, heldur þú áfram að fjárfesta sömu upphæð (grunngreiðsla +
                  aukagreiðsla) í stað þess að borga á lán. Þetta sýnir sanngjarnari samanburð á
                  aðferðunum þar sem <strong>Snjóbolti → Lán</strong> borgar upp lánið fyrr og hefur
                  þar með fleiri mánuði til að fjárfesta.
                </p>
              </div>
            </div>
          </div>

          {/* Default Recommendation */}
          {percentageValue === DEFAULT_INVESTMENT_RETURN * 100 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <strong>Ábending:</strong> 7% er sögulegt langtímameðaltal fyrir alþjóðleg
                  hlutabréfavísitölur (S&P 500, MSCI World) að teknu tilliti til verðbólgu.
                </div>
              </div>
            </div>
          )}

          {/* Unrealistic Return Warning */}
          {isUnrealistic && (
            <Alert variant="warning">
              <strong>Athugið:</strong> Ávöxtun yfir{' '}
              {INVESTMENT_RETURN_RANGE.warningThreshold * 100}% er óvenjulega há og óvissa. Það eru
              fáir sem ná slíkri ávöxtun til langs tíma. Íhugaðu að nota raunsærri tölu fyrir
              áreiðanlegri niðurstöður.
            </Alert>
          )}

          {/* Explanation Box */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Nokkrar leiðbeiningar um ávöxtun:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 font-bold">•</span>
                <span>
                  <strong>Íhaldssöm (4-5%):</strong> Skuldabréf, verðtryggð innlán
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">•</span>
                <span>
                  <strong>Hófleg (6-8%):</strong> Fjölbreytt hlutabréfasafn til langs tíma
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2 font-bold">•</span>
                <span>
                  <strong>Ágeng (9-12%):</strong> Einblínir á hlutabréf með meiri áhættu
                </span>
              </li>
            </ul>
          </div>

          {/* Historical Context */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-900">
              <strong>Söguleg ávöxtun:</strong>
              <ul className="mt-2 space-y-1">
                <li>• S&P 500 (1926-2023): ~10% að meðaltali (7% að verðbólgu frádreginni)</li>
                <li>• MSCI World (1970-2023): ~9-10% að meðaltali</li>
                <li>• Íslenskur hlutabréfamarkaður: breytilegri, ~6-8% til lengri tíma</li>
              </ul>
              <p className="mt-2 text-xs text-green-700">
                <strong>Athugið:</strong> Fyrri ávöxtun er engin trygging fyrir framtíðarávöxtun.
                Hlutabréf geta tapað verðmæti til skamms tíma.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
