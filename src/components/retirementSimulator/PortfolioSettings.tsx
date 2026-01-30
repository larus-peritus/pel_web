'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Alert } from '@/components/ui/Alert';
import {
  EXPECTED_RETURN_RANGE,
  INFLATION_RATE_RANGE,
  RETURN_VOLATILITY_RANGE,
  RETURN_RATE_ASSUMPTIONS,
} from '@/lib/constants/retirementSimulator';

export interface PortfolioSettingsProps {
  expectedReturn: number;
  volatility: number;
  inflationRate: number;
  onExpectedReturnChange: (value: number) => void;
  onVolatilityChange: (value: number) => void;
  onInflationRateChange: (value: number) => void;
}

/**
 * Portfolio Settings Component
 *
 * Investment assumptions for Monte Carlo simulation:
 * - Expected real return (after inflation)
 * - Return volatility (standard deviation)
 * - Inflation rate
 *
 * Includes presets for common portfolio types (Iceland equity, global equity, balanced)
 */
export function PortfolioSettings({
  expectedReturn,
  volatility,
  inflationRate,
  onExpectedReturnChange,
  onVolatilityChange,
  onInflationRateChange,
}: PortfolioSettingsProps) {
  const showHighReturnWarning =
    expectedReturn > EXPECTED_RETURN_RANGE.WARNING_THRESHOLD;

  /**
   * Apply preset portfolio assumptions
   */
  const applyPreset = (preset: keyof typeof RETURN_RATE_ASSUMPTIONS) => {
    const settings = RETURN_RATE_ASSUMPTIONS[preset];
    onExpectedReturnChange(settings.realReturn);
    onVolatilityChange(settings.volatility);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Forsendur eignasafns
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Vænt ávöxtun, sveiflur og verðbólga
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Presets */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Forsendur fyrir eignasafn
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('GLOBAL_EQUITY')}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-left"
            >
              <div className="font-medium text-neutral-900">
                Alþjóðlegt
              </div>
              <div className="text-xs text-neutral-600">7% / 18%</div>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('ICELAND_EQUITY')}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-left"
            >
              <div className="font-medium text-neutral-900">
                Íslenskt
              </div>
              <div className="text-xs text-neutral-600">6.5% / 22%</div>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('BALANCED')}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-left"
            >
              <div className="font-medium text-neutral-900">
                Blandað (60/40)
              </div>
              <div className="text-xs text-neutral-600">5.5% / 12%</div>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('CONSERVATIVE')}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-left"
            >
              <div className="font-medium text-neutral-900">
                Íhaldssamt
              </div>
              <div className="text-xs text-neutral-600">4% / 8%</div>
            </button>
          </div>
        </div>

        {/* Expected Return Slider */}
        <Slider
          label="Vænt raunávöxtun (eftir verðbólgu)"
          value={expectedReturn}
          onChange={onExpectedReturnChange}
          min={EXPECTED_RETURN_RANGE.MIN}
          max={EXPECTED_RETURN_RANGE.MAX}
          step={0.005}
          showValue
          formatValue={(v) => `${(v * 100).toFixed(1)}%`}
        />

        {/* Volatility Slider */}
        <Slider
          label="Sveiflur ávöxtunar (staðalfrávik)"
          value={volatility}
          onChange={onVolatilityChange}
          min={RETURN_VOLATILITY_RANGE.MIN}
          max={RETURN_VOLATILITY_RANGE.MAX}
          step={0.01}
          showValue
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        />

        {/* Inflation Rate Slider */}
        <Slider
          label="Verðbólga"
          value={inflationRate}
          onChange={onInflationRateChange}
          min={INFLATION_RATE_RANGE.MIN}
          max={INFLATION_RATE_RANGE.MAX}
          step={0.005}
          showValue
          formatValue={(v) => `${(v * 100).toFixed(1)}%`}
        />

        {/* High Return Warning */}
        {showHighReturnWarning && (
          <Alert variant="warning">
            <div>
              <h4 className="font-semibold mb-1">
                Ótækur í söguleg samhengi
              </h4>
              <p className="text-sm">
                {(expectedReturn * 100).toFixed(1)}% raunávöxtun er hærri en sögulegt
                meðaltal flestra markaða. Íhugaðu að nota íhaldssamari forsendur
                (7-8% eða lægri) fyrir raunsærri áætlun.
              </p>
            </div>
          </Alert>
        )}

        {/* Explanation */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm space-y-2">
          <div>
            <strong className="text-neutral-900">Raunávöxtun:</strong>
            <p className="text-neutral-600">
              Ávöxtun eftir verðbólgu. 7% raunávöxtun með 3% verðbólgu = 10% nafnávöxtun.
            </p>
          </div>
          <div>
            <strong className="text-neutral-900">Sveiflur:</strong>
            <p className="text-neutral-600">
              Mælir hversu mikið ávöxtun sveiflast. Hærri sveiflur = meiri óvissa en
              einnig möguleiki á hærri ávöxtun.
            </p>
          </div>
          <div>
            <strong className="text-neutral-900">Verðbólga:</strong>
            <p className="text-neutral-600">
              Sögulegt meðaltal á Íslandi er 3-4%. Hærri verðbólga þýðir að
              eignasafnið þarf að vaxa hraðar til að viðhalda kaupmætti.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">
            Samantekt
          </h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Raunávöxtun:</span>
              <span className="font-semibold">
                {(expectedReturn * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Verðbólga:</span>
              <span className="font-semibold">
                {(inflationRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Nafnávöxtun:</span>
              <span className="font-semibold">
                {((expectedReturn + inflationRate) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sveiflur:</span>
              <span className="font-semibold">
                {(volatility * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
