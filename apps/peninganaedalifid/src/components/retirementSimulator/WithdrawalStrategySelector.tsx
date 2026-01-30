'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Alert } from '@/components/ui/Alert';
import type { WithdrawalStrategy } from '@/types/retirementSimulator';
import { WITHDRAWAL_STRATEGY_PRESETS } from '@/lib/constants/retirementSimulator';

export interface WithdrawalStrategySelectorProps {
  strategy: WithdrawalStrategy;
  onStrategyChange: (strategy: WithdrawalStrategy) => void;
}

type StrategyType = '4percent' | 'variable' | 'guardrails';

/**
 * Withdrawal Strategy Selector Component
 *
 * Allows user to choose between different withdrawal strategies:
 * - 4% Rule: Fixed inflation-adjusted withdrawals
 * - Variable Spending: Percentage of current portfolio
 * - Guardrails: Adjust spending based on portfolio thresholds
 */
export function WithdrawalStrategySelector({
  strategy,
  onStrategyChange,
}: WithdrawalStrategySelectorProps) {
  const [selectedType, setSelectedType] = useState<StrategyType>(strategy.type as StrategyType);

  const handleTypeChange = (type: StrategyType) => {
    setSelectedType(type);

    switch (type) {
      case '4percent':
        onStrategyChange({
          type: '4percent',
          rate: 0.04,
          inflationAdjusted: true,
        });
        break;
      case 'variable':
        onStrategyChange({
          type: 'variable',
          percentageOfPortfolio: 0.04,
        });
        break;
      case 'guardrails':
        onStrategyChange({
          type: 'guardrails',
          baseWithdrawal: 0,
          upperGuardrail: 1.3,
          lowerGuardrail: 0.8,
          adjustmentPercent: 0.1,
        });
        break;
    }
  };

  const handle4PercentRateChange = (rate: number) => {
    if (strategy.type === '4percent') {
      onStrategyChange({
        ...strategy,
        rate,
      });
    }
  };

  const handleVariablePercentageChange = (percentage: number) => {
    if (strategy.type === 'variable') {
      onStrategyChange({
        ...strategy,
        percentageOfPortfolio: percentage,
      });
    }
  };

  const handleGuardrailsChange = (field: string, value: number) => {
    if (strategy.type === 'guardrails') {
      onStrategyChange({
        ...strategy,
        [field]: value,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Úttektarstefna
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Hvernig tekur þú peninga úr eignasafninu
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy Type Selector */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Veldu stefnu
          </h3>
          <div className="space-y-2">
            {/* 4% Rule */}
            <button
              type="button"
              onClick={() => handleTypeChange('4percent')}
              className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-all ${
                selectedType === '4percent'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="font-semibold text-neutral-900">
                4% reglan
              </div>
              <div className="text-sm text-neutral-600">
                Fasta úttekt byggt á upphafsstöðu (verðtryggð)
              </div>
            </button>

            {/* Variable Spending */}
            <button
              type="button"
              onClick={() => handleTypeChange('variable')}
              className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-all ${
                selectedType === 'variable'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="font-semibold text-neutral-900">
                Breytileg útgjöld
              </div>
              <div className="text-sm text-neutral-600">
                Aðlaga úttektir eftir núverandi stöðu safns
              </div>
            </button>

            {/* Guardrails */}
            <button
              type="button"
              onClick={() => handleTypeChange('guardrails')}
              className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-all ${
                selectedType === 'guardrails'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="font-semibold text-neutral-900">
                Girðingar
              </div>
              <div className="text-sm text-neutral-600">
                Auka/minnka útgjöld þegar safn fer yfir/undir mörk
              </div>
            </button>
          </div>
        </div>

        {/* Strategy-specific Settings */}
        <div className="border-t border-neutral-200 pt-6">
          {selectedType === '4percent' && strategy.type === '4percent' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">
                4% regla stillingar
              </h3>
              <Slider
                label="Úttektarhlutfall"
                value={strategy.rate}
                onChange={handle4PercentRateChange}
                min={0.02}
                max={0.06}
                step={0.001}
                showValue
                formatValue={(v) => `${(v * 100).toFixed(1)}%`}
              />
              <Alert variant="info">
                <p className="text-sm">
                  Fyrsta árið tekur þú {(strategy.rate * 100).toFixed(1)}% af
                  eignasafninu. Árin þar á eftir aðlagar þú upphæðina fyrir verðbólgu.
                  Byggist á Trinity Study rannsókninni.
                </p>
              </Alert>
            </div>
          )}

          {selectedType === 'variable' && strategy.type === 'variable' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">
                Breytilegar útgjöld stillingar
              </h3>
              <Slider
                label="Hlutfall af safni"
                value={strategy.percentageOfPortfolio}
                onChange={handleVariablePercentageChange}
                min={0.02}
                max={0.06}
                step={0.001}
                showValue
                formatValue={(v) => `${(v * 100).toFixed(1)}%`}
              />
              <Alert variant="info">
                <p className="text-sm">
                  Á hverju ári tekur þú {(strategy.percentageOfPortfolio * 100).toFixed(1)}%
                  af núverandi stöðu safnsins. Þetta þýðir að útgjöld þín lækka ef
                  safnið gengur illa og hækka ef það gengur vel.
                </p>
              </Alert>
            </div>
          )}

          {selectedType === 'guardrails' && strategy.type === 'guardrails' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">
                Girðingar stillingar
              </h3>
              <Slider
                label="Efri girðing (% af upphafslegri stöðu)"
                value={strategy.upperGuardrail}
                onChange={(v) => handleGuardrailsChange('upperGuardrail', v)}
                min={1.1}
                max={1.5}
                step={0.05}
                showValue
                formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <Slider
                label="Neðri girðing (% af upphafslegri stöðu)"
                value={strategy.lowerGuardrail}
                onChange={(v) => handleGuardrailsChange('lowerGuardrail', v)}
                min={0.5}
                max={0.9}
                step={0.05}
                showValue
                formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <Slider
                label="Leiðrétting þegar farið er yfir girðingar"
                value={strategy.adjustmentPercent}
                onChange={(v) => handleGuardrailsChange('adjustmentPercent', v)}
                min={0.05}
                max={0.2}
                step={0.01}
                showValue
                formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <Alert variant="info">
                <p className="text-sm">
                  Byrjar með föstum upphæðum. Ef eignasafnið fer yfir{' '}
                  {(strategy.upperGuardrail * 100).toFixed(0)}% af upphaflegu
                  gildi, eykur þú útgjöld um {(strategy.adjustmentPercent * 100).toFixed(0)}%.
                  Ef það fer niður fyrir {(strategy.lowerGuardrail * 100).toFixed(0)}%,
                  lækkar þú útgjöld um {(strategy.adjustmentPercent * 100).toFixed(0)}%.
                </p>
              </Alert>
            </div>
          )}
        </div>

        {/* Strategy Comparison */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-semibold text-neutral-900 mb-2">
            Samanburður á stefnum
          </h4>
          <div className="space-y-1">
            <p>
              <strong>4% regla:</strong> Mest fyrirsjáanlegar tekjur, en minni
              sveigjanleiki
            </p>
            <p>
              <strong>Breytileg útgjöld:</strong> Mest sveigjanleiki, minni líkur á
              að tæmast en breytilegar tekjur
            </p>
            <p>
              <strong>Girðingar:</strong> Jafnvægi á milli, aðlagar útgjöld aðeins
              þegar þörf krefur
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
