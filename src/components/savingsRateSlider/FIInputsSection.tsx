'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FI_STRINGS } from '@/lib/constants/icelandic';
import { calculateFINumber } from '@/lib/calculations/fi';
import type { FIInputs } from '@/types/fi';

interface FIInputsSectionProps {
  inputs: FIInputs;
  onChange: (inputs: Partial<FIInputs>) => void;
}

/**
 * Format number with Icelandic thousand separators (dots)
 */
function formatNumber(value: number): string {
  if (!value || value === 0) return '';
  return value.toLocaleString('is-IS');
}

/**
 * Parse formatted string back to number (remove dots and commas)
 */
function parseFormattedNumber(value: string): number {
  // Remove dots (thousand separators) and replace comma with dot for decimals
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

/**
 * FI Inputs Section Component
 *
 * Provides input form for FI number, income, expenses, and optional advanced inputs.
 * Includes FI number calculator based on expenses and multiplier.
 */
export function FIInputsSection({ inputs, onChange }: FIInputsSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof FIInputs, value: number) => {
    onChange({ [field]: value });
  };

  const handleFormattedInputChange = (field: keyof FIInputs, rawValue: string) => {
    const numericValue = parseFormattedNumber(rawValue);
    onChange({ [field]: numericValue });
  };

  const handleCalculateFINumber = () => {
    const calculatedFINumber = calculateFINumber(
      inputs.annualExpenses,
      inputs.fiMultiplier
    );
    onChange({ fiNumber: calculatedFINumber });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-neutral-900">
          FI Markmið og Fjárhagur
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          Stilltu upphafsgögn til að reikna veginn að fjármálafrelsi
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Inputs - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FI Number */}
            <Input
              label={FI_STRINGS.inputs.fiNumber}
              type="text"
              inputMode="numeric"
              value={formatNumber(inputs.fiNumber)}
              onChange={(e) =>
                handleFormattedInputChange('fiNumber', e.target.value)
              }
              helpText={FI_STRINGS.inputs.fiNumberHelp}
              required
            />

            {/* Annual Income */}
            <Input
              label={FI_STRINGS.inputs.annualIncome}
              type="text"
              inputMode="numeric"
              value={formatNumber(inputs.annualIncome)}
              onChange={(e) =>
                handleFormattedInputChange('annualIncome', e.target.value)
              }
              helpText={FI_STRINGS.inputs.annualIncomeHelp}
              required
            />

            {/* Annual Expenses */}
            <Input
              label={FI_STRINGS.inputs.annualExpenses}
              type="text"
              inputMode="numeric"
              value={formatNumber(inputs.annualExpenses)}
              onChange={(e) =>
                handleFormattedInputChange('annualExpenses', e.target.value)
              }
              helpText={FI_STRINGS.inputs.annualExpensesHelp}
              required
            />

            {/* Current Net Worth */}
            <Input
              label={FI_STRINGS.inputs.currentNetWorth}
              type="text"
              inputMode="numeric"
              value={formatNumber(inputs.currentNetWorth)}
              onChange={(e) =>
                handleFormattedInputChange('currentNetWorth', e.target.value)
              }
              helpText={FI_STRINGS.inputs.currentNetWorthHelp}
            />
          </div>

          {/* FI Number Calculator */}
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-neutral-700 mb-2">
              <strong>Reikna FI Markmið:</strong> {inputs.annualExpenses.toLocaleString('is-IS')} kr × {inputs.fiMultiplier}x = {calculateFINumber(inputs.annualExpenses, inputs.fiMultiplier).toLocaleString('is-IS')} kr
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCalculateFINumber}
            >
              {FI_STRINGS.actions.calculate} FI Markmið
            </Button>
          </div>

          {/* Advanced Inputs Toggle */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <span>{showAdvanced ? '▼' : '▶'}</span>
              <span>{FI_STRINGS.inputs.advancedInputs}</span>
            </button>
          </div>

          {/* Advanced Inputs - Collapsible */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              {/* Expected Return Rate */}
              <Input
                label={FI_STRINGS.inputs.expectedReturn}
                type="number"
                value={inputs.expectedReturnRate || ''}
                onChange={(e) =>
                  handleInputChange('expectedReturnRate', parseFloat(e.target.value) || 0)
                }
                helpText={FI_STRINGS.inputs.expectedReturnHelp}
                min={0}
                max={15}
                step={0.5}
              />

              {/* FI Multiplier */}
              <Input
                label={FI_STRINGS.inputs.fiMultiplier}
                type="number"
                value={inputs.fiMultiplier || ''}
                onChange={(e) =>
                  handleInputChange('fiMultiplier', parseFloat(e.target.value) || 0)
                }
                helpText={FI_STRINGS.inputs.fiMultiplierHelp}
                min={20}
                max={40}
                step={1}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
