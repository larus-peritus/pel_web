'use client';

import { useCallback, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Select, type SelectOption } from '@/components/ui/Select';
import { MEAL_PRICE_PRESETS } from '@/lib/constants/mealCost';
import type { EatingOutData } from '@/types/calculator';

export interface EatingOutInputsProps {
  data: EatingOutData;
  onChange: (data: EatingOutData) => void;
}

/**
 * EatingOutInputs component for tracking convenience food expenses
 *
 * Tracks meals bought instead of made at home:
 * - Breakfast bought (instead of homemade)
 * - Lunch bought (instead of packed from home)
 * - Dinner bought (instead of home-cooked)
 * - Coffee bought (instead of home-brewed)
 * - Fast food (instead of prepared snacks)
 *
 * Each category has:
 * - Household size (to multiply costs for families)
 * - Count per week per person (0-21)
 * - Cost per meal (with price preset dropdown)
 */
export function EatingOutInputs({ data, onChange }: EatingOutInputsProps) {
  // Convert price presets to SelectOption format
  const breakfastPresets: SelectOption[] = useMemo(
    () => [
      { value: '', label: 'Veldu verð...' },
      ...MEAL_PRICE_PRESETS.breakfast.map((preset) => ({
        value: String(preset.value),
        label: `${preset.label} (${preset.value} kr)`,
      })),
    ],
    []
  );

  const lunchPresets: SelectOption[] = useMemo(
    () => [
      { value: '', label: 'Veldu verð...' },
      ...MEAL_PRICE_PRESETS.lunch.map((preset) => ({
        value: String(preset.value),
        label: `${preset.label} (${preset.value} kr)`,
      })),
    ],
    []
  );

  const dinnerPresets: SelectOption[] = useMemo(
    () => [
      { value: '', label: 'Veldu verð...' },
      ...MEAL_PRICE_PRESETS.dinner.map((preset) => ({
        value: String(preset.value),
        label: `${preset.label} (${preset.value} kr)`,
      })),
    ],
    []
  );

  const coffeePresets: SelectOption[] = useMemo(
    () => [
      { value: '', label: 'Veldu verð...' },
      ...MEAL_PRICE_PRESETS.coffee.map((preset) => ({
        value: String(preset.value),
        label: `${preset.label} (${preset.value} kr)`,
      })),
    ],
    []
  );

  const fastFoodPresets: SelectOption[] = useMemo(
    () => [
      { value: '', label: 'Veldu verð...' },
      ...MEAL_PRICE_PRESETS.fastFood.map((preset) => ({
        value: String(preset.value),
        label: `${preset.label} (${preset.value} kr)`,
      })),
    ],
    []
  );

  // Breakfast handlers
  const handleBreakfastCountChange = useCallback(
    (value: number) => {
      onChange({ ...data, breakfastCount: value });
    },
    [data, onChange]
  );

  const handleBreakfastCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, breakfastCost: value });
    },
    [data, onChange]
  );

  const handleBreakfastPresetChange = useCallback(
    (value: string) => {
      if (value) {
        onChange({ ...data, breakfastCost: Number(value) });
      }
    },
    [data, onChange]
  );

  // Lunch handlers
  const handleLunchCountChange = useCallback(
    (value: number) => {
      onChange({ ...data, lunchCount: value });
    },
    [data, onChange]
  );

  const handleLunchCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, lunchCost: value });
    },
    [data, onChange]
  );

  const handleLunchPresetChange = useCallback(
    (value: string) => {
      if (value) {
        onChange({ ...data, lunchCost: Number(value) });
      }
    },
    [data, onChange]
  );

  // Dinner handlers
  const handleDinnerCountChange = useCallback(
    (value: number) => {
      onChange({ ...data, dinnerCount: value });
    },
    [data, onChange]
  );

  const handleDinnerCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, dinnerCost: value });
    },
    [data, onChange]
  );

  const handleDinnerPresetChange = useCallback(
    (value: string) => {
      if (value) {
        onChange({ ...data, dinnerCost: Number(value) });
      }
    },
    [data, onChange]
  );

  // Coffee handlers
  const handleCoffeeCountChange = useCallback(
    (value: number) => {
      onChange({ ...data, coffeeCount: value });
    },
    [data, onChange]
  );

  const handleCoffeeCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, coffeeCost: value });
    },
    [data, onChange]
  );

  const handleCoffeePresetChange = useCallback(
    (value: string) => {
      if (value) {
        onChange({ ...data, coffeeCost: Number(value) });
      }
    },
    [data, onChange]
  );

  // Fast food handlers
  const handleFastFoodCountChange = useCallback(
    (value: number) => {
      onChange({ ...data, fastFoodCount: value });
    },
    [data, onChange]
  );

  const handleFastFoodCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, fastFoodCost: value });
    },
    [data, onChange]
  );

  const handleFastFoodPresetChange = useCallback(
    (value: string) => {
      if (value) {
        onChange({ ...data, fastFoodCost: Number(value) });
      }
    },
    [data, onChange]
  );

  // Household size handler
  const handleHouseholdSizeChange = useCallback(
    (value: number) => {
      onChange({ ...data, householdSize: value });
    },
    [data, onChange]
  );

  // Ensure householdSize has a default value
  const householdSize = data.householdSize || 1;

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Þægindamatur</h2>
        <p className="text-sm text-neutral-600">
          Máltíðir keyptar í stað þess að elda heima - hversu miklu aukalega kostar þetta?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Household Size */}
        <div className="pb-4 border-b border-neutral-200">
          <NumberInput
            label="Fjöldi sem borðar þægindamat"
            value={householdSize}
            onChange={handleHouseholdSizeChange}
            min={1}
            max={20}
            step={1}
            helpText="Hversu margir í heimilinu borða þægindamat? (t.d. fjölskylda sem fer saman á veitingahús)"
          />
          {householdSize > 1 && (
            <p className="mt-2 text-xs text-primary-600 bg-primary-50 p-2 rounded">
              Kostnaður margfaldast með {householdSize} fyrir heildarútreikning.
            </p>
          )}
        </div>

        {/* Breakfast */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Morgunverður keyptur
          </h3>
          <p className="text-xs text-neutral-500 mb-3">
            Í stað morgunverðar heima
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Skipti á viku"
              value={data.breakfastCount}
              onChange={handleBreakfastCountChange}
              min={0}
              max={21}
              step={1}
              helpText="0-21 skipti á viku"
            />
            <Select
              label="Verðflokkur"
              options={breakfastPresets}
              value={String(data.breakfastCost)}
              onChange={handleBreakfastPresetChange}
            />
            <CurrencyInput
              label="Kostnaður per skipti"
              value={data.breakfastCost}
              onChange={handleBreakfastCostChange}
              placeholder="1500"
            />
          </div>
        </div>

        {/* Lunch */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Hádegisverður keyptur
          </h3>
          <p className="text-xs text-neutral-500 mb-3">
            Í stað nestis að heiman
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Skipti á viku"
              value={data.lunchCount}
              onChange={handleLunchCountChange}
              min={0}
              max={21}
              step={1}
              helpText="0-21 skipti á viku"
            />
            <Select
              label="Verðflokkur"
              options={lunchPresets}
              value={String(data.lunchCost)}
              onChange={handleLunchPresetChange}
            />
            <CurrencyInput
              label="Kostnaður per skipti"
              value={data.lunchCost}
              onChange={handleLunchCostChange}
              placeholder="2500"
            />
          </div>
        </div>

        {/* Dinner */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Kvöldverður keyptur
          </h3>
          <p className="text-xs text-neutral-500 mb-3">
            Veitingastaður/take-away í stað heimaeldunar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Skipti á viku"
              value={data.dinnerCount}
              onChange={handleDinnerCountChange}
              min={0}
              max={21}
              step={1}
              helpText="0-21 skipti á viku"
            />
            <Select
              label="Verðflokkur"
              options={dinnerPresets}
              value={String(data.dinnerCost)}
              onChange={handleDinnerPresetChange}
            />
            <CurrencyInput
              label="Kostnaður per skipti"
              value={data.dinnerCost}
              onChange={handleDinnerCostChange}
              placeholder="4000"
            />
          </div>
        </div>

        {/* Coffee/Drinks */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Kaffi / Drykkir keyptir
          </h3>
          <p className="text-xs text-neutral-500 mb-3">
            Kaffihús í stað heimabryggjaðs kaffi eða termusu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Skipti á viku"
              value={data.coffeeCount}
              onChange={handleCoffeeCountChange}
              min={0}
              max={21}
              step={1}
              helpText="0-21 skipti á viku"
            />
            <Select
              label="Verðflokkur"
              options={coffeePresets}
              value={String(data.coffeeCost)}
              onChange={handleCoffeePresetChange}
            />
            <CurrencyInput
              label="Kostnaður per skipti"
              value={data.coffeeCost}
              onChange={handleCoffeeCostChange}
              placeholder="650"
            />
          </div>
        </div>

        {/* Fast Food */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Skyndibiti / Snarl
          </h3>
          <p className="text-xs text-neutral-500 mb-3">
            Í stað heimabúins snarl eða léttrar máltíðar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInput
              label="Skipti á viku"
              value={data.fastFoodCount}
              onChange={handleFastFoodCountChange}
              min={0}
              max={21}
              step={1}
              helpText="0-21 skipti á viku"
            />
            <Select
              label="Verðflokkur"
              options={fastFoodPresets}
              value={String(data.fastFoodCost)}
              onChange={handleFastFoodPresetChange}
            />
            <CurrencyInput
              label="Kostnaður per skipti"
              value={data.fastFoodCost}
              onChange={handleFastFoodCostChange}
              placeholder="2000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
