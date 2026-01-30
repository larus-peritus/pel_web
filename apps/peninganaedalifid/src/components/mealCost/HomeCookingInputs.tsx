'use client';

import { useCallback, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Select, type SelectOption } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils/formatters';
import { HOME_DINNER_COST_PRESETS, WEEKS_PER_MONTH } from '@/lib/constants/mealCost';
import { LUNCH_TYPE_LABELS } from '@/types/calculator';
import type { HomeCookingData, LunchType } from '@/types/calculator';

export interface HomeCookingInputsProps {
  data: HomeCookingData;
  onChange: (data: HomeCookingData) => void;
  actualHourlyWage: number; // Kept for API compatibility
}

/**
 * HomeCookingInputs component for tracking home cooking costs (new model)
 *
 * Displays:
 * - Household size
 * - Monthly baseline (breakfast + pantry staples)
 * - Lunch type (free/subsidized/home-packed)
 * - Dinner cost per meal for the household
 * - Shopping and cooking time
 *
 * Shows calculated values:
 * - Cost per dinner
 * - Weekly dinner total
 * - Time cost breakdown
 */
export function HomeCookingInputs({
  data,
  onChange,
  actualHourlyWage,
}: HomeCookingInputsProps) {
  // Lunch type options
  const lunchTypeOptions: SelectOption[] = useMemo(
    () => [
      { value: 'free', label: LUNCH_TYPE_LABELS.free },
      { value: 'subsidized', label: LUNCH_TYPE_LABELS.subsidized },
      { value: 'homePacked', label: LUNCH_TYPE_LABELS.homePacked },
    ],
    []
  );

  // Dinner cost presets
  const dinnerPresets: SelectOption[] = useMemo(
    () => [
      { value: '', label: 'Veldu verðflokk...' },
      ...HOME_DINNER_COST_PRESETS.map((preset) => ({
        value: String(preset.value),
        label: `${preset.label} (${preset.value.toLocaleString('is-IS')} kr)`,
      })),
    ],
    []
  );

  // Calculate derived values
  const weeklyDinnerTotal = useMemo(() => {
    return 7 * data.dinnerCostPerMeal;
  }, [data.dinnerCostPerMeal]);

  const monthlyDinnerTotal = useMemo(() => {
    return weeklyDinnerTotal * WEEKS_PER_MONTH;
  }, [weeklyDinnerTotal]);

  const totalWeeklyHours = useMemo(() => {
    return data.shoppingHoursPerWeek + data.cookingHoursPerWeek;
  }, [data.shoppingHoursPerWeek, data.cookingHoursPerWeek]);

  const totalMonthlyHours = useMemo(() => {
    return totalWeeklyHours * WEEKS_PER_MONTH;
  }, [totalWeeklyHours]);

  // Input handlers
  const handleHouseholdSizeChange = useCallback(
    (value: number) => {
      onChange({ ...data, householdSize: value });
    },
    [data, onChange]
  );

  const handleBaselineChange = useCallback(
    (value: number) => {
      onChange({ ...data, monthlyBreakfastBaseline: value });
    },
    [data, onChange]
  );

  const handleLunchTypeChange = useCallback(
    (value: string) => {
      const lunchType = value as LunchType;
      onChange({
        ...data,
        lunchType,
        // Reset lunch cost if switching to free
        lunchCostPerMeal: lunchType === 'free' ? 0 : data.lunchCostPerMeal,
      });
    },
    [data, onChange]
  );

  const handleLunchCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, lunchCostPerMeal: value });
    },
    [data, onChange]
  );

  const handleDinnerCostChange = useCallback(
    (value: number) => {
      onChange({ ...data, dinnerCostPerMeal: value });
    },
    [data, onChange]
  );

  const handleDinnerPresetChange = useCallback(
    (value: string) => {
      if (value) {
        onChange({ ...data, dinnerCostPerMeal: Number(value) });
      }
    },
    [data, onChange]
  );

  const handleShoppingHoursChange = useCallback(
    (value: number) => {
      onChange({ ...data, shoppingHoursPerWeek: value });
    },
    [data, onChange]
  );

  const handleCookingHoursChange = useCallback(
    (value: number) => {
      onChange({ ...data, cookingHoursPerWeek: value });
    },
    [data, onChange]
  );

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Grunnkostnaður matar</h2>
        <p className="text-sm text-neutral-600">
          Kostnaður við að elda heima - þægindamatur bætist við þennan grunn
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Household Size */}
        <div>
          <NumberInput
            label="Fjöldi í heimili"
            value={data.householdSize}
            onChange={handleHouseholdSizeChange}
            min={1}
            max={20}
            step={1}
            helpText="Hversu margir búa í heimilinu?"
          />
        </div>

        {/* Baseline (Breakfast + Pantry) */}
        <div>
          <CurrencyInput
            label="Grunnkostnaður á mánuði"
            value={data.monthlyBreakfastBaseline}
            onChange={handleBaselineChange}
            placeholder="25000"
            helpText="Morgunverður, grunnvörur og búr (alltaf greitt óháð þægindamat)"
          />
        </div>

        {/* Lunch Section */}
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">Hádegisverður</h3>
          <p className="text-xs text-neutral-500">
            Margir fá ókeypis eða niðurgreitt hádegisverð í vinnu eða skóla
          </p>

          <Select
            label="Hádegisverður"
            options={lunchTypeOptions}
            value={data.lunchType}
            onChange={handleLunchTypeChange}
          />

          {data.lunchType !== 'free' && (
            <CurrencyInput
              label={data.lunchType === 'homePacked' ? 'Kostnaður per nesti' : 'Niðurgreidd upphæð'}
              value={data.lunchCostPerMeal}
              onChange={handleLunchCostChange}
              placeholder="500"
              helpText={data.lunchType === 'homePacked'
                ? 'Kostnaður að útbúa eitt nesti'
                : 'Upphæð sem þú borgar (eftir niðurgreiðslu)'}
            />
          )}

          {data.lunchType === 'free' && (
            <p className="text-sm text-success-700 bg-success-50 p-2 rounded">
              Ókeypis hádegisverður í vinnu/skóla - enginn aukakostnaður!
            </p>
          )}
        </div>

        {/* Dinner Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-700">Kvöldverður heima</h3>
          <p className="text-xs text-neutral-500">
            Kostnaður að elda EINN kvöldverð fyrir allt heimilið
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Verðflokkur"
              options={dinnerPresets}
              value={String(data.dinnerCostPerMeal)}
              onChange={handleDinnerPresetChange}
            />
            <CurrencyInput
              label="Kostnaður per máltíð"
              value={data.dinnerCostPerMeal}
              onChange={handleDinnerCostChange}
              placeholder="3500"
              helpText="Kostnaður fyrir allt heimilið"
            />
          </div>

          {/* Dinner Summary */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">7 kvöldverðir á viku:</span>{' '}
              {formatCurrency(weeklyDinnerTotal)}
            </p>
            <p className="text-sm text-neutral-600">
              <span className="font-medium">Á mánuði:</span>{' '}
              {formatCurrency(monthlyDinnerTotal)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Þegar þú borðar úti sparast þessi kostnaður á þeim máltíðum
            </p>
          </div>
        </div>

        {/* Time Section - Informational only, not included in cost */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-700">Tími í matargerð</h3>
          <p className="text-xs text-neutral-500">
            Tími er ekki reiknaður sem kostnaður, en sýndur til upplýsinga
          </p>

          <NumberInput
            label="Innkaupatími á viku"
            value={data.shoppingHoursPerWeek}
            onChange={handleShoppingHoursChange}
            min={0}
            max={40}
            step={0.5}
            helpText="Klst á viku að versla fyrir matvöru (með ferðalagi)"
          />

          <NumberInput
            label="Eldunartími á viku"
            value={data.cookingHoursPerWeek}
            onChange={handleCookingHoursChange}
            min={0}
            max={40}
            step={0.5}
            helpText="Klst á viku að elda mat (undirbúningur + eldun + þvottur)"
          />

          {/* Time Summary - Informational only */}
          {totalWeeklyHours > 0 && (
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
              <h4 className="text-sm font-semibold text-neutral-700">
                Tími í matargerð
              </h4>
              <div className="text-sm text-neutral-600 space-y-1">
                <p>
                  <span className="font-medium">Á viku:</span> {totalWeeklyHours.toFixed(1)} klst
                </p>
                <p>
                  <span className="font-medium">Á mánuði:</span> {totalMonthlyHours.toFixed(0)} klst
                </p>
              </div>
              <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-200">
                Þessi tími fer í innkaup og eldun í stað annarra athafna
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
