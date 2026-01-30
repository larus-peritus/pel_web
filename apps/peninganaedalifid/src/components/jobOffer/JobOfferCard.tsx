'use client';

import { useState, useEffect } from 'react';
import type { JobOffer, MonetaryBenefit } from '@/types/jobOffer';
import { Card } from '@/components/ui/Card';
import {
  calculateOfferMetrics,
  formatISK,
  createBenefit,
  calculateNetFromGross,
} from '@/lib/calculations/jobOfferComparison';
import {
  JOB_COMMUTE_PRESETS,
  JOB_CLOTHING_PRESETS,
  JOB_MEAL_PRESETS,
  JOB_BENEFIT_PRESETS,
  getBenefitLabelByType,
} from '@/lib/presets/jobOffer';

interface JobOfferCardProps {
  offer: JobOffer;
  onUpdate: (offer: JobOffer) => void;
  title: string;
  showImportButton?: boolean;
  onImport?: () => void;
}

/**
 * QuickSelect component for preset buttons
 */
function QuickSelect<T extends { id: string; label: string; description?: string }>({
  label,
  options,
  selectedId,
  onSelect,
}: {
  label: string;
  options: T[];
  selectedId: string | null;
  onSelect: (option: T) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-neutral-600">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            title={option.description}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              selectedId === option.id
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Formatted currency input with thousand separators
 */
function CurrencyInput({
  id,
  value,
  onChange,
  placeholder,
  suffix = 'kr/mán',
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value > 0 ? formatISK(value) : '');

  // Sync display value when external value changes (e.g., from import)
  useEffect(() => {
    setDisplayValue(value > 0 ? formatISK(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue, 10) || 0;

    // Format for display
    setDisplayValue(rawValue ? formatISK(numValue) : '');
    onChange(numValue);
  };

  const handleBlur = () => {
    // Ensure display matches value on blur
    setDisplayValue(value > 0 ? formatISK(value) : '');
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full px-3 py-2 pr-16 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        placeholder={placeholder}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
        {suffix}
      </span>
    </div>
  );
}

export default function JobOfferCard({
  offer,
  onUpdate,
  title,
  showImportButton = false,
  onImport,
}: JobOfferCardProps) {
  const [showBenefits, setShowBenefits] = useState(offer.benefits.length > 0);
  const [showExpenses, setShowExpenses] = useState(
    offer.expenses.clothing > 0 || offer.expenses.meals > 0 || offer.expenses.other > 0
  );

  // Calculate live preview
  let metrics = null;
  try {
    if (offer.grossMonthlySalary > 0) {
      metrics = calculateOfferMetrics(offer);
    }
  } catch {
    // Ignore calculation errors for incomplete data
  }

  // Handler for brúttó salary change - also updates nettó
  const handleGrossSalaryChange = (grossValue: number) => {
    const netValue = calculateNetFromGross(grossValue);
    onUpdate({
      ...offer,
      grossMonthlySalary: grossValue,
      monthlySalary: netValue,
    });
  };

  // Find current preset selections
  const currentCommutePreset = JOB_COMMUTE_PRESETS.find(
    (p) =>
      p.minutes * 2 === offer.commuteMinutesPerDay &&
      p.costMonthly === offer.commuteCostMonthly
  );
  const currentClothingPreset = JOB_CLOTHING_PRESETS.find(
    (p) => p.monthlyValue === offer.expenses.clothing
  );
  const currentMealPreset = JOB_MEAL_PRESETS.find(
    (p) => p.monthlyValue === offer.expenses.meals
  );

  // Update handlers
  const updateField = <K extends keyof JobOffer>(field: K, value: JobOffer[K]) => {
    onUpdate({ ...offer, [field]: value });
  };

  const updateExpense = (field: keyof typeof offer.expenses, value: number) => {
    onUpdate({
      ...offer,
      expenses: { ...offer.expenses, [field]: value },
    });
  };

  const handleCommutePreset = (preset: (typeof JOB_COMMUTE_PRESETS)[0]) => {
    onUpdate({
      ...offer,
      commuteMinutesPerDay: preset.minutes * 2, // Convert one-way to round trip
      commuteCostMonthly: preset.costMonthly,
    });
  };

  const handleClothingPreset = (preset: (typeof JOB_CLOTHING_PRESETS)[0]) => {
    updateExpense('clothing', preset.monthlyValue);
  };

  const handleMealPreset = (preset: (typeof JOB_MEAL_PRESETS)[0]) => {
    updateExpense('meals', preset.monthlyValue);
  };

  const handleAddBenefit = (preset?: (typeof JOB_BENEFIT_PRESETS)[0]) => {
    if (preset) {
      // Check if benefit type already exists
      const existingIndex = offer.benefits.findIndex((b) => b.type === preset.type);
      if (existingIndex >= 0) {
        // Update existing
        const updatedBenefits = [...offer.benefits];
        updatedBenefits[existingIndex] = createBenefit(
          preset.type,
          preset.label,
          preset.monthlyValue
        );
        onUpdate({ ...offer, benefits: updatedBenefits });
      } else {
        // Add new
        onUpdate({
          ...offer,
          benefits: [
            ...offer.benefits,
            createBenefit(preset.type, preset.label, preset.monthlyValue),
          ],
        });
      }
    } else {
      // Add empty benefit
      onUpdate({
        ...offer,
        benefits: [...offer.benefits, createBenefit('other', '', 0)],
      });
    }
    setShowBenefits(true);
  };

  const handleUpdateBenefit = (
    index: number,
    field: keyof MonetaryBenefit,
    value: string | number
  ) => {
    const updatedBenefits = [...offer.benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    onUpdate({ ...offer, benefits: updatedBenefits });
  };

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = offer.benefits.filter((_, i) => i !== index);
    onUpdate({ ...offer, benefits: updatedBenefits });
  };

  return (
    <Card>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
            {showImportButton && onImport && (
              <button
                onClick={onImport}
                className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
              >
                Sækja úr reiknivél
              </button>
            )}
          </div>
          {metrics && (
            <div className="mt-3 p-3 bg-primary-50 rounded-lg">
              <div className="text-sm text-neutral-600">Raunverulegt tímakaup</div>
              <div className="text-2xl font-bold text-primary-600">
                {formatISK(metrics.actualHourlyWage)} kr/klst
              </div>
              <div className="text-xs text-neutral-500 mt-1 space-x-2">
                <span>{formatISK(metrics.totalAnnualHours)} klst/ári</span>
                <span>•</span>
                <span>Nettó {formatISK(offer.monthlySalary)} kr/mán</span>
              </div>
            </div>
          )}
        </div>

        {/* Offer Name */}
        <div>
          <label
            htmlFor={`${offer.id}-name`}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Nafn {offer.isCurrentJob ? 'starfs' : 'tilboðs'}
          </label>
          <input
            id={`${offer.id}-name`}
            type="text"
            value={offer.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={
              offer.isCurrentJob ? 'Núverandi starf mitt' : 't.d. Tæknilegur leiðtogi hjá X'
            }
          />
        </div>

        {/* Monthly Salary - Brúttó input with Nettó display */}
        <div className="space-y-2">
          <div>
            <label
              htmlFor={`${offer.id}-salary`}
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Mánaðarlaun (brúttó - fyrir skatta) *
            </label>
            <CurrencyInput
              id={`${offer.id}-salary`}
              value={offer.grossMonthlySalary}
              onChange={handleGrossSalaryChange}
              placeholder="700.000"
            />
          </div>
          {offer.grossMonthlySalary > 0 && (
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Nettó (eftir skatta):</span>
                <span className="text-lg font-semibold text-green-700">
                  {formatISK(offer.monthlySalary)} kr/mán
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Reiknað með staðalfrádrætti (4% lífeyrir, 2% séreignar, 1% stéttarfélag)
              </p>
            </div>
          )}
        </div>

        {/* Weekly Hours and Vacation Days */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${offer.id}-hours`}
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Vinnustundir/viku
            </label>
            <input
              id={`${offer.id}-hours`}
              type="number"
              value={offer.weeklyHours}
              onChange={(e) => updateField('weeklyHours', parseFloat(e.target.value) || 38)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="1"
              max="80"
              step="1"
            />
          </div>

          <div>
            <label
              htmlFor={`${offer.id}-vacation`}
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Orlofsdagar
            </label>
            <input
              id={`${offer.id}-vacation`}
              type="number"
              value={offer.vacationDays}
              onChange={(e) => updateField('vacationDays', parseFloat(e.target.value) || 24)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="0"
              max="365"
              step="1"
            />
          </div>
        </div>

        {/* Commute Section */}
        <div className="border-t border-neutral-200 pt-4 space-y-3">
          <h4 className="text-sm font-semibold text-neutral-800">Ferðir í vinnu</h4>

          <QuickSelect
            label="Ferðatími (hvor leið)"
            options={JOB_COMMUTE_PRESETS}
            selectedId={currentCommutePreset?.id ?? null}
            onSelect={handleCommutePreset}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`${offer.id}-commute-time`}
                className="block text-xs font-medium text-neutral-600 mb-1"
              >
                Ferðatími (mín, fram og til baka)
              </label>
              <input
                id={`${offer.id}-commute-time`}
                type="number"
                value={offer.commuteMinutesPerDay}
                onChange={(e) =>
                  updateField('commuteMinutesPerDay', parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="0"
                min="0"
                max="480"
                step="5"
              />
            </div>
            <div>
              <label
                htmlFor={`${offer.id}-commute-cost`}
                className="block text-xs font-medium text-neutral-600 mb-1"
              >
                Ferðakostnaður
              </label>
              <CurrencyInput
                id={`${offer.id}-commute-cost`}
                value={offer.commuteCostMonthly}
                onChange={(v) => updateField('commuteCostMonthly', v)}
                placeholder="0"
              />
            </div>
          </div>
          {offer.commuteMinutesPerDay > 0 && metrics && (
            <p className="text-xs text-neutral-600">
              ≈ {formatISK(metrics.annualCommuteHours)} ferðastundir á ári
            </p>
          )}
        </div>

        {/* Job Expenses Section */}
        <div className="border-t border-neutral-200 pt-4">
          <button
            type="button"
            onClick={() => setShowExpenses(!showExpenses)}
            className="flex items-center justify-between w-full text-sm font-semibold text-neutral-800 hover:text-neutral-900"
          >
            <span>Útgjöld vegna vinnu</span>
            <span className="text-neutral-400">{showExpenses ? '▼' : '▶'}</span>
          </button>

          {showExpenses && (
            <div className="mt-3 space-y-3">
              {/* Clothing */}
              <QuickSelect
                label="Fatnaður"
                options={JOB_CLOTHING_PRESETS}
                selectedId={currentClothingPreset?.id ?? null}
                onSelect={handleClothingPreset}
              />
              <CurrencyInput
                id={`${offer.id}-clothing`}
                value={offer.expenses.clothing}
                onChange={(v) => updateExpense('clothing', v)}
                placeholder="0"
              />

              {/* Meals */}
              <QuickSelect
                label="Hádegismatur"
                options={JOB_MEAL_PRESETS}
                selectedId={currentMealPreset?.id ?? null}
                onSelect={handleMealPreset}
              />
              <CurrencyInput
                id={`${offer.id}-meals`}
                value={offer.expenses.meals}
                onChange={(v) => updateExpense('meals', v)}
                placeholder="0"
              />

              {/* Other expenses */}
              <div>
                <label
                  htmlFor={`${offer.id}-other-expense`}
                  className="block text-xs font-medium text-neutral-600 mb-1"
                >
                  Önnur útgjöld
                </label>
                <CurrencyInput
                  id={`${offer.id}-other-expense`}
                  value={offer.expenses.other}
                  onChange={(v) => updateExpense('other', v)}
                  placeholder="0"
                />
              </div>

              {(offer.expenses.clothing > 0 ||
                offer.expenses.meals > 0 ||
                offer.expenses.other > 0) && (
                <div className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded">
                  Samtals útgjöld:{' '}
                  {formatISK(
                    offer.expenses.clothing + offer.expenses.meals + offer.expenses.other
                  )}{' '}
                  kr/mán
                </div>
              )}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="border-t border-neutral-200 pt-4">
          <button
            type="button"
            onClick={() => setShowBenefits(!showBenefits)}
            className="flex items-center justify-between w-full text-sm font-semibold text-neutral-800 hover:text-neutral-900"
          >
            <span>Fríðindi og aukabætur</span>
            <span className="text-neutral-400">{showBenefits ? '▼' : '▶'}</span>
          </button>

          {showBenefits && (
            <div className="mt-3 space-y-3">
              {/* Quick add benefit buttons */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-600">
                  Bæta við fríðindum
                </label>
                <div className="flex flex-wrap gap-1">
                  {JOB_BENEFIT_PRESETS.filter(
                    (preset) => !offer.benefits.some((b) => b.type === preset.type)
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleAddBenefit(preset)}
                      title={`${preset.description} (${formatISK(preset.monthlyValue)} kr/mán)`}
                      className="px-2 py-1 text-xs bg-success-100 text-success-700 rounded-md hover:bg-success-200 transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefit list */}
              {offer.benefits.map((benefit, index) => (
                <div key={benefit.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={benefit.label}
                    onChange={(e) => handleUpdateBenefit(index, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder={getBenefitLabelByType(benefit.type)}
                  />
                  <div className="w-32 relative">
                    <input
                      type="number"
                      value={benefit.monthlyValue || ''}
                      onChange={(e) =>
                        handleUpdateBenefit(index, 'monthlyValue', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="0"
                      min="0"
                      step="1000"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      kr/mán
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(index)}
                    className="px-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Fjarlægja fríðindi"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddBenefit()}
                className="w-full px-3 py-2 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                + Bæta við öðrum fríðindum
              </button>

              {offer.benefits.length > 0 && (
                <div className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded">
                  Samtals fríðindi:{' '}
                  {formatISK(offer.benefits.reduce((sum, b) => sum + b.monthlyValue, 0))} kr/mán
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
