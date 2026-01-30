'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useCalculator } from '@/context/CalculatorContext';
import {
  EatingOutInputs,
  HomeCookingInputs,
  MealCostComparison,
  MealCostBreakdown,
  MealPresetSelector,
} from '@/components/mealCost';
import { formatCurrency } from '@/lib/utils/formatters';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import type { MealScenarioPreset } from '@/types/calculator';

type TabId = 'inputs' | 'comparison' | 'presets';

export interface MealCostCalculatorProps {
  className?: string;
}

/**
 * Main MealCostCalculator container component
 *
 * Integrates all meal cost child components with tab navigation:
 * - "Innsláttur" (Inputs): Two-column layout with EatingOutInputs and HomeCookingInputs
 * - "Samanburður" (Comparison): MealCostComparison and MealCostBreakdown
 * - "Atburðarásir" (Presets): MealPresetSelector
 *
 * Uses CalculatorContext for state management and actual hourly wage.
 * Shows Alert if actualHourlyWage is 0.
 */
export function MealCostCalculator({ className }: MealCostCalculatorProps) {
  const {
    mealCostData,
    updateEatingOut,
    updateHomeCooking,
    updateMealCostData,
    mealCostSummary,
    results,
  } = useCalculator();

  const [activeTab, setActiveTab] = useState<TabId>('inputs');
  const [showEatingOutBreakdown, setShowEatingOutBreakdown] = useState(false);
  const [showHomeCookingBreakdown, setShowHomeCookingBreakdown] = useState(false);

  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  // Handle preset selection
  const handlePresetSelect = (preset: MealScenarioPreset) => {
    updateMealCostData({
      eatingOut: preset.eatingOut,
      homeCooking: preset.homeCooking,
    });
    // Switch to inputs tab to show the applied preset
    setActiveTab('inputs');
  };

  // Tab navigation buttons
  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'inputs', label: 'Innsláttur' },
    { id: 'comparison', label: 'Samanburður' },
    { id: 'presets', label: 'Atburðarásir' },
  ];

  return (
    <div className={className}>
      {/* Wage Warning */}
      {actualHourlyWage === 0 && (
        <Alert variant="warning" className="mb-6">
          <strong>Vantar raunverulegt tímakaup:</strong>{' '}
          Vinsamlegast fylltu út raunverulegt tímakaup í aðalreiknivélinni fyrst.
          Án þess getur þessi reiknivél ekki umbreytt kostnaði í lífsorku.
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'inputs' && (
        <div className="space-y-6">
          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Eating Out */}
            <EatingOutInputs
              data={mealCostData.eatingOut}
              onChange={updateEatingOut}
            />

            {/* Right Column: Home Cooking */}
            <HomeCookingInputs
              data={mealCostData.homeCooking}
              onChange={updateHomeCooking}
              actualHourlyWage={actualHourlyWage}
            />
          </div>

          {/* Basic Totals Display */}
          {mealCostSummary && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Samanburður á mánuði
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Eating Out Total */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-neutral-600">
                      Þægindamatur
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatCurrency(mealCostSummary.eatingOutSummary.monthlyCost)}
                    </div>
                    {actualHourlyWage > 0 && (
                      <div className="text-sm text-neutral-600">
                        {formatLifeEnergy(
                          mealCostSummary.eatingOutSummary.monthlyLifeEnergy
                        )}
                      </div>
                    )}
                  </div>

                  {/* Home Cooking Total */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-neutral-600">
                      Grunnkostnaður (heimaeldun)
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatCurrency(mealCostSummary.homeCookingSummary.monthlyCost)}
                    </div>
                    {actualHourlyWage > 0 && (
                      <div className="text-sm text-neutral-600">
                        {formatLifeEnergy(
                          mealCostSummary.homeCookingSummary.monthlyLifeEnergy
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Action */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('comparison')}
                    className="w-full md:w-auto"
                  >
                    Sjá nákvæman samanburð →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Main Comparison */}
          {mealCostSummary && (
            <>
              <MealCostComparison
                comparison={mealCostSummary}
                actualHourlyWage={actualHourlyWage}
              />

              {/* Eating Out Breakdown (Collapsible) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Sundurliðun - Þægindamatur
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEatingOutBreakdown(!showEatingOutBreakdown)}
                    >
                      {showEatingOutBreakdown ? 'Fela' : 'Sýna'}
                    </Button>
                  </div>
                </CardHeader>
                {showEatingOutBreakdown && (
                  <CardContent>
                    <MealCostBreakdown
                      summary={mealCostSummary.eatingOutSummary}
                      type="eatingOut"
                      actualHourlyWage={actualHourlyWage}
                    />
                  </CardContent>
                )}
              </Card>

              {/* Home Cooking Breakdown (Collapsible) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Sundurliðun - Grunnkostnaður
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHomeCookingBreakdown(!showHomeCookingBreakdown)}
                    >
                      {showHomeCookingBreakdown ? 'Fela' : 'Sýna'}
                    </Button>
                  </div>
                </CardHeader>
                {showHomeCookingBreakdown && (
                  <CardContent>
                    <MealCostBreakdown
                      summary={mealCostSummary.homeCookingSummary}
                      type="homeCooking"
                      actualHourlyWage={actualHourlyWage}
                    />
                  </CardContent>
                )}
              </Card>
            </>
          )}

          {!mealCostSummary && (
            <Alert variant="info">
              <strong>Engin gögn:</strong> Vinsamlegast farðu í „Innsláttur" flipann
              til að setja inn matarkostnaðargögn.
            </Alert>
          )}
        </div>
      )}

      {activeTab === 'presets' && (
        <div>
          <MealPresetSelector
            onSelect={handlePresetSelect}
            actualHourlyWage={actualHourlyWage}
            currentData={mealCostData}
          />
        </div>
      )}
    </div>
  );
}
