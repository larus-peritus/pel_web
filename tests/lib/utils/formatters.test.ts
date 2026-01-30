import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters';

describe('formatCurrency', () => {
  it('should format ISK currency with kr suffix', () => {
    expect(formatCurrency(1234)).toBe('1.234 kr');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('0 kr');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-1234)).toBe('-1.234 kr');
  });

  it('should format large numbers with periods as thousands separator', () => {
    expect(formatCurrency(1234567)).toBe('1.234.567 kr');
  });

  it('should round to whole numbers (no decimals for ISK)', () => {
    expect(formatCurrency(1234.5)).toBe('1.235 kr');
    expect(formatCurrency(1234.4)).toBe('1.234 kr');
  });

  it('should handle typical Icelandic salary amounts', () => {
    expect(formatCurrency(7000000)).toBe('7.000.000 kr');
    expect(formatCurrency(500000)).toBe('500.000 kr');
  });
});

describe('formatPercentage', () => {
  it('should format percentage with 1 decimal by default', () => {
    expect(formatPercentage(12.5)).toBe('12.5%');
  });

  it('should format zero correctly', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should format negative percentages', () => {
    expect(formatPercentage(-12.5)).toBe('-12.5%');
  });

  it('should handle custom decimal places', () => {
    expect(formatPercentage(12.567, 2)).toBe('12.57%');
    expect(formatPercentage(12.567, 0)).toBe('13%');
  });

  it('should handle whole numbers', () => {
    expect(formatPercentage(100)).toBe('100.0%');
  });

  it('should round correctly', () => {
    expect(formatPercentage(12.56, 1)).toBe('12.6%');
    expect(formatPercentage(12.54, 1)).toBe('12.5%');
  });
});

describe('formatNumber', () => {
  it('should format numbers with Icelandic locale (period as thousands separator)', () => {
    expect(formatNumber(1234)).toBe('1.234');
  });

  it('should format zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should format negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1.234');
  });

  it('should format large numbers', () => {
    expect(formatNumber(1234567)).toBe('1.234.567');
  });

  it('should handle decimal numbers (comma as decimal separator in Icelandic)', () => {
    expect(formatNumber(1234.56)).toBe('1.234,56');
  });

  it('should handle very large numbers', () => {
    expect(formatNumber(1234567890)).toBe('1.234.567.890');
  });
});
