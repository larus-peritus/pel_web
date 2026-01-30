import { describe, it, expect } from 'vitest';
import {
  addMonths,
  roundToDecimal,
  clamp,
  formatISK,
  dollarsToLifeEnergy,
} from '../utils';

describe('addMonths', () => {
  it('should add 0 months correctly', () => {
    const date = new Date('2024-01-15');
    const result = addMonths(date, 0);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2024);
  });

  it('should add 1 month correctly', () => {
    const date = new Date('2024-01-15');
    const result = addMonths(date, 1);
    expect(result.getMonth()).toBe(1); // February
  });

  it('should add 12 months correctly', () => {
    const date = new Date('2024-01-15');
    const result = addMonths(date, 12);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2025);
  });

  it('should add 24 months correctly', () => {
    const date = new Date('2024-01-15');
    const result = addMonths(date, 24);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2026);
  });
});

describe('roundToDecimal', () => {
  it('should round to 0 decimals', () => {
    expect(roundToDecimal(1.234, 0)).toBe(1);
    expect(roundToDecimal(1.567, 0)).toBe(2);
  });

  it('should round to 1 decimal', () => {
    expect(roundToDecimal(1.234, 1)).toBe(1.2);
    expect(roundToDecimal(1.267, 1)).toBe(1.3);
  });

  it('should round to 2 decimals', () => {
    expect(roundToDecimal(1.2345, 2)).toBe(1.23);
    expect(roundToDecimal(1.2367, 2)).toBe(1.24);
  });
});

describe('clamp', () => {
  it('should return min if value below min', () => {
    expect(clamp(5, 10, 20)).toBe(10);
  });

  it('should return max if value above max', () => {
    expect(clamp(25, 10, 20)).toBe(20);
  });

  it('should return value if within range', () => {
    expect(clamp(15, 10, 20)).toBe(15);
  });

  it('should handle edge cases', () => {
    expect(clamp(10, 10, 20)).toBe(10);
    expect(clamp(20, 10, 20)).toBe(20);
  });
});

describe('formatISK', () => {
  it('should format 0 correctly', () => {
    expect(formatISK(0)).toBe('0 kr');
  });

  it('should format small numbers correctly', () => {
    expect(formatISK(100)).toBe('100 kr');
    expect(formatISK(1000)).toBe('1.000 kr');
  });

  it('should format large numbers correctly', () => {
    expect(formatISK(1000000)).toBe('1.000.000 kr');
    expect(formatISK(1234567)).toBe('1.234.567 kr');
  });
});

describe('dollarsToLifeEnergy', () => {
  it('should calculate hours correctly with normal inputs', () => {
    expect(dollarsToLifeEnergy(1000, 100)).toBe(10);
    expect(dollarsToLifeEnergy(2500, 50)).toBe(50);
  });

  it('should return Infinity with zero wage', () => {
    expect(dollarsToLifeEnergy(1000, 0)).toBe(Infinity);
  });

  it('should return 0 with negative amount', () => {
    expect(dollarsToLifeEnergy(-100, 50)).toBe(0);
  });

  it('should handle edge cases', () => {
    expect(dollarsToLifeEnergy(0, 100)).toBe(0);
    expect(dollarsToLifeEnergy(100, 0.01)).toBe(10000);
  });
});
