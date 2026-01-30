'use client';

import { useState, useMemo, useEffect } from 'react';
import { Alert } from '@/components/ui/Alert';
import { FIInputsSection } from './FIInputsSection';
import { SavingsRateSlider } from './SavingsRateSlider';
import { FIResultsDisplay } from './FIResultsDisplay';
import { calculateFIResults, calculateSavingsRate } from '@/lib/calculations/fi';
import { DEFAULT_FI_INPUTS } from '@/lib/constants/fi';
import { FI_STRINGS } from '@/lib/constants/icelandic';
import { useCalculator } from '@/context/CalculatorContext';
import type { FIInputs } from '@/types/fi';

interface SavingsRateCalculatorProps {
  actualHourlyWage?: number;
}

/**
 * Savings Rate Calculator - Main Container Component
 *
 * Orchestrates:
 * - FI inputs section
 * - Savings rate slider
 * - Results display
 * - Real-time calculation
 *
 * Integrates with CalculatorContext to pull:
 * - FI Number from FI Number Builder
 * - Annual Income from main calculator
 * - Annual Expenses from Current Expense Report
 * - Current Net Worth from Savings Report
 */
export function SavingsRateCalculator({ actualHourlyWage }: SavingsRateCalculatorProps) {
  // Get data from calculator context
  const {
    inputs,
    fiNumberResults,
    currentExpenseResults,
    savingsReportResults,
  } = useCalculator();

  // State for FI inputs
  const [fiInputs, setFiInputs] = useState<FIInputs>(DEFAULT_FI_INPUTS);

  // Track if user has manually edited values
  const [userEdited, setUserEdited] = useState({
    fiNumber: false,
    annualIncome: false,
    annualExpenses: false,
    currentNetWorth: false,
  });

  // Sync FI Number from context (pension-adjusted if available, otherwise regular)
  useEffect(() => {
    if (userEdited.fiNumber) return;
    const contextFINumber = fiNumberResults?.pensionAdjusted?.totalNeeded ?? fiNumberResults?.fiNumber;
    if (contextFINumber && contextFINumber > 0) {
      setFiInputs(prev => ({ ...prev, fiNumber: contextFINumber }));
    }
  }, [fiNumberResults, userEdited.fiNumber]);

  // Sync Annual Income from context
  useEffect(() => {
    if (userEdited.annualIncome) return;
    const contextAnnualIncome = inputs.income.grossAnnualIncome;
    if (contextAnnualIncome && contextAnnualIncome > 0) {
      setFiInputs(prev => ({ ...prev, annualIncome: contextAnnualIncome }));
    }
  }, [inputs.income.grossAnnualIncome, userEdited.annualIncome]);

  // Sync Annual Expenses from context
  useEffect(() => {
    if (userEdited.annualExpenses) return;
    const contextAnnualExpenses = currentExpenseResults?.totalAnnual;
    if (contextAnnualExpenses && contextAnnualExpenses > 0) {
      setFiInputs(prev => ({ ...prev, annualExpenses: contextAnnualExpenses }));
    }
  }, [currentExpenseResults?.totalAnnual, userEdited.annualExpenses]);

  // Sync Current Net Worth from savings report
  useEffect(() => {
    if (userEdited.currentNetWorth) return;
    const contextNetWorth = savingsReportResults?.totalSavings;
    if (contextNetWorth && contextNetWorth > 0) {
      setFiInputs(prev => ({ ...prev, currentNetWorth: contextNetWorth }));
    }
  }, [savingsReportResults?.totalSavings, userEdited.currentNetWorth]);

  // State for target savings rate (what user is exploring via slider)
  const [targetSavingsRate, setTargetSavingsRate] = useState<number>(0);

  // Calculate current savings rate from inputs
  const currentSavingsRate = useMemo(() => {
    return calculateSavingsRate(fiInputs.annualIncome, fiInputs.annualExpenses);
  }, [fiInputs.annualIncome, fiInputs.annualExpenses]);

  // Initialize target rate when current rate changes
  useMemo(() => {
    if (targetSavingsRate === 0 && currentSavingsRate > 0) {
      setTargetSavingsRate(currentSavingsRate);
    }
  }, [currentSavingsRate, targetSavingsRate]);

  // Calculate FI results based on target savings rate
  const fiResults = useMemo(() => {
    // Use target savings rate for calculation
    const inputsWithRate: FIInputs = {
      ...fiInputs,
      currentSavingsRate: targetSavingsRate,
    };

    return calculateFIResults(inputsWithRate, actualHourlyWage);
  }, [fiInputs, targetSavingsRate, actualHourlyWage]);

  // Handle input changes and track manual edits
  const handleInputChange = (updates: Partial<FIInputs>) => {
    // Mark edited fields to prevent auto-sync override
    const newEdited = { ...userEdited };
    if ('fiNumber' in updates) newEdited.fiNumber = true;
    if ('annualIncome' in updates) newEdited.annualIncome = true;
    if ('annualExpenses' in updates) newEdited.annualExpenses = true;
    if ('currentNetWorth' in updates) newEdited.currentNetWorth = true;
    setUserEdited(newEdited);

    setFiInputs((prev) => ({ ...prev, ...updates }));
  };

  // Handle savings rate slider changes
  const handleSavingsRateChange = (rate: number) => {
    setTargetSavingsRate(rate);
  };

  // Validation
  const hasValidInputs =
    fiInputs.fiNumber > 0 &&
    fiInputs.annualIncome > 0 &&
    fiInputs.annualExpenses >= 0;

  const hasNegativeSavings = fiInputs.annualExpenses >= fiInputs.annualIncome;

  // Count how many fields are synced from context
  const syncedFields: string[] = [];
  if (fiNumberResults?.fiNumber && !userEdited.fiNumber) syncedFields.push('FI Markmið');
  if (inputs.income.grossAnnualIncome > 0 && !userEdited.annualIncome) syncedFields.push('Árstekjur');
  if (currentExpenseResults?.totalAnnual && !userEdited.annualExpenses) syncedFields.push('Árleg útgjöld');
  if (savingsReportResults?.totalSavings && !userEdited.currentNetWorth) syncedFields.push('Núverandi eign');

  // Reset to synced values
  const handleResetToSynced = () => {
    setUserEdited({
      fiNumber: false,
      annualIncome: false,
      annualExpenses: false,
      currentNetWorth: false,
    });
  };

  // Check if user has edited any values
  const hasUserEdits = Object.values(userEdited).some(v => v);

  return (
    <div className="space-y-6">
      {/* Info about synced data */}
      {syncedFields.length > 0 && (
        <Alert variant="info" title="Gögn sótt úr öðrum reiknivélum">
          <p>
            Eftirfarandi gildi eru sótt sjálfkrafa: {syncedFields.join(', ')}.
            Þú getur breytt þeim handvirkt ef þú vilt.
          </p>
          {hasUserEdits && (
            <button
              onClick={handleResetToSynced}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Endurstilla á samstillt gildi
            </button>
          )}
        </Alert>
      )}

      {/* Warning if no wage calculated */}
      {!actualHourlyWage && (
        <Alert variant="warning" title="Tímakaup vantar">
          <p>
            Til að sjá lífsorku áhrif (vinnuár sparað), reiknaðu fyrst tímakaup þitt í "Tímakaup" flipanum.
          </p>
        </Alert>
      )}

      {/* Warning if negative savings */}
      {hasNegativeSavings && (
        <Alert variant="error" title={FI_STRINGS.messages.negativeDescending}>
          <p>{FI_STRINGS.messages.negativeSavingsDetail}</p>
        </Alert>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-1">
          <FIInputsSection inputs={fiInputs} onChange={handleInputChange} />
        </div>

        {/* Middle Column - Slider */}
        <div className="lg:col-span-2 space-y-6">
          <SavingsRateSlider
            currentRate={currentSavingsRate}
            targetRate={targetSavingsRate}
            onChange={handleSavingsRateChange}
          />

          {/* Results */}
          {hasValidInputs && !hasNegativeSavings && (
            <FIResultsDisplay
              results={fiResults}
              actualHourlyWage={actualHourlyWage}
            />
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* Results first (most important on mobile) */}
        {hasValidInputs && !hasNegativeSavings && (
          <FIResultsDisplay
            results={fiResults}
            actualHourlyWage={actualHourlyWage}
          />
        )}

        {/* Slider */}
        <SavingsRateSlider
          currentRate={currentSavingsRate}
          targetRate={targetSavingsRate}
          onChange={handleSavingsRateChange}
        />

        {/* Inputs (collapsible on mobile) */}
        <FIInputsSection inputs={fiInputs} onChange={handleInputChange} />
      </div>

    </div>
  );
}
