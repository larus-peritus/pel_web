/**
 * Format a number with Icelandic thousands separator (period)
 * Explicitly replaces commas with periods to ensure consistent formatting
 */
function formatWithIcelandicSeparator(amount: number): string {
  const rounded = Math.round(amount);
  // Use en-US to get comma separator, then replace with period for Icelandic
  const withCommas = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
  return withCommas.replace(/,/g, '.');
}

/**
 * Format a number as Icelandic króna (ISK)
 * Format: 50.000 kr (no decimals, period as thousands separator)
 */
export function formatCurrency(amount: number): string {
  return `${formatWithIcelandicSeparator(amount)} kr`;
}

/**
 * Format a number as monthly ISK amount
 * Format: 50.000 kr/mán (no decimals, period as thousands separator)
 */
export function formatMonthlyCurrency(amount: number): string {
  return `${formatWithIcelandicSeparator(amount)} kr/mán`;
}

/**
 * Format a number as hourly ISK amount
 * Format: 3.000 kr/klst
 */
export function formatHourlyCurrency(amount: number): string {
  return `${formatWithIcelandicSeparator(amount)} kr/klst`;
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with Icelandic formatting (period as thousands separator)
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (decimals === 0) {
    return formatWithIcelandicSeparator(value);
  }

  // Format with decimals using Icelandic locale
  return new Intl.NumberFormat('is-IS', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format hours with Icelandic text
 * Format: 1.234 klukkustundir
 */
export function formatHours(hours: number): string {
  return `${formatNumber(hours, 1)} klukkustundir`;
}

/**
 * Format work-weeks with Icelandic text
 * Format: 30,9 vinnuvikur
 */
export function formatWorkWeeks(weeks: number): string {
  return `${formatNumber(weeks, 1)} vinnuvikur`;
}

/**
 * Format years with Icelandic text
 * Format: 2,3 ár
 */
export function formatYears(years: number): string {
  return `${formatNumber(years, 1)} ár`;
}

/**
 * Format weeks with Icelandic text
 * Format: 4,3 vikur
 */
export function formatWeeks(weeks: number): string {
  return `${formatNumber(weeks, 1)} vikur`;
}

/**
 * Format months with Icelandic text
 * Format: 8,5 mánuðir
 */
export function formatMonths(months: number): string {
  const formatted = formatNumber(months, 1);
  // Use correct plural form
  const unit = months === 1 ? 'mánuður' : 'mánuðir';
  return `${formatted} ${unit}`;
}
