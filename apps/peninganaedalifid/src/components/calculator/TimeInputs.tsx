'use client';

import { useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { NumberInput } from '@/components/ui/NumberInput';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { TimeExpenses } from '@/types/calculator';

interface TimeField {
  key: keyof TimeExpenses;
  label: string;
  description: string;
}

const TIME_FIELDS: TimeField[] = [
  {
    key: 'commute',
    label: 'Ferðatími',
    description: 'Heildartími í báðar áttir á viku',
  },
  {
    key: 'gettingReady',
    label: 'Undirbúningur',
    description: 'Aukatími við að undirbúa sig fyrir vinnu',
  },
  {
    key: 'decompression',
    label: 'Afslöppunartími',
    description: 'Tími til að jafna sig eftir vinnu á viku',
  },
  {
    key: 'workIllness',
    label: 'Vinnutengd veikindi',
    description: 'Meðalfjöldi stunda á viku vegna streitu/veikinda',
  },
];

/**
 * Time expenses input section for the calculator
 * Displays all work-related time costs (weekly hours)
 */
export function TimeInputs() {
  const { inputs, updateTimeExpenses } = useCalculator();
  const { timeExpenses } = inputs;

  const handleTimeChange = useCallback(
    (key: keyof TimeExpenses, value: number) => {
      updateTimeExpenses({ [key]: value });
    },
    [updateTimeExpenses]
  );

  // Calculate total extra hours
  const totalExtraHours = Object.values(timeExpenses).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Aukatími
            </h2>
            <p className="text-sm text-neutral-600">
              Vikustundir umfram greiddan vinnutíma
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Samtals aukatími</p>
            <p className="text-lg font-semibold text-warning-600">
              {totalExtraHours.toFixed(1)} klst/viku
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {TIME_FIELDS.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={`time-${field.key}`}
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              {field.label}
            </label>
            <div className="flex items-center gap-2">
              <NumberInput
                id={`time-${field.key}`}
                value={timeExpenses[field.key]}
                onChange={(value) => handleTimeChange(field.key, value)}
                min={0}
                max={40}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm text-neutral-500 w-16">klst/viku</span>
            </div>
            <p
              id={`time-${field.key}-desc`}
              className="mt-1 text-xs text-neutral-500"
            >
              {field.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
