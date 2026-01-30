'use client';

/**
 * One-Time Purchase Decision Tool Page
 *
 * Helps users evaluate large purchases in terms of:
 * - Life energy cost (hours of work)
 * - Opportunity cost (future value if invested)
 * - FI impact (delay on financial independence)
 */

import React, { useState, useEffect } from 'react';
import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import {
  INITIAL_STATE,
  DEFAULT_SETTINGS,
} from '@/types/oneTimePurchase.types';
import type {
  OneTimePurchaseState,
  PurchaseCalculationResult,
  PurchaseComparison,
  PurchaseInput,
  PurchaseCalculationSettings,
  RequiredUserData,
} from '@/types/oneTimePurchase.types';
import {
  calculatePurchaseResult,
  compareOptions,
} from '@/lib/calculations/oneTimePurchaseCalculations';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from '@/lib/storage/oneTimePurchaseStorage';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';

function OneTimePurchaseContent() {
  // Get user data from calculator context
  const { results: calculatorResults } = useCalculator();

  // State
  const [state, setState] = useState<OneTimePurchaseState>(INITIAL_STATE);
  const [result, setResult] = useState<PurchaseCalculationResult | null>(null);
  const [comparison, setComparison] = useState<PurchaseComparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      setState(saved);
    }
  }, []);

  // Save to localStorage when state changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(state);
    }, 500);

    return () => clearTimeout(timer);
  }, [state]);

  // Calculate results when inputs or user data changes
  useEffect(() => {
    if (!calculatorResults?.actualHourlyWage) {
      setResult(null);
      setError(null);
      return;
    }

    if (state.mainPurchase.price <= 0) {
      setResult(null);
      setError(null);
      return;
    }

    try {
      const userData: RequiredUserData = {
        actualHourlyWage: calculatorResults.actualHourlyWage,
        // FI data would come from context in future
      };

      const calculationResult = calculatePurchaseResult(
        state.mainPurchase,
        userData,
        state.settings,
      );

      setResult(calculationResult);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Villa við útreikning');
      setResult(null);
    }
  }, [state.mainPurchase, state.settings, calculatorResults]);

  // Calculate comparison when enabled
  useEffect(() => {
    if (!state.showComparison || !calculatorResults?.actualHourlyWage) {
      setComparison(null);
      return;
    }

    // Filter out empty comparison options
    const validOptions = state.comparisonOptions.filter((opt) => opt.price > 0);

    if (validOptions.length === 0) {
      setComparison(null);
      return;
    }

    try {
      const userData: RequiredUserData = {
        actualHourlyWage: calculatorResults.actualHourlyWage,
      };

      const allOptions = [state.mainPurchase, ...validOptions];
      const comparisonResult = compareOptions(allOptions, userData, state.settings);

      setComparison(comparisonResult);
    } catch (err) {
      console.error('Comparison calculation error:', err);
      setComparison(null);
    }
  }, [state.showComparison, state.mainPurchase, state.comparisonOptions, state.settings, calculatorResults]);

  // Handlers
  const handlePurchaseChange = (updates: Partial<PurchaseInput>) => {
    setState((prev) => ({
      ...prev,
      mainPurchase: { ...prev.mainPurchase, ...updates },
    }));
  };

  const handleSettingsChange = (updates: Partial<PurchaseCalculationSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  };

  const handleClear = () => {
    setState(INITIAL_STATE);
    clearLocalStorage();
    setResult(null);
    setComparison(null);
    setError(null);
  };

  const handleToggleComparison = () => {
    setState((prev) => ({
      ...prev,
      showComparison: !prev.showComparison,
    }));
  };

  const handleAddComparisonOption = () => {
    setState((prev) => ({
      ...prev,
      comparisonOptions: [...prev.comparisonOptions, { price: 0, name: '' }],
    }));
  };

  const handleComparisonOptionChange = (index: number, updates: Partial<PurchaseInput>) => {
    setState((prev) => ({
      ...prev,
      comparisonOptions: prev.comparisonOptions.map((opt, i) =>
        i === index ? { ...opt, ...updates } : opt
      ),
    }));
  };

  const handleRemoveComparisonOption = (index: number) => {
    setState((prev) => ({
      ...prev,
      comparisonOptions: prev.comparisonOptions.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Einstakskaupaverkfæri
        </h1>
        <p className="text-neutral-600">
          Mettu stór kaup í samhengi við lífsorku og framtíðarvirði
        </p>
      </div>

      {!calculatorResults?.actualHourlyWage ? (
        <Alert variant="warning">
          <h3 className="font-semibold mb-1">Vantar upplýsingar</h3>
          <p>
            Þú þarft að fylla út{' '}
            <a href="/" className="text-brand-600 underline">
              Raunverulegt Tímakaup
            </a>{' '}
            fyrst til að nota þetta verkfæri.
          </p>
        </Alert>
      ) : (
        <>
          {/* Main Purchase Input */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Upplýsingar um kaupin</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CurrencyInput
                  label="Kaupverð"
                  value={state.mainPurchase.price}
                  onChange={(value) => handlePurchaseChange({ price: value })}
                  placeholder="t.d. 2.000.000"
                  helpText="Heildarkostnaður kaupanna í krónum"
                  required
                />

                <Input
                  label="Lýsing (valfrjálst)"
                  type="text"
                  value={state.mainPurchase.name || ''}
                  onChange={(e) => handlePurchaseChange({ name: e.target.value })}
                  placeholder="t.d. Nýr bíll"
                  helpText="Stuttur lýsing á kaupin"
                />

                <div className="border-t pt-4">
                  <NumberInput
                    label="Vænt ávöxtun"
                    value={state.settings.expectedReturnRate * 100}
                    onChange={(value) =>
                      handleSettingsChange({ expectedReturnRate: value / 100 })
                    }
                    min={0}
                    max={15}
                    step={0.5}
                    suffix="%"
                    helpText="Sjálfgefið 7% miðast við langtíma hlutabréfaávöxtun"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {result && (
            <div className="space-y-6 mb-6">
              {/* Life Energy Cost */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Lífsorku kostnaður</h2>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-brand-600 mb-2">
                      {result.lifeEnergyCost.totalHours.toFixed(1)}
                    </div>
                    <div className="text-lg text-neutral-600 mb-4">
                      klukkustundir
                    </div>
                    <div className="text-neutral-700">
                      Það samsvarar{' '}
                      <span className="font-semibold">
                        {result.lifeEnergyCost.formattedString}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg text-sm text-neutral-600">
                    Til að vinna sér inn þessa upphæð þarft þú að vinna í{' '}
                    {result.lifeEnergyCost.formattedString}.
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Cost */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tækifæriskostnaður</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-600">
                      Ef þú fjárfestir {result.input.price.toLocaleString('is-IS')} kr í
                      staðinn:
                    </p>
                    {result.futureValues.map((fv) => (
                      <div
                        key={fv.years}
                        className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
                      >
                        <span className="font-medium">Eftir {fv.years} ár:</span>
                        <span className="text-lg font-semibold text-brand-600">
                          {fv.formattedValue}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
                    Þetta er munurinn á því að eyða peningunum núna á móti því að
                    fjárfesta þá.
                  </div>
                </CardContent>
              </Card>

              {/* FI Impact (if available) */}
              {result.fiImpact && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">
                      Áhrif á fjárhagslegt frelsi
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {result.fiImpact.delayMonths}
                      </div>
                      <div className="text-lg text-neutral-600 mb-4">
                        mánuðir seinkun
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-sm text-green-900">
                      Ef þú hættir við þessi kaup, nærðu fjárhagslegu frelsi{' '}
                      {result.fiImpact.formattedDelay} fyrr.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Comparison Toggle */}
          <div className="mb-6">
            <Button onClick={handleToggleComparison} variant="secondary">
              {state.showComparison ? 'Fela samanburð' : 'Bera saman valkosti'}
            </Button>
          </div>

          {/* Comparison Section */}
          {state.showComparison && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Samanburður valkosta</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Main purchase (read-only) */}
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <div className="text-sm font-medium text-neutral-600 mb-2">
                      Valkostur 1 (aðalkaup)
                    </div>
                    <div className="text-lg font-semibold">
                      {state.mainPurchase.price.toLocaleString('is-IS')} kr
                    </div>
                    {state.mainPurchase.name && (
                      <div className="text-sm text-neutral-600">
                        {state.mainPurchase.name}
                      </div>
                    )}
                  </div>

                  {/* Comparison options */}
                  {state.comparisonOptions.map((option, index) => (
                    <div key={index} className="p-4 border-2 border-neutral-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm font-medium text-neutral-600">
                          Valkostur {index + 2}
                        </div>
                        <Button
                          onClick={() => handleRemoveComparisonOption(index)}
                          variant="ghost"
                          size="sm"
                        >
                          Fjarlægja
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <CurrencyInput
                          label="Kaupverð"
                          value={option.price}
                          onChange={(value) =>
                            handleComparisonOptionChange(index, { price: value })
                          }
                          placeholder="t.d. 1.500.000"
                        />
                        <Input
                          label="Lýsing"
                          type="text"
                          value={option.name || ''}
                          onChange={(e) =>
                            handleComparisonOptionChange(index, {
                              name: e.target.value,
                            })
                          }
                          placeholder="t.d. Notaður bíll"
                        />
                      </div>
                    </div>
                  ))}

                  {state.comparisonOptions.length < 2 && (
                    <Button onClick={handleAddComparisonOption} variant="secondary">
                      Bæta við valkosti
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Results */}
          {comparison && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Niðurstöður samanburðar</h2>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2"></th>
                        {comparison.options.map((opt, idx) => (
                          <th key={idx} className="text-right py-3 px-2">
                            <div className="font-semibold">
                              {opt.input.name || `Valkostur ${idx + 1}`}
                            </div>
                            {idx === comparison.cheapestOptionIndex && (
                              <div className="text-xs text-green-600 font-normal">
                                Ódýrastur
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-2 font-medium">Kaupverð</td>
                        {comparison.options.map((opt, idx) => (
                          <td key={idx} className="py-3 px-2 text-right">
                            {opt.input.price.toLocaleString('is-IS')} kr
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2 font-medium">Lífsorku klst</td>
                        {comparison.options.map((opt, idx) => (
                          <td key={idx} className="py-3 px-2 text-right">
                            {opt.lifeEnergyCost.totalHours.toFixed(1)} klst
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">Framtíðarvirði (20 ár)</td>
                        {comparison.options.map((opt, idx) => {
                          const fv20 = opt.futureValues.find((fv) => fv.years === 20);
                          return (
                            <td key={idx} className="py-3 px-2 text-right">
                              {fv20?.formattedValue || '-'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clear Button */}
          <div className="flex justify-end">
            <Button onClick={handleClear} variant="secondary">
              Hreinsa
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function OneTimePurchasePage() {
  return (
    <CalculatorProvider>
      <OneTimePurchaseContent />
    </CalculatorProvider>
  );
}
