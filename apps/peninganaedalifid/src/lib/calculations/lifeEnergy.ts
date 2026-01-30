/**
 * Life Energy Calculation Functions
 *
 * Life energy is the concept from "Your Money or Your Life" -
 * every dollar you spend represents time from your life.
 * These functions help convert money to time and format it human-readably.
 */

/**
 * Convert dollars to life energy hours
 * @param dollars - The dollar amount to convert
 * @param actualWage - The actual hourly wage (after accounting for expenses/time)
 * @returns Number of hours of life energy this amount represents
 */
export function dollarsToLifeEnergy(
  dollars: number,
  actualWage: number
): number {
  if (actualWage <= 0) return 0;
  if (dollars < 0) return 0;
  return dollars / actualWage;
}

/**
 * Format life energy as human-readable string (Icelandic)
 * Adapts format based on duration:
 * - < 1 hour: shows minutes
 * - 1-24 hours: shows hours and minutes
 * - > 24 hours: shows work days (8-hour days) and hours
 *
 * @param hours - Number of hours to format
 * @returns Human-readable string like "45 mínútur", "3 klst 30 mín", or "2 vinnudagar 4 klst"
 */
export function formatLifeEnergy(hours: number): string {
  if (hours < 0) return '0 mínútur';

  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} ${minutes === 1 ? 'mínúta' : 'mínútur'}`;
  }

  if (hours < 24) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} ${wholeHours === 1 ? 'klukkustund' : 'klukkustundir'}`;
    }
    return `${wholeHours} klst ${minutes} mín`;
  }

  // For larger amounts, show as work days (8-hour days)
  const days = Math.floor(hours / 8);
  const remainingHours = Math.round(hours % 8);
  if (remainingHours === 0) {
    return `${days} ${days === 1 ? 'vinnudagur' : 'vinnudagar'}`;
  }
  return `${days} ${days === 1 ? 'dagur' : 'dagar'} ${remainingHours} klst`;
}

/**
 * Convert dollars to formatted life energy string
 * Convenience function combining dollarsToLifeEnergy and formatLifeEnergy
 *
 * @param dollars - The dollar amount to convert
 * @param actualWage - The actual hourly wage
 * @returns Formatted string like "This costs 3h 45m of your life energy"
 */
export function formatDollarsAsLifeEnergy(
  dollars: number,
  actualWage: number
): string {
  const hours = dollarsToLifeEnergy(dollars, actualWage);
  return formatLifeEnergy(hours);
}
