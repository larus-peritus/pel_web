/**
 * SplurgeBudget - Annual discretionary spending component
 *
 * Features:
 * - Annual splurge budget input
 * - Preset suggestions (modest, comfortable, generous)
 * - Monthly breakdown display
 * - Examples of what it could be used for
 * - Impact visualization
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  SPLURGE_PRESETS,
  FATFIRE_TOOLTIPS,
} from '@/lib/constants/fatFire';
import { formatCurrency } from '@/lib/utils/formatters';

export function SplurgeBudget() {
  const { fatFireState, updateFatFireState } = useCalculator();

  if (!fatFireState) return null;

  const splurgeBudgetAnnual = fatFireState.splurgeBudgetAnnual;
  const splurgeBudgetMonthly = splurgeBudgetAnnual / 12;
  const splurgeBudgetWeekly = splurgeBudgetAnnual / 52;

  const handleSplurgeBudgetChange = (value: number) => {
    updateFatFireState({
      splurgeBudgetAnnual: value,
    });
  };

  const handlePresetClick = (presetValue: number) => {
    updateFatFireState({
      splurgeBudgetAnnual: presetValue,
    });
  };

  return (
    <Card variant="elevated" className="border-amber-200">
      <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">
              Aukaútgjaldaáætlun{' '}
              <Tooltip content={FATFIRE_TOOLTIPS.SPLURGE_BUDGET}>
                <span className="text-xs text-gray-700">ℹ️</span>
              </Tooltip>
            </h2>
            <p className="mt-1 text-sm text-amber-700">
              Árleg áætlun fyrir sjálfsprottnar lúxusvörur án sektarkenndar
            </p>
          </div>
          <span className="text-3xl">🎁</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Annual Input */}
        <NumberInput
          label="Árleg aukaútgjaldaáætlun"
          value={splurgeBudgetAnnual}
          onChange={handleSplurgeBudgetChange}
          min={0}
          suffix="kr"
          helpText="Fyrir ferðir, stór kaup, upplifanir, gjafir, o.fl."
        />

        {/* Presets */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tillögur
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SPLURGE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetClick(preset.value)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  splurgeBudgetAnnual === preset.value
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{preset.label}</p>
                <p className="mt-1 text-sm font-medium text-amber-600">
                  {preset.description}
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  {preset.examples}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown Display */}
        {splurgeBudgetAnnual > 0 && (
          <div className="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
            <h3 className="mb-3 font-semibold text-amber-900">
              Skipting
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-800">Á mánuði:</span>
                <span className="font-semibold text-amber-900">
                  {formatCurrency(splurgeBudgetMonthly)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-800">Á viku:</span>
                <span className="font-semibold text-amber-900">
                  {formatCurrency(splurgeBudgetWeekly)}
                </span>
              </div>
              <div className="border-t-2 border-amber-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-amber-900">Á ári:</span>
                  <span className="text-lg font-bold text-amber-900">
                    {formatCurrency(splurgeBudgetAnnual)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="rounded-lg border border-amber-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-amber-900">
            Dæmi um notkun 💡
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">✈️</span>
              <span>
                <strong>Alþjóðlegar ferðir:</strong> Fyrsta flokk til
                Evrópu, lúxushótel
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">🎁</span>
              <span>
                <strong>Stór kaup:</strong> Ný tölva, síminn, húsgögn,
                tækjabúnaður
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">🎭</span>
              <span>
                <strong>Upplifanir:</strong> Tónleikar, sýningar,
                íþróttaviðburðir
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">🎉</span>
              <span>
                <strong>Sérstakir tilefni:</strong> Afmæli, hátíðir,
                fjölskyldusamkomur
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">💎</span>
              <span>
                <strong>Lúxusvörur:</strong> Fatnaður, skartgripir,
                list, o.fl.
              </span>
            </li>
          </ul>
        </div>

        {/* Philosophy Note */}
        <div className="rounded-lg border-2 border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 p-4">
          <p className="text-sm text-amber-900">
            <strong>💡 FatFIRE hugmyndafræði:</strong> Aukaútgjaldaáætlun er
            fyrir sjálfsprottnar lúxusvörur án sektarkenndar. Þetta er ekki
            sparnaðarbúskapur - þetta er um að lifa fullkomlega án
            fjárhagslegra áhyggna!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
