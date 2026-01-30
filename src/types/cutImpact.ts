/**
 * TypeScript types for the "Cut 10.000 kr" Impact Cards feature
 * Shows the impact of cutting monthly spending across different categories
 */

/**
 * Spending category definition
 */
export interface CategoryDefinition {
  id: string; // e.g., 'subscriptions'
  nameIs: string; // Icelandic name: 'Áskriftir'
  icon: string; // Emoji icon: '📺'
  examples: string; // Examples: 't.d. Netflix, Spotify, líkamsrækt'
}

/**
 * Life energy metrics
 */
export interface LifeEnergyMetrics {
  hoursPerMonth: number; // e.g., 5.3
  hoursPerYear: number; // e.g., 63.6
  daysPerYear: number | null; // e.g., 2.7 or null if < 24 hours
}

/**
 * Impact level for visual indicators
 */
export type ImpactLevel = 'very-high' | 'high' | 'moderate' | 'low' | 'none';

/**
 * FI date shift result
 */
export interface FIDateShift {
  months: number; // e.g., 8 (months earlier to FI)
  impactLevel: ImpactLevel; // Visual indicator level
}

/**
 * Complete category impact calculation
 */
export interface CategoryImpact extends CategoryDefinition {
  lifeEnergy: LifeEnergyMetrics;
  futureValue10: number; // ISK after 10 years at 7%
  futureValue20: number; // ISK after 20 years at 7%
  fiDateShift: FIDateShift | null; // null if FI inputs not available
}

/**
 * Sort order options
 */
export type SortOrder = 'fi-impact' | 'life-energy' | 'future-value' | 'alphabetical';

/**
 * Settings persisted to localStorage
 */
export interface CutImpactSettings {
  cutAmount: number; // ISK, e.g., 10000
  sortOrder: SortOrder; // e.g., 'fi-impact'
  lastUpdated: string; // ISO timestamp
}

/**
 * FI planning inputs (optional)
 */
export interface FIInputs {
  savingsRate: number; // 0-1, e.g., 0.3 for 30%
  fiNumber: number; // ISK, target FI nest egg
  currentNetWorth: number; // ISK, current assets
  grossAnnualIncome: number; // ISK, for FI date calculation
}
