/**
 * Childcare & Education Cost Calculator
 * Pure calculation functions for childcare expenses
 */

import type {
  ChildcareItem,
  ChildcareSummary,
  ChildcareCategory,
  ChildcareDetails,
} from '@/types/childcare';
import { CHILDCARE_CATEGORY_LABELS } from '@/types/childcare';

/**
 * Generate unique ID for childcare item
 */
export function generateChildcareId(): string {
  return `childcare_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate university savings using Future Value formula
 *
 * FV = PMT × ((1 + r)^n - 1) / r
 * Solve for PMT: PMT = FV × r / ((1 + r)^n - 1)
 *
 * @param details University savings details
 * @returns Total cost, months until college, and monthly payment needed
 */
export function calculateUniversitySavings(
  details: Required<
    Pick<
      ChildcareDetails,
      'currentAge' | 'collegeAge' | 'costPerYear' | 'yearsInCollege' | 'expectedReturn'
    >
  >
): {
  totalCost: number;
  monthsUntilCollege: number;
  monthlyPaymentNeeded: number;
} {
  const { currentAge, collegeAge, costPerYear, yearsInCollege, expectedReturn } =
    details;

  // Validate ages
  if (currentAge >= collegeAge) {
    return {
      totalCost: costPerYear * yearsInCollege,
      monthsUntilCollege: 0,
      monthlyPaymentNeeded: 0,
    };
  }

  // Calculate total cost
  const totalCost = costPerYear * yearsInCollege;

  // Calculate months until college
  const monthsUntilCollege = (collegeAge - currentAge) * 12;

  // If no months until college, no monthly payment needed
  if (monthsUntilCollege <= 0) {
    return {
      totalCost,
      monthsUntilCollege: 0,
      monthlyPaymentNeeded: 0,
    };
  }

  // Monthly return rate
  const monthlyReturn = expectedReturn / 12;

  // If no expected return, simple division
  if (expectedReturn === 0 || monthlyReturn === 0) {
    return {
      totalCost,
      monthsUntilCollege,
      monthlyPaymentNeeded: totalCost / monthsUntilCollege,
    };
  }

  // Future Value formula solved for PMT
  // PMT = FV × r / ((1 + r)^n - 1)
  const monthlyPaymentNeeded =
    (totalCost * monthlyReturn) / (Math.pow(1 + monthlyReturn, monthsUntilCollege) - 1);

  return {
    totalCost,
    monthsUntilCollege,
    monthlyPaymentNeeded,
  };
}

/**
 * Calculate childcare summary from items
 *
 * @param items Array of childcare items
 * @param actualHourlyWage Actual hourly wage for life energy calculations
 * @returns Complete childcare summary with all calculations
 */
export function calculateChildcareSummary(
  items: ChildcareItem[],
  actualHourlyWage: number
): ChildcareSummary {
  // If no items, return empty summary
  if (items.length === 0) {
    return {
      totalMonthlyAverage: 0,
      totalYearly: 0,
      lifeEnergyHoursPerMonth: 0,
      lifeEnergyHoursPerYear: 0,
      byCategory: [],
    };
  }

  // Calculate total yearly cost for each item
  const itemsWithYearlyCost = items.map((item) => ({
    ...item,
    yearlyCost: item.monthlyCost * item.monthsPerYear * item.numberOfChildren,
  }));

  // Sum total yearly cost
  const totalYearly = itemsWithYearlyCost.reduce((sum, item) => sum + item.yearlyCost, 0);

  // Calculate monthly average
  const totalMonthlyAverage = totalYearly / 12;

  // Calculate life energy hours
  const lifeEnergyHoursPerMonth =
    actualHourlyWage > 0 ? totalMonthlyAverage / actualHourlyWage : 0;
  const lifeEnergyHoursPerYear =
    actualHourlyWage > 0 ? totalYearly / actualHourlyWage : 0;

  // Group by category
  const categoryMap = new Map<
    ChildcareCategory,
    {
      totalYearly: number;
      count: number;
    }
  >();

  itemsWithYearlyCost.forEach((item) => {
    const existing = categoryMap.get(item.category) || {
      totalYearly: 0,
      count: 0,
    };
    categoryMap.set(item.category, {
      totalYearly: existing.totalYearly + item.yearlyCost,
      count: existing.count + 1,
    });
  });

  // Convert to array and add labels
  const byCategory = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      label: CHILDCARE_CATEGORY_LABELS[category],
      totalYearly: data.totalYearly,
      totalMonthly: data.totalYearly / 12,
      count: data.count,
    }))
    // Sort by yearly cost (highest first)
    .sort((a, b) => b.totalYearly - a.totalYearly);

  // Calculate university savings if there are any university items
  let universitySavings: ChildcareSummary['universitySavings'];
  const universityItems = items.filter((item) => item.category === 'university');

  if (universityItems.length > 0) {
    // Use the first university item for savings calculation
    const firstUniversityItem = universityItems[0];
    const details = firstUniversityItem.details;

    if (
      details?.currentAge !== undefined &&
      details?.collegeAge !== undefined &&
      details?.costPerYear !== undefined &&
      details?.yearsInCollege !== undefined &&
      details?.expectedReturn !== undefined
    ) {
      universitySavings = calculateUniversitySavings({
        currentAge: details.currentAge,
        collegeAge: details.collegeAge,
        costPerYear: details.costPerYear,
        yearsInCollege: details.yearsInCollege,
        expectedReturn: details.expectedReturn,
      });
    }
  }

  return {
    totalMonthlyAverage,
    totalYearly,
    lifeEnergyHoursPerMonth,
    lifeEnergyHoursPerYear,
    byCategory,
    universitySavings,
  };
}

/**
 * Common childcare items for quick selection (Icelandic context)
 */
export const COMMON_CHILDCARE_ITEMS: Omit<ChildcareItem, 'id'>[] = [
  // Daycare
  {
    category: 'daycare',
    name: 'Leikskóli sveitarfélags',
    monthlyCost: 30000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { daycareType: 'municipal' },
  },
  {
    category: 'daycare',
    name: 'Leikskóli einkarekinn',
    monthlyCost: 60000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { daycareType: 'private' },
  },

  // Afterschool
  {
    category: 'afterschool',
    name: 'Frístund (vetur)',
    monthlyCost: 25000,
    monthsPerYear: 9,
    numberOfChildren: 1,
    details: { summerMonthsActive: false },
  },
  {
    category: 'afterschool',
    name: 'Frístund (heilt ár)',
    monthlyCost: 25000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { summerMonthsActive: true },
  },

  // Activities
  {
    category: 'activities',
    name: 'Tónlistarskóli',
    monthlyCost: 15000,
    monthsPerYear: 9,
    numberOfChildren: 1,
    details: { activityType: 'Tónlist' },
  },
  {
    category: 'activities',
    name: 'Íþróttir (knattspyrna, handbolti)',
    monthlyCost: 10000,
    monthsPerYear: 10,
    numberOfChildren: 1,
    details: { activityType: 'Íþróttir' },
  },
  {
    category: 'activities',
    name: 'Sund',
    monthlyCost: 8000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { activityType: 'Sund' },
  },
  {
    category: 'activities',
    name: 'Dans',
    monthlyCost: 12000,
    monthsPerYear: 9,
    numberOfChildren: 1,
    details: { activityType: 'Dans' },
  },

  // Tutoring
  {
    category: 'tutoring',
    name: 'Einkakennsla (stærðfræði)',
    monthlyCost: 32000, // 8000 kr/klst × 4 klst
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: {
      hourlyRate: 8000,
      hoursPerMonth: 4,
    },
  },
];
