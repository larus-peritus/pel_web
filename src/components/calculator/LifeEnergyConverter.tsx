'use client';

import { useState, useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { dollarsToLifeEnergy, formatLifeEnergy } from '@/lib/calculations';
import { formatNumber } from '@/lib/utils';

// Quick amount buttons in ISK
const QUICK_AMOUNTS = [5000, 10000, 50000, 100000];

/**
 * Interactive life energy converter
 * Enter an amount to see how many hours of life energy it represents
 */
export function LifeEnergyConverter() {
  const { results } = useCalculator();
  const [amount, setAmount] = useState<number>(10000);

  const lifeEnergyHours = useMemo(() => {
    if (!results || results.actualHourlyWage <= 0) return 0;
    return dollarsToLifeEnergy(amount, results.actualHourlyWage);
  }, [amount, results]);

  if (!results) {
    return null;
  }

  const formattedTime = formatLifeEnergy(lifeEnergyHours);

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Lífsorku reiknivél
        </h3>
        <p className="text-sm text-neutral-600">
          Sjáðu hvað kaup kostar þig í lífstíma
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount input */}
        <div>
          <label htmlFor="converter-amount" className="block text-sm font-medium text-neutral-700 mb-1">
            Sláðu inn upphæð
          </label>
          <CurrencyInput
            id="converter-amount"
            value={amount}
            onChange={setAmount}
            placeholder="10.000"
          />
        </div>

        {/* Quick amount buttons */}
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <Button
              key={quickAmount}
              variant={amount === quickAmount ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setAmount(quickAmount)}
            >
              {formatNumber(quickAmount)} kr
            </Button>
          ))}
        </div>

        {/* Result display */}
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-600 mb-1">
            Þetta kostar þig
          </p>
          <p className="text-2xl font-bold text-primary-700">
            {formattedTime}
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            af lífsorku þinni
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
