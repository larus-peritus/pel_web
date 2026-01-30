'use client';

/**
 * Main Snowball Calculator Page Component
 * Orchestrates all input and result components for snowball calculator
 */

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SnowballLoanInput, SnowballInput, SnowballResults } from '@/types/snowball';
import { calculateSnowball } from '@/lib/calculations/snowball';
import { DEFAULT_LOAN_INPUT, DEFAULT_EXTRA_PAYMENT, DEFAULT_INVESTMENT_RETURN } from '@/lib/constants/snowball';
import { Alert } from '@/components/ui/Alert';
import { LoanInputCard } from './LoanInputCard';
import { ExtraPaymentCard } from './ExtraPaymentCard';
import { InvestmentCard } from './InvestmentCard';
import { ScenarioSummary } from './ScenarioSummary';
import { SnowballChart } from './SnowballChart';
import { RecommendationCard } from './RecommendationCard';
import { MonthlyBreakdown } from './MonthlyBreakdown';

interface SnowballCalculatorPageProps {
  /** User's actual hourly wage for life energy calculations */
  actualHourlyWage?: number;
}

/**
 * Helper to map debt payoff input to snowball loan input
 * Used when pre-filling from query parameters
 */
function mapDebtInputToSnowballLoan(data: any): Partial<SnowballLoanInput> {
  const mapped: Partial<SnowballLoanInput> = {};

  if (typeof data.currentBalance === 'number' && data.currentBalance > 0) {
    mapped.currentBalance = data.currentBalance;
    // If no original amount provided, assume current = original
    mapped.originalLoanAmount = data.currentBalance;
  }

  if (typeof data.nominalInterestRate === 'number') {
    mapped.annualInterestRate = data.nominalInterestRate;
  }

  if (data.loanType === 'verdtryggd' || data.loanType === 'oVerdtryggd') {
    mapped.loanType = data.loanType;
  }

  if (data.loanType === 'verdtryggd' && typeof data.inflationRate === 'number') {
    mapped.inflationRate = data.inflationRate;
  }

  if (data.loanType === 'oVerdtryggd' && data.paymentMethod) {
    mapped.paymentMethod = data.paymentMethod;
  }

  if (typeof data.loanTermMonths === 'number' && data.loanTermMonths > 0) {
    mapped.loanTermMonths = data.loanTermMonths;
  }

  if (typeof data.remainingPayments === 'number' && data.remainingPayments > 0) {
    mapped.remainingPayments = data.remainingPayments;
  }

  return mapped;
}

export function SnowballCalculatorPage({ actualHourlyWage = 0 }: SnowballCalculatorPageProps) {
  // State for loan input
  const [loan, setLoan] = useState<SnowballLoanInput>(() => ({
    ...DEFAULT_LOAN_INPUT,
  }));

  // State for extra payment
  const [extraPayment, setExtraPayment] = useState<number>(DEFAULT_EXTRA_PAYMENT);

  // State for investment return
  const [investmentReturn, setInvestmentReturn] = useState<number>(DEFAULT_INVESTMENT_RETURN);

  // State for post-payoff investing toggle
  const [includePostPayoffInvesting, setIncludePostPayoffInvesting] = useState<boolean>(true);

  // Read query parameters for pre-fill
  const searchParams = useSearchParams();

  // Pre-fill logic from query parameters (Task 7.3)
  useEffect(() => {
    const dataParam = searchParams?.get('data');
    if (!dataParam) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(dataParam));
      const mapped = mapDebtInputToSnowballLoan(parsed);

      // Validate and apply
      if (Object.keys(mapped).length > 0) {
        setLoan((prev) => ({
          ...prev,
          ...mapped,
        }));

        // Also pre-fill extra payment if provided
        if (typeof parsed.extraPayment === 'number' && parsed.extraPayment >= 0) {
          setExtraPayment(parsed.extraPayment);
        }
      }
    } catch (error) {
      // Silently ignore invalid data
      console.warn('Failed to parse pre-fill data:', error);
    }
  }, [searchParams]);

  // Validate inputs
  const inputsValid = useMemo(() => {
    return (
      loan.currentBalance > 0 &&
      loan.originalLoanAmount > 0 &&
      loan.annualInterestRate >= 0 &&
      loan.loanTermMonths > 0 &&
      loan.remainingPayments > 0 &&
      extraPayment >= 0 &&
      investmentReturn >= 0
    );
  }, [loan, extraPayment, investmentReturn]);

  // Calculate results with debouncing via useMemo
  const results = useMemo<SnowballResults | null>(() => {
    if (!inputsValid) return null;

    try {
      const input: SnowballInput = {
        loan,
        extraPayment,
        expectedInvestmentReturn: investmentReturn,
        actualHourlyWage: actualHourlyWage || undefined,
        includePostPayoffInvesting,
      };

      return calculateSnowball(input);
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, [loan, extraPayment, investmentReturn, actualHourlyWage, inputsValid, includePostPayoffInvesting]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vaxtasparnaður Snjóboltareiknivél</h1>
        <p className="text-gray-600">
          Berðu saman þrjár aðferðir: grunnur (aukagreiðsla eingöngu), snjóbolti í lán (vaxtasparnaður
          beint í lán), og snjóbolti í fjárfestingu (vaxtasparnaður fjárfestur).
        </p>
      </div>

      {/* Warning if actualHourlyWage not set */}
      {!actualHourlyWage || actualHourlyWage === 0 ? (
        <Alert variant="warning" className="mb-6">
          <strong>Athugið:</strong> Þú hefur ekki reiknað raunverulegt tímakaup þitt. Lífsorku útreikningar
          verða ekki tiltækir. Farðu á forsíðu til að reikna tímakaupið þitt.
        </Alert>
      ) : null}

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-2">
          <LoanInputCard loan={loan} onChange={setLoan} />
        </div>
        <ExtraPaymentCard
          value={extraPayment}
          onChange={setExtraPayment}
          actualHourlyWage={actualHourlyWage}
        />
        <InvestmentCard
          value={investmentReturn}
          onChange={setInvestmentReturn}
          includePostPayoffInvesting={includePostPayoffInvesting}
          onPostPayoffInvestingChange={setIncludePostPayoffInvesting}
        />
      </div>

      {/* Validation Errors */}
      {!inputsValid && (
        <Alert variant="error" className="mb-6">
          <strong>Villa:</strong> Vinsamlegast fylltu út öll nauðsynleg svæði með gilt gildum.
        </Alert>
      )}

      {/* Results Section - Only show when inputs are valid */}
      {results && (
        <div className="space-y-8">
          {/* Recommendation Card */}
          <RecommendationCard recommendation={results.recommendation} />

          {/* Scenario Comparison Cards */}
          <ScenarioSummary results={results} />

          {/* Charts */}
          <SnowballChart results={results} />

          {/* Monthly Breakdown Table */}
          <MonthlyBreakdown results={results} actualHourlyWage={actualHourlyWage} />
        </div>
      )}
    </div>
  );
}
