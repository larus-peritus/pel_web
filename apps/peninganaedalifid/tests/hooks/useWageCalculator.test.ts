import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWageCalculator } from '@/hooks/useWageCalculator';
import type { CalculatorInputs } from '@/types/calculator';

describe('useWageCalculator', () => {
  const createInputs = (overrides?: Partial<CalculatorInputs>): CalculatorInputs => ({
    income: {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 40,
      vacationDays: 10,
      additionalIncome: 0,
    },
    moneyExpenses: {
      commute: 0,
      clothing: 0,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    },
    timeExpenses: {
      commute: 0,
      gettingReady: 0,
      decompression: 0,
      workIllness: 0,
    },
    ...overrides,
  });

  it('should return null when gross annual income is zero', () => {
    const inputs = createInputs({
      income: {
        grossAnnualIncome: 0,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));
    expect(result.current).toBeNull();
  });

  it('should return null when gross annual income is negative', () => {
    const inputs = createInputs({
      income: {
        grossAnnualIncome: -1000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));
    expect(result.current).toBeNull();
  });

  it('should calculate results when income is positive', () => {
    const inputs = createInputs();

    const { result } = renderHook(() => useWageCalculator(inputs));
    expect(result.current).not.toBeNull();
    expect(result.current).toHaveProperty('nominalHourlyWage');
    expect(result.current).toHaveProperty('actualHourlyWage');
    expect(result.current).toHaveProperty('percentageReduction');
  });

  it('should calculate correct nominal wage', () => {
    const inputs = createInputs();

    const { result } = renderHook(() => useWageCalculator(inputs));

    // $50,000 / (40 hours * 50 weeks) = $25/hour
    expect(result.current?.nominalHourlyWage).toBe(25);
  });

  it('should calculate actual wage with no expenses equal to nominal wage', () => {
    const inputs = createInputs();

    const { result } = renderHook(() => useWageCalculator(inputs));

    expect(result.current?.actualHourlyWage).toBe(25);
    expect(result.current?.percentageReduction).toBe(0);
  });

  it('should reduce actual wage when money expenses are added', () => {
    const inputs = createInputs({
      moneyExpenses: {
        commute: 3000,
        clothing: 1000,
        meals: 2000,
        decompression: 1000,
        childcareDelta: 0,
        other: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));

    // Net income: $50,000 - $7,000 = $43,000
    // Hours: 40 * 50 = 2000
    // Actual wage: $43,000 / 2000 = $21.50
    expect(result.current?.actualHourlyWage).toBe(21.5);
  });

  it('should reduce actual wage when time expenses are added', () => {
    const inputs = createInputs({
      timeExpenses: {
        commute: 5, // 5 hours per week
        gettingReady: 2.5,
        decompression: 2.5,
        workIllness: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));

    // Total hours: (40 + 10) * 50 = 2500
    // Actual wage: $50,000 / 2500 = $20
    expect(result.current?.actualHourlyWage).toBe(20);
  });

  it('should reduce actual wage when both money and time expenses are added', () => {
    const inputs = createInputs({
      moneyExpenses: {
        commute: 5000,
        clothing: 0,
        meals: 0,
        decompression: 0,
        childcareDelta: 0,
        other: 0,
      },
      timeExpenses: {
        commute: 5,
        gettingReady: 0,
        decompression: 0,
        workIllness: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));

    // Net income: $50,000 - $5,000 = $45,000
    // Total hours: (40 + 5) * 50 = 2250
    // Actual wage: $45,000 / 2250 = $20
    expect(result.current?.actualHourlyWage).toBe(20);
  });

  it('should memoize results when inputs do not change', () => {
    const inputs = createInputs();

    const { result, rerender } = renderHook(() => useWageCalculator(inputs));
    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });

  it('should recalculate when inputs change', () => {
    const inputs1 = createInputs({
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
    });

    const { result, rerender } = renderHook(
      ({ inputs }) => useWageCalculator(inputs),
      { initialProps: { inputs: inputs1 } }
    );

    const firstResult = result.current;
    expect(firstResult?.nominalHourlyWage).toBe(25);

    const inputs2 = createInputs({
      income: {
        grossAnnualIncome: 60000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
    });

    rerender({ inputs: inputs2 });
    const secondResult = result.current;

    expect(secondResult?.nominalHourlyWage).toBe(30);
    expect(firstResult).not.toBe(secondResult);
  });

  it('should include additional income in calculations', () => {
    const inputs = createInputs({
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 10000,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));

    // Total income: $50,000 + $10,000 = $60,000
    // Hours: 40 * 50 = 2000
    // Nominal wage: $60,000 / 2000 = $30
    expect(result.current?.nominalHourlyWage).toBe(30);
  });

  it('should include expense and time breakdowns in results', () => {
    const inputs = createInputs({
      moneyExpenses: {
        commute: 3000,
        clothing: 1000,
        meals: 0,
        decompression: 0,
        childcareDelta: 0,
        other: 0,
      },
      timeExpenses: {
        commute: 5,
        gettingReady: 2.5,
        decompression: 0,
        workIllness: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));

    expect(result.current?.expenseBreakdown).toBeDefined();
    expect(result.current?.timeBreakdown).toBeDefined();
    expect(Array.isArray(result.current?.expenseBreakdown)).toBe(true);
    expect(Array.isArray(result.current?.timeBreakdown)).toBe(true);
  });

  it('should calculate percentage reduction correctly', () => {
    const inputs = createInputs({
      moneyExpenses: {
        commute: 5000,
        clothing: 0,
        meals: 0,
        decompression: 0,
        childcareDelta: 0,
        other: 0,
      },
    });

    const { result } = renderHook(() => useWageCalculator(inputs));

    // Nominal: $25, Actual: $22.50
    // Reduction: ($25 - $22.50) / $25 = 0.10 = 10%
    expect(result.current?.percentageReduction).toBe(10);
  });
});
