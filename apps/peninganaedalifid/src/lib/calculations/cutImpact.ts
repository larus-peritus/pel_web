/**
 * Calculation functions for the "Cut 10.000 kr" Impact Cards feature
 * All functions are pure (no side effects)
 */

import type {
  CategoryDefinition,
  CategoryImpact,
  FIDateShift,
  FIInputs,
  ImpactLevel,
  LifeEnergyMetrics,
  SortOrder,
} from '@/types/cutImpact';

/**
 * Calculate life energy reclaimed by cutting spending
 */
export function calculateLifeEnergy(
  monthlyCutAmount: number,
  actualHourlyWage: number
): LifeEnergyMetrics {
  if (actualHourlyWage <= 0) {
    return { hoursPerMonth: 0, hoursPerYear: 0, daysPerYear: null };
  }

  const hoursPerMonth = monthlyCutAmount / actualHourlyWage;
  const hoursPerYear = hoursPerMonth * 12;
  const daysPerYear = hoursPerYear >= 24 ? hoursPerYear / 24 : null;

  return {
    hoursPerMonth,
    hoursPerYear,
    daysPerYear,
  };
}

/**
 * Calculate future value of monthly savings at compound interest
 *
 * FV = PMT × ((1 + r)^n - 1) / r
 *
 * @param monthlyAmount - Amount saved per month (ISK)
 * @param years - Number of years (e.g., 10 or 20)
 * @param annualRate - Annual return rate (default 0.07 for 7%)
 */
export function calculateFutureValue(
  monthlyAmount: number,
  years: number,
  annualRate: number = 0.07
): number {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    // No growth
    return monthlyAmount * months;
  }

  const futureValue =
    monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return Math.round(futureValue);
}

/**
 * Determine impact level based on months saved
 */
function getImpactLevel(months: number): ImpactLevel {
  if (months >= 36) return 'very-high'; // 3+ years
  if (months >= 12) return 'high'; // 1-3 years
  if (months >= 3) return 'moderate'; // 3-12 months
  if (months >= 1) return 'low'; // 1-3 months
  return 'none'; // < 1 month
}

/**
 * Calculate how much earlier FI date is reached by cutting spending
 *
 * @param monthlyCutAmount - Amount cut per month (ISK)
 * @param fiInputs - FI planning inputs
 */
export function calculateFIDateShift(
  monthlyCutAmount: number,
  fiInputs: FIInputs
): FIDateShift | null {
  const { savingsRate, fiNumber, currentNetWorth, grossAnnualIncome } = fiInputs;

  // Validate inputs
  if (
    savingsRate <= 0 ||
    fiNumber <= 0 ||
    currentNetWorth < 0 ||
    grossAnnualIncome <= 0
  ) {
    return null;
  }

  // Current annual savings
  const currentAnnualSavings = grossAnnualIncome * savingsRate;

  // New annual savings with cut
  const annualCut = monthlyCutAmount * 12;
  const newAnnualSavings = currentAnnualSavings + annualCut;

  // Amount needed to reach FI
  const amountNeeded = fiNumber - currentNetWorth;

  if (amountNeeded <= 0) {
    // Already at FI
    return { months: 0, impactLevel: 'none' };
  }

  // Years to FI (simplified linear model)
  const yearsToFICurrent = amountNeeded / currentAnnualSavings;
  const yearsToFIWithCut = amountNeeded / newAnnualSavings;

  // Date shift
  const yearsSaved = yearsToFICurrent - yearsToFIWithCut;
  const monthsSaved = Math.round(yearsSaved * 12);

  // Determine impact level
  const impactLevel = getImpactLevel(monthsSaved);

  return {
    months: Math.max(0, monthsSaved),
    impactLevel,
  };
}

/**
 * Calculate all impact metrics for a category
 */
export function calculateCategoryImpact(
  category: CategoryDefinition,
  cutAmount: number,
  actualHourlyWage: number,
  fiInputs?: FIInputs
): CategoryImpact {
  const lifeEnergy = calculateLifeEnergy(cutAmount, actualHourlyWage);
  const futureValue10 = calculateFutureValue(cutAmount, 10);
  const futureValue20 = calculateFutureValue(cutAmount, 20);

  const fiDateShift = fiInputs ? calculateFIDateShift(cutAmount, fiInputs) : null;

  return {
    ...category,
    lifeEnergy,
    futureValue10,
    futureValue20,
    fiDateShift,
  };
}

/**
 * Calculate impacts for all categories
 */
export function calculateAllCategoryImpacts(
  categories: CategoryDefinition[],
  cutAmount: number,
  actualHourlyWage: number,
  fiInputs?: FIInputs
): CategoryImpact[] {
  return categories.map((category) =>
    calculateCategoryImpact(category, cutAmount, actualHourlyWage, fiInputs)
  );
}

/**
 * Sort categories by specified order
 */
export function sortCategoryImpacts(
  impacts: CategoryImpact[],
  sortOrder: SortOrder
): CategoryImpact[] {
  const sorted = [...impacts];

  switch (sortOrder) {
    case 'fi-impact':
      sorted.sort((a, b) => {
        const aMonths = a.fiDateShift?.months ?? -1;
        const bMonths = b.fiDateShift?.months ?? -1;
        return bMonths - aMonths; // Descending
      });
      break;

    case 'life-energy':
      sorted.sort(
        (a, b) => b.lifeEnergy.hoursPerYear - a.lifeEnergy.hoursPerYear
      );
      break;

    case 'future-value':
      sorted.sort((a, b) => b.futureValue20 - a.futureValue20);
      break;

    case 'alphabetical':
      sorted.sort((a, b) => a.nameIs.localeCompare(b.nameIs, 'is'));
      break;
  }

  return sorted;
}

/**
 * Get visual indicator for impact level
 */
export function getImpactIndicator(level: ImpactLevel): {
  bars: string;
  label: string;
} {
  const indicators = {
    'very-high': { bars: '●●●●●●●●●●', label: 'Mjög mikil áhrif' },
    high: { bars: '●●●●●●●○○○', label: 'Mikil áhrif' },
    moderate: { bars: '●●●●●○○○○○', label: 'Miðlungs áhrif' },
    low: { bars: '●●○○○○○○○○', label: 'Lítil áhrif' },
    none: { bars: '○○○○○○○○○○', label: 'Minni áhrif' },
  };
  return indicators[level];
}

/**
 * Get gradient CSS class for impact level
 */
export function getGradientClass(level: ImpactLevel): string {
  const gradients = {
    'very-high': 'bg-gradient-to-br from-green-500 to-green-700',
    high: 'bg-gradient-to-br from-blue-500 to-green-600',
    moderate: 'bg-gradient-to-br from-blue-500 to-blue-700',
    low: 'bg-gradient-to-br from-slate-500 to-slate-600',
    none: 'bg-gradient-to-br from-slate-400 to-slate-500',
  };
  return gradients[level];
}

/**
 * Format months in Icelandic
 */
export function formatMonths(months: number): string {
  if (months < 1) return 'Minni áhrif';
  if (months < 12) return `${months} mánuðum fyrr`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ár${years > 1 ? 'um' : 'i'} fyrr`;
  }
  return `${years} ár${years > 1 ? 'um' : 'i'} og ${remainingMonths} mánuðum fyrr`;
}
