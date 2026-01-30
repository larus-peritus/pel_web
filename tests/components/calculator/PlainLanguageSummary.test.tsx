import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlainLanguageSummary } from '@/components/calculator/PlainLanguageSummary';
import * as CalculatorContext from '@/context/CalculatorContext';
import type { CalculationResults, CalculatorInputs } from '@/types/calculator';
import { DEFAULT_INPUTS } from '@/lib/defaults';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

describe('PlainLanguageSummary', () => {
  const mockInputs: CalculatorInputs = {
    ...DEFAULT_INPUTS,
    income: {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 40,
      vacationDays: 10,
      additionalIncome: 0,
    },
  };

  const mockResults: CalculationResults = {
    nominalHourlyWage: 25,
    actualHourlyWage: 20,
    percentageReduction: 20,
    netAnnualIncome: 45000,
    totalMoneyExpenses: 5000,
    baseWeeklyHours: 40,
    totalWeeklyHours: 45,
    totalExtraHours: 5,
    annualLifeEnergyHours: 2250,
    expenseBreakdown: [],
    timeBreakdown: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when results are null', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: null,
      inputs: mockInputs,
    } as any);

    const { container } = render(<PlainLanguageSummary />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the heading', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText('What This Means')).toBeInTheDocument();
  });

  it('displays actual and nominal hourly wages', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText('$20.00')).toBeInTheDocument();
    expect(screen.getByText(/nominal wage of \$25.00/)).toBeInTheDocument();
  });

  it('displays percentage reduction', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText(/20.0% less/)).toBeInTheDocument();
  });

  it('displays total money expenses when greater than 0', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText(/\$5,000.00/)).toBeInTheDocument();
    expect(screen.getByText(/per year on work-related expenses/)).toBeInTheDocument();
  });

  it('does not display money expenses when zero', () => {
    const resultsWithNoExpenses = {
      ...mockResults,
      totalMoneyExpenses: 0,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: resultsWithNoExpenses,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.queryByText(/per year on work-related expenses/)).not.toBeInTheDocument();
  });

  it('displays extra hours when greater than 0', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText(/5.0 hours per week/)).toBeInTheDocument();
    expect(screen.getByText(/on work-related activities beyond your paid hours/)).toBeInTheDocument();
  });

  it('does not display extra hours when zero', () => {
    const resultsWithNoExtraTime = {
      ...mockResults,
      totalExtraHours: 0,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: resultsWithNoExtraTime,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.queryByText(/on work-related activities beyond your paid hours/)).not.toBeInTheDocument();
  });

  it('displays life energy examples section', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText('In terms of your life energy:')).toBeInTheDocument();
  });

  it('calculates and displays $100 life energy cost', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    // $100 / $20/hr = 5 hours
    expect(screen.getByText(/A \$100 purchase costs you/)).toBeInTheDocument();
    expect(screen.getByText(/5 hours/)).toBeInTheDocument();
  });

  it('calculates and displays $500 life energy cost', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    // $500 / $20/hr = 25 hours = 3 days 1h (8-hour work days)
    expect(screen.getByText(/A \$500 purchase costs you/)).toBeInTheDocument();
    expect(screen.getByText(/3 days 1h/)).toBeInTheDocument();
  });

  it('calculates and displays $1000 life energy cost', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    // $1000 / $20/hr = 50 hours = 6 days 2h (8-hour work days)
    expect(screen.getByText(/A \$1,000 purchase costs you/)).toBeInTheDocument();
    expect(screen.getByText(/6 days 2h/)).toBeInTheDocument();
  });

  it('applies success severity class when reduction is low (< 15%)', () => {
    const lowReductionResults = {
      ...mockResults,
      percentageReduction: 10,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: lowReductionResults,
      inputs: mockInputs,
    } as any);

    const { container } = render(<PlainLanguageSummary />);
    const card = container.querySelector('.border-success-200');
    expect(card).toBeInTheDocument();
  });

  it('applies warning severity class when reduction is moderate (15-30%)', () => {
    const moderateReductionResults = {
      ...mockResults,
      percentageReduction: 20,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: moderateReductionResults,
      inputs: mockInputs,
    } as any);

    const { container } = render(<PlainLanguageSummary />);
    const card = container.querySelector('.border-warning-200');
    expect(card).toBeInTheDocument();
  });

  it('applies error severity class when reduction is high (> 30%)', () => {
    const highReductionResults = {
      ...mockResults,
      percentageReduction: 40,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: highReductionResults,
      inputs: mockInputs,
    } as any);

    const { container } = render(<PlainLanguageSummary />);
    const card = container.querySelector('.border-error-200');
    expect(card).toBeInTheDocument();
  });

  it('uses conversational language throughout', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);

    // Check for plain language phrases
    expect(screen.getByText(/Your actual hourly wage is/)).toBeInTheDocument();
    expect(screen.getByText(/which is/)).toBeInTheDocument();
    expect(screen.getByText(/per year on work-related expenses/)).toBeInTheDocument();
    expect(screen.getByText(/In terms of your life energy:/)).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    const resultsWithOddValues = {
      ...mockResults,
      actualHourlyWage: 22.5,
      nominalHourlyWage: 27.75,
      totalMoneyExpenses: 4567.89,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: resultsWithOddValues,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText('$22.50')).toBeInTheDocument();
    expect(screen.getByText(/\$27.75/)).toBeInTheDocument();
    expect(screen.getByText(/\$4,567.89/)).toBeInTheDocument();
  });

  it('formats percentage with one decimal place', () => {
    const resultsWithOddPercentage = {
      ...mockResults,
      percentageReduction: 23.456,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: resultsWithOddPercentage,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText(/23.5% less/)).toBeInTheDocument();
  });

  it('formats extra hours with one decimal place', () => {
    const resultsWithOddHours = {
      ...mockResults,
      totalExtraHours: 7.456,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: resultsWithOddHours,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);
    expect(screen.getByText(/7.5 hours per week/)).toBeInTheDocument();
  });

  it('handles edge case where actual wage is very low', () => {
    const lowWageResults = {
      ...mockResults,
      actualHourlyWage: 5,
      nominalHourlyWage: 10,
      percentageReduction: 50,
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: lowWageResults,
      inputs: mockInputs,
    } as any);

    const { container } = render(<PlainLanguageSummary />);

    // $100 / $5/hr = 20 hours = 2 days 4h
    expect(screen.getByText(/2 days 4h/)).toBeInTheDocument();
    // High reduction should use error styling
    expect(container.querySelector('.border-error-200')).toBeInTheDocument();
  });

  it('displays life energy in work days for large amounts', () => {
    const lowWageResults = {
      ...mockResults,
      actualHourlyWage: 10, // $10/hr
    };

    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: lowWageResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);

    // $1000 / $10/hr = 100 hours = 12 days 4h (8-hour work days)
    // formatLifeEnergy should show this as "X days Yh"
    expect(screen.getByText(/12 days 4h/)).toBeInTheDocument();
  });

  it('renders all three life energy examples', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    render(<PlainLanguageSummary />);

    const liElements = screen.getAllByRole('listitem');
    expect(liElements).toHaveLength(3);
  });

  it('maintains semantic HTML structure', () => {
    vi.spyOn(CalculatorContext, 'useCalculator').mockReturnValue({
      results: mockResults,
      inputs: mockInputs,
    } as any);

    const { container } = render(<PlainLanguageSummary />);

    // Should have heading
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

    // Should have list
    expect(container.querySelector('ul')).toBeInTheDocument();
  });
});
