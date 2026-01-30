/**
 * Utility functions for savings goal calculations
 */

/**
 * Add months to a date
 * @param date - Starting date
 * @param months - Number of months to add
 * @returns New date with months added
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Round a number to a specific number of decimal places
 * @param num - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function roundToDecimal(num: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format ISK currency amount
 * @param amount - Amount in ISK
 * @returns Formatted string like "1.234.567 kr"
 */
export function formatISK(amount: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\./g, '.')
    .concat(' kr');
}

/**
 * Convert dollars (ISK) to life energy hours
 * @param amount - Amount in ISK
 * @param hourlyWage - Actual hourly wage in ISK
 * @returns Hours of life energy
 */
export function dollarsToLifeEnergy(amount: number, hourlyWage: number): number {
  if (hourlyWage <= 0) {
    return Infinity;
  }

  if (amount < 0) {
    return 0;
  }

  return amount / hourlyWage;
}
