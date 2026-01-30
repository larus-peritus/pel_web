/**
 * Subscription calculations for the Subscription Burn Meter
 * Calculates life energy cost and FI impact of recurring subscriptions
 */

import type {
  Subscription,
  SubscriptionCategory,
  SubscriptionSummary,
} from '@/types/calculator';
import { dollarsToLifeEnergy } from './lifeEnergy';

/**
 * Category labels in Icelandic
 */
export const SUBSCRIPTION_CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  streaming: 'Streymi',
  software: 'Hugbúnaður',
  fitness: 'Líkamsrækt',
  news: 'Fréttir og tímarit',
  gaming: 'Tölvuleikir',
  other: 'Annað',
};

/**
 * Calculate future value of monthly savings invested at a given rate
 * Uses compound interest formula: FV = PMT × ((1 + r)^n - 1) / r
 *
 * @param monthlySavings - Amount saved per month
 * @param annualRate - Annual interest rate (e.g., 0.07 for 7%)
 * @param years - Number of years
 * @returns Future value
 */
export function calculateFutureValue(
  monthlySavings: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlySavings * months;
  }

  return monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

/**
 * Calculate subscription summary including life energy and FI impact
 *
 * @param subscriptions - List of subscriptions
 * @param actualHourlyWage - User's actual hourly wage (from main calculator)
 * @param annualReturnRate - Expected annual return rate (default 7%)
 * @returns SubscriptionSummary with all calculations
 */
export function calculateSubscriptionSummary(
  subscriptions: Subscription[],
  actualHourlyWage: number,
  annualReturnRate: number = 0.07
): SubscriptionSummary {
  // Only count active subscriptions
  const activeSubscriptions = subscriptions.filter((s) => s.isActive);

  // Calculate totals
  const totalMonthly = activeSubscriptions.reduce(
    (sum, sub) => sum + sub.monthlyCost,
    0
  );
  const totalYearly = totalMonthly * 12;

  // Calculate life energy cost
  const lifeEnergyHoursPerMonth =
    actualHourlyWage > 0 ? dollarsToLifeEnergy(totalMonthly, actualHourlyWage) : 0;
  const lifeEnergyHoursPerYear = lifeEnergyHoursPerMonth * 12;

  // Calculate future value if invested instead
  const futureValueIn10Years = calculateFutureValue(
    totalMonthly,
    annualReturnRate,
    10
  );
  const futureValueIn20Years = calculateFutureValue(
    totalMonthly,
    annualReturnRate,
    20
  );

  // Group by category
  const categoryTotals = new Map<
    SubscriptionCategory,
    { total: number; count: number }
  >();

  for (const sub of activeSubscriptions) {
    const existing = categoryTotals.get(sub.category) || { total: 0, count: 0 };
    categoryTotals.set(sub.category, {
      total: existing.total + sub.monthlyCost,
      count: existing.count + 1,
    });
  }

  // Convert to array with labels
  const byCategory = Array.from(categoryTotals.entries())
    .map(([category, data]) => ({
      category,
      label: SUBSCRIPTION_CATEGORY_LABELS[category],
      totalMonthly: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.totalMonthly - a.totalMonthly); // Sort by amount descending

  return {
    totalMonthly,
    totalYearly,
    lifeEnergyHoursPerMonth,
    lifeEnergyHoursPerYear,
    futureValueIn10Years,
    futureValueIn20Years,
    byCategory,
  };
}

/**
 * Generate a unique ID for a new subscription
 */
export function generateSubscriptionId(): string {
  return `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Common subscription presets for quick entry (Icelandic market)
 */
export const COMMON_SUBSCRIPTIONS: Omit<Subscription, 'id' | 'isActive'>[] = [
  // Streaming
  { name: 'Netflix', monthlyCost: 2290, category: 'streaming' },
  { name: 'Spotify', monthlyCost: 1399, category: 'streaming' },
  { name: 'Disney+', monthlyCost: 1290, category: 'streaming' },
  { name: 'HBO Max', monthlyCost: 1790, category: 'streaming' },
  { name: 'Amazon Prime', monthlyCost: 990, category: 'streaming' },
  { name: 'YouTube Premium', monthlyCost: 1590, category: 'streaming' },
  { name: 'Apple TV+', monthlyCost: 990, category: 'streaming' },
  { name: 'Síminn Sport', monthlyCost: 2990, category: 'streaming' },

  // Software
  { name: 'iCloud', monthlyCost: 149, category: 'software' },
  { name: 'Google One', monthlyCost: 299, category: 'software' },
  { name: 'Microsoft 365', monthlyCost: 1099, category: 'software' },
  { name: 'Adobe Creative Cloud', monthlyCost: 7990, category: 'software' },
  { name: 'Dropbox', monthlyCost: 1599, category: 'software' },

  // Fitness
  { name: 'World Class', monthlyCost: 9990, category: 'fitness' },
  { name: 'Fítness', monthlyCost: 6990, category: 'fitness' },
  { name: 'Strava', monthlyCost: 990, category: 'fitness' },

  // News
  { name: 'Morgunblaðið', monthlyCost: 3990, category: 'news' },
  { name: 'Vísir Premium', monthlyCost: 1990, category: 'news' },
  { name: 'DV', monthlyCost: 2490, category: 'news' },
  { name: 'The Reykjavik Grapevine', monthlyCost: 990, category: 'news' },

  // Gaming
  { name: 'PlayStation Plus', monthlyCost: 1290, category: 'gaming' },
  { name: 'Xbox Game Pass', monthlyCost: 1490, category: 'gaming' },
  { name: 'Nintendo Switch Online', monthlyCost: 490, category: 'gaming' },
];
