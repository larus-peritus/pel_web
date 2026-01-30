'use client';

import { useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Slider } from '@/components/ui/Slider';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { SLIDER_RANGES } from '@/lib/defaults';
import { formatMonthlyCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import {
  COMMUTE_PRESETS,
  CLOTHING_PRESETS,
  MEAL_PRESETS,
  type CommutePreset,
} from '@/lib/presets';
import type { Preset, PresetCategory, MoneyExpenses } from '@/types/calculator';

interface PresetButtonsProps {
  presets: Preset[];
  currentValue: number;
  onSelect: (value: number) => void;
  category: Exclude<PresetCategory, 'commute'>;
}

/**
 * Preset buttons with monthly values displayed
 */
function PresetButtons({ presets, currentValue, onSelect, category }: PresetButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        // Get the value for this category (yearly stored)
        const yearlyValue = preset.values[category] ?? 0;
        const monthlyValue = Math.round(yearlyValue / 12);
        const isActive = currentValue === yearlyValue;

        return (
          <button
            key={preset.id}
            onClick={() => onSelect(yearlyValue)}
            className={cn(
              'px-3 py-2 text-xs rounded-lg border transition-colors text-left',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              isActive
                ? 'bg-primary-100 border-primary-500 text-primary-700'
                : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
            )}
            aria-pressed={isActive}
            title={preset.description}
          >
            <span className="block font-medium">{preset.label}</span>
            <span className="block text-neutral-500 mt-0.5">
              {formatMonthlyCurrency(monthlyValue)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface CommutePresetButtonsProps {
  presets: CommutePreset[];
  currentCost: number;
  currentTimeHours: number;
  onSelect: (cost: number, timeHours: number) => void;
}

/**
 * Commute preset buttons showing cost and time
 */
function CommutePresetButtons({ presets, currentCost, currentTimeHours, onSelect }: CommutePresetButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const { cost, timeHoursPerWeek, oneWayMinutes } = preset.values;
        const monthlyCost = Math.round(cost / 12);
        const isActive = currentCost === cost && currentTimeHours === timeHoursPerWeek;

        return (
          <button
            key={preset.id}
            onClick={() => onSelect(cost, timeHoursPerWeek)}
            className={cn(
              'px-3 py-2 text-xs rounded-lg border transition-colors text-left',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              isActive
                ? 'bg-primary-100 border-primary-500 text-primary-700'
                : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
            )}
            aria-pressed={isActive}
            title={preset.description}
          >
            <span className="block font-medium">{preset.label}</span>
            <span className="block text-neutral-500 mt-0.5">
              {formatMonthlyCurrency(monthlyCost)} · {oneWayMinutes} mín
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface ExpenseSliderRowProps {
  label: string;
  helpText?: string;
  value: number; // Yearly value from state
  onChange: (yearlyValue: number) => void;
  presets: Preset[];
  category: Exclude<PresetCategory, 'commute'>;
  sliderConfig: { min: number; max: number; step: number };
}

/**
 * Single expense row with slider and preset buttons
 */
function ExpenseSliderRow({
  label,
  helpText,
  value,
  onChange,
  presets,
  category,
  sliderConfig,
}: ExpenseSliderRowProps) {
  // Convert yearly value to monthly for slider
  const monthlyValue = Math.round(value / 12);

  // Handle slider change (monthly input -> yearly stored)
  const handleSliderChange = useCallback(
    (newMonthlyValue: number) => {
      onChange(newMonthlyValue * 12);
    },
    [onChange]
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        {helpText && (
          <p className="text-xs text-neutral-500 mt-0.5">{helpText}</p>
        )}
      </div>

      <Slider
        value={monthlyValue}
        onChange={handleSliderChange}
        min={sliderConfig.min}
        max={sliderConfig.max}
        step={sliderConfig.step}
        showValue
        formatValue={formatMonthlyCurrency}
      />

      <PresetButtons
        presets={presets}
        currentValue={value}
        onSelect={onChange}
        category={category}
      />
    </div>
  );
}

/**
 * Format one-way commute time in minutes
 */
function formatCommuteTime(minutes: number): string {
  return `${minutes} mín`;
}

/**
 * QuickSettingsSlider Component
 *
 * Provides quick settings with sliders and preset buttons for:
 * - Monthly income
 * - Commute expenses and time (combined section)
 * - Clothing expenses
 * - Meal expenses
 *
 * All money values displayed as monthly, stored as yearly internally.
 * Commute time displayed as one-way minutes, stored as weekly hours internally.
 */
export function QuickSettingsSlider() {
  const { inputs, updateIncome, updateMoneyExpenses, updateTimeExpenses } = useCalculator();

  // Get monthly income from yearly stored value
  const monthlyIncome = Math.round(inputs.income.grossAnnualIncome / 12);

  // Get commute time as one-way minutes (stored as weekly hours, convert back)
  // Weekly hours to one-way minutes: hours * 60 / 10 (divide by 2 for one-way, divide by 5 for days)
  const commuteOneWayMinutes = Math.round(inputs.timeExpenses.commute * 6);

  // Handle income slider change (monthly -> yearly)
  const handleIncomeChange = useCallback(
    (newMonthlyValue: number) => {
      updateIncome({ grossAnnualIncome: newMonthlyValue * 12 });
    },
    [updateIncome]
  );

  // Handle commute cost slider change (monthly -> yearly)
  const handleCommuteCostChange = useCallback(
    (newMonthlyValue: number) => {
      updateMoneyExpenses({ commute: newMonthlyValue * 12 });
    },
    [updateMoneyExpenses]
  );

  // Handle commute time slider change (one-way minutes -> weekly hours)
  const handleCommuteTimeChange = useCallback(
    (newOneWayMinutes: number) => {
      // Convert one-way minutes to weekly hours: minutes * 2 (round trip) * 5 (days) / 60
      const weeklyHours = (newOneWayMinutes * 2 * 5) / 60;
      updateTimeExpenses({ commute: weeklyHours });
    },
    [updateTimeExpenses]
  );

  // Handle commute preset selection (sets both cost and time)
  const handleCommutePresetSelect = useCallback(
    (yearlyCost: number, weeklyHours: number) => {
      updateMoneyExpenses({ commute: yearlyCost });
      updateTimeExpenses({ commute: weeklyHours });
    },
    [updateMoneyExpenses, updateTimeExpenses]
  );

  const handleClothingChange = useCallback(
    (yearlyValue: number) => {
      updateMoneyExpenses({ clothing: yearlyValue });
    },
    [updateMoneyExpenses]
  );

  const handleMealsChange = useCallback(
    (yearlyValue: number) => {
      updateMoneyExpenses({ meals: yearlyValue });
    },
    [updateMoneyExpenses]
  );

  // Get monthly commute cost for slider
  const monthlyCommuteCost = Math.round(inputs.moneyExpenses.commute / 12);

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Flýtistillingar
        </h3>
        <p className="text-sm text-neutral-600">
          Dragðu sleðann eða veldu forstillingu til að setja gildi fljótt
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Income Slider */}
        <div className="space-y-3 pb-6 border-b border-neutral-200">
          <label className="block text-sm font-medium text-neutral-700">
            Mánaðarlaun (eftir skatta)
          </label>
          <Slider
            value={monthlyIncome}
            onChange={handleIncomeChange}
            min={SLIDER_RANGES.income.min}
            max={SLIDER_RANGES.income.max}
            step={SLIDER_RANGES.income.step}
            showValue
            formatValue={formatMonthlyCurrency}
          />
        </div>

        {/* Commute - Combined Cost and Time */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Ferðakostnaður og tími
            </label>
            <p className="text-xs text-neutral-500 mt-0.5">
              Bensín, strætó, bílastæði og tími í umferð
            </p>
          </div>

          {/* Cost slider */}
          <div className="space-y-2">
            <span className="text-xs text-neutral-600">Kostnaður á mánuði</span>
            <Slider
              value={monthlyCommuteCost}
              onChange={handleCommuteCostChange}
              min={SLIDER_RANGES.commute.min}
              max={SLIDER_RANGES.commute.max}
              step={SLIDER_RANGES.commute.step}
              showValue
              formatValue={formatMonthlyCurrency}
            />
          </div>

          {/* Time slider */}
          <div className="space-y-2">
            <span className="text-xs text-neutral-600">Ferðatími (hvor leið)</span>
            <Slider
              value={commuteOneWayMinutes}
              onChange={handleCommuteTimeChange}
              min={SLIDER_RANGES.commuteTime.min}
              max={SLIDER_RANGES.commuteTime.max}
              step={SLIDER_RANGES.commuteTime.step}
              showValue
              formatValue={formatCommuteTime}
            />
          </div>

          {/* Preset buttons */}
          <CommutePresetButtons
            presets={COMMUTE_PRESETS}
            currentCost={inputs.moneyExpenses.commute}
            currentTimeHours={inputs.timeExpenses.commute}
            onSelect={handleCommutePresetSelect}
          />
        </div>

        {/* Clothing */}
        <ExpenseSliderRow
          label="Vinnufatnaður"
          helpText="Fatnaður sem þú þarft sérstaklega fyrir vinnu"
          value={inputs.moneyExpenses.clothing}
          onChange={handleClothingChange}
          presets={CLOTHING_PRESETS}
          category="clothing"
          sliderConfig={SLIDER_RANGES.clothing}
        />

        {/* Meals */}
        <ExpenseSliderRow
          label="Hádegismatur"
          helpText="Matur keyptur vegna vinnu"
          value={inputs.moneyExpenses.meals}
          onChange={handleMealsChange}
          presets={MEAL_PRESETS}
          category="meals"
          sliderConfig={SLIDER_RANGES.meals}
        />
      </CardContent>
    </Card>
  );
}
