import { describe, it, expect } from 'vitest';
import {
  dollarsToLifeEnergy,
  formatLifeEnergy,
  formatDollarsAsLifeEnergy,
} from '@/lib/calculations/lifeEnergy';

describe('dollarsToLifeEnergy', () => {
  it('should convert $100 at $20/hr to 5 hours', () => {
    const result = dollarsToLifeEnergy(100, 20);
    expect(result).toBe(5);
  });

  it('should handle zero wage by returning 0', () => {
    const result = dollarsToLifeEnergy(100, 0);
    expect(result).toBe(0);
  });

  it('should handle negative wage by returning 0', () => {
    const result = dollarsToLifeEnergy(100, -5);
    expect(result).toBe(0);
  });

  it('should handle negative dollars by returning 0', () => {
    const result = dollarsToLifeEnergy(-100, 20);
    expect(result).toBe(0);
  });

  it('should handle fractional hours correctly', () => {
    const result = dollarsToLifeEnergy(50, 15);
    expect(result).toBeCloseTo(3.3333, 4);
  });

  it('should handle zero dollars', () => {
    const result = dollarsToLifeEnergy(0, 20);
    expect(result).toBe(0);
  });
});

describe('formatLifeEnergy', () => {
  it('should format less than 1 hour as minutes (30 min)', () => {
    const result = formatLifeEnergy(0.5);
    expect(result).toBe('30 minutes');
  });

  it('should format less than 1 hour as minutes (15 min)', () => {
    const result = formatLifeEnergy(0.25);
    expect(result).toBe('15 minutes');
  });

  it('should format exactly 1 hour', () => {
    const result = formatLifeEnergy(1);
    expect(result).toBe('1 hour');
  });

  it('should format 1-24 hours with hours and minutes (5h 30m)', () => {
    const result = formatLifeEnergy(5.5);
    expect(result).toBe('5h 30m');
  });

  it('should format exact hours without minutes (3 hours)', () => {
    const result = formatLifeEnergy(3);
    expect(result).toBe('3 hours');
  });

  it('should format 2 hours (plural)', () => {
    const result = formatLifeEnergy(2);
    expect(result).toBe('2 hours');
  });

  it('should format > 24 hours as work days (32 hours = 4 work days)', () => {
    const result = formatLifeEnergy(32);
    expect(result).toBe('4 work days');
  });

  it('should format > 24 hours as work days (24 hours = 3 work days)', () => {
    const result = formatLifeEnergy(24);
    expect(result).toBe('3 work days');
  });

  it('should format days with remaining hours (28 hours = 3 days 4h)', () => {
    const result = formatLifeEnergy(28);
    expect(result).toBe('3 days 4h');
  });

  it('should format days with remaining hours (25 hours = 3 days 1h)', () => {
    const result = formatLifeEnergy(25);
    expect(result).toBe('3 days 1h');
  });

  it('should handle negative hours by returning 0 minutes', () => {
    const result = formatLifeEnergy(-5);
    expect(result).toBe('0 minutes');
  });

  it('should handle singular minute (1 minute)', () => {
    const result = formatLifeEnergy(1 / 60);
    expect(result).toBe('1 minute');
  });

  it('should handle singular hour (1 hour)', () => {
    const result = formatLifeEnergy(1);
    expect(result).toBe('1 hour');
  });

  it('should handle singular work day (1 work day)', () => {
    const result = formatLifeEnergy(24);
    expect(result).toBe('3 work days');
  });

  it('should format hours under 24 as hours and minutes (8 hours)', () => {
    const result = formatLifeEnergy(8);
    expect(result).toBe('8 hours');
  });

  it('should handle zero hours', () => {
    const result = formatLifeEnergy(0);
    expect(result).toBe('0 minutes');
  });

  it('should round minutes properly (0.75 hours = 45 minutes)', () => {
    const result = formatLifeEnergy(0.75);
    expect(result).toBe('45 minutes');
  });

  it('should round to nearest minute when close (5.008333 hours = 5h 1m)', () => {
    const result = formatLifeEnergy(5 + 1 / 60);
    expect(result).toBe('5h 1m');
  });
});

describe('formatDollarsAsLifeEnergy', () => {
  it('should combine conversion and formatting ($100 at $20/hr)', () => {
    const result = formatDollarsAsLifeEnergy(100, 20);
    expect(result).toBe('5 hours');
  });

  it('should handle fractional hours ($50 at $20/hr = 2.5 hours = 2h 30m)', () => {
    const result = formatDollarsAsLifeEnergy(50, 20);
    expect(result).toBe('2h 30m');
  });

  it('should handle small amounts ($10 at $20/hr = 0.5 hours = 30 minutes)', () => {
    const result = formatDollarsAsLifeEnergy(10, 20);
    expect(result).toBe('30 minutes');
  });

  it('should handle large amounts ($500 at $20/hr = 25 hours = 3 days 1h)', () => {
    const result = formatDollarsAsLifeEnergy(500, 20);
    expect(result).toBe('3 days 1h');
  });

  it('should handle zero wage gracefully', () => {
    const result = formatDollarsAsLifeEnergy(100, 0);
    expect(result).toBe('0 minutes');
  });

  it('should handle negative dollars gracefully', () => {
    const result = formatDollarsAsLifeEnergy(-50, 20);
    expect(result).toBe('0 minutes');
  });
});
