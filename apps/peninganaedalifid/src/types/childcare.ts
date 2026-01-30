/**
 * TypeScript types for the Childcare & Education Cost Calculator
 */

// ============================================================================
// CHILDCARE & EDUCATION COST CALCULATOR TYPES
// ============================================================================

/**
 * Childcare/education category types
 */
export type ChildcareCategory =
  | 'daycare' // Leikskóli
  | 'afterschool' // Frístund
  | 'activities' // Tónlistarskóli, íþróttir
  | 'tutoring' // Einkakennsla
  | 'university'; // Háskólasparnaður

/**
 * Icelandic labels for childcare categories
 */
export const CHILDCARE_CATEGORY_LABELS: Record<ChildcareCategory, string> = {
  daycare: 'Leikskóli',
  afterschool: 'Frístund',
  activities: 'Tónlistarskóli og tímar',
  tutoring: 'Einkakennsla',
  university: 'Háskólasparnaður',
};

/**
 * Additional details for childcare items (category-specific)
 */
export interface ChildcareDetails {
  // For daycare
  daycareType?: 'municipal' | 'private' | 'other';

  // For afterschool
  summerMonthsActive?: boolean; // Whether frístund is active in summer

  // For activities
  activityType?: string; // e.g., "Píanó", "Fótbolti"

  // For tutoring
  hourlyRate?: number; // Cost per hour
  hoursPerMonth?: number; // Number of hours per month

  // For university savings
  currentAge?: number; // Current age of child
  collegeAge?: number; // Age when starting college
  costPerYear?: number; // College cost per year
  yearsInCollege?: number; // Number of years in college
  expectedReturn?: number; // Expected return rate (0.03, 0.05, 0.07)
}

/**
 * Individual childcare/education expense item
 */
export interface ChildcareItem {
  id: string; // Unique ID (auto-generated)
  category: ChildcareCategory; // Category type
  name: string; // Name of item (e.g., "Leikskóli Kópavogi")
  monthlyCost: number; // Monthly cost in ISK
  monthsPerYear: number; // Number of months per year (9-12)
  numberOfChildren: number; // Number of children (1+)
  details?: ChildcareDetails; // Additional category-specific details
}

/**
 * Childcare/education cost summary with calculations
 */
export interface ChildcareSummary {
  totalMonthlyAverage: number; // Average monthly cost
  totalYearly: number; // Total yearly cost
  lifeEnergyHoursPerMonth: number; // Life energy hours per month
  lifeEnergyHoursPerYear: number; // Life energy hours per year
  // Breakdown by category
  byCategory: {
    category: ChildcareCategory;
    label: string; // Icelandic label
    totalYearly: number; // Total yearly for this category
    totalMonthly: number; // Average monthly for this category
    count: number; // Number of items in this category
  }[];
  // University savings details (if applicable)
  universitySavings?: {
    totalCost: number; // Total cost of college
    monthsUntilCollege: number; // Months until college starts
    monthlyPaymentNeeded: number; // Monthly savings needed
  };
}
