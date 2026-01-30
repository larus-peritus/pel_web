/**
 * ScenarioCard - Individual Barista FIRE scenario display and editing
 *
 * Displays a single part-time income scenario with:
 * - Editable scenario name
 * - Gross/net income inputs (with pension calculation)
 * - Optional work hours input
 * - Delete button
 * - Results summary when available
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import type {
  BaristaFireScenario,
  BaristaFireScenarioResult,
} from '@/types/baristaFire';
import { calculateNetIncome } from '@/lib/constants/baristaFire';
import { formatCurrency, formatNumber } from '@/lib/utils';

export interface ScenarioCardProps {
  scenario: BaristaFireScenario;
  result?: BaristaFireScenarioResult;
  onUpdate: (id: string, updates: Partial<BaristaFireScenario>) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export function ScenarioCard({
  scenario,
  result,
  onUpdate,
  onDelete,
  canDelete,
}: ScenarioCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(scenario.name);

  // Handle name edit submission
  const handleNameSubmit = () => {
    if (nameValue.trim() && nameValue !== scenario.name) {
      onUpdate(scenario.id, { name: nameValue.trim() });
    }
    setIsEditingName(false);
  };

  // Handle gross income change (auto-calculates net)
  const handleGrossIncomeChange = (value: number) => {
    const netIncome = calculateNetIncome(value);
    onUpdate(scenario.id, {
      grossAnnualIncome: value,
      netAnnualIncome: netIncome,
    });
  };

  // Handle work hours change
  const handleWorkHoursChange = (value: number) => {
    onUpdate(scenario.id, { workHoursPerWeek: value });
  };

  // Calculate pension deduction amount
  const pensionDeduction = scenario.grossAnnualIncome - scenario.netAnnualIncome;
  const pensionPercentage = 16;

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* Scenario Name */}
        {isEditingName ? (
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameSubmit();
              if (e.key === 'Escape') {
                setNameValue(scenario.name);
                setIsEditingName(false);
              }
            }}
            className="flex-1 rounded-lg border border-primary-500 px-3 py-1.5 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="flex-1 text-left text-lg font-semibold text-neutral-900 hover:text-primary-600 focus:outline-none focus:text-primary-600"
          >
            {scenario.name}
          </button>
        )}

        {/* Delete Button */}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(scenario.id)}
            className="ml-2 text-danger-600 hover:bg-danger-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Gross Annual Income */}
        <div>
          <CurrencyInput
            label="Brúttótekjur á ári"
            value={scenario.grossAnnualIncome}
            onChange={handleGrossIncomeChange}
            helpText={`Nettótekjur: ${formatCurrency(scenario.netAnnualIncome)} (eftir ${pensionPercentage}% lífeyrissjóðsframlag)`}
          />
        </div>

        {/* Work Hours Per Week (Optional) */}
        <div>
          <NumberInput
            label="Vinnustundir á viku (valfrjálst)"
            value={scenario.workHoursPerWeek || 0}
            onChange={handleWorkHoursChange}
            min={0}
            max={40}
            step={1}
            suffix="klst"
            helpText="Fyrir útreikningar á lífsorku (ef AWH er tiltækt)"
          />
        </div>

        {/* Results Summary */}
        {result && (
          <div className="mt-6 space-y-3 rounded-lg bg-neutral-50 p-4">
            <h4 className="font-semibold text-neutral-900">Niðurstöður</h4>

            {/* Monthly Income & Savings */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600">Mánaðartekjur (nettó)</p>
                <p className="font-semibold text-neutral-900">
                  {formatCurrency(result.netMonthlyIncome)}
                </p>
              </div>
              <div>
                <p className="text-neutral-600">Mánaðarleg sparnaður</p>
                <p
                  className={`font-semibold ${
                    result.monthlySavings >= 0
                      ? 'text-success-600'
                      : 'text-danger-600'
                  }`}
                >
                  {formatCurrency(result.monthlySavings)}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t border-neutral-200 pt-3">
              <p className="text-neutral-600 text-sm">Tími til FI</p>
              <p className="text-2xl font-bold text-primary-600">
                {result.yearsToFI} ár
                {result.monthsToFI > 0 && `, ${result.monthsToFI} mán`}
              </p>
              {result.projectedFIAge && (
                <p className="text-sm text-neutral-600">
                  FI aldur: {formatNumber(result.projectedFIAge)} ára
                </p>
              )}
            </div>

            {/* Savings Rate */}
            <div>
              <p className="text-neutral-600 text-sm">Sparnaðarhlutfall</p>
              <p className="font-semibold text-neutral-900">
                {formatNumber(result.savingsRate * 100, 1)}%
              </p>
            </div>

            {/* Life Energy (if available) */}
            {result.lifeEnergy && (
              <div className="border-t border-neutral-200 pt-3">
                <p className="text-neutral-600 text-sm mb-1">Lífsorka</p>
                <p className="text-sm">
                  <span className="font-semibold">
                    {formatNumber(result.lifeEnergy.hoursPerWeek, 1)} klst/viku
                  </span>
                  {' '}
                  ({formatNumber(result.lifeEnergy.percentageOfFullTime, 0)}% af fullu starfi)
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Heildarstundir: {formatNumber(result.lifeEnergy.totalHoursOverGap, 0)} klst
                </p>
              </div>
            )}

            {/* Acceleration Factor */}
            {result.accelerationFactor !== 1 && (
              <div className="border-t border-neutral-200 pt-3">
                <p className="text-neutral-600 text-sm">
                  Samanburður við Coast FIRE
                </p>
                <p
                  className={`font-semibold ${
                    result.compareToCoastFIRE === 'faster'
                      ? 'text-success-600'
                      : result.compareToCoastFIRE === 'slower'
                        ? 'text-warning-600'
                        : 'text-neutral-600'
                  }`}
                >
                  {result.compareToCoastFIRE === 'faster' &&
                    `${formatNumber(result.accelerationFactor, 2)}x hraðara`}
                  {result.compareToCoastFIRE === 'slower' &&
                    `${formatNumber(1 / result.accelerationFactor, 2)}x hægar`}
                  {result.compareToCoastFIRE === 'same' && 'Sama hraði'}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
