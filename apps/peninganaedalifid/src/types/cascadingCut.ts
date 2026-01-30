/**
 * TypeScript types for the Cascading Expense Cut Calculator
 *
 * This calculator uses actual expense data with priority-based cascading cuts.
 * When a target cut amount is set, it allocates cuts starting from the highest
 * priority category, cascading to the next when a category is fully cut.
 */

import type { LifeEnergyMetrics, FIDateShift, ImpactLevel, FIInputs } from './cutImpact';

/**
 * Cut status for a category after cascade allocation
 */
export type CutStatus = 'fully-cut' | 'partially-cut' | 'untouched';

/**
 * A category with its expense amount and cut priority
 */
export interface CascadingCutCategory {
  id: string; // Category ID from expense baseline (e.g., 'husnaedi', 'matur')
  name: string; // Icelandic display name
  icon: string; // Emoji icon
  expenseAmount: number; // Monthly expense in ISK (from expense baseline)
  priority: number; // Cut priority (1 = cut first, higher = cut later)
  cutAmount: number; // ISK amount to be cut (calculated)
  cutPercentage: number; // Percentage of category being cut (0-100)
  status: CutStatus; // Visual status indicator
}

/**
 * Result of cascade cut allocation
 */
export interface CascadingCutResult {
  categories: CascadingCutCategory[]; // Categories with allocated cuts
  targetAmount: number; // Requested cut amount
  allocatedAmount: number; // Actually allocated (may be less if total expenses < target)
  unallocatedAmount: number; // Remaining if target > total expenses
  totalExpenses: number; // Sum of all category expenses
}

/**
 * Aggregated impact from all cascading cuts
 */
export interface CascadingCutImpact {
  // Total cut amount
  totalCutAmount: number;

  // Life energy metrics (hours saved)
  lifeEnergy: LifeEnergyMetrics;

  // Future value projections
  futureValue10: number; // ISK after 10 years at 7%
  futureValue20: number; // ISK after 20 years at 7%

  // FI impact (may be null if FI inputs not available)
  fiDateShift: FIDateShift | null;
}

/**
 * Complete cascading cut calculator state
 */
export interface CascadingCutState {
  categories: CascadingCutCategory[];
  targetAmount: number; // Target monthly cut amount in ISK
  lastUpdated: string; // ISO timestamp
}

/**
 * Settings persisted to localStorage
 */
export interface CascadingCutSettings {
  targetAmount: number; // ISK target cut amount
  categoryPriorities: { id: string; priority: number }[]; // User-defined priorities
  lastUpdated: string; // ISO timestamp
}

// Re-export types needed from cutImpact for convenience
export type { LifeEnergyMetrics, FIDateShift, ImpactLevel, FIInputs };
