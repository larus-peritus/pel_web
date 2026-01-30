'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FI_STRINGS } from '@/lib/constants/icelandic';

interface SavingsRateSliderProps {
  currentRate: number;
  targetRate: number;
  onChange: (rate: number) => void;
  min?: number;
  max?: number;
}

/**
 * Savings Rate Slider Component
 *
 * Main slider control with:
 * - Dual display (current vs target)
 * - Quick adjust buttons (+5%, +10%, +15%)
 * - Numeric input alternative
 * - Visual markers for reference points
 */
export function SavingsRateSlider({
  currentRate,
  targetRate,
  onChange,
  min = 0,
  max = 100,
}: SavingsRateSliderProps) {
  const [localValue, setLocalValue] = useState(targetRate);

  // Sync with prop changes
  useEffect(() => {
    setLocalValue(targetRate);
  }, [targetRate]);

  // Debounced onChange (updates parent after 100ms of no changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== targetRate) {
        onChange(localValue);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [localValue, targetRate, onChange]);

  const handleSliderChange = (value: number) => {
    setLocalValue(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.max(min, Math.min(max, value));
    setLocalValue(clampedValue);
  };

  const handleQuickAdjust = (adjustment: number) => {
    const newValue = Math.max(min, Math.min(max, currentRate + adjustment));
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleReset = () => {
    setLocalValue(currentRate);
    onChange(currentRate);
  };

  const difference = localValue - currentRate;

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">
              {FI_STRINGS.slider.savingsRate}
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Stilltu sparnaðarhlutfall til að sjá áhrif á FI dagsetningu
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-700">
              {localValue.toFixed(0)}%
            </div>
            {difference !== 0 && (
              <div className={`text-sm font-medium ${difference > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {difference > 0 ? '+' : ''}{difference.toFixed(0)}% frá núverandi
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current vs Target Display */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-neutral-200">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                {FI_STRINGS.slider.current}
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                {currentRate.toFixed(1)}%
              </p>
            </div>
            <div className="border-l border-neutral-200 pl-4">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                {FI_STRINGS.slider.target}
              </p>
              <p className="text-2xl font-bold text-primary-700">
                {localValue.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Main Slider */}
          <div className="px-2">
            <Slider
              value={localValue}
              onChange={handleSliderChange}
              min={min}
              max={max}
              step={1}
              formatValue={(value) => `${value.toFixed(0)}%`}
              showValue={false}
              className="min-h-[44px]" // Touch-friendly
              aria-label="Sparnaðarhlutfall"
            />

            {/* Reference markers */}
            <div className="relative mt-2 h-6">
              {[25, 50, 75].map((marker) => (
                <div
                  key={marker}
                  className="absolute top-0 transform -translate-x-1/2"
                  style={{ left: `${marker}%` }}
                >
                  <div className="w-px h-4 bg-neutral-300" />
                  <p className="text-xs text-neutral-500 mt-0.5 -ml-3">
                    {marker}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Numeric Input Alternative */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                label="Nákvæmt gildi"
                type="number"
                value={localValue}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={0.1}
                className="text-center"
              />
            </div>
            <div className="pt-6">
              <span className="text-sm text-neutral-600">%</span>
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700">
              Fljótleiðir:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickAdjust(5)}
                disabled={currentRate + 5 > max}
              >
                {FI_STRINGS.slider.increase5}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickAdjust(10)}
                disabled={currentRate + 10 > max}
              >
                {FI_STRINGS.slider.increase10}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickAdjust(15)}
                disabled={currentRate + 15 > max}
              >
                {FI_STRINGS.slider.increase15}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={localValue === currentRate}
              >
                {FI_STRINGS.slider.reset}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
