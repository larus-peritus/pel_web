'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useCalculator } from '@/context/CalculatorContext';
import {
  COMMON_CONVENIENCE_EXPENSES,
  CONVENIENCE_CATEGORY_LABELS,
} from '@/lib/calculations/convenienceExpenses';
import { isWeekday } from '@/lib/utils/dateUtils';
import type { ConvenienceCategory } from '@/types/calculator';

/**
 * Quick add convenience expense component
 * Allows rapid expense entry with preset options
 */
export function QuickAddExpense() {
  const { addConvenienceExpense } = useCalculator();

  // Form state
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<ConvenienceCategory>('other');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isWorkdayFlag, setIsWorkdayFlag] = useState<boolean>(
    isWeekday(new Date())
  );
  const [note, setNote] = useState<string>('');

  // Handle preset selection
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);

    if (value === 'custom') {
      // Reset to custom entry
      setAmount(0);
      setCategory('other');
      setNote('');
      return;
    }

    // Find preset
    const presetIndex = parseInt(value);
    if (isNaN(presetIndex) || presetIndex < 0) return;

    const preset = COMMON_CONVENIENCE_EXPENSES[presetIndex];
    if (preset) {
      setAmount(preset.amount);
      setCategory(preset.category);
      setNote(preset.note || '');
    }
  };

  // Handle date change (auto-detect workday)
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setIsWorkdayFlag(isWeekday(new Date(newDate)));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      return;
    }

    // Add expense
    addConvenienceExpense({
      amount,
      category,
      date,
      isWorkday: isWorkdayFlag,
      note: note.trim() || undefined,
    });

    // Reset form
    setSelectedPreset('');
    setAmount(0);
    setCategory('other');
    setDate(new Date().toISOString().split('T')[0]);
    setIsWorkdayFlag(isWeekday(new Date()));
    setNote('');
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Skrá þreytukosnað</h3>
        <p className="text-sm text-gray-600 mt-1">
          Veldu úr lista eða sláðu inn handvirkt
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset selector */}
          <Select
            label="Flýtival"
            value={selectedPreset}
            onChange={handlePresetChange}
            options={[
              { value: '', label: 'Veldu þjónustu...' },
              ...COMMON_CONVENIENCE_EXPENSES.map((preset, index) => ({
                value: index.toString(),
                label: `${preset.note} - ${preset.amount.toLocaleString('is-IS')} kr`,
              })),
              { value: 'custom', label: 'Annað (handvirkt)' },
            ]}
          />

          {/* Amount input */}
          <CurrencyInput
            label="Upphæð"
            value={amount}
            onChange={setAmount}
            required
            error={amount < 0 ? 'Upphæð verður að vera jákvæð' : undefined}
            helpText="Kostnaður í krónum"
          />

          {/* Category selector */}
          <Select
            label="Flokkur"
            value={category}
            onChange={(value) => setCategory(value as ConvenienceCategory)}
            options={Object.entries(CONVENIENCE_CATEGORY_LABELS).map(
              ([key, label]) => ({
                value: key,
                label,
              })
            )}
          />

          {/* Date input */}
          <Input
            type="date"
            label="Dagsetning"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          {/* Workday toggle */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Vinnudagur
            </label>
            <button
              type="button"
              onClick={() => setIsWorkdayFlag(!isWorkdayFlag)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isWorkdayFlag ? 'bg-blue-600' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={isWorkdayFlag}
            >
              <span className="sr-only">Vinnudagur</span>
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isWorkdayFlag ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
            <Badge variant={isWorkdayFlag ? 'info' : 'neutral'}>
              {isWorkdayFlag ? 'Vinnudagur' : 'Frídagur'}
            </Badge>
          </div>

          {/* Note input */}
          <Input
            type="text"
            label="Athugasemd (valfrjálst)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            helpText={`${note.length}/200 stafir`}
          />

          {/* Submit button */}
          <Button type="submit" variant="primary" className="w-full">
            Skrá kostnað
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
