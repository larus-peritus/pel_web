/**
 * Numeric Validation and Sanitization Utilities
 *
 * Provides functions to sanitize numeric inputs before they enter application state.
 * Prevents NaN, Infinity, and optionally negative values from corrupting calculations.
 *
 * @security This module addresses HIGH severity finding:
 *   "Missing Input Validation in State Update Functions"
 *   Prevents NaN, Infinity, and negative values from corrupting calculations.
 */

/**
 * Options for sanitizing a numeric value
 */
export interface SanitizeOptions {
  /** Minimum allowed value (default: -Infinity) */
  min?: number;
  /** Maximum allowed value (default: Infinity) */
  max?: number;
  /** Default value to use if input is invalid (default: 0) */
  defaultValue?: number;
  /** Whether to allow negative values (default: true) */
  allowNegative?: boolean;
}

/**
 * Sanitize a single numeric value
 *
 * Converts invalid values (NaN, Infinity, undefined, null) to a safe default.
 * Optionally clamps to min/max range and rejects negative values.
 *
 * @param value - The value to sanitize
 * @param options - Sanitization options
 * @returns A safe numeric value
 *
 * @example
 * sanitizeNumber(NaN) // returns 0
 * sanitizeNumber(Infinity) // returns 0
 * sanitizeNumber(-5, { allowNegative: false }) // returns 0
 * sanitizeNumber(150, { max: 100 }) // returns 100
 * sanitizeNumber(undefined, { defaultValue: 10 }) // returns 10
 */
export function sanitizeNumber(
  value: number | undefined | null,
  options: SanitizeOptions = {}
): number {
  const {
    min = -Infinity,
    max = Infinity,
    defaultValue = 0,
    allowNegative = true,
  } = options;

  // Handle undefined, null, NaN, or Infinity
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return defaultValue;
  }

  // Handle negative values if not allowed
  if (!allowNegative && value < 0) {
    return defaultValue;
  }

  // Clamp to range
  return Math.max(min, Math.min(max, value));
}

/**
 * Sanitize all numeric properties in an object
 *
 * Recursively sanitizes all number values in an object, leaving non-numeric
 * properties unchanged. Useful for sanitizing partial state updates.
 *
 * @param obj - Object with potential numeric properties
 * @param options - Default sanitization options for all numeric values
 * @returns Object with all numeric values sanitized
 *
 * @example
 * sanitizeNumericObject({ income: NaN, name: 'test' })
 * // returns { income: 0, name: 'test' }
 */
export function sanitizeNumericObject<T extends Record<string, unknown>>(
  obj: T,
  options: SanitizeOptions = {}
): T {
  const result = { ...obj };

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];

      if (typeof value === 'number') {
        // Sanitize numeric values
        (result as Record<string, unknown>)[key] = sanitizeNumber(value, options);
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively sanitize nested objects
        (result as Record<string, unknown>)[key] = sanitizeNumericObject(
          value as Record<string, unknown>,
          options
        );
      }
      // Leave non-numeric, non-object values unchanged
    }
  }

  return result;
}

/**
 * Sanitize financial values (ISK amounts)
 *
 * Specialized sanitizer for Icelandic Krona values:
 * - Rounds to whole numbers (ISK has no decimals)
 * - Rejects negative values by default
 * - Has a sensible maximum (10 billion ISK)
 *
 * @param value - The ISK amount to sanitize
 * @param options - Override default options
 * @returns A safe ISK value
 */
export function sanitizeISK(
  value: number | undefined | null,
  options: Partial<SanitizeOptions> = {}
): number {
  const sanitized = sanitizeNumber(value, {
    min: 0,
    max: 10_000_000_000, // 10 billion ISK max
    defaultValue: 0,
    allowNegative: false,
    ...options,
  });

  return Math.round(sanitized);
}

/**
 * Sanitize percentage values (0-100 or 0-1 scale)
 *
 * @param value - The percentage value to sanitize
 * @param scale - 'percent' for 0-100, 'decimal' for 0-1
 * @returns A safe percentage value
 */
export function sanitizePercentage(
  value: number | undefined | null,
  scale: 'percent' | 'decimal' = 'percent'
): number {
  const max = scale === 'percent' ? 100 : 1;

  return sanitizeNumber(value, {
    min: 0,
    max,
    defaultValue: 0,
    allowNegative: false,
  });
}

/**
 * Sanitize age values
 *
 * @param value - The age to sanitize
 * @returns A safe age value (0-120)
 */
export function sanitizeAge(value: number | undefined | null): number {
  return Math.round(
    sanitizeNumber(value, {
      min: 0,
      max: 120,
      defaultValue: 0,
      allowNegative: false,
    })
  );
}

/**
 * Sanitize hours values (for work hours, commute time, etc.)
 *
 * @param value - The hours to sanitize
 * @param maxHours - Maximum allowed hours (default: 168 = hours per week)
 * @returns A safe hours value
 */
export function sanitizeHours(
  value: number | undefined | null,
  maxHours: number = 168
): number {
  return sanitizeNumber(value, {
    min: 0,
    max: maxHours,
    defaultValue: 0,
    allowNegative: false,
  });
}

/**
 * Check if a value is a valid finite number
 *
 * @param value - Value to check
 * @returns true if value is a finite number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Sanitize IncomeInputs updates
 *
 * Specialized sanitizer for income-related fields.
 * All income values are stored yearly.
 */
export function sanitizeIncomeInputs<T extends Record<string, unknown>>(updates: T): T {
  const result = { ...updates };

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];

      if (typeof value === 'number') {
        switch (key) {
          case 'grossAnnualIncome':
          case 'additionalIncome':
            // Income values: non-negative ISK amounts
            (result as Record<string, unknown>)[key] = sanitizeISK(value);
            break;
          case 'workHoursPerWeek':
            // Work hours: 0-168 hours per week
            (result as Record<string, unknown>)[key] = sanitizeHours(value);
            break;
          case 'vacationDays':
            // Vacation days: 0-365 days per year
            (result as Record<string, unknown>)[key] = sanitizeNumber(value, {
              min: 0,
              max: 365,
              defaultValue: 0,
              allowNegative: false,
            });
            break;
          default:
            // Default: just ensure it's a valid number
            (result as Record<string, unknown>)[key] = sanitizeNumber(value);
        }
      }
    }
  }

  return result;
}

/**
 * Sanitize MoneyExpenses updates
 *
 * Specialized sanitizer for expense-related fields.
 * All expense values are stored yearly and must be non-negative.
 */
export function sanitizeMoneyExpenses<T extends Record<string, unknown>>(updates: T): T {
  const result = { ...updates };

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];

      if (typeof value === 'number') {
        // All money expense fields are non-negative ISK amounts
        (result as Record<string, unknown>)[key] = sanitizeISK(value);
      }
    }
  }

  return result;
}

/**
 * Sanitize TimeExpenses updates
 *
 * Specialized sanitizer for time-related expense fields.
 * All time values are weekly hours.
 */
export function sanitizeTimeExpenses<T extends Record<string, unknown>>(updates: T): T {
  const result = { ...updates };

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];

      if (typeof value === 'number') {
        // All time expense fields are weekly hours (0-168)
        (result as Record<string, unknown>)[key] = sanitizeHours(value);
      }
    }
  }

  return result;
}
